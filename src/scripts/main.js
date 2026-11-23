import { bindTracking, track } from './track.js';

bindTracking();

// Showcase build (docs/showcase.md): only the homepage exists. Links to other pages
// show a short notice instead of navigating; in-page anchors, the TH/EN switch and
// phone/LINE/email/map links still work. After the expiry date the page is covered.
if ('showcase' in document.documentElement.dataset) import('./showcase.js').then((m) => m.initShowcase());

// Header: compacts once the page scrolls past the top.
const header = document.querySelector('[data-header]');
if (header) {
  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:0;height:80px;width:1px;pointer-events:none';
  document.body.prepend(sentinel);
  // Past the top the header stays on screen but tightens: shorter bar, smaller
  // wordmark, hairline and a thin reading-progress line (CSS, docs/header-v2.md).
  new IntersectionObserver(([e]) => {
    header.classList.toggle('is-solid', !e.isIntersecting);
    document.documentElement.classList.toggle('header-compact', !e.isIntersecting);
  }).observe(sentinel);

  // Homes panel (desktop): click or hover on "แบบบ้าน"; Escape, outside click or
  // leaving the panel closes it. Without JS the link goes to /homes/.
  const megaToggle = header.querySelector('[data-mega-toggle]');
  const mega = header.querySelector('[data-mega]');
  // The scrim lives outside the header: its backdrop-filter would trap a fixed child.
  const scrim = header.querySelector('[data-mega-scrim]');
  if (scrim) document.body.append(scrim);
  const desktop = matchMedia('(min-width: 64em)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  let megaOpen = false;
  let hoverTimer;
  const setMega = (open, { focus = false } = {}) => {
    if (!mega || open === megaOpen) return;
    megaOpen = open;
    mega.hidden = !open;
    scrim.hidden = !open;
    header.classList.toggle('has-mega', open);
    megaToggle.setAttribute('aria-expanded', String(open));
    if (open && focus) mega.querySelector('a')?.focus();
  };
  if (megaToggle && mega) {
    megaToggle.setAttribute('role', 'button');
    megaToggle.setAttribute('aria-expanded', 'false');
    megaToggle.addEventListener('click', (e) => {
      if (!desktop.matches) return; // the panel is desktop only; small screens follow the link
      e.preventDefault();
      clearTimeout(hoverTimer);
      setMega(!megaOpen);
    });
    megaToggle.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' && desktop.matches) { e.preventDefault(); setMega(true, { focus: true }); }
    });
    const hoverZone = [megaToggle.parentElement, mega];
    hoverZone.forEach((el) => {
      el.addEventListener('pointerenter', (e) => {
        if (e.pointerType !== 'mouse' || !finePointer.matches || !desktop.matches) return;
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => setMega(true), 120);
      });
      el.addEventListener('pointerleave', (e) => {
        if (e.pointerType !== 'mouse') return;
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => setMega(false), 220);
      });
    });
    scrim.addEventListener('click', () => setMega(false));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && megaOpen) { setMega(false); megaToggle.focus(); }
    });
    header.addEventListener('focusout', (e) => {
      if (megaOpen && !header.contains(e.relatedTarget)) setMega(false);
    });
    desktop.addEventListener('change', () => setMega(false));
  }

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
  menu.addEventListener('close', () => { menu.classList.remove('is-closing'); toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); });
  // Play the closing animation first (CSS .is-closing), then close the dialog.
  const closeMenu = () => {
    if (!menu.open || menu.classList.contains('is-closing')) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { menu.close(); return; }
    menu.classList.add('is-closing');
    const done = () => { clearTimeout(fallback); menu.removeEventListener('animationend', onEnd); menu.close(); };
    const onEnd = (e) => { if (e.target === menu) done(); };
    const fallback = setTimeout(done, 400);
    menu.addEventListener('animationend', onEnd);
  };
  menu.addEventListener('cancel', (e) => { e.preventDefault(); closeMenu(); }); // Escape
  menu.querySelector('[data-menu-close]').addEventListener('click', closeMenu);
  menu.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    // In-page links close with the animation; links to other pages just navigate.
    if (a.getAttribute('href')?.startsWith('#') || e.defaultPrevented) closeMenu();
    else menu.close();
  });
}

// Brand Vision: each phrase darkens once it rises above 70% of the viewport height, so
// the statement fills in line by line as you read. Off with reduced motion.
const vision = document.querySelector('[data-vision]');
if (vision && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const words = [...vision.querySelectorAll('.vision__word')];
  vision.classList.add('is-armed');
  let ticking = false;
  const update = () => {
    ticking = false;
    const line = innerHeight * 0.7;
    words.forEach((w) => w.classList.toggle('is-lit', w.getBoundingClientRect().top < line));
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { addEventListener('scroll', onScroll, { passive: true }); update(); }
    else { removeEventListener('scroll', onScroll); update(); }
  }).observe(vision);
}

// Gentle parallax on marked photos: the image drifts up to 10% inside its frame.
// Elements with data-roof also get --roof (flat -> gable) for the Brand Vision photo.
const parallax = [...document.querySelectorAll('[data-parallax]')];
if (parallax.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let queued = false;
  const run = () => {
    queued = false;
    parallax.forEach((el) => {
      const r = el.getBoundingClientRect();
      // Gable frames: the roof rises over the first 65% of the viewport after entering.
      if (el.hasAttribute('data-roof')) el.style.setProperty('--roof', Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight * 0.65))).toFixed(3));
      if (r.bottom < 0 || r.top > innerHeight) return;
      const p = (innerHeight - r.top) / (innerHeight + r.height);
      el.style.setProperty('--parallax', Math.min(1, Math.max(0, p)).toFixed(3));
    });
  };
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(run); } }, { passive: true });
  run();
}

// Horizontal rails (homepage "Discover our homes").
document.querySelectorAll('[data-rail]').forEach((el) => import('./rail.js').then((m) => m.initRail(el)));

// Materials explorer (homepage).
const materialsRoot = document.querySelector('[data-materials]');
if (materialsRoot) import('./materials.js').then((m) => m.initMaterials(materialsRoot));

// Our Homes listing: filters, sorting, photo/plan toggle (loaded only where present).
const homesRoot = document.querySelector('[data-homes]');
if (homesRoot) import('./homes.js').then((m) => m.initHomes(homesRoot));

// Home Finder (loaded only where present).
const finderRoot = document.querySelector('[data-finder]');
if (finderRoot) import('./finder-ui.js').then((m) => m.initFinder(finderRoot));

// Motion (GSAP) is code-split and never loaded for reduced-motion users.
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) import('./motion.js').then((m) => m.initMotion());

if (document.body.classList.contains('page-home')) track('view_home');
