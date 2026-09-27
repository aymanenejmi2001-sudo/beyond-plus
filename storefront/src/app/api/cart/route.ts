import { CATALOG } from "@/data/catalog";
import { quoteCart } from "@/lib/commerce/quote";
import { guard, body } from "@/lib/commerce/server";
export async function POST(request: Request) {
  try { guard(request); return Response.json({ lines: quoteCart(await body(request), CATALOG) }, { headers: { "Cache-Control": "no-store" } }); }
  catch (e) { return Response.json({ error: e instanceof Error ? e.message : "Panier indisponible." }, { status: 400 }); }
}
