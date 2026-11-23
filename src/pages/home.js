import { html, raw, attrs } from '../lib/html.js';
import { makeT, pick, formatTHB } from '../lib/content.js';
import { makePicture } from '../lib/picture.js';
import { page, href } from '../components/layout.js';
import { icon } from '../components/icons.js';
import { sectionHead, modelSpecs, badge, contactCta } from '../components/ui.js';

// Hero: one real completed home (Unwind 1 Bed 2 Bath). No renders, no poles or wires.
const HERO_IMAGE = '/images/source/projects/6973bab5b274825bcd905e0f_1bed-2bath-13.webp';
// Discover Our Homes: card photo per model. Real completed-home photos where they
// exist; the two render-only models use their cover and carry a "Visualisation" badge.
const DISCOVER_PHOTOS = {
  'unwind-standard': { src: '/images/source/projects/6973b669fbc3fdd253829882_standard-13.webp', focus: '40% 55%' },
  'unwind-loft': { src: '/images/source/projects/6973b8474458238b820645c1_loft-13.webp', focus: '55% 45%' },
  'unwind-1bed-2bath': { src: '/images/source/projects/6973bab42483e43311742af3_1bed-2bath-16.webp', focus: '45% 50%' },
};
// Intro: one large interior photograph of a completed Unwind Loft Type (double height,
// stair, mezzanine, glazing onto the deck).
// Brand Vision: the living room of the same delivered 1 Bed 2 Bath as the hero.
const VISION_IMAGE = '/images/source/projects/6973bab4d476f82d4bdef766_1bed-2bath-07.webp';
const INTRO_IMAGE = '/images/source/projects/6973b848b0cf551ef3dc2105_loft-05.webp';
// "Why our homes": three customer questions answered from verified source wording in
// materials.json (see docs/materials-v3.md for the line-by-line verification), then all
// six original specifications. Questions/answers are proposed copy needing approval.
// Disputed figures (2.3 mm "over" vs "from", 1.4×, 1.35×) are deliberately not repeated
// here; they stay only in the verbatim technical details.
const MATERIAL_LABELS = {
  'structural-system': { th: 'โครงสร้าง', en: 'Structural System' },
  'flooring-system': { th: 'ระบบพื้น', en: 'Flooring System' },
  'wall-materials': { th: 'ผนัง', en: 'Wall Materials' },
  'outdoor-terrace': { th: 'ระเบียงภายนอก', en: 'Outdoor Terrace' },
  'door-window': { th: 'ประตูและหน้าต่าง', en: 'Door & Window' },
  'roof-materials': { th: 'หลังคา', en: 'Roof Materials' },
};
const HOME_STORIES = [
  {
    id: 'structure',
    topic: { th: 'โครงสร้าง', en: 'Structure' },
    specs: ['structural-system'],
    image: '/images/source/unwind/694acd6b82786849ab80c623_unwind-img-05.webp',
    alt: { th: 'โครงเหล็กของบ้าน Clay & Stone ระหว่างก่อสร้าง และพื้นที่ปูเสร็จแล้ว', en: 'Clay & Stone steel framing during construction, and the finished floor' },
    caption: { th: 'โครงเหล็กระหว่างก่อสร้าง (ซ้าย) และพื้นที่ปูเสร็จแล้ว (ขวา)', en: 'Steel framing during construction (left) and the finished floor (right)' },
    question: { th: 'บ้านใช้โครงสร้างแบบไหน?', en: 'What is the structure made of?' },
    answer: { th: 'บ้าน Clay & Stone ใช้โครงสร้างเหล็กที่ได้มาตรฐาน มอก. เคลือบสีกันสนิมเกรดสูงจาก BEGER และควบคุมงานโดยสถาปนิกและวิศวกร', en: 'Clay & Stone homes are built on TIS-certified structural steel, protected with high-performance anti-corrosion coatings from BEGER, and supervised by licensed architects and engineers.' },
    points: [
      { th: 'เหล็กโครงสร้างได้มาตรฐาน มอก.', en: 'TIS-certified structural steel' },
      { th: 'สีกันสนิมเกรดสูงจาก BEGER', en: 'BEGER anti-corrosion coatings' },
      { th: 'ควบคุมงานโดยสถาปนิกและวิศวกร', en: 'Supervised by architects and engineers' },
    ],
  },
  {
    id: 'interior',
    topic: { th: 'ผนังและพื้น', en: 'Walls & floors' },
    specs: ['flooring-system', 'wall-materials'],
    image: '/images/source/unwind/694acd6b56f80fe66b21adca_unwind-img-04.webp',
    alt: { th: 'ห้องภายในบ้านที่ตกแต่งเสร็จ และโครงผนังเหล็กพร้อมฉนวนหุ้มฟอยล์ก่อนปิดผิว', en: 'A finished interior, and steel wall framing with foil-faced insulation before cladding' },
    caption: { th: 'ห้องที่ตกแต่งเสร็จ (ซ้าย) และโครงผนังพร้อมฉนวนก่อนปิดผิว (ขวา)', en: 'A finished room (left) and wall framing with insulation before cladding (right)' },
    question: { th: 'ผนังและพื้นทำจากวัสดุอะไร?', en: 'What are the walls and floors made of?' },
    answer: { th: 'พื้นวางบนโครงรับที่ถี่ทุก 40 ซม. ปิดผิวด้วย Smart Board และ SPC Click Lock ของ SCG ส่วนผนังเป็นโครงเหล็กบุ Smart Board SCG พร้อมฉนวนใยแก้วหุ้มฟอยล์ในผนังภายนอก ช่วยลดความร้อนจากภายนอก', en: 'Floors sit on joists spaced every 40 cm and are finished with SCG Smart Board and SPC Click Lock. Walls are steel-framed and clad in SCG Smart Board, with foil-faced insulation in the external walls to reduce heat.' },
  },
  {
    id: 'exterior',
    topic: { th: 'ภายนอกและหลังคา', en: 'Exterior & roof' },
    specs: ['outdoor-terrace', 'door-window', 'roof-materials'],
    image: '/images/source/unwind/694acd6b784db25ede0acc8d_unwind-img-03.webp',
    alt: { th: 'ระเบียงไม้เทียม WPC และประตูกระจกกรอบอลูมิเนียมลายไม้ ใต้ชายคายื่นยาว', en: 'WPC terrace and wood-grain aluminium glass doors under deep eaves' },
    caption: { th: 'ระเบียง WPC และประตูอลูมิเนียมลายไม้ ใต้ชายคายื่นยาว', en: 'WPC terrace and wood-grain aluminium doors under deep eaves' },
    question: { th: 'ภายนอกบ้านรับแดดและฝนอย่างไร?', en: 'How does the outside handle sun and rain?' },
    answer: { th: 'ระเบียงและฝ้าภายนอกใช้ไม้เทียม WPC ที่ทนแดดทนฝน ประตูและหน้าต่างอลูมิเนียมลายไม้มีรางลดระดับกันน้ำฝน และหลังคาเมทัลชีทมีฉนวน PU ในแผ่น ช่วยลดความร้อนและเสียงฝน', en: 'Terraces and exterior ceilings use WPC wood composite made for sun and rain. Wood-grain aluminium doors and windows have built-in rain barriers, and the metal roof carries PU insulation that reduces heat and rain noise.' },
  },
];
const FEATURED_FAQ = ['faq-home-01', 'faq-home-02', 'faq-home-03', 'faq-projects-04', 'faq-unwind-series-04', 'faq-unwind-series-05', 'faq-projects-07'];
// Projects v2 (docs/projects-v2.md): owner stories. Each excerpt must be a verbatim substring of the
// owner's quote in testimonials.json (checked by tests/projects-check.mjs); the full quote is one click away.
const OWNER_STORIES = [
  { id: 't3', excerpt: { th: 'บ้านอยู่ได้จริง อยู่สบาย พร้อมฟังก์ชันที่รองรับการใช้งานได้อย่างคุ้มค่า', en: 'The house is comfortable, functional, and truly livable' } },
  { id: 't4', excerpt: { th: 'หลังได้รับมอบบ้านรู้สึกภูมิใจที่ตัดสินใจให้ CLAY & STONE สร้างบ้านให้', en: 'After the handover, I felt proud of my decision' } },
  { id: 't5', excerpt: { th: 'พื้นแน่น กันความร้อนได้ดีไม่ต้องกังวลปัญหาในระยะยาว', en: 'It feels solid, comfortable, and well insulated, making it suitable for long-term living' } },
  { id: 't6', excerpt: { th: 'คุณเทพสามารถตอบข้อสงสัยต่างๆ ได้ชัดเจน พร้อมให้ความช่วยเหลือและคำแนะนำเป็นอย่างดี', en: 'Khun Thep was able to answer our questions clearly and provided helpful assistance and advice' } },
];
// The 1 Bed 2 Bath gallery has a single recorded location (Suphanburi), the same as the featured owner's home.
const PROJECT_FEATURE_PHOTO = { gallery: 'unwind-1bed-2bath', photo: 0 };
const PROVINCES_TH = { Nonthaburi: 'นนทบุรี', Prachinburi: 'ปราจีนบุรี', Suphanburi: 'สุพรรณบุรี', Saraburi: 'สระบุรี', Bangkok: 'กรุงเทพฯ' };

// Keep common Thai compounds from splitting at line ends (the browser's Thai
// dictionary sometimes breaks them, e.g. "ความ / ร้อน").
const THAI_KEEP = /(หลากหลาย|อยู่อาศัย|ความร้อน|ความทนทาน|น้ำซึม)/;
const keepThai = (text) => text.split(THAI_KEEP).map((part, i) => (i % 2 ? html`<span class="nowrap">${part}</span>` : part));

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
  const heroModel = content.models.find((m) => m.id === 'unwind-1bed-2bath');
  const hero = html`
<section class="hero" aria-labelledby="hero-title">
  <div class="hero__media">
    ${picture(HERO_IMAGE, { alt: lang === 'th' ? 'บ้าน Unwind Series 1 Bed 2 Bath ที่ส่งมอบแล้ว หลังคาจั่วชายคายื่นยาว ผนังกระจกสูงจรดฝ้า' : 'A completed Unwind Series 1 Bed 2 Bath home with a deep gabled roof and full-height glazing', sizes: '100vw', priority: true })}
  </div>
  <div class="hero__frame container">
    <div class="hero__panel">
      <p class="hero__eyebrow">Clay &amp; Stone <span aria-hidden="true">—</span> Modular Homes</p>
      <h1 class="hero__title" id="hero-title">${heroLines.map((line) => html`<span class="hero__line">${line.split('|').map((ph) => html`<span class="hero__phrase">${ph}</span>`)}</span>`)}</h1>
      <p class="hero__lead">${lang === 'th' ? t('home.hero_lead').split(' ').map((ph, i) => html`${i ? ' ' : ''}<span class="hero__phrase">${ph}</span>`) : t('home.hero_lead')}</p>
    </div>
    <a class="hero__caption" href="${href(lang, heroModel.path)}">
      <span class="hero__caption-label">${t('home.hero_caption')}</span>
      <span class="hero__caption-name">Unwind Series 1 Bed 2 Bath ${icon('arrow-right', { size: 16 })}</span>
    </a>
  </div>
</section>`;

  /* 03 About Clay & Stone: 55% photograph / 45% text (see docs/hero-v3.md §8) */
  // "|" in the headline marks allowed Thai break points (phrases never split inside).
  const intro = html`
<section class="section intro" aria-labelledby="intro-title">
  <div class="container intro__grid">
    <figure class="intro__figure" data-reveal>
      <div class="intro__photo">${picture(INTRO_IMAGE, { alt: lang === 'th' ? 'ภายในบ้าน Unwind Loft Type เพดานสูงสองชั้น บันไดไม้ขึ้นชั้นลอย และประตูกระจกเปิดรับแสงธรรมชาติจากระเบียง' : 'Inside an Unwind Loft Type: double-height space, timber stair to the mezzanine and glass doors bringing in daylight from the deck', sizes: '(min-width: 64em) 52vw, (min-width: 48em) 50vw, 100vw' })}</div>
      <figcaption>Unwind Series Loft Type · ${t('home.intro_caption')}</figcaption>
    </figure>
    <div class="intro__text" data-reveal>
      <p class="intro__label">${t('home.about_label')}</p>
      <h2 class="intro__title" id="intro-title">${t('home.about_title').split('|').map((ph) => html`<span class="intro__phrase">${ph}</span>`)}</h2>
      <p class="intro__body">${keepThai(t('home.about_text'))}</p>
      <a class="intro__cta" href="${href(lang, 'about')}">${t('home.about_cta')} ${icon('arrow-up-right', { size: 18 })}</a>
    </div>
  </div>
</section>`;

  /* 02 Brand Vision (docs/hero-v4.md §5): the client's own vision statement. While it
     scrolls through the viewport its phrases darken one by one (main.js); without JS
     or with reduced motion it is simply shown in full. */
  // Spaces stay as written; "|" marks an extra Thai break point with no space, so long
  // phrases can wrap between words but never inside one.
  const visionWords = t('home.vision_title').split(' ').map((w) => w.split('|'));
  const vision = html`
<section class="section vision" aria-labelledby="vision-title" data-vision>
  <div class="container">
    <div class="vision__grid">
      <div class="vision__text">
        <p class="vision__eyebrow">${t('home.vision_eyebrow')}</p>
        <h2 class="vision__title" id="vision-title">${visionWords.map((parts, i) => html`${i ? ' ' : ''}${parts.map((w) => html`<span class="${/[“”]/.test(w) ? 'vision__word vision__word--key' : 'vision__word'}">${w}</span>`)}`)}</h2>
        <div class="vision__foot">
          <p class="vision__body">${keepThai(t('home.vision_body'))}</p>
          <a class="vision__link" href="${href(lang, 'about')}">${t('home.about_cta')} ${icon('arrow-right', { size: 18 })}</a>
        </div>
      </div>
      <figure class="vision__photo" data-parallax data-roof>
        <div class="vision__art">
          <svg class="vision__outline" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 22 L50 0 L100 22 L100 100 L0 100 Z" vector-effect="non-scaling-stroke"/></svg>
          <div class="vision__frame">${picture(VISION_IMAGE, { alt: t('home.vision_photo_alt'), sizes: '(min-width: 64em) 36vw, 100vw' })}</div>
        </div>
        <figcaption class="vision__caption">${t('home.vision_photo_caption')}</figcaption>
      </figure>
    </div>
  </div>
</section>`;

  /* 02 Discover Our Homes: dark band, horizontal rail of every home */
  // Each card: photo (swaps to the floor plan on hover, desktop), number, name, key
  // specs and starting price. User-controlled scrolling only; no autoplay.
  const seriesName = (m) => L(series.find((x) => x.id === m.series_id).name);
  const liveSeries = series.filter((x) => x.status === 'available');
  const discover = html`
<section class="discover" id="homes" aria-labelledby="discover-title" data-rail>
  <div class="container discover__head">
    <div class="discover__intro">
      <p class="eyebrow eyebrow--light">${t('nav.homes')}</p>
      <h2 class="discover__title" id="discover-title">${t('home.discover_title')}</h2>
      <p class="discover__lead">${t('home.discover_lead', { homes: models.length, series: liveSeries.length })}</p>
    </div>
    <div class="discover__controls">
      <div class="discover__arrows" data-rail-controls hidden>
        <button type="button" class="rail-btn" data-rail-prev aria-controls="discover-rail">${icon('arrow-left', { size: 20 })}<span class="visually-hidden">${t('home.discover_prev')}</span></button>
        <button type="button" class="rail-btn" data-rail-next aria-controls="discover-rail">${icon('arrow-right', { size: 20 })}<span class="visually-hidden">${t('home.discover_next')}</span></button>
      </div>
      <a class="link-arrow discover__all" href="${href(lang, 'homes')}">${t('home.discover_more', { n: models.length })} ${icon('arrow-right', { size: 18 })}</a>
    </div>
  </div>
  <ol class="discover__rail" id="discover-rail" role="list" tabindex="0" aria-label="${t('home.discover_title')}" data-rail-track>
    ${models.map((m, i) => {
      const photo = DISCOVER_PHOTOS[m.id] ?? { src: m.images.cover, focus: '50% 50%' };
      const isRender = !DISCOVER_PHOTOS[m.id] && m.images.cover_is_visualisation;
      const specs = modelSpecs(m, { t, lang });
      const pending = m.price.status === 'pending-confirmation';
      return html`
    <li class="home-card" data-reveal>
      <a class="home-card__link" href="${href(lang, m.path)}" data-track="view_product" data-model="${m.id}">
        <div class="home-card__media" style="--focus:${photo.focus}">
          ${picture(photo.src, { alt: '', sizes: '(min-width: 64em) 34vw, 84vw' })}
          <div class="home-card__plan">${picture(m.images.floor_plan, { alt: lang === 'th' ? `แปลนบ้าน ${seriesName(m)} ${L(m.name)}` : `Floor plan of the ${seriesName(m)} ${L(m.name)}`, sizes: '(min-width: 64em) 34vw, 1px' })}<span>${t('model.floor_plan')}</span></div>
          ${isRender ? badge(t('status.visualisation'), 'overlay') : ''}
        </div>
        <div class="home-card__body">
          <p class="home-card__top"><span class="home-card__num">${String(i + 1).padStart(2, '0')}</span><span>${seriesName(m)}</span></p>
          <h3 class="home-card__name">${L(m.name)}</h3>
          <p class="home-card__specs">${specs.map((x) => x.text).join(' · ')}</p>
          <p class="home-card__price">
            <span class="home-card__amount"><span>${t('model.price_from')}</span> <strong>${formatTHB(m.price.display_thb, lang)}</strong> <span>${t('model.currency')}</span></span>
            ${pending ? badge(t('status.price_pending'), 'pending', lang === 'th' ? 'เว็บไซต์ปัจจุบันแสดงราคา 2 ชุด รอลูกค้ายืนยัน' : 'The live site shows two different prices; awaiting client confirmation') : ''}
          </p>
          <span class="home-card__cta">${t('cta.view_home')} ${icon('arrow-right', { size: 18 })}</span>
        </div>
      </a>
    </li>`;
    })}
  </ol>
</section>`;

  /* 04 Smart Home Finder: guided discovery (4 steps) beside a live strip of homes */
  // Verified model data (photo, name, specs, price, limitations) is rendered here into
  // <template>s; the script only adds the rule-based reasons and the ranking.
  const f = content.finder;
  const total = available.length;
  const photoOf = (m) => DISCOVER_PHOTOS[m.id] ?? { src: m.images.cover, focus: '50% 50%' };
  const isRender = (m) => !DISCOVER_PHOTOS[m.id] && m.images.cover_is_visualisation;
  const nameOf = (m) => `${L(series.find((s) => s.id === m.series_id).name)} ${L(m.name)}`;
  const limitsOf = (m) => [
    isRender(m) && t('finder.lim_render'),
    // Price pending is already shown as a badge next to the price.
    m.area_sqm.status === 'pending-confirmation' && t('finder.lim_area'),
    m.sleeping === 'open-plan' && t('finder.lim_open'),
    m.sleeping === 'loft' && t('finder.lim_loft'),
  ].filter(Boolean);
  const hintOf = (q, o) => {
    if (o.hint) return L(o.hint);
    if (q.id !== 'budget') return null;
    const cap = o.effects.find((e) => e.field === 'price.display_thb');
    return cap ? t('finder.budget_count', { n: available.filter((m) => m.price.display_thb <= cap.value).length }) : t('finder.budget_any');
  };
  const finderData = {
    lang,
    finder: f,
    i18n: content.i18n[lang].finder,
    noMatch: { title: L(f.results.no_match.title), text: L(f.results.no_match.text) },
    alwaysNote: L(f.results.always_note),
    contact: { line: settings.contact.line.href, phone: settings.contact.phone.href, phoneLabel: t('finder.call', { phone: settings.contact.phone.display }), lineLabel: t('cta.line') },
    models: available.map((m) => ({
      id: m.id, price: m.price, area_sqm: m.area_sqm, bedrooms: m.bedrooms, uses: m.uses, household: m.household,
      plot_fit: m.plot_fit, lifestyle: m.lifestyle, sleeping: m.sleeping, show_in_finder: true,
    })),
  };
  // Results v3 (docs/home-finder-v2.md §6): an editorial recommendation, not a scorecard.
  // The first card is the feature; further matches are compact rows. Reasons arrive as prose.
  const resultCard = (m) => {
    const specs = modelSpecs(m, { t, lang });
    const pending = m.price.status === 'pending-confirmation';
    const limits = limitsOf(m);
    const facts = [
      [t('model.usable_area'), specs[0].text],
      [t('model.bedrooms'), specs[1].text],
      [t('model.bathrooms'), m.bathrooms ?? '–'],
      [t('model.storeys'), m.storeys],
    ];
    return html`
      <article class="result" data-model="${m.id}">
        <a class="result__media" href="${href(lang, m.path)}" tabindex="-1" aria-hidden="true" style="--focus:${photoOf(m).focus}">
          ${picture(photoOf(m).src, { alt: '', sizes: '(min-width: 64em) 44vw, 92vw' })}
          ${isRender(m) ? badge(t('status.visualisation'), 'overlay') : ''}
        </a>
        <div class="result__body">
          <p class="result__rank" data-result-rank></p>
          <h4 class="result__name"><a href="${href(lang, m.path)}" data-track="view_product">${nameOf(m)}</a></h4>
          <p class="result__why" data-result-why></p>
          <p class="result__specs">${specs.map((x) => x.text).join(' · ')}</p>
          <dl class="result__facts">${facts.map(([k, v]) => html`<div><dt>${k}</dt><dd>${v}</dd></div>`)}</dl>
          <p class="result__price"><span>${t('model.price_from')}</span> <strong>${formatTHB(m.price.display_thb, lang)}</strong> <span>${t('model.currency')} · ${t('model.price_incl_vat')}</span>${pending ? badge(t('status.price_pending'), 'pending') : ''}</p>
          <p class="result__note" data-result-note${attrs({ hidden: limits.length === 0 })}><span class="result__note-label">${t('finder.limits')}</span> <span data-result-limits>${limits.join(' · ')}</span></p>
          <div class="result__actions">
            <a class="btn btn--primary btn--rect btn--sm" href="${href(lang, m.path)}" data-track="view_product">${t('cta.view_home')} ${icon('arrow-right', { size: 16 })}</a>
            <a class="result__line" href="${settings.contact.line.href}" rel="noopener" data-track="click_line">${icon('chat', { size: 18 })}${t('finder.ask_line')}</a>
          </div>
        </div>
      </article>`;
  };
  const finder = html`
<section class="section finder" id="finder" aria-labelledby="finder-title">
  <div class="container finder__layout">
    <div class="finder__intro">
      <h2 class="finder__title" id="finder-title">${L(f.intro.title)}</h2>
      <p class="finder__lead">${L(f.intro.lead)}</p>
      <div class="finder__live">
        <p class="finder__live-count" data-finder-count aria-live="polite">${t('finder.live_all', { total })}</p>
        <ul class="finder__homes" role="list">
          ${available.map((m) => html`
          <li class="finder-home" data-finder-home="${m.id}">
            <a href="${href(lang, m.path)}" data-track="view_product">
              <span class="finder-home__img" style="--focus:${photoOf(m).focus}">${picture(photoOf(m).src, { alt: '', sizes: '8rem' })}</span>
              <span class="finder-home__name"><span>${L(series.find((s) => s.id === m.series_id).name)}</span>${L(m.name)}</span>
            </a>
          </li>`)}
        </ul>
      </div>
      <details class="finder__how">
        <summary>${icon('info', { size: 16 })}<span>${t('finder.how')}</span></summary>
        <p>${L(f.intro.disclaimer)}</p>
      </details>
    </div>

    <div class="finder__panel" data-finder>
      <noscript><p class="finder__noscript">${t('home.finder_noscript')} <a href="${href(lang, 'homes')}">${t('nav.homes')}</a></p></noscript>
      <form class="finder__form" data-finder-form hidden novalidate aria-labelledby="finder-title">
        <div class="finder__progress">
          <p class="finder__stepcount" data-finder-step></p>
          <ol class="finder__steps" role="list">
            ${f.questions.map((q, i) => html`<li><button type="button" class="finder__step" data-finder-goto="${i}" disabled><span class="finder__step-bar" aria-hidden="true"></span><span class="finder__step-label">${L(q.short)}</span></button></li>`)}
          </ol>
        </div>
        ${f.questions.map((q, qi) => html`
        <fieldset class="finder__question" data-q="${q.id}"${attrs({ 'data-optional': q.optional ? 'true' : null, hidden: qi > 0 })}>
          <legend class="finder__legend">${L(q.label)}</legend>
          ${q.help ? html`<p class="finder__help">${L(q.help)}</p>` : ''}
          <div class="finder__choices${q.options.some((o) => o.icon) ? '' : ' finder__choices--plain'}">
            ${q.options.map((o) => html`
            <label class="choice">
              <input class="choice__input" type="radio" name="${q.id}" value="${o.id}">
              ${o.icon ? html`<span class="choice__icon">${icon(o.icon, { size: 22 })}</span>` : ''}
              <span class="choice__text"><span class="choice__label">${L(o.label)}</span>${hintOf(q, o) ? html`<span class="choice__hint">${hintOf(q, o)}</span>` : ''}</span>
              <span class="choice__mark" aria-hidden="true">${icon('check', { size: 14 })}</span>
            </label>`)}
          </div>
        </fieldset>`)}
        <div class="finder__nav">
          <button type="button" class="finder__back" data-finder-back>${icon('arrow-left', { size: 18 })}${t('finder.back')}</button>
          <div class="finder__nav-end">
            <button type="button" class="finder__skip" data-finder-skip hidden>${t('finder.skip')}</button>
            <button type="button" class="btn btn--primary btn--rect" data-finder-next>${t('finder.next')} ${icon('arrow-right', { size: 18 })}</button>
          </div>
        </div>
      </form>
      <div class="finder__results" data-finder-results hidden tabindex="-1"></div>
      ${available.map((m) => html`<template data-finder-card="${m.id}">${resultCard(m)}</template>`)}
      <script type="application/json" data-finder-data>${raw(JSON.stringify(finderData).replace(/</g, '\\u003c'))}</script>
    </div>
  </div>
</section>`;

  /* 05 Why our homes: three answered questions (tabbed explorer), then the six original specifications */
  const specLabel = (id) => MATERIAL_LABELS[id];
  // Each topic carries its own verbatim specifications (materials.json) in a native
  // <details>, so the detail sits next to the answer it supports.
  const materialsById = Object.fromEntries(content.materials.map((m) => [m.id, m]));
  const techDetails = (s) => html`
          <details class="tech" data-tech="${s.id}">
            <summary class="tech__summary"><span>${t('home.materials_specs')}</span><span class="tech__names">${s.specs.map((id) => L(specLabel(id))).join(' · ')}</span><span class="tech__icon" aria-hidden="true"></span></summary>
            <dl class="tech__list">
              ${s.specs.map((id) => materialsById[id]).filter(Boolean).map((m) => html`
              <div class="tech__item" id="spec-${m.id}">
                <dt>${L(specLabel(m.id))}${lang === 'th' ? html`<span lang="en">${L(m.name)}</span>` : ''}</dt>
                <dd>${L(m.text)}</dd>
              </div>`)}
            </dl>
          </details>`;
  // v4 explorer (docs/materials-v3.md §6): three tabs over one photo-and-answer panel, so the
  // whole section fits on one screen. Without JS every panel is shown, stacked, and the
  // tab row stays hidden; the script adds the ARIA tab roles when it takes over.
  const topics = HOME_STORIES.map((s) => L(s.topic));
  const explorer = html`
    <div class="explore" data-explore>
      <div class="explore__tabs" data-explore-tabs hidden aria-label="${t('home.why_title')}">
        ${HOME_STORIES.map((s, i) => html`
        <button type="button" class="explore__tab" id="tab-${s.id}" data-explore-tab="${s.id}" aria-controls="panel-${s.id}">
          <span class="explore__tab-thumb" aria-hidden="true">${picture(s.image, { alt: '', sizes: '5rem' })}</span>
          <span class="explore__tab-text">
            <span class="explore__tab-label"><span class="explore__tab-index" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>${topics[i]}</span>
          </span>
        </button>`)}
      </div>
      ${HOME_STORIES.map((s, i) => html`
      <article class="explore__panel" id="panel-${s.id}" data-explore-panel="${s.id}" aria-labelledby="story-${s.id}">
        <figure class="explore__figure">
          <div class="explore__photo">${picture(s.image, { alt: L(s.alt), sizes: '(min-width: 64em) 52vw, 100vw' })}</div>
          <figcaption>${L(s.caption)}</figcaption>
        </figure>
        <div class="story__text">
          <p class="story__index" aria-hidden="true">${String(i + 1).padStart(2, '0')} · ${topics[i]}</p>
          <h3 class="story__question" id="story-${s.id}">${L(s.question)}</h3>
          <p class="story__answer">${keepThai(L(s.answer))}</p>
          ${s.points ? html`<ul class="story__points" role="list">${s.points.map((p) => html`<li>${icon('check', { size: 16 })}<span>${L(p)}</span></li>`)}</ul>` : ''}
          ${techDetails(s)}
          <div class="explore__actions">
            ${i < HOME_STORIES.length - 1 ? html`<button type="button" class="explore__next" data-explore-next="${HOME_STORIES[i + 1].id}" hidden>${t('home.why_next')}: ${topics[i + 1]} ${icon('arrow-right', { size: 16 })}</button>` : ''}
          </div>
        </div>
      </article>`)}
    </div>`;
  const why = html`
<section class="section why" aria-labelledby="why-title" data-materials>
  <div class="container">
    <header class="why__head">
      <h2 class="why__title" id="why-title">${t('home.why_title')}</h2>
      <p class="why__lead">${t('home.why_lead')}</p>
    </header>
    ${explorer}
  </div>
</section>`;

  /* 06 Projects: real homes, real owners (see docs/projects-v2.md) ------------- */
  const gal = Object.fromEntries(content.galleries.map((g) => [g.id, g]));
  const provinces = [...new Set(content.galleries.flatMap((g) => g.locations.map((l) => l.province)))];
  const provinceName = (p) => (lang === 'th' ? PROVINCES_TH[p] ?? p : p);
  const stories = OWNER_STORIES.map((o) => ({ ...o, t: content.testimonials.find((x) => x.id === o.id) }))
    .filter((o) => o.t && o.t.quote[lang]);
  const modelOf = (id) => models.find((m) => m.id === id);
  const ownerMeta = (o) => {
    const m = modelOf(o.t.model_id);
    return html`<p class="owner__meta"><strong class="owner__name">${L(o.t.name)}</strong>
      <span>${m ? html`<a href="${href(lang, m.path)}">${L(m.full_name)}</a>` : ''}${o.t.province ? html` · ${provinceName(o.t.province)}` : ''}</span></p>`;
  };
  const fullQuote = (o) => html`
      <details class="owner__full">
        <summary>${t('home.projects_read_full')}<span class="visually-hidden"> · ${L(o.t.name)}</span></summary>
        <p>${o.t.quote[lang]}</p>
      </details>`;
  const [lead, ...others] = stories;
  const fPhoto = gal[PROJECT_FEATURE_PHOTO.gallery].photos[PROJECT_FEATURE_PHOTO.photo];
  // v2.1: the lead story is a full-bleed photograph with the owner's words over it; the
  // other owners are shown with their handover photos, not avatars.
  const initialOf = (o) => L(o.t.name).replace(/^(คุณ|K\.)\s*/, '').charAt(0);
  const projectsSec = html`
<section class="section projects" aria-labelledby="projects-title">
  <div class="container projects__head">
    <div>
      <p class="eyebrow">${t('nav.projects')}</p>
      <h2 class="projects__title" id="projects-title">${t('home.projects_title')}</h2>
      <p class="projects__lead">${t('home.projects_lead', { n: provinces.length })}</p>
    </div>
    <a class="link-arrow" href="${href(lang, 'projects')}">${t('home.projects_all')} ${icon('arrow-right', { size: 18 })}</a>
  </div>
  ${lead ? html`
  <article class="owner-story" aria-label="${t('home.projects_story_label')}: ${L(lead.t.name)}">
    <div class="owner-story__photo">${picture(fPhoto.src, { alt: lang === 'th' ? 'บ้าน Unwind 1 Bed 2 Bath ที่สร้างเสร็จแล้ว ระเบียงไม้และประตูกระจกบานใหญ่ ท่ามกลางต้นไม้' : 'A completed Unwind 1 Bed 2 Bath home: timber deck and large glass doors among trees', sizes: '100vw' })}</div>
    <div class="container owner-story__inner">
      <div class="owner-story__body owner" data-reveal>
        <p class="owner-story__label">${t('home.projects_story_label')}</p>
        <blockquote class="owner__quote owner__quote--lg"><p>${lead.excerpt[lang]}</p></blockquote>
        ${ownerMeta(lead)}
        ${fullQuote(lead)}
      </div>
      ${lead.t.photo ? html`<figure class="owner-story__handover" data-reveal>${picture(lead.t.photo, { alt: t('home.projects_handover_alt', { name: L(lead.t.name) }), sizes: '(min-width: 64em) 15rem, 8rem' })}<figcaption>${t('home.projects_handover')}</figcaption></figure>` : ''}
    </div>
    <p class="owner-story__caption">${L(modelOf(PROJECT_FEATURE_PHOTO.gallery).full_name)} · ${provinceName('Suphanburi')}</p>
  </article>` : ''}
  <div class="container">
    ${others.length ? html`
    <ul class="owners" role="list">
      ${others.map((o) => html`
      <li class="owner owner-card${o.t.photo ? '' : ' owner-card--quote'}" data-reveal>
        ${o.t.photo
          ? html`<figure class="owner-card__photo">${picture(o.t.photo, { alt: t('home.projects_handover_alt', { name: L(o.t.name) }), sizes: '(min-width: 64em) 30vw, (min-width: 48em) 46vw, 92vw' })}<figcaption>${t('home.projects_handover')}</figcaption></figure>`
          : html`<span class="owner-card__mark" aria-hidden="true">“</span>`}
        <div class="owner-card__body">
          <blockquote class="owner__quote"><p>${o.excerpt[lang]}</p></blockquote>
          <div class="owner-card__foot">
            ${o.t.photo ? '' : html`<span class="owner-card__initial" aria-hidden="true">${initialOf(o)}</span>`}
            ${ownerMeta(o)}
          </div>
          ${fullQuote(o)}
        </div>
      </li>`)}
    </ul>` : ''}
    <div class="projects__meta">
      <p class="eyebrow">${t('home.projects_locations')}</p>
      <ul class="projects__places" role="list">${provinces.map((p) => html`<li>${icon('map-pin', { size: 16 })}${provinceName(p)}</li>`)}</ul>
    </div>
  </div>
</section>`;

  /* 07 Process: timeline + photo steps (docs/process-v2.md) ------------------------ */
  // The track is a visual summary sized by the published durations (production 60–90 d,
  // delivery at ~70 % of production, assembly ~15 d). The design phase has no published
  // duration, so it is drawn dashed with "before ordering". Everything on the track is
  // repeated in the step list, so the track is aria-hidden.
  const tl = settings.timeline;
  const days = lang === 'th' ? 'วัน' : 'days';
  const when = [
    t('home.process_when_design'),
    `${tl.production_days.min}–${tl.production_days.max} ${days}`,
    t('home.process_when_delivery', { p: tl.delivery_at_production_percent }),
    `~${tl.onsite_assembly_days} ${days}`,
  ];
  const PROCESS_ALT = [
    { th: 'ภาพสามมิติผังบ้านจากทีมออกแบบ', en: '3D layout drawing from the design team' },
    { th: 'โครงเหล็กของบ้านระหว่างการผลิต', en: 'The steel frame of a home during production' },
    { th: 'รถเครนยกโมดูลบ้านลงที่ดิน', en: 'A crane lifting a home module onto the site' },
    { th: 'บ้าน Clay & Stone ที่ประกอบเสร็จ พร้อมส่งมอบ', en: 'A completed Clay & Stone home, ready for handover' },
  ];
  const prodMid = (tl.production_days.min + tl.production_days.max) / 2;
  const process = html`
<section class="section process" aria-labelledby="process-title">
  <div class="container">
    <div class="process__head">
      <div>
        <p class="eyebrow">${t('nav.how_we_build')}</p>
        <h2 class="process__title" id="process-title">${t('home.process_title')}</h2>
        <p class="process__lead">${t('home.process_lead')}</p>
      </div>
      <a class="link-arrow" href="${href(lang, 'how-we-build')}">${t('home.process_more')} ${icon('arrow-right', { size: 18 })}</a>
    </div>

    <div class="track" aria-hidden="true" style="--track-cols: minmax(7rem, 12fr) ${prodMid}fr minmax(7.5rem, ${tl.onsite_assembly_days}fr) auto; --deliver:${tl.delivery_at_production_percent}%">
      <div class="track__seg track__seg--1" data-step="1"><span class="track__bar"></span><span class="track__name">01 ${t('home.process_track_design')}</span><span class="track__time">${when[0]}</span></div>
      <div class="track__seg track__seg--2" data-step="2">
        <span class="track__bar"></span>
        <span class="track__mark" data-step="3"><span class="track__mark-label">03 ${t('home.process_track_delivery')}</span></span>
        <span class="track__name">02 ${t('home.process_track_production')}</span><span class="track__time">${when[1]}</span>
      </div>
      <div class="track__seg track__seg--4" data-step="4"><span class="track__bar"></span><span class="track__name">04 ${t('home.process_track_onsite')}</span><span class="track__time">${when[3]}</span></div>
      <div class="track__end"><span class="track__flag">${icon('home', { size: 16 })}</span><span class="track__name">${t('home.process_track_handover')}</span></div>
    </div>

    <ol class="steps" role="list">
      ${content.steps.map((s, i) => html`
      <li class="step step--${s.order}" data-reveal>
        <figure class="step__media">
          ${picture(s.image, { alt: L(PROCESS_ALT[i]), sizes: '(min-width: 64em) 22vw, (min-width: 48em) 44vw, 6.5rem' })}
          <span class="step__num" aria-hidden="true">0${s.order}</span>
        </figure>
        <div class="step__body">
          <p class="step__time">${icon('clock', { size: 15 })}<span><span class="visually-hidden">${t('home.process_duration')}: </span>${when[i]}</span></p>
          <h3 class="step__title"><span class="visually-hidden">${t('home.process_step', { n: s.order })}: </span>${L(s.title)}</h3>
          <p class="step__text">${L(s.text)}</p>
        </div>
      </li>`)}
    </ol>

    <div class="process__cta">
      <p>${t('home.process_cta_lead')}</p>
      <div class="process__cta-actions">
        <a class="btn btn--primary btn--rect" href="${href(lang, 'contact')}" data-track="click_contact">${t('home.process_cta')} ${icon('arrow-right', { size: 18 })}</a>
        <a class="process__line" href="${settings.contact.line.href}" rel="noopener" data-track="click_line">${icon('chat', { size: 18 })}${t('cta.line')}</a>
      </div>
    </div>
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
    body: [hero, vision, discover, intro, finder, why, projectsSec, process, faq, contact],
  });
}
