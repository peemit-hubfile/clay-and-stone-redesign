# SEO / AEO / GEO Audit

**Stage 1 · Discovery** · 20 Nov 2026 · Raw metadata for all 32 URLs: `src/data/site-content.json → seo_current`

> Scope: on-page and technical signals visible in the HTML. Rankings, Search Console data, backlinks and real-user Core Web Vitals were **not** available to me, and no claims are made about them. Nothing in this plan guarantees rankings or AI-search visibility.

## 1. Scorecard

| Area | Status | Notes |
|---|---|---|
| Indexability | ✓ | All pages return 200; `robots.txt` open; no `noindex` anywhere (including `/search`) |
| XML sitemap | ◐ | Present, with hreflang alternates. Includes `/search`, which it shouldn't. Includes the orphan upcoming-product page. |
| Hreflang | ✓ | `th-TH`, `en-US`, `x-default → /th` in both HTML and sitemap |
| `<html lang>` | ✓ | `th-TH` / `en-US` |
| **Canonical tags** | ✗ | **None on any page** |
| Root redirect | ◐ | `/` → `/th` is a **302**, so the link equity signal is weaker than a 301 |
| Titles | ◐ | Unique and keyword-led; several issues below |
| Meta descriptions | ◐ | Present on 30/32; `/search` empty; EN knockdown article uses Thai |
| H1 | ✗ | Missing on About, Process, Contact, Good to Know, Upcoming (×2 languages = 10 URLs); **two H1s** on both product pages (4 URLs) |
| Heading hierarchy | ✗ | Decorative H4–H6 used for labels and prices; levels skipped |
| **Structured data** | ✗ | **0 JSON-LD blocks** site-wide |
| Image alt | ✗ | ~2 of ~170 content images have alt text |
| Open Graph | ◐ | Present on static pages. **Blog articles have no `og:image`**. Product pages use generic images. |
| Internal linking | ◐ | Good contextual links in FAQs and blogs, but EN articles link to **/th/** URLs; no related-model links |
| Mobile | ✓ | Responsive; no horizontal overflow observed at 390 px |
| Performance | ✗ | ~16.9 MB homepage; all images lazy (lab, see website-audit §6) |

## 2. Page-level metadata review

| URL (TH / EN) | Title (current) | Issues |
|---|---|---|
| Home | TH "บ้านโมดูลาร์ บ้านสำเร็จรูป ดีไซน์โมเดิร์น พร้อมติดตั้ง \| Clay & Stone" · EN "Modern Modular House \| High-Standard Modular House Builder Thailand" | EN title has no brand name. H1 is a long vision sentence, not a keyword-bearing heading. |
| About | TH "เกี่ยวกับเรา \| Clay and Stone ผู้นำนวัตกรรมบ้าน Modular มาตรฐานสากล" | No H1. "ผู้นำ… มาตรฐานสากล" (leader… international standard) is an unverified claim. |
| Unwind | EN "Unwind Series Modular House Design \| Modular Homes for Sale" | No brand in EN title; 2 H1s |
| Alive | EN "Alive Series Modular Home \| Prefab House from 1.69M THB - Clay & Stone" | Good title and description. **Thai body on the EN page**, 2 H1s, wrong FAQ. |
| Upcoming | "Humble Series - New Prefab Modular Home Coming Soon" | Thin content (1 line), no H1, orphan |
| Projects | EN "Our Modular House Project \| Clay and Stone" | TH page H1 is English |
| Process | "4 Steps to Your Dream Home \| …" | No H1 |
| Good to Know | "Modular Home Guides \| …" | No H1; content is only video iframes (no transcripts or summaries) |
| Contact | "Contact Us \| Start Your Modular Home Journey…" | No H1; no LocalBusiness data |
| Blog articles | Question-led titles | ✓ Strong for AEO. Missing `og:image`, Article schema, canonical. EN knockdown article has Thai meta. |
| Search | "Search Results" | Should be `noindex` and removed from sitemap |

Brand spelling alternates between "Clay & Stone" and "Clay and Stone" in titles. Pick one canonical form for the entity, with the other as an alternate name.

## 3. Keyword and topic landscape (from existing copy)

The site already targets these clusters in Thai: **บ้านสำเร็จรูป** (prefab home), **บ้านโมดูลาร์** (modular home), **บ้านน็อคดาวน์** (knockdown home), **บ้านประกอบสำเร็จรูป**, **แบบบ้านสำเร็จรูป**, **บ้านสำเร็จรูปพร้อมติดตั้ง**, **ราคา** (price). In English: *modular house Thailand*, *prefab home*, *modular homes for sale*.

> Search volumes were not measured in this stage. Keyword research with a tool (e.g. Google Keyword Planner / Search Console data from the client) is recommended before final page titles are locked.

## 4. AEO: Answer Engine Optimisation opportunities

The site already contains concise answers to high-intent questions. They are just fragmented and unmarked.

| Question users ask | Existing answer | Action |
|---|---|---|
| บ้านสำเร็จรูปคืออะไร / What is a prefab (modular) home? | Home FAQ 1, blog vs-knockdown | One canonical answer page + FAQPage |
| บ้านโมดูลาร์ราคาเท่าไหร่ / How much does a modular house cost? | Unwind FAQ 2, price blog, price cards | **Fix the price conflict first**, then a price table with `Offer` data |
| บ้านโมดูลาร์ต่างจากบ้านน็อคดาวน์อย่างไร | Blog | Comparison table in HTML (not an image) |
| ใช้เวลาสร้างกี่วัน / How long does it take? | Process + Unwind FAQ 5 | Timeline component with explicit numbers (60–90 + ~15 days) |
| แข็งแรงไหม / อยู่ได้กี่ปี | Home FAQ 3, lifespan blog | Material facts with units; remove unsupported numbers |
| หน้าฝนรั่วไหม | Projects FAQ 2, rainy-season blog | Keep; link EP.4 video with a transcript summary |
| ราคารวมอะไรบ้าง / What's included? | Projects FAQ 4 | Dedicated "What's included" checklist |
| ติดตั้งที่ไหนได้บ้าง / ย้ายได้ไหม | Unwind FAQ 4 | Keep; add the 200 km rule clearly |

Formatting rules for answers: put the answer in the first 1–2 sentences, use question-form H2/H3, units and numbers in text (not images), tables for comparisons, and dates on articles.

## 5. GEO: Generative Engine Optimisation (entity clarity)

AI answer engines need an unambiguous, consistent entity. Today the site provides:
- ✓ Consistent NAP (name, address, phone) in the footer on every page
- ✓ Named founders with credentials (citable expertise)
- ✓ Specific, checkable product facts (sqm, THB, mm, brands)
- ✗ No Organization / LocalBusiness markup tying the name, address, phone, social profiles and logo together
- ✗ No legal name, founding date or `sameAs` links
- ✗ Contradictory prices: an AI system may quote either set
- ✗ Key facts locked inside images (floor plans, price cards in the CMS, infographics)
- ✗ The EN pages that contain Thai text weaken language signals

## 6. Structured data plan (to implement in the prototype; validated before claiming)

| Schema | Where | Fields from verified data only | Eligibility notes |
|---|---|---|---|
| `Organization` (+ `HomeAndConstructionBusiness`/`LocalBusiness`) | Home, About, Contact | name, url, logo, telephone, email, address, geo, sameAs (FB, IG, LINE) | **Needs** legal name and logo; no `aggregateRating` (no verified review data) |
| `WebSite` | Home | name, url, inLanguage | No SearchAction unless search is kept |
| `BreadcrumbList` | All inner pages | — | Straightforward |
| `Product` + `Offer` | Model pages | name, image, description, offers.price, priceCurrency THB, `additionalProperty` (area, beds, baths) | **Blocked until the price conflict is resolved.** No review/rating markup. |
| `FAQPage` | Knowledge/FAQ page | Visible Q&A only | Google limits FAQ rich results to authoritative government/health sites. The markup is still valid and helps machine understanding. **No rich-result promise.** |
| `Article` / `BlogPosting` | Articles | headline, author (Person), datePublished, image, inLanguage | Author byline title needs confirming (Co-Founder?) |
| `VideoObject` | Knowledge/videos | name, thumbnailUrl, uploadDate, embedUrl | **Needs upload dates** from YouTube |

## 7. Technical SEO checklist for the prototype

- [ ] Self-referencing canonical on every page; hreflang th/en/x-default reciprocal
- [ ] One H1 per page; logical H2/H3 nesting; no headings used for styling
- [ ] Unique, localised `<title>` (≤ ~60 chars) and description (≤ ~155 chars) per language, with a consistent brand suffix
- [ ] OG/Twitter tags with a per-page image (1200×630)
- [ ] XML sitemap with alternates; exclude search/utility pages; `robots.txt` pointing to it
- [ ] Descriptive, stable URLs (see [sitemap.md](sitemap.md) redirect plan)
- [ ] Alt text in both languages; text alternatives for floor plans
- [ ] JSON-LD validated (Schema.org validator + Google Rich Results Test) before claiming it works
- [ ] Preview deployment set to `noindex` so it never competes with production
- [ ] Performance budget (see technical-feasibility.md) measured with Lighthouse

## 8. Quick wins for the **live** Webflow site (client may action independently)

These are recommendations only. Nothing was changed on production.
1. Fix the Alive EN page (Thai text, wrong FAQ, duplicate H1).
2. Align the price set across cards, FAQs and articles.
3. Add H1s to About, Process, Contact and Good to Know.
4. Enable canonical tags (Webflow → Site settings → SEO → Global canonical tag URL).
5. Set `/search` to noindex; change `/` 302 → 301 if Webflow localization allows.
6. Add alt text to product and project images in the CMS.
7. Translate the EN knockdown article's meta, and point EN article links to `/en/` URLs.
8. Add `og:image` to blog posts.
