import { chromium } from 'playwright-core';
const OUT = process.argv[2];
const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
const CASES = [
  ['single', 'th', 1440, { use: 'primary-home', space: 'open', budget: 'lte-1m', priority: 'limited-plot' }],
  ['multi', 'th', 1440, { use: 'second-home', space: '1', budget: 'lte-2m', priority: 'nature' }],
  ['multi', 'en', 1440, { use: 'second-home', space: '1', budget: 'lte-2m', priority: 'nature' }],
  ['nomatch', 'th', 1440, { use: 'resort', space: '2', budget: 'lte-1m', priority: 'outdoor' }],
  ['multi', 'th', 390, { use: 'second-home', space: '1', budget: 'lte-2m', priority: 'nature' }],
];
for (const [name, lang, w, picks] of CASES) {
  const m = w < 768;
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, isMobile: m, hasTouch: m, deviceScaleFactor: m ? 2 : 1, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto(`http://localhost:5173/${lang}/#finder`, { waitUntil: 'networkidle' });
  for (const [q, v] of Object.entries(picks)) {
    await page.locator(`[data-q="${q}"] input[value="${v}"]`).check();
    await page.waitForTimeout(350);
    const vis = await page.evaluate(() => [...document.querySelectorAll('[data-q]')].find((f) => !f.hidden)?.dataset.q);
    if (vis === q) await page.locator('[data-finder-next]').click();
  }
  await page.evaluate(() => document.querySelectorAll('[data-finder-results] img').forEach((i) => { i.loading = 'eager'; }));
  await page.waitForTimeout(1200);
  const info = await page.evaluate(() => ({
    title: document.querySelector('.results__title')?.textContent,
    cards: [...document.querySelectorAll('.result')].map((r) => `${r.className} | ${r.querySelector('.result__name').textContent} | ${r.querySelector('.result__why').textContent} | ${r.querySelector('[data-result-note]').hidden ? '' : r.querySelector('[data-result-note]').textContent}`),
    overflow: document.documentElement.scrollWidth - innerWidth,
  }));
  console.log(name, lang, w, JSON.stringify(info, null, 1), errs);
  await page.locator('[data-finder]').screenshot({ path: `${OUT}/finder-${name}-${lang}-${w}.png` });
  await ctx.close();
}
await browser.close();
