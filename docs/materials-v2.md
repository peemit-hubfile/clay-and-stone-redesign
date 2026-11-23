# Materials & Craftsmanship v2 (superseded by [materials-v3.md](materials-v3.md))

This redesigns the homepage section "วัสดุที่เลือกมาเพื่ออยู่ได้นาน" (`.why`), replacing the dense 3-column grid with an editorial materials explorer.

## 1. Structure

- **Heading (proposed, needs brand approval):** "ใส่ใจตั้งแต่โครงสร้าง ถึงรายละเอียดการอยู่อาศัย" / "Care from the structure to the details of living".
- **Lead (proposed):** "ทำความรู้จักวัสดุและองค์ประกอบสำคัญของบ้าน Clay & Stone" / "Get to know the materials and key elements of a Clay & Stone home."
- **Desktop:** a featured photograph (7/12 columns, 4:3, stays in view while you scroll) beside a single-open accordion of the six categories.
- **Tablet and mobile:** a full-width featured photograph, then the accordion.
- **Each category has three levels:**
  1. **Name:** a Thai label, with the original English category name beside it (EN pages show the English name only).
  2. **Benefit:** one sentence (`MATERIAL_COPY` in `src/pages/home.js`). It is proposed copy and restates only what the source sentence says.
  3. **Technical details:** a `<details>` disclosure holding the original specification text from `src/data/seed/materials.json`, unchanged.

## 2. Interaction and accessibility

- **Accordion:** `<h3><button aria-expanded aria-controls>` with a `role="region"` panel. ↑ ↓ Home End move between headings. Clicking the open category collapses it.
- **Photos:** opening a category cross-fades the featured photograph (0.5s, off for reduced motion). Only the first photograph is in the DOM at load; the others are revealed, and so downloaded, on hover, focus or opening.
- **No JavaScript:** every panel is visible (`.no-js` rule), so all specification text stays crawlable and readable.
- **Badges:** the public "รอยืนยัน" badges are removed. Verification status is tracked in the table below.

## 3. Tests (local, headless Chrome)

- **Coverage:** TH 1440, EN 1440, TH 820 and TH 390, all passing.
- **Checked:**
  - all six categories are present
  - every specification matches `materials.json` verbatim
  - no public badges
  - only one photo is in the DOM at load
  - a click opens one category and switches the photo
  - ArrowDown + Enter opens the next category; Enter on the open one collapses it; End jumps to the last
  - technical details expand
  - no horizontal overflow at the real viewport width
  - no page errors
- **No-JS:** all 6 panels visible.

## 4. Verification status (internal, not shown publicly)

| Category | Status | Issue |
|---|---|---|
| Structural System | **Pending confirmation** | TH mentions RUST GUARD (Epoxy) and "วิศวกรระดับสามัญ", which the EN text omits. The site's detail panel says "from 2.3 mm" (ตั้งแต่) where the card says "over 2.3 mm". The EN detail panel adds a "GLIPTECH system with a two-layer topcoat". The benefit line avoids all of these. |
| Roof Materials | **Pending confirmation** | The "1.35× stronger than typical" and "quieter than typical roofs" comparisons have no stated basis. The benefit line does not repeat them. |
| Flooring, Walls, Terrace, Door & Window | Consistent on the live site | — |
| All six | Pending | Applied to the Alive Series only because the live Alive page reuses the Unwind block. |

## 5. Photography gaps

- **Source:** all six images are the live site's own "construction → finished" composites (`/images/source/unwind/unwind-img-01…06`, 1104 × 621).
- **Structural System:** the image is part photograph, part line drawing. A real close-up of the steel frame would be stronger.
- **Roof Materials:** the image is a whole-house view, not a close-up of the roof construction. This needs a photo from the client.
- **Resolution:** the images max out at 1104px wide, a little soft at 7/12 columns on retina screens. Higher-resolution originals are needed.
