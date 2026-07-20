# TroyX iStore

Premium, production-ready e-commerce starter for TroyX iStore, an independent retailer of genuine Apple devices and accessories.

## Stack

- Next.js App Router, React, TypeScript, Tailwind CSS
- Supabase-ready service layer
- React Hook Form and Zod validation
- Zustand cart, wishlist, compare, and recently viewed state
- Framer Motion dependency ready for richer animation
- Cloudinary upload intent placeholder
- SEO metadata, sitemap, robots, structured product data
- Admin, AI assistant, trade-in, repair booking, checkout, account, and policy pages

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

On Windows PowerShell with restricted scripts, use:

```bash
npm.cmd install
npm.cmd run dev
```

## Environment

Copy `.env.example` to `.env.local` and replace the placeholder values.

Supabase can be used for authentication, product storage, orders, roles, and audit logs. Cloudinary can be connected for product images and repair photo uploads. Payment providers are intentionally abstracted in `services/payment.ts`.

## Demo Data

Sample products live in `database/products.ts`. A SQL starter schema is in `database/schema.sql`, and seed-oriented demo content is exported from `database/seed.ts`.

## Production Notes

- Add Supabase Auth middleware and role claims before enabling real admin writes.
- Replace demo CSRF handling with signed session-bound tokens.
- Move rate limiting to Redis or an edge provider.
- Connect payment adapters such as Stripe, Paystack, Flutterwave, mobile money, or bank transfer.
- Replace placeholder SVG product visuals with real Cloudinary product photography.
- Keep the independent-retailer disclaimer visible in legal and footer areas.
