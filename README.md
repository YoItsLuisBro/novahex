# NovaHex — Cosmic Color Crafter 🚀🎨

A space‑themed color palette creator inspired by Color Hunt. Generate harmonious palettes, lock/shuffle swatches, check contrast, and save your favorites — all in a sleek cosmic UI.

> **Status:** MVP complete (Generator + Explore random feed + Saved library). Roadmap below.

---

## ✨ Features

- **Palette Generator**
  - Harmony modes: **Analogous, Complementary, Triad, Tetrad, Monochrome**
  - **Lock** any swatch, **Shuffle** the rest
  - **Copy HEX** to clipboard
  - **Contrast badge** (WCAG check vs. black/white)
  - Optional **name** before saving

- **Explore (Random Feed)**
  - Always shows a **fresh assortment** of palettes (does **not** use your library)
  - **Regenerate** button for a new batch
  - **Save** any explore palette to your library (marked as liked)

- **Saved Library**
  - All saved palettes
  - **Liked‑only toggle**
  - Local persistence via Zustand’s `persist` middleware

- **Branding & PWA bits**
  - NovaHex **logo** + full **favicon** set
  - Web manifest for Add‑to‑Home‑Screen

---

## 🧱 Tech Stack (pinned versions)

- **React** `19.2.0`, **React DOM** `19.2.0`
- **React Router** `7.6.2`
- **Vite** `7.1.10` + **TypeScript** `5.9.3`
- **Tailwind CSS** `4.1.14` + `@tailwindcss/vite` `4.1.14`
- **Zustand** `5.0.8`
- **lucide-react** `0.545.0` (icons)

> Node.js **>= 20** recommended.

---

## 🚀 Quick Start

```bash
# 1) Install
npm i

# 2) Run dev server
npm run dev
# → http://localhost:5173

# 3) Production build + local preview
npm run build
npm run preview    # → http://localhost:5174
```

---

## 📁 Project Structure

```
novahex/
├─ public/
│  ├─ novahex-logo.svg
│  ├─ favicon.svg
│  ├─ favicon-16x16.png
│  ├─ favicon-32x32.png
│  ├─ favicon-64x64.png
│  ├─ favicon-180x180.png            # also used as apple-touch-icon.png
│  ├─ favicon-192x192.png            # Android/manifest
│  ├─ favicon-512x512.png            # Android/manifest
│  └─ site.webmanifest
├─ src/
│  ├─ styles/globals.css
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ components/
│  │  ├─ Header.tsx
│  │  ├─ Starfield.tsx
│  │  ├─ Swatch.tsx
│  │  └─ PaletteCard.tsx
│  ├─ pages/
│  │  ├─ Home.tsx
│  │  ├─ Explore.tsx
│  │  ├─ Create.tsx
│  │  └─ Saved.tsx
│  ├─ store/palettes.ts
│  └─ utils/color.ts
├─ index.html
├─ package.json
├─ tsconfig.json
└─ vite.config.ts
```

---

## 🧩 Configuration Notes

### Tailwind (v4)
- Uses the **Vite plugin** `@tailwindcss/vite` — no separate `tailwind.config.js` needed for basic usage.
- Global styles + color tokens live in `src/styles/globals.css`.

### Routing
- React Router v7 — routes are in `App.tsx`.

### State
- Zustand store in `src/store/palettes.ts`, persisted in `localStorage` under the key `novahex-palettes`.

---

## 🖼️ Favicons & Logo

**In `public/`:**
- `novahex-logo.svg` (used in header)
- `favicon.svg`, `favicon-16x16.png`, `favicon-32x32.png`, `favicon-64x64.png`
- `favicon-180x180.png`, `favicon-192x192.png`, `favicon-512x512.png`
- `site.webmanifest`, `safari-pinned-tab.svg` (optional)

**In `<head>` (see `index.html`):**
```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png" />
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#8b5cf6" />
<link rel="manifest" href="/site.webmanifest" />
```

---

## 🧪 How It Works (high‑level)

- **Generator:** picks a seed color → computes a 5‑swatch set using an **HSL harmony** algorithm (`utils/color.ts`). You can lock swatches before shuffling to keep them stable.
- **Contrast badge:** calculates **relative luminance** and **contrast ratio** vs. black/white to hint at AA/AAA legibility.
- **Explore:** builds a **random set** on mount; “Save” clones the palette into your library (and marks it liked) without affecting the explore feed.
- **Saved:** reads from the persisted store and supports a liked‑only view.

---

## 🗺️ Roadmap

- **Export tools:** Copy CSS variables, JSON export, “Open in Figma” link
- **Palette detail:** AA/AAA checks for text/UI on each swatch
- **Drag to reorder** swatches + keyboard shortcuts
- **Shareable URLs** (encode palette in hash/query)
- **Cloud gallery** (Supabase) with public likes

> Want something else? Open an issue / feature request.

---

## 🧑‍💻 Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview --port 5174"
  }
}
```

---

## 🔒 License

MIT © 2025 NovaHex contributors
