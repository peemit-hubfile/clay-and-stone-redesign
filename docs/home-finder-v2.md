# Smart Home Finder v2

The homepage finder (`#finder`) was redesigned from a 6-question form into a guided 4-step discovery with photographs throughout. It is rules-based: the same engine (`src/scripts/finder-engine.js`) is exhaustively tested by `tools/seed/validate-seed.mjs`. There is no AI and no backend.

## 1. Problems in v1

| Problem | Fix |
|---|---|
| 6 questions; "household" duplicated "bedrooms" | 4 steps. Household is folded into "space" (bedrooms), and plot + mood become one optional "priority" step |
| Black band and a large white form card, with identical boxed options | Warm stone band, questions on paper, choices as list rows with icon, label and short hint |
| No houses visible until the end | Live strip of the 5 homes beside the questions. Homes that no longer match fade, and the count is announced |
| Auto-advance fired on keyboard arrow keys | Auto-advance only after a pointer click on a choice. Arrow keys just change the selection |
| Prominent "not AI / stays in browser" disclaimer | Moved into a "How are homes recommended?" disclosure, reworded to what is verified |
| Text-only results | Result rows with a real photo, verified specs and price, "why it fits", "good to know", view link and LINE CTA |

## 2. Flow

1. **Use** (`use`): main home · weekend or second home · resort or guest stay · studio or workspace.
2. **Space** (`space`): open plan or loft · 1 bedroom (requires ≥ 1) · 2 bedrooms (requires ≥ 2, with a note about larger families).
3. **Budget** (`budget`): ≤ ฿1M / 1.5M / 2M / 3M / not sure. Each hint shows how many homes fit that budget, computed from `models.json`.
4. **Priority** (`priority`, optional, can be skipped): limited plot · calm, close to nature · active, outdoor living.

Navigation:
- Clickable step bar for steps already reached
- Back keeps answers; Next is enabled only once the step is answered
- Skip appears only on the optional step
- No page reloads
- From the results, answer chips jump back to that step, plus "Change answers" and "Start again"

## 3. Results

- Up to 3 matches, sorted by score, then price, as before.
- **Each result shows:**
  - a real completed-home photo, or a render with a "Visualisation" badge
  - name, specs and "from" price, with a "pending" badge where it applies
  - **Why it fits:** the rule reasons that passed
  - **Good to know** (verified limitations):
    - render-only images
    - price pending
    - area pending
    - open plan, no bedroom
    - loft reached by stairs
  - a view link and "Ask about this home on LINE"
- **No exact match:** a consultation card (LINE and phone), then up to 3 close matches showing what they miss ("Doesn't match: …").
  - Across all 480 answer combinations, every no-match case still has close matches.
- **Notes:** rule notes (for example multi-unit resorts, larger families) plus the site-access note about crane or truck access and an engineering survey.
- **No percentage scores:** the engine's weights are not a defensible compatibility measure.

## 4. Accessibility and engineering

- **Radios:** each step is a `<fieldset>` + `<legend>` of native radios, visually hidden but focusable. The focus ring is drawn on the row.
- **Announcements:** the live count is `aria-live="polite"`; results receive focus; the step bar uses `aria-current="step"`.
- **No JavaScript:** a `<noscript>` link points to `/homes/`. The model pages and the Our Homes page stay independently indexable.
- **Rendering:** verified model data is server-rendered into `<template>`s, so the script only adds reasons and ranking. `finder-ui.js` is about 8 KB.

## 5. Tests (local)

- **Headless Chrome end to end** (TH 1440, EN 1440, TH 390 mobile), all checks passing:
  - start state
  - Next disabled until answered
  - click auto-advance
  - arrow keys do not advance
  - Back keeps answers
  - Skip on the optional step
  - results with reasons, focus moved to results
  - editing an answer from the results
  - the no-match path (consultation + close matches)
  - restart
  - no horizontal overflow at the real viewport width
  - no console errors
- **Seed validator:** 480 combinations, 80 with no exact match, 0 without close matches.
- **Smoke QA** (`tests/qa-smoke.mjs`, updated for the 4-step flow): 32 routes × 2 viewports, 0 failures.
- **Bug found and fixed:** on phones, the live strip forced the page to 682px wide. The grid now uses `minmax(0, 1fr)`. The test now checks the real viewport width, because on emulated mobile the browser widens the viewport too, so the old `scrollWidth - innerWidth` check hid this.

## 6. Copy (proposed, needs brand approval)

- **Heading and lead:** "ค้นพบบ้านที่เหมาะกับคุณ" / "ตอบคำถามสั้น ๆ เพื่อค้นหาแบบบ้านที่ตรงกับการใช้ชีวิตของคุณ" (from the brief). The EN versions are proposed translations.
- **Option hints, limitations and result labels:** new UI copy, in both `i18n/*.json` and `finder.json`.

## 7. Data gaps that limit matching

- **Prices:** 4 of 5 prices are pending confirmation (849,000 vs 830,000, and so on), so budget filtering uses the price-card value.
- **No plot data:** no minimum plot size or footprint for any model, so "limited plot" can only boost the Loft (the only model with a plot statement).
- **Alive 2 Bed 2 Bath:** no description, no household guidance and render-only images. It matches on specs and price only.
- **Use tags:** `uses`/`household` tags come from site copy and blog posts (see `tag_basis` in `models.json`), not from a client-confirmed matrix.
- **Unconfirmed terms:** the warranty, free-installation radius and multi-unit (resort) pricing are not confirmed, so the finder does not use them.

## 6. Results v3: editorial recommendation (feedback: "looks AI-generated")

**What made it feel generated:**
- the same template on every card: rank, name, specs, price, then a "Why it fits ✓" list beside a "Good to know ⓘ" list
- boxed answer chips that read like a form recap
- a heading ("แบบบ้านที่เหมาะกับคุณ") that repeated the section title
- three warning rows that outweighed the reasons, with price pending shown twice (badge and row)

**Changes:**
- **Recap and heading:** the answers become one quiet line ("จากคำตอบ บ้านหลัก · ผังเปิด หรือ Loft · …"). Each answer is a dotted-underline button back to its step. The heading now depends on the count:
  - "แบบบ้านที่เราแนะนำสำหรับคุณ" / "The home we'd suggest for you" when one home matches
  - "{n} แบบบ้านที่ตรงกับคำตอบของคุณ" / "{n} homes match your answers" when several do
- **Feature card:** the first result gets a large photo (7/5 split) and its reasons as a short paragraph, with no icons:
  - English phrases become sentences.
  - Thai phrases keep the language's space-as-sentence-break, widened to 0.55em so they don't run together.
  - Specs are a small 4-column fact table (area, bedrooms, bathrooms, storeys) between hairlines.
  - The rank label is hidden when there is only one result.
- **Further matches:** listed under "แบบอื่นที่ตรงกับคำตอบเช่นกัน" as compact rows with a thumbnail, name, one-line reason, specs, price, note and a LINE link. They no longer have equal weight with the first result.
- **Limitations:** now one muted line, "ข้อควรรู้ …", joined with " · ". Price pending is dropped from it because the badge already says so. Close matches put "ไม่ตรงกับ: …" first in that line.
- **No-match case:** unchanged apart from styling. The consultation card is followed by the closest match as the feature and the rest as rows.

**Tests:**
- `tests/finder-shots.mjs` captures the single, multi (TH/EN), no-match and mobile cases into `test-results/finder/`, with 0 overflow and no page errors.
- The smoke test now checks that the feature's reason paragraph is not empty. 32 routes × 2 viewports, 0 failures. `seed:validate` passes.
