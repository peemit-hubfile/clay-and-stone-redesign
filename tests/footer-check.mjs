// Footer v2 checks (docs/footer-v2.md).
//   node tests/footer-check.mjs [baseUrl] [outDir]
// Home + a model page, TH/EN at 1440, 820, 390: 5 model links that resolve, menu and
// contact links, directions link to Google Maps in a new tab, back-to-top returns to
// the top, wordmark is decorative and does not overflow, no page errors.

import { chromium } from 'playwright-core';
import { mkdirSync, existsSync } from 'node:fs';

const BASE = (process.argv[2] || 'http://localhost:5173').replace(/\/$/, '');
const OUT = process.argv[3] || 'test-results/footer';
mkdirSync(OUT, { recursive: true });
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(existsSync);
const fails = [];
const check = (ok, msg) => { if (!ok) { fails.push(msg); console.log('FAIL', msg); } };

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
for (const [lang, width, height, path] of [['th', 1440, 900, ''], ['en', 1440, 900, ''], ['th', 820, 1180, ''], ['th', 390, 844, ''], ['en', 390, 844, 'homes/']]) {
  const tag = `${lang}-${width}${path ? '-' + path.replace(/\W/g, '') : ''}`;
  const mobile = width < 768;
  const ctx = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`${BASE}/${lang}/${path}`, { waitUntil: 'networkidle' });
  const f = page.locator('.site-footer');
  await f.scrollIntoViewIfNeeded();
  const d = await page.evaluate(() => {
    const foot = document.querySelector('.site-footer');
    const homes = [...foot.querySelectorAll('[aria-labelledby="footer-homes"] li a')].map((a) => a.getAttribute('href'));
    const dir = foot.querySelector('.site-footer__directions');
    const wm = foot.querySelector('.site-footer__wordmark');
    return {
      homes,
      contact: [...foot.querySelectorAll('.site-footer__contact a')].map((a) => a.getAttribute('href')),
      dir: dir && { href: dir.href, target: dir.target },
      wmHidden: wm?.getAttribute('aria-hidden') === 'true',
      wmFits: wm ? wm.scrollWidth <= wm.clientWidth + 1 : false,
      overflow: document.documentElement.scrollWidth - innerWidth,
      statement: foot.querySelector('.site-footer__statement')?.textContent.trim(),
    };
  });
  check(d.homes.length === 6, `${tag}: expected 5 models + all homes, got ${d.homes.length}`);
  for (const h of d.homes) check((await page.request.get(BASE + h)).ok(), `${tag}: footer link ${h} broken`);
  check(d.contact.length === 3 && d.contact.some((h) => h.startsWith('tel:')) && d.contact.some((h) => h.startsWith('mailto:')), `${tag}: contact links`);
  check(d.dir && /google\.com\/maps/.test(d.dir.href) && d.dir.target === '_blank', `${tag}: directions link`);
  check(d.wmHidden && d.wmFits, `${tag}: wordmark should be decorative and fit (${JSON.stringify({ h: d.wmHidden, f: d.wmFits })})`);
  check(d.statement && d.statement.length > 5, `${tag}: brand statement missing`);
  check(d.overflow <= 0, `${tag}: horizontal overflow ${d.overflow}px`);
  await page.locator('[data-back-to-top]').click();
  await page.waitForTimeout(400);
  check(await page.evaluate(() => scrollY < 5), `${tag}: back to top did not return to the top`);
  await f.screenshot({ path: `${OUT}/footer-${tag}.png` });
  check(errors.length === 0, `${tag}: page errors ${errors.join(' | ')}`);
  console.log(`ok ${tag}`);
  await ctx.close();
}
await browser.close();
console.log(fails.length ? `\n${fails.length} failure(s)` : '\nAll footer checks passed');
process.exit(fails.length ? 1 : 0);
