// WCAG 2.2 AA automated scan (docs/a11y-wcag22.md).
//   node tests/a11y-check.mjs [baseUrl] [outJson]
// Runs axe-core (wcag2a/aa, wcag21a/aa, wcag22aa rules) on every route at desktop
// (1440) and mobile (390), with motion on (the state most visitors see), plus open
// states: the Homes panel, the mobile menu dialog and the Home Finder results.
// Exits 1 on any violation. axe covers only part of WCAG; see the doc for the
// manual checks.
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const AXE = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const BASE = (process.argv[2] || 'http://localhost:5173').replace(/\/$/, '');
const OUT = process.argv[3] || 'test-results/a11y/axe.json';
mkdirSync(OUT.replace(/\/[^/]+$/, ''), { recursive: true });
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(existsSync);
const routes = JSON.parse(readFileSync('src/.routes.json', 'utf8')).filter((r) => r.key !== 'index').map((r) => '/' + r.file.replace(/index\.html$/, ''));
const VIEWPORTS = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } };
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const found = new Map();
// rule id -> { impact, help, url, where }
const review = new Set(); // color-contrast axe could not decide (text over images): check by eye
const scan = async (page, label) => {
  await page.addScriptTag({ content: AXE });
  const r = await page.evaluate(async (tags) => {
    const res = await window.axe.run(document, { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations', 'incomplete'] });
    window.__axeIncomplete = res.incomplete.filter((v) => v.id === 'color-contrast').flatMap((v) => v.nodes.map((n) => n.target.join(' ').replace(/:nth-child\(\d+\)/g, '')));
    return res.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, url: v.helpUrl, nodes: v.nodes.map((n) => ({ target: n.target.join(' '), summary: n.failureSummary })) }));
  }, TAGS);
  for (const t of await page.evaluate(() => window.__axeIncomplete || [])) review.add(t);
  for (const v of r) {
    const e = found.get(v.id) ?? { impact: v.impact, help: v.help, url: v.url, where: [] };
    for (const n of v.nodes) e.where.push({ label, target: n.target, summary: n.summary });
    found.set(v.id, e);
  }
  return r.length;
};
// Let reveal animations finish so we scan the settled page, not a mid-fade frame.
const settle = async (page) => {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += innerHeight * 0.8) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);
};

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
for (const [vpName, vp] of Object.entries(VIEWPORTS)) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch, deviceScaleFactor: vp.deviceScaleFactor || 1 });
  for (const path of routes) {
    const page = await ctx.newPage();
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    await settle(page);
    const n = await scan(page, `${vpName} ${path}`);
    // Open states on the homepage.
    if (/^\/(th|en)\/$/.test(path)) {
      if (vpName === 'desktop') {
        await page.locator('[data-mega-toggle]').click();
        await page.waitForTimeout(400);
        await scan(page, `${vpName} ${path} [homes panel open]`);
        await page.keyboard.press('Escape');
      } else {
        await page.locator('[data-menu-toggle]').click();
        await page.waitForTimeout(400);
        await scan(page, `${vpName} ${path} [menu open]`);
        await page.locator('[data-menu-close]').click();
      }
    }
    console.log(`${n ? 'x' : 'ok'} ${vpName} ${path}${n ? ` · ${n} rule(s)` : ''}`);
    await page.close();
  }
  // Home Finder: answer every question with the first option, then scan the results.
  const page = await ctx.newPage();
  await page.goto(`${BASE}/th/`, { waitUntil: 'networkidle' });
  await page.locator('#finder').scrollIntoViewIfNeeded();
  for (let i = 0; i < 10; i++) {
    const opt = page.locator('[data-finder-form] input:visible').first();
    if (!(await opt.count())) break;
    await opt.check({ force: true });
    const next = page.locator('[data-finder-next]:visible, [data-finder-form] button[type=submit]:visible').first();
    if (!(await next.count())) break;
    await next.click();
    await page.waitForTimeout(300);
  }
  await page.waitForTimeout(800);
  await settle(page);
  await scan(page, `${vpName} /th/ [finder answered]`);
  await page.close();
  await ctx.close();
}
await browser.close();

const report = [...found.entries()].map(([id, e]) => ({ id, ...e, count: e.where.length }));
writeFileSync(OUT, JSON.stringify(report, null, 2));
for (const r of report) {
  console.log(`\n[${r.impact}] ${r.id}: ${r.help} (${r.count} nodes)`);
  for (const w of r.where.slice(0, 6)) console.log(`   ${w.label} :: ${w.target}`);
}
console.log(`\nText over images or gradients, for a check by eye (${review.size}):\n  ${[...review].join('\n  ')}`);
console.log(report.length ? `\n${report.length} rule(s) violated · details in ${OUT}` : '\nNo axe violations (WCAG 2.2 AA rule set)');
process.exit(report.length ? 1 : 0);
