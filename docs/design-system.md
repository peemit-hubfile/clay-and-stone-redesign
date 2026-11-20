# Design System: Clay & Stone Prototype (v0.1)

**Direction:** modern architectural editorial. The photography carries the story; the interface stays quiet, warm and precise. Source of truth: [`src/styles/tokens.css`](../src/styles/tokens.css).

## 1. Principles

1. **Photography first.** Real Clay & Stone homes lead every page. The UI recedes, so there are no decorative illustrations, gradients-as-decoration or glass effects.
2. **Calm, warm, exact.** Warm neutrals from stone, plaster and timber. Near-square corners echo the module grid. Numbers (sqm, THB, days) are typeset precisely.
3. **Facts before persuasion.** Prices, areas and timelines are visible early. Unconfirmed values carry a visible "pending" badge.
4. **Bilingual by design.** Thai is the default. Thai pages use a Thai typeface with taller line-height; nothing depends on English text length.
5. **Motion explains, never decorates.** Short reveals and state transitions only; everything is disabled for `prefers-reduced-motion`.

## 2. Colour

| Token | Value | Use | Contrast |
|---|---|---|---|
| `--c-paper` / `--color-bg` | `#f6f3ee` | Page background (warm off-white) | — |
| `--c-stone-100` / `--color-surface` | `#efeae2` | Alternating sections, hovers | — |
| `--c-stone-200` / `--color-surface-2` | `#e4ddd2` | Image placeholders, neutral badges | — |
| `--c-charcoal` / `--color-ink` | `#24211e` | Text, primary buttons | 14.5:1 on paper |
| `--c-grey-500` / `--color-ink-muted` | `#635c54` | Secondary text | 5.95 paper · 5.50 stone-100 · 4.88 stone-200 |
| `--c-olive` / `--color-accent` | `#575a40` | Eyebrows, icons, accents | 6.45:1 on paper |
| `--c-timber` / `--color-highlight` | `#8a5a34` | Timeline durations | 5.28:1 on paper |
| `--c-night` / `--color-inverse-bg` | `#1b1916` | Footer, Finder, overlays | paper text 15.9:1 |
| `--color-pending-bg` / `-ink` | `#f6e7c8` / `#6b4a10` | "Pending confirmation" badges | 6.58:1 |
| `--color-focus` | `#2f5bd3` | Focus ring only (3px, offset 3px) | 5.33:1 on paper |

All text pairings meet **WCAG 2.2 AA** (≥4.5:1 for body text), checked by calculation. The original site's grey palette (`#484848`, `#1f1d1e`, `#ededed`) was warmed toward the materials seen in the photography.

## 3. Typography

| | Latin | Thai |
|---|---|---|
| Typeface | **Manrope** (variable, self-hosted, OFL) | **IBM Plex Sans Thai** (self-hosted, OFL) |
| Weights | 300 display · 400 body · 500 UI · 600 labels | 300–600 |
| Line-height | 1.6 body · 1.12 headings | 1.75 body · 1.25 headings (Thai stacked marks need room) |

- Thai pages (`:lang(th)`) switch `--font-body` to Plex Sans Thai. Its own Latin glyphs render mixed text, so there is no font mixing inside a line.
- Display headings are light weight on EN and regular weight on TH, because thin Thai strokes lose legibility.
- **Why not the current font?** The live site uses Adobe Fonts *Aktiv Grotesk Thai* (kit `ght4vkk`), which is licensed per domain and will not load on a preview URL. Switching back is a token change (`--font-latin` / `--font-thai`) once the client adds the domain to the kit.

**Fluid scale** (`clamp()`, rem-based; max ≤ 2.5× min, so 200% zoom works):

| Token | Min → Max | Typical use |
|---|---|---|
| `--step--1` | 13 → 14px | Labels, meta, captions |
| `--step-0` | 16 → 17px | Body |
| `--step-1` | 18 → 20px | Lead text, card titles |
| `--step-2` | 22 → 26px | Sub-headings, prices |
| `--step-3` | 28 → 36px | Card/model titles |
| `--step-4` | 34 → 52px | Section titles |
| `--step-5` | 40 → 76px | Hero / page H1 |

## 4. Space, grid, breakpoints

- **Spacing:** 4px base, `--space-1`…`--space-10` = 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px. Sections use `--section-y` (64 → 136 px, fluid).
- **Container:** max 1408px; gutter `clamp(16px, …, 48px)`, so phones get a 16px gutter.
- **Grid:** CSS Grid with intrinsic columns (`repeat(auto-fill, minmax(19rem, 1fr))` for cards); editorial splits of 5/6, 4/7 and 2/1/1.
- **Breakpoints:** `48em` (768) tablet · `64em` (1024) desktop nav and two-column layouts · `90em` (1440) wide.

## 5. Shape, depth, iconography

- Radius: 2px (focus), **4px (images and cards)**, 8px (panels), pill (buttons, chips, badges).
- Shadows are used once (the overlapping intro image). Depth otherwise comes from photography and tone.
- Icons: Lucide paths inlined as SVG, 1.5px stroke, `currentColor`, decorative (`aria-hidden`) unless they are the only label.

## 6. Components and states

| Component | Variants | Default | Hover | Focus | Active | Disabled | Other |
|---|---|---|---|---|---|---|---|
| Button | primary, ghost, light, outline-light, sm | ✓ | tone shift | 3px blue ring | 1px press | 45% opacity, `not-allowed` | `aria-busy` → progress cursor |
| Chip (filter) | — | outline | stone fill | ring | `aria-pressed=true` ink fill | — | — |
| Link-arrow | — | underline | arrow nudges 3px | ring | — | — | — |
| Model card | — | image 4:3, specs, price | image scales 1.035 | ring on whole card | — | — | "Visualisation" overlay badge; "Price pending" badge |
| Option (radio) | Finder | outline | stone fill | ring (via `:has(:focus-visible)`) | checked: ink border + dot | — | — |
| FAQ item | `<details>` | closed | title turns olive | ring | chevron rotates | — | — |
| Badge | neutral, pending, pending-light, overlay | — | — | — | — | — | `title` explains why pending |
| Header | solid / transparent over hero | — | link underline grows | ring | `aria-current=page` underline | — | becomes solid on scroll |
| Mobile menu | native `<dialog>` | — | — | focus trapped by `showModal()` | — | — | Esc closes; focus returns to toggle |
| Finder | stepper → results | — | — | moves to the next question / results | — | Next disabled until answered | empty → "close matches" + consultation CTA |
| Form fields | (contact form, next iteration) | — | — | ring | — | — | error state via `:user-invalid` + `aria-invalid` |

## 7. Motion

| Pattern | Spec | Reduced motion |
|---|---|---|
| Hero | CSS: image settles from 1.06 scale over 1.8s; text rises 24px, staggered 80ms | Off (no animation) |
| Section reveal | GSAP ScrollTrigger batch: y 28 → 0, fade, 0.8s, once; only for elements below the fold on load | GSAP not loaded |
| UI transitions | 160ms (hover/press), 280ms (state), easing `cubic-bezier(.22,1,.36,1)` | Durations clamped to ~0 |

Content is never hidden by CSS; initial hidden states are set by JS, so the page is fully readable if scripts fail.

## 8. Webflow mapping

| Prototype | Webflow |
|---|---|
| `tokens.css` custom properties | **Variables** collection "Clay & Stone": Colour, Typography (sizes as `clamp()` strings), Spacing, Radius |
| `:lang(th)` token overrides | Locale-specific Variable modes, or a Thai-locale class on `<body>` |
| `.btn`, `.chip`, `.badge`, `.model-card`… | **Components** with the same class names (BEM-ish, no utility soup) |
| `<details>` FAQ | Native Webflow "Dropdown"-free markup via an Embed, or a Collection List of FAQ items rendering `<details>` |
| CSS hero animation | Page-load interaction, or keep as custom CSS in the site head |
| GSAP ScrollTrigger reveal | Webflow GSAP interactions (scroll into view, once) |
