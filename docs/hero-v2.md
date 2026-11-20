# Homepage Hero v2: Architectural Editorial Split (superseded by [hero-v3.md](hero-v3.md))

Scope: the homepage hero and the site header/mobile menu only. Other sections are unchanged, except that the hero's key facts moved into the intro section and the intro eyebrow changed so it no longer repeats the hero.

## 1. Problems with v1

| Problem | Effect |
|---|---|
| Full-bleed photo under a heavy dark gradient | The house was the backdrop, not the subject. A third of the frame was darkened. |
| Photo with a utility pole and overhead wires | The first thing seen was infrastructure, not architecture. |
| Thai H1 at 76px on three lines with "…" | It overpowered the building and broke mid-phrase. |
| Eight competing elements: eyebrow, H1, lead, price, pending badge, two pill CTAs, three facts | No clear first read, and a "template landing page" feel. |
| Transparent header with a white pill CTA over the photo | Low contrast and generic. |
| Mobile used a different photo (bathroom, fixed in v1) and the same overlay | No mobile-specific composition. |

## 2. Compositions considered

**A. Editorial split (selected).** Text sits on paper in a 5/12 column aligned to the page grid. The photo is a 7/12 panel that bleeds to the right edge of the viewport and starts directly under the header. There is no overlay. A caption under the photo names the home and links to it.

**B. Framed plate.** A full-width inset photograph, like a printed plate, with the headline set below it in a two-column editorial band.

| Criterion | A: Split | B: Plate |
|---|---|---|
| Brand fit (architecture as subject) | Strong. The whole house is visible and uncovered. | Strongest image presence |
| Headline readability | Ink on paper, no overlay | Ink on paper |
| Conversion (CTA above the fold at 1366–1440 × 768–900) | Yes | No. The headline and CTA fall below the image. |
| Mobile | Photo then text, CTA above the fold at 390 × 844 | Same |

A was chosen for desktop and mobile. **Tablet borrows B's plate idea:** a wide 16:9 photo, then the headline on the left and the lead and CTA on the right. Tablet is therefore designed for its own width, not a squeezed desktop.

## 3. Photography

- **Image:** `projects/…_1bed-2bath-13.webp`, a **completed** Unwind 1 Bed 2 Bath home (real photo, not a render). It shows the upswept timber gable, deep eaves, full-height glazing, a raised deck and clear sky, with **no poles or wires**. It is not retouched.
- The crop (`object-position: 58% 45%`) keeps the gable and glazing at every breakpoint.
- The caption "Unwind Series 1 Bed 2 Bath · a completed home" labels the photo honestly and links to the model page.
- Rendered visualisations (Alive, Unwind 2 Bed 2 Bath) were not considered for the hero.

## 4. Copy status (needs client approval where marked)

| Element | TH | EN | Status |
|---|---|---|---|
| H1 | บ้านสำเร็จรูป / ที่ไม่เหมือนบ้านสำเร็จรูป | Homes beyond / prefab. | **Verified.** TH is brand tagline 1 with the "…" pause set as a line break. EN is the brand philosophy line (sentence case). The EN tagline wraps to five lines, so it is not used as the H1. |
| Eyebrow | Homes Beyond Prefab | Modular homes by Clay & Stone | TH: verified philosophy line. EN: **proposed** factual label. |
| Lead | บ้านโมดูลาร์ที่ออกแบบโดยสถาปนิก ชายคายื่นยาว ระเบียงกว้าง ใกล้ชิดธรรมชาติ ผลิตในโรงงาน และติดตั้งหน้างานในราว 15 วัน | Architect-designed modular homes with deep eaves, wide verandas and a quiet closeness to nature. Built in our factory, assembled on site in about 15 days. | **Proposed copy, needs client approval.** Every claim comes from the existing site: architects and engineers oversee design and build (brand strengths), extended eaves and wide verandas (strength 1), "Returning Nature to Living" (series concept), and about 15 days on site (verified timeline). |
| CTAs | ดูแบบบ้านทั้งหมด → /homes · คุยกับทีมงาน → #contact | Explore Our Homes · Talk to Our Team | Existing UI labels |
| Caption | บ้านที่ส่งมอบแล้ว | A completed home | Proposed; based on the gallery being completed-home photos |

## 5. What moved out of the hero

| Item | Now |
|---|---|
| "From 849,000 THB" + pending badge | Homes section (per series and per model, with pending badges) and the Our Homes page |
| About 15 days on site | Hero lead (verified) and a key-facts row in the intro section |
| 5-year structural warranty, free installation within 200 km | Key-facts row in the intro section, **with a "pending confirmation" badge**. The live site lists them as promotions, and their terms are open questions in `content-verification.md`. |

## 6. Typography

- Thai H1: IBM Plex Sans Thai **300**, `clamp(2rem → 3.5rem)`, line-height 1.32, two lines at every width. Lines break only between phrases (`.hero__phrase` is inline-block), so "บ้านสำเร็จรูป" never splits.
- EN H1: Manrope 300, `clamp(2.25rem → 4.25rem)`, line-height 1.06, tracking −0.03em.
- Lead: muted ink, max about 30rem; Thai at 16–18px with line-height 1.8.
- Eyebrow: Latin small caps with a 2rem hairline lead-in.

## 7. Navigation

- Paper header. The hairline appears only after scrolling, and there is no transparent-over-photo state.
- Desktop: a true three-column grid (wordmark · centred nav · actions). Nav links are 400 weight and muted, turning to ink on hover or current with a 1px underline.
- Language: "TH / EN". The current language is text; the other is a link, with a full language name for screen readers.
- CTA: `btn--line btn--rect`, a hairline outline with near-square corners that fills on hover. It replaces the pill.
- Mobile: a "เมนู" text label with a two-line mark (no icon-only button). The menu is a numbered index (01–08) with LINE, phone and TH/EN at the foot. Links enter with a staggered 35ms fade-rise.

## 8. Motion

CSS only for the hero, so nothing is hidden at first paint and LCP is not delayed:
- Photo frame: clip-path settles from a 3–5% inset over 1.3s. The image settles from scale 1.06 over 1.8s.
- Text: eyebrow, then lines, lead and actions fade-rise 14px, staggered over about 0.5s.
- GSAP is still used only for scroll reveals in lower sections. All motion is off for `prefers-reduced-motion`.

## 9. Results (local)

| Check | Result |
|---|---|
| Smoke QA (32 routes × 2 viewports) | 0 failures |
| Lab LCP, mobile "4G" TH (median of 3) | **1.83s** (was 2.68s) |
| Lab LCP, mobile "4G" EN | 1.87s (was 2.12s) |
| Lab LCP, desktop TH / EN | 0.48s / 0.43s |
| CLS | 0 |
| Mobile 390 × 844 | Thai H1 on 2 lines at 32px; primary CTA visible without scrolling; no horizontal overflow |

These are lab numbers on an emulated network, not field Core Web Vitals.

## 10. Webflow notes

- Hero: a two-column grid section. The image cell uses `object-fit: cover` and a bleed achieved by a grid track of `max(gutter, (100% − container) / 2)`, or by an absolutely positioned image wrapper in Webflow.
- The `.btn--rect` / `.btn--line` variants map to a Webflow button combo class.
- Proposed: apply `--radius-xs` to all buttons site-wide, so the rest of the site matches the new architectural button shape. This is not done yet because it is outside this task's scope.
