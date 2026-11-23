// Showcase build (docs/showcase.md): the homepage only (TH + EN), other links show a
// notice, noindex everywhere, optional expiry. Output: dist/, ready for
// `vercel deploy dist` as a static site.
//   node tools/build/showcase.mjs [--expires YYYY-MM-DD]
import { execFileSync } from 'node:child_process';
import { writeFileSync, readFileSync, readdirSync, statSync, rmSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = join(import.meta.dirname, '..', '..');
const i = process.argv.indexOf('--expires');
const expires = i > -1 ? process.argv[i + 1] : '';
if (expires && !/^\d{4}-\d{2}-\d{2}$/.test(expires)) throw new Error('--expires must be YYYY-MM-DD');

const env = { ...process.env, SHOWCASE: '1', SHOWCASE_EXPIRES: expires };
const run = (...args) => execFileSync(process.execPath, args, { cwd: ROOT, stdio: 'inherit', env });
try {
  run('tools/build/fonts.mjs');
  run('tools/build/images.mjs');
  run('node_modules/vite/bin/vite.js', 'build');
  run('tools/build/prune-dist.mjs');

  const DIST = join(ROOT, 'dist');
  // Only the homepage ships, so drop image derivatives that no built file references.
  const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
  const text = walk(DIST).filter((f) => /\.(html|css|js)$/.test(f)).map((f) => readFileSync(f, 'utf8')).join('\n');
  let dropped = 0;
  for (const f of walk(join(DIST, 'images'))) {
    const web = '/' + relative(DIST, f).replaceAll('\\', '/');
    if (!text.includes(web)) { rmSync(f); dropped++; }
  }
  const mb = walk(DIST).reduce((n, f) => n + statSync(f).size, 0) / 1e6;
  console.log(`showcase: dropped ${dropped} unused images · dist is ${mb.toFixed(1)} MB`);
  // Any other path (old links, guesses) lands on the Thai homepage.
  writeFileSync(join(DIST, '404.html'), '<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=/th/"><title>Clay &amp; Stone</title></head><body><a href="/th/">Clay &amp; Stone</a></body></html>\n');
  // Vercel static config: keep it out of search engines and cache assets well.
  writeFileSync(join(DIST, 'vercel.json'), JSON.stringify({
    cleanUrls: false,
    trailingSlash: true,
    redirects: [{ source: '/', destination: '/th/', permanent: false }],
    headers: [
      { source: '/(.*)', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }, { key: 'X-Content-Type-Options', value: 'nosniff' }, { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }] },
      { source: '/assets/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    ],
  }, null, 2));
  writeFileSync(join(DIST, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
  console.log(`showcase: dist/ ready (homepage only${expires ? `, expires ${expires}` : ''})`);
} finally {
  // Put the full set of pages back for the dev server.
  execFileSync(process.execPath, ['tools/build/render.mjs'], { cwd: ROOT, stdio: 'inherit', env: { ...process.env, SHOWCASE: '' } });
}
