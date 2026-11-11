# TroyX iStore — Platform & Visual Admin Control Center

> **Home of Original Apple Products**  
> **Location:** Bawaleshie, East Legon, Accra, Ghana  
> **Contact:** 0207137437 / 0548974717 | **TikTok:** [@troyx_istore](https://tiktok.com/@troyx_istore)  
> **Currency:** Ghana Cedi (GH₵)  
> **Design Philosophy:** Premium monochrome Apple-inspired aesthetic (black, white, subtle neutrals)

---

## 1. Architectural Mission & Initial Public State

TroyX iStore is an enterprise-grade ecommerce website and visual content management system (CMS) engineered from the ground up for independent Apple electronics retailing in Accra, Ghana.

### Strict Initial Public Zero-State:
- **No fabricated products, stock, or placeholder photos presented as real.**
- **No fake customer reviews, fictional discounts, or arbitrary prices.**
- **The live homepage launches with the TroyX header, footer, and a clean, intentionally empty main content canvas.**
- The owner publishes real devices and showcase banners on their own schedule directly via the **TroyX Control Center (`/admin`)** without modifying application source code.

---

## 2. Exact Homepage Draft Structure

The CMS comes pre-seeded with the **exact six draft sections in required sequence**:

| Slot | Draft Label | Theme | Initial State | Media Type |
|---|---|---|---|---|
| 1 | **iPhone 18 Pro — dark** | Dark (`#000000`) | Unpublished Draft | Configurable (Image/Video) |
| 2 | **iPhone Duo — white** | White (`#ffffff`) | Unpublished Draft | Configurable (Image/Video) |
| 3 | **MacBook Pro — dark** | Dark (`#000000`) | Unpublished Draft | Configurable (Image/Video) |
| 4 | **Apple Watch Series 12 — white** | White (`#ffffff`) | Unpublished Draft | Configurable (Image/Video) |
| 5 | **iPad A16 — white** | White (`#ffffff`) | Unpublished Draft | Configurable (Image/Video) |
| 6 | **AirPods Pro 3 — dark** | Dark (`#000000`) | Unpublished Draft | Configurable (Image/Video) |

> **Note:** These names are admin-side draft labels. They remain completely hidden from the public website until an administrator explicitly publishes them.

---

## 3. Public Route Skeletons (20+ Responsive Routes)

Every public route is responsive and designed with high visual hierarchy:
- `/` — Homepage (displays clean empty state or published cinematic showcases)
- `/store` — All Apple Products showcase framework
- `/iphone` — iPhone category framework
- `/mac` — Mac & MacBook framework
- `/ipad` — iPad framework
- `/watch` — Apple Watch framework
- `/airpods` — AirPods framework
- `/accessories` — Original MagSafe & Apple accessories
- `/product/[slug]` — Detailed product configurator (storage, color, SIM configuration, battery health %, Ghana cedi pricing, WhatsApp checkout)
- `/learn-more/[slug]` — Cinematic interactive storytelling builder
- `/compare` — Device comparison matrix
- `/deals` — Seasonal promotions and trade-in packages
- `/cart` — Shopping bag
- `/checkout` — Checkout supporting Bawaleshie showroom pickup or Greater Accra delivery with server-validated pricing
- `/order-confirmation/[id]` — Order summary with direct WhatsApp transmit button
- `/about` — About TroyX iStore in Bawaleshie, East Legon
- `/contact` — Showroom directions, direct phone lines, TikTok channel
- `/delivery` — Delivery policy across Greater Accra & regional VIP couriers
- `/warranty` — Warranty and hardware diagnostic guarantee
- `/privacy` — Privacy policy
- `/terms` — Terms of use

---

## 4. TroyX Control Center Modules (`/admin`)

1. **Dashboard Overview:** Real metrics for catalog stock, active orders, verified revenue, and draft counters.
2. **Visual Page Manager:** Manage titles, URLs, SEO descriptions, publish states, and revision histories.
3. **Advanced Section Builder:** 18+ reusable component schemas (cinematic hero, video hero, split story, tech specs, comparisons, media galleries). Accessible reordering controls (Move Up / Down).
4. **Cinematic Media Management:** Drag-and-drop image and video uploads, focal point configuration, alt-text indexing, metadata validation, video autoplay/muted controls.
5. **Learn More Page Builder:** Modular deep-dive section composer for flagship devices.
6. **Product Catalog Manager:** Full lifecycle management (Condition, SIM type, Battery Health %, Stock, SKU, GH₵ pricing).
7. **Pricing & Inventory Engine:** Server-side price validation preventing client-side cart tampering.
8. **Orders & Purchase Requests:** Order tracking and instant pre-formatted WhatsApp customer communication.
9. **Navigation & Footer Editor:** Drag-and-drop category links and directory columns.
10. **Promotions Manager:** Coupon codes, scheduled dates, and discount rules.
11. **SEO & Sitemaps:** Dynamic `sitemap.xml` generated strictly from published routes.
12. **Publishing & Version Control:** Version snapshots and instant rollback.
13. **Admin Security:** Role-Based Access Control (Owner, Editor, Viewer), secure cookies, script injection prevention.

---

## 5. Quick Start Instructions

### Development Server:
```bash
npm run dev
# Server starts at http://localhost:3000
# Admin Console: http://localhost:3000/admin
```

### Production Build:
```bash
npm run build
npm run start
```

### Run End-to-End Acceptance Tests (16 Tests):
```bash
npm run test:acceptance
```

---

## 6. How the Store Owner Publishes the First Homepage Showcase

1. Navigate to `http://localhost:3000/admin` (or `https://your-domain.com/admin`).
2. Log in with staff credentials:
   - **Email:** `owner@troyxistore.com`
   - **Passcode:** `TroyX@2026!`
3. Click **Cinematic Media** in the left sidebar and upload your product photograph or render (e.g. `iphone-18-pro.webp`).
4. Click **Copy URL** on the uploaded asset card.
5. Navigate to **Pages & Sections** -> click **Manage Sections** on the `home` page.
6. On Slot 1 (**iPhone 18 Pro — dark**), click **Edit**:
   - Paste the copied image URL into **Desktop Image URL**.
   - Enter your headline (e.g. `iPhone 18 Pro`).
   - Enter your subtitle (e.g. `Titanium. So strong. So light. So Pro.`).
   - Set Learn More link to `/iphone` and Buy link to `/store`.
   - Click **Save Section**.
7. Click the **Publish** toggle button on Slot 1.
8. Visit the public homepage at `http://localhost:3000` — the showcase is now instantly live!

---

## 7. Cloud Supabase Production Migration

When connecting to your cloud Supabase database:
1. Create a project at [supabase.com](https://supabase.com).
2. Run the SQL schema found in `supabase/migrations/20261109000000_troyx_initial_schema.sql` in the Supabase SQL Editor.
3. Add your keys to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
