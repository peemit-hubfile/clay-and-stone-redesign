# Content Inventory

**Stage 1 · Discovery** · Extracted 20 Nov 2026

This is a map of **what content exists, where it lives on the live site, and where the structured copy now sits** in this repo. Verbatim text for every page (TH and EN) is archived in [`source-archive/text/`](source-archive/text/). Structured, source-tagged data is in [`/src/data`](../src/data).

| Data file | Contents |
|---|---|
| [`products.json`](../src/data/products.json) | 3 series, 5 models, prices (with conflicts), areas, materials, timeline, inclusions, promotions |
| [`projects.json`](../src/data/projects.json) | 5 model galleries (57 photos + 5 floor plans), locations mentioned on the site |
| [`faq.json`](../src/data/faq.json) | 22 FAQ entries × TH/EN with source URLs and inline links |
| [`navigation.json`](../src/data/navigation.json) | Current header/footer/CTA, plus the proposed IA draft |
| [`site-content.json`](../src/data/site-content.json) | Brand, contact, homepage, about, team, testimonials, process, videos, blog index, current SEO metadata for all 32 URLs |
| [`../docs/asset-manifest.json`](asset-manifest.json) | 177 images, 3 videos, 7 YouTube embeds |

Verification status uses the legend in [content-verification.md](content-verification.md).

---

## 1. Brand and positioning

| Item | Content (EN / TH) | Source | Status |
|---|---|---|---|
| Brand name | Clay & Stone (also "Clay and Stone", "CLAY & STONE") | all | ✓ |
| Positioning / vision | "We create thoughtfully designed modular homes that elevate modern living and make quality accessible for everyone in Thailand." / "เรามุ่งมั่นสร้างสรรค์ “บ้านสำเร็จรูป”…" | `/en`, `/th` H1 | ✓ |
| Philosophy | "Homes Beyond Prefab" | `/projects`, home | ✓ |
| Taglines | "A prefabricated home… unlike any other prefabricated home." · "Precisely right, perfectly aligned in every detail." · "Peace of mind… that lasts beyond delivery." (TH equivalents) | home | ✓ |
| Differentiators | Extended roof overhangs, spacious verandas, design for Thai climate and lifestyle; architect- and engineer-supervised; direct after-sales | home Key Strengths | ✓ (qualitative) |
| Brand story / history | **Not available.** No founding year, origin story or milestones. | — | ⚪ Gap |
| Mission vs vision | Only the "Brand Vision" sentence | — | ⚪ |
| Logo files | Not extracted as standalone files | — | ⚪ Request SVG |

## 2. Company and team

| Item | Content | Source |
|---|---|---|
| About statement | "Founded by a professional team of architects, engineers, and construction specialists…" (TH version also present) | `/about-us` |
| What we do (4 points) | Standardised modular design → factory manufacture → one complete delivery → on-site assembly | `/about-us` |
| Team (3) | **Panita Rojanakansakun**, Design Director / Architect (Chula special lecturer; MSc Advanced Sustainable Design, Edinburgh; 15+ yrs) · **Pornthep Rojanakansakun**, Founder / Architect (MRE Thammasat; 15+ yrs) · **Apisit Sirikhwanwiwat**, Construction Director / Architect (B.Arch Silpakorn; 15+ yrs) | `/about-us` (Thai text on both languages) |
| Testimonials (6) | 2 short English reviews (no model) + 4 named customers with model and location (1B2B Suphanburi, Loft Suphanburi, Standard Saraburi, Standard Bangkok) | `/about-us` |
| Office and showroom | 152/1 Soi Tiwanon 45, Ta Sai, Mueang Nonthaburi, Nonthaburi 11000 (TH address also extracted) | footer, contact |

## 3. Products and house models

| Series | Status | Models | Price range (incl. VAT) | Usable area |
|---|---|---|---|---|
| **Unwind Series** ("Slow Living, Quiet Moments") | Live | Standard Type · Loft Type · 1 Bed 2 Bath · 2 Bed 2 Bath | 849k–2.69M (cards) **or** 830k–2.66M (FAQ) 🔴 | 43.5 · 47 · 82 · 123 sqm |
| **Alive Series** ("Compact living, expanded experiences") | Live | 2 Bed 2 Bath | 1.69M | 68 sqm |
| **Humble Series** | Coming soon | — | — | — |

Per model, the following is available: name, price, total usable area, interior/terrace split, a floor-plan image with dimensions, a short description (except Alive), and a photo gallery. **Not available as text:** bedroom count for Loft and Standard, storeys (derived from the projects text), footprint dimensions, ceiling height, minimum plot size, occupancy and energy data.

Shared product content:
- **Module system**: main module 3 × 6 m; relocatable; expandable. There are 6 function presets per series and 6 module combinations per series (named presets with images).
- **Materials (6 categories)**: Structural System · Flooring System · Wall Materials · Outdoor Terrace · Door & Window · Roof Materials, with brand names (SCG Smart Board, SCG SPC Click Lock, BEGER GLIPTECH, CONWOOD/SHERA, WPC, TIS steel).
- **Promotions / terms**: free interior wallpaper · free installation within 200 km · warranty 1 yr general / 5 yr structural + after-sales.
- **Included**: structure, walls, roof, floor, internal electrical, plumbing. **Customer prepares**: foundation, external utilities.
- **Foundation**: local contractor using C&S specs, or coordinated by C&S; precast footing system (blogs, EP.7); elevated option for low-lying land.
- **Site access**: crane or truck access required; engineering site assessment.
- **Timeline**: design → contract + initial payment → factory 60–90 days → delivery at ~70% → ~15 days on site.

## 4. Projects and portfolio

| Gallery | Floor plan | Photos | Locations referenced on the site |
|---|---|---:|---|
| Unwind Standard Type | ✓ | 15 | Nonthaburi (home card), Saraburi, Bangkok (testimonials) |
| Unwind Loft Type | ✓ | 14 | Prachinburi (home card), Suphanburi (testimonial) |
| Unwind 1 Bed 2 Bath | ✓ | 16 | Suphanburi (home card + testimonial) |
| Unwind 2 Bed 2 Bath | ✓ | 5 | — |
| Alive 2 Bed 2 Bath | ✓ | 7 | — |

There are no project names, dates or case studies. Photos are not tagged to locations.

## 5. Process content

| Step | EN title | TH title |
|---|---|---|
| 01 | Begin a Design Tailored to Your Needs | เริ่มงานออกแบบให้ตรงใจ |
| 02 | Sign the Contract and Begin Production | เซ็นสัญญาและเริ่มผลิต |
| 03 | Module Delivery to the Site | ขนส่งโมดูลถึงพื้นที่ |
| 04 | On-Site Assembly and Home Handover | ประกอบและส่งมอบบ้าน |

There is no separate manufacturing-process or installation-process content beyond this page, the FAQs and EP.5/EP.7 videos. The site has **no factory imagery**; process images are 453 px.

## 6. FAQs (22 entries; 17 usable)

| Location | Count | Topics |
|---|---:|---|
| Home | 5 | What is prefab · vs conventional · strength · designs offered · after-sales/warranty |
| Unwind | 5 | Why Unwind · prices/types · small-family pick · any land / relocation · timeline |
| Alive | 5 | 🔴 Copy of the Unwind FAQ, so excluded |
| Projects | 7 | Durability · waterproofing · land types · "move-in ready" · site survey/foundation · customisation · showroom |

Unanswered high-intent questions: total budget including foundation, permits, minimum plot size, financing/mortgage eligibility, payment schedule, delivery outside 200 km, maintenance plan, land-title or zoning requirements, rental/resort ROI (investors).

## 7. Educational content

**7 videos** (Good to Know): EP.1 Modular House · EP.2 Prefab vs Traditional · EP.3 Strength · EP.4 Water Leak Prevention · EP.5 Module to Complete Home · EP.6 Unwind 1B2B tour · EP.7 Precast Footing System.

**5 blog articles** (all by Panita Rojanakansakun):

| Date | Slug | Topic | Quality note |
|---|---|---|---|
| 2026-07-07 | prefab-homes-lifespan | Lifespan, maintenance, 5 questions to ask a builder | Good; contains unverified "20+ years" / "30–50 years" |
| 2026-06-17 | modular-house-rainy-season-problems | Climate design, waterproofing, rust, foundations | Good |
| 2026-06-17 | modular-house-price | Budget by size, cost factors, 20–30% extra | Excellent for AEO; uses the older price set |
| 2026-06-16 | modular-vs-knockdown-house | Definitions and comparison | Excellent for AEO |
| 2023-10-10 | knockdown-house-ideas | 4 resort ideas (Unwind) | EN is machine-translated; Thai meta on the EN page |

## 8. Contact and CTA inventory

| Channel | Value | Link |
|---|---|---|
| Phone | 086-3822116 | `tel:+66863822116` |
| Email | clay.panitar@gmail.com | `mailto:` |
| LINE OA | @claystone | `https://lin.ee/5oKztUS` |
| Facebook | ClayxStone | `https://web.facebook.com/ClayxStone/` |
| Instagram | clay_andstone | `https://www.instagram.com/clay_andstone/` |
| Linktree | clayandstone.official | used by every "Contact" / "Book Consultation" button |
| Map | Google Maps embed, "Clay and Stone Co., Ltd" | contact page |

| CTA label (TH / EN) | Destination | Count |
|---|---|---|
| สอบถามข้อมูล / Book Consultation | Linktree | header (every page) |
| ติดต่อเรา / Contact Us | Linktree | contact block (every page) |
| ดูเพิ่มเติม / Explore More | About / Projects | home |
| Inline text links | process, unwind, projects, contact, YouTube | body copy |

There is no "View price", "Compare", "Book showroom visit", "Download brochure" or "Get quote" CTA.

## 9. SEO metadata

The current title, meta description, OG data, H1 and hreflang for all 32 URLs are stored in `site-content.json → seo_current`. Analysis is in [seo-audit.md](seo-audit.md).

## 10. Images and video

177 images (145 site assets, 28 CMS/blog, 4 Webflow UI) + 3 hero video files + 7 YouTube embeds. Inventory and quality analysis are in [asset-inventory.md](asset-inventory.md).
