# BEYOND RADAR — next ideas (not implemented)

Ordered roughly by value ÷ effort. None of these is built; each needs a decision first.

1. **Site event tracking.** Add a tiny `/api/radar/events` endpoint (views, add to cart, checkout started) called from the product page, cart and checkout. This unlocks VIEW_TO_CART, CART_TO_CHECKOUT and conversion. It touches public components, so it needs sign-off and must not change visuals. If GA4 or the Meta Pixel is installed later, read from them instead of duplicating events.
2. **Set real selling prices and supplier costs.** This fills the margin component, which is unknown everywhere today, and makes the margin alert meaningful.
3. **Polite collection from Moroccan Shopify retailers.** Read their public `/products.json` with the existing `catalog/lib/http.ts` (robots.txt, 1 request per 1.2 s, cache) to count retailers, colorways, prices and promotions automatically. Record facts only, never copy text or images.
4. **Google Trends CSV import.** Upload the CSV exported from trends.google.com and create weekly signals in bulk, instead of typing each one.
5. **Per-user admin accounts** (Supabase Auth or Vercel SSO) with the actor recorded on each decision.
6. **Recommended size mix into purchasing:** once 20 or more pairs have sold per model, generate a draft purchase order split by size.
7. **Email or WhatsApp digest of the week's alerts** (currently dashboard-only by design).
8. **Shopify import target** for the catalogue drafts when the store moves to Shopify (`theme/`, `shopify-import/`). The draft shape already mirrors the Storefront API.
9. **Model-level rollups:** aggregate colorway candidates per model to show which silhouette is rising, separately from which colorway sells.
10. **Calibration:** once enough products have been launched, compare past Beyond Scores with actual 60-day sales, and adjust the weights in `radar/config/scoring.ts` by hand, keeping them transparent.
