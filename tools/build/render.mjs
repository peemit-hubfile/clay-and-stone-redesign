// Renders every route × language to static HTML under src/ (git-ignored output).
//   node tools/build/render.mjs

import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadContent, LANGS } from '../../src/lib/content.js';
import { buildRoutes } from '../../src/pages/routes.js';
import { toString } from '../../src/lib/html.js';

const SRC = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'src');
const content = loadContent();
// SHOWCASE=1 renders the homepage only (docs/showcase.md).
const routes = buildRoutes(content).filter((r) => process.env.SHOWCASE !== '1' || r.path === '');

for (const lang of LANGS) rmSync(join(SRC, lang), { recursive: true, force: true });

const written = [];
for (const route of routes) {
  for (const lang of LANGS) {
    const file = join(lang, route.path, 'index.html');
    const out = toString(route.render({ lang, content, route, routes }));
    mkdirSync(dirname(join(SRC, file)), { recursive: true });
    writeFileSync(join(SRC, file), out);
    written.push({ key: `${lang}/${route.path || 'home'}`.replace(/\/$/, ''), file: file.replaceAll('\\', '/') });
  }
}

// Root: redirect to the default language (production would use a 301).
writeFileSync(join(SRC, 'index.html'), `<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=/th/"><title>Clay &amp; Stone</title></head><body><a href="/th/">Clay &amp; Stone</a></body></html>\n`);
written.push({ key: 'index', file: 'index.html' });
writeFileSync(join(SRC, '.routes.json'), JSON.stringify(written, null, 1));
console.log(`render: ${written.length} pages`);
