# Asset Inventory

**Stage 1 · Discovery** · 20 Nov 2026 · Machine-readable manifest: [`asset-manifest.json`](asset-manifest.json)

Every image, video and embed found on the 32 live URLs was inventoried. Downloadable originals were saved to the local project. Each manifest record holds: `id`, `original_url`, `local_path` (relative to `/public`), `category`, `pages[]` (where it appears), `alt_text_original`, `context` (nearby heading/label, used as a provisional description), `width`, `height`, `bytes`, `format` and `rights_status`.

> ⚠️ **Asset rights are unverified.** Publicly accessible images are not automatically licensed for redistribution. The GitHub repository is **public**, so all downloaded media (`/public/images/source/`, `/public/videos/source/`) is **git-ignored** and stays on the local machine only. It is used for internal prototyping until Clay & Stone confirms usage rights. See "Decisions needed" below.

## 1. Totals

| Type | Count | Downloaded | Size |
|---|---:|---:|---:|
| Images | 177 | 176 (1 failed: Webflow placeholder SVG, 403) | ~63 MB |
| Hero videos | 3 (2 Webflow MP4/WebM + 1 Netlify MP4) | 3 | ~19 MB |
| YouTube embeds | 7 | n/a (referenced by ID) | — |
| Google Maps embed | 1 | n/a | — |

## 2. By category

| Category | Count | Size | ≥1600 px long edge | Alt text present | Notes |
|---|---:|---:|---:|---:|---|
| `projects`: completed-home photography and floor plans | 64 | 30.3 MB | 11 | 0 | **Best photography.** Mostly 1122–1846 px. 1:1 and 3:2 crops. |
| `unwind`: function, module and material photos/renders | 26 | 6.0 MB | 0 | 0 | 615–1104 px; includes 6 material close-ups and plan diagrams |
| `alive`: function and combination renders, size diagrams | 15 | 1.3 MB | 3 | 0 | Mostly 3D plan renders (1200 px) |
| `series-identity`: 4 "value" photos per series | 8 | 1.9 MB | 0 | 0 | 664–996 px |
| `home`: homepage cards, video poster | 7 | 0.5 MB | 0 | 0 | ⚠ **640×435 and 453×689**. Too small for large layouts |
| `process`: 4 step images | 4 | 0.1 MB | 0 | 0 | ⚠ 453 px |
| `team`: 3 portraits | 3 | 0.03 MB | 0 | 0 | ⚠ 617×420 |
| `testimonials`: customer photos | 3 | 2.8 MB | 0 | 0 | Screenshots saved as PNG (~900 KB each) |
| `blog`: article covers and inline graphics | 28 | 19.0 MB | 22 | 2 | Oversized PNGs up to 4411 px / 2 MB; some have text baked into the image |
| `icons`: key-strength icons | 7 | 0.02 MB | 0 | 0 | Raster WebP icons (96–120 px), not SVG |
| `misc`: contact images, price-card plans, author, UI | 12 | 1.3 MB | 1 | 2 | Contact banner 2160×864 |

Format mix: 142 WebP, 30 PNG, 2 JPEG, 2 SVG. **Only 2 of ~170 content images have alt text**, and both are blog infographics.

## 3. Key asset groups for the redesign

| Need in redesign | Best available asset(s) | Gap |
|---|---|---|
| Home hero (full-bleed) | Hero video (1280×720 poster, 10 s); `contact-banner.webp` 2160×864; top project photos at ~1846 px | **No ≥2400 px landscape photograph.** Ask for originals. |
| Model cards (5) | Project gallery first photo per model (≥1122 px) | Alive has 7 photos only |
| Floor plans (5) | Price-card plan images (800–1200 px, dimensioned) | **Need vector/PDF plans** for crisp, accessible, zoomable plans |
| Materials (6) | `unwind-img-01…06` close-ups (~600–1100 px) | Usable at card size only |
| Process / factory | 4 process images at 453 px | **No factory or installation-day photography or video stills** at quality |
| Team | 3 portraits, 617×420 | Need high-res portraits |
| Testimonials | 3 screenshots + 2 avatars + 1 placeholder | Need consented, proper photos |
| Logo | Not extracted as a file | **Need SVG logo** (light and dark) |
| Video | 10 s hero clip; 13.4 MB Netlify clip; 7 YouTube episodes | Need source files to produce a compressed hero loop + poster |

## 4. Asset quality issues on the live site

1. **Low-resolution hero-critical images.** Homepage and process imagery is 453–640 px wide, which looks soft on retina and large screens.
2. **No responsive variants used for the largest images.** Blog PNGs (up to 2 MB) are served as PNG instead of WebP/AVIF.
3. **All images lazy-loaded**, including those above the fold.
4. **Text baked into images** (blog infographics, price-card plans): not translatable, not searchable, not accessible.
5. **Duplicates:** the same plan images appear on both product pages and the projects page (handled by de-duplicating on URL in the manifest), and the same 6 material images appear on Unwind and Alive.
6. **External hosting:** one hero video is on a third-party Netlify subdomain.

## 5. Image handling rules for the prototype

- **Never substitute** real Clay & Stone photography with stock or AI-generated houses.
- Generate AVIF + WebP at 480/768/1200/1600/2400 widths from the originals. **Never upscale** beyond the source size. If an asset is too small for a slot, the layout adapts to it rather than enlarging the image.
- Preserve original aspect ratios. Crop only via `object-position`, never destructively.
- Write new **alt text** per image in TH and EN (draft from `context`; client review). Floor plans get a full text alternative (rooms and areas from `products.json`).
- The hero uses a poster image first and loads the video only when appropriate (not on Save-Data or reduced-motion, and not on small screens by default).

## 6. Decisions needed from the client

1. ☐ Confirm that Clay & Stone owns or has licensed all photography, renders and video, and may use it in a redesign prototype on a preview URL.
2. ☐ Provide **high-resolution originals** (≥2400 px long edge) for hero, models, projects, team and process. Provide factory and installation photography if it exists.
3. ☐ Provide vector floor plans (PDF/SVG/DWG export) for the 5 models.
4. ☐ Provide SVG logo files and any brand guideline.
5. ☐ Confirm testimonial photo consent.
6. ☐ GitHub repo is **public**. Should it be made private? If it stays public, media remains git-ignored and the Vercel preview will need assets supplied another way, for example an approved private bucket or a private repo.
