# Oi Ceramics — Site Guide

Handmade pottery website. Next.js, SQLite, Stripe, self-hosted on a Raspberry Pi 3B.

---

## Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Setup

Copy the example file and fill it in:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local`:

```
ADMIN_PASSWORD=your-secret-password
GMAIL_USER=oiceramicsmadison@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

- **ADMIN_PASSWORD** — anything you want; used to log into `/admin`
- **GMAIL_USER** — the Gmail address that sends contact form notifications
- **GMAIL_APP_PASSWORD** — a Google App Password (not your regular Gmail password). To get one: Google Account → Security → 2-Step Verification → App passwords → generate one for "Mail"
- **Stripe keys** — from your [Stripe dashboard](https://dashboard.stripe.com/apikeys) under Developers → API Keys
- **NEXT_PUBLIC_BASE_URL** — change to your domain in production (e.g. `https://oiceramics.com`)

Restart the dev server after changing `.env.local`.

---

## Admin Panel

Go to [http://localhost:3000/admin](http://localhost:3000/admin).

Sign in with the password you set in `ADMIN_PASSWORD`.

### Products

- **Add a product** — click "+ Add Product", fill in the form, upload a photo
- **Edit a product** — click "Edit" on any row to change name, price, description, etc.
- **Delete a product** — click "Delete", then confirm
- **Mark as featured** — check "Featured on homepage" when editing; featured products show on the home page (up to 4)
- **Mark as sold out** — check "Sold out"; the listing stays visible but shows "Sold Out" and disables Add to Cart
- **Price** — enter in dollars (e.g. `38.00`); stored as cents internally

### Portfolio

Same as products. Use **Sort Order** to control the display order on the portfolio page — lower numbers appear first.

---

## Adding Images

### Product images
1. In the admin, click Edit on a product (or Add Product)
2. Use the image upload field to pick a file from your computer
3. The image saves automatically to `public/images/products/` when you save

### Portfolio images
Same as above — upload from the portfolio admin.

### Page images (hero, about section, portrait)

These are set in code. Edit the file and change `null` to your image path:

**Home page hero + about strip** — [`app/page.tsx`](app/page.tsx), lines near the top:
```ts
const HERO_IMAGE: string | null = null;   // e.g. "/images/hero.jpg"
const ABOUT_IMAGE: string | null = null;  // e.g. "/images/studio.jpg"
```

**About page portrait** — [`app/about/page.tsx`](app/about/page.tsx):
```ts
const PORTRAIT_IMAGE: string | null = null;  // e.g. "/images/portrait.jpg"
```

Put those image files in the `public/images/` folder, then update the path string in the code.

**Image tips:**
- Square or near-square crops work best for product photos
- WebP format keeps file sizes small (good for the Pi)
- No spaces in filenames — use hyphens: `classic-mug.jpg`

---

## Pages

| URL | What it is |
|-----|-----------|
| `/` | Home — hero, featured products, about strip |
| `/shop` | All products; filter by category with `?category=mugs` etc. |
| `/shop/[id]` | Individual product with qty picker and Add to Cart |
| `/portfolio` | Body of work — alternating image/text layout |
| `/about` | Bio, process, commissions |
| `/contact` | Contact form — submissions saved to the database |
| `/admin` | Admin panel (password protected) |

---

## Editing Page Text

Most text is written directly in the page files under `app/`. Open the relevant file and edit the copy:

| Page | File |
|------|------|
| Home | `app/page.tsx` |
| About | `app/about/page.tsx` |
| Portfolio | `app/portfolio/page.tsx` |
| Contact | `app/contact/page.tsx` |

The about page has placeholder text in `[brackets]` — replace those with your real bio.

---

## Database

Products, portfolio items, and contact submissions are stored in `data/ceramics.db` (SQLite).

The database is created automatically the first time the server starts, and seeded with example products. To reset it and start fresh, delete `data/ceramics.db` and restart — it will re-seed.

To browse the database directly, use [DB Browser for SQLite](https://sqlitebrowser.org/) (free, visual).

**Contact form submissions** are saved to the `contact_submissions` table. Open the DB in DB Browser to read them.

---

## SEO

The site is set up for search engine visibility out of the box.

### What's included

- **Page titles & descriptions** — every public page has a unique title and description tuned for local pottery searches
- **Keywords** — targeting: handmade pottery Madison WI, ceramics Madison Wisconsin, wheel thrown pottery, stoneware pottery, farmers market pottery Madison, Wisconsin Craft Fair, and more
- **Open Graph / Twitter card** — when the site URL is shared on social media or iMessage, it shows a preview image (the hero photo) and title
- **JSON-LD schema** — structured data embedded in every page so Google can show a knowledge panel with your address, email, and Instagram
- **Sitemap** — auto-generated at `/sitemap.xml`, includes all product pages. Updates automatically as you add products
- **robots.txt** — auto-generated at `/robots.txt`; tells crawlers to index the site and block `/admin/` and `/api/`

### After going live

1. **Set `NEXT_PUBLIC_BASE_URL`** in your production `.env.local` to your real domain — this is used in the sitemap and JSON-LD schema:
   ```
   NEXT_PUBLIC_BASE_URL=https://oiceramics.com
   ```

2. **Submit your sitemap to Google Search Console**:
   - Go to [search.google.com/search-console](https://search.google.com/search-console)
   - Add your domain as a property
   - Go to Sitemaps → enter `sitemap.xml` → Submit
   - This is the single most effective thing you can do to speed up Google indexing

3. **Add a real OG image** — the hero photo (`/images/hero.jpg`) is used as the Open Graph preview image. Make sure it's at least 1200×630px for best results on social sharing.

---

## Stripe / Payments

Checkout is handled by [Stripe Checkout](https://stripe.com/docs/payments/checkout) — customers are redirected to Stripe's hosted payment page, then back to `/success`.

To set up:
1. Create a free account at [stripe.com](https://stripe.com)
2. Go to Developers → API Keys
3. Copy the **Secret key** (`sk_test_...`) into `STRIPE_SECRET_KEY` in `.env.local`
4. Copy the **Publishable key** (`pk_test_...`) into `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

Use the test keys (`sk_test_...`) while developing. Switch to live keys (`sk_live_...`) when the site goes live.

---

## Deploying to the Raspberry Pi

### Build for production
```bash
npm run build
```

### Run in production
```bash
npm run start
```

This starts the server on port 3000. Nginx then proxies traffic to it.

### Basic Nginx config
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Keep it running with PM2
```bash
npm install -g pm2
pm2 start npm --name "oi-ceramics" -- start
pm2 save
pm2 startup
```

This keeps the site running after reboots.

### On the Pi, set your env vars
Either create `.env.local` on the Pi, or set environment variables in PM2:
```bash
pm2 set oi-ceramics:ADMIN_PASSWORD yourpassword
pm2 set oi-ceramics:STRIPE_SECRET_KEY sk_live_...
```

---

## Quick Reference

```bash
npm run dev      # local development
npm run build    # production build
npm run start    # run production server
npm run lint     # check for code issues
```

Admin: `/admin` → sign in with your ADMIN_PASSWORD
