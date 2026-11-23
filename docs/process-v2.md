# Process v2: timeline and photo steps

This replaces the homepage Process section (`.process`). v1 was four text columns with big numbers. The client's feedback was that the UX was not good enough. Its problems:

- **No sense of time:** you couldn't see how long the whole thing takes or how the steps relate.
- **Misleading timing:** "~70%" sat where a duration belonged, but it means *when* delivery happens (at ~70% of production), not how long it takes.
- **No pictures:** the original site's process photos were unused.
- **Uneven rows:** step 01 had no timing, so its title sat lower than the others.
- **Dead end:** there was no next action after reading.

## 1. Structure

| Part | Content |
|---|---|
| Header | Eyebrow "กระบวนการ", H2 "จากแบบบ้าน สู่บ้านที่พร้อมอยู่", lead, and "ดูรายละเอียดกระบวนการ →" (`/how-we-build/`) |
| Timeline track (≥768px) | Segments sized by the published durations (see below) |
| Steps | Four cards: real photo with a number badge, a timing chip, title and text (both verbatim from `process-steps.json`) |
| CTA | "พร้อมเริ่มขั้นตอนแรกแล้วหรือยัง?" with "นัดปรึกษาทีมออกแบบ →" (`/contact/`) and "แชตผ่าน LINE" |

**Track segments:**
- **Design:** no published duration, so it has a fixed width, is dashed and labelled "ก่อนสั่งผลิต".
- **Factory production:** 60–90 days, sized by the midpoint (75).
- **Delivery:** a pin on the production bar at 70%, labelled "03 ขนส่ง".
- **On-site assembly:** ~15 days, in timber colour.
- **Handover:** a house icon at the end.

**Interaction:** hovering a step card highlights its part of the track (CSS `:has`; browsers without it simply don't highlight).

**Timing chips** (one per step, so every row lines up):

| Step | Chip |
|---|---|
| 1 | ก่อนสั่งผลิต / Before you order |
| 2 | 60–90 วัน |
| 3 | เมื่อผลิตได้ ~70% / At ~70% production |
| 4 | ~15 วัน |

**Layout by width:**
- **Desktop:** track, then 4 cards in a row.
- **Tablet:** track, then 2×2 cards.
- **Phone:** the track is hidden. Steps form a vertical timeline (square photo on the left, a rail joining the photos, text on the right).

## 2. Verification

| Item | Source | Status |
|---|---|---|
| Step titles and texts | `process-steps.json` (live /process) | Verbatim |
| 60–90 days, ~70%, ~15 days | `settings.timeline` (live /process, Unwind FAQ 5) | Verified. Production depends on the queue, as the FAQ says. |
| Design duration and total time | — | **Not published**, so neither is shown. The track is not a schedule, and the design segment has no length claim. |
| Photos | Live /process images (453px squares) | The original site's own photos. **Proposed** alt text. |
| Track labels, chips, CTA, "ดูรายละเอียดกระบวนการ" | — | **Proposed** copy, needs brand approval |

**Asset gap:** the process photos are 453px. They are sharp at 4-up desktop and phone thumbnails, but soft on the 2×2 tablet layout and on high-DPI screens. Larger originals are needed.

## 3. Accessibility

- **List:** the steps are an ordered list. Each H3 is prefixed with a visually hidden "ขั้นตอนที่ n:", and each timing chip with "ระยะเวลา:".
- **Track:** `aria-hidden`, because everything on it is repeated in the list.
- **Images:** photos have descriptive alt text, and the number badge is decorative.
- **No JavaScript:** nothing in the section needs it.

## 4. Tests

`node tests/process-check.mjs` runs at TH/EN 1440, TH 820 and TH/EN 390. It checks:
- 4 steps, with verbatim text, timing and alt text
- the track is visible at ≥768px and hidden on phones
- the production bar is more than twice the width of the assembly bar
- the delivery pin sits on the production bar
- the CTA is present
- no overflow and no page errors

Smoke QA: 0 failures. A layout bug was fixed along the way: cards in a row stretched to the tallest one and spread the extra height between photo and text, which pushed the timing chips out of line. `align-content: start` fixed it.
