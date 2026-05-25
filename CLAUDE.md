# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Oi Ceramics is a small handmade pottery business in Madison. The website serves as both an online storefront and a portfolio for galleries, art markets, and juried shows. The site is self-hosted on a Raspberry Pi 3B running Linux behind Nginx, accessible on the local network at `http://ceramics.local`.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 (earthy, minimal, custom theme via `@theme` in globals.css — no tailwind.config.js)
- **Payments:** Stripe Checkout (server-side session creation only, never client-side)
- **Database:** SQLite via `better-sqlite3` (singleton pattern in `lib/db.ts`)
- **Runtime:** Node.js 20
- **Process manager:** PM2 (keeps site running, restarts on reboot)
- **Server:** Nginx reverse proxy on Raspberry Pi 3B

## Commands

```bash
npm run dev        # Local development server (port 3000)
npm run build      # Production build (required before deploying)
npm run start      # Run production server
npm run lint       # Lint code
```

## Architecture

- `app/` — Next.js App Router routes
- `components/` — Reusable UI components
- `components/admin/` — Admin panel forms and controls
- `lib/` — Database (`db.ts`), Stripe (`stripe.ts`), auth (`auth.ts`)
- `public/images/` — Pottery photography and page images
- `proxy.ts` — Route protection middleware (Next.js 16 uses `proxy.ts`, not `middleware.ts`)

**Data layer:** SQLite via `better-sqlite3`. Singleton pattern using `global._db` to survive hot reloads. Database auto-creates at `data/ceramics.db` and seeds example products on first run.

**Payments:** Stripe is lazily initialized via `getStripe()` in `lib/stripe.ts` to avoid build-time errors when env vars aren't set.

**Auth:** Admin routes protected by `proxy.ts`. Cookie `oi-admin-token` stores the password plaintext, checked against `ADMIN_PASSWORD` env var.

**Fonts:** Cormorant Garamond (serif, headings) + DM Sans (sans, body/logo) via `next/font/google`.

**Middleware:** Must be in `proxy.ts` with `export function proxy` — Next.js 16 renamed middleware.

## Environment Variables

Never commit `.env.local` — it's gitignored. Set manually on each machine.

```
ADMIN_PASSWORD=        # Password for /admin panel
GMAIL_USER=            # Gmail address for contact form forwarding
GMAIL_APP_PASSWORD=    # Google App Password (not regular Gmail password)
STRIPE_SECRET_KEY=     # sk_test_... or sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=  # pk_test_... or pk_live_...
NEXT_PUBLIC_BASE_URL=  # http://localhost:3000 locally, http://ceramics.local on Pi
```

## Design Constraints

The aesthetic must feel handmade and artist-driven, not corporate:

- Large pottery imagery, natural whitespace, earthy/neutral tones
- Slight asymmetry and editorial layouts preferred over rigid grids
- No SaaS-style UI, bright gradients, excessive animations, or generic ecommerce templates
- Typography minimal and intentional
- Color palette defined in `app/globals.css` `@theme` block — cream, parchment, sand, clay, earth, bark, ash, sage

## Pi Deployment

### Infrastructure

- **Hardware:** Raspberry Pi 3B (ARMv7, 1GB RAM) on local network
- **OS:** Raspberry Pi OS Lite 64-bit (Bookworm)
- **Hostname:** `ceramics` — accessible at `ceramics.local` on the local network
- **User:** `oi`
- **Project location:** `/home/oi/oi-ceramics`
- **Process manager:** PM2 (`pm2 status`, `pm2 logs oi-ceramics`)
- **Web server:** Nginx proxying port 80 → localhost:3000
- **SSH:** Key-based only (password auth disabled). Connect via PowerShell: `ssh oi@ceramics.local`

### Deploying Updates

On the Windows dev machine, commit and push changes:

```powershell
cd "C:\src\oi ceramics website"
git add .
git commit -m "your message"
git push
```

On the Pi:

```bash
cd ~/oi-ceramics
git pull
npm run build
pm2 restart oi-ceramics
```

Build takes 5–10 minutes on the Pi 3B — that's normal.

### Useful Pi Commands

```bash
pm2 status                    # Check if site is running
pm2 logs oi-ceramics          # Live logs
pm2 restart oi-ceramics       # Restart after changes
sudo systemctl restart nginx  # Restart web server
sudo nginx -t                 # Test Nginx config before restarting
```

### If the Site Goes Down

```bash
pm2 status          # Is the process running?
pm2 logs oi-ceramics  # What's the error?
# If .next is missing:
npm run build && pm2 restart oi-ceramics
```

### Pi SSH Config Notes

- Password auth is disabled — key only
- Drop-in config at `/etc/ssh/sshd_config.d/50-cloud-init.conf` overrides main sshd_config
- Edit that file if SSH config changes are needed, not just `/etc/ssh/sshd_config`
