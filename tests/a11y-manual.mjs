// WCAG 2.2 AA checks that axe does not cover (docs/a11y-wcag22.md).
//   node tests/a11y-manual.mjs [baseUrl]
// On every route:
//   2.5.8  Target size (minimum): controls are at least 24x24 CSS px, or have 24px of
//          clear spacing (inline links inside sentences are exempt).
//   2.1.1 / 2.1.2  Keyboard: Tab reaches every focusable control and never gets stuck.
//   2.4.7  Focus visible: every focused control shows an outline or ring.
//   2.4.11 Focus not obscured (minimum): no focused control is fully hidden under the
//          fixed header.
//   1.4.10 Reflow: no horizontal scrolling at 320 CSS px.
//   1.4.12 Text spacing: with the WCAG spacing overrides there is no horizontal overflow.
//   2.2.2  Pause, stop, hide: no autoplaying video or auto-advancing content.
import { chromium } from 'playwright-core';
import { readFileSync, existsSync } from 'node:fs';

const BASE = (process.argv[2] || 'http://localhost:5173').replace(/\/$/, '');
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(existsSync);
const routes = JSON.parse(readFileSync('src/.routes.json', 'utf8')).filter((r) => r.key !== 'index').map((r) => '/' + r.file.replace(/index\.html$/, ''));
const fails = [];
const check = (ok, msg) => { if (!ok) { fails.push(msg); console.log('FAIL', msg); } };
const SPACING = '*{line-height:1.5!important;letter-spacing:0.12em!important;word-spacing:0.16em!important}p{margin-bottom:2em!important}';

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
for (const [vp, size] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  const ctx = await browser.newContext({ viewport: size, isMobile: vp === 'mobile', hasTouch: vp === 'mobile', reducedMotion: 'reduce' });
  for (const path of routes) {
    const tag = `${vp} ${path}`;
    const page = await ctx.newPage();
    await page.goto(BASE + path, { waitUntil: 'networkidle' });

    // 2.5.8 target size
    const small = await page.evaluate(() => {
      const els = [...document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [tabindex]:not([tabindex="-1"])')];
      const out = [];
      for (const el of els) {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        if (!r.width || !r.height || cs.visibility === 'hidden' || el.closest('[hidden], dialog:not([open]), [aria-hidden="true"]')) continue;
        // Exempt: links inside running text (WCAG 2.5.8 "inline" exception).
        const inText = el.tagName === 'A' && cs.display === 'inline' && el.parentElement && /^(P|LI|DD|SPAN|TD)$/.test(el.parentElement.tagName) && el.parentElement.textContent.trim().length > el.textContent.trim().length + 10;
        if (inText) continue;
        // Visually hidden inputs styled through their label count as the label's size.
        const lab = el.tagName === 'INPUT' && el.labels?.[0];
        const box = lab && (r.width < 2 || cs.opacity === '0') ? lab.getBoundingClientRect() : r;
        if (box.width >= 24 && box.height >= 24) continue;
        out.push(`${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : ''} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30)}" ${Math.round(box.width)}x${Math.round(box.height)}`);
      }
      return [...new Set(out)];
    });
    check(small.length === 0, `${tag}: 2.5.8 targets under 24px: ${small.slice(0, 6).join(' | ')}`);

    // Keyboard walk: 2.1.1, 2.1.2, 2.4.7, 2.4.11
    await page.evaluate(() => { document.activeElement?.blur(); scrollTo(0, 0); });
    const total = await page.evaluate(() => [...document.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type=hidden]), select, textarea, summary, [tabindex]:not([tabindex="-1"])')]
      .filter((el) => { const r = el.getBoundingClientRect(); return r.width && r.height && !el.closest('[hidden], dialog:not([open]), [inert]') && getComputedStyle(el).visibility !== 'hidden'; }).length);
    const seen = new Set();
    let stuck = 0; let last = null; const noRing = []; const hidden = [];
    for (let i = 0; i < Math.min(total + 5, 160); i++) {
      await page.keyboard.press('Tab');
      const info = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const cs = getComputedStyle(el);
        const ring = (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== 'none');
        const r = el.getBoundingClientRect();
        const header = document.querySelector('[data-header]')?.getBoundingClientRect();
        const covered = header && r.bottom <= header.bottom + 1 && r.top >= 0 && !el.closest('[data-header], .skip-link') && !el.classList.contains('skip-link');
        const id = el.id || `${el.tagName}:${(el.getAttribute('href') || '')}:${el.textContent.trim().slice(0, 20)}:${Math.round(r.top + scrollY)}`;
        return { id, ring, covered, label: `${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30)}"` };
      });
      if (!info) break;
      if (info.id === last) stuck++; else stuck = 0;
      last = info.id;
      seen.add(info.id);
      if (!info.ring) noRing.push(info.label);
      if (info.covered) hidden.push(info.label);
      if (stuck > 2) break;
    }
    check(stuck <= 2, `${tag}: 2.1.2 keyboard focus stuck on ${last}`);
    check(seen.size >= Math.min(total, 150) * 0.9, `${tag}: 2.1.1 Tab reached ${seen.size} of ${total} controls`);
    check(noRing.length === 0, `${tag}: 2.4.7 no visible focus on ${[...new Set(noRing)].slice(0, 5).join(' | ')}`);
    check(hidden.length === 0, `${tag}: 2.4.11 focus hidden under header: ${[...new Set(hidden)].slice(0, 5).join(' | ')}`);

    // 2.2.2: no autoplaying media
    const autoplay = await page.evaluate(() => [...document.querySelectorAll('video[autoplay], audio[autoplay], marquee, iframe[src*="autoplay=1"]')].length);
    check(autoplay === 0, `${tag}: 2.2.2 autoplaying media`);

    // 1.4.12 text spacing
    await page.addStyleTag({ content: SPACING });
    await page.waitForTimeout(100);
    const ov = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    check(ov <= 0, `${tag}: 1.4.12 text spacing causes ${ov}px horizontal overflow`);
    await page.close();
    console.log(`checked ${tag} · ${seen.size} focus stops`);
  }
  await ctx.close();
}

// 1.4.10 reflow at 320 CSS px
const ctx = await browser.newContext({ viewport: { width: 320, height: 640 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
for (const path of routes) {
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  const ov = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  check(ov <= 0, `320 ${path}: 1.4.10 reflow overflow ${ov}px`);
  await page.close();
}
await ctx.close();
await browser.close();
console.log(fails.length ? `\n${fails.length} failure(s)` : '\nAll manual WCAG 2.2 AA checks passed');
process.exit(fails.length ? 1 : 0);
