// Analytics stub. Logs events to the console only; no tracking scripts are
// installed and no personal data is collected (see docs/ux-opportunity.md §7).
export function track(event, params = {}) {
  const payload = { event, ...params, page: location.pathname, lang: document.documentElement.lang };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
  if (import.meta.env?.DEV) console.info('[track]', payload);
}

export function bindTracking(root = document) {
  root.addEventListener('click', (e) => {
    const el = e.target.closest('[data-track]');
    if (!el) return;
    const name = el.dataset.track;
    const params = {};
    const card = el.closest('[data-model]');
    if (card) params.model = card.dataset.model;
    track(name, params);
  });
}
