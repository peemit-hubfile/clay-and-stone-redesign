// Our Homes: series/bedroom filters, sorting and photo/plan toggles.
// Progressive enhancement: without JS every home, photo and plan is visible.
// Filter state is mirrored in the URL (?series=…&rooms=…&sort=…) so it can be shared.
import { track } from './track.js';

const SORTS = {
  featured: (a, b) => +a.dataset.order - +b.dataset.order,
  'price-asc': (a, b) => +a.dataset.price - +b.dataset.price || +a.dataset.order - +b.dataset.order,
  'price-desc': (a, b) => +b.dataset.price - +a.dataset.price || +a.dataset.order - +b.dataset.order,
  'area-desc': (a, b) => +b.dataset.area - +a.dataset.area || +a.dataset.order - +b.dataset.order,
};

export function initHomes(root) {
  const toolbar = root.querySelector('[data-homes-toolbar]');
  const list = root.querySelector('[data-homes-list]');
  const rows = [...list.querySelectorAll('[data-home]')];
  const sortSelect = root.querySelector('[data-homes-sort]');
  const count = root.querySelector('[data-homes-count]');
  const empty = root.querySelector('[data-homes-empty]');
  const chips = [...toolbar.querySelectorAll('[data-filter-key]')];
  const keys = [...new Set(chips.map((c) => c.dataset.filterKey))];

  // Read initial state from the URL, ignoring values that do not exist.
  const params = new URLSearchParams(location.search);
  const state = { sort: SORTS[params.get('sort')] ? params.get('sort') : 'featured' };
  for (const k of keys) {
    const v = params.get(k);
    state[k] = chips.some((c) => c.dataset.filterKey === k && c.dataset.filterValue === v) ? v : 'all';
  }

  function apply() {
    for (const c of chips) c.setAttribute('aria-pressed', String(state[c.dataset.filterKey] === c.dataset.filterValue));
    sortSelect.value = state.sort;

    let shown = 0;
    for (const r of rows) {
      const ok = keys.every((k) => state[k] === 'all' || r.dataset[k] === state[k]);
      r.hidden = !ok;
      if (ok) shown += 1;
    }
    [...rows].sort(SORTS[state.sort]).forEach((r) => list.append(r));

    empty.hidden = shown > 0;
    count.textContent = count.dataset.template.replace('{n}', shown).replace('{total}', rows.length);

    const next = new URLSearchParams(location.search);
    for (const k of [...keys, 'sort']) {
      const def = k === 'sort' ? 'featured' : 'all';
      if (state[k] === def) next.delete(k); else next.set(k, state[k]);
    }
    const qs = next.toString();
    history.replaceState(null, '', `${location.pathname}${qs ? `?${qs}` : ''}${location.hash}`);
  }

  toolbar.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-filter-key]');
    if (!chip) return;
    state[chip.dataset.filterKey] = chip.dataset.filterValue;
    apply();
    track('filter_homes', { [chip.dataset.filterKey]: chip.dataset.filterValue });
  });
  sortSelect.addEventListener('change', () => {
    state.sort = sortSelect.value;
    apply();
    track('sort_homes', { sort: state.sort });
  });
  root.querySelector('[data-homes-reset]').addEventListener('click', () => {
    for (const k of keys) state[k] = 'all';
    apply();
    toolbar.querySelector('[data-filter-key]').focus();
  });

  toolbar.hidden = false;
  apply();

  // Photo / floor-plan toggle per home.
  for (const media of root.querySelectorAll('[data-views]')) {
    const toggle = media.querySelector('[data-view-toggle]');
    const views = [...media.querySelectorAll('[data-view]')];
    const show = (name) => {
      views.forEach((v) => { v.hidden = v.dataset.view !== name; });
      toggle.querySelectorAll('[data-show]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.show === name)));
    };
    toggle.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-show]');
      if (!btn) return;
      show(btn.dataset.show);
      if (btn.dataset.show === 'plan') track('view_floor_plan', { model: media.closest('[data-model]')?.dataset.model });
    });
    media.setAttribute('data-views-ready', '');
    toggle.hidden = false;
    show('photo');
  }
}
