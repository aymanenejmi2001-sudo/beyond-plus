// Shared by the server (authoritative) and the checkout display (estimate).
export const OFFER_KEY = "beyondplus.offer.v1";
export const OFFER_SEEN_KEY = "beyondplus.offer.seen";
/** Fired on window when an offer is revealed or removed. */
export const OFFER_EVENT = "beyond:offer";
export interface StoredOffer { code: string; percent: number; expiresAt: number }
/** Discount in whole dirhams on the items total. */
export const discountFor = (total: number, percent: number) => Math.max(0, Math.round((total * percent) / 100));

export function readOffer(): StoredOffer | null {
  try {
    const o = JSON.parse(localStorage.getItem(OFFER_KEY) ?? "null") as StoredOffer | null;
    return o && typeof o.code === "string" && o.expiresAt > Date.now() ? o : null;
  } catch { return null; }
}
export function clearOffer() {
  try { localStorage.removeItem(OFFER_KEY); } catch { /* private mode */ }
  window.dispatchEvent(new Event(OFFER_EVENT));
}
