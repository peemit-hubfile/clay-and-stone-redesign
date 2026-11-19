# Technical Feasibility Report

**Stage 1 · Discovery** · 20 Nov 2026

## 1. Starting point

| Item | Finding |
|---|---|
| Repository | `github.com/peemit-hubfile/clay-and-stone-redesign`: **empty**, **public**. Cloned to `D:\Clay & Stone Website`. |
| Local tooling | Node 24.13, npm 11.6, Git 2.54, Python 3.12, GitHub CLI 2.96, Chrome (for Playwright via `playwright-core`) |
| Production | Webflow (Lumos framework, GSAP 3.15, Swiper 11, jQuery). **Not touched.** |

## 2. Recommended prototype stack (as in the brief; no framework needed)

| Concern | Choice | Reason |
|---|---|---|
| Build | **Vite** (multi-page) | Fast, static output, trivial Vercel deploy |
| Markup | Semantic HTML5 pages, one per route × language, generated at build | Mirrors Webflow pages 1:1, which helps handoff |
| Styling | Plain CSS with custom-property tokens + cascade layers | Maps directly to Webflow variables and classes; no runtime |
| JS | Vanilla ES modules, progressive enhancement | Every component works without JS where possible |
| Motion | **GSAP + ScrollTrigger** (already used on the live site) | Same library in Webflow, so interactions transfer |
| Icons | Lucide (tree-shaken SVG) | Lightweight, consistent |
| Content | JSON in `/src/data` as the CMS stand-in | Shaped like Webflow CMS collections (Series, Models, Projects, FAQ, Articles) |
| i18n | Build-time templates per language from `{ th, en }` fields; UI strings in `/src/data/i18n/*.json` | No hard-coded strings; real `/th/` and `/en/` URLs with hreflang |
| Templating | Small build-time renderer (e.g. Vite plugin + tagged template functions, or `vite-plugin-handlebars`) | Static HTML output for SEO; no SPA |
| Testing | Playwright (`@playwright/test`), axe-core, Lighthouse CI | Required by the QA phase |

**Not recommended:** React/Next.js. It adds no value for a content site that must later be rebuilt in Webflow.

## 3. Feasibility of key features

| Feature | Feasible? | Notes / risks |
|---|---|---|
| Bilingual TH/EN with hreflang | ✓ | Data already paired `{th, en}`; some EN copy is missing (Alive, team), so those places will show labelled placeholders |
| Model catalogue, model pages, compare | ✓ | Fully driven by `products.json` |
| Smart Home Finder (rules-based) | ✓ | ~200 lines of JS; rules in a JSON config; explainable output. **Price bands** used until prices are confirmed. |
| AI Home Consultant | ◐ **Not in prototype** | Would need a backend, a model API key, grounding on `products.json` + FAQ, and privacy review. The prototype will at most show a clearly-labelled *concept* with no simulated "AI" answers. |
| Consultation form | ✓ demo mode | Client-side validation; on submit shows a "demo, not sent" state. **No CRM / email connection** without approval. LINE / tel / mailto links are real. |
| Video hero | ✓ | Poster-first; lazy video; disabled on reduced-motion / Save-Data. Needs a re-encoded ≤2–3 MB loop from source footage. |
| Typography | ◐ | Live font **Aktiv Grotesk Thai** is an Adobe Fonts kit tied to the clayandstone.co.th domain, so it **won't load on a Vercel preview** unless the client adds the preview domain to the kit. Fallback: **IBM Plex Sans Thai** / **Noto Sans Thai** + **Manrope** (open licence, self-hosted). Decision needed. |
| Responsive images (AVIF/WebP) | ✓ | Build-time generation with `sharp` from local originals; never upscaled |
| Structured data | ✓ | JSON-LD generated from data; validated before claiming |
| Analytics events | ✓ (stub) | `track()` wrapper logs to the console. GTM can be connected later with consent. |

## 4. Webflow production compatibility

The prototype is designed so it can be rebuilt in Webflow without re-architecting:

| Prototype | Webflow equivalent |
|---|---|
| CSS custom properties (color / type / space tokens) | Webflow **Variables** (Lumos already uses them, e.g. `--swatch--brand-500`) |
| BEM-ish component classes | Webflow **Components** + class names (keep names short and Lumos-compatible) |
| `products.json` series/models | CMS collections **Series** → **Models** (reference field), **Projects**, **FAQ**, **Articles**, **Testimonials** |
| `{th, en}` fields | Webflow **Localization** locales (`th` primary, `en` secondary) |
| GSAP + ScrollTrigger modules | Webflow **GSAP interactions** or custom code embed (same API) |
| Compare + Home Finder | Custom code embed reading CMS data rendered into a hidden JSON `<script>` via a Collection List (documented pattern) |
| JSON-LD | Page/CMS-template custom code with CMS field bindings |

Custom code that must be recreated in Webflow will be listed in a `docs/webflow-handoff.md` (Stage 6).

## 5. Hosting and preview

- **Vercel** project linked to the GitHub repo, with preview deployments per branch (`feature/clay-stone-redesign-prototype`). The preview domain stays separate from `clayandstone.co.th`.
- The preview must send `X-Robots-Tag: noindex` (via `vercel.json`) and use `<meta name="robots" content="noindex">` so it never competes with production in search.
- **Environment variables:** none are required for the static prototype. If a future AI assistant is added: `ANTHROPIC_API_KEY` (server-side only), never exposed to the client and never committed.
- **Media and a public repo:** client media is currently git-ignored (rights unverified). For the Vercel preview to show real photos, choose one:
  - (a) make the repo **private** and commit optimised derivatives (recommended), or
  - (b) host approved media in a private store and fetch it at build time.

## 6. Performance budget (targets, to be measured, not claimed)

| Budget | Target |
|---|---|
| Home, first load (mobile) | ≤ 1.5 MB transferred before user interaction (video deferred) |
| JS (compressed) | ≤ 90 KB incl. GSAP core + ScrollTrigger |
| CSS (compressed) | ≤ 40 KB |
| Fonts | ≤ 2 families, subset, `font-display: swap`, preload 1–2 files |
| LCP image | Eager + `fetchpriority="high"`, AVIF ≤ 200 KB at mobile size |
| Core Web Vitals goals | LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1, measured with Lighthouse (lab) on throttled mobile |

## 7. Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Price conflict unresolved | High | Use price bands; data flag; client checklist |
| Low-res imagery limits the "premium" look | High | Layouts sized to source resolution; request originals |
| Font licensing on preview | Medium | Open-licence fallback pair ready |
| Asset rights / public repo | Medium | Media git-ignored; repo-visibility decision |
| Missing EN copy | Medium | Labelled placeholders; no machine translation published |
| Scope creep into AI features | Medium | Rules-based finder only; AI concept clearly labelled |

## 8. Proposed project structure (to create in Stage 5)

```
/public/images, /fonts, /icons, /videos
/src/components   (header, footer, model-card, project-card, cta, faq, compare, finder…)
/src/pages        (route templates)
/src/styles       (tokens.css, base.css, layout.css, components/*.css)
/src/scripts      (motion.js, finder.js, compare.js, i18n.js, track.js)
/src/data         (products, projects, faq, navigation, site-content, i18n/)
/src/utils
/docs
/tests            (Playwright)
/tools/discovery  (crawl / extraction scripts used in Stage 1)
```
