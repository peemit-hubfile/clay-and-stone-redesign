import { bindTracking, track } from './track.js';

bindTracking();

// Header: hairline appears once the page scrolls past the top.
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

// Our Homes listing: filters, sorting, photo/plan toggle (loaded only where present).
const homesRoot = document.querySelector('[data-homes]');
if (homesRoot) import('./homes.js').then((m) => m.initHomes(homesRoot));

// Home Finder (loaded only where present).
const finderRoot = document.querySelector('[data-finder]');
if (finderRoot) import('./finder-ui.js').then((m) => m.initFinder(finderRoot));

// Motion (GSAP) is code-split and never loaded for reduced-motion users.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) import('./motion.js').then((m) => m.initMotion());

if (document.body.classList.contains('page-home')) track('view_home');
