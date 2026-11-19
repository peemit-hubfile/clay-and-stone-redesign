# Existing Website Audit: clayandstone.co.th

**Stage 1 · Discovery** · Audited 20 Nov 2026 · Scope: every public URL in `sitemap.xml` (32 URLs = 16 pages × TH/EN), plus internal-link discovery (no extra pages found)

> **Method.** I fetched every page over HTTP and parsed the HTML for text, metadata, images and links. I then loaded 11 key pages in headless Chrome (Playwright) at desktop 1440×900 and mobile 390×844, capturing screenshots, console errors, network requests, LCP and CLS. Evidence is in [`audit-evidence/`](audit-evidence/). Performance numbers are **single lab runs on a fast, unthrottled connection**. They are not Core Web Vitals field data and should not be quoted as such. I have not run Lighthouse or PageSpeed Insights yet (planned for Stage 6, as a before/after baseline).
>
> Nothing on the production Webflow site was modified. No authentication was attempted.

---

## 1. Summary

Clay & Stone sells a small, well-defined catalogue: **2 live series, 5 models** priced from ~0.83 M to 2.69 M THB, plus 1 "coming soon" series. Its strengths are good: real project photography, clear material specs, credible founders, transparent pricing, and a fast 15-day install story. The site **contains the right raw material**, but it is presented as a long, uniform template and does not guide a buyer toward a decision.

**Top 10 findings (by impact)**

| # | Finding | Impact |
|---|---|---|
| 1 | **The hero has no headline, value proposition or CTA.** It shows a logo over a video. The first readable message ("Brand Vision") starts below the fold. | Users can't tell within 5 seconds what is sold, for how much or for whom |
| 2 | **Two conflicting price sets** on the same product pages (see content-verification §1) | Undermines the "transparent pricing" promise; trust risk |
| 3 | **Alive Series page is a broken copy of Unwind**: Thai text on the EN page, Unwind FAQ, two H1s | The newest product looks unfinished |
| 4 | **Primary CTA leaves the site** for Linktree. There is no on-site enquiry, booking or showroom-visit flow. | Lost conversions and lost analytics attribution |
| 5 | **No way to compare models.** Specs are spread across price cards, tabs and FAQs. There is no "which home is right for me?" help. | High cognitive load for the core decision |
| 6 | **SEO foundations missing**: no canonical tags, **zero structured data**, 5 of 16 page types (10 URLs) lack an H1, 2 page types have 2 H1s, ~95% of images have empty alt text | Weak eligibility for rich results and AI answers |
| 7 | **Homepage weighs ~16.9 MB** (lab), mostly a 13.4 MB background video served from an unrelated **Netlify** subdomain | Mobile data cost and slow LCP on real networks |
| 8 | **Production loads scripts from third-party sandboxes** (`j44tmv.csb.app`, a CodeSandbox URL) and a Netlify app | Security, availability and governance risk |
| 9 | **A JavaScript error fires on every mobile page load** (`TypeError: Cannot read properties of null (reading '1')`) | Possible broken mobile interactions; needs root-cause |
| 10 | **Image resolution is too low for a premium redesign.** Homepage images are 640 px wide, team photos 617 px, and only 37 of 177 images are ≥1600 px. | Full-bleed editorial layouts need higher-res originals from the client |

---

## 2. Technology stack (as observed)

| Layer | Observed |
|---|---|
| Platform | Webflow (generator meta), Webflow Localization (`/th`, `/en` subdirectories) |
| CSS framework | **Lumos v2.2.1** (Webflow community framework): fluid `clamp()` type scale, swatch tokens |
| Fonts | **Adobe Fonts kit `ght4vkk`**, family `aktiv-grotesk-thai` (weights 300/400/500). Licensed per domain, so it won't load on a preview domain without adding that domain to the kit. |
| JS libraries | jQuery 3.5.1 (Webflow), **GSAP 3.15.0** (Webflow-hosted), **Swiper 11** (jsDelivr) |
| Custom code | `https://j44tmv.csb.app/script.js` (**CodeSandbox-hosted**; returned 0 bytes when fetched directly) and `https://stupendous-trifle-c7ed75.netlify.app/home-bg-video.mp4` |
| Analytics / tags | Google Tag Manager `GTM-MZ7NPLT7`, Google Analytics; DoubleClick requests observed (YouTube embeds) |
| Embeds | Google Maps (contact), YouTube via Embedly (Good to Know: 7 videos) |
| Search | Webflow site search at `/search` (in sitemap; no visible entry point in the header) |
| Root URL | `/` returns **302 → `/th`** (temporary redirect) |
| 404 | Unknown paths return 404 ✓ |
| Trailing slash | `/th/blogs/` returns 301 → `/th/blogs` ✓ |

**Colour tokens in use:** `#484848` (brand-500), `#1f1d1e` (dark-900), `#2f2b2d` (dark-800), `#ededed` (light-200), plus near-white backgrounds. The live palette is **neutral grey/black**. The warm wood and natural tones live only in the photography.

## 3. Page inventory and status

| Page | TH | EN | H1 | Notes |
|---|---|---|---|---|
| Home | `/th` | `/en` | ✓ (Brand Vision sentence) | Video hero without a message; 5 FAQs; contact block |
| About Us | `/th/about-us` | `/en/about-us` | ✗ | Team in Thai on the EN page; 6 testimonials |
| Unwind Series | `/th/products/unwind-series` | `/en/…` | **2 H1s** | Richest page: values, plans, functions, 4 price cards, 6 materials, 5 FAQs |
| Alive Series | `/th/products/alive-series` | `/en/…` | **2 H1s** | Copied template errors (see verification §3) |
| Upcoming (Humble) | `/th/products/upcoming-product` | `/en/…` | ✗ | Only "Humble is Coming Soon". Orphan page (not in nav). |
| Projects | `/th/projects` | `/en/projects` | ✓ (EN text on TH page) | Galleries by model; 7 FAQs |
| Process | `/th/process` | `/en/process` | ✗ | 4 steps with images |
| Good to Know | `/th/good-to-know` | `/en/…` | ✗ | 7 YouTube videos (EP.1–7); 186 network requests |
| Blogs index | `/th/blogs` | `/en/blogs` | ✓ | 5 articles |
| Blog articles ×5 | `/th/blogs/*` | `/en/blogs/*` | ✓ | Author byline; good educational depth |
| Contact Us | `/th/contact-us` | `/en/contact-us` | ✗ | Details + map; **CLS 0.458** on desktop (lab, map iframe) |
| Search | `/th/search` | `/en/search` | ✓ | Indexable and listed in sitemap, which it shouldn't be |

## 4. UX and content observations

**Homepage flow:** video (no text) → Brand Vision → 3 Key Strengths (shown twice, as icon cards and as an image carousel) → 3 Highlighted Projects (image only, no price or specs) → FAQ → contact. The homepage never shows **a single price, model spec or the range of models**.

**Product pages** are long (8,300 px desktop, 9,500 px mobile) and follow a fixed template. Pricing appears about 60% down the page. Floor plans exist but are embedded in price-card images, so they are not readable on mobile and not accessible.

**Carousels:** "Flexible Function", "Module Combination" and testimonials use Swiper with small arrow controls. Content inside them is hidden by default, and the lazy-loaded slides render blank in full-page captures.

**Navigation:** 8 top-level items, with "Products" as a dropdown of 2. "Good to Know", "Blogs" and the FAQs on 4 pages split the educational content into three places. The header CTA label differs by language: TH "สอบถามข้อมูล" (Enquire) vs EN "Book Consultation". Both go to Linktree.

**Trust assets present but under-used:** founders' credentials (Chulalongkorn, Edinburgh, Thammasat, Silpakorn; 15+ years each), named suppliers (SCG, BEGER, CONWOOD/SHERA, TIS-certified steel), 1/5-year warranty, physical showroom, 7 explainer videos, named customer testimonials with locations.

**Contact:** the email is a Gmail address. There are no opening hours, no on-site form, and no booking flow for a showroom visit, which is "by appointment" according to an FAQ.

## 5. Accessibility snapshot (automated checks only)

| Check | Result |
|---|---|
| `lang` attribute | ✓ `th-TH` / `en-US` |
| Skip link | ✓ "Skip to main content" present |
| `<main>` landmark | ✓ on most pages; ✗ on blog articles |
| Image alt text | ✗ ~95% of content images have `alt=""`, including product photos, floor plans and team portraits |
| Unnamed links/buttons | 5–9 per page (icon-only social links, carousel arrows); 29 on mobile Projects |
| Small tap targets (<24 px) | Up to 53 on mobile Projects (gallery thumbnails/dots) |
| Heading order | Skipped levels are common (H2 → H5, decorative H4/H6 used for labels) |
| Floor plans | Information is only inside images, with no text alternative |
| Contrast and keyboard | **Not yet tested.** A manual audit is planned for Stage 6. |

## 6. Performance snapshot (lab, unthrottled, single run)

| Page | Device | Requests | Transfer | LCP | CLS |
|---|---|---:|---:|---:|---:|
| Home `/th` | Desktop | 57 | ~16.9 MB | 0.57 s | 0 |
| Home `/th` | Mobile | 55 | ~16.9 MB | n/a* | 0 |
| Unwind | Desktop | 62 | ~6.7 MB | 0.56 s | 0 |
| Process | Desktop | 61 | ~16.8 MB | 0.48 s | 0 |
| Good to Know | Desktop | 186 | ~9.2 MB | 0.91 s | 0 |
| Contact | Desktop | 73 | ~1.7 MB | 0.44 s | **0.458** |
| Blog (price) | Desktop | 57 | ~7.9 MB | 0.84 s | **0.104** |

\*LCP was not reported on the mobile home and process runs, likely because the video is the dominant element.

Key issues:
- The ~13.4 MB background video loads on the homepage **and the process page**.
- **Every image is `loading="lazy"`, including above-the-fold images**, which delays LCP on real networks.
- 4 blog PNGs are 3,300–4,400 px wide and ~2 MB each.
- 7 full YouTube iframes on Good to Know (186 requests). Lite embeds would cut this sharply.

These numbers only describe *this* machine and network. Real-user mobile LCP will be considerably worse.

## 7. Security and governance

- 🔴 Production executes a script from **`j44tmv.csb.app`** (CodeSandbox preview host). If that sandbox changes or is deleted, the live site's behaviour changes. Move it into Webflow custom code or a controlled CDN.
- 🟠 Hero video is hosted on an anonymous **Netlify** subdomain (`stupendous-trifle-c7ed75`).
- 🟠 The business email is a personal-style Gmail address.
- ✓ HTTPS everywhere; no mixed content observed.

## 8. Recommendations carried into Stage 2+

1. Lead with a **message-first hero**: what, for whom, from-price, and two CTAs over real photography.
2. Make **models the primary navigation object**: series → model cards with price, area, beds/baths and plan.
3. Build a **Compare** view and a transparent, rules-based **Home Finder** on top of `products.json`.
4. Replace Linktree with an **on-site consultation flow** (LINE / call / showroom visit / form in demo mode).
5. Consolidate FAQs, videos and articles into one **Knowledge Center**.
6. Fix SEO basics: canonicals, hreflang (keep), JSON-LD, one H1 per page, alt text, remove `/search` from the sitemap, and make `/` a 301.
7. Set a **performance budget**: homepage < 2 MB on first load, poster-first video, responsive AVIF/WebP, eager LCP image.
8. Get **high-resolution originals** and asset rights from the client.

See also: [content-verification.md](content-verification.md) · [seo-audit.md](seo-audit.md) · [ux-opportunity.md](ux-opportunity.md) · [technical-feasibility.md](technical-feasibility.md)
