import { bindTracking, track } from './track.js';

bindTracking();

// Header: solid once the page scrolls past the top (transparent over the home hero).
const header = document.querySelector('[data-header]');
if (header) {
  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:0;height:80px;width:1px;pointer-events:none';
  document.body.prepend(sentinel);
  new IntersectionObserver(([e]) => header.classList.toggle('is-solid', !e.isIntersecting)).observe(sentinel);
}

// Mobile menu: progressive enhancement of a link to #site-menu into a modal <dialog>.
const toggle = document.querySelector('[data-menu-toggle]');
const menu = document.getElementById('site-menu');
if (toggle && menu?.showModal) {
  toggle.setAttribute('role', 'button');
  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    menu.showModal();
    toggle.setAttribute('aria-expanded', 'true');
  });
  menu.addEventListener('close', () => { toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); });
  menu.querySelector('[data-menu-close]').addEventListener('click', () => menu.close());
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) menu.close(); });
}

// Series filter on the homes grid.
const filter = document.querySelector('[data-filter]');
if (filter) {
  filter.hidden = false;
  const blocks = [...document.querySelectorAll('[data-series-block]')];
  filter.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter-value]');
    if (!btn) return;
    const v = btn.dataset.filterValue;
    filter.querySelectorAll('[data-filter-value]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    blocks.forEach((b) => { b.hidden = v !== 'all' && b.dataset.seriesBlock !== v; });
    track('filter_homes', { series: v });
  });
}

// Home Finder (loaded only where present).
const finderRoot = document.querySelector('[data-finder]');
if (finderRoot) import('./finder-ui.js').then((m) => m.initFinder(finderRoot));

// Motion (GSAP) is code-split and never loaded for reduced-motion users.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) import('./motion.js').then((m) => m.initMotion());

if (document.body.classList.contains('page-home')) track('view_home');
