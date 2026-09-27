import { CATALOG } from "@/data/catalog";
import { guard, body, saveEvent } from "@/lib/commerce/server";
export async function POST(request: Request) {
  try {
    guard(request);
    const input = await body(request) as { name: string; product?: string };
    if (!["view_product", "add_to_cart", "begin_checkout", "whatsapp_click"].includes(input.name)) throw new Error("Événement invalide.");
    const product = CATALOG.some(p => p.handle === input.product) ? input.product : undefined;
    const stored = await saveEvent(input.name, { product });
    return Response.json({ stored }, { status: stored ? 200 : 503 });
  } catch { return Response.json({ stored: false }, { status: 400 }); }
}
