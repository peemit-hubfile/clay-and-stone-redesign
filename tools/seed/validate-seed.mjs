// Validates src/data/seed: structure, references, i18n parity, finder rules,
// image files and pending-data labelling. Exit code 1 on errors.
//   node tools/seed/validate-seed.mjs

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { recommend, test } from '../../src/scripts/finder-engine.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SEED = join(ROOT, 'src', 'data', 'seed');
const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);
const load = (f) => JSON.parse(readFileSync(join(SEED, f), 'utf8'));

// 1. Load everything
const files = readdirSync(SEED).filter((f) => f.endsWith('.json'));
const c = {};
for (const f of files) {
  try { c[f.replace('.json', '')] = load(f); } catch (e) { err(`${f}: invalid JSON (${e.message})`); }
}
const items = (n) => c[n]?.items ?? [];
const ids = (n) => new Set(items(n).map((i) => i.id));

// 2. Unique ids
for (const [name, col] of Object.entries(c)) {
  if (!Array.isArray(col.items)) continue;
  const seen = new Set();
  for (const it of col.items) {
    if (!it.id) err(`${name}: item without id`);
    else if (seen.has(it.id)) err(`${name}: duplicate id ${it.id}`);
    seen.add(it.id);
  }
}

// 3. References
const ref = (col, field, target, nullable = true) => {
  const T = ids(target);
  for (const it of items(col)) {
    const vals = [].concat(it[field] ?? []);
    if (!vals.length && !nullable) err(`${col}/${it.id}: missing ${field}`);
    for (const v of vals) if (v != null && !T.has(v)) err(`${col}/${it.id}: ${field} → unknown ${target} "${v}"`);
  }
};
ref('models', 'series_id', 'series', false);
ref('series', 'model_ids', 'models');
ref('project-galleries', 'model_id', 'models', false);
ref('project-highlights', 'model_id', 'models', false);
ref('testimonials', 'model_id', 'models');
ref('faqs', 'series_id', 'series');
ref('articles', 'author_id', 'team', false);
for (const m of items('models')) if (!ids('project-galleries').has(m.images.gallery_id)) err(`models/${m.id}: gallery ${m.images.gallery_id} missing`);

// 4. Localised fields: count missing languages (warnings; must be flagged)
const LOCALE_KEYS = ['name', 'title', 'question', 'answer', 'description', 'text', 'quote', 'intro', 'role', 'credentials', 'headline', 'tagline'];
const missing = {};
for (const [name, col] of Object.entries(c)) {
  if (!Array.isArray(col.items)) continue;
  for (const it of col.items) {
    if (!it || typeof it !== 'object') continue;
    for (const k of LOCALE_KEYS) {
      const v = it[k];
      if (v && typeof v === 'object' && 'th' in v && 'en' in v) {
        for (const lang of ['th', 'en']) {
          if (v[lang] == null || v[lang] === '') {
            (missing[name] ??= []).push(`${it.id}.${k}.${lang}`);
            if (!JSON.stringify(it.flags ?? []).match(new RegExp(`${k}|${lang === 'en' ? 'English|EN|en' : 'Thai|TH|th'}|missing`, 'i')))
              warn(`${name}/${it.id}: ${k}.${lang} missing and not flagged`);
          }
        }
      }
    }
  }
}

// 5. Pending prices must be flagged
for (const m of items('models')) {
  if (m.price.status === 'pending-confirmation' && !m.flags.some((f) => f.startsWith('price'))) err(`models/${m.id}: pending price without flag`);
  if (typeof m.price.display_thb !== 'number') err(`models/${m.id}: display price missing`);
}

// 6. i18n key parity
const keys = (o, p = '') => Object.entries(o).flatMap(([k, v]) => k === '_meta' ? [] : (v && typeof v === 'object' ? keys(v, `${p}${k}.`) : [`${p}${k}`]));
try {
  const th = new Set(keys(load('i18n/th.json')));
  const en = new Set(keys(load('i18n/en.json')));
  for (const k of th) if (!en.has(k)) err(`i18n: "${k}" in th but not en`);
  for (const k of en) if (!th.has(k)) err(`i18n: "${k}" in en but not th`);
} catch (e) { err(`i18n: ${e.message}`); }

// 7. Finder rules
const finder = c.finder?.items;
const models = items('models');
if (!finder) err('finder.json missing');
else {
  for (const q of finder.questions) {
    if (!q.label?.th || !q.label?.en) err(`finder/${q.id}: label missing a language`);
    for (const o of q.options) {
      if (!o.label?.th || !o.label?.en) err(`finder/${q.id}.${o.id}: label missing a language`);
      for (const e of o.effects) {
        if (!e.reason?.th || !e.reason?.en) err(`finder/${q.id}.${o.id}: reason missing a language`);
        try { const hits = models.filter((m) => test(m, e)).length;
          if (hits === 0 && e.type !== 'note') warn(`finder/${q.id}.${o.id}: effect on "${e.field}" matches no model`);
        } catch (x) { err(`finder/${q.id}.${o.id}: ${x.message}`); }
      }
    }
  }
  // Exhaustive run over every answer combination (incl. unanswered).
  const qs = finder.questions.map((q) => [undefined, ...q.options.map((o) => o.id)]);
  let combos = 0, noMatch = 0, noMatchNoClose = 0;
  const walk = (i, acc) => {
    if (i === qs.length) {
      combos++;
      for (const lang of ['th', 'en']) {
        const r = recommend(models, finder, acc, lang);
        if (lang === 'th') { if (!r.matches.length) { noMatch++; if (!r.close.length) noMatchNoClose++; } }
        for (const m of r.matches) if (m.reasons.some((x) => !x)) err('finder: empty reason text');
      }
      return;
    }
    for (const v of qs[i]) walk(i + 1, { ...acc, [finder.questions[i].id]: v });
  };
  walk(0, {});
  console.log(`finder: ${combos} answer combinations tested; ${noMatch} end in "no exact match" (${noMatchNoClose} with no close match → consultation CTA only)`);
}

// 8. Image files (git-ignored media → warn only)
const imgs = new Set();
const collect = (v) => {
  if (typeof v === 'string' && v.startsWith('/images/')) imgs.add(v);
  else if (Array.isArray(v)) v.forEach(collect);
  else if (v && typeof v === 'object') Object.values(v).forEach(collect);
};
Object.values(c).forEach(collect);
const absent = [...imgs].filter((p) => !existsSync(join(ROOT, 'public', p)));
if (absent.length) warn(`${absent.length}/${imgs.size} referenced images are not on disk (client media is git-ignored; run tools/discovery/assets.py)`);

// Report
const totalMissing = Object.values(missing).reduce((n, a) => n + a.length, 0);
console.log(`collections: ${Object.keys(c).length} · models: ${models.length} · faqs: ${items('faqs').length} (${items('faqs').filter((f) => !f.visible).length} hidden) · images referenced: ${imgs.size}`);
console.log(`missing translations (labelled as pending): ${totalMissing}`, Object.fromEntries(Object.entries(missing).map(([k, v]) => [k, v.length])));
console.log(`pending items: ${models.filter((m) => m.price.status !== 'consistent-on-site').length} model prices, ${items('testimonials').filter((t) => t.consent === 'pending').length} testimonial consents`);
warnings.forEach((w) => console.log('WARN ', w));
errors.forEach((e) => console.log('ERROR', e));
console.log(errors.length ? `\n✗ ${errors.length} error(s)` : '\n✓ seed valid');
process.exit(errors.length ? 1 : 0);
