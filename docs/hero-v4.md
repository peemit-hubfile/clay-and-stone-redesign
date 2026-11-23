# Homepage Hero v4 and Brand Vision

Replaces the v3 hero layout ([hero-v3.md](hero-v3.md) §1–4). The client found the split hero (text on paper on the left, photo on the right) not modern enough, and pointed to two references:
- **livera-space.vercel.app:** a full-bleed photo with a paper panel over its lower-left corner.
- **moodliving.co.th:** a full-bleed image with the text over it.

The copy and the photo from v3 are kept. The CTA was later removed (see §1).

## 1. Composition

- **Desktop (≥1024px):**
  - The photograph of the delivered Unwind 1 Bed 2 Bath fills the width and the first screen below the header (36–58rem tall).
  - A white panel sits on the photo at the bottom left, aligned to the page grid. It holds the eyebrow "Clay & Stone — Modular Homes", the H1 and the sentence.
  - The panel stays left of 55% of the width, so the house stays clear.
  - At the bottom right, a small white caption reads "บ้านลูกค้าที่ส่งมอบแล้ว / Unwind Series 1 Bed 2 Bath →" and links to the model. A soft shade, only along the bottom 30% of the photo, keeps it readable.
- **Tablet (768–1023px):** the photo, then the panel lifted 9rem over its lower edge. There is no caption.
- **Mobile:** the photo (54svh, max 28rem), then the panel lifted 3.5rem over it. There is no caption.
- **Buttons removed** at the client's request: the hero no longer has "สำรวจแบบบ้าน" or "ค้นหาบ้านที่ใช่".
  - "นัดปรึกษา" stays in the header.
  - "แบบบ้าน" opens the models panel.
  - "Discover our homes" follows two sections below.

## 2. Type

- **H1:** larger than v3. Thai is regular weight, 2–3.5rem, line height 1.3. English is light weight, 2.25–3.75rem.
- **Eyebrow:** Latin capitals, 0.14em tracking.

## 3. Motion

The photo is visible from the first paint and settles from 106% scale. The panel rises 24px. The eyebrow, title, sentence, actions and caption fade in, staggered. All of this is off with reduced motion.

## 4. Copy

- **H1, sentence:** unchanged from v3. They are proposed copy that needs brand approval.
- **New, proposed:** the caption label "บ้านลูกค้าที่ส่งมอบแล้ว / A delivered home". It rests on verified facts: the photo is a completed customer home.

## 5. Brand Vision (new section, after the hero)

- **Content:** the client's vision statement, supplied by the client from the live site.
  - **TH, verbatim:** the statement "เรามุ่งมั่นสร้างสรรค์ “บ้านสำเร็จรูป” …ให้เข้าถึงง่ายสำหรับทุกคน" and the paragraph "สัมผัสประสบการณ์การอยู่อาศัยที่เหนือระดับกับ Clay & Stone …หรือสตูดิโอส่วนตัว".
  - **EN:** a proposed translation that needs brand approval.
- **Facts row (tried and removed):** a row of four counted numbers sat between the hero and the vision. The client crossed it out.
- **Layout (v4, "more modern and more distinctive"):**
  - On desktop the statement takes 7 columns and the photo 5. On phones the photo comes after the text.
  - Under the statement, a hairline row holds the paragraph and "รู้จัก Clay & Stone →" (to About).
  - **Gable photo:** the living room of the delivered 1 Bed 2 Bath (`1bed-2bath-07`), clipped to the gable profile of the homes themselves. As it scrolls in, the top edge rises from flat to a pitched roof (`--roof` 0 → 1 over the first 65% of the viewport). A 1px timber outline of the same gable sits offset up-right like a drawing line and fades in with it. The photo also drifts slightly (up to 10%).
    - The interior's own gabled ceiling lines up with the frame.
    - Without JS or with reduced motion it is a full, still gable.
  - **Caption:** a small timber dot, then "ห้องนั่งเล่น บ้าน Unwind 1 Bed 2 Bath ที่ส่งมอบแล้ว" (proposed).
  - **Accent:** the quoted words (“บ้านสำเร็จรูป”, EN “prefabricated homes”) use timber, the one accent colour. Every other phrase goes from light grey to ink.
  - There are no decorative quote marks.
- **Line breaks:** the statement is split into phrases at its own spaces, plus a few `|` break points stored in the TH copy. The `|` points add no visible space. Phrases never split inside a word: v1 broke "โม/เดิร์น".
- **Scroll reveal:** each phrase darkens once it rises above 70% of the viewport height, so the statement fills in line by line as you read. Without JS, or with reduced motion, the statement is shown in full ink.

## 6. Tests

`node tests/hero-check.mjs` runs on TH/EN 1440, TH 1280, TH 820, and TH/EN 390. It checks:
- The H1, sentence and photo are on the first screen.
- The removed hero buttons and facts row are gone.
- On desktop the panel stays clear of the house.
- Links return 200.
- The photo has alt text.
- The vision statement is verbatim, and all its phrases are lit after scrolling past.
- The vision photo loads.
- No overflow and no page errors.

Smoke QA (32 routes × 2 viewports): 0 failures.
