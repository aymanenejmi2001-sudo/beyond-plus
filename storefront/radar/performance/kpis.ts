// Product KPIs and size intelligence — BEYOND first-party data only.
// Traffic (views) and demand (purchases) are reported separately and never
// substituted for one another.

import type { PerformanceEvent } from "../lib/types.ts";

export interface Kpis {
  windowDays: number | null;
  views: number; addToCart: number; checkoutStarted: number; purchases: number; units: number; revenueMAD: number; refunds: number;
  VIEW_TO_CART: number | null; CART_TO_CHECKOUT: number | null; CHECKOUT_TO_PURCHASE: number | null;
  PRODUCT_CONVERSION_RATE: number | null; REVENUE: number; UNITS_SOLD: number; AOV: number | null;
  sizeMix: Record<string, number>;          // units per size
  hasTraffic: boolean;                       // site events exist (views/cart) — otherwise ratios stay null
  sources: string[];
}

const pct = (a: number, b: number) => (b > 0 ? Math.round((a / b) * 1000) / 10 : null);

export function computeKpis(events: PerformanceEvent[], windowDays: number | null = null, now = Date.now()): Kpis {
  const rows = windowDays == null ? events : events.filter((e) => now - Date.parse(e.occurred_at) <= windowDays * 864e5);
  const sum = (ev: PerformanceEvent["event"], f: (e: PerformanceEvent) => number = (e) => e.quantity || 1) =>
    rows.filter((e) => e.event === ev).reduce((n, e) => n + f(e), 0);
  const views = sum("view", () => 1), addToCart = sum("add_to_cart", () => 1), checkoutStarted = sum("checkout_started", () => 1);
  const purchaseRows = rows.filter((e) => e.event === "purchase");
  const purchases = new Set(purchaseRows.map((e) => e.reference ?? e.id)).size;
  const units = sum("purchase"), refunds = sum("refund");
  const revenueMAD = purchaseRows.reduce((n, e) => n + (e.revenue_mad ?? 0), 0) - rows.filter((e) => e.event === "refund").reduce((n, e) => n + (e.revenue_mad ?? 0), 0);
  const sizeMix: Record<string, number> = {};
  for (const e of purchaseRows) if (e.size) sizeMix[e.size] = (sizeMix[e.size] ?? 0) + (e.quantity || 1);
  const hasTraffic = views > 0;
  return {
    windowDays, views, addToCart, checkoutStarted, purchases, units, revenueMAD, refunds,
    VIEW_TO_CART: hasTraffic ? pct(addToCart, views) : null,
    CART_TO_CHECKOUT: addToCart ? pct(checkoutStarted, addToCart) : null,
    CHECKOUT_TO_PURCHASE: checkoutStarted ? pct(purchases, checkoutStarted) : null,
    PRODUCT_CONVERSION_RATE: hasTraffic ? pct(purchases, views) : null,
    REVENUE: revenueMAD, UNITS_SOLD: units, AOV: purchases ? Math.round(revenueMAD / purchases) : null,
    sizeMix, hasTraffic, sources: [...new Set(rows.map((e) => e.source))],
  };
}

/** Share of units per size, in percent, sorted by size. Empty when nothing sold. */
export function sizeDistribution(mix: Record<string, number>): { size: string; units: number; pct: number }[] {
  const total = Object.values(mix).reduce((a, b) => a + b, 0);
  if (!total) return [];
  return Object.entries(mix)
    .sort((a, b) => Number(a[0]) - Number(b[0]) || a[0].localeCompare(b[0]))
    .map(([size, units]) => ({ size, units, pct: Math.round((units / total) * 1000) / 10 }));
}

/** Recommended buy mix for N pairs, from actual sales only. Null below the minimum sample. */
export function recommendedSizeMix(mix: Record<string, number>, pairs: number, minUnits = 20) {
  const dist = sizeDistribution(mix);
  const total = dist.reduce((n, d) => n + d.units, 0);
  if (total < minUnits) return { ready: false as const, total, minUnits };
  return { ready: true as const, total, minUnits, plan: dist.map((d) => ({ size: d.size, pairs: Math.round((d.pct / 100) * pairs) })) };
}
