# Why Our Homes v3: storytelling plus technical details

This replaces the v2 materials explorer ([materials-v2.md](materials-v2.md)) on the homepage (`.why`). v2 relied on accordion clicks and technical category names. v3 answers three customer questions directly on the page, then keeps all six original specifications below.

## 1. Information hierarchy

| Level | Content | Interaction |
|---|---|---|
| Intro | H2 "รายละเอียดที่ทำให้บ้านแตกต่าง" + "สำรวจโครงสร้างและวัสดุที่อยู่เบื้องหลังบ้าน Clay & Stone" (proposed) | None |
| 1–2. Stories | Three H3 questions, each with a real photo, a caption saying what the photo shows, a short answer and a "See technical details" link. The lead story also has three key points. | None needed; the link opens the related specs |
| 3. Technical details | H3 "ข้อมูลทางเทคนิค" with six native `<details>` holding the verbatim text from `materials.json`, in two independent columns (3 + 3) | Expand or collapse |

**Layout (v3.1: scroll storytelling, chosen by the client over full-width bands and a dark 3-column band):**
- **Desktop (≥1024px):** a 7/12 photograph column is pinned (`position: sticky`) while the three questions scroll past on the right. An IntersectionObserver on the middle 10% of the viewport makes the question being read active; the photo cross-fades (0.6s), the caption follows and a "01 / 03" count updates. Inactive questions dim to 32%. Focusing a link inside a question also activates it, for keyboard users.
- **Tablet and mobile:** no pinning. Each question carries its own photo inline (full-bleed on phones).
- **Loading:** the pinned set and the inline set are mutually exclusive (`display: none`), so only 3 story images are requested at any width; the test confirms this from network requests.
- **No JavaScript:** every question is fully visible and nothing dims; the desktop pinned frame shows the first photo.

## 2. Line-by-line verification

Status key: **Verified** = present in the source text in both languages and the item is consistent on site. **Proposed** = new presentation copy. **Pending** = the source item is flagged in `materials.json`.

| Story | Statement | Source | Status |
|---|---|---|---|
| Structure | Steel structure certified to TIS (มอก.) | structural-system TH + EN | Verified wording. The **item** is pending (TH/EN differences), so no thickness, "1.4×" or "over / from 2.3 mm" figures are repeated. |
| Structure | High-performance anti-corrosion paint from BEGER | structural-system TH + EN | Verified wording; item pending |
| Structure | Supervised by architects and engineers | structural-system TH ("ควบคุมงานโดยสถาปนิกและวิศวกรระดับสามัญ"), EN ("designed and supervised by licensed architects and engineers") | Verified wording; item pending. The TH licence level ("ระดับสามัญ") is not repeated. |
| Interior | Floor joists every 40 cm, SCG Smart Board + SPC Click Lock | flooring-system | Verified |
| Interior | Steel wall framing, SCG Smart Board, foil-faced glass-wool insulation in external walls to reduce heat | wall-materials | Verified. Board thicknesses stay in the specs. |
| Exterior | WPC terrace and exterior ceilings, resistant to sun and rain | outdoor-terrace | Verified |
| Exterior | Wood-grain aluminium doors and windows with rain barriers (รางลดระดับ) | door-window | Verified |
| Exterior | Metal-sheet roof with PU insulation in the sheet, reducing heat and rain noise | roof-materials | Verified wording; the **item** is pending. "1.35× stronger" and "quieter than typical roofs" are not repeated. |
| All | Questions, captions, heading and lead | — | **Proposed** (needs brand approval); EN is a proposed translation |

**Not included:** the brief suggested "วัสดุภายนอกต้องดูแลอย่างไร?" (how to maintain the exterior). The source contains no maintenance information, so no such content was written.

## 3. Photography

| Story | Image | Notes |
|---|---|---|
| Structure | `unwind-img-05` | The site's own split image: real steel framing during construction (left), finished floor (right). The caption states this. |
| Interior | `unwind-img-04` | Split image: finished room (left), wall framing with foil insulation before cladding (right). The caption states this. Used for walls and floors only, not for structure. |
| Exterior | `unwind-img-03` | Real terrace with wood-grain aluminium doors under the eaves |

**Asset gaps (client):**
- no close-up of the roof construction
- no dedicated door and window detail photo
- the structural composite `unwind-img-06` is part line drawing, so it is not used
- all images are at most 1104px wide

## 4. Interaction and accessibility

- **No clicks needed:** all value is readable without interaction. There is no hover-only content and no accordion is required.
- **Story links:** "See technical details: …" opens the matching `<details>`, scrolls to the first and focuses its summary. Without JS the link still jumps to that spec, and every spec text is in the HTML.
- **Keyboard:** the native `<details>` work with Enter and Space and have visible focus rings.
- **Headings:** H2 → H3 (three stories + "Technical details"). Every photo has descriptive alt text.
- **Badges:** no public verification badges; status is tracked in this file.

## 5. Tests (local, headless Chrome)

TH 1440, EN 1440, TH 820 and TH 390 all pass (re-run for v3.1):
- the pinned photo follows the question being read (01 → 02 → 03), and the photo column is sticky
- exactly 3 story image requests at every width, with no duplicate downloads
- three questions answered without clicking
- H2/H3 hierarchy
- meaningful alt text; all story photos load
- six specs present and verbatim against `materials.json`
- no badges; specs collapsed by default
- story link opens and focuses the right specs
- Enter and Space toggle
- no overflow at the real viewport width; no page errors

No-JS: three answers and six spec texts present. Smoke QA: 32 routes × 2 viewports, 0 failures.

## 6. v4: tabbed explorer (feedback: "not engaging, hard to scroll through")

**Why v3.1 felt heavy:**
- each question held most of a screen (72svh) so the pinned photo could follow
- the section was about three screens of mostly empty scrolling
- inactive questions were dimmed to 32%, so the page looked unfinished while you scrolled
- on mobile it was a long stack

**v4: one screen, the reader chooses**
- **Tab row:** three tabs with a 2px bar each (same language as the Finder step bar): 01 โครงสร้าง / Structure · 02 ผนังและพื้น / Walls & floors · 03 ภายนอกและหลังคา / Exterior & roof. Topic labels are **proposed** copy.
- **Panel:** one photo-and-answer panel (7/5 on desktop, centred) with index · topic, the question (H3), the answer, key points, "See technical details" and a **"ข้อถัดไป: …" / "Next: …"** button that leads to the next topic. The last panel ends with the specs link.
- **Size:** the explorer is ~680px tall at 1440×900, so the whole section fits on one screen. Switching fades the new panel in (0.45s, off with reduced motion).
- **Mobile:** the tab row sticks under the header while the panel scrolls. The photo is full-bleed at 16:10.
- **Loading:** only the visible panel's photo loads (the hidden panels are `display: none` with lazy images).

**Accessibility:**
- WAI-ARIA tabs pattern: `role=tablist/tab/tabpanel`, `aria-selected`, roving `tabindex`; ←/→ move between tabs and Home/End jump to the first or last.
- "Next" moves focus to the new panel and scrolls the tab row back into view.

**No JavaScript:** the tab row and "next" buttons stay hidden and all three answers are shown stacked, with no ARIA tab roles. Content, photos, captions and verification (§2–3) are unchanged.

**Tests:**
- `tests/why-check.mjs` passes at TH/EN 1440, TH 820, TH 390 and with no JS. It checks:
  - one panel at a time
  - click, arrow keys and Home
  - "next" moves focus
  - spec links still open the specs
  - the explorer fits the screen on desktop
  - no overflow and no page errors
- Smoke QA: 0 failures.

Earlier v3.1 notes above (scroll storytelling, sticky frame, 3 story image requests) describe the replaced version.

## 7. v4.1: specs inside each topic, photo tabs

**Client feedback:** remove the separate "ข้อมูลทางเทคนิค" block under the explorer, and improve the UX further.

- **Specs live in their topic.** The 6-item block (2 columns of `<details>`) is removed. Each panel now ends with one native disclosure, "ข้อมูลทางเทคนิค · ระบบพื้น · ผนัง", that opens the verbatim specs for that topic in place:
  - Structure: structural system
  - Walls & floors: flooring and walls
  - Exterior & roof: terrace, doors and windows, roof

  All 6 texts are still on the page, verbatim from `materials.json`, and work without JS. This replaces the "See technical details" link, which used to jump down the page.
- **Deep links still work.** `#spec-<id>` (e.g. `#spec-roof-materials`) selects the right topic, opens its details and scrolls to the spec after load, so the browser's scroll restoration doesn't override it.
- **Photo tabs.** Each tab shows a 4:3 thumbnail of its topic photo next to the number and label. Inactive thumbnails are dimmed and desaturated, and hover or selection brings them to full colour. This makes the tabs read as clickable. Thumbnails are hidden on phones, where the tab row is sticky and compact.
- **Tighter layout.** The fixed 34rem panel height and vertical centring are gone, which removes the large gap under the tabs. The text now starts level with the top of the photo, and the space between tabs and panel is reduced.
- **Analytics:** `view_material_topic` (tab or next) and `view_material_specs` (details opened, with topic).

**Tests:** `tests/why-check.mjs` also checks that the old block is gone, that interior lists 2 specs, and that all 6 specs are verbatim. TH/EN 1440, TH 820, TH 390 and no-JS all pass; smoke QA has 0 failures.

## 8. v4.2: tabs restyled (feedback: "adjust the steps", then "still odd?")

The top-bar tabs read as a progress stepper, and the dimmed grey thumbnails looked disabled. A first pass put the selected tab on a grey panel and showed the question under each label. That made the row heavy, hover looked like a second selection, and the question appeared twice (tab and H3). Final version:
- **Tab row:** one row on a hairline. The selected tab has ink text and a 2px ink underline, with no fill. Hover darkens the text and shows a light underline only.
- **Content:** a 3.5rem full-colour thumbnail (60% opacity when inactive, full on hover or selected; 2.75rem on tablet) and "01 โครงสร้าง". There is no question in the tab; the panel's H3 asks it.
- **Panel:** the eyebrow "01 · โครงสร้าง" is hidden when the tabs are active, because the selected tab already names the topic. Without JS it stays.
- **Phones:** text-only centred tabs, sticky under the header.

`tests/why-check.mjs` and smoke QA pass.
