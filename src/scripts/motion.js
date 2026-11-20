// GSAP motion: hero reveal + gentle section reveals.
// Initial (hidden) states are set by JS only, so content is always visible
// if scripts fail, and nothing animates for prefers-reduced-motion users.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initMotion() {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (media.matches) return;
  gsap.registerPlugin(ScrollTrigger);

  // The hero reveal is a CSS animation (runs on first paint, no flash). GSAP handles scroll reveals.
  const items = gsap.utils.toArray('[data-reveal]').filter((el) => el.getBoundingClientRect().top > window.innerHeight);
  gsap.set(items, { y: 28, autoAlpha: 0 });
  ScrollTrigger.batch(items, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) => gsap.to(batch, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out', stagger: 0.08, overwrite: true }),
  });
  // Anything already above the fold on load (e.g. after an anchor jump) is shown immediately.
  ScrollTrigger.refresh();

  media.addEventListener('change', (e) => {
    if (e.matches) { ScrollTrigger.getAll().forEach((t) => t.kill()); gsap.set(items, { clearProps: 'all' }); }
  });
}
