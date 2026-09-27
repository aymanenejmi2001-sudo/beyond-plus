// JPEG thumbnails for e-mails: product photos are WebP, which Outlook and some
// mail apps don't display. Only /products/*.webp from this site is accepted.
import sharp from "sharp";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://beyondplusmaroc.com";

export async function GET(request: Request) {
  const src = new URL(request.url).searchParams.get("src") ?? "";
  if (!/^\/products\/[a-z0-9-]+\.webp$/.test(src)) return new Response("Bad request", { status: 400 });
  const res = await fetch(SITE + src);
  if (!res.ok) return new Response("Not found", { status: 404 });
  const jpeg = await sharp(Buffer.from(await res.arrayBuffer()))
    .resize({ width: 480, height: 480, fit: "contain", background: "#f1f1ef" })
    .flatten({ background: "#f1f1ef" })
    .jpeg({ quality: 82 })
    .toBuffer();
  return new Response(new Uint8Array(jpeg), { headers: { "Content-Type": "image/jpeg", "Cache-Control": "public, max-age=31536000, immutable" } });
}
