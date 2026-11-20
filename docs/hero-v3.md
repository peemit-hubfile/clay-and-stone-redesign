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

## 5. Discover Our Homes

- The three models that have real completed-home photography: Standard (wide 4:3), Loft (tall 4:5, offset down) and 1 Bed 2 Bath (16:9 panorama).
- Each item shows the series, model name, usable area and rooms, plus an arrow. The whole card links to the model page.
- A short note names the other two homes (Unwind 2 Bed 2 Bath and Alive, which have renders only) and links to "View all 5 homes" (`/homes`), where prices, plans and pending badges live.
- Prices are no longer shown on the homepage. They are on `/homes` and the model pages.

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
