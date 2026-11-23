# Seed Data (prototype content layer)

**Created:** 20 Nov 2026 · **Location:** [`src/data/seed/`](../src/data/seed) · **Status:** ready for the prototype build; some values are still pending client confirmation

The seed turns the Stage 1 extraction (`src/data/*.json`) into **flat, CMS-shaped collections** that link to each other by `id`, the same way Webflow CMS uses reference fields. The prototype can be built now, and client corrections later only require editing the source data and re-running one command.

```bash
npm run seed:all        # build + validate
npm run seed            # rebuild generated collections from src/data
npm run seed:validate   # checks only
```

## Collections

| File | Items | Generated? | Webflow CMS equivalent |
|---|---:|---|---|
| `settings.json` | 1 object | ✓ | Site settings / global symbols |
| `series.json` | 3 | ✓ | **Series** |
| `models.json` | 5 | ✓ | **Models** (ref → Series) |
| `materials.json` | 6 | ✓ | **Materials** (multi-ref → Series) |
| `process-steps.json` | 4 | ✓ | **Process Steps** |
| `project-galleries.json` | 5 (57 photos) | ✓ | **Projects** (ref → Model, multi-image) |
| `project-highlights.json` | 3 | ✓ | Featured projects |
| `faqs.json` | 17 (16 visible) | ✓ | **FAQ** (topic option, ref → Series) |
| `testimonials.json` | 6 | ✓ | **Testimonials** (ref → Model) |
| `team.json` | 3 | ✓ | **Team** |
| `articles.json` | 5 | ✓ | **Articles** (ref → Team) |
| `videos.json` | 7 | ✓ | **Videos** |
| `finder.json` | 4 steps (v2; see home-finder-v2.md) | ✗ hand-authored | Custom code (JSON embed) |
| `i18n/th.json`, `i18n/en.json` | UI strings | ✗ hand-authored | Static text per locale |

Generated files are overwritten by `npm run seed`, so edit `src/data/*.json` or `tools/seed/build-seed.mjs`, not the output. Hand-authored files are never overwritten.

## Record conventions

- Localised text is always `{ "th": …, "en": … }`. A missing language is `null`, never machine-translated, and must be named in `flags`. The UI renders it with the "รอข้อมูลจากลูกค้า / Content pending" label.
- `status`: `consistent-on-site` (same value everywhere on the live site) or `pending-confirmation` (conflict, shown with a badge).
- `flags[]`: human-readable list of open issues for that record. It feeds the client checklist.
- `sources[]`: the live-site URL(s) the record came from.
- Image paths are relative to `/public` (client media is git-ignored, see asset-inventory.md).

## Defaults applied to pending decisions

These let the build proceed. Each one is reversible by editing a single value.

| Pending decision | Default used in the seed | Where to change |
|---|---|---|
| Two Unwind price sets | Display the **price-card** value (849k / 1.21M / 1.69M / 2.69M); keep the FAQ value as `alternate_thb`; show a **"ราคารอยืนยัน / Price pending"** badge | `build-seed.mjs` → models `price` |
| Unwind FAQ "prices" quotes the other set | Kept but `visible: false` | `faqs.json` → `faq-unwind-series-02` |
| Alive FAQ is a copy of Unwind | Excluded entirely | `build-seed.mjs` → faqs filter |
| Alive EN intro missing | Uses the EN meta description as a factual stand-in; flagged | `series.json` → `alive.intro` |
| Materials for Alive | `applies_to: [unwind, alive]` as on the live site; flagged | `materials.json` |
| Humble Series | Kept, `status: coming-soon`, hidden from nav, Finder and Compare | `series.json` |
| Loft bedrooms unknown | `bedrooms: null`, `sleeping: "loft"` (treated as 0 separate bedrooms in the Finder) | `models.json` |
| Testimonial consent | Included with `consent: "pending"` | `testimonials.json` |
| Team in English | `role.en` / `credentials.en` = null (pending) | `team.json` |
| Image alt text | Draft TH/EN alt per gallery photo, `alt_status: "draft"` | `project-galleries.json` |
| URLs | New-IA paths (`/homes/{series}/{model}`) with `legacy_path` kept for 301 mapping | `models.json`, `series.json` |

## Home Finder

`finder.json` declares 4 steps (use, space, budget, optional priority); v1 had 6 (use, household, bedrooms, budget, plot, mood). See [home-finder-v2.md](home-finder-v2.md). Each answer carries `require`, `boost` or `note` effects that read **one field** of a model record. The engine is [`src/scripts/finder-engine.js`](../src/scripts/finder-engine.js), a pure function the prototype UI will reuse.

Every recommendation reason comes from site data. Finder tags on each model (`uses`, `household`, `plot_fit`, `lifestyle`) carry a `tag_basis` naming the source sentence.

The validator runs **all 9,600 answer combinations** in both languages:
- 2,240 end with no exact match.
- All of those still return close matches.
- The UI also shows the consultation CTA in that case.

No land-size question is asked, because the site publishes no minimum plot size.

## Validation checks (`npm run seed:validate`)

1. Valid JSON and unique ids in every collection.
2. All references resolve (model → series, gallery → model, testimonial → model, FAQ → series, article → author).
3. Every missing translation is flagged.
4. Every pending price has a flag and a numeric display value.
5. TH/EN UI-string key parity.
6. Finder: labels and reasons in both languages, valid operators, and an exhaustive answer-combination run.
7. Referenced images exist on disk. This is a warning only, because media is git-ignored.

Last run: ✓ valid. 13 collections; 101 images referenced (all present locally); 12 missing translations, all flagged; 4 pending prices; 6 pending testimonial consents.
