// "Why our homes" explorer (docs/materials-v3.md §6–7).
// Three tabs over one photo-and-answer panel; each panel holds its own verbatim
// technical specifications in a native <details>. Without this script all three panels
// are shown stacked and every spec can still be opened.
// WAI-ARIA tabs pattern: arrow keys / Home / End move between tabs, panels are focusable.
import { track } from './track.js';

export function initMaterials(root) {
  const tablist = root.querySelector('[data-explore-tabs]');
  const tabs = [...root.querySelectorAll('[data-explore-tab]')];
  const panels = Object.fromEntries([...root.querySelectorAll('[data-explore-panel]')].map((p) => [p.dataset.explorePanel, p]));
  const motion = () => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth');
  let select = () => {};

  if (tablist && tabs.length) {
    tablist.hidden = false;
    tablist.setAttribute('role', 'tablist');
    tabs.forEach((tab) => tab.setAttribute('role', 'tab'));
    Object.values(panels).forEach((p) => {
      p.setAttribute('role', 'tabpanel');
      p.setAttribute('tabindex', '0');
      p.setAttribute('aria-labelledby', `tab-${p.dataset.explorePanel}`);
    });
    root.querySelectorAll('[data-explore-next]').forEach((b) => { b.hidden = false; });

    select = (id, { focusTab = false, focusPanel = false } = {}) => {
      tabs.forEach((tab) => {
        const on = tab.dataset.exploreTab === id;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
        if (on && focusTab) tab.focus();
      });
      Object.entries(panels).forEach(([key, p]) => { p.hidden = key !== id; });
      if (focusPanel) panels[id].focus({ preventScroll: true });
    };
    select(tabs[0].dataset.exploreTab);

    tablist.addEventListener('click', (e) => {
      const tab = e.target.closest('[data-explore-tab]');
      if (!tab) return;
      select(tab.dataset.exploreTab);
      track('view_material_topic', { topic: tab.dataset.exploreTab });
    });
    tablist.addEventListener('keydown', (e) => {
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      const to = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (to === undefined) return;
      e.preventDefault();
      select(tabs[(to + tabs.length) % tabs.length].dataset.exploreTab, { focusTab: true });
    });
    root.addEventListener('click', (e) => {
      const next = e.target.closest('[data-explore-next]');
      if (!next) return;
      select(next.dataset.exploreNext, { focusPanel: true });
      // Keep the tab row in view so the change of topic is visible.
      if (tablist.getBoundingClientRect().top < 0) tablist.scrollIntoView({ block: 'start', behavior: motion() });
      track('view_material_topic', { topic: next.dataset.exploreNext, via: 'next' });
    });
  }

  root.querySelectorAll('[data-tech]').forEach((d) => d.addEventListener('toggle', () => {
    if (d.open) track('view_material_specs', { topic: d.dataset.tech });
  }));

  // Arriving with #spec-… in the URL opens that topic and its technical details.
  const target = location.hash.startsWith('#spec-') && root.querySelector(location.hash);
  if (target) {
    const panel = target.closest('[data-explore-panel]');
    if (panel) select(panel.dataset.explorePanel);
    const details = target.closest('details');
    if (details) details.open = true;
    // After load, so the browser's own scroll restoration doesn't override it.
    const go = () => requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
    if (document.readyState === 'complete') go(); else addEventListener('load', go, { once: true });
  }
}
