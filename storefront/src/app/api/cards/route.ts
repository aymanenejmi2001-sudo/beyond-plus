// Card data for client-side lists (wishlist, recently viewed, cart suggestions).
// ?handles=a,b,c → those products in that order; ?related=handle → suggestions.
import { PRODUCT_BY_HANDLE } from "@/data/catalog";
import { getRelatedProducts, toCard } from "@/lib/shopify";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const related = url.searchParams.get("related");
  const limit = Math.min(6, Math.max(1, Number(url.searchParams.get("limit")) || 4));
  let products;
  if (related) {
    const p = PRODUCT_BY_HANDLE.get(related);
    products = p ? (await getRelatedProducts(p, limit)).filter((r) => r.availableForSale) : [];
  } else {
    products = (url.searchParams.get("handles") ?? "").split(",").slice(0, 24)
      .map((h) => PRODUCT_BY_HANDLE.get(h)).filter((p) => !!p).map((p) => toCard(p!));
  }
  return Response.json(products, { headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" } });
}
