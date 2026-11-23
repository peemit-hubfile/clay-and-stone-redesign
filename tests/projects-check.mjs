// Projects v2 checks (docs/projects-v2.md): owner stories on the homepage.
//   node tests/projects-check.mjs [baseUrl] [outDir]
// For TH/EN at 1440, 820 and 390: excerpts are verbatim substrings of the quotes, the
// full review opens with keyboard, model links resolve, photos load with alt text,
// no horizontal overflow and no page errors. Saves a screenshot of the section.

import { chromium } from 'playwright-core';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';

const BASE = (process.argv[2] || 'http://localhost:5173').replace(/\/$/, '');
const OUT = process.argv[3] || 'test-results/projects';
mkdirSync(OUT, { recursive: true });
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(existsSync);
const testimonials = JSON.parse(readFileSync('src/data/seed/testimonials.json', 'utf8')).items;
const norm = (s) => s.replace(/\s+/g, ' ').trim();

const CASES = [
  ['th', 1440, 900], ['en', 1440, 900], ['th', 820, 1180], ['th', 390, 844], ['en', 390, 844],
];
const fails = [];
const check = (ok, msg) => { if (!ok) { fails.push(msg); console.log('FAIL', msg); } };

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
for (const [lang, width, height] of CASES) {
  const tag = `${lang}-${width}`;
  const mobile = width < 768;
  const ctx = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(`${BASE}/${lang}/`, { waitUntil: 'networkidle' });
  const sec = page.locator('.projects');
  await sec.scrollIntoViewIfNeeded();
  await page.evaluate(() => document.querySelectorAll('.projects img').forEach((i) => { i.loading = 'eager'; }));
  await page.waitForFunction(() => [...document.querySelectorAll('.projects img')].every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 15000 }).catch(() => check(false, `${tag}: images did not load`));

  const data = await page.evaluate(() => ({
    h2: document.querySelector('.projects h2')?.textContent.trim(),
    quotes: [...document.querySelectorAll('.projects .owner')].map((o) => ({
      excerpt: o.querySelector('.owner__quote p').textContent,
      full: o.querySelector('.owner__full p').textContent,
      name: o.querySelector('.owner__name').textContent,
      link: o.querySelector('.owner__meta a')?.getAttribute('href'),
    })),
    missingAlt: [...document.querySelectorAll('.projects img')].filter((i) => !i.alt.trim()).length,
    overflow: document.documentElement.scrollWidth - window.innerWidth,
    places: document.querySelectorAll('.projects__places li').length,
    map: document.querySelectorAll('.pmap, [data-pmap]').length,
  }));
  check(data.map === 0, `${tag}: the removed map is still on the page`);
  check(data.quotes.length === 4, `${tag}: expected 4 owner stories, got ${data.quotes.length}`);
  for (const q of data.quotes) {
    const t = testimonials.find((x) => x.name[lang] === q.name);
    check(t, `${tag}: unknown owner ${q.name}`);
    if (!t) continue;
    check(norm(q.full) === norm(t.quote[lang]), `${tag}: full quote not verbatim for ${q.name}`);
    check(norm(t.quote[lang]).includes(norm(q.excerpt)), `${tag}: excerpt not a verbatim substring for ${q.name}`);
    check(q.link && (await page.request.get(BASE + q.link)).ok(), `${tag}: model link broken for ${q.name}`);
  }
  check(data.missingAlt === 0, `${tag}: ${data.missingAlt} images without alt`);
  check(data.overflow <= 0, `${tag}: horizontal overflow ${data.overflow}px`);
  check(data.places === 5, `${tag}: expected 5 provinces, got ${data.places}`);

  // Keyboard: Enter opens and closes the first full review.
  const summary = page.locator('.owner__full summary').first();
  await summary.focus();
  await page.keyboard.press('Enter');
  check(await page.locator('.owner__full').first().evaluate((d) => d.open), `${tag}: Enter did not open the full review`);
  await page.keyboard.press('Enter');
  check(!(await page.locator('.owner__full').first().evaluate((d) => d.open)), `${tag}: Enter did not close the full review`);

  await sec.screenshot({ path: `${OUT}/projects-${tag}.png` });
  check(errors.length === 0, `${tag}: page errors ${errors.join(' | ')}`);
  console.log(`ok ${tag}: "${data.h2}" · ${data.quotes.length} stories`);
  await ctx.close();
}
await browser.close();
console.log(fails.length ? `\n${fails.length} failure(s)` : '\nAll projects checks passed');
process.exit(fails.length ? 1 : 0);
