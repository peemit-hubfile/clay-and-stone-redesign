// Smart Home Finder UI (rules-based). Uses the same engine the seed validator tests.
// Flow: 4 steps (the last one optional) → results. No page reloads; answers are kept
// when moving back and forth or editing from the results. Nothing is sent anywhere.
//
// Accessibility notes:
// - Each step is a <fieldset> of native radios, so arrow keys move within a group.
// - Auto-advance happens only after a pointer click, never on keyboard selection
//   (arrow keys change the radio and must not jump to the next question).
// - The live match count is an aria-live region; results receive focus.
import { recommend } from './finder-engine.js';
import { track } from './track.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
const ICON = {
  arrow: '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  chat: '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>',
  phone: '<svg class="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
};

export function initFinder(root) {
  const data = JSON.parse(root.querySelector('[data-finder-data]').textContent);
  const { lang, finder, i18n, models } = data;
  const tr = (o) => (o && (o[lang] ?? o.en)) || '';
  const section = root.closest('section');
  const form = root.querySelector('[data-finder-form]');
  const resultsEl = root.querySelector('[data-finder-results]');
  const questions = [...form.querySelectorAll('[data-q]')];
  const steps = [...form.querySelectorAll('[data-finder-goto]')];
  const back = form.querySelector('[data-finder-back]');
  const next = form.querySelector('[data-finder-next]');
  const skip = form.querySelector('[data-finder-skip]');
  const stepLabel = form.querySelector('[data-finder-step]');
  const count = section.querySelector('[data-finder-count]');
  const homes = [...section.querySelectorAll('[data-finder-home]')];
  const total = models.length;
  const nextLabel = next.innerHTML;
  const allMatches = { ...finder, results: { ...finder.results, max_results: total } };

  let index = 0;
  let reached = 0;
  let started = false;
  let viaPointer = false; // last selection came from a pointer click on a choice

  form.hidden = false;

  const answers = () => Object.fromEntries(new FormData(form).entries());
  const answered = (i) => !!questions[i].querySelector('input:checked');
  const optional = (i) => questions[i].dataset.optional === 'true';
  const isLast = (i) => i === questions.length - 1;

  // Live strip: dim homes that no longer match the answers so far.
  function updateLive() {
    const a = answers();
    const any = Object.keys(a).length > 0;
    const ids = new Set(recommend(models, allMatches, a, lang).matches.map((r) => r.model.id));
    homes.forEach((h) => h.classList.toggle('is-out', any && !ids.has(h.dataset.finderHome)));
    count.textContent = !any ? fill(i18n.live_all, { total }) : ids.size ? fill(i18n.live_count, { n: ids.size, total }) : i18n.live_none;
  }

  function show(i, { focus = false } = {}) {
    index = i;
    reached = Math.max(reached, i);
    questions.forEach((q, n) => { q.hidden = n !== i; });
    steps.forEach((s, n) => {
      s.disabled = n > reached;
      s.classList.toggle('is-done', n !== i && answered(n));
      s.classList.toggle('is-current', n === i);
      if (n === i) s.setAttribute('aria-current', 'step'); else s.removeAttribute('aria-current');
    });
    stepLabel.textContent = fill(i18n.step, { n: i + 1, total: questions.length });
    back.disabled = i === 0;
    next.disabled = !answered(i);
    skip.hidden = !(optional(i) && !answered(i));
    next.innerHTML = isLast(i) ? `${esc(i18n.see_results)} ${ICON.arrow}` : nextLabel;
    if (focus) (questions[i].querySelector('input:checked') || questions[i].querySelector('input')).focus();
  }

  function advance() {
    if (isLast(index)) renderResults();
    else show(index + 1, { focus: true });
  }

  form.addEventListener('pointerdown', (e) => { viaPointer = !!e.target.closest('.choice'); });
  form.addEventListener('keydown', () => { viaPointer = false; });
  form.addEventListener('change', (e) => {
    if (!e.target.matches('input[type=radio]')) return;
    if (!started) { started = true; track('start_home_finder'); }
    updateLive();
    show(index);
    // Pointer selection moves on; keyboard selection (arrow keys) never does.
    if (viaPointer && !isLast(index)) {
      viaPointer = false;
      const from = index;
      setTimeout(() => { if (index === from) show(index + 1, { focus: true }); }, 260);
    }
  });
  back.addEventListener('click', () => { if (index > 0) show(index - 1, { focus: true }); });
  next.addEventListener('click', () => { if (answered(index)) advance(); });
  skip.addEventListener('click', advance);
  steps.forEach((s, n) => s.addEventListener('click', () => show(n, { focus: true })));

  // Reasons read as one short paragraph. English phrases become sentences; Thai phrases
  // keep the language's own space-as-sentence-break, widened in CSS so they don't run on.
  const prose = (list) => (lang === 'th'
    ? list
    : list.map((x) => x.charAt(0).toUpperCase() + x.slice(1) + (/[.!?]$/.test(x) ? '' : '.')));

  function card(r, rank, { close, single }) {
    const tpl = root.querySelector(`[data-finder-card="${r.model.id}"]`);
    const node = tpl.content.firstElementChild.cloneNode(true);
    const label = close ? (rank === 1 ? i18n.close_matches : '') : single ? '' : rank === 1 ? i18n.best : fill(i18n.option, { n: rank });
    const rankEl = node.querySelector('[data-result-rank]');
    rankEl.textContent = label;
    rankEl.hidden = !label;
    node.classList.add(rank === 1 ? 'result--best' : 'result--more');
    node.querySelector('[data-result-why]').innerHTML = prose([...new Set(r.reasons)]).map((x) => `<span>${esc(x)}</span>`).join(' ');
    if (r.failed.length) {
      const lim = node.querySelector('[data-result-limits]');
      const miss = r.failed.map((x) => `${i18n.not_matched} ${x}`).join(' · ');
      lim.textContent = lim.textContent.trim() ? `${miss} · ${lim.textContent}` : miss;
      node.querySelector('[data-result-note]').hidden = false;
    }
    return node;
  }

  function renderResults() {
    const a = answers();
    const r = recommend(models, finder, a, lang);
    // Answers recap: plain text, each answer is an inline button back to its step.
    const recap = finder.questions.map((q, i) => {
      const opt = q.options.find((o) => o.id === a[q.id]);
      return opt ? `<button type="button" class="recap__answer" data-edit="${i}"><span class="visually-hidden">${esc(tr(q.short))}: </span>${esc(tr(opt.label))}</button>` : '';
    }).filter(Boolean).join('<span class="recap__sep" aria-hidden="true"> · </span>');
    const n = r.matches.length;
    const title = n === 1 ? i18n.results_one : fill(i18n.results_many, { n });
    const notes = [...r.notes, data.alwaysNote].filter(Boolean);
    const consult = `<div class="results__consult">
        <h3 class="results__title">${esc(data.noMatch.title)}</h3>
        <p>${esc(data.noMatch.text)}</p>
        <div class="results__consult-actions">
          <a class="btn btn--primary btn--rect" href="${esc(data.contact.line)}" rel="noopener" data-track="click_line">${ICON.chat}${esc(data.contact.lineLabel)}</a>
          <a class="btn btn--line btn--rect" href="${esc(data.contact.phone)}" data-track="click_phone">${ICON.phone}${esc(data.contact.phoneLabel)}</a>
        </div>
      </div>`;

    resultsEl.innerHTML = `
      <div class="results__head">
        <p class="results__recap"><span class="results__recap-label">${esc(i18n.answers)}</span> ${recap}</p>
        ${n ? `<h3 class="results__title">${esc(title)}</h3>` : ''}
      </div>
      ${n ? '' : consult}
      ${!n && r.close.length ? `<p class="results__close">${esc(i18n.close_intro)}</p>` : ''}
      <div class="results__list" data-results-list></div>
      ${notes.length ? `<div class="results__notes">${notes.map((x) => `<p>${esc(x)}</p>`).join('')}</div>` : ''}
      <div class="results__foot">
        <button type="button" class="finder__back" data-edit="0">${esc(i18n.edit)}</button>
        <button type="button" class="finder__skip" data-restart>${esc(i18n.restart)}</button>
      </div>`;
    const list = resultsEl.querySelector('[data-results-list]');
    const shown = n ? r.matches : r.close;
    shown.forEach((x, i) => list.append(card(x, i + 1, { close: !n, single: shown.length === 1 })));
    if (shown.length > 1) list.children[0].insertAdjacentHTML('afterend', `<p class="results__more">${esc(n ? i18n.also_fit : i18n.also_close)}</p>`);

    form.hidden = true;
    resultsEl.hidden = false;
    section.classList.add('is-results');
    resultsEl.focus({ preventScroll: true });
    resultsEl.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    track('complete_home_finder', { matches: r.matches.map((x) => x.model.id).join(',') || 'none' });
  }

  function backToForm(i) {
    resultsEl.hidden = true;
    form.hidden = false;
    section.classList.remove('is-results');
    show(i, { focus: true });
  }

  resultsEl.addEventListener('click', (e) => {
    const edit = e.target.closest('[data-edit]');
    if (edit) { backToForm(Number(edit.dataset.edit)); return; }
    if (e.target.closest('[data-restart]')) {
      form.reset();
      reached = 0;
      updateLive();
      backToForm(0);
    }
  });

  updateLive();
  show(0);
}
