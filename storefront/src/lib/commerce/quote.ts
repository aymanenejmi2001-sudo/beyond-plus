import type { CartLine, Product } from "../shopify/types.ts";

export interface CartInput { handle: string; variantId: string; quantity: number }
export function quoteCart(input: unknown, products: Product[]): CartLine[] {
  if (!Array.isArray(input) || input.length > 50) throw new Error("Panier invalide.");
  const merged = new Map<string, CartLine>();
  for (const raw of input) {
    if (!raw || typeof raw !== "object") throw new Error("Article invalide.");
    const { handle, variantId, quantity } = raw as CartInput;
    if (typeof handle !== "string" || typeof variantId !== "string" || !Number.isInteger(quantity) || quantity < 1 || quantity > 10) throw new Error("Quantité invalide (1 à 10 par pointure).");
    const p = products.find(p => p.handle === handle);
    const v = p?.variants.find(v => v.id === variantId);
    if (!p || p.previewOnly || !v?.availableForSale) throw new Error("Une paire ou une pointure n’est plus disponible. Modifiez votre panier avant de continuer.");
    const price = Number(v.price.amount);
    if (!Number.isFinite(price) || price <= 0) throw new Error("Prix indisponible. Contactez-nous avant de commander.");
    const qty = quantity + (merged.get(v.id)?.quantity ?? 0);
    if (qty > 10 || (v.quantityAvailable !== null && qty > v.quantityAvailable)) throw new Error("La quantité demandée n’est pas disponible.");
    merged.set(v.id, {
      id: `line:${v.id}`, quantity: qty,
      merchandise: { id: v.id, title: v.title, selectedOptions: v.selectedOptions, image: v.image ?? p.featuredImage, price: v.price, product: { handle: p.handle, title: p.title } },
      cost: { totalAmount: { amount: (Math.round(price * 100) * qty / 100).toFixed(2), currencyCode: "MAD" } },
    });
  }
  return [...merged.values()];
}
export const cartInput = (lines: CartLine[]): CartInput[] => lines.map(l => ({ handle: l.merchandise.product.handle, variantId: l.merchandise.id, quantity: l.quantity }));
export const cartTotal = (lines: CartLine[]) => lines.reduce((n, l) => n + Math.round(Number(l.cost.totalAmount.amount) * 100), 0) / 100;
export const cartSignature = (lines: CartLine[]) => JSON.stringify(lines.map(l => [l.merchandise.id, l.quantity, l.merchandise.price.amount]).sort((a,b) => String(a[0]).localeCompare(String(b[0]))));
