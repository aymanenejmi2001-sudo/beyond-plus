// Sends the agents' evening report to the shop inbox. Fixed recipient, token-protected.
import { timingSafeEqual } from "node:crypto";
import { transport } from "@/lib/commerce/notify";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

function md(text: string) {
  return text.split("\n").map((l) => {
    const h = l.match(/^(#{1,3})\s+(.*)/);
    if (h) return `<h${h[1].length + 1} style="font-family:Arial,sans-serif;color:#5b1a24;margin:22px 0 8px">${esc(h[2])}</h${h[1].length + 1}>`;
    if (/^\|?\s*-{3,}/.test(l)) return "";
    const line = esc(l).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/(https:\/\/beyondplusmaroc\.com[^\s|)]*)/g, '<a href="$1" style="color:#5b1a24">$1</a>');
    if (l.startsWith("|")) return `<div style="font-family:Arial,sans-serif;font-size:13px;padding:4px 0;border-bottom:1px solid #eee">${line.split("|").filter((c) => c.trim()).join(" · ")}</div>`;
    return line.trim() ? `<p style="font-family:Arial,sans-serif;font-size:14px;line-height:1.55;margin:6px 0">${line}</p>` : "";
  }).join("\n");
}

export async function POST(request: Request) {
  const secret = process.env.REPORT_TOKEN ?? "";
  const given = request.headers.get("authorization")?.replace(/^Bearer /, "") ?? "";
  if (!secret || given.length !== secret.length || !timingSafeEqual(Buffer.from(given), Buffer.from(secret))) return new Response("Unauthorized", { status: 401 });
  const { subject, markdown } = (await request.json()) as { subject?: string; markdown?: string };
  if (!markdown || markdown.length > 60_000) return new Response("Bad request", { status: 400 });
  const tr = transport();
  if (!tr) return new Response("Mail not configured", { status: 503 });
  await tr.t.sendMail({
    from: `BEYOND PLUS <${tr.user}>`, to: tr.user,
    subject: (subject || "Rapport du jour").slice(0, 150),
    text: markdown,
    html: `<div style="max-width:680px;margin:0 auto;padding:24px;background:#fff"><div style="background:#0b0b0d;color:#fff;padding:14px 18px;font-family:Arial,sans-serif;letter-spacing:.12em;font-size:13px">BEYOND PLUS · RAPPORT DES AGENTS</div>${md(markdown)}</div>`,
  });
  return Response.json({ sent: true });
}
