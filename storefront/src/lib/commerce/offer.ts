// First-order offer (scratch card). The code is issued by the server, signed
// with a secret and valid 7 days; the discount is computed and applied only on
// the server when the order is placed, and each code can be used once.
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { discountFor } from "./offer-shared.ts";

export const OFFER = { percent: 15, days: 7 } as const;

const sign = (secret: string, data: string) => createHmac("sha256", secret).update(data).digest("base64url").slice(0, 22);

export function issueOffer(secret: string, now = Date.now()) {
  const id = randomBytes(9).toString("base64url");
  const exp = Math.floor(now / 1000) + OFFER.days * 86400;
  const data = `${id}.${exp}`;
  return { code: `BP${OFFER.percent}.${data}.${sign(secret, data)}`, expiresAt: exp * 1000 };
}

/** Returns the offer id when the code is authentic and not expired, else null. */
export function verifyOffer(code: unknown, secret: string, now = Date.now()): string | null {
  if (typeof code !== "string" || code.length > 80) return null;
  const m = code.match(/^BP(\d{1,2})\.([A-Za-z0-9_-]{12})\.(\d{10})\.([A-Za-z0-9_-]{22})$/);
  if (!m || Number(m[1]) !== OFFER.percent) return null;
  const [, , id, exp, sig] = m;
  const expected = Buffer.from(sign(secret, `${id}.${exp}`));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  if (Number(exp) * 1000 < now) return null;
  return id;
}

/** Discount in whole dirhams on the items total (delivery is free anyway). */
export const offerDiscount = (total: number) => discountFor(total, OFFER.percent);

export const offerSecret = () => process.env.OFFER_SECRET || process.env.REPORT_TOKEN || "";
