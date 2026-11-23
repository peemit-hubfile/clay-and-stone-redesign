# WCAG 2.2 AA audit

**Scope:** all 32 routes (TH + EN) of the prototype, at desktop 1440 and mobile 390. Open states are checked too: the Homes panel, the mobile menu and Home Finder results.

**Result:** no known failures against WCAG 2.2 Level AA after the fixes below.

Automated tools find only part of WCAG, so the criteria they can't decide were checked with purpose-built scripts and by eye. Before launch, the site should still be tested with a screen reader (NVDA + Chrome, VoiceOver + Safari).

## 1. How it is tested

| Script | What it checks |
|---|---|
| `node tests/a11y-check.mjs` | axe-core 4.10 with the `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` and `wcag22aa` rules. It runs on every route at both widths with motion on, after the reveals have finished, and also with the Homes panel open, the mobile menu open and the Finder answered. It lists the text that axe could not decide. |
| `node tests/a11y-overlay.mjs` | Contrast of text over photos and gradients, which axe cannot measure. It hides the text, screenshots what is behind it, and compares the text colour with the 10th-percentile background. |
| `node tests/a11y-manual.mjs` | Criteria axe doesn't cover, on every route and width: 2.5.8 target size, 2.1.1/2.1.2 keyboard reach and no trap, 2.4.7 focus visible, 2.4.11 focus not obscured by the fixed header, 2.2.2 no autoplay, 1.4.12 text spacing, and 1.4.10 reflow at 320px. |

## 2. Issues found and fixed

| Criterion | Issue | Fix |
|---|---|---|
| 1.4.3 Contrast | Unread Brand Vision phrases were light grey `#bfbebd` (1.85:1). | Now `#8a8887`: 3.5:1, which meets the 3:1 threshold for large text. The statement is at least 26px. The scroll reveal still reads as the grey darkening to ink. |
| 1.4.3 Contrast | axe measured the decorative footer wordmark "CLAY & stone" at 1.29:1. | The criterion exempts logotypes and pure decoration. The wordmark is now drawn with CSS generated content and stays `aria-hidden`, so it is no longer measured as text. |
| 1.4.3 Contrast | The hero caption (white text on the photo) relied on a soft shade. | It now sits on a dark glass chip (66% charcoal), at least 4.8:1 over any part of the photo. |
| 1.4.11 Non-text contrast | Control outlines were too faint to identify a control: the Finder radio circles, the sort `<select>` and the filter chips (28% charcoal, about 1.7:1). | They use a new token, `--color-control: #8a8887` (3.5:1). |
| 2.5.8 Target size | The breadcrumb "Clay & Stone" link and the model links under owner quotes were 18–23px tall. | Both are now at least 24px tall. |

## 3. Passing, checked by script or by eye

- **1.1.1 Non-text content:** every content image has alt text. Decorative ones (card photos next to their names, the gable outline, icons) have empty alt or `aria-hidden`.
- **1.3.1 Info and relationships:**
  - Landmarks (header, nav, main, footer) are in place.
  - Headings are in order.
  - Specs use `<dl>`.
  - The Homes panel groups models under a series heading.
- **1.4.4, 1.4.10, 1.4.12 Resize, reflow and text spacing:** no horizontal scroll at 320px or with the WCAG text-spacing overrides. The only wide element is the compare table, which scrolls inside its own region; two-dimensional tables are exempt.
- **1.4.13 Content on hover or focus:** the Homes panel can be dismissed (Escape, click outside, focus leaving), the pointer can move into it, and it stays open until dismissed.
- **2.1.1, 2.1.2 Keyboard:**
  - Tab reaches every control, with no traps.
  - The Homes panel opens with Enter or ArrowDown.
  - The mobile menu is a native modal `<dialog>`.
  - Tabs in the Why section follow the WAI-ARIA pattern.
- **2.2.2 Pause, stop, hide:** there is no autoplay and nothing auto-advances. The hero and reveal animations run once and finish in under 2.5s.
- **2.3.1 Three flashes:** nothing flashes.
- **2.4.1 Bypass blocks:** a skip link is the first focusable element.
- **2.4.7, 2.4.11 Focus visible and not obscured:** a 3px `#2f5bd3` focus ring with offset. `scroll-padding-top` keeps focused elements clear of the fixed header (and its compact state).
- **2.5.7 Dragging:** the homes rail has previous/next buttons, so dragging is never the only way.
- **2.5.8 Target size:** every control is at least 24×24 px. Most are 44px.
- **3.1.1, 3.1.2 Language:** `lang="th"` or `lang="en"` on each page, and the language links carry `hreflang`/`lang`.
- **3.2.3, 3.2.6 Consistent navigation and help:** the header ("นัดปรึกษา") and the footer contact column are in the same place on every page.
- **3.3.7, 3.3.8 Redundant entry and accessible authentication:** not applicable; there are no logins and no multi-step data entry.
- **4.1.2 Name, role, value:**
  - Toggles expose `aria-expanded` or `aria-pressed`.
  - The panel toggle gets `role="button"` once JS takes it over.
  - Live regions announce Finder results and showcase notices.

## 4. Motion

`prefers-reduced-motion: reduce` turns off the following and shows final states instead:
- the hero settle
- reveals
- the Brand Vision fill and gable rise
- parallax
- the header progress line
- the panel animation

This is beyond AA (2.3.3 is AAA), but it is in place.

## 5. Known limits

- The audit uses Chrome only. Safari and Firefox still need a manual pass with VoiceOver and NVDA.
- The prototype's forms (contact) are demo-only. When they send data for real, re-check 3.3.1–3.3.4 error handling.
- Content still to be supplied (videos, more photos) must come with captions and alt text.
