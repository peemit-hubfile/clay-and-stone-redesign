# Homepage Hero v3: Less Interface, More Architecture

Replaces the v2 hero ([hero-v2.md](hero-v2.md)), following the "Hero Redesign V3" brief. Scope: the homepage hero, a new "Discover Our Homes" section directly below it (replacing the old series/filter homes block), and quieter navigation interactions. Other pages are unchanged.

## 1. What the hero contains now

| Kept | Removed (from v2) |
|---|---|
| H1 (2 lines) | "Homes Beyond Prefab" eyebrow |
| One supporting sentence | Long description |
| One primary CTA, which goes to the Our Homes page | Secondary "Talk to our team" link |
| One photograph: a completed Unwind 1 Bed 2 Bath | Model index, progress lines, pause button, autoplay crossfade |

## 2. Composition

- **Desktop (≥1024px):** text 38% on paper, aligned to the page grid. The photograph takes 62% and bleeds to the right edge of the viewport, starting directly under the header. There are no overlays, gradients or captions on the image.
- **Tablet (768–1023px):** a 4:3 photograph plate, then the headline on the left and the sentence and CTA on the right.
- **Mobile:** a square photograph cropped on the gable, then the headline, sentence and a full-width CTA. The CTA ends at about 730px on a 390 × 844 screen.

## 3. Copy: proposed, needs brand approval

| | TH | EN |
|---|---|---|
| H1 | บ้านโมดูลาร์ / ที่ออกแบบเพื่อชีวิตจริง | Modular homes, / designed for real life. |
| Sentence | ออกแบบโดยสถาปนิก ผลิตในโรงงาน และติดตั้งหน้างาน | Architect-designed, built in our factory and installed on site. |
| CTA | สำรวจแบบบ้าน | Explore our homes |
| Section title | แบบบ้านของเรา | Discover our homes |

The TH copy is the brief's proposal. The EN copy is a proposed translation. The facts it rests on are verified on the live site: architects and engineers oversee the work, homes are built in a factory, and they are installed on site.

## 4. Typography

- **Thai H1:** IBM Plex Sans Thai 300, `clamp(1.875rem → 3.125rem)`, line-height 1.34. Line 2 may only break between "ที่ออกแบบ" and "เพื่อชีวิตจริง".
- **Thai sentence:** breaks only at the spaces between phrases, so no orphaned "หน้างาน".
- **EN H1:** Manrope 300, `clamp(2.125rem, -0.5rem + 4.1vw, 3.25rem)`. The size tracks the column, so "designed for real life." stays on one line from 1024px to 1872px.

## 5. Discover Our Homes (revised: "too plain" feedback)

- **Dark band** (`--color-inverse-bg`) after the paper hero, so the page has rhythm and the photographs stand out.
- **Header:** an eyebrow, a large title, and a one-line intro built from the data (5 homes, 2 series). On the right are ← / → buttons and "View all 5 homes". The buttons are hidden on phones, where swiping is natural.
- **Rail of all 5 homes:** it starts on the page grid, bleeds off the right edge and snaps card by card. It is user-controlled, with no autoplay.
- **Card:** a 4:3 photograph, number (01–05), series, model name, specs (area · rooms · bathrooms · storeys) and starting price with its "pending" badge, plus "View details".
- **Floor plan on hover:** on devices that can hover, hovering or focusing a card swaps the photograph for the floor plan. On touch devices the plan is not loaded at all.
- **Honest imagery:** the three Unwind homes use real completed-home photos. Unwind 2 Bed 2 Bath and Alive use their cover renders with a "Visualisation" badge, which hides while the plan shows.
- Cards use CSS subgrid, so the number, name, specs, price and link rows line up across every card. The pending badge always sits on its own line under the price, so cards with and without it stay aligned. There are no divider lines.
- The rail script (`src/scripts/rail.js`, under 1 KB) only adds the arrow buttons. Without JS the rail still scrolls.

## 6. Motion and navigation

- **Hero:** the photograph reveals from a 6% clip with a 1.05 → 1 settle. The headline, sentence and CTA fade up, staggered over 0.25s. The CTA arrow nudges 3px on hover. Everything is off for `prefers-reduced-motion`.
- **No carousel and no autoplay;** the slideshow script was removed.
- **Navigation:** colour change on hover only. A static underline marks the current page, replacing the animated underline grow. The menu-icon hover shift and the staggered mobile-menu entrance were removed.

## 7. Results (local)

| Check | Result |
|---|---|
| Smoke QA (32 routes × 2 viewports) | 0 failures |
| Lab LCP, mobile "4G" TH / EN (median of 3) | 2.15s / 1.84s (target 2.5s; v1 was 2.68s, v2 was 1.83s) |
| Lab LCP, desktop TH / EN | 0.38s / 0.33s |
| CLS | 0 |

These are lab numbers on an emulated network, not field data. The mobile TH LCP rose from v2 because the mobile photograph is now a larger square crop. If needed, a 4:3 crop on phones would bring it back down.

## 8. About Clay & Stone (V4 brief)

- **Desktop:** photograph 55% / text 45%, vertically centred, inside the page container. **Tablet:** 1:1. **Mobile:** full-bleed portrait photograph, then text.
- **Photo:** a completed Unwind Loft Type interior (double height, timber stair, mezzanine, daylight from the deck), with a small caption. It is a real photo, cropped on the stair.
- **Content:** label, H2, one paragraph and a text link to `/about/`. The About page is still a placeholder.
- **Copy (proposed, needs brand approval):**
  - TH: เกี่ยวกับ Clay & Stone / บ้านที่ออกแบบด้วยความเข้าใจในการอยู่อาศัย / Clay & Stone ออกแบบและสร้างบ้านโมดูลาร์ที่ผสานความสวยงาม การใช้งาน และความทนทาน… / รู้จัก Clay & Stone ↗
  - EN: About Clay & Stone / Homes designed with an understanding of how people live / … / Get to know Clay & Stone ↗
- **Removed from this section:** the long brand positioning and description (they belong on the About page), the key-figures row and the three principles.
  - The timeline figures (60–90 days, ~15 days) still appear in the process section.
  - The 5-year structural warranty and 200 km free installation are no longer on the homepage. They are still pending confirmation and can return beside the contact or process sections once confirmed.
- **Thai line breaks:** the headline breaks only between phrases. In the paragraph, "หลากหลาย" and "อยู่อาศัย" are kept unbroken.

