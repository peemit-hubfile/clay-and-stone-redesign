// Reusable UI parts: section heading, badges, model card, spec list.
import { html, attrs, raw } from '../lib/html.js';
import { pick, formatTHB, formatSqm } from '../lib/content.js';
import { icon } from './icons.js';
import { href } from './layout.js';

export const sectionHead = ({ eyebrow, title, lead, id, align = 'start' }) => html`
<header class="section-head section-head--${align}">
  ${eyebrow ? html`<p class="eyebrow">${eyebrow}</p>` : ''}
  <h2 class="section-head__title"${attrs({ id })}>${title}</h2>
  ${lead ? html`<p class="section-head__lead">${lead}</p>` : ''}
</header>`;

export const badge = (text, tone = 'neutral', title = null) =>
  html`<span${attrs({ class: `badge badge--${tone}`, title })}>${text}</span>`;

// Short spec line items for a model.
export function modelSpecs(m, { t, lang }) {
  // English needs singular/plural; Thai does not inflect.
  const count = (n, key) => {
    const word = t(`model.${key}`);
    if (lang !== 'en') return `${n} ${word}`;
    return `${n} ${n === 1 ? word.replace(/s$/i, '') : word}`.toLowerCase().replace(/^(\d+) (\w)/, (_, d, c) => `${d} ${c}`);
  };
  const rooms = m.sleeping === 'open-plan'
    ? t('model.open_plan')
    : m.sleeping === 'loft'
      ? t('model.loft')
      : count(m.bedrooms, 'bedrooms');
  return [
    { icon: 'area', text: `${formatSqm(m.area_sqm.usable, lang)} ${t('model.sqm')}`, label: t('model.usable_area') },
    { icon: 'bed', text: rooms, label: t('model.bedrooms') },
    { icon: 'bath', text: m.bathrooms == null ? '–' : count(m.bathrooms, 'bathrooms'), label: t('model.bathrooms') },
    { icon: 'layers', text: count(m.storeys, 'storeys'), label: t('model.storeys') },
  ];
}

export const specList = (specs, cls = '') => html`
<ul class="spec-list ${cls}" role="list">
  ${specs.map((s) => html`<li>${icon(s.icon, { size: 18 })}<span class="visually-hidden">${s.label}: </span>${s.text}</li>`)}
</ul>`;

export function price(m, { t, lang, size = 'md' }) {
  const pending = m.price.status === 'pending-confirmation';
  return html`
<p class="price price--${size}">
  <span class="price__label">${t('model.price_from')}</span>
  <span class="price__value">${formatTHB(m.price.display_thb, lang)}</span>
  <span class="price__unit">${t('model.currency')} · ${t('model.price_incl_vat')}</span>
  ${pending ? badge(t('status.price_pending'), 'pending', lang === 'th' ? 'เว็บไซต์ปัจจุบันแสดงราคา 2 ชุด รอลูกค้ายืนยัน' : 'The live site shows two different prices; awaiting client confirmation') : ''}
</p>`;
}

export function modelCard(m, { t, lang, content, picture, priority = false, level = 3 }) {
  const series = content.series.find((s) => s.id === m.series_id);
  const name = pick(m.name, lang).text;
  const seriesName = pick(series.name, lang).text;
  const visual = m.images.cover_is_visualisation;
  return html`
<article class="model-card" data-series="${m.series_id}" data-model="${m.id}">
  <a class="model-card__link" href="${href(lang, m.path)}" data-track="view_product">
    <div class="model-card__media">
      ${picture(m.images.cover, { alt: `${seriesName} ${name}`, sizes: '(min-width: 64em) 30vw, (min-width: 48em) 45vw, 92vw', priority })}
      ${visual ? badge(t('status.visualisation'), 'overlay') : ''}
    </div>
    <div class="model-card__body">
      <p class="eyebrow">${seriesName}</p>
      ${raw(`<h${level} class="model-card__title">`)}${name}${raw(`</h${level}>`)}
      ${specList(modelSpecs(m, { t, lang }), 'spec-list--compact')}
      ${price(m, { t, lang, size: 'sm' })}
      <span class="model-card__cta">${t('cta.view_home')} ${icon('arrow-right', { size: 18 })}</span>
    </div>
  </a>
</article>`;
}

// Closing contact band (LINE first, then phone, email, showroom).
export function contactCta({ t, content, picture }) {
  const c = content.settings.contact;
  return html`
<section class="contact-cta" id="contact" aria-labelledby="contact-title">
  <div class="contact-cta__media">${picture('/images/source/projects/6973b669a84a9e740e476ed4_standard-07.webp', { alt: '', sizes: '100vw' })}</div>
  <div class="container contact-cta__inner">
    <div class="contact-cta__text">
      <h2 id="contact-title">${t('home.contact_title')}</h2>
      <p>${t('home.contact_lead')}</p>
    </div>
    <ul class="contact-options" role="list">
      <li><a class="contact-option contact-option--primary" href="${c.line.href}" rel="noopener" data-track="click_line">${icon('chat', { size: 22 })}<span><strong>${t('cta.line')}</strong>${c.line.display}</span></a></li>
      <li><a class="contact-option" href="${c.phone.href}" data-track="click_phone">${icon('phone', { size: 22 })}<span><strong>${t('cta.call')}</strong>${c.phone.display}</span></a></li>
      <li><a class="contact-option" href="${c.email.href}" data-track="click_email">${icon('mail', { size: 22 })}<span><strong>${t('cta.email')}</strong>${c.email.display}</span></a></li>
      <li><a class="contact-option" href="https://www.google.com/maps/search/?api=1&amp;query=${c.showroom.geo.lat},${c.showroom.geo.lng}" rel="noopener" data-track="click_map">${icon('map-pin', { size: 22 })}<span><strong>${t('cta.visit_showroom')}</strong>${t('footer.by_appointment')}</span></a></li>
    </ul>
  </div>
</section>`;
}
