// Tiny build-time templating: tagged template that escapes interpolations
// unless they are wrapped with raw() or are the result of another html``.

const SAFE = Symbol('safe');
const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const escape = (s) => String(s).replace(/[&<>"']/g, (c) => ESC[c]);
export const raw = (s) => ({ [SAFE]: true, value: String(s ?? '') });

const render = (v) => {
  if (v == null || v === false) return '';
  if (Array.isArray(v)) return v.map(render).join('');
  if (typeof v === 'object' && v[SAFE]) return v.value;
  return escape(v);
};

export function html(strings, ...values) {
  let out = strings[0];
  values.forEach((v, i) => { out += render(v) + strings[i + 1]; });
  return raw(out);
}

export const toString = (v) => render(v);

// Attribute helper: attrs({ href: '/x', hidden: true, 'aria-current': null })
export const attrs = (o) => raw(Object.entries(o)
  .filter(([, v]) => v != null && v !== false)
  .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${escape(v)}"`)).join(''));
