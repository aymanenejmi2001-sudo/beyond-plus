export const CONSENT_KEY = "beyond.measurement";
export type EventName =
  | "view_product" | "add_to_cart" | "begin_checkout" | "whatsapp_click"
  | "view_item" | "select_size" | "open_cart" | "remove_from_cart" | "wishlist_add"
  | "search" | "view_item_list" | "select_item" | "notify_me";
/** Events the first-party store keeps (the others would exceed the free Blob quota). */
const STORED = new Set<EventName>(["view_product", "add_to_cart", "begin_checkout", "whatsapp_click"]);
type Params = Record<string, string | number | undefined>;

// Opt-in only. No URL, contact details, address, advertising IDs or client identifier.
// Every event is also pushed to window.dataLayer in GA4 shape, ready for a tag
// manager once one is installed; nothing leaves the browser from there until then.
export function track(name: EventName, product?: string, params: Params = {}) {
  try {
    if (localStorage.getItem(CONSENT_KEY) !== "yes") return;
    const w = window as unknown as { dataLayer?: unknown[] };
    (w.dataLayer ??= []).push({ event: name, item_id: product, currency: "MAD", ...params });
    if (STORED.has(name)) void fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, product }), keepalive: true }).catch(() => undefined);
  } catch { /* Private browsing: measurement is optional. */ }
}
