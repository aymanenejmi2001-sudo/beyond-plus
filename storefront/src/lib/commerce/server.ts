import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile, rename } from "node:fs/promises";
import { join } from "node:path";
import { get as blobGet, list as blobList, put as blobPut } from "@vercel/blob";

const limits = new Map<string, { count: number; until: number }>();
// Per-process defence in depth. A shared deployment must also enforce platform/WAF limits.
export function allowAttempt(key: string, maximum = 30, duration = 60_000) {
  const now = Date.now();
  for (const [k,v] of limits) if (v.until <= now) limits.delete(k);
  if (limits.size > 10000) return false;
  const current = limits.get(key);
  if (!current) { limits.set(key, { count: 1, until: now + duration }); return true; }
  return ++current.count <= maximum;
}
export function guard(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) throw new Error("Origine non autorisée.");
  if (Number(request.headers.get("content-length") ?? 0) > 16_384) throw new Error("Requête trop volumineuse.");
  const address = request.headers.get("x-vercel-forwarded-for") ?? request.headers.get("x-forwarded-for") ?? "local";
  const key = createHash("sha256").update(address).digest("hex");
  if (!allowAttempt(key)) throw new Error("Trop de demandes. Réessayez dans une minute.");
}
export async function body(request: Request): Promise<unknown> {
  const text = await request.text();
  if (text.length > 16_384) throw new Error("Requête trop volumineuse.");
  return JSON.parse(text);
}
const configured = () => Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
// Vercel Blob (private store "beyond-plus-commandes", Paris). One file per event,
// no personal data: order requests hold lines, prices and status only.
const blobConfigured = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN) && !configured();
// Product views are too frequent for the store's free quota; Search Console covers them.
const BLOB_SKIP = new Set(["view_product"]);
export const persistenceAvailable = () => configured() || blobConfigured() || !process.env.VERCEL;
let queue: Promise<unknown> = Promise.resolve();
const file = () => join(process.cwd(), ".commerce", "events.json");
type Row = { id: string; kind: string; created_at: string; payload: unknown };
async function remote(path: string, init: RequestInit = {}) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${path}`, { ...init, cache: "no-store", signal: AbortSignal.timeout(5000), headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", Prefer: "resolution=ignore-duplicates,return=minimal" } });
  if (!response.ok) throw new Error("Stockage des demandes indisponible.");
  return response;
}
async function readBlobRows(): Promise<Row[]> {
  const blobs: { pathname: string }[] = [];
  let cursor: string | undefined;
  do {
    const page = await blobList({ prefix: "commerce/", limit: 1000, cursor });
    blobs.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor && blobs.length < 3000);
  const rows: Row[] = [];
  for (let i = 0; i < blobs.length; i += 10) {
    const chunk = await Promise.all(blobs.slice(i, i + 10).map(async (b) => {
      try {
        const res = await blobGet(b.pathname, { access: "private", useCache: false });
        return res ? (JSON.parse(await new Response(res.stream).text()) as Row) : null;
      } catch { return null; }
    }));
    rows.push(...(chunk.filter(Boolean) as Row[]));
  }
  return rows.sort((a, b) => b.created_at.localeCompare(a.created_at));
}
export async function readRows(): Promise<Row[]> {
  if (configured()) return (await remote("commerce_events?select=*&order=created_at.desc&limit=1000")).json();
  if (blobConfigured()) return readBlobRows();
  if (process.env.VERCEL) return [];
  try { return JSON.parse(await readFile(file(), "utf8")); } catch (e) { if ((e as NodeJS.ErrnoException).code === "ENOENT") return []; throw e; }
}
export async function saveEvent(kind: string, payload: unknown, id: string = randomUUID()): Promise<boolean> {
  if (!persistenceAvailable()) return false;
  const row = { id, kind, created_at: new Date().toISOString(), payload };
  if (configured()) { await remote("commerce_events?on_conflict=id", { method: "POST", body: JSON.stringify(row) }); return true; }
  if (blobConfigured()) {
    if (BLOB_SKIP.has(kind)) return false;
    try {
      await blobPut(`commerce/${kind}/${row.created_at.slice(0, 10)}/${id}.json`, JSON.stringify(row), { access: "private", addRandomSuffix: false, allowOverwrite: false, contentType: "application/json" });
    } catch (e) {
      // Same id already stored (a retry): the request exists, which is what matters.
      if (!/already exists/i.test(String(e))) throw e;
    }
    return true;
  }
  const operation = queue.then(async () => {
    const rows = await readRows();
    if (!rows.some(r => r.id === id)) rows.push(row);
    await mkdir(join(process.cwd(), ".commerce"), { recursive: true });
    await writeFile(file() + ".tmp", JSON.stringify(rows));
    await rename(file() + ".tmp", file());
    return true;
  });
  queue = operation.catch(() => undefined);
  return operation;
}

/** Marks a first-order offer as used. False when it was already used. */
export async function claimOffer(offerId: string, orderId: string): Promise<boolean> {
  const row = { id: offerId, kind: "offer_used", created_at: new Date().toISOString(), payload: { order: orderId } };
  if (blobConfigured()) {
    try {
      await blobPut(`commerce/offer_used/${offerId}.json`, JSON.stringify(row), { access: "private", addRandomSuffix: false, allowOverwrite: false, contentType: "application/json" });
      return true;
    } catch (e) {
      if (/already exists/i.test(String(e))) return false;
      throw e;
    }
  }
  if (process.env.VERCEL) throw new Error("Remise indisponible pour le moment.");
  const rows = await readRows();
  if (rows.some((r) => r.kind === "offer_used" && r.id === offerId)) return false;
  await saveEvent("offer_used", row.payload, offerId);
  return true;
}
