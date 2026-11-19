# Sitemap: Current and Proposed

**Stage 1 · Discovery** · 20 Nov 2026

## 1. Current sitemap (live site)

Source: `https://www.clayandstone.co.th/sitemap.xml` (32 `<loc>` entries, with `xhtml:link` hreflang alternates: `th-TH`, `en-US`, `x-default → /th`). `robots.txt` only declares the sitemap, with no disallow rules. Internal-link crawling found **no pages outside the sitemap**.

```
/ ──302──▶ /th                                (temporary redirect)
/th  |  /en                                   Home
├── about-us                                  About Us
├── products/                                 (no index page – 404)
│   ├── unwind-series                         Unwind Series (4 models)
│   ├── alive-series                          Alive Series (1 model)
│   └── upcoming-product                      Humble Series – coming soon   ⚠ orphan (not in nav)
├── projects                                  Projects (galleries by model)
├── process                                   Process (4 steps)
├── good-to-know                              7 educational videos
├── blogs                                     Blog index
│   ├── prefab-homes-lifespan
│   ├── modular-house-rainy-season-problems
│   ├── modular-house-price
│   ├── modular-vs-knockdown-house
│   └── knockdown-house-ideas
├── contact-us                                Contact (details + map, no form)
└── search                                    Site search   ⚠ indexable + in sitemap
```

| Navigation | Items |
|---|---|
| Header | Home · About Us · Products ▾ (Unwind, Alive) · Projects · Process · Good to Know · Blogs · Contact Us · TH/EN · **CTA → Linktree** |
| Footer | Same as header (minus the Products parent) + address/contact + Facebook / Instagram / LINE |

Issues: 8 top-level items; product detail is only 1 click deep but there is no products overview; educational content is split three ways (FAQ, Good to Know, Blogs); there is no compare or decision tool; the conversion CTA leaves the domain.

---

## 2. Proposed information architecture (draft for review)

**Principle:** organise around the buyer's journey, not around the company's departments: **Discover → Understand → Decide → Talk to us.** Every page below maps to content that already exists. Items marked *(new)* are new *interfaces* over existing data, not new business content.

```
/th  |  /en                                     Home
│
├── homes/                                      Our Homes (index of all models)          (new index)
│   ├── unwind-series/                          Series page (story, values, models, materials)
│   │   ├── standard-type                       Model page                               (new, split from series)
│   │   ├── loft-type                           Model page                               (new)
│   │   ├── 1-bed-2-bath                        Model page                               (new)
│   │   └── 2-bed-2-bath                        Model page                               (new)
│   ├── alive-series/
│   │   └── 2-bed-2-bath                        Model page                               (new)
│   ├── humble-series                           Coming soon / register interest           (client decision)
│   └── compare                                 Compare models side by side               (new interface)
│
├── home-finder                                 Smart Home Finder (rules-based)           (new interface)
│
├── projects/                                   Projects (filter by model / location)
│   └── [model-or-location]                     Project story pages – only if the client supplies details
│
├── how-we-build/                               How We Build (process + materials + timeline)
│   ├── materials                               6 material systems (moved from series pages)
│   └── whats-included                          Included / customer-prepared / foundation   (new page, existing facts)
│
├── knowledge/                                  Knowledge Center
│   ├── faq                                     All FAQs, grouped by topic, FAQPage schema
│   ├── videos                                  EP.1–EP.7
│   └── articles/[slug]                         Blog articles (301 from /blogs/[slug])
│
├── about                                       About Clay & Stone (team, testimonials, showroom)
└── contact                                     Talk to Our Team (LINE / phone / email / showroom visit / form – demo)
```

### Page purpose and source mapping

| Proposed page | User question it answers | Existing source content |
|---|---|---|
| Home | What is this, is it for me, what does it cost? | Home + series summaries + projects + FAQ |
| Our Homes | What models exist and how do they differ? | Price cards from both series pages |
| Model page | Will this layout fit my life and plot? | Price card, floor plan, area split, gallery, description, relevant FAQ |
| Series page | What is the design idea behind it? | Brand concept, values, functions, combinations |
| Compare | Which of these 5 is best for me? | `products.json` |
| Home Finder | Help me choose | `products.json` + explicit rules |
| Projects | Are there real homes I can see? | `/projects` galleries + locations + testimonials |
| How We Build | Is it strong, how long, what is involved? | Process, materials, timeline FAQ, EP.3/4/5/7 |
| What's Included | What will I still have to pay for? | Projects FAQ 4–5, price blog "Additional Costs" |
| Knowledge Center | I have a specific question | 17 valid FAQs, 7 videos, 5 articles |
| About | Can I trust these people? | Team, testimonials, showroom |
| Contact | How do I talk to someone now? | Phone, LINE, email, address, map |

### Proposed navigation

| | Thai | English |
|---|---|---|
| 1 | แบบบ้าน ▾ (Unwind · Alive · เปรียบเทียบ · ค้นหาบ้านที่ใช่) | Our Homes ▾ (Unwind · Alive · Compare · Home Finder) |
| 2 | โปรเจค | Projects |
| 3 | กระบวนการ | How We Build |
| 4 | สิ่งที่ควรรู้ | Good to Know |
| 5 | เกี่ยวกับเรา | About |
| CTA | นัดปรึกษา | Book a Consultation |
| Utility | TH / EN · LINE | TH / EN · LINE |

Labels marked as new in `navigation.json` need client approval. Thai labels are written natively, not machine-translated, and should be reviewed by a native copywriter.

### URL and redirect plan (for future production; not applied to the live site)

| Current | Proposed | Type |
|---|---|---|
| `/` | `/th` | **301** (currently 302) |
| `/{lang}/products/unwind-series` | `/{lang}/homes/unwind-series` | 301 |
| `/{lang}/products/alive-series` | `/{lang}/homes/alive-series` | 301 |
| `/{lang}/products/upcoming-product` | `/{lang}/homes/humble-series` | 301 (if kept) |
| `/{lang}/process` | `/{lang}/how-we-build` | 301 |
| `/{lang}/good-to-know` | `/{lang}/knowledge` | 301 |
| `/{lang}/blogs/[slug]` | `/{lang}/knowledge/articles/[slug]` | 301 |
| `/{lang}/about-us` | `/{lang}/about` | 301 |
| `/{lang}/contact-us` | `/{lang}/contact` | 301 |
| `/{lang}/search` | keep, add `noindex`, remove from sitemap | — |

> **Alternative:** keep existing URLs unchanged to avoid SEO risk and only change navigation labels. This is lower risk and simpler in Webflow. **Decision for the client** at the stage gate. The prototype can use either; we recommend keeping existing slugs for pages that already rank, and adding only the new pages.

Hreflang: keep the current `th-TH` / `en-US` / `x-default → th` pattern on every page, with a self-referencing canonical per language.
