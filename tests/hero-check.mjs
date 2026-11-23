// Hero v4 checks (docs/hero-v4.md).
//   node tests/hero-check.mjs [baseUrl] [outDir]
// TH/EN at 1440, 1280, 820 and 390: the H1, both actions and the photo are in the first
// screen, the panel does not cover the house's centre on desktop, links resolve, the
// photo has alt text, no overflow, no page errors. Saves first-screen screenshots.
import { chromium } from 'playwright-core';
import { mkdirSync, existsSync, readFileSync } from 'node:fs';

const BASE = (process.argv[2] || 'http://localhost:5173').replace(/\/$/, '');
const OUT = process.argv[3] || 'test-results/hero';
mkdirSync(OUT, { recursive: true });
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(existsSync);
const CASES = [['th', 1440, 900], ['en', 1440, 900], ['th', 1280, 720], ['th', 820, 1180], ['th', 390, 844], ['en', 390, 844]];
const fails = [];
const check = (ok, msg) => { if (!ok) { fails.push(msg); console.log('FAIL', msg); } };

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
for (const [lang, width, height] of CASES) {
  const tag = `${lang}-${width}`;
  const mobile = width < 768;
  const ctx = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1, });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(`${BASE}/${lang}/`, { waitUntil: 'networkidle' });
  const d = await page.evaluate(() => {
    const r = (s) => document.querySelector(s)?.getBoundingClientRect();
    const img = document.querySelector('.hero__media img');
    return {
      h1: r('.hero__title'), lead: r('.hero__lead'), media: r('.hero__media'), panel: r('.hero__panel'),
      alt: img?.alt, loaded: img?.complete && img?.naturalWidth > 0,
      links: [...document.querySelectorAll('.hero a')].map((a) => a.getAttribute('href')),
      overflow: document.documentElement.scrollWidth - innerWidth,
    };
  });
  check(d.loaded, `${tag}: hero photo did not load`);
  check(d.alt && d.alt.length > 10, `${tag}: hero photo needs alt text`);
  check(d.h1.bottom <= height, `${tag}: H1 below the first screen`);
  check(d.lead.bottom <= height, `${tag}: hero sentence below the first screen (${Math.round(d.lead.bottom)}px)`);
  check(d.media.height >= 300, `${tag}: photo too short (${Math.round(d.media.height)}px)`);
  if (width >= 1024) check(d.panel.right < width * 0.55, `${tag}: panel reaches ${Math.round(d.panel.right)}px and covers the house`);
  for (const l of d.links) if (!l.startsWith('#')) check((await page.request.get(BASE + l)).ok(), `${tag}: link ${l} broken`);
  check(await page.locator('.hero__actions, .hero__cta, .facts').count() === 0, `${tag}: removed hero buttons or facts row still on the page`);
  check(d.overflow <= 0, `${tag}: horizontal overflow`);
  await page.screenshot({ path: `${OUT}/hero-${tag}.png` });

  // Brand Vision: verbatim statement, phrases darken while scrolling through it.
  const v = page.locator('[data-vision]');
  check(await v.count() === 1, `${tag}: Brand Vision section missing`);
  const expect = JSON.parse(readFileSync(`src/data/seed/i18n/${lang}.json`, 'utf8')).home.vision_title.replace(/\|/g, '');
  check((await v.locator('.vision__title').textContent()).replace(/\s+/g, ' ').trim() === expect, `${tag}: vision statement not verbatim`);
  await page.evaluate(() => scrollTo(0, 0));
  const lit0 = await v.locator('.vision__word.is-lit').count();
  await page.evaluate(() => scrollTo(0, document.querySelector('.vision__title').getBoundingClientRect().top + scrollY - 20));
  await page.waitForTimeout(400);
  const total = await v.locator('.vision__word').count();
  const lit1 = await v.locator('.vision__word.is-lit').count();
  check(lit1 === total, `${tag}: only ${lit1}/${total} phrases lit after scrolling past`);
  await page.locator('.vision__photo img').evaluate((i) => { i.loading = 'eager'; });
  await page.waitForFunction(() => { const i = document.querySelector('.vision__photo img'); return i.complete && i.naturalWidth > 0; }, null, { timeout: 15000 }).catch(() => check(false, `${tag}: vision photo did not load`));
  await page.locator('.vision__photo').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await v.screenshot({ path: `${OUT}/vision-${tag}.png` });
  check(lit0 < total || height > 1000, `${tag}: phrases already lit at the top (${lit0}/${total})`);
  check(errors.length === 0, `${tag}: page errors ${errors.join(' | ')}`);
  console.log(`ok ${tag}: sentence bottom ${Math.round(d.lead.bottom)}px`);
  await ctx.close();
}
await browser.close();
console.log(fails.length ? `\n${fails.length} failure(s)` : '\nAll hero checks passed');
process.exit(fails.length ? 1 : 0);
