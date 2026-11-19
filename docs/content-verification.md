# Content Verification Report

**Stage 1 · Discovery** · Extracted 20 Nov 2026 from `https://www.clayandstone.co.th` (32 URLs, TH + EN)

This report lists every place where the live site gives **conflicting, incomplete, or unverifiable** information. Under the project rules, the prototype **keeps the original values** and labels them until the client confirms. Nothing here has been corrected.

Status legend: 🔴 **Blocker**: must be resolved before the prototype shows it as fact. 🟠 **Conflict**: two published values disagree. 🟡 **Unverified claim**: a marketing claim with no evidence on the site. ⚪ **Gap**: information users need but the site does not provide.

---

## 1. Prices (🔴 Blocker)

Two price sets are published at the same time for the Unwind Series. Both say "incl. VAT".

| Model | Price card (TH + EN) | Intro text, FAQ and blog posts | Difference |
|---|---:|---:|---:|
| Unwind Standard Type | **849,000** | **830,000** ("starting at just 830,000") | 19,000 |
| Unwind Loft Type | **1,210,000** | **1,190,000** | 20,000 |
| Unwind 1 Bed 2 Bath | **1,690,000** | **1,660,000** | 30,000 |
| Unwind 2 Bed 2 Bath | **2,690,000** | **2,660,000** | 30,000 |
| Alive 2 Bed 2 Bath | 1,690,000 | 1,690,000 | — |

Sources:
- Price cards: `/en/products/unwind-series` and `/th/products/unwind-series` ("Unwind Series Modular House Prices" section).
- Lower set: the same pages' intro line and FAQ 2, `/en/blogs/modular-house-price`, `/en/blogs/knockdown-house-ideas` ("THB 830,000 – THB 2,660,000").

**Likely cause:** the price cards were updated but the FAQ and articles were not. This is unconfirmed.
**Question for client:** Which set is current? Are prices fixed or "starting from"? Is there a validity date?
**Prototype handling:** `products.json` stores both values with `status: "conflict"`. The Home Finder will use a price band, not an exact price, until this is confirmed.

Also note that Unwind 1 Bed 2 Bath (82 sqm) and Alive 2 Bed 2 Bath (68 sqm) carry the **same card price, 1,690,000**. That may be correct, but it will look odd side by side in a comparison table. Please confirm.

## 2. Areas and dimensions (🟠 Conflict)

| Item | Published | Issue |
|---|---|---|
| Standard Type area breakdown | 43.5 sqm = interior + toilet **23** + terrace **21** | 23 + 21 = 44, not 43.5. The module diagram shows 18 + 4.5 = **22.5** sqm interior, so 23 is probably rounded. |
| Standard Type terrace | **21 sqm** on the price card; module diagram shows 11.5 + 9.5 = 21 | The Unwind size diagram (`unwind-img-09`) labels "Total terrace area **23 sqm**". |
| Loft Type | 26 + 15.5 + 5.5 = 47 ✓ | Bedroom count is not stated. The TH projects intro calls 2-storey homes suited to "large families" (ครอบครัวใหญ่), but the Loft is 47 sqm. |
| 1 Bed 2 Bath | 45.5 + 36.5 = 82 ✓ | — |
| 2 Bed 2 Bath (Unwind) | 72 + 51 = 123 ✓ | — |
| Alive 2 Bed 2 Bath | 45 + 23 = 68 ✓ | — |

The site has no text dimensions such as footprint (W × L), ceiling height or minimum plot size. Dimensions only appear inside floor-plan images. Any footprint in `products.json` is marked `derived` and needs confirmation.

## 3. Alive Series page content errors (🔴 Blocker)

| Issue | Where |
|---|---|
| The **EN page shows Thai copy**: the H1, the intro paragraph and the Materials intro are the Unwind Thai text. | `/en/products/alive-series` |
| Both pages carry **two H1s**: "Returning Nature to Living" (copied from Unwind) and a Thai Unwind headline. | `/en` + `/th/products/alive-series` |
| The **FAQ on the Alive pages is the Unwind FAQ**, in Thai, on both languages. It discusses Unwind prices and models. | `/en` + `/th/products/alive-series` |
| The Materials text says "every material in the **Unwind** Series". It is unclear whether Alive uses the same specification. | `/th/products/alive-series` |
| The "customisable home" paragraph says "บ้านระบบโมดูลาร์ของ **Unwind** Series". | `/th/products/alive-series` |

**Prototype handling:** Alive FAQ entries are kept in `faq.json` with `verification_status: "source-error"` and will **not** be shown. Alive will display only the confirmed facts: name, tagline, values, 2 Bed 2 Bath, 68 sqm, 1.69M.

## 4. Material and specification wording (🟠 Conflict between TH and EN)

| Spec | EN | TH |
|---|---|---|
| Steel thickness | "**over** 2.3 mm" | "หนา**มากกว่า** 2.3 มม." (tab) / "หนา**ตั้งแต่** 2.3 มม." (= from 2.3 mm, detail panel) |
| Anti-corrosion system | BEGER, GLIPTECH + two-layer topcoat | BEGER GLIPTECH **and RUST GUARD (Epoxy)** at sun/rain-exposed points (tab), or GLIPTECH + 2-layer topcoat (panel) |
| Engineer licence level | "licensed architects and engineers" | "สถาปนิกและวิศวกร**ระดับสามัญ**" (a specific Thai licence grade) |
| Roof | 0.4 mm metal sheet + 1" PU | adds "**1.35×** stronger than typical" |
| Steel | "up to 1.4× thicker than typical specifications" | "หนากว่าทั่วไปถึง 1.4 เท่า" |

**Question for client:** Confirm the exact steel gauge range, the coating systems, the engineer licence level, and the basis for the "1.4×" and "1.35×" comparisons. These comparisons need a stated baseline before they are reused.

## 5. Process and timeline (🟡 / ⚪)

| Fact | Status |
|---|---|
| On-site assembly ≈ **15 days** | Consistent across home FAQ, process page and Unwind FAQ ✓ |
| Factory production **60–90 days**, "depending on the production queue" | Stated once (Unwind FAQ 5) |
| Delivery when production is **~70%** complete | Consistent ✓ |
| Total time from enquiry to move-in | ⚪ Not stated. Design time, permits and foundation time are missing. |
| Payment schedule | ⚪ Only "initial payment" is mentioned. |
| Building permit responsibility | ⚪ Not mentioned anywhere. |

## 6. What's included and excluded (⚪ Gap)

The site states what is **included**: structure, walls, roof, flooring, internal electrical and plumbing. It also states the **customer prepares** the foundation and external water and electricity connections (`/projects` FAQ 4).

Missing:
- Foundation cost, or whether the "precast footing system" mentioned in blog posts and EP.7 is a paid option
- Kitchen fit-out, sanitary ware, air-conditioning, built-in furniture (one blog post says interior design and built-in furniture "can be coordinated")
- Septic tank, meters, transport beyond 200 km
- What "200 km from our facility / จากบริษัท" is measured from: office or factory?

## 7. Company and people (🟡 / 🟠)

| Item | Issue |
|---|---|
| Panita Rojanakansakun | About page: "ผู้อำนวยการฝ่ายออกแบบ" (Design Director). Blog byline: "**Co-Founder** & Design Director". The About page lists only Pornthep as founder. |
| Team roles on EN page | Shown in Thai only. |
| Legal entity | Only the Google Maps label "Clay and Stone Co., Ltd". Registration number, founding year and factory address are not published. |
| Blog: "clients whose prefab homes were built for their parents' generation and are still standing strong over **20 years** later" | 🟡 This implies a 20+ year track record. It needs substantiation and may refer to the founders' earlier work. |
| Blog: steel lifespan "**30–50 years**" | 🟡 No source given. |
| "Our most popular model" (1 Bed 2 Bath) | 🟡 No data. |
| "เป็นบริษัทสร้างบ้านสำเร็จรูปชั้นนำ" (a leading prefab builder) | 🟡 Unsubstantiated superlative. |
| "100% cost control", "eliminates unexpected budget overruns" | 🟡 Absolute claims that conflict with the price blog's own advice to budget 20–30% extra. |
| "More consistently leak-resistant than traditional on-site construction" | 🟡 Comparative claim with no test data. |
| Warranty | 1 year workmanship / 5 years structural. Shown as a "promotion" item, so it is unclear whether it is standard or time-limited. |

## 8. Projects and testimonials (🟡)

- The projects page groups photos **by model only**. It has no project names, dates or per-project details.
- Project locations appear only in the homepage cards (Standard: Nonthaburi, Loft: Prachinburi, 1B2B: Suphanburi) and in testimonials (Loft: Suphanburi, Standard: Saraburi, Standard: Bangkok). It is unknown which gallery photos belong to which location.
- **Six testimonials**:
  - Two are untranslated English short reviews labelled "Product", likely imported from Google or Facebook.
  - Three use **screenshots** as portrait images.
  - One uses the **Webflow placeholder image**.
  - **Question:** Has every customer consented to their name and photo being republished in a new site?

## 9. Language parity issues (🟠)

| Page | Issue |
|---|---|
| `/en/blogs/knockdown-house-ideas` | Title tag and meta description are in **Thai** on the EN page. The body reads as machine-translated ("Beautiful finish in one back!", "high frost design", "Baan Knockdown"). |
| `/en/blogs/*` | Body links point to **/th/** URLs (for example the Unwind link and the contact link). |
| `/en` home FAQ 4 | Mentions Unwind **and Alive**. The TH version mentions **only Unwind**. |
| Home `/th` FAQ 5 | Links "บ้านสำเร็จรูปกับ Clay & Stone" to `/th/projects`. The EN version has no link. |
| `/th/projects` FAQ 3 | Typo "สามาร สร้าง". |
| `/th` key-strength quote | Stray double quote: "ตรงแบบ ตรงใจ ในทุกดีเทล"" |
| All contact blocks on EN pages | Include the Thai line "ติดต่อทีมงานได้เลยวันนี้". |
| Unwind "Module Combination" | "Family & Working Studio" appears twice; "Dinning" is misspelled (should be "Dining"). |

## 10. Positioning consistency (🟠)

The brand calls its homes **"modular"** and explains why modular ≠ knockdown (`/blogs/modular-vs-knockdown-house`). However:
- The 2023 article markets the Unwind Series as **"knockdown houses"**.
- The `good-to-know` meta description mentions "Knockdown home innovations".
- The TH homepage alternates between บ้านสำเร็จรูป, บ้านโมดูลาร์ and บ้านประกอบสำเร็จรูป, which is an SEO keyword choice.

**Question for client:** Which term is the primary category for users and search? Our recommendation is "modular home" (บ้านโมดูลาร์), with prefab (บ้านสำเร็จรูป) as a supporting keyword.

---

## Client confirmation checklist

Please confirm or correct each item. The prototype will not present any of these as fact until confirmed.

1. ☐ Current price for each Unwind model (card set or FAQ set) and its validity date
2. ☐ Alive Series: English intro, Alive-specific FAQ, and whether the material spec equals Unwind
3. ☐ Standard Type terrace area (21 or 23 sqm) and interior area (22.5 or 23 sqm)
4. ☐ Loft Type: number of bedrooms and sleeping capacity
5. ☐ Steel spec, coating systems, engineer licence level, and the basis for 1.4× / 1.35×
6. ☐ Warranty terms (standard or promotional) and what after-sales covers
7. ☐ The 200 km free-installation reference point, and transport cost beyond it
8. ☐ Foundation: precast footing price or options; who handles permits
9. ☐ Total typical timeline from first meeting to move-in
10. ☐ Payment milestones (if publishable)
11. ☐ Legal company name, founding year, factory location
12. ☐ Panita Rojanakansakun's title (Co-Founder?)
13. ☐ The "20+ years" and "30–50 year lifespan" claims
14. ☐ Testimonial consent and higher-quality customer photos
15. ☐ Project-to-location mapping for gallery photos
16. ☐ Humble Series: show "coming soon" in the new navigation or keep it hidden?
17. ☐ Primary category term: modular (โมดูลาร์) or prefab (สำเร็จรูป)
