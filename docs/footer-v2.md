# Footer v2

The client found the site footer (`.site-footer`, every page) plain. v1 had four text columns of equal weight (logo and tagline, address, contact, menu) and a bottom row (social, prototype notice, ©). It worked, but it had no presence and no useful shortcuts.

## 1. Structure

| Row | Content |
|---|---|
| Statement | The brand tagline in large light type, on two lines: "บ้านสำเร็จรูป… / ที่ไม่เหมือนบ้านสำเร็จรูป" (verified, `settings.brand.taglines[0]`). On the right, "กลับขึ้นด้านบน ↑" (`#top`, the browser's built-in jump to the top). |
| Columns | **แบบบ้าน**: all 5 models (series muted + model name) and "ดูแบบบ้านทั้งหมด →" · **เมนู**: site sections + contact · **ติดต่อเรา**: LINE, phone, email with icons · **สำนักงานและโชว์รูม**: address, "เข้าชมโดยนัดหมายล่วงหน้า", "ดูเส้นทางใน Google Maps" |
| Wordmark | "CLAY & stone" across the full width in 9% paper on the dark background. Decorative (`aria-hidden`); it sizes with the viewport and never overflows. |
| Bottom | Social icons, the prototype notice, © Clay & Stone (unchanged) |

**Directions link**
- Built from `settings.contact.showroom.geo`: `google.com/maps/search/?api=1&query=lat,lng`.
- Opens in a new tab, with a visually hidden "(เปิดในแท็บใหม่)".
- The pin is approximate (from the live contact page's embed), as `settings.json` notes.

**Columns by width**
- 4 on desktop, 2 on tablet, 1 below 480px.
- Link rows are at least 36px tall (directions and back to top are 44px).

## 2. Content status

- **Verified:** tagline, address, appointment note, LINE, phone, email, social links and model names.
- **Proposed** (needs brand approval): "เมนู / Explore", "ดูแบบบ้านทั้งหมด", "ดูเส้นทางใน Google Maps", "กลับขึ้นด้านบน".
- **Removed from the footer:** the small logo. The wordmark row replaces it.

## 3. Tests

`node tests/footer-check.mjs` runs on the homepage (TH/EN 1440, TH 820, TH 390) and on `/en/homes/` at 390. It checks:
- 5 model links + "all homes", all returning 200
- tel/mailto/LINE links
- the Google Maps link opens in a new tab
- the wordmark is decorative and fits
- back to top returns to the top
- no overflow and no page errors

Smoke QA (32 routes × 2 viewports): 0 failures.
