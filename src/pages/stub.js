// Placeholder pages for routes not designed yet. Honest about status,
// but still useful: they show verified key facts and route users onward.
import { html } from '../lib/html.js';
import { makeT, pick } from '../lib/content.js';
import { makePicture } from '../lib/picture.js';
import { page, href } from '../components/layout.js';
import { icon } from '../components/icons.js';
import { price, specList, modelSpecs, badge } from '../components/ui.js';

export function renderStub({ lang, content, route }) {
  const t = makeT(content.i18n[lang]);
  const L = (v) => pick(v, lang).text;
  const picture = makePicture(content.images);
  const title = L(route.title);
  const m = route.model;
  const pendingText = lang === 'th' ? 'หน้านี้จะออกแบบในรอบถัดไป ระหว่างนี้คุณสามารถดูข้อมูลหลักด้านล่าง หรือคุยกับทีมงานได้เลย' : 'This page will be designed in the next iteration. Meanwhile, here are the key facts, or talk to our team.';

  const modelBlock = m ? html`
  <div class="stub__model">
    <figure class="stub__plan">
      ${picture(m.images.floor_plan, { alt: lang === 'th' ? `แปลนบ้าน ${title}` : `Floor plan of the ${title}`, sizes: '(min-width: 64em) 50vw, 92vw' })}
      <figcaption>${t('model.floor_plan')}</figcaption>
    </figure>
    <div>
      ${specList(modelSpecs(m, { t, lang }))}
      ${price(m, { t, lang, size: 'lg' })}
      ${m.images.cover_is_visualisation ? badge(t('status.visualisation'), 'neutral') : ''}
      ${L(m.description) ? html`<p>${L(m.description)}</p>` : html`<p class="muted">${t('status.content_pending')}</p>`}
    </div>
  </div>` : '';

  const body = html`
<section class="section stub">
  <div class="container">
    <nav class="breadcrumb" aria-label="Breadcrumb"><a href="${href(lang)}">Clay &amp; Stone</a> / <span aria-current="page">${title}</span></nav>
    <h1 class="stub__title">${title}</h1>
    ${route.lead ? html`<p class="stub__lead">${L(route.lead)}</p>` : ''}
    ${modelBlock}
    <p class="stub__notice">${icon('info', { size: 18 })} ${pendingText}</p>
    <div class="stub__actions">
      <a class="btn btn--primary" href="${href(lang)}#homes">${t('cta.explore_homes')}</a>
      <a class="btn btn--ghost" href="${content.settings.contact.line.href}" rel="noopener" data-track="click_line">${icon('chat')}${t('cta.line')}</a>
    </div>
  </div>
</section>`;

  return page({ lang, content, path: route.path, title: `${title} | Clay & Stone`, description: L(route.lead) || title, body, bodyClass: 'page-stub' });
}
