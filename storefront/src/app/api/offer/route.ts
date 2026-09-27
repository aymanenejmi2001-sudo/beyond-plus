// Issues a first-order offer code when the scratch card is revealed.
import { guard } from "@/lib/commerce/server";
import { issueOffer, OFFER, offerSecret } from "@/lib/commerce/offer";

export async function POST(request: Request) {
  try {
    guard(request);
    const secret = offerSecret();
    if (!secret) return Response.json({ error: "Offre indisponible." }, { status: 503 });
    const { code, expiresAt } = issueOffer(secret);
    return Response.json({ code, percent: OFFER.percent, expiresAt }, { headers: { "Cache-Control": "no-store" } });
  } catch { return Response.json({ error: "Offre indisponible." }, { status: 400 }); }
}
