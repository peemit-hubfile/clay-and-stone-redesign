// Document shell: <head> (SEO, hreflang, OG, JSON-LD), header, footer.
import { html, raw, attrs } from '../lib/html.js';
import { makeT, pick } from '../lib/content.js';
import { icon } from './icons.js';

export const SITE_URL = (process.env.SITE_URL || 'http://localhost:5173').replace(/\/$/, '');
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
        ${NAV.map((n) => html`<li><a class="site-nav__link"${attrs({ href: href(lang, n.path), 'aria-current': path === n.path ? 'page' : null })}>${t(`nav.${n.key}`)}</a></li>`)}
      </ul>
    </nav>
    <div class="site-header__actions">
      ${langSwitch({ lang, t, path, className: 'site-header__lang' })}
      <a class="btn btn--line btn--sm btn--rect site-header__cta" href="${href(lang, 'contact')}" data-track="click_contact">${t('nav.cta')}</a>
      <a class="menu-toggle" href="#site-menu" aria-controls="site-menu" aria-expanded="false" data-menu-toggle>
        <span class="menu-toggle__label">${t('nav.menu')}</span><span class="menu-toggle__bars" aria-hidden="true"></span>
      </a>
    </div>
  </div>
  <dialog class="mobile-menu" id="site-menu" aria-label="${t('nav.menu')}">
    <div class="mobile-menu__top container">
      <span class="wordmark" aria-hidden="true"><span class="wordmark__clay">CLAY</span><span class="wordmark__stone">&amp; stone</span></span>
      <button class="menu-close" type="button" data-menu-close><span class="menu-toggle__label">${t('nav.close')}</span>${icon('x', { size: 22 })}</button>
    </div>
    <nav class="mobile-menu__nav container" aria-label="${lang === 'th' ? 'เมนูหลัก' : 'Main'}">
      <ol class="mobile-menu__list" role="list">
        ${[
          ['homes', 'homes'], ['compare', 'compare'], ['home-finder', 'finder'],
          ...NAV.slice(1).map((n) => [n.path, n.key]), ['contact', 'contact'],
        ].map(([p, key], i) => html`<li><a${attrs({ href: href(lang, p), 'aria-current': path === p ? 'page' : null })}><span class="mobile-menu__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>${t(`nav.${key}`)}</a></li>`)}
      </ol>
      <div class="mobile-menu__actions">
        <a class="btn btn--primary btn--rect" href="${line}" rel="noopener" data-track="click_line">${icon('chat')}${t('cta.line')}</a>
        <a class="btn btn--line btn--rect" href="${content.settings.contact.phone.href}" data-track="click_phone">${icon('phone')}${content.settings.contact.phone.display}</a>
        ${langSwitch({ lang, t, path, className: 'mobile-menu__lang' })}
      </div>
    </nav>
  </dialog>
</header>`;
}

function footer({ lang, t, content }) {
  const c = content.settings.contact;
  return html`
<footer class="site-footer" id="site-footer">
  <div class="container site-footer__grid">
    <div class="site-footer__brand">
      <a class="wordmark wordmark--light" href="${href(lang)}"><span class="wordmark__clay">CLAY</span><span class="wordmark__stone">&amp; stone</span></a>
      <p class="site-footer__tagline">${pick(content.settings.brand.taglines[0], lang).text.replace(/^"|"$/g, '').replace(/\.{3,}\s*/, '… ')}</p>
    </div>
    <div>
      <h2 class="site-footer__heading">${t('footer.showroom')}</h2>
      <address class="site-footer__address">
        ${pick(c.showroom.address, lang).text}<br>
        <span class="muted">${t('footer.by_appointment')}</span>
      </address>
    </div>
    <div>
      <h2 class="site-footer__heading">${t('nav.contact')}</h2>
      <ul class="site-footer__list" role="list">
        <li><a href="${c.line.href}" rel="noopener" data-track="click_line">LINE ${c.line.display}</a></li>
        <li><a href="${c.phone.href}" data-track="click_phone">${c.phone.display}</a></li>
        <li><a href="${c.email.href}" data-track="click_email">${c.email.display}</a></li>
      </ul>
    </div>
    <nav aria-label="${lang === 'th' ? 'เมนูท้ายเว็บ' : 'Footer'}" id="footer-nav">
      <h2 class="site-footer__heading">Clay &amp; Stone</h2>
      <ul class="site-footer__list" role="list">
        <li><a href="${href(lang, 'homes')}">${t('nav.homes')}</a></li>
        ${NAV.slice(1).map((n) => html`<li><a href="${href(lang, n.path)}">${t(`nav.${n.key}`)}</a></li>`)}
        <li><a href="${href(lang, 'contact')}">${t('nav.contact')}</a></li>
      </ul>
    </nav>
  </div>
  <div class="container site-footer__bottom">
    <ul class="social" role="list">
      <li><a href="${c.social.facebook}" rel="noopener">${icon('facebook', { label: 'Facebook' })}</a></li>
      <li><a href="${c.social.instagram}" rel="noopener">${icon('instagram', { label: 'Instagram' })}</a></li>
      <li><a href="${c.social.line}" rel="noopener" data-track="click_line">${icon('chat', { label: 'LINE' })}</a></li>
    </ul>
    <p class="site-footer__notice">${icon('info', { size: 16 })} ${t('footer.prototype_notice')}</p>
    <p class="muted">${t('footer.rights')}</p>
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
<html lang="${lang}" class="no-js">
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
<meta name="theme-color" content="#f6f3ee">
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
