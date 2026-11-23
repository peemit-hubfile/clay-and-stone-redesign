// Header v2 checks (docs/header-v2.md).
//   node tests/header-check.mjs [baseUrl] [outDir]
// Desktop (TH/EN 1440): the Homes panel opens on click and with ArrowDown, lists 5 models
// whose links resolve, closes on Escape (focus back on the toggle) and on scrim click;
// the header stays on screen and compacts on scroll, with a progress line; sticky tabs sit under it.
// Tablet/mobile (820, 390): no panel, the menu button opens the dialog. No overflow, no
// page errors. Saves screenshots.

import { chromium } from 'playwright-core';
import { mkdirSync, existsSync } from 'node:fs';

const BASE = (process.argv[2] || 'http://localhost:5173').replace(/\/$/, '');
const OUT = process.argv[3] || 'test-results/header';
mkdirSync(OUT, { recursive: true });
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(existsSync);
const CASES = [['th', 1440, 900], ['en', 1440, 900], ['th', 820, 1180], ['th', 390, 844]];
const fails = [];
const check = (ok, msg) => { if (!ok) { fails.push(msg); console.log('FAIL', msg); } };
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
for (const [lang, width, height] of CASES) {
  const tag = `${lang}-${width}`;
  const mobile = width < 768;
  const ctx = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(`${BASE}/${lang}/`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${OUT}/header-${tag}.png`, clip: { x: 0, y: 0, width, height: Math.min(height, 200) } });
  const toggle = page.locator('[data-mega-toggle]');
  const mega = page.locator('[data-mega]');

  if (width >= 1024) {
    await toggle.click();
    await page.waitForTimeout(350);
    check(await mega.isVisible(), `${tag}: panel did not open on click`);
    check(await toggle.getAttribute('aria-expanded') === 'true', `${tag}: aria-expanded not true`);
    await page.evaluate(() => document.querySelectorAll('.mega img').forEach((i) => { i.loading = 'eager'; }));
    await page.waitForFunction(() => [...document.querySelectorAll('.mega img')].every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 15000 }).catch(() => check(false, `${tag}: panel images did not load`));
    const links = await page.locator('.mega a').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    check(await page.locator('.mega__model').count() === 5, `${tag}: expected 5 models in the panel`);
    for (const l of links) check((await page.request.get(BASE + l)).ok(), `${tag}: panel link ${l} broken`);
    await page.screenshot({ path: `${OUT}/header-${tag}-panel.png` });
    await page.keyboard.press('Escape');
    check(!(await mega.isVisible()), `${tag}: Escape did not close the panel`);
    check(await toggle.evaluate((el) => el === document.activeElement), `${tag}: focus did not return to the toggle`);
    await page.keyboard.press('ArrowDown');
    check(await mega.isVisible(), `${tag}: ArrowDown did not open the panel`);
    check(await page.evaluate(() => document.activeElement?.closest('.mega') !== null), `${tag}: ArrowDown did not move focus into the panel`);
    await page.mouse.click(width / 2, height - 40);
    check(!(await mega.isVisible()), `${tag}: scrim click did not close the panel`);
  } else {
    check(!(await mega.isVisible()), `${tag}: panel visible on a small screen`);
    await page.locator('[data-menu-toggle]').click();
    check(await page.locator('#site-menu').evaluate((d) => d.open), `${tag}: menu dialog did not open`);
    await page.locator('[data-menu-close]').click();
  }

  // Stays on screen and compacts once the page scrolls; progress line grows.
  const header = page.locator('[data-header]');
  const h0 = await header.evaluate((h) => h.getBoundingClientRect().height);
  await page.mouse.wheel(0, 1500);
  await pause(900);
  const after = await header.evaluate((h) => ({ top: h.getBoundingClientRect().top, height: h.getBoundingClientRect().height, solid: h.classList.contains('is-solid'), progress: getComputedStyle(h.querySelector('.site-header__progress')).transform }));
  check(after.top >= -1, `${tag}: header left the screen on scroll down`);
  check(after.solid && after.height < h0, `${tag}: header did not compact (${h0} -> ${after.height})`);
  check(after.progress !== 'none' && after.progress !== 'matrix(0, 0, 0, 1, 0, 0)', `${tag}: progress line did not grow`);
  await page.screenshot({ path: `${OUT}/header-${tag}-scrolled.png`, clip: { x: 0, y: 0, width, height: Math.min(height, 200) } });

  // Sticky tabs in the Why section sit right under the compact header.
  if (width < 1024) {
    const tabs = page.locator('.explore__tabs');
    if (await tabs.count() && await tabs.evaluate((t) => getComputedStyle(t).position === 'sticky')) {
      await page.locator('.explore').evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + scrollY + 200));
      await pause(700);
      const gap = await page.evaluate(() => document.querySelector('.explore__tabs').getBoundingClientRect().top - document.querySelector('[data-header]').getBoundingClientRect().bottom);
      check(Math.abs(gap) <= 2, `${tag}: sticky tabs are ${gap}px off the header`);
    }
  }

  check(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth) <= 0, `${tag}: horizontal overflow`);
  check(errors.length === 0, `${tag}: page errors ${errors.join(' | ')}`);
  console.log(`ok ${tag}`);
  await ctx.close();
}
await browser.close();
console.log(fails.length ? `\n${fails.length} failure(s)` : '\nAll header checks passed');
process.exit(fails.length ? 1 : 0);
