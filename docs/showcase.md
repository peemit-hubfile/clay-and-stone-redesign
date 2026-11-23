# Showcase build (V.1 preview)

This build sends the client a link that shows the redesigned homepage only, so they see the design before the project is agreed.

## What it does

- **Pages:** the homepage only, in Thai (`/th/`) and English (`/en/`). `/` and every other path go to `/th/`: unknown paths through `404.html`, `/` through a redirect.
- **Links to other pages:** links to "แบบบ้าน", "โปรเจค" and the rest are marked `aria-disabled`. Clicking one shows a short notice instead of navigating: "หน้านี้จะเปิดใช้ในเวอร์ชันเต็ม ตัวอย่างนี้แสดงเฉพาะหน้าแรก". A polite live region announces it to screen readers.
- **What still works:**
  - in-page anchors
  - the TH/EN switch
  - the Homes panel
  - the Home Finder
  - phone, LINE, email and Google Maps links
- **Not indexed:** `<meta name="robots" content="noindex, nofollow">`, an `X-Robots-Tag` header and a `robots.txt` that disallows everything.
- **Optional expiry:** after the date, the page is replaced by "ลิงก์ตัวอย่างนี้หมดอายุแล้ว". This happens in the browser, so it only discourages access; it is not security. The files stay downloadable until the deployment is removed, so remove the deployment when the preview ends.

## Build and deploy

```
node tools/build/showcase.mjs --expires 2026-11-30
npx vercel login
npx vercel deploy dist --prod
```

- The build runs fonts → images → vite build → prune. It then writes `dist/404.html`, `dist/vercel.json` and `dist/robots.txt`, and re-renders the full page set for the dev server.
- `dist/` is deployed as a static folder, so Vercel runs no build.
- **To take the preview down:** in the Vercel dashboard, open Project → Settings and delete the project, or run `npx vercel remove <project> --yes`.

## Before sending the link

- The page carries the client's real phone, LINE and email. That is fine for a preview sent to the client, but don't post the link publicly.
- The footer notice already says "ต้นแบบการออกแบบใหม่ ไม่ใช่เว็บไซต์จริง".
