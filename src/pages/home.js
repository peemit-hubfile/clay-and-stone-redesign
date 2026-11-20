import { html, raw, attrs } from '../lib/html.js';
import { makeT, pick, formatTHB, formatSqm } from '../lib/content.js';
import { makePicture } from '../lib/picture.js';
import { page, href } from '../components/layout.js';
import { icon } from '../components/icons.js';
import { sectionHead, modelCard, badge } from '../components/ui.js';

const HERO_DESKTOP = '/images/source/misc/694722e5b5351c705601b75d_contact-banner.webp';
const HERO_MOBILE = '/images/source/projects/6973b6693b8e7980743e0415_standard-15.webp';
const INTRO_IMAGES = [
  '/images/source/projects/6973b847f44a577ca1a7904b_loft-10.webp',
  '/images/source/projects/6973bab4f4d3090f50540ba0_1bed-2bath-11.webp',
];
const FEATURED_FAQ = ['faq-home-01', 'faq-home-02', 'faq-home-03', 'faq-projects-04', 'faq-unwind-series-04', 'faq-unwind-series-05', 'faq-projects-07'];
const PROJECT_PICKS = [
  { gallery: 'unwind-1bed-2bath', photo: 0 },
  { gallery: 'unwind-standard', photo: 3 },
  { gallery: 'unwind-loft', photo: 1 },
  { gallery: 'unwind-standard', photo: 6 },
  { gallery: 'unwind-1bed-2bath', photo: 5 },
];
const PROVINCES_TH = { Nonthaburi: 'นนทบุรี', Prachinburi: 'ปราจีนบุรี', Suphanburi: 'สุพรรณบุรี', Saraburi: 'สระบุรี', Bangkok: 'กรุงเทพฯ' };

const paragraphs = (text) => text.split(/\n{2,}/).map((p) => html`<p>${p}</p>`);

export function renderHome({ lang, content }) {
  const t = makeT(content.i18n[lang]);
  const picture = makePicture(content.images);
  const { settings, models, series } = content;
  const L = (v) => pick(v, lang).text;
  const available = models.filter((m) => m.show_in_finder);
  const minPrice = Math.min(...available.map((m) => m.price.display_thb));
  const minModel = available.find((m) => m.price.display_thb === minPrice);
  const seo = {
    th: { title: 'บ้านโมดูลาร์ บ้านสำเร็จรูป ดีไซน์โมเดิร์น พร้อมติดตั้ง | Clay & Stone', description: 'เลือกชมแบบบ้านสำเร็จรูป หลากหลายสไตล์ในระบบ Modular มาตรฐานจากบริษัทสร้างบ้านสำเร็จรูปพร้อมติดตั้งที่ตอบโจทย์ทุกการอยู่อาศัย' },
    en: { title: 'Modern Modular Houses in Thailand | Clay & Stone', description: 'Experience the future of living with premium modular homes and modern modular house designs featuring precision engineering and trusted quality.' },
  }[lang];

  /* 01 Hero ------------------------------------------------------------- */
  const hero = html`
<section class="hero" aria-labelledby="hero-title">
  <div class="hero__media" data-hero-media>
    ${picture(HERO_DESKTOP, { alt: lang === 'th' ? 'บ้าน Unwind Standard Type ของ Clay & Stone พร้อมระเบียงไม้และชายคายื่นยาว' : 'A Clay & Stone Unwind Standard Type home with a timber deck and deep eaves', sizes: '100vw', priority: true, art: [{ media: '(max-width: 47.99em)', src: HERO_MOBILE }] })}
  </div>
  <div class="hero__content container">
    <p class="eyebrow eyebrow--light" data-reveal-hero>${t('home.hero_eyebrow')}</p>
    <h1 class="hero__title" id="hero-title" data-reveal-hero>${L(settings.brand.taglines[0]).replace(/^"|"$/g, '').split(/\.{3,}\s*/).map((part, i) => (i ? html`<span class="hero__title-line">…${part}</span>` : html`<span class="hero__title-line">${part}</span>`))}</h1>
    <p class="hero__lead" data-reveal-hero>${t('home.hero_lead')}</p>
    <p class="hero__price" data-reveal-hero>
      ${t('model.price_from')} <strong>${formatTHB(minPrice, lang)} ${t('model.currency')}</strong> <span>(${t('model.price_incl_vat')})</span>
      ${minModel.price.status === 'pending-confirmation' ? badge(t('status.price_pending'), 'pending-light') : ''}
    </p>
    <div class="hero__actions" data-reveal-hero>
      <a class="btn btn--light" href="#homes" data-track="hero_explore">${t('cta.explore_homes')} ${icon('arrow-right', { size: 18 })}</a>
      <a class="btn btn--outline-light" href="#contact" data-track="hero_contact">${t('cta.talk_to_us')}</a>
    </div>
  </div>
  <ul class="hero__facts container" role="list" data-reveal-hero>
    <li>${icon('clock')}${t('home.facts_onsite')}</li>
    <li>${icon('shield')}${t('home.facts_warranty')}</li>
    <li>${icon('truck')}${t('home.facts_install')}</li>
  </ul>
</section>`;

  /* 02 Brand intro ----------------------------------------------------------- */
  const strengths = [
    { title: { th: 'มาตรฐานใหม่ของ "บ้านสำเร็จรูป"', en: 'Modular Homes Beyond Prefab' }, text: { th: 'Clay & Stone ออกแบบบ้านสำเร็จรูปที่ฉีกทุกกฎเดิมๆ ด้วยดีไซน์โดดเด่น ทั้งชายคายื่นยาว ระเบียงกว้าง และฟังก์ชันที่สวยงามลงตัว', en: "Extended roof overhangs, spacious verandas and balanced designs that respond to the real lifestyles of Thai people." } },
    { title: { th: 'งานได้มาตรฐาน ตรงตามแบบที่เลือก', en: 'Built True to Design' }, text: { th: 'ทุกขั้นตอนการออกแบบและก่อสร้าง อยู่ภายใต้การดูแลของสถาปนิกและวิศวกรมืออาชีพ', en: 'Every stage of design, construction and installation is overseen by professional architects and engineers.' } },
    { title: { th: 'บริการหลังการขายที่วางใจได้', en: 'After-Sales You Can Rely On' }, text: { th: 'ดูแลหลังการขายโดยทีม Clay & Stone โดยตรง ไม่ใช่แค่วันส่งมอบ แต่ตลอดการใช้งาน', en: 'After-sales service comes directly from the Clay & Stone team, not just at handover but for the life of your home.' } },
  ];
  const intro = html`
<section class="section intro" aria-labelledby="intro-title">
  <div class="container intro__grid">
    <div class="intro__text" data-reveal>
      <p class="eyebrow">Homes Beyond Prefab</p>
      <h2 class="intro__statement" id="intro-title">${L(settings.brand.positioning)}</h2>
      <p class="intro__body">${L(settings.brand.description)}</p>
    </div>
    <figure class="intro__media" data-reveal>
      ${picture(INTRO_IMAGES[0], { alt: lang === 'th' ? 'บ้าน Unwind Loft Type สองชั้นท่ามกลางต้นไม้' : 'Two-storey Unwind Loft Type home among trees', sizes: '(min-width: 64em) 34vw, 90vw', className: 'intro__img intro__img--a' })}
      ${picture(INTRO_IMAGES[1], { alt: lang === 'th' ? 'ระเบียงไม้ของบ้าน Unwind 1 Bed 2 Bath' : 'Timber terrace of an Unwind 1 Bed 2 Bath home', sizes: '(min-width: 64em) 22vw, 50vw', className: 'intro__img intro__img--b' })}
    </figure>
  </div>
  <ol class="container strengths" role="list">
    ${strengths.map((s, i) => html`<li class="strength" data-reveal><span class="strength__num">0${i + 1}</span><h3>${L(s.title)}</h3><p>${L(s.text)}</p></li>`)}
  </ol>
</section>`;

  /* 03 Our homes ------------------------------------------------------------- */
  const live = series.filter((s) => s.status === 'available');
  const homes = html`
<section class="section homes" id="homes" aria-labelledby="homes-title">
  <div class="container">
    <div class="homes__head">
      ${sectionHead({ eyebrow: t('nav.homes'), title: t('home.homes_title'), lead: t('home.homes_lead'), id: 'homes-title' })}
      <div class="filter" role="group" aria-label="${t('home.filter_label')}" data-filter hidden>
        <button type="button" class="chip" aria-pressed="true" data-filter-value="all">${t('home.filter_all')}</button>
        ${live.map((s) => html`<button type="button" class="chip" aria-pressed="false" data-filter-value="${s.id}">${L(s.name)}</button>`)}
      </div>
    </div>
    ${live.map((s) => {
      const ms = available.filter((m) => m.series_id === s.id);
      const from = Math.min(...ms.map((m) => m.price.display_thb));
      return html`
    <div class="series-block${ms.length === 1 ? ' series-block--single' : ''}" data-series-block="${s.id}">
      <header class="series-block__head">
        <h3 class="series-block__name">${L(s.name)}</h3>
        <p class="series-block__tagline">${s.tagline.en}</p>
        <p class="series-block__meta">${s.values.join(' · ')}</p>
        <p class="series-block__meta">${ms.length} ${lang === 'th' ? 'แบบ' : ms.length > 1 ? 'homes' : 'home'} · ${t('model.price_from')} ${formatTHB(from, lang)} ${t('model.currency')}</p>
      </header>
      <div class="model-grid">${ms.map((m) => modelCard(m, { t, lang, content, picture, level: 4 }))}</div>
    </div>`;
    })}
    <p class="homes__more"><a class="link-arrow" href="${href(lang, 'compare')}">${t('nav.compare')} ${icon('arrow-right', { size: 18 })}</a></p>
  </div>
</section>`;

  /* 04 Smart Home Finder (inline) --------------------------------------------- */
  const f = content.finder;
  const finderData = {
    lang,
    finder: f,
    i18n: content.i18n[lang].finder,
    status: content.i18n[lang].status,
    labels: { price_from: t('model.price_from'), currency: t('model.currency'), view: t('cta.view_home'), line: t('cta.line'), sqm: t('model.sqm') },
    line: settings.contact.line.href,
    models: available.map((m) => ({
      id: m.id, name: `${L(series.find((s) => s.id === m.series_id).name)} ${L(m.name)}`, url: href(lang, m.path),
      price: m.price, area_sqm: m.area_sqm, bedrooms: m.bedrooms, bathrooms: m.bathrooms, sleeping: m.sleeping,
      uses: m.uses, household: m.household, plot_fit: m.plot_fit, lifestyle: m.lifestyle, show_in_finder: true,
    })),
  };
  const finder = html`
<section class="section finder" id="finder" aria-labelledby="finder-title">
  <div class="container finder__grid">
    <div class="finder__intro">
      <p class="eyebrow">${t('home.finder_eyebrow')}</p>
      <h2 class="finder__title" id="finder-title">${L(f.intro.title)}</h2>
      <p class="finder__lead">${L(f.intro.lead)}</p>
      <p class="finder__disclaimer">${icon('info', { size: 16 })} ${L(f.intro.disclaimer)}</p>
    </div>
    <div class="finder__panel" data-finder>
      <noscript><p>${t('home.finder_noscript')} <a href="${href(lang, 'home-finder')}">${t('nav.finder')}</a></p></noscript>
      <form class="finder__form" data-finder-form hidden novalidate>
        <div class="finder__progress"><span data-finder-step></span><span class="finder__bar"><span data-finder-bar></span></span></div>
        ${f.questions.map((q, qi) => html`
        <fieldset class="finder__question" data-q="${q.id}"${attrs({ hidden: qi > 0 })}>
          <legend class="finder__legend">${L(q.label)}</legend>
          ${q.help ? html`<p class="finder__help">${L(q.help)}</p>` : ''}
          <div class="finder__options">
            ${q.options.map((o) => html`<label class="option"><input type="radio" name="${q.id}" value="${o.id}"><span>${L(o.label)}</span></label>`)}
          </div>
        </fieldset>`)}
        <div class="finder__nav">
          <button type="button" class="btn btn--ghost" data-finder-back>${icon('arrow-left', { size: 18 })}${t('finder.back')}</button>
          <button type="button" class="btn btn--primary" data-finder-next>${t('finder.next')} ${icon('arrow-right', { size: 18 })}</button>
        </div>
      </form>
      <div class="finder__results" data-finder-results hidden tabindex="-1" aria-live="polite"></div>
      <script type="application/json" data-finder-data>${raw(JSON.stringify(finderData).replace(/</g, '\\u003c'))}</script>
    </div>
  </div>
</section>`;

  /* 05 Why / materials -------------------------------------------------------- */
  const why = html`
<section class="section why" aria-labelledby="why-title">
  <div class="container">
    ${sectionHead({ eyebrow: lang === 'th' ? 'ทำไมต้อง Clay & Stone' : 'Why Clay & Stone', title: t('home.why_title'), lead: t('home.why_lead'), id: 'why-title' })}
    <ol class="materials" role="list">
      ${content.materials.map((m) => html`
      <li class="material" data-reveal>
        ${picture(m.image, { alt: '', sizes: '(min-width: 64em) 15vw, 40vw', className: 'material__img' })}
        <div>
          <h3 class="material__title"><span>0${m.order}</span> ${L(m.name)}</h3>
          <p>${L(m.text)}</p>
          ${m.status === 'pending-confirmation' ? badge(t('status.pending'), 'pending') : ''}
        </div>
      </li>`)}
    </ol>
  </div>
</section>`;

  /* 06 Projects ---------------------------------------------------------------- */
  const gal = Object.fromEntries(content.galleries.map((g) => [g.id, g]));
  const provinces = [...new Set(content.galleries.flatMap((g) => g.locations.map((l) => l.province)))];
  const featured = content.testimonials.find((x) => x.id === 't3');
  const projectsSec = html`
<section class="section projects" aria-labelledby="projects-title">
  <div class="container">
    ${sectionHead({ eyebrow: t('nav.projects'), title: t('home.projects_title'), lead: t('home.projects_lead'), id: 'projects-title' })}
    <div class="project-mosaic">
      ${PROJECT_PICKS.map((p, i) => {
        const g = gal[p.gallery]; const ph = g.photos[p.photo];
        return html`<figure class="project-tile project-tile--${i + 1}" data-reveal>${picture(ph.src, { alt: L(ph.alt), sizes: i === 0 ? '(min-width: 64em) 50vw, 92vw' : '(min-width: 64em) 25vw, 46vw' })}<figcaption>${L(g.title)}</figcaption></figure>`;
      })}
    </div>
    <div class="projects__meta">
      <p class="projects__locations"><span class="eyebrow">${t('home.projects_locations')}</span> ${provinces.map((p) => (lang === 'th' ? PROVINCES_TH[p] ?? p : p)).join(' · ')}</p>
      <a class="link-arrow" href="${href(lang, 'projects')}">${t('cta.explore_more')} ${icon('arrow-right', { size: 18 })}</a>
    </div>
    ${featured ? html`
    <figure class="testimonial" data-reveal>
      <blockquote><p>${L(featured.quote)}</p></blockquote>
      <figcaption><strong>${L(featured.name)}</strong> · Unwind 1 Bed 2 Bath · ${lang === 'th' ? PROVINCES_TH[featured.province] : featured.province}</figcaption>
    </figure>` : ''}
  </div>
</section>`;

  /* 07 Process ----------------------------------------------------------------- */
  const tl = settings.timeline;
  const durations = [null, `${tl.production_days.min}–${tl.production_days.max} ${lang === 'th' ? 'วัน' : 'days'}`, `~${tl.delivery_at_production_percent}%`, `~${tl.onsite_assembly_days} ${lang === 'th' ? 'วัน' : 'days'}`];
  const process = html`
<section class="section process" aria-labelledby="process-title">
  <div class="container">
    ${sectionHead({ eyebrow: t('nav.how_we_build'), title: t('home.process_title'), lead: t('home.process_lead'), id: 'process-title' })}
    <ol class="steps" role="list">
      ${content.steps.map((s, i) => html`
      <li class="step" data-reveal>
        <span class="step__num">0${s.order}</span>
        ${durations[i] ? html`<span class="step__time">${icon('clock', { size: 16 })}${durations[i]}</span>` : html`<span class="step__time step__time--empty"></span>`}
        <h3 class="step__title">${L(s.title)}</h3>
        <p>${L(s.text)}</p>
      </li>`)}
    </ol>
  </div>
</section>`;

  /* 08 FAQ ----------------------------------------------------------------------- */
  const faqs = FEATURED_FAQ.map((id) => content.faqs.find((q) => q.id === id)).filter((q) => q && q.visible);
  const faq = html`
<section class="section faq" aria-labelledby="faq-title">
  <div class="container faq__grid">
    <div>
      ${sectionHead({ eyebrow: 'FAQ', title: t('home.faq_title'), id: 'faq-title' })}
      <a class="link-arrow" href="${href(lang, 'knowledge')}">${t('home.faq_more')} ${icon('arrow-right', { size: 18 })}</a>
    </div>
    <div class="faq__list">
      ${faqs.map((q) => html`
      <details class="faq__item">
        <summary><h3>${L(q.question)}</h3>${icon('chevron-down')}</summary>
        <div class="faq__answer">${paragraphs(L(q.answer))}</div>
      </details>`)}
    </div>
  </div>
</section>`;

  /* 09 Contact ------------------------------------------------------------------- */
  const c = settings.contact;
  const contact = html`
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

  return page({
    lang, content, path: '', title: seo.title, description: seo.description, bodyClass: 'page-home',
    body: [hero, intro, homes, finder, why, projectsSec, process, faq, contact],
  });
}
