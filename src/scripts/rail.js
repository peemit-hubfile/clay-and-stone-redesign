// Horizontal rail: prev/next buttons scroll one card and disable at the ends. Scrolling stays native (touch,
// trackpad, keyboard on the focused rail); without JS the rail still scrolls.
export function initRail(root) {
  const track = root.querySelector('[data-rail-track]');
  const prev = root.querySelector('[data-rail-prev]');
  const next = root.querySelector('[data-rail-next]');
  const controls = root.querySelector('[data-rail-controls]');
  if (!track) return;

  const step = () => {
    const card = track.firstElementChild;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return card ? card.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
  };

  let frame = 0;
  function update() {
    frame = 0;
    const max = track.scrollWidth - track.clientWidth;
    const x = Math.abs(track.scrollLeft);
    if (prev) prev.disabled = x <= 2;
    if (next) next.disabled = x >= max - 2;
    if (controls) controls.hidden = max <= 2;
  }
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };

  prev?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  track.addEventListener('scroll', schedule, { passive: true });
  new ResizeObserver(schedule).observe(track);
  update();
}
