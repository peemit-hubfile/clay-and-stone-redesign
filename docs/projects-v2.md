# Projects v2: real homes, real owners

This replaces the homepage Projects section (`.projects`). v1 was a 5-photo mosaic whose captions only repeated model names, a flat list of provinces, and one long testimonial with no photo. v2 builds the section around the four owner reviews that have a model and a province attached, so every home on screen has a person and a place.

## 1. Information hierarchy

| Level | Content |
|---|---|
| Header | Eyebrow "โปรเจค", H2 "บ้านจริง จากเจ้าของจริง" / "Real homes, real owners", a lead built from the data ("…ส่งมอบแล้วใน 5 จังหวัด…"), and "ดูโปรเจคทั้งหมด →" (`/projects`) |
| Lead story | **K. Orachorn**, Unwind Series 1 Bed 2 Bath, Suphanburi. A large completed-home photo with the owner's handover photo inset ("วันส่งมอบบ้าน"), a pull-quote, owner, model link and province, plus "อ่านรีวิวเต็ม" |
| Owner cards | **K. Sujinda** (Loft, Suphanburi), **K. Ketskanok** (Standard, Saraburi), **K. Pornsak** (Standard, Bangkok). Each card has a pull-quote, a round handover photo (or an initial when there is no photo), name, model link, province and the full review |
| Places | "ส่งมอบบ้านแล้วที่", followed by 5 provinces with pin icons, derived from `project-galleries.json` locations |

**Layout**
- **Desktop (≥1024px):** the lead story uses a 7/5 split, with the handover photo overlapping the bottom edge of the main photo. Below it, the owner cards sit in 3 columns.
- **Tablet and mobile:** the photo is full-bleed and the handover inset sits inside the photo corner, so it never covers text. Cards stack in one column, because 3 columns at 820px squeezed the names.

## 2. Verification

| Item | Source | Status |
|---|---|---|
| Quotes (TH + EN) | `testimonials.json` t3–t6 | **Verbatim.** Each pull-quote is a substring of the quote, ends with "…", and the full review sits in a `<details>`. `tests/projects-check.mjs` checks both. |
| Owner, model, province | `testimonials.json` | Verified data. **Republication consent is still pending** for all four, as it is on the live site. |
| Handover photos | `testimonials/*.png` (t3–t5) | From the live site. t6 has no photo, so it gets an initial. Same consent flag. |
| Lead photo | `unwind-1bed-2bath` gallery, photo 1 | The 1 Bed 2 Bath gallery has one recorded location (Suphanburi), and the caption names only model and province. It does **not** claim to be K. Orachorn's house. |
| 5 provinces | `project-galleries.json` locations | Verified |
| Heading, lead, labels | — | **Proposed** copy, needs brand approval. EN is a proposed translation. |

Pull-quote choice: each excerpt says something different, so the cards don't repeat each other:

| Owner | Excerpt is about |
|---|---|
| K. Orachorn | Liveability |
| K. Sujinda | Pride after handover |
| K. Ketskanok | Solidity and insulation |
| K. Pornsak | The pre-sale advice |

The TH and EN excerpts of each owner say the same thing.

**Removed:**
- the 5-photo mosaic. Model photos are already shown in the Discover rail and on `/homes`.
- the old standalone testimonial block and its CSS (`.project-mosaic`, `.project-tile`, `.testimonial`)

## 3. Accessibility

- **Headings:** a single H2, and the lead story is an `<article>`.
- **Quotes:** marked up with `<blockquote>`. The quotation marks and the ellipsis are added by CSS, so screen readers read the words only.
- **Full review:** "อ่านรีวิวเต็ม" is a native `<details>`. It works with Enter and Space, and its accessible name includes the owner, for example "อ่านรีวิวเต็ม · คุณอรชร (คุณเก๋)".
- **Images:** every photo has alt text naming the owner and the occasion. The initial avatar is `aria-hidden`.
- **No JavaScript:** nothing in the section depends on JS.

## 4. Tests (local, headless Chrome)

`node tests/projects-check.mjs` runs at TH 1440, EN 1440, TH 820, TH 390 and EN 390. All checks pass:
- 4 stories
- excerpts and full quotes verbatim
- model links return 200
- all images load and have alt text
- 5 provinces
- Enter opens and closes the full review
- no horizontal overflow
- no page errors

Screenshots are saved in `test-results/projects/`. Smoke QA: 32 routes × 2 viewports, 0 failures.

## 5. Open items (client)

- Republication consent from the four owners, including their handover photos
- A handover or home photo for K. Pornsak
- Confirm whether the lead photo is K. Orachorn's own house. If so, the caption can say so.
- Brand approval of the heading and lead copy

## 6. v2.1: more visual (feedback: "too plain")

v2 had a 7/5 photo-and-text split, three white text cards with round avatars and a quiet places line. On the neutral palette v4 (see `design-system.md`) it read as flat. v2.1 lets the photography carry the section.

**Lead story**
- A full-bleed photograph of the completed home (min(88vh, 50rem) on desktop) with a dark gradient.
- The owner's quote sits over the photo in white, with the label, owner, model link and "อ่านรีวิวเต็ม". The full review expands in place, and the band grows with it.
- The handover photo is a tilted polaroid: bottom right on desktop, above the quote on tablet and mobile.
- The caption chip (model · province) moved onto the photo.

**Owner cards**
- The handover photos are now large card images (5:4) with a "วันส่งมอบบ้าน" chip, above the quote, owner, model link and full review.
- K. Pornsak has no photo, so his card is typographic, on the brand's dark colour, with a large quotation mark.
- Desktop shows 3 columns. Tablet shows 2 photo cards with the dark card full width below. Mobile stacks them.

**Class names:** the block is `.owner-story` (not `.story`), because `.story` is already used by the Why section's scroll-storytelling questions. An early v2.1 build shared the name and turned those questions into dark boxes.

**Unchanged:** the content, verbatim rules, alt text and the "Places" line. `tests/projects-check.mjs` passes at TH/EN 1440, TH 820 and TH/EN 390, and the smoke QA has 0 failures.

## 7. Map (tried and removed)

A province map (SVG, pins for the five provinces, distance rings from the showroom, and a linked list) was built in place of the "ส่งมอบบ้านแล้วที่" line, then restyled as a site-plan drawing. The client asked to remove it. The section is back to the single line of five provinces from §1. The map code was deleted.
