import { html, raw, attrs } from '../lib/html.js';
import { makeT, pick } from '../lib/content.js';
import { makePicture } from '../lib/picture.js';
import { page, href } from '../components/layout.js';
import { icon } from '../components/icons.js';
import { sectionHead, modelSpecs, badge, contactCta } from '../components/ui.js';

// Hero: one real completed home (Unwind 1 Bed 2 Bath). No renders, no poles or wires.
const HERO_IMAGE = '/images/source/projects/6973bab5b274825bcd905e0f_1bed-2bath-13.webp';
// Discover Our Homes: the three models with real completed-home photography.
const DISCOVER = [
  { model: 'unwind-standard', src: '/images/source/projects/6973b669fbc3fdd253829882_standard-13.webp', shape: 'wide' },
  { model: 'unwind-loft', src: '/images/source/projects/6973b8474458238b820645c1_loft-13.webp', shape: 'tall' },
  { model: 'unwind-1bed-2bath', src: '/images/source/projects/6973bab42483e43311742af3_1bed-2bath-16.webp', shape: 'pano' },
];
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
  const seo = {
    th: { title: 'บ้านโมดูลาร์ บ้านสำเร็จรูป ดีไซน์โมเดิร์น พร้อมติดตั้ง | Clay & Stone', description: 'เลือกชมแบบบ้านสำเร็จรูป หลากหลายสไตล์ในระบบ Modular มาตรฐานจากบริษัทสร้างบ้านสำเร็จรูปพร้อมติดตั้งที่ตอบโจทย์ทุกการอยู่อาศัย' },
    en: { title: 'Modern Modular Houses in Thailand | Clay & Stone', description: 'Experience the future of living with premium modular homes and modern modular house designs featuring precision engineering and trusted quality.' },
  }[lang];

  /* 01 Hero: headline, one sentence, one CTA, one photograph (see docs/hero-v3.md) */
  // A newline in the copy = line break; "|" = allowed Thai break point (phrases never split inside).
  const heroLines = t('home.hero_title').split('\n');
  const hero = html`
<section class="hero" aria-labelledby="hero-title">
  <div class="hero__inner">
    <div class="hero__text">
      <h1 class="hero__title" id="hero-title">${heroLines.map((line) => html`<span class="hero__line">${line.split('|').map((ph) => html`<span class="hero__phrase">${ph}</span>`)}</span>`)}</h1>
      <p class="hero__lead">${lang === 'th' ? t('home.hero_lead').split(' ').map((ph, i) => html`${i ? ' ' : ''}<span class="hero__phrase">${ph}</span>`) : t('home.hero_lead')}</p>
      <a class="btn btn--primary btn--rect hero__cta" href="${href(lang, 'homes')}" data-track="hero_explore">${t('home.hero_cta')} ${icon('arrow-right', { size: 18 })}</a>
    </div>
    <div class="hero__media">
      ${picture(HERO_IMAGE, { alt: lang === 'th' ? 'บ้าน Unwind Series 1 Bed 2 Bath ที่ส่งมอบแล้ว หลังคาจั่วชายคายื่นยาว ผนังกระจกสูงจรดฝ้า' : 'A completed Unwind Series 1 Bed 2 Bath home with a deep gabled roof and full-height glazing', sizes: '(min-width: 64em) 62vw, 100vw', priority: true })}
    </div>
  </div>
</section>`;

  /* 02 Brand intro ----------------------------------------------------------- */
  const pendingWhy = lang === 'th' ? 'เว็บไซต์ปัจจุบันแสดงเป็นโปรโมชั่น รอยืนยันเงื่อนไข' : 'Listed as a promotion on the live site; terms awaiting confirmation';
  const strengths = [
    { title: { th: 'มาตรฐานใหม่ของ "บ้านสำเร็จรูป"', en: 'Modular Homes Beyond Prefab' }, text: { th: 'Clay & Stone ออกแบบบ้านสำเร็จรูปที่ฉีกทุกกฎเดิมๆ ด้วยดีไซน์โดดเด่น ทั้งชายคายื่นยาว ระเบียงกว้าง และฟังก์ชันที่สวยงามลงตัว', en: "Extended roof overhangs, spacious verandas and balanced designs that respond to the real lifestyles of Thai people." } },
    { title: { th: 'งานได้มาตรฐาน ตรงตามแบบที่เลือก', en: 'Built True to Design' }, text: { th: 'ทุกขั้นตอนการออกแบบและก่อสร้าง อยู่ภายใต้การดูแลของสถาปนิกและวิศวกรมืออาชีพ', en: 'Every stage of design, construction and installation is overseen by professional architects and engineers.' } },
    { title: { th: 'บริการหลังการขายที่วางใจได้', en: 'After-Sales You Can Rely On' }, text: { th: 'ดูแลหลังการขายโดยทีม Clay & Stone โดยตรง ไม่ใช่แค่วันส่งมอบ แต่ตลอดการใช้งาน', en: 'After-sales service comes directly from the Clay & Stone team, not just at handover but for the life of your home.' } },
  ];
  const intro = html`
<section class="section intro" aria-labelledby="intro-title">
  <div class="container intro__grid">
    <div class="intro__text" data-reveal>
      <p class="eyebrow">Clay &amp; Stone</p>
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
  <ul class="container key-facts" role="list" aria-label="${t('home.facts_label')}" data-reveal>
    <li>${icon('clock', { size: 18 })}<span>${t('home.facts_onsite')}</span></li>
    <li>${icon('shield', { size: 18 })}<span>${t('home.facts_warranty')}</span>${badge(t('status.pending'), 'pending', pendingWhy)}</li>
    <li>${icon('truck', { size: 18 })}<span>${t('home.facts_install')}</span>${badge(t('status.pending'), 'pending', pendingWhy)}</li>
  </ul>
</section>`;

  /* 02 Discover Our Homes: large photography, minimal facts, clear links ----------- */
  const others = models.filter((m) => !DISCOVER.some((d) => d.model === m.id));
  const seriesName = (m) => L(series.find((x) => x.id === m.series_id).name);
  const discover = html`
<section class="section discover" id="homes" aria-labelledby="discover-title">
  <div class="container">
    <h2 class="discover__title" id="discover-title">${t('home.discover_title')}</h2>
    <div class="discover__grid">
      ${DISCOVER.map((d) => {
        const m = models.find((x) => x.id === d.model);
        const specs = modelSpecs(m, { t, lang });
        return html`
      <article class="discover-item discover-item--${d.shape}" data-reveal>
        <a class="discover-item__link" href="${href(lang, m.path)}" data-track="view_product" data-model="${m.id}">
          <div class="discover-item__media">${picture(d.src, { alt: '', sizes: d.shape === 'wide' ? '(min-width: 64em) 62vw, 92vw' : d.shape === 'tall' ? '(min-width: 64em) 30vw, 92vw' : '(min-width: 64em) 55vw, 92vw' })}</div>
          <div class="discover-item__meta">
            <h3 class="discover-item__name"><span class="discover-item__series">${seriesName(m)}</span>${L(m.name)}</h3>
            <p class="discover-item__facts">${specs[0].text} · ${specs[1].text}</p>
            ${icon('arrow-up-right', { size: 20 })}
          </div>
        </a>
      </article>`;
      })}
      <div class="discover__more" data-reveal>
        <p>${t('home.discover_more_note', { names: others.map((m) => `${seriesName(m)} ${L(m.name)}`).join(lang === 'th' ? ' และ ' : ' and ') })}</p>
        <a class="link-arrow" href="${href(lang, 'homes')}">${t('home.discover_more', { n: models.length })} ${icon('arrow-right', { size: 18 })}</a>
      </div>
    </div>
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
  const contact = contactCta({ t, content, picture });

  return page({
    lang, content, path: '', title: seo.title, description: seo.description, bodyClass: 'page-home',
    body: [hero, discover, intro, finder, why, projectsSec, process, faq, contact],
  });
}
