const { chromium } = require('playwright-core');
const fs = require('fs'); const path = require('path');
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
const pages = ['th','en','th/products/unwind-series','en/products/alive-series','th/projects','th/about-us','th/process','th/contact-us','th/good-to-know','th/blogs/modular-house-price','en/products/upcoming-product'];
const vps = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844, isMobile: true, deviceScaleFactor: 2, hasTouch: true } };
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const results = [];
  for (const [vpName, vp] of Object.entries(vps)) {
    for (const p of pages) {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: !!vp.isMobile, deviceScaleFactor: vp.deviceScaleFactor || 1, hasTouch: !!vp.hasTouch, userAgent: vp.isMobile ? 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131 Mobile Safari/537.36' : undefined });
      const page = await ctx.newPage();
      const errors = []; const failed = []; let bytes = 0; let reqs = 0; const thirdParty = new Set();
      page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
      page.on('pageerror', e => errors.push('pageerror: ' + String(e).slice(0, 200)));
      page.on('requestfailed', r => failed.push(r.url().slice(0, 150) + ' ' + (r.failure() || {}).errorText));
      page.on('response', async r => { reqs++; const h = r.headers()['content-length']; if (h) bytes += +h; try { const u = new URL(r.url()); if (!u.hostname.endsWith('clayandstone.co.th')) thirdParty.add(u.hostname); } catch {} });
      await page.addInitScript(() => {
        window.__lcp = 0; window.__cls = 0;
        new PerformanceObserver(l => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
      });
      const t0 = Date.now();
      try { await page.goto('https://www.clayandstone.co.th/' + p, { waitUntil: 'load', timeout: 60000 }); } catch (e) { errors.push('nav: ' + e.message.slice(0, 100)); }
      const loadMs = Date.now() - t0;
      await page.waitForTimeout(2500);
      const name = vpName + '_' + p.replace(/\//g, '_');
      await page.screenshot({ path: path.join(OUT, name + '_fold.png') });
      const m = await page.evaluate(() => ({
        lcp: Math.round(window.__lcp), cls: +window.__cls.toFixed(3),
        docH: document.documentElement.scrollHeight, overflowX: document.documentElement.scrollWidth > window.innerWidth,
        h1: [...document.querySelectorAll('h1')].map(h => h.innerText.trim().slice(0, 80)),
        hidden_h1: [...document.querySelectorAll('h1')].filter(h => !h.offsetParent).length,
        imgsNoAlt: [...document.querySelectorAll('img')].filter(i => !i.alt).length, imgs: document.images.length,
        lazy: [...document.images].filter(i => i.loading === 'lazy').length,
        smallTap: [...document.querySelectorAll('a,button')].filter(a => { const r = a.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.height < 24 || r.width < 24); }).length,
        fonts: [...new Set([...document.querySelectorAll('body *')].slice(0, 400).map(e => getComputedStyle(e).fontFamily))].slice(0, 4),
        heroText: (document.elementFromPoint(innerWidth / 2, innerHeight / 2) || {}).innerText?.slice(0, 120) || '',
        skipLink: !!document.querySelector('a[href="#main"]'), mainLandmark: !!document.querySelector('main,#main'),
        navAria: [...document.querySelectorAll('nav')].length, langAttr: document.documentElement.lang,
        buttonsNoName: [...document.querySelectorAll('a,button')].filter(a => !a.innerText.trim() && !a.getAttribute('aria-label') && !a.querySelector('img[alt]:not([alt=""])')).length,
      }));
      if (vpName === 'mobile' && ['th', 'th/products/unwind-series'].includes(p)) await page.screenshot({ path: path.join(OUT, name + '_full.png'), fullPage: true });
      if (vpName === 'desktop' && ['th', 'th/products/unwind-series', 'th/projects', 'th/about-us'].includes(p)) await page.screenshot({ path: path.join(OUT, name + '_full.png'), fullPage: true });
      results.push({ vp: vpName, page: p, loadMs, reqs, kb: Math.round(bytes / 1024), errors, failed: failed.slice(0, 8), thirdParty: [...thirdParty], ...m });
      console.log(vpName, p, loadMs, 'ms', reqs, 'reqs', Math.round(bytes / 1024), 'KB', 'LCP', m.lcp, 'CLS', m.cls, 'errs', errors.length);
      await ctx.close();
    }
  }
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 1));
  await browser.close();
})();
