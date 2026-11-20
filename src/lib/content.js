// Loads seed collections and exposes language-aware helpers to page templates.
// Runs at build time (Node), never in the browser.

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DATA = join(dirname(fileURLToPath(import.meta.url)), '..', 'data');
const seed = (f) => JSON.parse(readFileSync(join(DATA, 'seed', f), 'utf8'));
const items = (f) => seed(f).items;

export const LANGS = ['th', 'en'];

export function loadContent() {
  const imagesPath = join(DATA, 'generated', 'images.json');
  return {
    settings: items('settings.json'),
    series: items('series.json'),
    models: items('models.json'),
    materials: items('materials.json'),
    steps: items('process-steps.json'),
    galleries: items('project-galleries.json'),
    highlights: items('project-highlights.json'),
    faqs: items('faqs.json'),
    testimonials: items('testimonials.json'),
    team: items('team.json'),
    articles: items('articles.json'),
    videos: items('videos.json'),
    finder: items('finder.json'),
    i18n: { th: seed('i18n/th.json'), en: seed('i18n/en.json') },
    images: existsSync(imagesPath) ? JSON.parse(readFileSync(imagesPath, 'utf8')) : {},
  };
}

// Pick a localised value. Returns { text, pending } so templates can label gaps.
export function pick(value, lang) {
  if (value == null) return { text: null, pending: true };
  if (typeof value === 'string') return { text: value, pending: false };
  const text = value[lang];
  return text ? { text, pending: false } : { text: null, pending: true };
}

// UI string lookup with {placeholder} interpolation.
export const makeT = (dict) => (key, vars = {}) => {
  const v = key.split('.').reduce((o, k) => o?.[k], dict);
  if (typeof v !== 'string') throw new Error(`Missing i18n key: ${key}`);
  return v.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
};

export const formatTHB = (n, lang) =>
  new Intl.NumberFormat(lang === 'th' ? 'th-TH' : 'en-US', { maximumFractionDigits: 0 }).format(n);

export const formatSqm = (n, lang) =>
  new Intl.NumberFormat(lang === 'th' ? 'th-TH' : 'en-US', { maximumFractionDigits: 1 }).format(n);
