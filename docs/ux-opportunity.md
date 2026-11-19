# UX Opportunity Report

**Stage 1 · Discovery** · 20 Nov 2026

> **Evidence status.** No user research, analytics, Search Console or sales data was available. Everything below is either **[Observed]**, meaning seen on the live site (screenshots in `audit-evidence/`), or **[Assumption]**, meaning a hypothesis drawn from the site content and the brief. Assumptions must be validated, ideally with 5–8 interviews with recent buyers and enquirers, a look at GA4/GTM data, and the questions the sales team receives on LINE.

## 1. Who visits and what they need to decide

| Segment (from brief + site copy) | Primary job-to-be-done | Evidence on the site |
|---|---|---|
| A. Landowners planning a home | "Will one of these fit my land, budget and family?" | Unwind FAQ 3–4; price blog [Observed content] |
| B. Second-home / weekend-retreat seekers | "Can I get a beautiful getaway fast, without contractor stress?" | Unwind intro, knockdown-ideas article [Observed] |
| C. Small hospitality / resort owners | "Can I deploy several units, and what will it cost per key?" | "resort unit", "boutique resort villa" copy [Observed]; no B2B content [Gap] |
| D. People new to modular / prefab | "Is it strong, durable, waterproof? Is it 'cheap prefab'?" | 7 videos + 3 trust FAQs exist [Observed] |
| E. Architects / partners | "Can I specify or partner with you?" | No content [Gap] |

[Assumption] Segments A and B make up the majority, and the decision is **high-consideration** (0.8–2.7M THB, often with land already owned). The path is likely: social/search → site → LINE chat → showroom visit → quote → contract.

### Decision questions and where the current site answers them

| Question | Answered? | Where / issue |
|---|---|---|
| What exactly is a modular home? | ✓ | Home FAQ 1, blog, EP.1 — scattered |
| How is it different from prefab/knockdown? | ✓ | Blog only |
| Is it strong and durable? | ✓ | FAQs, materials, EP.3 |
| How much does it cost? | ◐ | **Two price sets** 🔴; total budget (foundation, utilities) only in one blog |
| How long does it take? | ◐ | 15 days on-site is prominent; 60–90 days production is buried in one FAQ; total is never stated |
| What models are available? | ◐ | Split across 2 series pages; no overview |
| Which model suits my lifestyle? | ✗ | Only one FAQ recommendation (1B2B for small families) |
| What land requirements apply? | ◐ | Crane/truck access; elevated option. **No minimum plot size.** |
| What is included in the price? | ◐ | One FAQ on the Projects page |
| How does installation work? | ✓ | Process page |
| How do I contact the company? | ◐ | Details everywhere, but the main CTA sends users to Linktree |

## 2. Friction points (observed)

1. **Hero says nothing.** The logo-over-video hero has no headline or CTA, so the first 5 seconds don't communicate the offer. [Observed: desktop_th_fold, mobile_th_fold]
2. **Price is hidden and contradictory.** Price first appears ~60% down the product page; the same page shows 849k and 830k. [Observed]
3. **No overview of all 5 homes** with comparable attributes.
4. **Floor plans are images inside price cards**, too small to read on mobile, not zoomable, not accessible.
5. **Long, uniform pages** (8–9.5k px) with repeated content: key strengths shown twice on home, materials shown twice (tabs + panels).
6. **Carousels hide decision content.** Function and combination options sit behind small arrows.
7. **Education is fragmented** across FAQs on 3 pages, a video page and a blog.
8. **Off-site conversion.** "Book Consultation" goes to Linktree, adding an extra step with a different look and losing tracking context.
9. **Showroom visits are "by appointment"** but there is no way to book one or see opening hours.
10. **Trust signals are under-presented.** Credentials are in small Thai text, testimonials sit in a carousel, and there are no project stories.
11. **EN experience feels second-class.** Thai text and Thai meta appear on EN pages, and team info is untranslated.
12. **Mobile:** small tap targets in galleries, a JS error on every load, and heavy video on cellular.

## 3. Opportunities (prioritised)

Scored **Impact** (on conversion and trust) × **Confidence** (evidence) × **Ease** (1–5 each). These are product hypotheses, not validated results.

| # | Opportunity | I | C | E | Notes |
|---|---|---:|---:|---:|---|
| 1 | **Message-first hero**: what, for whom, "from ฿X", Explore Homes + Talk to Us | 5 | 4 | 5 | Uses existing positioning; price pending confirmation |
| 2 | **Our Homes overview**: 5 model cards with photo, series, sqm, beds/baths, price, plan thumbnail | 5 | 5 | 4 | All data exists in `products.json` |
| 3 | **Model detail pages**: large readable plan, area breakdown, gallery, what's included, related FAQ, sticky CTA | 5 | 4 | 3 | Split from series pages |
| 4 | **Compare** (2–3 models side by side) | 4 | 4 | 4 | Low data risk; high clarity |
| 5 | **Smart Home Finder** (rules-based, explains "why", falls back to consultation) | 4 | 3 | 3 | Flagship; see §5 |
| 6 | **Total cost clarity**: "What's included / what you prepare" + a budget range note (20–30% guidance from their own blog) | 5 | 4 | 4 | Reduces late-stage surprises; needs client confirmation |
| 7 | **Timeline visual**: design → 60–90 days factory → ~15 days on site | 4 | 4 | 5 | Existing facts |
| 8 | **On-site consultation hub**: LINE (primary in TH), phone, email, showroom visit request (demo form) | 5 | 4 | 4 | Replace Linktree; analytics-ready |
| 9 | **Knowledge Center**: unified FAQ by topic, videos with summaries, articles | 3 | 4 | 4 | AEO benefit |
| 10 | **Trust layer**: founders' credentials, named suppliers (SCG, BEGER, TIS), warranty, showroom, testimonials with model and location | 4 | 4 | 4 | Present on more pages, near decisions |
| 11 | **Projects by model / location** with a map-free location list | 3 | 3 | 4 | Limited by missing project data |
| 12 | **Investor / resort page** | 3 | 2 | 2 | **No content exists.** Needs client input; do not invent ROI. |
| 13 | **Humble Series register-interest** | 2 | 2 | 4 | Client decision |

## 4. Proposed core journeys

**J1: "Find my home" (primary)**
Home hero → *Explore Our Homes* → filter/compare → model page → *Book a consultation* (LINE / showroom visit).

**J2: "Help me choose" (guided)**
Home → Home Finder (5–6 questions) → 1–3 recommendations, each with reasons → model page or consultation, with answers pre-filled into the message.

**J3: "Can I trust modular?" (sceptic)**
Hero → How We Build (materials, process, warranty) → Projects → testimonials → consultation.

**J4: "Price check" (search entry)**
Search "บ้านโมดูลาร์ราคา" → article / Our Homes → price table → what's included → consultation.

## 5. Smart Home Finder: definition (prototype scope)

- **Inputs** (each maps to a verified field):
  - Intended use: primary home / second home / resort-hospitality / studio. Maps to `suitable_for` and `intended_use`.
  - Household size → `bedrooms`.
  - Bedrooms and bathrooms needed.
  - Budget band → `price_thb`. Bands will be used until the price conflict is resolved.
  - Plot constraint: limited plot → Loft (`suitable_for`).
  - Preference: compact/active (Alive) or calm/slow-living (Unwind) → series `values`.
- **Not asked**: land size in sqm. There is **no minimum plot size data**; asking would imply a precision we don't have. The plan is to show footprints once the client confirms them.
- **Output**: ranked matches with a visible **"Why this home"** list (each reason tied to a data field), an honest "no exact match" state, and a consultation CTA that carries the answers.
- **Transparency**: labelled as a rules-based guide, not AI. No personal data is collected, and answers stay in the browser.
- **AI-ready**: rules and data are separated so a future grounded assistant could reuse the same `products.json` and FAQ corpus.

## 6. Content the client needs to supply for the best experience

High-resolution photos · vector floor plans · confirmed prices and validity · Alive Series copy and FAQ · minimum plot and footprint per model · typical total timeline · payment milestones (optional) · project stories (location, use case, customer quote, consent) · showroom opening hours · factory photos/video · investor/resort information (if this segment is a priority).

## 7. Success metrics (proposed; to be refined in the PRD)

| Metric | Type |
|---|---|
| Consultation starts (LINE / call / showroom request) per session | Primary conversion |
| Model page views per session; compare usage; Home Finder completion rate | Engagement / discovery |
| Hero CTA click-through rate | First-5-seconds clarity |
| Scroll depth to price on model pages | Findability |
| Share of enquiries that mention a specific model (sales-team tag) | Lead quality [needs CRM/LINE tagging] |

Event names follow the brief (`view_home`, `view_product`, `compare_products`, `start_home_finder`, `complete_home_finder`, `click_contact`, `click_line`, `click_phone`, `submit_consultation`). In the prototype these will be **logged to the console only**. No tracking scripts are installed without approval and consent.
