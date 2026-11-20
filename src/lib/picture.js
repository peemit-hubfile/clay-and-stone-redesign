// <picture> with AVIF + WebP srcsets from the generated image manifest.
// Falls back to the original file when no derivatives exist yet.

import { html, attrs, raw } from './html.js';

const srcset = (m, fmt) => m.widths.map((w) => `${m.base}-${w}.${fmt} ${w}w`).join(', ');

export function makePicture(manifest) {
  const sources = (m, sizes, media) => html`<source${attrs({ media, type: 'image/avif', srcset: srcset(m, 'avif'), sizes })}><source${attrs({ media, type: 'image/webp', srcset: srcset(m, 'webp'), sizes })}>`;

  return function picture(src, {
    alt = '', sizes = '100vw', className = null, priority = false,
    art = [], // art direction: [{ media: '(max-width: 47.99em)', src }]
  } = {}) {
    const m = manifest[src];
    const imgAttrs = {
      alt,
      loading: priority ? null : 'lazy',
      decoding: priority ? null : 'async',
      fetchpriority: priority ? 'high' : null,
    };
    if (!m) return html`<img${attrs({ src, class: className, ...imgAttrs })}>`;
    const fallbackW = m.widths.find((w) => w >= 1080) ?? m.widths.at(-1);
    const artHtml = art.map((a) => (manifest[a.src] ? sources(manifest[a.src], sizes, a.media) : raw('')));
    return html`<picture${attrs({ class: className })}>${artHtml}${sources(m, sizes, null)}<img${attrs({
      src: `${m.base}-${fallbackW}.webp`, width: m.width, height: m.height, ...imgAttrs,
    })}></picture>`;
  };
}
