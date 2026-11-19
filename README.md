# Clay & Stone: Redesign Prototype

An independent redesign proposal for [clayandstone.co.th](https://www.clayandstone.co.th). This repository is separate from the production Webflow site, which is **never modified** from here.

**Current stage:** Stage 1 (Discovery) complete. Awaiting approval. See [`docs/README.md`](docs/README.md).

## Repository layout

```
docs/            Discovery reports, asset manifest, source archive, audit evidence
src/data/        Structured content extracted from the live site (single source of truth)
tools/discovery/ Scripts used to crawl and audit the live site
public/          Local media (client images/videos are git-ignored until rights are confirmed)
```

## Content rules

- All business facts come from the live site and carry a source. Conflicts are flagged, not fixed. See [`docs/content-verification.md`](docs/content-verification.md).
- No invented prices, specifications, testimonials or project photos.
- Client media in `public/images/source` and `public/videos/source` is not committed, because asset rights are unverified and this repository is public.

## Re-running discovery

Python 3.12 (Pillow) and Node 18+ are required. Scripts live in `tools/discovery/`: `crawl.py` → `extract.py` → `assets.py` / `faq.py`, plus `audit.js` (Playwright, uses local Chrome via `playwright-core`).
