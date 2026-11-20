// Lab performance snapshot (NOT field data): homepage on an emulated mid-range
// mobile connection, cold cache. Reports transfer size, request count, LCP, CLS.
//   node tests/perf-lab.mjs [baseUrl]
import { chromium } from 'playwright-core';
import { existsSync, writeFileSync, mkdirSync } from 'node:fs';

const BASE = (process.argv[2] || 'http://localhost:4173').replace(/\/$/, '');
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', '/usr/bin/google-chrome'].find(existsSync);
const browser = await chromium.launch({ executablePath: CHROME });
const out = [];
for (const [name, vp, net] of [
  ['mobile-4g', { width: 390, height: 844, isMobile: true, deviceScaleFactor: 2 }, { latency: 150, down: 1.6e6 / 8, up: 750e3 / 8, cpu: 4 }],
  ['desktop', { width: 1440, height: 900 }, { latency: 40, down: 10e6 / 8, up: 5e6 / 8, cpu: 1 }],
]) {
  for (const path of ['/th/', '/en/']) for (let run = 1; run <= 3; run++) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: !!vp.isMobile, deviceScaleFactor: vp.deviceScaleFactor || 1 });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: net.latency, downloadThroughput: net.down, uploadThroughput: net.up });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: net.cpu });
    let bytes = 0, reqs = 0;
    cdp.on('Network.loadingFinished', (e) => { bytes += e.encodedDataLength; reqs++; });
    await page.addInitScript(() => {
      window.__lcp = 0; window.__cls = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
    });
    await page.goto(BASE + path, { waitUntil: 'load', timeout: 120000 });
    await page.waitForTimeout(3000);
    const m = await page.evaluate(() => ({ lcp: Math.round(window.__lcp), cls: +window.__cls.toFixed(3), lcpEl: null }));
    const r = { profile: name, path, run, requests: reqs, transferKB: Math.round(bytes / 1024), lcpMs: m.lcp, cls: m.cls };
    out.push(r); console.log(JSON.stringify(r));
    await ctx.close();
  }
}
await browser.close();
const median = (a) => a.sort((x, y) => x - y)[Math.floor(a.length / 2)];
const summary = [...new Set(out.map((r) => r.profile + ' ' + r.path))].map((k) => { const rs = out.filter((r) => r.profile + ' ' + r.path === k); return { case: k, medianLcpMs: median(rs.map((r) => r.lcpMs)), maxCls: Math.max(...rs.map((r) => r.cls)), transferKB: rs[0].transferKB, requests: rs[0].requests }; });
console.table(summary);
mkdirSync('test-results', { recursive: true });
writeFileSync('test-results/perf-lab.json', JSON.stringify({ note: 'Lab measurement only (emulated network + CPU throttling; 3 runs per case, median reported). Not Core Web Vitals field data.', date: new Date().toISOString(), summary, results: out }, null, 1));
