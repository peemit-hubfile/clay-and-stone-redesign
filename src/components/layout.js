// Document shell: <head> (SEO, hreflang, OG, JSON-LD), header, footer.
import { html, raw, attrs } from '../lib/html.js';
import { makeT, pick, formatTHB } from '../lib/content.js';
import { makePicture } from '../lib/picture.js';
import { icon } from './icons.js';

export const SITE_URL = (process.env.SITE_URL || 'http://localhost:5173').replace(/\/$/, '');
// Showcase build (docs/showcase.md): only the homepage is published; links to other
// pages show a short notice instead of navigating. Optional expiry date (YYYY-MM-DD).
export const SHOWCASE = process.env.SHOWCASE === '1';
export const SHOWCASE_EXPIRES = process.env.SHOWCASE_EXPIRES || '';
export const href = (lang, path = '') => `/${lang}/${path ? path.replace(/^\/|\/$/g, '') + '/' : ''}`;

export const NAV = [
  { key: 'homes', path: 'homes' },
  { key: 'projects', path: 'projects' },
  { key: 'how_we_build', path: 'how-we-build' },
  { key: 'knowledge', path: 'knowledge' },
  { key: 'about', path: 'about' },
];

// "TH / EN": current language shown as text, the other one is the link.
function langSwitch({ lang, t, path, className = '' }) {
  const item = (code) => (code === lang
    ? html`<span class="lang-switch__item" aria-current="true"><span aria-hidden="true">${code.toUpperCase()}</span><span class="visually-hidden">${code === 'th' ? 'ภาษาไทย' : 'English'}</span></span>`
    : html`<a class="lang-switch__item" href="${href(code, path)}" hreflang="${code}" lang="${code}"><span aria-hidden="true">${code.toUpperCase()}</span><span class="visually-hidden">${code === 'th' ? 'ภาษาไทย' : 'English'}</span></a>`);
  return html`<div class="lang-switch ${className}" role="group" aria-label="${t('nav.language')}">${item('th')}<span class="lang-switch__sep" aria-hidden="true">/</span>${item('en')}</div>`;
}

// Header v2 (docs/header-v2.md): stays on screen and compacts on scroll; "แบบบ้าน"
// opens a panel with the five models (photo, size, starting price) and the shortcuts
// to compare and the Home Finder. Without JS the link simply goes to /homes/.
function megaHomes({ lang, t, content }) {
  const picture = makePicture(content.images);
  const L = (v) => pick(v, lang).text;
  // Grouped by series so the series name is said once, not on every card.
  const groups = content.series
    .map((sr) => ({ sr, models: content.models.filter((m) => m.series_id === sr.id) }))
    .filter((g) => g.models.length);
  return html`
  <div class="mega" id="mega-homes" data-mega hidden>
    <div class="mega__inner container">
      <div class="mega__groups" style="--total:${content.models.length}">
        ${groups.map((g) => html`<section class="mega__group" aria-labelledby="mega-${g.sr.id}" style="--n:${g.models.length}">
          <h2 class="mega__series" id="mega-${g.sr.id}">${L(g.sr.name)} <span>${g.models.length} ${lang === 'th' ? 'แบบ' : g.models.length === 1 ? 'home' : 'homes'}</span></h2>
          <ul class="mega__models" role="list">
            ${g.models.map((m) => html`<li>
              <a class="mega__model" href="${href(lang, m.path)}">
                <span class="mega__photo">${picture(MEGA_PHOTOS[m.id] ?? m.images.cover, { alt: '', sizes: '16rem' })}${!MEGA_PHOTOS[m.id] && m.images.cover_is_visualisation ? html`<span class="mega__render">${t('status.visualisation')}</span>` : ''}</span>
                <span class="mega__name">${L(m.name)}</span>
                <span class="mega__meta"><span>${m.area_sqm.usable} ${t('model.sqm')}</span><span class="mega__price">${formatTHB(m.price.display_thb, lang)} ${t('model.currency')}</span></span>
              </a></li>`)}
          </ul>
        </section>`)}
      </div>
      <div class="mega__side">
        <a class="mega__all" href="${href(lang, 'homes')}">${t('footer.all_homes')} ${icon('arrow-right', { size: 18 })}</a>
        <a class="mega__link" href="${href(lang, 'compare')}">${t('nav.compare')} ${icon('arrow-right', { size: 16 })}</a>
        <a class="mega__link" href="${href(lang, 'home-finder')}">${t('nav.finder')} ${icon('arrow-right', { size: 16 })}</a>
      </div>
    </div>
  </div>
  <div class="mega-scrim" data-mega-scrim hidden></div>`;
}

// Mobile menu: the models as a swipeable row of small photo cards, so the menu opens
// on the homes themselves rather than on a list of words.
function mobileHomes({ lang, t, content, path }) {
  const picture = makePicture(content.images);
  const L = (v) => pick(v, lang).text;
  return html`<section class="mm-homes" aria-labelledby="mm-homes-title">
    <div class="mm-head container">
      <h2 class="mm-label" id="mm-homes-title">${t('nav.homes')} <span>${content.models.length}</span></h2>
      <a${attrs({ class: 'mm-all', href: href(lang, 'homes'), 'aria-current': path === 'homes' ? 'page' : null })}>${lang === 'th' ? 'ดูทั้งหมด' : 'View all'} ${icon('arrow-right', { size: 14 })}</a>
    </div>
    <ul class="mm-rail" role="list">
      ${content.models.map((m, i) => html`<li style="--i:${i}"><a class="mm-card" href="${href(lang, m.path)}">
        <span class="mm-card__photo">${picture(MEGA_PHOTOS[m.id] ?? m.images.cover, { alt: '', sizes: '11rem' })}</span>
        <span class="mm-card__name">${L(m.name)}</span>
        <span class="mm-card__meta">${m.area_sqm.usable} ${t('model.sqm')} · ${formatTHB(m.price.display_thb, lang)}</span>
      </a></li>`)}
    </ul>
  </section>`;
}

// Real photographs for the panel where the cover is a render or a tight crop.
const MEGA_PHOTOS = {
  'unwind-standard': '/images/source/projects/6973b669fbc3fdd253829882_standard-13.webp',
  'unwind-loft': '/images/source/projects/6973b8474458238b820645c1_loft-13.webp',
};

function header({ lang, t, path, content }) {
  const line = content.settings.contact.line.href;
  return html`
<header class="site-header" data-header>
  <div class="site-header__inner container">
    <a class="wordmark" href="${href(lang)}" aria-label="Clay &amp; Stone — ${t('nav.homes')}">
      <span class="wordmark__clay">CLAY</span><span class="wordmark__stone">&amp; stone</span>
    </a>
    <nav class="site-nav" aria-label="${lang === 'th' ? 'เมนูหลัก' : 'Main'}">
      <ul class="site-nav__list" role="list">
        ${NAV.map((n) => html`<li><a class="site-nav__link"${attrs({ href: href(lang, n.path), 'aria-current': path === n.path ? 'page' : null, 'data-mega-toggle': n.key === 'homes' ? '' : null, 'aria-controls': n.key === 'homes' ? 'mega-homes' : null })}>${t(`nav.${n.key}`)}${n.key === 'homes' ? icon('chevron-down', { size: 14 }) : ''}</a></li>`)}
      </ul>
    </nav>
    <div class="site-header__actions">
      ${langSwitch({ lang, t, path, className: 'site-header__lang' })}
      <a class="btn btn--primary btn--sm btn--rect site-header__cta" href="${href(lang, 'contact')}" data-track="click_contact">${t('nav.cta')} ${icon('arrow-right', { size: 16 })}</a>
      <a class="menu-toggle" href="#site-menu" aria-controls="site-menu" aria-expanded="false" data-menu-toggle>
        <span class="menu-toggle__label">${t('nav.menu')}</span><span class="menu-toggle__bars" aria-hidden="true"></span>
      </a>
    </div>
  </div>
  <span class="site-header__progress" aria-hidden="true"></span>
  ${megaHomes({ lang, t, content })}
  <dialog class="mobile-menu" id="site-menu" aria-label="${t('nav.menu')}">
    <div class="mobile-menu__top container">
      <span class="wordmark" aria-hidden="true"><span class="wordmark__clay">CLAY</span><span class="wordmark__stone">&amp; stone</span></span>
      ${langSwitch({ lang, t, path, className: 'mobile-menu__lang' })}
      <button class="menu-close" type="button" data-menu-close aria-label="${t('nav.close')}">${icon('x', { size: 20 })}</button>
    </div>
    <nav class="mobile-menu__body" aria-label="${lang === 'th' ? 'เมนูหลัก' : 'Main'}">
      ${mobileHomes({ lang, t, content, path })}
      <div class="mm-tiles container">
        <a${attrs({ class: 'mm-tile', href: href(lang, 'compare'), 'aria-current': path === 'compare' ? 'page' : null, style: '--i:1' })}>${icon('layers', { size: 20 })}<span class="mm-tile__name">${t('nav.compare')}</span><span class="mm-tile__hint">${lang === 'th' ? 'เทียบขนาดและราคา' : 'Size and price side by side'}</span></a>
        <a${attrs({ class: 'mm-tile', href: href(lang, 'home-finder'), 'aria-current': path === 'home-finder' ? 'page' : null, style: '--i:2' })}>${icon('key', { size: 20 })}<span class="mm-tile__name">${t('nav.finder')}</span><span class="mm-tile__hint">${lang === 'th' ? 'ตอบคำถามสั้น ๆ' : 'Answer a few questions'}</span></a>
      </div>
      <ul class="mm-links container" role="list">
        ${[...NAV.slice(1).map((n) => [n.path, n.key]), ['contact', 'contact']].map(([p, key], i) => html`<li style="--i:${i + 3}"><a${attrs({ href: href(lang, p), 'aria-current': path === p ? 'page' : null })}>${t(`nav.${key}`)}${icon('arrow-right', { size: 16 })}</a></li>`)}
      </ul>
    </nav>
    <div class="mobile-menu__bar container">
      <a class="btn btn--primary" href="${line}" rel="noopener" data-track="click_line">${icon('chat', { size: 18 })}${t('cta.line')}</a>
      <a class="btn btn--line mm-call" href="${content.settings.contact.phone.href}" data-track="click_phone" aria-label="${content.settings.contact.phone.display}">${icon('phone', { size: 18 })}</a>
    </div>
  </dialog>
</header>`;
}

// Footer v2 (docs/footer-v2.md): brand line + back to top, four useful columns
// (homes, menu, contact, showroom with directions), a full-width wordmark, then the
// social links, prototype notice and rights line.
function footer({ lang, t, content }) {
  const c = content.settings.contact;
  const L = (v) => pick(v, lang).text;
  const tagline = L(content.settings.brand.taglines[0]).replace(/^"|"$/g, '').replace(/\.{3,}\s*/, '…\n');
  const seriesName = (m) => L(content.series.find((s) => s.id === m.series_id).name).replace(/\s*Series$/, '');
  const geo = c.showroom.geo;
  const directions = geo ? `https://www.google.com/maps/search/?api=1&query=${geo.lat},${geo.lng}` : null;
  return html`
<footer class="site-footer" id="site-footer">
  <div class="container">
    <div class="site-footer__top">
      <p class="site-footer__statement">${tagline.split('\n').map((line, i) => html`${i ? html`<br>` : ''}${line}`)}</p>
      <a class="site-footer__top-link" href="#top" data-back-to-top>${t('footer.back_to_top')} ${icon('arrow-up', { size: 18 })}</a>
    </div>

    <div class="site-footer__grid">
      <nav class="site-footer__col site-footer__col--homes" aria-labelledby="footer-homes">
        <h2 class="site-footer__heading" id="footer-homes">${t('nav.homes')}</h2>
        <ul class="site-footer__list" role="list">
          ${content.models.map((m) => html`<li><a href="${href(lang, m.path)}"><span class="site-footer__series">${seriesName(m)}</span> ${L(m.name)}</a></li>`)}
          <li><a class="site-footer__more" href="${href(lang, 'homes')}">${t('footer.all_homes')} ${icon('arrow-right', { size: 16 })}</a></li>
        </ul>
      </nav>
      <nav class="site-footer__col site-footer__col--menu" aria-labelledby="footer-menu" id="footer-nav">
        <h2 class="site-footer__heading" id="footer-menu">${t('footer.menu')}</h2>
        <ul class="site-footer__list" role="list">
          ${NAV.slice(1).map((n) => html`<li><a href="${href(lang, n.path)}">${t(`nav.${n.key}`)}</a></li>`)}
          <li><a href="${href(lang, 'contact')}">${t('nav.contact')}</a></li>
        </ul>
      </nav>
      <div class="site-footer__col site-footer__col--contact">
        <h2 class="site-footer__heading">${t('nav.contact')}</h2>
        <ul class="site-footer__list site-footer__contact" role="list">
          <li><a href="${c.line.href}" rel="noopener" data-track="click_line">${icon('chat', { size: 18 })}<span>LINE ${c.line.display}</span>${icon('arrow-up-right', { size: 16 })}</a></li>
          <li><a href="${c.phone.href}" data-track="click_phone">${icon('phone', { size: 18 })}<span>${c.phone.display}</span>${icon('arrow-up-right', { size: 16 })}</a></li>
          <li><a href="${c.email.href}" data-track="click_email">${icon('mail', { size: 18 })}<span>${c.email.display}</span>${icon('arrow-up-right', { size: 16 })}</a></li>
        </ul>
      </div>
      <div class="site-footer__col site-footer__col--visit">
        <h2 class="site-footer__heading">${t('footer.showroom')}</h2>
        <address class="site-footer__address">${L(c.showroom.address)}</address>
        <p class="site-footer__note">${t('footer.by_appointment')}</p>
        ${directions ? html`<a class="site-footer__directions" href="${directions}" rel="noopener" target="_blank" data-track="click_directions">${icon('map-pin', { size: 16 })}${t('footer.directions')}<span class="visually-hidden"> (${t('footer.new_tab')})</span></a>` : ''}
      </div>
    </div>

    <p class="site-footer__wordmark" aria-hidden="true" data-a="CLAY" data-b="&amp; stone"></p>

    <div class="site-footer__bottom">
      <ul class="social" role="list">
        <li><a href="${c.social.facebook}" rel="noopener">${icon('facebook', { label: 'Facebook' })}</a></li>
        <li><a href="${c.social.instagram}" rel="noopener">${icon('instagram', { label: 'Instagram' })}</a></li>
        <li><a href="${c.social.line}" rel="noopener" data-track="click_line">${icon('chat', { label: 'LINE' })}</a></li>
      </ul>
      <p class="site-footer__notice">${icon('info', { size: 16 })} ${t('footer.prototype_notice')}</p>
      <p class="muted">${t('footer.rights')}</p>
    </div>
  </div>
</footer>`;
}

function organizationLd(content) {
  const c = content.settings.contact;
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: 'Clay & Stone',
    alternateName: 'Clay and Stone',
    url: 'https://www.clayandstone.co.th/',
    telephone: c.phone.href.replace('tel:', ''),
    email: c.email.display,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '152/1 Soi Tiwanon 45',
      addressLocality: 'Ta Sai, Mueang Nonthaburi',
      addressRegion: 'Nonthaburi',
      postalCode: '11000',
      addressCountry: 'TH',
    },
    geo: { '@type': 'GeoCoordinates', latitude: c.showroom.geo.lat, longitude: c.showroom.geo.lng },
    sameAs: [c.social.facebook, c.social.instagram, c.social.line],
  };
}

export function page({ lang, content, path = '', title, description, body, bodyClass = '', jsonLd = [] }) {
  const t = makeT(content.i18n[lang]);
  const url = `${SITE_URL}${href(lang, path)}`;
  const ld = [organizationLd(content), ...jsonLd];
  return html`<!doctype html>
<html lang="${lang}" class="no-js"${attrs(SHOWCASE ? { 'data-showcase': '', 'data-expires': SHOWCASE_EXPIRES || null } : {})}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="th" href="${SITE_URL}${href('th', path)}">
<link rel="alternate" hreflang="en" href="${SITE_URL}${href('en', path)}">
<link rel="alternate" hreflang="x-default" href="${SITE_URL}${href('th', path)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="${lang === 'th' ? 'th_TH' : 'en_US'}">
<meta name="theme-color" content="#ffffff">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script>document.documentElement.classList.replace('no-js','js')</script>
${lang === 'th'
    ? raw('<link rel="preload" href="/fonts/ibm-plex-sans-thai-thai-400-normal.woff2" as="font" type="font/woff2" crossorigin>\n<link rel="preload" href="/fonts/ibm-plex-sans-thai-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>')
    : raw('<link rel="preload" href="/fonts/manrope-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>')}
<link rel="stylesheet" href="/styles/main.css">
<script type="module" src="/scripts/main.js"></script>
${ld.map((o) => html`<script type="application/ld+json">${raw(JSON.stringify(o).replace(/</g, '\\u003c'))}</script>`)}
</head>
<body class="${bodyClass}">
<a class="skip-link" href="#main">${t('nav.skip')}</a>
${header({ lang, t, path, content })}
<main id="main" tabindex="-1">
${body}
</main>
${footer({ lang, t, content })}
</body>
</html>
`;
}
