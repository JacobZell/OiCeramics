# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Oi Ceramics is a small handmade pottery business in Madison. The website serves as both an online storefront and a portfolio for galleries, art markets, and juried shows. The site is self-hosted on a Raspberry Pi 3B running Linux behind Nginx.

## Tech Stack

- **Framework:** Next.js
- **Styling:** Tailwind CSS (earthy, minimal, custom theme)
- **Payments:** Stripe Checkout
- **Database:** SQLite (lightweight, local)
- **Runtime:** Node.js
- **Server:** Nginx reverse proxy on Raspberry Pi 3B

## Commands

Once the project is scaffolded, typical commands will be:

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run start      # Run production server
npm run lint       # Lint code
```

## Architecture

This is a Next.js application. Expected structure once built:
- `app/` or `pages/` — Next.js routes (storefront, portfolio, contact)
- `components/` — Reusable UI components
- `lib/` — Database access (SQLite), Stripe helpers
- `public/` — Static assets and pottery photography

**Data layer:** SQLite via a lightweight ORM or raw queries. Keep queries simple — the Pi 3B has limited RAM and CPU.

**Payments:** Stripe Checkout sessions are created server-side (API route or Server Action). Never expose the Stripe secret key client-side.

**Images:** Pottery photography is the primary visual element. Use Next.js `<Image>` with proper sizing and formats (WebP preferred) to keep load times low on constrained hardware.

## Design Constraints

The aesthetic must feel handmade and artist-driven, not corporate. Key rules:

- Keep everything in the same directory. No leaving the folder
- Large pottery imagery, natural whitespace, earthy/neutral tones
- Slight asymmetry and editorial layouts are preferred over rigid grids
- No SaaS-style UI, bright gradients, excessive animations, or generic ecommerce templates
- Typography should be minimal and intentional
- Still professional

## Deployment Notes

Target hardware is a Raspberry Pi 3B (ARMv7, ~1GB RAM). Keep the build lean:
- Avoid heavy dependencies
- Use `next build` + `next start` (not dev server) in production
- Nginx proxies to the Node.js process on a local port
