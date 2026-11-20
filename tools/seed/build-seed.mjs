// Builds prototype seed collections (src/data/seed/*.json) from the Stage 1
// extraction files in src/data. Re-run after any extraction update:
//   node tools/seed/build-seed.mjs
//
// Rules:
// - Never invent business facts. Every record keeps `sources`.
// - Unconfirmed values get an explicit `status` and land in `flags`, so the UI
//   can label them ("pending confirmation") instead of presenting them as fact.
// - Hand-authored files (i18n/*.json, finder.json) are NOT generated here.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const DATA = join(ROOT, 'src', 'data');
const OUT = join(DATA, 'seed');
const read = (f) => JSON.parse(readFileSync(join(DATA, f), 'utf8'));
const write = (f, items, extraMeta = {}) => {
  mkdirSync(dirname(join(OUT, f)), { recursive: true });
  const body = {
    _meta: {
      collection: f.replace('.json', ''),
      generated_by: 'tools/seed/build-seed.mjs',
      generated_from: 'src/data (Stage 1 extraction, 2026-11-20)',
      count: Array.isArray(items) ? items.length : undefined,
      ...extraMeta,
    },
    items,
  };
  writeFileSync(join(OUT, f), JSON.stringify(body, null, 2) + '\n', 'utf8');
  console.log(`seed/${f}`.padEnd(32), Array.isArray(items) ? `${items.length} items` : 'object');
};

const products = read('products.json');
const projects = read('projects.json');
const faq = read('faq.json');
const site = read('site-content.json');
const SITE = 'https://www.clayandstone.co.th';
const L = (th, en) => ({ th: th ?? null, en: en ?? null });

/* ------------------------------------------------------------------ settings */
const shared = products.shared;
const settings = {
  brand: {
    name: site.brand.name,
    legal_name: null,
    positioning: L(site.brand.positioning.th, site.brand.positioning.en),
    philosophy: L(null, site.brand.philosophy.en),
    description: L(site.brand.description.th, site.brand.description.en),
    taglines: site.brand.taglines.map((t) => L(t.th, t.en)),
    flags: ['legal_name: missing', 'founding_year: missing', 'philosophy.th: missing', 'logo_svg: missing'],
  },
  contact: {
    phone: site.contact.phone,
    email: site.contact.email,
    line: site.contact.line,
    social: { facebook: site.contact.facebook, instagram: site.contact.instagram, line: site.contact.line.href },
    showroom: {
      name: L(site.contact.office_showroom.label.th, site.contact.office_showroom.label.en),
      address: L(site.contact.office_showroom.address.th, site.contact.office_showroom.address.en),
      geo: site.contact.office_showroom.geo,
      by_appointment: true,
      opening_hours: null,
    },
    flags: ['showroom.opening_hours: missing', 'factory_location: missing'],
    sources: ['/th/contact-us', '/en/contact-us', 'footer'],
  },
  offer: {
    promotions: shared.promotions.items.map((p) => L(p.th, p.en)),
    promotions_status: 'pending-confirmation',
    warranty: {
      general_workmanship_years: shared.warranty.general_workmanship_years,
      structural_years: shared.warranty.structural_years,
      after_sales: L('ดูแลโดยทีม Clay & Stone โดยตรง ไม่ได้โอนให้ผู้รับเหมาภายนอก', shared.warranty.after_sales),
    },
    free_installation_radius_km: 200,
    included: shared.included_in_move_in_ready.en.map((en, i) => L(shared.included_in_move_in_ready.th[i], en)),
    customer_prepares: shared.included_in_move_in_ready.customer_prepares.en.map((en, i) =>
      L(shared.included_in_move_in_ready.customer_prepares.th[i], en)),
    budget_guidance: { extra_percent_min: 20, extra_percent_max: 30, text: L(null, shared.budget_guidance.en), status: 'general-guidance' },
    foundation: L(null, shared.foundation.en),
    site_requirements: L(shared.site_requirements.th, shared.site_requirements.en),
    flags: [
      'promotions: standing terms or time-limited? (pending)',
      'free_installation_radius_km: measured from office or factory? (pending)',
      'foundation price: missing',
      'minimum plot size: missing',
    ],
    sources: ['/th/products/unwind-series', '/en/projects (FAQ 4-5)', '/en/blogs/modular-house-price'],
  },
  timeline: {
    production_days: { min: shared.timeline.factory_production_days.min, max: shared.timeline.factory_production_days.max },
    delivery_at_production_percent: 70,
    onsite_assembly_days: shared.timeline.onsite_assembly_days.approx,
    design_phase_days: null,
    total_days: null,
    flags: ['design_phase_days: missing', 'total_days: not published'],
    sources: ['/en/process', '/en/products/unwind-series (FAQ 5)'],
  },
  module_system: {
    main_module_m: shared.module_system.main_module_size_m,
    text: L(shared.module_system.text.th, shared.module_system.text.en),
    relocatable: true,
    expandable: true,
  },
};
write('settings.json', settings);

/* -------------------------------------------------------------------- series */
const seriesRaw = products.series;
const series = seriesRaw.map((s) => ({
  id: s.id,
  slug: s.slug === 'upcoming-product' ? 'humble-series' : s.slug,
  legacy_path: `/products/${s.slug}`,
  name: L(s.name, s.name),
  status: s.status,
  concept: s.concept ? L(s.concept.th, s.concept.en) : null,
  tagline: s.tagline ? L(s.tagline.th, s.tagline.en) : null,
  headline: s.headline ? L(s.headline.th, s.headline.en) : null,
  intro: s.intro ? L(s.intro.th, s.intro.en) : s.seo_description ? L(s.seo_description.th ?? null, s.seo_description.en) : null,
  values: s.values ?? [],
  functions: s.flexible_functions ?? [],
  module_combinations: s.module_combinations ?? [],
  images: s.images ?? {},
  model_ids: (s.models ?? []).map((m) => m.id),
  starting_price_thb: s.id === 'unwind' ? 849000 : s.id === 'alive' ? 1690000 : null,
  price_status: s.id === 'unwind' ? 'pending-confirmation' : s.id === 'alive' ? 'consistent-on-site' : null,
  show_in_nav: s.status === 'available',
  show_in_finder: s.status === 'available',
  flags: [
    ...(s.id === 'unwind' ? ['starting_price: card 849,000 vs intro/FAQ 830,000 (pending)'] : []),
    ...(s.id === 'alive' ? ['intro.en: missing (live EN page shows Thai Unwind copy)', 'concept copied from Unwind (pending)', 'FAQ: none usable'] : []),
    ...(s.id === 'humble' ? ['coming soon: no specs, images or date', 'show in navigation? (client decision)'] : []),
  ],
  sources: [s.source_url.th, s.source_url.en],
}));
write('series.json', series);

/* -------------------------------------------------------------------- models */
const gallery = Object.fromEntries(projects.galleries.map((g) => [g.id, g]));
const pickCover = (g) => {
  if (!g) return null;
  const land = g.photos.filter((p) => p.width >= p.height).sort((a, b) => b.width - a.width);
  return (land[0] ?? g.photos[0])?.local_path ?? null;
};
// Finder/compare attributes taken from site copy; `basis` records the source of each tag.
const MODEL_EXTRA = {
  'unwind-standard': {
    slug: 'standard-type', sleeping: 'open-plan',
    uses: ['second-home', 'studio', 'retreat'],
    plot_fit: 'medium',
    basis: { uses: '/en/projects ("cozy retreat, private studio, or weekend getaway")', plot_fit: '/th/projects ("เหมาะสำหรับที่ดินขนาดกลาง")' },
  },
  'unwind-loft': {
    slug: 'loft-type', sleeping: 'loft',
    uses: ['second-home', 'retreat'],
    plot_fit: 'limited',
    basis: { uses: 'Unwind series intended use', plot_fit: '/en/projects ("ideal solution for limited land plots")' },
  },
  'unwind-1bed-2bath': {
    slug: '1-bed-2-bath', sleeping: 'separate',
    uses: ['primary-home', 'second-home', 'resort'],
    household: ['couple', 'small-family', 'retirees'],
    basis: {
      uses: '/en/blogs/modular-house-price ("genuinely livable second home for the long term"), /en/blogs/knockdown-house-ideas ("accommodates resort use")',
      household: '/en/products/unwind-series FAQ 3, /en/blogs/modular-house-price',
    },
  },
  'unwind-2bed-2bath': {
    slug: '2-bed-2-bath', sleeping: 'separate',
    uses: ['primary-home', 'second-home'],
    household: ['small-family', 'family'],
    basis: { uses: '/en/projects ("long-term living space"), /en/blogs/modular-house-price', household: '/en/projects, /en/blogs/modular-house-price' },
  },
  'alive-2bed-2bath': {
    slug: '2-bed-2-bath', sleeping: 'separate',
    uses: ['primary-home', 'second-home'],
    lifestyle: ['active', 'outdoor'],
    basis: { uses: 'derived: 2 bedrooms / 2 bathrooms (no use-case copy on site)', lifestyle: 'Alive tagline + values (Dynamic, Compact, Active, Outdoor Living)' },
  },
};
const LIFESTYLE = { unwind: ['calm', 'nature'], alive: ['active', 'outdoor'] };

// Galleries whose images look like 3D renders/visualisations rather than photos
// of completed homes (visual review, 2026-11-20). The live Projects page presents
// them as completed projects; the prototype must label them as visualisations.
const RENDER_GALLERIES = new Set(['unwind-2bed-2bath', 'alive-2bed-2bath']);

// Hand-picked covers: real exterior photographs where they exist.
const COVER = {
  'unwind-standard': '/images/source/projects/6973b6695263655c9f77d841_standard-11.webp',
  'unwind-loft': '/images/source/projects/6973b847f44a577ca1a7904b_loft-10.webp',
  'unwind-1bed-2bath': '/images/source/projects/6973bab42483e43311742af3_1bed-2bath-16.webp',
};

const models = [];
for (const s of seriesRaw) {
  for (const m of s.models ?? []) {
    const x = MODEL_EXTRA[m.id] ?? {};
    const card = m.price_thb.price_card;
    const alt = m.price_thb.intro_faq_and_blogs ?? null;
    const flags = [];
    if (m.price_thb.status === 'conflict') flags.push(`price: card ${card.toLocaleString('en')} vs FAQ/blog ${alt.toLocaleString('en')} (pending)`);
    if (m.area_status === 'conflict') flags.push('area breakdown: Standard 23+21≠43.5; terrace 21 vs 23 (pending)');
    if (m.bedrooms.status !== 'extracted') flags.push(`bedrooms: ${m.bedrooms.status}`);
    if (m.storeys_source?.startsWith('derived')) flags.push('storeys: derived from floor plan');
    if (!m.description?.en) flags.push('description.en: missing');
    if (!m.description?.th) flags.push('description.th: missing');
    flags.push('footprint / min plot size: missing');
    if (RENDER_GALLERIES.has(m.id)) flags.push('images: gallery appears to be 3D visualisations, not completed-home photos (pending)');
    models.push({
      id: m.id,
      slug: x.slug,
      series_id: s.id,
      path: `/homes/${s.slug}/${x.slug}`,
      legacy_path: `/products/${s.slug}`,
      name: L(m.name, m.name),
      full_name: L(`${s.name} ${m.name}`, `${s.name} ${m.name}`),
      price: {
        display_thb: card,
        alternate_thb: alt,
        vat_included: true,
        status: m.price_thb.status === 'conflict' ? 'pending-confirmation' : 'consistent-on-site',
        rule: 'Default display = price card (shown in both languages). Alternate kept until client confirms.',
      },
      area_sqm: {
        usable: m.usable_area_sqm,
        interior_incl_toilet: m.area_breakdown_sqm.interior_and_toilet,
        terrace: m.area_breakdown_sqm.outdoor_terrace,
        other: m.area_breakdown_sqm.outdoor_pet_house ? { pet_house: m.area_breakdown_sqm.outdoor_pet_house } : null,
        status: m.area_status === 'conflict' ? 'pending-confirmation' : 'consistent-on-site',
      },
      bedrooms: m.bedrooms.value,
      bathrooms: m.bathrooms.value,
      sleeping: x.sleeping,
      storeys: m.storeys,
      description: L(m.description?.th, m.description?.en),
      features: m.features?.en ? { en: m.features.en, th: null } : null,
      uses: x.uses ?? [],
      household: x.household ?? [],
      plot_fit: x.plot_fit ?? null,
      lifestyle: x.lifestyle ?? LIFESTYLE[s.id] ?? [],
      tag_basis: x.basis ?? {},
      images: {
        cover: COVER[m.id] ?? pickCover(gallery[m.id]),
        cover_is_visualisation: RENDER_GALLERIES.has(m.id),
        floor_plan: m.floor_plan_image,
        gallery_id: m.id,
      },
      video_youtube_id: m.video ? m.video.split('/').pop() : null,
      claims: m.claims ?? [],
      show_in_finder: true,
      show_in_compare: true,
      flags,
      sources: [m.source_url],
    });
  }
}
write('models.json', models, { price_display_rule: 'price card value; alternate retained; UI must show a pending badge while status = pending-confirmation' });

/* ----------------------------------------------------------------- materials */
const materials = shared.materials.map((m, i) => ({
  id: m.id,
  order: i + 1,
  name: L(m.label.th, m.label.en),
  text: L(m.text.th, m.text.en),
  image: m.image,
  applies_to: ['unwind', 'alive'],
  status: m.status === 'conflict' ? 'pending-confirmation' : 'consistent-on-site',
  flags: [
    ...(m.notes ? [m.notes] : []),
    'applies_to alive: live Alive page reuses the Unwind block (pending)',
  ],
  sources: ['/th/products/unwind-series', '/en/products/unwind-series'],
}));
write('materials.json', materials);

/* ------------------------------------------------------------- process steps */
const steps = site.process.steps.map((s) => ({
  id: `step-${s.n}`,
  order: s.n,
  title: L(s.title.th, s.title.en),
  text: L(s.text.th, s.text.en),
  duration: s.duration,
  image: s.image,
  sources: ['/th/process', '/en/process'],
}));
write('process-steps.json', steps);

/* ------------------------------------------------------- projects (galleries) */
const galleries = projects.galleries.map((g) => ({
  id: g.id,
  model_id: g.model_ref.split('#')[1],
  series_id: g.series.toLowerCase(),
  title: L(`${g.series} ${g.model}`, `${g.series} ${g.model}`),
  floor_plan: g.cover_floor_plan,
  media_type: RENDER_GALLERIES.has(g.id) ? 'visualisation-suspected' : 'photograph',
  photos: g.photos.map((p, i) => ({
    src: p.local_path,
    width: p.width,
    height: p.height,
    alt: L(`บ้าน ${g.series} ${g.model} ผลงานจริงของ Clay & Stone ภาพที่ ${i + 1}`,
           `Completed Clay & Stone ${g.series} ${g.model} home, photo ${i + 1}`),
    alt_status: 'draft',
  })),
  locations: projects.locations_mentioned
    .filter((l) => l.model_id === g.model_id || l.model_id === g.model_ref.split('#')[1])
    .map((l) => ({ province: l.location, source: l.source })),
  flags: ['photos not tagged to locations', 'no project names or dates', 'asset rights pending',
    ...(RENDER_GALLERIES.has(g.id) ? ['images appear to be 3D visualisations; must be labelled, not shown as completed projects'] : [])],
  sources: ['/th/projects', '/en/projects'],
}));
write('project-galleries.json', galleries);

const highlights = projects.locations_mentioned.filter((l) => l.image).map((l, i) => ({
  id: `highlight-${i + 1}`,
  model_id: l.model_id,
  province: l.location,
  image: l.image,
  sources: [l.source],
  flags: l.notes ? [l.notes] : [],
}));
write('project-highlights.json', highlights);

/* ---------------------------------------------------------------------- FAQs */
const TOPIC = {
  'faq-home-01': 'basics', 'faq-home-02': 'basics', 'faq-home-03': 'strength', 'faq-home-04': 'homes', 'faq-home-05': 'warranty',
  'faq-unwind-series-01': 'homes', 'faq-unwind-series-02': 'price', 'faq-unwind-series-03': 'homes',
  'faq-unwind-series-04': 'land', 'faq-unwind-series-05': 'timeline',
  'faq-projects-01': 'strength', 'faq-projects-02': 'strength', 'faq-projects-03': 'land', 'faq-projects-04': 'included',
  'faq-projects-05': 'land', 'faq-projects-06': 'homes', 'faq-projects-07': 'showroom',
};
const faqs = faq
  .filter((f) => f.verification_status !== 'source-error')
  .map((f, i) => {
    const flags = [];
    let visible = true;
    if (f.id === 'faq-unwind-series-02') { flags.push('quotes the FAQ price set (830k…2.66M) which conflicts with price cards — hidden until resolved'); visible = false; }
    if (f.id === 'faq-home-04') flags.push('TH mentions Unwind only; EN mentions Unwind + Alive');
    if (f.id === 'faq-projects-03') flags.push('TH typo on source: "สามาร สร้าง"');
    return {
      id: f.id,
      order: i + 1,
      topic: TOPIC[f.id] ?? 'general',
      series_id: f.source_page.endsWith('-series') ? f.source_page.replace('-series', '') : null,
      question: L(f.question.th, f.question.en),
      answer: L(f.answer.th, f.answer.en),
      links: f.links,
      visible,
      flags,
      sources: [f.source_url.th, f.source_url.en],
    };
  });
write('faqs.json', faqs, {
  excluded: faq.filter((f) => f.verification_status === 'source-error').map((f) => f.id),
  topics: ['basics', 'homes', 'price', 'strength', 'land', 'included', 'timeline', 'warranty', 'showroom'],
});

/* ------------------------------------------------------------- testimonials */
const testimonials = site.testimonials.items.map((t) => ({
  id: t.id,
  name: typeof t.name === 'string' ? L(t.name, t.name) : L(t.name.th, t.name.en),
  model_id: t.model ?? null,
  province: t.location ?? null,
  quote: L(t.quote.th, t.quote.en),
  photo: t.photo,
  consent: 'pending',
  featured: Boolean(t.model),
  flags: [
    'republication consent pending',
    ...(t.quote.th ? [] : ['quote.th: missing (English review on both language pages)']),
    ...(t.photo ? [] : ['photo: placeholder on live site']),
    ...(t.origin ? [t.origin] : []),
  ],
  sources: ['/th/about-us', '/en/about-us'],
}));
write('testimonials.json', testimonials);

/* ---------------------------------------------------------------------- team */
const team = site.about.team.map((p, i) => ({
  id: `team-${i + 1}`,
  order: i + 1,
  name: L(p.name, p.name),
  role: L(p.role.th, p.role.en ?? null),
  credentials: L(p.credentials_th.join('\n'), null),
  photo: p.photo,
  flags: ['role.en / credentials.en: missing (Thai only on live EN page)',
    ...(p.role.en_blog_byline ? [`blog byline says "${p.role.en_blog_byline}" (pending)`] : [])],
  sources: ['/th/about-us'],
}));
write('team.json', team);

/* ------------------------------------------------------------------ articles */
const articles = site.blog.articles.map((a) => ({
  id: a.slug,
  slug: a.slug,
  legacy_path: `/blogs/${a.slug}`,
  date: a.date,
  category: a.category,
  title: L(a.title.th, a.title.en),
  author_id: 'team-1',
  source_text: { th: `docs/source-archive/text/th_blogs_${a.slug.replaceAll('-', '_')}.txt`, en: `docs/source-archive/text/en_blogs_${a.slug.replaceAll('-', '_')}.txt` },
  flags: a.notes ? [a.notes] : [],
  sources: [`${SITE}/th/blogs/${a.slug}`, `${SITE}/en/blogs/${a.slug}`],
}));
write('articles.json', articles);

/* -------------------------------------------------------------------- videos */
const TOPIC_V = { 1: 'basics', 2: 'basics', 3: 'strength', 4: 'strength', 5: 'homes', 6: 'homes', 7: 'land' };
const videos = site.good_to_know_videos.map((v) => ({
  id: `ep-${v.ep}`,
  order: v.ep,
  youtube_id: v.youtube_id,
  title: L(v.title.th, v.title.en),
  topic: TOPIC_V[v.ep],
  thumbnail: `https://i.ytimg.com/vi/${v.youtube_id}/hqdefault.jpg`,
  upload_date: null,
  flags: ['upload_date: needed for VideoObject schema'],
  sources: ['/th/good-to-know', '/en/good-to-know'],
}));
write('videos.json', videos);

console.log('\nDone. Next: node tools/seed/validate-seed.mjs');
