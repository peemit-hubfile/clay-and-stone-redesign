// Our Homes: index of every model, with series/bedroom filters, sorting,
// photo/plan toggle, a specs-and-price table, cost clarity and series overview.
import { html } from '../lib/html.js';
import { makeT, pick, formatTHB, formatSqm } from '../lib/content.js';
import { makePicture } from '../lib/picture.js';
import { page, href, SITE_URL } from '../components/layout.js';
import { icon } from '../components/icons.js';
import { sectionHead, specList, modelSpecs, price, badge, contactCta } from '../components/ui.js';

// Bedroom filter bucket: open-plan and loft homes are grouped as "studio".
const roomsKey = (m) => (m.sleeping === 'open-plan' || m.sleeping === 'loft' ? 'studio' : String(m.bedrooms));

export function renderHomes({ lang, content, route }) {
  const t = makeT(content.i18n[lang]);
  const L = (v) => pick(v, lang).text;
  const picture = makePicture(content.images);
  const { models, series, settings, finder } = content;
  const live = series.filter((s) => s.status === 'available');
  const upcoming = series.filter((s) => s.status === 'coming-soon');
  const seriesOf = (m) => series.find((s) => s.id === m.series_id);
  const fullName = (m) => `${L(seriesOf(m).name)} ${L(m.name)}`;
  const sqm = (n) => `${formatSqm(n, lang)} ${t('model.sqm')}`;
  const baht = (n) => `${formatTHB(n, lang)} ${t('model.currency')}`;

  const prices = models.map((m) => m.price.display_thb);
  const areas = models.map((m) => m.area_sqm.usable);
  const minPrice = Math.min(...prices);
  const days = settings.timeline.onsite_assembly_days;
  const roomBuckets = ['studio', '1', '2'].filter((k) => models.some((m) => roomsKey(m) === k));

  /* 01 Page header ------------------------------------------------------------ */
  const head = html`
<section class="homes-hero" aria-labelledby="homes-title">
  <div class="container">
    <nav class="breadcrumb" aria-label="Breadcrumb"><a href="${href(lang)}">Clay &amp; Stone</a> / <span aria-current="page">${t('homes.title')}</span></nav>
    <div class="homes-hero__grid">
      <div>
        <p class="eyebrow">${t('homes.eyebrow')}</p>
        <h1 class="homes-hero__title" id="homes-title">${t('homes.title')}</h1>
        <p class="homes-hero__lead">${t('homes.lead', { homes: models.length, series: live.length, days })}</p>
      </div>
      <dl class="homes-stats">
        <div><dt>${t('homes.stat_homes')}</dt><dd>${models.length}</dd></div>
        <div><dt>${t('homes.stat_area')}</dt><dd>${formatSqm(Math.min(...areas), lang)}–${formatSqm(Math.max(...areas), lang)} <span>${t('model.sqm')}</span></dd></div>
        <div><dt>${t('homes.stat_price')}</dt><dd>${formatTHB(minPrice, lang)} <span>${t('model.currency')}</span></dd></div>
        <div><dt>${t('homes.stat_onsite')}</dt><dd>~${days} <span>${t('homes.days')}</span></dd></div>
      </dl>
    </div>
  </div>
</section>`;

  /* 02 Toolbar + list ------------------------------------------------------------ */
  const chipGroup = (name, label, options) => html`
  <div class="toolbar__group">
    <span class="toolbar__label" id="filter-${name}-label">${label}</span>
    <div class="toolbar__chips" role="group" aria-labelledby="filter-${name}-label">
      <button type="button" class="chip" aria-pressed="true" data-filter-key="${name}" data-filter-value="all">${t('homes.all')}</button>
      ${options.map((o) => html`<button type="button" class="chip" aria-pressed="false" data-filter-key="${name}" data-filter-value="${o.value}">${o.label}</button>`)}
    </div>
  </div>`;

  const toolbar = html`
<div class="toolbar" data-homes-toolbar hidden>
  ${chipGroup('series', t('homes.filter_series'), live.map((s) => ({ value: s.id, label: L(s.name) })))}
  ${chipGroup('rooms', t('homes.filter_rooms'), roomBuckets.map((k) => ({ value: k, label: t(`homes.rooms_${k}`) })))}
  <div class="toolbar__group toolbar__group--sort">
    <label class="toolbar__label" for="homes-sort">${t('homes.sort_label')}</label>
    <span class="select">
      <select id="homes-sort" data-homes-sort>
        <option value="featured">${t('homes.sort_featured')}</option>
        <option value="price-asc">${t('homes.sort_price_asc')}</option>
        <option value="price-desc">${t('homes.sort_price_desc')}</option>
        <option value="area-desc">${t('homes.sort_area_desc')}</option>
      </select>
      ${icon('chevron-down', { size: 18 })}
    </span>
  </div>
  <p class="toolbar__count" data-homes-count aria-live="polite" data-template="${t('homes.count')}">${t('homes.count', { n: models.length, total: models.length })}</p>
</div>`;

  const areaSplit = (m) => {
    const a = m.area_sqm;
    const parts = [
      a.interior_incl_toilet != null && { label: t('model.interior'), value: a.interior_incl_toilet },
      a.terrace != null && { label: t('model.terrace'), value: a.terrace },
      a.other?.pet_house != null && { label: t('model.pet_house'), value: a.other.pet_house },
    ].filter(Boolean);
    if (!parts.length) return '';
    return html`
      <div class="area-split">
        <p class="area-split__title">${t('homes.area_breakdown')} ${a.status === 'pending-confirmation' ? badge(t('status.pending'), 'pending', lang === 'th' ? 'ตัวเลขบนเว็บไซต์ปัจจุบันไม่ตรงกัน รอยืนยัน' : 'Figures on the live site do not add up; awaiting confirmation') : ''}</p>
        <dl>${parts.map((p) => html`<div><dt>${p.label}</dt><dd>${sqm(p.value)}</dd></div>`)}</dl>
      </div>`;
  };

  const row = (m, i) => {
    const name = fullName(m);
    const desc = L(m.description);
    const url = href(lang, m.path);
    return html`
  <article class="home-row" id="${m.id}" aria-labelledby="${m.id}-title" data-home data-model="${m.id}" data-series="${m.series_id}" data-rooms="${roomsKey(m)}" data-price="${m.price.display_thb}" data-area="${m.area_sqm.usable}" data-order="${i}">
    <div class="home-row__media" data-views>
      <div class="view-toggle" role="group" aria-label="${t('homes.view_label')}: ${name}" data-view-toggle hidden>
        <button type="button" aria-pressed="true" data-show="photo">${t('homes.view_photo')}</button>
        <button type="button" aria-pressed="false" data-show="plan">${t('model.floor_plan')}</button>
      </div>
      <a class="home-row__view home-row__view--photo" href="${url}" data-view="photo" tabindex="-1" aria-hidden="true">
        ${picture(m.images.cover, { alt: '', sizes: '(min-width: 64em) 56vw, 92vw', priority: i === 0 })}
        ${m.images.cover_is_visualisation ? badge(t('status.visualisation'), 'overlay') : ''}
      </a>
      <figure class="home-row__view home-row__view--plan" data-view="plan">
        ${picture(m.images.floor_plan, { alt: lang === 'th' ? `แปลนบ้าน ${name}` : `Floor plan of the ${name}`, sizes: '(min-width: 64em) 56vw, 92vw' })}
        <figcaption>${t('model.floor_plan')}</figcaption>
      </figure>
    </div>
    <div class="home-row__body">
      <p class="eyebrow">${L(seriesOf(m).name)}</p>
      <h3 class="home-row__title" id="${m.id}-title"><a href="${url}" data-track="view_product"><span class="visually-hidden">${L(seriesOf(m).name)} </span>${L(m.name)}</a></h3>
      ${desc ? html`<p class="home-row__desc">${desc}</p>` : html`<p class="home-row__desc muted">${L(seriesOf(m).tagline)}</p>`}
      ${specList(modelSpecs(m, { t, lang }))}
      ${areaSplit(m)}
      ${price(m, { t, lang, size: 'md' })}
      <div class="home-row__actions">
        <a class="btn btn--primary" href="${url}" data-track="view_product">${t('cta.view_home')} ${icon('arrow-right', { size: 18 })}</a>
        <a class="btn btn--ghost" href="${settings.contact.line.href}" rel="noopener" data-track="click_line">${icon('chat', { size: 18 })}${t('cta.line')}</a>
      </div>
    </div>
  </article>`;
  };

  const list = html`
<section class="section section--tight homes-list" aria-labelledby="homes-list-title" data-homes>
  <div class="container">
    <h2 class="visually-hidden" id="homes-list-title">${t('homes.list_title')}</h2>
    ${toolbar}
    <div class="home-rows" data-homes-list>
      ${models.map(row)}
    </div>
    <div class="homes-empty" data-homes-empty hidden>
      <h3>${t('homes.empty_title')}</h3>
      <p>${t('homes.empty_text')}</p>
      <div class="homes-empty__actions">
        <button type="button" class="btn btn--primary" data-homes-reset>${t('homes.reset')}</button>
        <a class="btn btn--ghost" href="${settings.contact.line.href}" rel="noopener" data-track="click_line">${icon('chat', { size: 18 })}${t('cta.line')}</a>
      </div>
    </div>
  </div>
</section>`;

  /* 03 At a glance + what the price covers ------------------------------------------- */
  const pendingMark = (m) => (m.price.status === 'pending-confirmation' ? html`<span class="glance__mark" aria-label="${t('status.price_pending')}">*</span>` : '');
  const roomsCell = (m) => (m.sleeping === 'open-plan' ? t('model.open_plan') : m.sleeping === 'loft' ? t('model.loft') : m.bedrooms);
  const offer = settings.offer;
  const budget = offer.budget_guidance;
  const glance = html`
<section class="section glance" aria-labelledby="glance-title">
  <div class="container">
    ${sectionHead({ eyebrow: t('nav.compare'), title: t('homes.glance_title'), lead: t('homes.glance_lead'), id: 'glance-title' })}
    <div class="table-scroll" role="region" aria-labelledby="glance-caption" tabindex="0" data-reveal>
      <table class="glance__table">
        <caption id="glance-caption" class="visually-hidden">${t('homes.table_caption')}</caption>
        <thead>
          <tr>
            <th scope="col">${t('homes.table_home')}</th>
            <th scope="col" class="num">${t('model.usable_area')} <span class="glance__unit">(${t('model.sqm')})</span></th>
            <th scope="col" class="num">${t('model.interior')} <span class="glance__unit">(${t('model.sqm')})</span></th>
            <th scope="col" class="num">${t('model.terrace')} <span class="glance__unit">(${t('model.sqm')})</span></th>
            <th scope="col">${t('model.bedrooms')}</th>
            <th scope="col" class="num">${t('model.bathrooms')}</th>
            <th scope="col" class="num">${t('model.storeys')}</th>
            <th scope="col" class="num">${t('model.price_from')} (${t('model.currency')})</th>
          </tr>
        </thead>
        <tbody>
          ${models.map((m) => html`
          <tr>
            <th scope="row"><a href="${href(lang, m.path)}"><span class="glance__series">${L(seriesOf(m).name)}</span> ${L(m.name)}</a></th>
            <td class="num">${formatSqm(m.area_sqm.usable, lang)}</td>
            <td class="num">${m.area_sqm.interior_incl_toilet != null ? formatSqm(m.area_sqm.interior_incl_toilet, lang) : '–'}</td>
            <td class="num">${m.area_sqm.terrace != null ? formatSqm(m.area_sqm.terrace, lang) : '–'}</td>
            <td>${roomsCell(m)}</td>
            <td class="num">${m.bathrooms ?? '–'}</td>
            <td class="num">${m.storeys}</td>
            <td class="num glance__price">${formatTHB(m.price.display_thb, lang)}${pendingMark(m)}</td>
          </tr>`)}
        </tbody>
      </table>
    </div>
    <p class="glance__foot">${t('homes.price_footnote')}</p>

    <div class="cost" data-reveal>
      <h3 class="cost__title">${t('homes.cost_title')}</h3>
      <div class="cost__grid">
        <div class="cost__col">
          <h4>${t('model.included')}</h4>
          <ul role="list" class="cost__list">${offer.included.map((x) => html`<li>${icon('check', { size: 18 })}${L(x)}</li>`)}</ul>
        </div>
        <div class="cost__col">
          <h4>${t('model.customer_prepares')}</h4>
          <ul role="list" class="cost__list cost__list--prep">${offer.customer_prepares.map((x) => html`<li>${icon('arrow-right', { size: 18 })}${L(x)}</li>`)}</ul>
        </div>
        <div class="cost__col cost__note">
          <h4>${t('homes.cost_budget_label')}</h4>
          <p>${t('homes.cost_budget', { min: budget.extra_percent_min, max: budget.extra_percent_max })}</p>
        </div>
      </div>
    </div>
  </div>
</section>`;

  /* 04 Series overview ---------------------------------------------------------------- */
  const seriesCard = (s) => {
    const ms = models.filter((m) => m.series_id === s.id);
    const img = s.images.identity?.[0];
    const isRender = ms.length > 0 && ms.every((m) => m.images.cover_is_visualisation);
    return html`
    <article class="series-card" data-reveal>
      <div class="series-card__media">
        ${img ? picture(img, { alt: '', sizes: '(min-width: 64em) 16vw, 36vw' }) : ''}
        ${isRender ? badge(t('status.visualisation'), 'overlay') : ''}
      </div>
      <div class="series-card__body">
        <h3 class="series-card__name">${L(s.name)}</h3>
        <p class="series-card__tagline" lang="en">${s.tagline.en}</p>
        <ul class="series-card__values" role="list" lang="en">${s.values.map((v) => html`<li>${v}</li>`)}</ul>
        <p class="series-card__meta">${t(ms.length === 1 ? 'homes.series_homes_one' : 'homes.series_homes', { n: ms.length })} · ${t('model.price_from')} ${baht(Math.min(...ms.map((m) => m.price.display_thb)))}</p>
        <a class="link-arrow" href="${href(lang, `homes/${s.slug}`)}">${t('homes.series_explore')} <span class="visually-hidden">${L(s.name)}</span>${icon('arrow-right', { size: 18 })}</a>
      </div>
    </article>`;
  };
  const seriesSec = html`
<section class="section series-overview" aria-labelledby="series-title">
  <div class="container">
    ${sectionHead({ eyebrow: t('model.series'), title: t('homes.series_title', { n: live.length }), lead: t('homes.series_lead'), id: 'series-title' })}
    <div class="series-cards">
      ${live.map(seriesCard)}
    </div>
    ${upcoming.map((s) => html`
    <aside class="upcoming" aria-labelledby="upcoming-${s.id}" data-reveal>
      <div>
        <p class="eyebrow">${t('homes.coming_soon_lead')} ${badge(t('status.coming_soon'), 'neutral')}</p>
        <h3 id="upcoming-${s.id}" class="upcoming__name">${L(s.name)}</h3>
        <p class="upcoming__text">${L(s.intro)}</p>
      </div>
      <a class="btn btn--ghost" href="${settings.contact.line.href}" rel="noopener" data-track="click_line">${icon('chat', { size: 18 })}${t('homes.coming_soon_cta')}</a>
    </aside>`)}
  </div>
</section>`;

  /* 05 Help choosing ---------------------------------------------------------------- */
  const help = html`
<section class="help-band" aria-labelledby="help-title">
  <div class="container">
  <div class="help-band__inner" data-reveal>
    <div>
      <p class="eyebrow">${t('home.finder_eyebrow')}</p>
      <h2 class="help-band__title" id="help-title">${t('homes.help_title')}</h2>
      <p class="help-band__lead">${t('homes.help_lead', { n: finder.questions.length })}</p>
    </div>
    <div class="help-band__actions">
      <a class="btn btn--primary" href="${href(lang)}#finder" data-track="start_home_finder_link">${t('cta.start_finder')} ${icon('arrow-right', { size: 18 })}</a>
    </div>
  </div>
  </div>
</section>`;

  /* Structured data: the list of homes on this page. */
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t('homes.title'),
    itemListElement: models.map((m, i) => ({ '@type': 'ListItem', position: i + 1, name: fullName(m), url: `${SITE_URL}${href(lang, m.path)}` })),
  };

  const seo = {
    th: { title: 'แบบบ้านสำเร็จรูป บ้านโมดูลาร์ทุกแบบ พร้อมราคา | Clay & Stone', description: `รวมแบบบ้านโมดูลาร์ ${models.length} แบบจาก Clay & Stone พื้นที่ ${formatSqm(Math.min(...areas), lang)}–${formatSqm(Math.max(...areas), lang)} ตร.ม. ราคาเริ่มต้น ${formatTHB(minPrice, lang)} บาท (รวม VAT) พร้อมแปลนบ้านและสเปกเปรียบเทียบ` },
    en: { title: 'Modular Home Designs and Prices | Clay & Stone', description: `All ${models.length} Clay & Stone modular homes: ${formatSqm(Math.min(...areas), lang)}–${formatSqm(Math.max(...areas), lang)} sqm, from ${formatTHB(minPrice, lang)} THB incl. VAT, with floor plans and a side-by-side spec table.` },
  }[lang];

  return page({
    lang, content, path: route.path, title: seo.title, description: seo.description, bodyClass: 'page-homes',
    body: [head, list, glance, seriesSec, help, contactCta({ t, content, picture })],
    jsonLd: [itemList],
  });
}

