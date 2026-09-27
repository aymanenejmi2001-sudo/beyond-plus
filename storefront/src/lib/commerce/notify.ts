import "server-only";
import nodemailer from "nodemailer";
import sharp from "sharp";
import { LOGO_PNG, LOGO_PNG_WHITE } from "./email-logo";



// E-mail to the shop for every order request, sent through the Hostinger
// mailbox. Needs SMTP_PASSWORD in Vercel; without it, nothing is sent (the
// request is still recorded and the WhatsApp flow is unchanged).
// The customer's contact details (name, phone, address, city) travel in this
// e-mail only: they are never written to the order storage.

type Line = { quantity: number; merchandise: { title: string; image?: { url: string } | null; product: { title: string; handle: string } }; cost: { totalAmount: { amount: string } } };

export function transport() {
  const pass = process.env.SMTP_PASSWORD;
  if (!pass) return null;
  const user = process.env.SMTP_USER || "hello@beyondplusmaroc.com";
  return { user, t: nodemailer.createTransport({ host: process.env.SMTP_HOST || "smtp.hostinger.com", port: Number(process.env.SMTP_PORT || 465), secure: true, auth: { user, pass }, connectionTimeout: 8000, socketTimeout: 8000 }) };
}
export const orderNumber = (id: string) => `BP-${id.replace(/-/g, "").slice(0, 6).toUpperCase()}`;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://beyondplusmaroc.com";
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

type Offer = { percent: number; discount: number };
export async function notifyOrder(order: { id: string; lines: Line[]; total: number; offer?: Offer; firstName: string; city: string; phone: string; address: string; email?: string }) {
  const pass = process.env.SMTP_PASSWORD;
  if (!pass) return false;
  const user = process.env.SMTP_USER || "hello@beyondplusmaroc.com";
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.hostinger.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: true,
    auth: { user, pass },
    connectionTimeout: 8000,
    socketTimeout: 8000,
  });
  const tel = order.phone.replace(/[^0-9+]/g, "");
  const wa = tel.startsWith("+") ? tel.slice(1) : tel.startsWith("0") ? `212${tel.slice(1)}` : tel;
  const rows = order.lines.map((l) => `• ${l.merchandise.product.title}, pointure ${l.merchandise.title} × ${l.quantity} : ${Math.round(Number(l.cost.totalAmount.amount))} DH\n  ${SITE}/products/${l.merchandise.product.handle}`);
  const text = [
    `Nouvelle commande ${order.id}`,
    "",
    `Prénom : ${order.firstName}`,
    `Téléphone : ${order.phone}`,
    ...(order.email ? [`E-mail : ${order.email}`] : []),
    `Adresse : ${order.address}, ${order.city}`,
    "",
    ...rows,
    "",
    ...(order.offer ? [`Remise première commande (${order.offer.percent} %) : −${order.offer.discount} DH`] : []),
    `Total à encaisser : ${order.total} DH (livraison gratuite)`,
    "",
    "À faire : appeler le client pour confirmer pointure et livraison avant l’envoi.",
    `Suivi : ${SITE}/admin/radar/commandes`,
  ].join("\n");
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#111">
    <h2 style="margin:0 0 12px">Nouvelle commande</h2>
    <p style="margin:0 0 12px;color:#666">Réf. ${esc(order.id)}</p>
    <p style="font-size:17px"><strong>${esc(order.firstName)}</strong><br>
      <a href="tel:${esc(tel)}">${esc(order.phone)}</a> · <a href="https://wa.me/${esc(wa)}">WhatsApp</a><br>
      ${esc(order.address)}, ${esc(order.city)}</p>
    <table style="border-collapse:collapse;width:100%">${order.lines.map((l) => `<tr><td style="padding:8px 0;border-top:1px solid #eee"><a href="${SITE}/products/${esc(l.merchandise.product.handle)}">${esc(l.merchandise.product.title)}</a><br><span style="color:#666">Pointure ${esc(l.merchandise.title)} × ${l.quantity}</span></td><td style="padding:8px 0;border-top:1px solid #eee;text-align:right;white-space:nowrap">${Math.round(Number(l.cost.totalAmount.amount))} DH</td></tr>`).join("")}
    ${order.offer ? `<tr><td style="padding:8px 0;border-top:1px solid #eee">Remise première commande (${order.offer.percent} %)</td><td style="padding:8px 0;border-top:1px solid #eee;text-align:right">−${order.offer.discount} DH</td></tr>` : ""}<tr><td style="padding:12px 0;border-top:2px solid #111"><strong>Total</strong> (livraison gratuite)</td><td style="padding:12px 0;border-top:2px solid #111;text-align:right"><strong>${order.total} DH</strong></td></tr></table>
    <p style="color:#666">À faire : appeler le client pour confirmer pointure et livraison avant l’envoi.</p>
    <p><a href="${SITE}/admin/radar/commandes">Voir toutes les demandes</a></p></div>`;
  await transport.sendMail({
    from: `"BEYOND PLUS" <${user}>`,
    to: process.env.ORDER_EMAIL_TO || "hello@beyondplusmaroc.com",
    subject: `Nouvelle commande ${orderNumber(order.id)} : ${order.firstName}, ${order.city}, ${order.total} DH`,
    text,
    html,
  });
  return true;
}

/** Product photo as an embedded JPEG (shows even when remote images are blocked). */
async function productJpeg(url?: string): Promise<Buffer | null> {
  if (!url || !/^\/products\/[a-z0-9-]+\.webp$/.test(url)) return null;
  try {
    const res = await fetch(SITE + url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    return await sharp(Buffer.from(await res.arrayBuffer()))
      .resize({ width: 400, height: 400, fit: "contain", background: "#f1f1ef" })
      .flatten({ background: "#f1f1ef" }).jpeg({ quality: 80 }).toBuffer();
  } catch { return null; }
}

/** Confirmation for the customer: received, not yet confirmed (we call first). */
export async function notifyCustomer(order: { id: string; lines: Line[]; total: number; offer?: Offer; firstName: string; city: string; address: string; phone: string; email: string }) {
  const mail = transport();
  if (!mail) return false;
  const num = orderNumber(order.id);
  const date = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Casablanca" });
  const dh = (n: number) => `${n.toLocaleString("fr-FR")} DH`;
  const photos = await Promise.all(order.lines.map((l) => productJpeg(l.merchandise.image?.url)));
  const attachments = [
    { filename: "beyond-plus.png", content: LOGO_PNG, cid: "logo@bp" },
    { filename: "beyond-plus-blanc.png", content: LOGO_PNG_WHITE, cid: "logow@bp" },
    ...photos.flatMap((b, i) => (b ? [{ filename: `paire-${i + 1}.jpg`, content: b, cid: `p${i}@bp` }] : [])),
  ];
  const INK = "#0d0d0d", BORDEAUX = "#702735", GREY = "#f1f1ef", MUTED = "#6b6b6b";
  const steps = ["Reçue", "Confirmée", "Expédiée", "Livrée"];
  const progress = steps.map((label, i) => `<td align="center" valign="top" style="width:25%;padding:0 2px">
      <div style="height:4px;background:${i === 0 ? BORDEAUX : "#d9d9d6"};border-radius:2px;margin-bottom:10px"></div>
      <div style="font-size:12px;letter-spacing:.5px;color:${i === 0 ? INK : "#9a9a9a"};font-weight:${i === 0 ? 700 : 400}">${i === 0 ? "&#10003; " : ""}${label}</div></td>`).join("");
  const items = order.lines.map((l, i) => `<tr><td style="padding:0 0 14px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${GREY};border-radius:6px"><tr>
      <td width="132" style="padding:12px"><img src="${photos[i] ? `cid:p${i}@bp` : `${SITE}/api/email-image?src=${encodeURIComponent(l.merchandise.image?.url ?? "")}`}" width="120" height="120" alt="${esc(l.merchandise.product.title)}" style="display:block;border:0;border-radius:4px;background:#fff"></td>
      <td style="padding:12px 16px 12px 4px;font-size:14px;line-height:1.5;color:${INK}">
        <div style="font-size:15px;font-weight:700;margin-bottom:6px">${esc(l.merchandise.product.title)}</div>
        <div style="color:${MUTED}">Pointure ${esc(l.merchandise.title)} · Quantité ${l.quantity}</div>
        <div style="font-weight:700;margin-top:8px">${dh(Math.round(Number(l.cost.totalAmount.amount)))}</div></td></tr></table></td></tr>`).join("");
  const wa = `https://wa.me/212669866831?text=${encodeURIComponent(`Bonjour, au sujet de ma commande ${num}`)}`;
  const html = `<!doctype html><html lang="fr"><head><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"></head>
<body style="margin:0;padding:0;background:#e9e9e6">
<div style="display:none;max-height:0;overflow:hidden">Commande ${num} reçue : nous vous appelons pour confirmer. Livraison gratuite en 12 à 48 h.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e9e9e6"><tr><td align="center" style="padding:24px 10px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;font-family:Helvetica,Arial,sans-serif;color:${INK}">
  <tr><td align="center" style="background:${INK};color:#fff;font-size:11px;letter-spacing:2px;padding:11px 16px">LIVRAISON GRATUITE · PARTOUT AU MAROC · 12 À 48 H</td></tr>
  <tr><td align="center" style="padding:30px 24px 8px"><a href="${SITE}" style="text-decoration:none;color:${INK}"><img src="cid:logo@bp" width="40" height="40" alt="" style="vertical-align:middle;border:0"><span style="font-size:22px;font-weight:700;letter-spacing:-.8px;vertical-align:middle;margin-left:8px">BEYOND PLUS</span></a></td></tr>
  <tr><td align="center" style="padding:24px 32px 6px"><div style="font-size:30px;line-height:1.15;font-weight:700;letter-spacing:-1px">Merci, ${esc(order.firstName)}.</div>
    <div style="font-size:16px;line-height:1.5;color:${MUTED};margin-top:10px">Votre commande est bien reçue.</div>
    <div style="display:inline-block;margin-top:16px;padding:7px 14px;border:1px solid ${INK};border-radius:999px;font-size:12px;letter-spacing:1.5px;font-weight:700">${num}</div></td></tr>
  <tr><td style="padding:26px 32px 8px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${progress}</tr></table></td></tr>
  <tr><td style="padding:18px 32px 6px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${GREY};border-left:3px solid ${BORDEAUX}"><tr><td style="padding:16px 18px;font-size:14px;line-height:1.6">
    <strong>Prochaine étape :</strong> nous vous appelons au <strong>${esc(order.phone)}</strong> pour confirmer votre pointure et la livraison. Votre commande part sous 12 à 48 h après confirmation.</td></tr></table></td></tr>
  <tr><td style="padding:30px 32px 12px;font-size:12px;letter-spacing:2px;font-weight:700">VOS PAIRES</td></tr>
  <tr><td style="padding:0 32px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${items}</table></td></tr>
  <tr><td style="padding:6px 32px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-collapse:collapse">
    <tr><td style="padding:10px 0;color:${MUTED}">Sous-total</td><td align="right" style="padding:10px 0">${dh(order.total + (order.offer?.discount ?? 0))}</td></tr>
    ${order.offer ? `<tr><td style="padding:10px 0;color:${MUTED}">Remise première commande (${order.offer.percent} %)</td><td align="right" style="padding:10px 0">−${dh(order.offer.discount)}</td></tr>` : ""}
    <tr><td style="padding:10px 0;color:${MUTED};border-bottom:1px solid #e3e3e0">Livraison</td><td align="right" style="padding:10px 0;border-bottom:1px solid #e3e3e0;color:${BORDEAUX};font-weight:700">Gratuite</td></tr>
    <tr><td style="padding:14px 0;font-size:17px;font-weight:700">Total</td><td align="right" style="padding:14px 0;font-size:20px;font-weight:700">${dh(order.total)}</td></tr>
    <tr><td colspan="2" style="padding:0 0 4px;font-size:12px;color:${MUTED}">Aucun paiement en ligne : le mode de paiement est convenu lors de notre appel.</td></tr></table></td></tr>
  <tr><td style="padding:26px 32px 0"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;line-height:1.6"><tr>
    <td valign="top" width="50%" style="padding-right:12px"><div style="font-size:11px;letter-spacing:1.5px;font-weight:700;color:${MUTED};margin-bottom:6px">LIVRAISON</div>${esc(order.firstName)}<br>${esc(order.address)}<br>${esc(order.city)}</td>
    <td valign="top" width="50%"><div style="font-size:11px;letter-spacing:1.5px;font-weight:700;color:${MUTED};margin-bottom:6px">COMMANDE</div>${num}<br>${date}</td></tr></table></td></tr>
  <tr><td align="center" style="padding:32px 32px 8px">
    <a href="${wa}" style="display:block;background:${INK};color:#fff;text-decoration:none;font-size:13px;font-weight:700;letter-spacing:1.5px;padding:16px 20px;border-radius:4px">UNE QUESTION ? WHATSAPP</a>
    <a href="${SITE}/collections/nouveautes" style="display:block;margin-top:10px;border:1px solid ${INK};color:${INK};text-decoration:none;font-size:13px;font-weight:700;letter-spacing:1.5px;padding:15px 20px;border-radius:4px">VOIR LA SÉLECTION</a></td></tr>
  <tr><td style="padding:24px 32px 30px;font-size:13px;line-height:1.6;color:${MUTED}" align="center">
    <strong style="color:${INK}">La pointure ne va pas ?</strong> Échange sous 3 jours après la livraison, paire non portée dans sa boîte. <a href="${SITE}/policies/refund" style="color:${BORDEAUX}">Conditions</a></td></tr>
  <tr><td align="center" style="background:${INK};padding:26px 24px;color:#bdbdbd;font-size:11px;line-height:1.7">
    <img src="cid:logow@bp" width="28" height="28" alt="" style="border:0;margin-bottom:8px"><br>
    <span style="color:#fff;font-weight:700;letter-spacing:1px">BEYOND PLUS</span> · Sneakers au Maroc<br>
    <a href="${SITE}" style="color:#fff">beyondplusmaroc.com</a> · hello@beyondplusmaroc.com · +212 669 866 831<br>
    <span style="color:#8a8a8a">Réplique qualité Master Copy, sans affiliation avec les marques citées. <a href="${SITE}/qualite-transparence" style="color:#8a8a8a">Qualité et transparence</a></span></td></tr>
</table></td></tr></table></body></html>`;
  const text = [`Merci, ${order.firstName}. Votre commande ${num} est bien reçue.`, "", ...order.lines.map((l) => `• ${l.merchandise.product.title}, pointure ${l.merchandise.title} × ${l.quantity} : ${dh(Math.round(Number(l.cost.totalAmount.amount)))}`), "", ...(order.offer ? [`Remise première commande (${order.offer.percent} %) : −${dh(order.offer.discount)}`] : []), `Total : ${dh(order.total)} (livraison gratuite)`, `Livraison : ${order.address}, ${order.city}`, "", `Prochaine étape : nous vous appelons au ${order.phone} pour confirmer avant l’envoi.`, "Échange de pointure sous 3 jours après la livraison.", SITE].join("\n");
  await mail.t.sendMail({ from: `"BEYOND PLUS" <${mail.user}>`, replyTo: mail.user, to: order.email, subject: `Commande ${num} reçue, merci ${order.firstName}`, text, html, attachments });
  return true;
}
