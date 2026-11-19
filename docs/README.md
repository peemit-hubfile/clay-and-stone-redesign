# Clay & Stone Redesign: Stage 1 Discovery

**Status:** Stage 1 complete. ⏸ **Waiting for client / product-owner approval before Stage 2.**
**Date:** 20 Nov 2026 · **Live site:** https://www.clayandstone.co.th (read-only; nothing modified)

## Deliverables

| # | Deliverable | File |
|---|---|---|
| 1 | Website audit | [website-audit.md](website-audit.md) |
| 2 | Content inventory | [content-inventory.md](content-inventory.md) + [`/src/data/*.json`](../src/data) |
| 3 | Sitemap (current + proposed IA) | [sitemap.md](sitemap.md) |
| 4 | Asset inventory | [asset-inventory.md](asset-inventory.md) + [asset-manifest.json](asset-manifest.json) |
| 5 | SEO / AEO / GEO audit | [seo-audit.md](seo-audit.md) |
| 6 | UX opportunity report | [ux-opportunity.md](ux-opportunity.md) |
| 7 | Content verification report | [content-verification.md](content-verification.md) |
| 8 | Competitive benchmarking plan | [competitive-benchmark.md](competitive-benchmark.md) |
| 9 | Technical feasibility report | [technical-feasibility.md](technical-feasibility.md) |

Supporting evidence:
- [`source-archive/`](source-archive/): verbatim text of all 32 pages, sitemap, robots, crawl log
- [`audit-evidence/`](audit-evidence/): Playwright results; screenshots (desktop + mobile) are kept locally, git-ignored
- [`/tools/discovery`](../tools/discovery): the crawl, extraction and audit scripts, so the work can be re-run

## What we found, in brief

- **Catalogue:** 2 live series (Unwind ×4 models, Alive ×1) plus Humble "coming soon". About 0.83–2.69 M THB incl. VAT, 43.5–123 sqm.
- **Blockers:**
  - Two different price sets are published.
  - The Alive Series page is a broken copy of Unwind.
  - Most images are too low-res for full-bleed layouts.
  - Asset rights are unconfirmed and the repo is public.
- **Biggest UX gaps:**
  - The hero has no message or CTA.
  - There is no model overview or comparison.
  - The main CTA sends users off-site to Linktree.
  - Educational content is fragmented.
- **SEO gaps:**
  - No canonicals.
  - No structured data.
  - Missing or duplicate H1s.
  - Almost no image alt text.
- **Strengths to build on:**
  - Real project photography and floor plans.
  - Specific material specs with named suppliers.
  - Credentialed founders.
  - 7 explainer videos and 5 solid articles.
  - Clear 4-step process.

## Decisions needed before Stage 2

1. **Prices:** which set is current (content-verification §1)
2. **Alive Series:** English copy and FAQ
3. **Asset rights** + high-res originals + SVG logo + vector floor plans
4. **Repository visibility:** make it private? (affects whether real media can be deployed to the Vercel preview)
5. **Typeface:** add the preview domain to the Adobe Fonts kit (keep Aktiv Grotesk Thai), or use an open-licence pair (IBM Plex Sans Thai / Noto Sans Thai + Manrope)
6. **URL strategy:** keep current slugs, or adopt the proposed IA with 301s
7. **Benchmark shortlist:** approve 3–5 brands
8. Remaining items in the [17-point client checklist](content-verification.md#client-confirmation-checklist)

## Next stages (not started)

Stage 2 benchmark + PRD → Stage 3/4 design system and IA sign-off → Stage 5 prototype build → Stage 6 QA, Lighthouse, Playwright and Vercel preview.
