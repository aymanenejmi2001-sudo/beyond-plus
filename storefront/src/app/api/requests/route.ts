import { CATALOG } from "@/data/catalog";
import { quoteCart, cartTotal, cartSignature } from "@/lib/commerce/quote";
import { guard, body, saveEvent, claimOffer } from "@/lib/commerce/server";
import { OFFER, offerDiscount, offerSecret, verifyOffer } from "@/lib/commerce/offer";
import { notifyCustomer, notifyOrder } from "@/lib/commerce/notify";
export async function POST(request: Request) {
  try {
    guard(request);
    const input = await body(request) as { lines: unknown; id: string; signature: string; firstName?: unknown; city?: unknown; phone?: unknown; address?: unknown; email?: unknown; offer?: unknown };
    const clean = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.id)) throw new Error("Référence invalide.");
    const phone = clean(input.phone, 20);
    const address = clean(input.address, 200);
    if (!/^\+?[0-9 ().-]{9,20}$/.test(phone) || phone.replace(/\D/g, "").length < 9) throw new Error("Numéro de téléphone invalide.");
    if (!address) throw new Error("Adresse de livraison manquante.");
    const email = clean(input.email, 120).toLowerCase();
    if (email && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/.test(email)) throw new Error("Adresse e-mail invalide.");
    const lines = quoteCart(input.lines, CATALOG);
    if (!lines.length) throw new Error("Votre panier est vide.");
    if (input.signature !== cartSignature(lines)) return Response.json({ error: "Le prix a changé. Vérifiez le nouveau total avant de continuer.", lines }, { status: 409 });
    // First-order offer: verified and applied here, never trusted from the browser.
    const subtotal = cartTotal(lines);
    let discount = 0;
    if (input.offer) {
      const secret = offerSecret();
      const offerId = secret ? verifyOffer(input.offer, secret) : null;
      if (!offerId) return Response.json({ error: "Ce code de remise n’est plus valable. Retirez-le pour continuer.", offerInvalid: true }, { status: 400 });
      if (!(await claimOffer(offerId, input.id))) return Response.json({ error: "Ce code de remise a déjà été utilisé. Retirez-le pour continuer.", offerInvalid: true }, { status: 400 });
      discount = offerDiscount(subtotal);
    }
    const total = subtotal - discount;
    const offer = discount ? { percent: OFFER.percent, discount } : undefined;
    let recorded = false;
    try { recorded = await saveEvent("request_prepared", { lines, subtotal, discount, total, status: "prepared" }, input.id); } catch { /* A storage outage must never be mistaken for a recorded order. */ }
    // Shop notification by e-mail. A mail failure never blocks the customer.
    let notified = false;
    try { const sent = await Promise.race([notifyOrder({ id: input.id, lines, total, offer, firstName: clean(input.firstName, 60) || "(non renseigné)", city: clean(input.city, 80) || "(non renseignée)", phone, address, email }), new Promise((r) => setTimeout(() => r("timeout"), 9000))]); notified = sent === true; console.log("[order-email]", sent === true ? "sent" : sent === false ? "skipped: SMTP_PASSWORD missing" : "timeout"); } catch (e) { console.error("[order-email] failed:", e instanceof Error ? e.message : e); }
    if (email) {
      try { const ok = await Promise.race([notifyCustomer({ id: input.id, lines, total, offer, firstName: clean(input.firstName, 60), city: clean(input.city, 80), phone, address, email }), new Promise((r) => setTimeout(() => r("timeout"), 9000))]); console.log("[customer-email]", ok === true ? "sent" : ok); }
      catch (e) { console.error("[customer-email] failed:", e instanceof Error ? e.message : e); }
    }
    return Response.json({ id: input.id, lines, subtotal, discount, total, recorded, notified }, { headers: { "Cache-Control": "no-store" } });
  } catch(e) { return Response.json({ error: e instanceof Error ? e.message : "Demande indisponible." }, { status: 400 }); }
}
