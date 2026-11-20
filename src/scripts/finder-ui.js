// Smart Home Finder UI (rules-based). Uses the same engine the seed validator tests.
import { recommend } from './finder-engine.js';
import { track } from './track.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ICON_CHECK = '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
const ICON_X = '<svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

export function initFinder(root) {
  const data = JSON.parse(root.querySelector('[data-finder-data]').textContent);
  const { lang, finder, i18n, status, labels, models } = data;
  const form = root.querySelector('[data-finder-form]');
  const results = root.querySelector('[data-finder-results]');
  const questions = [...form.querySelectorAll('[data-q]')];
  const back = form.querySelector('[data-finder-back]');
  const next = form.querySelector('[data-finder-next]');
  const stepLabel = form.querySelector('[data-finder-step]');
  const bar = form.querySelector('[data-finder-bar]');
  const fmt = new Intl.NumberFormat(lang === 'th' ? 'th-TH' : 'en-US');
  let index = 0;
  let started = false;

  form.hidden = false;

  const answered = (q) => !!q.querySelector('input:checked');
  function show(i) {
    index = i;
    questions.forEach((q, n) => { q.hidden = n !== i; });
    stepLabel.textContent = i18n.step.replace('{n}', i + 1).replace('{total}', questions.length);
    bar.style.inlineSize = `${((i + 1) / questions.length) * 100}%`;
    back.disabled = i === 0;
    next.disabled = !answered(questions[i]);
    next.innerHTML = (i === questions.length - 1 ? esc(i18n.see_results) : esc(i18n.next)) + ' <svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
  }

  form.addEventListener('change', (e) => {
    if (!started) { started = true; track('start_home_finder'); }
    next.disabled = !answered(questions[index]);
    // Auto-advance after a choice, unless on the last question.
    if (e.target.matches('input[type=radio]') && index < questions.length - 1) {
      setTimeout(() => { show(index + 1); questions[index].querySelector('input')?.focus(); }, 180);
    }
  });
  back.addEventListener('click', () => { if (index > 0) { show(index - 1); questions[index].querySelector('input:checked, input')?.focus(); } });
  next.addEventListener('click', () => {
    if (!answered(questions[index])) return;
    if (index < questions.length - 1) { show(index + 1); questions[index].querySelector('input')?.focus(); return; }
    renderResults();
  });

  function card(r, rank, close = false) {
    const m = r.model;
    const pending = m.price.status === 'pending-confirmation';
    const reasons = r.reasons.length ? `<ul class="result__reasons" role="list">${r.reasons.map((x) => `<li>${ICON_CHECK}<span>${esc(x)}</span></li>`).join('')}</ul>` : '';
    const misses = r.failed.length ? `<ul class="result__reasons result__reasons--miss" role="list">${r.failed.map((x) => `<li>${ICON_X}<span>${esc(i18n.not_matched)}: ${esc(x)}</span></li>`).join('')}</ul>` : '';
    return `<article class="result">
      <div class="result__head">
        <h3 class="result__name">${esc(m.name)}</h3>
        <span class="result__rank">${close ? esc(i18n.close_matches) : '#' + rank}</span>
      </div>
      <p class="price price--sm"><span class="price__label">${esc(labels.price_from)}</span><span class="price__value">${fmt.format(m.price.display_thb)}</span><span class="price__unit">${esc(labels.currency)} · ${fmt.format(m.area_sqm.usable)} ${esc(labels.sqm)}</span>${pending ? `<span class="badge badge--pending">${esc(status.price_pending)}</span>` : ''}</p>
      ${reasons ? `<div><p class="eyebrow" style="margin-block-end:.5rem">${esc(i18n.why)}</p>${reasons}</div>` : ''}${misses}
      <div class="result__actions"><a class="btn btn--primary btn--sm" href="${esc(m.url)}" data-track="view_product">${esc(labels.view)}</a></div>
    </article>`;
  }

  function renderResults() {
    const answers = Object.fromEntries(new FormData(form).entries());
    const r = recommend(models, finder, answers, lang);
    const t = (o) => o[lang] ?? o.en;
    let out = '';
    if (r.matches.length) {
      out += r.matches.map((x, i) => card(x, i + 1)).join('');
    } else {
      out += `<div><h3 class="result__name">${esc(t(finder.results.no_match.title))}</h3><p class="muted" style="margin-top:.5rem">${esc(t(finder.results.no_match.text))}</p></div>`;
      out += r.close.map((x) => card(x, 0, true)).join('');
    }
    if (r.notes.length) out += `<div class="finder__notes">${r.notes.map((n) => `<p>${esc(n)}</p>`).join('')}</div>`;
    out += `<div class="result__actions"><a class="btn btn--primary" href="${esc(data.line)}" rel="noopener" data-track="click_line">${esc(labels.line)}</a><button type="button" class="btn btn--ghost" data-finder-restart>${esc(i18n.restart)}</button></div>`;
    results.innerHTML = out;
    form.hidden = true;
    results.hidden = false;
    results.focus();
    track('complete_home_finder', { matches: r.matches.map((x) => x.model.id).join(',') || 'none' });
    results.querySelector('[data-finder-restart]').addEventListener('click', () => {
      form.reset(); results.hidden = true; form.hidden = false; show(0); questions[0].querySelector('input').focus();
    });
  }

  show(0);
}
