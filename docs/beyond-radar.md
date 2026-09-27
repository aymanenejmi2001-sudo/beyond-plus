# BEYOND RADAR

Private product-intelligence system for BEYOND PLUS. It finds sneakers worth selling, scores them in a way you can explain, and moves them into the catalogue **only after a human approves**.

DISCOVER → NORMALIZE → SCORE → REVIEW → APPROVE → IMPORT → SELL → MEASURE → LEARN

The public site is unchanged. Radar adds `/admin/radar`, `src/middleware.ts` (scoped to `/admin/*` only), and the `storefront/radar/` folder. A regression build confirmed that the public CSS rules and page HTML are identical, apart from build hashes.

## Architecture

```
storefront/
  radar/
    config/scoring.ts      every weight, threshold, target and alert rule (the only place to edit them)
    lib/types.ts           row types (one per table)
    lib/store.ts           Supabase (PostgREST over fetch) or a local JSON file
    lib/auth.ts            admin session (password + HMAC cookie, Web Crypto)
    normalizers/           brand aliases, dedupe key (SKU, else brand|model|colorway)
    sources/               one adapter per source, each marked AUTOMATED / PARTIAL / MANUAL
    scoring/               components.ts (signals → 5 components), beyondScore.ts (score, confidence, learning blend)
    performance/kpis.ts    product KPIs, size distribution, recommended size mix
    services/radar.ts      all writes: candidates, signals, recompute, snapshots, alerts, decisions, orders
    catalogue/prepare.ts   approved candidate → draft in the storefront's own Product shape
    content/brief.ts       internal marketing brief (template-based)
    jobs/                  seed, daily, weekly, import (CLI)
    db/schema.sql          Supabase schema
    tests/radar.test.ts    13 tests (node:test)
  src/app/admin/           private UI (server components + server actions)
  src/middleware.ts        /admin/* auth gate + X-Robots-Tag noindex
.github/workflows/beyond-radar.yml   scheduled jobs
```

It adds no npm dependencies or services. `radar/` stays excluded from the storefront's `tsconfig` include. The admin pages import it, so the only shared config change is `"allowImportingTsExtensions": true` (safe, because `noEmit` is already true).

## Database

The same tables work in Supabase and in the local file: `brands`, `sneaker_models`, `sneaker_candidates`, `market_signals`, `morocco_signals`, `supplier_offers`, `product_approvals` (decision history), `catalogue_products` (drafts), `product_marketing_briefs`, `performance_events` (raw), `performance_metrics` (aggregates), `score_snapshots` (history), `radar_runs`, `radar_alerts`.

- **Production:** create a Supabase project, run `storefront/radar/db/schema.sql` in the SQL editor, then set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. RLS is on with no policies, so only the server-side service key can read anything.
- **Development:** with no Supabase variables, data goes to `storefront/.radar/db.json` (gitignored). Vercel's filesystem is read-only, and the dashboard warns about this.

Unknown values are stored as `null`. Snapshots are never overwritten: every recalculation adds a row.

## Scoring

```
Beyond Score = globalDemand×0.30 + moroccoDemand×0.30 + trendVelocity×0.15 + marginScore×0.15 + supplierScore×0.10
LAUNCH ≥ 75 · TEST ≥ 55 · WATCH < 55          (radar/config/scoring.ts)
```

- **Components (0–100):**
  - **Global and Morocco demand:** a reliability-weighted average of the latest value from each source. VERIFIED counts 1, MARKET 0.7, EDITORIAL 0.35. Signals older than 180 days are ignored.
  - **Structured Morocco observations** use four parts: retailers, visible colorways, availability and promotion rate. Only the parts that are known are counted.
  - **Velocity:** an explicit velocity signal if one exists. Otherwise it is the slope of repeated measured observations taken at least 7 days apart (50 means stable).
  - **Margin:** gross margin % ÷ the 45 % target. It stays unknown unless both the selling price and the full landed cost (cost + shipping) are known.
  - **Supplier:** status, coverage of sizes 36–45, and lead time.
- **Missing data:** unknown components are left out and the remaining weights are rescaled. No score is given if less than 30 % of the weight has data. The WHY THIS SCORE panel shows exactly what was used.
- **Confidence (0–100 → HIGH ≥ 70 / MEDIUM ≥ 45 / LOW)** combines:
  - the number of distinct measured sources (editorial judgment does not count)
  - freshness
  - average reliability
  - completeness

  If demand rests only on editorial judgment, confidence is capped at 40 (LOW). The same score of 83 can be LOW or HIGH, and the tests check this.
- **Learning loop:** once a product is online, BEYOND's own sales get weight. That weight is min(units / 40, 1) × 0.6, blended with the external score, and each step of the calculation is printed. It uses no machine learning.

## Sources

| Adapter | Mode | Notes |
|---|---|---|
| Supplier (Plumas Kicks) | AUTOMATED | Reads `catalog/data/products.json` from the existing polite pipeline (`npm run catalog`). The cost is the supplier's **listed price**, flagged "to confirm". Shipping, MOQ, lead time and quantities stay unknown. |
| Editorial manifest | AUTOMATED | The hand-set 0–5 ratings in `catalog/manifest.ts` × 20, stored as EDITORIAL (low reliability). |
| BEYOND performance | PARTIAL | Confirmed WhatsApp orders entered in the admin. There is no traffic tracking yet, so conversion stays unknown rather than being shown as 0 or 100. |
| Google Trends | MANUAL | No official API. Enter the 0–100 index (worldwide → global, Morocco → morocco) weekly; velocity is computed from that history. |
| StockX / resale | MANUAL | Partner-only API, and the terms forbid scraping. |
| TikTok / Instagram | MANUAL | The Research API is restricted. |
| Morocco market | MANUAL | Retailer observations with a source URL. These are market signals, not sales. Never copy competitor text or images. |
| Official brand sites | MANUAL | SKU, official price and URL go on the candidate record. The sites are bot-protected. |

Nothing bypasses logins, CAPTCHAs, Cloudflare, anti-bot measures or rate limits.

## Scheduled jobs

| Command | When | What |
|---|---|---|
| `npm run radar:seed` | once (safe to re-run) | Brands, models and candidates (53 today); editorial signals; supplier offers. Products already live are marked IMPORTED with a "baseline" decision log entry. Then a first scoring pass. |
| `npm run radar:discover` | after `npm run catalog`, from the Mac | Every supplier pair of a demanded model with ≥ 4 usable photos and sizes in stock becomes a candidate. Photos are downloaded to `public/radar-products/` (never cleaned by the catalogue pipeline). |
| `npm run radar:daily` | daily 06:00 UTC | Re-reads the supplier snapshot (no crawling), records only the changes, re-scores, raises alerts, writes performance metrics. |
| `npm run radar:weekly` | Monday 05:00 UTC | `npm run catalog` (polite supplier refresh), then the daily pass, plus a to-do list of candidates without a recent measured signal. |

The folder is not a git repository yet. The workflow in `.github/workflows/beyond-radar.yml` becomes active once it is pushed to GitHub with the two Supabase secrets. It is free and never publishes anything.

## Simple mode (default page)

`/admin/radar` shows only in-demand pairs (Fort potentiel / À tester) with at least 4 photos (`MIN_PHOTOS`, `IN_DEMAND` in `radar/config/scoring.ts`). Set the price, then **Publier**: the pair is added to the catalogue on the Mac. The bordeaux banner's **Mettre en ligne** button runs `vercel deploy --prod` from the Mac to update the live site. Pairs with fewer than 4 photos sit in a collapsed group where the owner can upload their own photos.

## Admin usage

- Go to `/admin/radar` and log in with `RADAR_ADMIN_PASSWORD`. The session lasts 12 hours in an httpOnly, SameSite=strict cookie limited to `/admin`. If no password is set, the admin stays closed.
- **Views:** new opportunities, launch / test candidates, watchlist, approved, online, rejected / archived, and search. Each row shows score and change, recommendation, confidence, the five components, status, last update, and the actions Approve, Test, Watch, Reject and Details.
- **Detail page:**
  - identity and editing
  - the score, a history chart, and a weekly table
  - WHY THIS SCORE and the confidence breakdown
  - forms to add a market signal, a Morocco observation or a supplier offer (each form asks for the source URL)
  - the margin calculation
  - decisions and their history
  - the catalogue draft and the marketing brief
  - KPIs, the size distribution, and "record a confirmed order"
- **Alerts** appear on the dashboard:
  - crossing 75
  - a jump of 10 points or more
  - Morocco demand up 15 or more
  - margin under 30 %
  - supplier out of stock
  - a weak candidate that is accelerating
  - an online product whose sales drop

## Approval and catalogue import

1. **Approve** changes the status to APPROVED and generates a marketing brief. Nothing is published.
2. **Approve & prepare** also creates a catalogue draft with `publishable = false`. It uses the exact `Product` shape the storefront already renders, and reuses the supplier's authorized images and the existing copy when the candidate is linked to one. The draft lists what is missing: price, images, sizes, colorway.
3. **Mark ready** only works on an approved candidate whose draft has no missing items. It sets `publishable = true` and the status to READY.
4. **Import** is a human-run command only:
   - `npm run radar:import` is a dry run.
   - `npm run radar:import -- --write` appends READY drafts to `src/data/catalog.json` and marks the candidates IMPORTED.

   Then rebuild and deploy. Run the import again after `npm run catalog`, because that command rewrites `catalog.json`.

## Environment variables

| Variable | Where | Purpose |
|---|---|---|
| `RADAR_ADMIN_PASSWORD` | Vercel + local | Admin password (required to open the admin). |
| `RADAR_SESSION_SECRET` | optional | Cookie signing key (defaults to the password). |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Vercel + GitHub secrets | Production storage. Server-only, never `NEXT_PUBLIC_`. |
| `RADAR_DATA_FILE` | optional | Path of the local JSON store. |

## Limitations (V1)

- Demand signals are mostly entered by hand, and editorial ratings keep confidence LOW until measured signals are added.
- Selling prices, real supplier costs and shipping are unknown, so margin is unknown everywhere today.
- There are no site analytics, so views, carts and conversion are not tracked. Sales come only from orders entered in the admin.
- Single shared admin password, with no per-user roles.
- The catalogue import writes the static JSON catalogue. A Shopify switch would need a new import target.
- Supplier products are declared replicas. The brief and draft never claim authenticity, but the legal exposure of the underlying catalogue is a business decision outside Radar.
