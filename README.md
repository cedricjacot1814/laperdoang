# Laper Doang 🛵

**Semua dopamine-nya. Tanpa kalorinya.**

A fake food-delivery web app (PWA) in Bahasa Indonesia, GoFood-styled. Order food
that never comes, track the driver on a live map, get the dopamine hit — gratis.
Built with React + Vite. Installs to the home screen; no app store needed.

---

## Quick start (local)

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build    # outputs to /dist
npm run preview  # preview the production build locally
```

---

## Deploy to laperdoang.com (GitHub → Vercel)

Same flow as sasyaalyssa.com:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Laper Doang v1"
   git branch -M main
   git remote add origin https://github.com/<you>/laperdoang.git
   git push -u origin main
   ```
2. **Import in Vercel** → New Project → pick the repo. Vercel auto-detects Vite
   (build `npm run build`, output `dist`). Hit Deploy.
3. **Add the domain** → Project → Settings → Domains → add `laperdoang.com`
   (and `www`). Vercel shows the DNS records; set them at your registrar. Done.

That's it. The service worker, manifest, and icons are already wired — it's
installable the moment it's live.

---

## Things you'll want to change

Everything below lives in **`src/App.jsx`** unless noted.

- **The "order for real" affiliate link** — search for `orderReal` (it's marked
  with a comment: *"Slot afiliasi"*). Right now it opens `https://gofood.co.id`.
  Swap in your live affiliate / deep link when you have one. Reminder: GoFood has
  **no** commission program — use **Grab / ShopeeFood via Involve Asia or
  Accesstrade** for actual commission.
- **The WhatsApp share text** — search for `shareWA`. Edit the message that gets
  pre-filled when someone taps "Pamer ke grup WhatsApp."
- **Restaurants & menus** — the `RESTOS` array near the top. Add warungs, dishes,
  prices (Rupiah), and calories. Tile gradients are per-restaurant.
- **Drivers, statuses, driver chat** — `DRIVERS`, `STAGES`, and `msgs()`.
- **Payment chips** — `PAYS` (GoPay / OVO / DANA / Tunai). Cosmetic only.
- **Delivery fees** — `ONGKIR` and `LAYANAN` constants (used for the "Hemat"
  number on the payoff screen).
- **Speed of the sim** — `BASE = 25` (seconds) inside the delivery `useEffect`.

### Branding / SEO
- **Social preview + meta tags** → `index.html` (Open Graph image points at
  `https://laperdoang.com/og-image.png`).
- **Icons & OG image** → `/public`. To regenerate them, re-run the asset script
  (`gen_assets.py`, kept outside this folder) or replace the PNGs directly:
  `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`, `apple-touch-icon.png`,
  `favicon.svg`, `og-image.png`.

---

## Before you tell anyone (do these first)

1. **QA on real devices.** Open it on iOS Safari *and* Android Chrome. Not being
   buggy is your whole edge over FoodNeverComes — don't ship the same problem.
2. **Add analytics.** Drop in Plausible or Umami (one `<script>` in `index.html`).
   Traffic is the only number that matters; every monetization path needs it.
3. **Test the WhatsApp share + OG card.** Send the live link to yourself in
   WhatsApp and confirm the green preview image renders.

## Money (only once traffic exists)
- **Saweria** tip jar (Indonesian Ko-fi) — add a button.
- **Affiliate** — wire `orderReal` to a live Grab/ShopeeFood link.
- **Sponsored warung** — sell a "featured" slot to local F&B once you have daily
  numbers. This is the Bali-network play.

---

## Stack
React 18 · Vite 5 · vite-plugin-pwa (Workbox) · lucide-react. No backend, no
database — fully client-side. Fonts (Baloo 2 + Plus Jakarta Sans) load from
Google Fonts at runtime.

*Catatan: gak ada makanan beneran yang dateng. Emang gitu konsepnya.* 🫶
