// Where Radar stores images it writes itself (owner uploads). Online (Supabase
// configured): Supabase Storage, public bucket "radar". Otherwise the local
// public/radar-products folder. Always resized to a WebP master first.

import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

export const BUCKET = "radar";
const supa = () => (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY ? { url: process.env.SUPABASE_URL.replace(/\/$/, ""), key: process.env.SUPABASE_SERVICE_ROLE_KEY } : null);

export async function ensureBucket() {
  const s = supa();
  if (!s) return;
  const res = await fetch(`${s.url}/storage/v1/bucket`, { method: "POST", headers: { Authorization: `Bearer ${s.key}`, apikey: s.key, "Content-Type": "application/json" }, body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }) });
  if (!res.ok && res.status !== 409 && !/already exists/i.test(await res.text())) throw new Error(`Création du stockage photos impossible (${res.status}).`);
}

/** Resize + convert, then store. Returns the public URL and real dimensions. */
export async function saveImage(input: Buffer, name: string, minEdge = 700): Promise<{ url: string; width: number; height: number }> {
  const out = await sharp(input).rotate().resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true }).webp({ quality: 86 }).toBuffer({ resolveWithObject: true });
  if (Math.max(out.info.width, out.info.height) < minEdge) throw new Error(`photo trop petite (${out.info.width} px, ${minEdge} px minimum).`);
  const file = `${name}.webp`;
  const s = supa();
  if (s) {
    const res = await fetch(`${s.url}/storage/v1/object/${BUCKET}/${file}`, { method: "POST", headers: { Authorization: `Bearer ${s.key}`, apikey: s.key, "Content-Type": "image/webp", "x-upsert": "true", "Cache-Control": "31536000" }, body: new Uint8Array(out.data) });
    if (!res.ok) throw new Error(`Envoi de la photo impossible (${res.status} ${await res.text()}).`);
    return { url: `${s.url}/storage/v1/object/public/${BUCKET}/${file}`, width: out.info.width, height: out.info.height };
  }
  const dir = join(process.cwd(), "public/radar-products");
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, file), out.data);
  return { url: `/radar-products/${file}`, width: out.info.width, height: out.info.height };
}
