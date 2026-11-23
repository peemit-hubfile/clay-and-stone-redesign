# Header v2

The client asked for a more modern header. v1 was a quiet three-column bar: wordmark, five text links, TH/EN and an outlined "นัดปรึกษา" button. It always stayed on screen and gave no shortcut to the models.

## 1. What changed

| Part | v2 |
|---|---|
| Scroll | Always on screen (the client asked that it should not disappear). Past the top it compacts: the bar goes from 72px to 60px, the wordmark scales to 86%, and a hairline and soft shadow appear. A 2px ink line along the bottom edge shows reading progress. It is scroll-driven CSS: browsers without `animation-timeline` simply don't show it, and it is off with reduced motion. |
| Nav links | A 1px line draws in from the left on hover and stays under the current page. |
| "แบบบ้าน" | Opens a panel with all 5 models: photo, series, name, usable area and starting price. On the right: "ดูแบบบ้านทั้งหมด →", "เปรียบเทียบแบบบ้าน", "ค้นหาบ้านที่ใช่". |
| CTA | "นัดปรึกษา →" is now solid charcoal, the one filled control in the bar. |
| Mobile | Unchanged: the "เมนู" button opens the full-screen dialog. It compacts the same way. |

## 2. Homes panel

- **Desktop only** (≥ 64em).
  - Opens on click, on mouse hover (120ms delay; closes 220ms after leaving) or with ArrowDown, which moves focus into the panel.
  - Closes on Escape (focus returns to "แบบบ้าน"), on a click on the dimmed page, or when focus leaves the header.
- **Markup:** "แบบบ้าน" stays a link to `/homes/`. JS adds `role="button"` and `aria-expanded`, so without JS, and on small screens, it simply navigates.
- **Photos:** real photographs for Standard and Loft (the covers are tight crops). The two 2 Bed 2 Bath models have only renders, so they carry the "ภาพจำลอง" label.
- **Scrim:** moved to `<body>` by JS, because the header's `backdrop-filter` would contain a fixed child.

## 3. Sticky elements

`--header-offset` equals `--header-h` at the top, or `--header-h-compact` (3.75rem) once `html.header-compact` is set. The Why tabs (mobile) and the Finder intro (desktop) use it, so they sit right under the header.

An earlier version hid the header on scroll down; that was removed at the client's request.

## 4. Content status

- **Verified:** model names, areas and prices come from the seed. Prices still carry their pending-confirmation status on the model pages.
- **Reused labels:** "ดูแบบบ้านทั้งหมด", "เปรียบเทียบแบบบ้าน" and "ค้นหาบ้านที่ใช่" reuse existing labels. No new copy was added.

## 5. Tests

`node tests/header-check.mjs` runs on TH/EN 1440, TH 820 and TH 390. It checks:
- The panel opens on click and with ArrowDown.
- The panel lists 5 models, and every link in it returns 200.
- Escape closes the panel and returns focus to the toggle; a scrim click also closes it.
- On small screens there is no panel, and the menu dialog opens.
- The header stays on screen, compacts, and its progress line grows.
- The sticky tabs sit right under the header.
- No overflow and no page errors.

Smoke QA (32 routes × 2 viewports): 0 failures.

## Mobile menu v2, mobile footer and mobile hero

- **Mobile menu:** compact top bar (wordmark, TH/EN, round close button), the models as a swipeable row of photo cards, two shortcut tiles (compare, Home Finder), the other pages as a short list, and LINE + phone pinned to the bottom. Opens with a fade, the cards slide in one after another and the rest rises; closes with a short fade (`.is-closing`, `main.js`; Escape too). Off with reduced motion.
- **Footer below 48em:** contact first as a card of large tap rows, the showroom as a compact card, homes as wrapping pills, the menu in two columns.
- **Hero below 48em:** the photo fills the screen under the header; the headline sits on it in white over a deep bottom shade (checked by `tests/a11y-overlay.mjs`) and the house name is a glass chip in the top corner.
