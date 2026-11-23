// Contrast of text over photos and gradients, which axe cannot measure (it marks
// them "incomplete"). For each such text element: hide the text, screenshot what
// is behind it, and compare the text colour with the background at its 10th percentile.
//   node tests/a11y-overlay.mjs [baseUrl]
// Needs 4.5:1 (3:1 for large text: 24px+, or 18.66px+ bold).
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import { readFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const AXE = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const BASE = (process.argv[2] || 'http://localhost:5173').replace(/\/$/, '');
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(existsSync);
const PAGES = ['/th/', '/en/', '/th/homes/', '/th/projects/', '/th/contact/'];
const lum = (r, g, b) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
const fails = [];
const results = [];

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
for (const [vp, size] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  const ctx = await browser.newContext({ viewport: size, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  for (const path of PAGES) {
    const page = await ctx.newPage();
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.querySelectorAll('img[loading=lazy]').forEach((i) => { i.loading = 'eager'; }));
    await page.waitForTimeout(800);
    await page.addScriptTag({ content: AXE });
    const nodes = await page.evaluate(async () => {
      const res = await window.axe.run(document, { runOnly: ['color-contrast'], resultTypes: ['incomplete'] });
      const out = [];
      for (const v of res.incomplete) for (const n of v.nodes) {
        const key = n.any[0]?.data?.messageKey;
        if (!['bgImage', 'bgGradient', 'imgNode', 'bgOverlap', 'pseudoContent'].includes(key)) continue;
        out.push({ sel: n.target[0], key });
      }
      return out;
    });
    for (const { sel, key } of nodes) {
      const el = page.locator(sel).first();
      if (!(await el.count()) || !(await el.isVisible())) continue;
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
      const info = await el.evaluate((e) => {
        // Colour of the element that actually holds the text (a badge may style a child).
        const walker = document.createTreeWalker(e, NodeFilter.SHOW_TEXT, { acceptNode: (t) => (t.textContent.trim() ? 1 : 3) });
        const holder = walker.nextNode()?.parentElement ?? e;
        const cs = getComputedStyle(e);
        const tc = getComputedStyle(holder).color;
        const r = e.getBoundingClientRect();
        const size = parseFloat(cs.fontSize); const bold = parseInt(cs.fontWeight, 10) >= 700;
        e.dataset.a11yColor = cs.color;
        e.style.setProperty('color', 'transparent', 'important');
        e.querySelectorAll('*').forEach((c) => c.style.setProperty('color', 'transparent', 'important'));
        // A rotated card (the handover "polaroid") has a solid background of its own; its
        // bounding box would also catch the section behind the tilted corners.
        let solid = null;
        for (let a = e; a; a = a.parentElement) {
          const t = getComputedStyle(a).transform;
          if (t && t !== 'none' && !/^matrix\(1, 0, 0, 1,/.test(t)) { solid = getComputedStyle(a).backgroundColor; break; }
        }
        return { solid, color: tc, box: { x: r.x, y: r.y, width: r.width, height: r.height }, large: size >= 24 || (bold && size >= 18.66), text: e.textContent.trim().slice(0, 30) };
      });
      if (info.box.width < 2 || info.box.height < 2) continue;
      const png = await page.screenshot({ clip: info.box });
      await el.evaluate((e) => { e.style.removeProperty('color'); e.querySelectorAll('*').forEach((c) => c.style.removeProperty('color')); });
      let { data, info: im } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
      if (info.solid && !/rgba\(.*, 0\)$/.test(info.solid)) {
        const b = info.solid.match(/[\d.]+/g).map(Number);
        data = Buffer.from([b[0], b[1], b[2]]); im = { channels: 3 };
      }
      // rgb(r g b / a) or color(srgb r g b / a) with 0-1 channels.
      let m = info.color.match(/[\d.]+/g).map(Number);
      if (info.color.startsWith('color(')) m = [m[0] * 255, m[1] * 255, m[2] * 255, m[3]];
      const a = m[3] ?? 1;
      const L = [];
      for (let i = 0; i < data.length; i += im.channels) L.push([data[i], data[i + 1], data[i + 2]]);
      // Blend semi-transparent text over each pixel, then contrast vs that pixel.
      const cr = L.map(([r, g, b]) => ratio(lum(m[0] * a + r * (1 - a), m[1] * a + g * (1 - a), m[2] * a + b * (1 - a)), lum(r, g, b))).sort((x, y) => x - y);
      // 10th percentile: ignores hairlines and edge pixels but still catches busy photo areas.
      const worst = cr[Math.floor(cr.length * 0.1)];
      const need = info.large ? 3 : 4.5;
      const row = `${vp} ${path} ${sel.slice(0, 70)} "${info.text}" ${worst.toFixed(2)}:1 (needs ${need}, ${key})`;
      results.push(row);
      if (worst < need) { fails.push(row); console.log('FAIL', row); }
    }
    await page.close();
  }
  await ctx.close();
}
await browser.close();
console.log(`\nmeasured ${results.length} text-over-background elements`);
console.log(fails.length ? `${fails.length} below the WCAG 1.4.3 minimum` : 'All meet WCAG 1.4.3');
process.exit(fails.length ? 1 : 0);
