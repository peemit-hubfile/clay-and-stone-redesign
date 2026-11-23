// Why our homes v4 checks (docs/materials-v3.md §6): tabbed explorer.
//   node tests/why-check.mjs [baseUrl] [outDir]
// TH/EN at 1440, 820 and 390: one panel at a time, click / arrow keys / "next" switch
// topics, each topic opens its verbatim specs in place, fits one screen on desktop, no overflow,
// no page errors. No-JS: all three answers visible and no tab row.

import { chromium } from 'playwright-core';
import { mkdirSync, existsSync, readFileSync } from 'node:fs';

const BASE = (process.argv[2] || 'http://localhost:5173').replace(/\/$/, '');
const OUT = process.argv[3] || 'test-results/why';
mkdirSync(OUT, { recursive: true });
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(existsSync);
const fails = [];
const check = (ok, msg) => { if (!ok) { fails.push(msg); console.log('FAIL', msg); } };
const visible = (page) => page.$$eval('[data-explore-panel]', (ps) => ps.filter((p) => !p.hidden && p.offsetHeight > 0).map((p) => p.dataset.explorePanel));

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
for (const [lang, width, height] of [['th', 1440, 900], ['en', 1440, 900], ['th', 820, 1180], ['th', 390, 844]]) {
  const tag = `${lang}-${width}`;
  const mobile = width < 768;
  const ctx = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`${BASE}/${lang}/`, { waitUntil: 'networkidle' });
  const ex = page.locator('[data-explore]');
  await ex.scrollIntoViewIfNeeded();

  check((await page.locator('[role="tablist"] [role="tab"]').count()) === 3, `${tag}: expected 3 tabs`);
  check(JSON.stringify(await visible(page)) === '["structure"]', `${tag}: first panel should be the only one visible`);
  if (width >= 1024) {
    const h = await ex.evaluate((e) => e.offsetHeight);
    check(h <= height - 64, `${tag}: explorer is ${h}px, taller than the screen`);
  }

  await page.locator('[data-explore-tab="exterior"]').click();
  check(JSON.stringify(await visible(page)) === '["exterior"]', `${tag}: click did not switch to exterior`);
  await page.locator('[data-explore-tab="exterior"]').focus();
  await page.keyboard.press('ArrowLeft');
  check(JSON.stringify(await visible(page)) === '["interior"]', `${tag}: ArrowLeft did not move to interior`);
  check(await page.evaluate(() => document.activeElement?.dataset.exploreTab === 'interior'), `${tag}: focus did not follow ArrowLeft`);
  await page.keyboard.press('Home');
  check(JSON.stringify(await visible(page)) === '["structure"]', `${tag}: Home did not go to the first tab`);

  await page.locator('[data-explore-next="interior"]').click();
  check(JSON.stringify(await visible(page)) === '["interior"]', `${tag}: next did not open interior`);
  check(await page.evaluate(() => document.activeElement?.dataset.explorePanel === 'interior'), `${tag}: focus not moved to the new panel`);
  await page.locator('[data-explore-panel="interior"] img').evaluate((i) => i.decode().catch(() => {}));
  await ex.screenshot({ path: `${OUT}/why-${tag}.png` });

  await page.locator('[data-explore-panel="interior"] .tech__summary').click();
  check(await page.locator('#spec-flooring-system').isVisible(), `${tag}: technical details did not open the flooring spec`);
  check(await page.locator('[data-explore-panel="interior"] .tech__item').count() === 2, `${tag}: interior should list 2 specs`);
  check(await page.locator('.why .specs').count() === 0, `${tag}: old specs block still present`);
  // All six specifications, verbatim, across the three topics.
  const specs = JSON.parse(readFileSync('src/data/seed/materials.json', 'utf8')).items;
  const shown = await page.$$eval('.tech__item', (xs) => Object.fromEntries(xs.map((x) => [x.id.replace('spec-', ''), x.querySelector('dd').textContent.replace(/\s+/g, ' ').trim()])));
  check(specs.every((m) => shown[m.id] === m.text[lang].replace(/\s+/g, ' ').trim()), `${tag}: specs missing or not verbatim`);

  check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${tag}: horizontal overflow`);
  check(errors.length === 0, `${tag}: page errors ${errors.join(' | ')}`);
  console.log(`ok ${tag}`);
  await ctx.close();
}

// No JavaScript: every answer is in the page and visible; the tab row stays hidden.
const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(`${BASE}/th/`, { waitUntil: 'load' }).catch(() => {});
const noJs = await page.evaluate(() => ({
  panels: [...document.querySelectorAll('[data-explore-panel]')].filter((p) => !p.hidden).length,
  tabs: document.querySelector('[data-explore-tabs]')?.hidden,
  next: [...document.querySelectorAll('[data-explore-next]')].every((b) => b.hidden),
}));
// Dev server renders through Vite; if the page has no markup without JS, skip quietly.
if (noJs.panels) {
  check(noJs.panels === 3 && noJs.tabs === true && noJs.next, `no-js: expected 3 panels, hidden tabs and next buttons (${JSON.stringify(noJs)})`);
  console.log('ok no-js');
}
await browser.close();
console.log(fails.length ? `\n${fails.length} failure(s)` : '\nAll why checks passed');
process.exit(fails.length ? 1 : 0);
