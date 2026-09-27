import type { CartLine, Product, ProductVariant } from "@/lib/shopify/types";

export const CONSENT_KEY = "beyond.measurement";
export type EventName =
  | "view_product" | "add_to_cart" | "begin_checkout" | "whatsapp_click"
  | "view_item" | "view_item_list" | "select_item" | "select_size" | "remove_from_cart"
  | "view_cart" | "purchase" | "search" | "wishlist_add" | "notify_me"
  | "view_promotion" | "select_promotion";
/** Events the first-party store keeps (the others would exceed the free Blob quota). */
const STORED = new Set<EventName>(["view_product", "add_to_cart", "begin_checkout", "whatsapp_click"]);
const CURRENCY = "MAD";

/** GA4 item, built only from data the catalogue really has. */
export interface EcommerceItem {
  item_id: string;
  item_name?: string;
  item_brand?: string;
  item_category?: string;
  item_variant?: string;
  price?: number;
  quantity?: number;
}
export interface Ecommerce { currency?: string; value?: number; items?: EcommerceItem[]; [key: string]: unknown }
type Params = { ecommerce?: Ecommerce; [key: string]: string | number | undefined | Ecommerce };

const clean = <T extends object>(o: T) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== "")) as T;

export function productItem(product: Product, variant?: ProductVariant | null, quantity?: number): EcommerceItem {
  const price = Number((variant?.price ?? product.priceRange.minVariantPrice).amount);
  return clean({
    item_id: product.handle,
    item_name: product.title,
    item_brand: product.merch?.brand ?? product.vendor,
    item_category: product.productType,
    item_variant: variant?.title,
    price: Number.isFinite(price) ? price : undefined,
    quantity,
  });
}

export function lineItem(line: CartLine): EcommerceItem {
  return clean({
    item_id: line.merchandise.product.handle,
    item_name: line.merchandise.product.title,
    item_variant: line.merchandise.selectedOptions.find((o) => o.name === "Size")?.value ?? line.merchandise.title,
    price: Number(line.merchandise.price.amount),
    quantity: line.quantity,
  });
}

/** GA4 promotion (hero, featured drop). */
export function promotion(p: { id: string; name: string; creative?: string; location: string }): Ecommerce {
  return clean({ promotion_id: p.id, promotion_name: p.name, creative_name: p.creative, location_id: p.location, items: [] });
}

export function ecommerce(items: EcommerceItem[], extra: Ecommerce = {}): Ecommerce {
  const value = items.reduce((n, i) => n + (i.price ?? 0) * (i.quantity ?? 1), 0);
  return { currency: CURRENCY, value, items, ...extra };
}

// Opt-in only. No URL, contact details, address, advertising IDs or client identifier.
// Every event is pushed to window.dataLayer in GA4 / GTM shape; nothing leaves the
// browser from there until a tag manager is installed. Never throws.
export function track(name: EventName, product?: string, params: Params = {}) {
  try {
    if (localStorage.getItem(CONSENT_KEY) !== "yes") return;
    const { ecommerce: ec, ...rest } = params;
    const w = window as unknown as { dataLayer?: unknown[] };
    const layer = (w.dataLayer ??= []);
    if (ec) layer.push({ ecommerce: null }); // GA4: clear the previous ecommerce object
    layer.push(clean({ event: name, ...(ec ? { ecommerce: ec } : { item_id: product, currency: CURRENCY }), ...rest }));
    if (STORED.has(name)) void fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, product }), keepalive: true }).catch(() => undefined);
  } catch { /* Private browsing or no storage: measurement is optional. */ }
}
