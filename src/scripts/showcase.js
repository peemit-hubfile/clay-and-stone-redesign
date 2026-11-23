// Showcase build behaviour (docs/showcase.md). Loaded only when <html data-showcase>.
const TEXT = {
  th: {
    locked: 'หน้านี้จะเปิดใช้ในเวอร์ชันเต็ม ตัวอย่างนี้แสดงเฉพาะหน้าแรก',
    expiredTitle: 'ลิงก์ตัวอย่างนี้หมดอายุแล้ว',
    expiredText: 'โปรดติดต่อผู้ออกแบบเพื่อขอลิงก์ใหม่',
  },
  en: {
    locked: 'This page comes with the full version. This preview shows the homepage only.',
    expiredTitle: 'This preview link has expired',
    expiredText: 'Please contact the designer for a new link.',
  },
};

export function initShowcase() {
  const root = document.documentElement;
  const t = TEXT[root.lang] ?? TEXT.th;

  // Expiry: end of the given day, local time.
  const exp = root.dataset.expires;
  if (exp && Date.now() > new Date(`${exp}T23:59:59`).getTime()) {
    const cover = document.createElement('div');
    cover.className = 'showcase-expired';
    cover.setAttribute('role', 'alertdialog');
    cover.setAttribute('aria-modal', 'true');
    cover.setAttribute('aria-labelledby', 'showcase-expired-title');
    cover.innerHTML = `<div><p class="showcase-expired__mark">CLAY <span>&amp; stone</span></p><h1 id="showcase-expired-title">${t.expiredTitle}</h1><p>${t.expiredText}</p></div>`;
    document.body.replaceChildren(cover);
    return;
  }

  // A polite live region for the notice, so screen readers hear it too.
  const toast = document.createElement('div');
  toast.className = 'showcase-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  document.body.append(toast);
  let timer;
  const notify = () => {
    toast.textContent = t.locked;
    toast.classList.add('is-on');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('is-on'), 3200);
  };

  const allowed = (a) => {
    const href = a.getAttribute('href') || '';
    if (!href || href.startsWith('#')) return true;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return true; // LINE, maps, social: real contact routes
    return /^\/(th|en)\/?$/.test(url.pathname) || (url.pathname === location.pathname && url.hash);
  };
  // Contact links go to the contact block at the foot of this page instead.
  const contact = document.getElementById('contact');
  if (contact) document.querySelectorAll('a[href]').forEach((a) => {
    if (/^\/(th|en)\/contact\/?$/.test(new URL(a.href, location.href).pathname)) a.setAttribute('href', '#contact');
  });
  // Mark locked links once, so they can be styled and announced.
  // The "แบบบ้าน" toggle opens the models panel on desktop, so it stays clickable.
  document.querySelectorAll('a[href]:not([data-mega-toggle])').forEach((a) => {
    if (!allowed(a)) { a.dataset.locked = ''; a.setAttribute('aria-disabled', 'true'); }
  });
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-locked], a[data-mega-toggle]');
    if (!a) return;
    // Desktop: the toggle is handled by the panel script. Small screens: it would navigate.
    if (a.matches('[data-mega-toggle]') && matchMedia('(min-width: 64em)').matches) return;
    e.preventDefault();
    notify();
  }, true);
}
