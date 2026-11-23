// Smoke QA for the prototype using local Chrome via playwright-core.
//   node tests/qa-smoke.mjs [baseUrl] [outDir]
// Checks every rendered route in TH/EN: HTTP status, console/page errors,
// horizontal overflow, exactly one H1, images without alt, internal links,
// then runs the Home Finder flow and captures screenshots.

import { chromium } from 'playwright-core';
import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const BASE = (process.argv[2] || 'http://localhost:5174').replace(/\/$/, '');
const OUT = process.argv[3] || 'test-results/qa';
mkdirSync(OUT, { recursive: true });
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(existsSync);
const routes = JSON.parse(readFileSync('src/.routes.json', 'utf8')).filter((r) => r.key !== 'index')
  .map((r) => '/' + r.file.replace(/index\.html$/, ''));

const VIEWPORTS = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } };
const results = []; const fails = [];
const fail = (m) => { fails.push(m); console.log('FAIL', m); };

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch, deviceScaleFactor: vp.deviceScaleFactor || 1, reducedMotion: 'reduce' });
  for (const path of routes) {
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('requestfailed', (r) => errors.push(`requestfailed ${r.url()}`));
    const res = await page.goto(BASE + path, { waitUntil: 'networkidle' });
    const m = await page.evaluate(() => ({
      h1: document.querySelectorAll('h1').length,
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      noAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).length,
      brokenImgs: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.loading !== 'lazy').map((i) => i.currentSrc || i.src),
      links: [...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute('href').split('#')[0]).filter(Boolean),
      title: document.title, lang: document.documentElement.lang,
      hreflang: document.querySelectorAll('link[rel=alternate][hreflang]').length,
      canonical: !!document.querySelector('link[rel=canonical]'),
      ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => { try { JSON.parse(s.textContent); return true; } catch { return false; } }),
    }));
    const r = { vp: vpName, path, status: res.status(), errors, ...m, links: undefined };
    results.push(r);
    if (res.status() !== 200) fail(`${vpName} ${path} status ${res.status()}`);
    if (errors.length) fail(`${vpName} ${path} errors: ${errors.join(' | ').slice(0, 300)}`);
    if (m.h1 !== 1) fail(`${vpName} ${path} has ${m.h1} H1`);
    if (m.overflow) fail(`${vpName} ${path} horizontal overflow`);
    if (m.noAlt) fail(`${vpName} ${path} ${m.noAlt} img without alt`);
    if (m.brokenImgs.length) fail(`${vpName} ${path} broken images ${m.brokenImgs.join(', ')}`);
    if (m.hreflang !== 3 || !m.canonical) fail(`${vpName} ${path} hreflang/canonical missing`);
    if (m.ld.some((x) => !x)) fail(`${vpName} ${path} invalid JSON-LD`);
    for (const l of new Set(m.links)) if (!routes.includes(l) && !l.startsWith('/images/')) fail(`${vpName} ${path} links to unknown route ${l}`);
    if (['/th/', '/en/'].includes(path)) {
      // Scroll through the page so lazy images load before the full-page capture.
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } scrollTo(0, 0); });
      await page.waitForLoadState('networkidle');
      const lazyBroken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length);
      if (lazyBroken) fail(`${vpName} ${path} ${lazyBroken} images failed to load after scrolling`);
    }
    if (['/th/', '/en/'].includes(path)) await page.screenshot({ path: join(OUT, `${vpName}${path.replaceAll('/', '_')}full.png`), fullPage: true });
    await page.close();
  }

  // Home Finder flow: answer every question, expect results with reasons.
  for (const lang of ['th', 'en']) {
    const page = await ctx.newPage();
    await page.goto(`${BASE}/${lang}/#finder`, { waitUntil: 'networkidle' });
    const qs = await page.$$eval('[data-finder-form] fieldset', (f) => f.map((x) => x.dataset.q));
    // v2 flow: 4 steps (use, space, budget, optional priority). A click auto-advances;
    // if the step is still showing, press Next (the last step always needs Next).
    const picks = { use: 'second-home', space: '1', budget: 'lte-2m', priority: 'nature' };
    const visibleQ = () => page.evaluate(() => [...document.querySelectorAll('[data-q]')].find((f) => !f.hidden)?.dataset.q);
    for (const q of qs) {
      await page.locator(`[data-q="${q}"] input[value="${picks[q]}"]`).check();
      await page.waitForTimeout(400);
      if ((await visibleQ()) === q) await page.locator('[data-finder-next]').click();
    }
    const out = await page.locator('[data-finder-results]').innerText();
    const best = await page.locator('[data-finder-results] .result--best .result__name').innerText().catch(() => '');
    const reasons = (await page.locator('[data-finder-results] .result--best [data-result-why]').innerText().catch(() => '')).trim().length;
    const ok = /Unwind Series 1 Bed 2 Bath/.test(best) && reasons > 0 && out.length > 0;
    if (!ok) fail(`finder ${lang} ${vpName}: expected Unwind 1 Bed 2 Bath in results`);
    if (await page.locator('[data-finder-form]').isVisible()) fail(`finder ${lang} ${vpName}: form still visible after results`);
    // Keyboard: on a fresh load, the first Tab stop is the skip link.
    await page.goto(`${BASE}/${lang}/`, { waitUntil: 'networkidle' });
    await page.keyboard.press('Tab');
    if (!(await page.evaluate(() => document.activeElement?.classList.contains('skip-link')))) fail(`${vpName} ${lang}: first Tab stop is not the skip link`);
    // Mobile menu: opens as a modal dialog, Esc closes, focus returns to the toggle.
    if (vpName === 'mobile') {
      await page.locator('[data-menu-toggle]').click();
      if (!(await page.locator('#site-menu').isVisible())) fail(`mobile ${lang}: menu did not open`);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(100);
      if (await page.locator('#site-menu').isVisible()) fail(`mobile ${lang}: Esc did not close menu`);
      if (!(await page.evaluate(() => document.activeElement?.hasAttribute('data-menu-toggle')))) fail(`mobile ${lang}: focus not returned to menu toggle`);
    }
    await page.locator('[data-finder]').screenshot({ path: join(OUT, `${vpName}_${lang}_finder-results.png`) });
    await page.close();
  }
  await ctx.close();
}
await browser.close();
writeFileSync(join(OUT, 'results.json'), JSON.stringify({ base: BASE, routes: routes.length, fails, results }, null, 1));
console.log(`\n${routes.length} routes × 2 viewports checked · ${fails.length} failure(s)`);
process.exit(fails.length ? 1 : 0);
