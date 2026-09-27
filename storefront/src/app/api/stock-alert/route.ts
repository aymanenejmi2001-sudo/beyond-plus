// "Prévenez-moi" for an unavailable size: emails the shop inbox. Nothing is stored.
import { PRODUCT_BY_HANDLE } from "@/data/catalog";
import { guard, body } from "@/lib/commerce/server";
import { transport } from "@/lib/commerce/notify";

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,}$/i;
const PHONE = /^\+?[0-9 .-]{9,16}$/;

export async function POST(request: Request) {
  try {
    guard(request);
    const input = (await body(request)) as { handle?: string; size?: string; contact?: string };
    const product = PRODUCT_BY_HANDLE.get(String(input.handle));
    const size = String(input.size ?? "").slice(0, 8);
    const contact = String(input.contact ?? "").trim();
    if (!product || !product.variants.some((v) => v.title === size) || !(EMAIL.test(contact) || PHONE.test(contact))) return Response.json({ ok: false }, { status: 400 });
    const tr = transport();
    if (!tr) return Response.json({ ok: false }, { status: 503 });
    await tr.t.sendMail({
      from: `BEYOND PLUS <${tr.user}>`, to: tr.user,
      subject: `Alerte retour en stock : ${product.title}, pointure ${size}`,
      text: `Un client veut être prévenu du retour de la pointure ${size}.\n\nProduit : ${product.title}\nhttps://beyondplusmaroc.com/products/${product.handle}\nContact : ${contact}\n\nÀ recontacter quand la pointure revient, puis supprimer ce message.`,
    });
    return Response.json({ ok: true });
  } catch { return Response.json({ ok: false }, { status: 400 }); }
}
