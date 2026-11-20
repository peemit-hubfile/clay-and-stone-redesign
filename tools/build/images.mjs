// Generates responsive AVIF + WebP derivatives for every image referenced by
// the seed (plus extra hero images), and writes src/data/generated/images.json.
// Never upscales: widths above the source width are skipped.
//   node tools/build/images.mjs [--force]

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PUB = join(ROOT, 'public');
const OPT = join(PUB, 'images', 'opt');
const MANIFEST = join(ROOT, 'src', 'data', 'generated', 'images.json');
const WIDTHS = [480, 768, 1080, 1440, 1920];
const FORCE = process.argv.includes('--force');
const EXTRA = [
  '/images/source/misc/694722e5b5351c705601b75d_contact-banner.webp',
  '/images/source/projects/6973b669a84a9e740e476ed4_standard-07.webp',
];

const refs = new Set(EXTRA);
const collect = (v) => {
  if (typeof v === 'string' && v.startsWith('/images/source/') && /\.(webp|png|jpe?g)$/i.test(v)) refs.add(v);
  else if (Array.isArray(v)) v.forEach(collect);
  else if (v && typeof v === 'object') Object.values(v).forEach(collect);
};
const seedDir = join(ROOT, 'src', 'data', 'seed');
for (const f of readdirSync(seedDir).filter((f) => f.endsWith('.json'))) collect(JSON.parse(readFileSync(join(seedDir, f), 'utf8')));

mkdirSync(OPT, { recursive: true });
mkdirSync(dirname(MANIFEST), { recursive: true });
const out = existsSync(MANIFEST) && !FORCE ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};
let made = 0, skipped = 0, missing = 0;

for (const src of [...refs].sort()) {
  const file = join(PUB, src);
  if (!existsSync(file)) { missing++; continue; }
  const name = basename(src, extname(src)).replace(/^[0-9a-f]{24}_/, '').replace(/[^A-Za-z0-9-]+/g, '-').toLowerCase()
    + '-' + basename(src).slice(0, 6);
  const meta = await sharp(file).metadata();
  const widths = WIDTHS.filter((w) => w < meta.width);
  widths.push(Math.min(meta.width, 2400));
  const uniq = [...new Set(widths)].sort((a, b) => a - b);
  for (const w of uniq) {
    for (const [fmt, opts] of [['avif', { quality: 50, effort: 4 }], ['webp', { quality: 74 }]]) {
      const target = join(OPT, `${name}-${w}.${fmt}`);
      if (existsSync(target) && !FORCE) { skipped++; continue; }
      await sharp(file).resize({ width: w, withoutEnlargement: true })[fmt](opts).toFile(target);
      made++;
    }
  }
  out[src] = { width: meta.width, height: meta.height, base: `/images/opt/${name}`, widths: uniq };
}

writeFileSync(MANIFEST, JSON.stringify(out, null, 1) + '\n');
console.log(`images: ${Object.keys(out).length} sources · ${made} files written · ${skipped} up to date · ${missing} missing`);
