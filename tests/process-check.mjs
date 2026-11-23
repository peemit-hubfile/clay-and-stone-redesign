// Process v2 checks (docs/process-v2.md): timeline track + photo steps.
//   node tests/process-check.mjs [baseUrl] [outDir]
// TH/EN at 1440, 820 and 390: 4 steps with photo, timing and verbatim text; the track
// shows on ≥768px with segment widths in duration order (production > assembly) and the
// delivery pin inside the production bar; CTA present; no overflow; no page errors.

import { chromium } from 'playwright-core';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';

const BASE = (process.argv[2] || 'http://localhost:5173').replace(/\/$/, '');
const OUT = process.argv[3] || 'test-results/process';
mkdirSync(OUT, { recursive: true });
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(existsSync);
const steps = JSON.parse(readFileSync('src/data/seed/process-steps.json', 'utf8')).items;
const norm = (s) => s.replace(/\s+/g, ' ').trim();
const fails = [];
const check = (ok, msg) => { if (!ok) { fails.push(msg); console.log('FAIL', msg); } };

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
for (const [lang, width, height] of [['th', 1440, 900], ['en', 1440, 900], ['th', 820, 1180], ['th', 390, 844], ['en', 390, 844]]) {
  const tag = `${lang}-${width}`;
  const mobile = width < 768;
  const ctx = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 2 : 1, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`${BASE}/${lang}/`, { waitUntil: 'networkidle' });
  const sec = page.locator('.process');
  await sec.scrollIntoViewIfNeeded();
  await page.evaluate(() => document.querySelectorAll('.process img').forEach((i) => { i.loading = 'eager'; }));
  await page.waitForFunction(() => [...document.querySelectorAll('.process img')].every((i) => i.complete && i.naturalWidth > 0), null, { timeout: 15000 }).catch(() => check(false, `${tag}: images did not load`));
  const d = await page.evaluate(() => ({
    steps: [...document.querySelectorAll('.step')].map((s) => ({ text: s.querySelector('.step__text').textContent, time: s.querySelector('.step__time').textContent.trim(), alt: s.querySelector('img').alt })),
    track: (() => { const t = document.querySelector('.track'); if (!t || getComputedStyle(t).display === 'none') return null;
      const w = (n) => document.querySelector(`.track__seg--${n} .track__bar`).getBoundingClientRect();
      const mark = document.querySelector('.track__mark').getBoundingClientRect(); const p = w(2);
      return { prod: p.width, onsite: w(4).width, markIn: mark.left + mark.width / 2 > p.left && mark.left + mark.width / 2 < p.right }; })(),
    cta: !!document.querySelector('.process__cta a[href*="contact"]'),
    overflow: document.documentElement.scrollWidth - innerWidth,
  }));
  check(d.steps.length === 4, `${tag}: expected 4 steps`);
  d.steps.forEach((s, i) => {
    check(norm(s.text) === norm(steps[i].text[lang]), `${tag}: step ${i + 1} text not verbatim`);
    check(s.time.length > 3 && s.alt.trim().length > 5, `${tag}: step ${i + 1} missing timing or alt`);
  });
  if (width >= 768) {
    check(d.track, `${tag}: track hidden`);
    if (d.track) {
      check(d.track.prod > d.track.onsite * 2, `${tag}: production bar should be much longer than assembly (${Math.round(d.track.prod)} vs ${Math.round(d.track.onsite)})`);
      check(d.track.markIn, `${tag}: delivery pin not on the production bar`);
    }
  } else check(!d.track, `${tag}: track should be hidden on phones`);
  check(d.cta, `${tag}: CTA missing`);
  check(d.overflow <= 0, `${tag}: horizontal overflow ${d.overflow}px`);
  await sec.screenshot({ path: `${OUT}/process-${tag}.png` });
  check(errors.length === 0, `${tag}: page errors ${errors.join(' | ')}`);
  console.log(`ok ${tag}`);
  await ctx.close();
}
await browser.close();
console.log(fails.length ? `\n${fails.length} failure(s)` : '\nAll process checks passed');
process.exit(fails.length ? 1 : 0);
