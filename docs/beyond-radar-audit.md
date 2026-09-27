# BEYOND RADAR — repository audit (2026-09-24)

## What exists

| Area | Finding |
|---|---|
| Framework | Next.js 15.5 (App Router), React 19, TypeScript strict. No other runtime deps. Node 24 locally. |
| Frontend | `storefront/src/app/*` — home, `collections/[handle]`, `products/[handle]`, checkout, account, editorial pages. CSS Modules + `src/styles/tokens.css`. All public pages are statically generated. |
| Product data | Static. `catalog/build.ts` (run with `npm run catalog`) pulls the supplier (Plumas Kicks, public Shopify `products.json`), matches it against `catalog/manifest.ts` (target families + editorial 0–5 signals), scores it (`catalog/score.ts`), and writes `src/data/catalog.json` (Storefront-API-shaped `Product[]`, publishable only) + `catalog/data/products.json` (all 57 normalized products, incl. non-publishable). |
| Data access | `src/lib/shopify/index.ts` reads the JSON; shapes mirror the Shopify Storefront API for a future Shopify switch. `theme/` + `shopify-import/` hold a Shopify theme and a draft CSV. |
| Database | None. |
| Deployment | Vercel project `beyond-plus` (CLI deploys, `vercel deploy --prod`). Not a git repository. |
| Product images | Downloaded and re-encoded to `public/products/*.webp` by `catalog/images.ts`, only when the source is an authorized supplier. Brand/lookbook art in `public/images/`. |
| Environment variables | `.env.local` holds only `VERCEL_OIDC_TOKEN`. Code reads `NEXT_PUBLIC_SITE_STATUS` (indexing) and `NEXT_PUBLIC_SITE_URL`. |
| Analytics | None (no GA4, no Meta Pixel, no tag manager). |
| Orders | No payment. Cart → prefilled WhatsApp message. No order data is stored anywhere. |
| Admin tools | None. No auth. |
| Indexing | `robots.txt` disallows all; layout sets `noindex` until `NEXT_PUBLIC_SITE_STATUS=live`. |
| Existing scoring | `catalog/score.ts`: 0–100 "trendScore", mostly `EDITORIAL_JUDGMENT` (hand-set 0–5 values in the manifest), plus two verified supplier signals (best-seller list, publication date). Honest provenance labels already exist. |

## Findings at audit time

- **The production build was already failing** before any Radar work: `src/components/search/SearchOverlay.tsx` imports `searchProducts` from `@/lib/shopify`, which no longer exports it (search appears to be moving to `public/search-index.json`). Another editing session was active on the storefront at the same time. Radar does not touch these files.
- The build writes `.next` in place, so a failed build can disturb the running `next start` preview.

## Reuse

- `catalog/lib/http.ts` — polite fetch (robots.txt, per-host throttle, cache, no retry on 401/403/429). Radar sources reuse its rules.
- `catalog/data/products.json` — real supplier offers (price, available sizes, URL) → seed `supplier_offers`.
- `catalog/manifest.ts` — the priority families and their editorial signals → seed candidates and `market_signals` with source `EDITORIAL` (low reliability, so confidence stays LOW until real signals arrive).
- `Product` type (`src/lib/shopify/types.ts`) — the catalogue preparation output uses this exact shape, so an approved candidate drops into existing cards/pages without visual change.

## Do not touch

`src/app/**` public routes and layout, `src/components/**`, `src/styles/**`, `src/data/**`, `catalog/**` pipeline, `public/**`, `theme/`, `shopify-import/`. Radar never writes `src/data/catalog.json`.

## Conflicts / decisions

1. **Admin chrome.** The root layout renders the public header/footer on every route. Splitting into route groups would move every public file (and collide with the concurrent edit), so `/admin/*` renders inside a full-viewport shell layered above the public chrome instead. No public file changes.
2. **Database.** Supabase is the target (SQL migration in `storefront/radar/db/schema.sql`), accessed through PostgREST with `fetch` — no new npm dependency. Without Supabase env vars, Radar falls back to a local JSON store (`storefront/.radar/db.json`) for development. Vercel's filesystem is read-only, so production needs Supabase.
3. **Auth.** No auth provider exists; V1 uses a single admin password (`RADAR_ADMIN_PASSWORD`) and an HMAC-signed, httpOnly cookie, enforced in `middleware.ts` and again in every server action.
4. **Sales data.** No ecommerce data exists (WhatsApp orders). Radar adds a manual "record confirmed order" form; that is the only first-party sales source until a checkout or analytics exists.
5. **Supplier cost.** The supplier's listed price is the only cost data point. It is stored with `cost_basis = SUPPLIER_LISTED_PRICE` and flagged "to confirm"; shipping stays unknown. BEYOND selling prices are not set (README), so margin stays unknown until the admin enters a selling price.
