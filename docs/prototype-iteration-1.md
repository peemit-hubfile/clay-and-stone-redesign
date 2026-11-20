# Prototype: Iteration 1 (Design system + Homepage)

**Date:** 20 Nov 2026 · **Status:** ready for review. Design direction sign-off is needed before the inner pages are designed.

## What was built

| Area | Delivered |
|---|---|
| Stack | Vite 6 multi-page, static HTML rendered at build time from seed data (`tools/build/render.mjs`), vanilla JS modules, GSAP + ScrollTrigger (code-split), no framework |
| Design system | Tokens, base, components and homepage styles; documented in [design-system.md](design-system.md) |
| Fonts | IBM Plex Sans Thai + Manrope, self-hosted from stable `/fonts/` URLs, critical face preloaded per language |
| Images | 102 source images → AVIF + WebP at 480–2400px (never upscaled), `<picture>` with art direction for the hero |
| Homepage (TH + EN) | Hero · brand intro · 3 strengths · homes by series (5 model cards with series filter) · inline Smart Home Finder · 6 material systems · real-project mosaic + testimonial · 4-step process with durations · 7 FAQs · contact options |
| Other routes | 15 routes × 2 languages as honest placeholder pages. Model pages already show the floor plan, specs and price. |
| SEO | Unique title/description, canonical, hreflang th/en/x-default, OG, `HomeAndConstructionBusiness` JSON-LD, one H1 per page, `noindex` (prototype) |
| Analytics | `track()` stub pushes to `dataLayer` and logs to console in dev; no tracking scripts installed |

## Design decisions worth reviewing

1. **Hero message:** the client's own tagline "บ้านสำเร็จรูป…ที่ไม่เหมือนบ้านสำเร็จรูป" as H1, with verified facts beneath it (about 15 days on site, 5-year structural warranty, free installation within 200 km) and a from-price that carries a "ราคารอยืนยัน" badge.
2. **Homes grouped by series:** Unwind's four homes, then Alive, each with its tagline and values. This avoids a 4+1 orphan grid and makes "series" understandable.
3. **Visualisations are labelled:** the Unwind 2B2B and Alive covers show a "ภาพจำลอง / Visualisation" badge, and the Projects mosaic uses **only** real photographs.
4. **Locations are listed, not pinned to photos:** the site never ties gallery photos to provinces, so we show "ติดตั้งแล้วที่ นนทบุรี · สระบุรี · …" separately.
5. **Contact stays on-site:** LINE first (primary in Thailand), then phone, email and showroom. Linktree is no longer the main CTA.
6. **Palette** warmed from the live site's neutral greys toward stone/plaster/timber, with all text pairs ≥ 4.5:1.

## QA results (executed)

Commands: `npm run build`, `node tests/qa-smoke.mjs http://localhost:4173`, `node tests/perf-lab.mjs http://localhost:4173`, `npm run seed:validate`.

| Check | Result |
|---|---|
| Production build | ✓ builds; original media pruned from `dist/` |
| 32 pages × desktop (1440) + mobile (390) | ✓ 0 failures: HTTP 200, no console/page errors, exactly one H1, no horizontal overflow, every `<img>` has alt, no broken images, all internal links resolve, hreflang + canonical present, JSON-LD parses |
| Home Finder flow (TH/EN × desktop/mobile) | ✓ correct top match with reasons; form hides on results; restart works |
| Keyboard | ✓ skip link is the first Tab stop; mobile menu is a modal `<dialog>`, Esc closes it, focus returns to the toggle |
| Seed validation | ✓ valid; 9,600 Finder answer combinations tested |

**Lab performance** (emulated network + CPU, 3 runs, median; *not* field Core Web Vitals):

| Case | Transfer | Requests | LCP (median) | CLS |
|---|---:|---:|---:|---:|
| Mobile "4G" (1.6 Mbps, 150 ms, 4× CPU), TH | 386 KB | 17 | **2.68 s** ⚠ | 0 |
| Mobile "4G", EN | 278 KB | 10 | 2.12 s | 0 |
| Desktop, TH | 379 KB | 17 | 0.47 s | 0 |
| Desktop, EN | 271 KB | 10 | 0.43 s | 0 |

For comparison, the live homepage transferred ~16.9 MB in the Stage 1 audit (unthrottled).

Fixes made during QA:
- Mobile hero was showing a bathroom photo; replaced with a real exterior.
- CLS 0.217 from the Thai font swap, fixed with self-hosted fonts and preload.
- The `[hidden]` attribute was being overridden by component CSS.
- The list-reset selector was removing container margins.
- Low-contrast labels in the Finder results.

## Known limitations / next steps

- ⚠ **Mobile TH LCP 2.68 s** is just above the 2.5 s goal under harsh emulation. Next levers: inline critical CSS, drop the Thai 600 weight (8 → 6 font files), and test real-device field data after deployment.
- Inner pages (Our Homes, model detail, Compare, Projects, How We Build, Good to Know, About, Contact form) are placeholders.
- Not yet run: Lighthouse, axe-core automated accessibility audit, screen-reader pass, real-device testing, structured-data validation in Google's Rich Results Test.
- The wordmark is a typographic placeholder until the client supplies the SVG logo.
- All "pending" items from the content-verification checklist still apply (prices, Alive copy, renders vs photos, testimonial consent, asset rights).
- Vercel preview not set up yet; it is blocked on the media-rights / repo-visibility decision.

## Running locally

```
npm install
npm run dev            # http://localhost:5173 (renders pages, watches src/)
npm run build          # fonts → images → vite build → prune originals
npm run preview        # serve dist on :4173
node tests/qa-smoke.mjs http://localhost:4173
```

The client media in `public/images/source` is git-ignored. On a fresh clone, run `python tools/discovery/assets.py` (see README) before building.
