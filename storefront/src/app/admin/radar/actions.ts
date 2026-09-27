"use server";
// Every admin mutation. Each one re-checks the session (middleware is not
// enough on its own for server actions) and redirects back with a message.

import { allowAttempt } from "@/lib/commerce/server";
import { headers } from "next/headers";
import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, checkPassword, createSession, verifySession } from "../../../../radar/lib/auth.ts";
import type { Dimension, Reliability } from "../../../../radar/lib/types.ts";
import { numOrNull, strOrNull } from "../../../../radar/normalizers/candidate.ts";
import {
  acknowledgeAlert, addMarketSignal, addMoroccoSignal, addSupplierOffer, decide, prepareCatalogue, recompute, recomputeAll,
  recordOrder, updateCandidate, upsertCandidate, type DecisionAction,
} from "../../../../radar/services/radar.ts";

const BASE = "/admin/radar";
const ACTOR = "admin";

async function requireAdmin() {
  const jar = await cookies();
  if (!(await verifySession(jar.get(SESSION_COOKIE)?.value))) redirect(`${BASE}/login`);
}

const back = (target: string, kind: "ok" | "err", msg: string): never => {
  const [path, hash] = target.split("#");
  const clean = path.replace(/([?&])(ok|err)=[^&]*&?/g, "$1").replace(/[?&]$/, "");
  return redirect(`${clean}${clean.includes("?") ? "&" : "?"}${kind}=${encodeURIComponent(msg)}${hash ? `#${hash}` : ""}`);
};

async function run(path: string, fn: () => Promise<string | void>) {
  await requireAdmin();
  let msg: string | void = undefined;
  try { msg = await fn(); } catch (e) { back(path, "err", (e as Error).message); }
  revalidatePath(BASE, "layout");
  back(path, "ok", msg || "Enregistré.");
}

const str = (f: FormData, k: string) => strOrNull(f.get(k));
const num = (f: FormData, k: string) => numOrNull(f.get(k));
const today = (f: FormData) => { const d = str(f, "observed_at"); return d ? new Date(d).toISOString() : new Date().toISOString(); };
const url = (v: string | null) => { if (v && !/^https?:\/\//i.test(v)) throw new Error("URL invalide (http/https)."); return v; };

// ------------------------------------------------------------------ session
export async function login(form: FormData) {
  const h = await headers();
  const key = createHash("sha256").update(h.get("x-vercel-forwarded-for") ?? h.get("x-forwarded-for") ?? "local").digest("hex");
  if (!allowAttempt(`login:${key}`, 5, 15 * 60_000)) redirect(`${BASE}/login?err=1`);
  if (!(await checkPassword(String(form.get("password") ?? "")))) redirect(`${BASE}/login?err=1`);
  const { value, expires } = await createSession();
  (await cookies()).set(SESSION_COOKIE, value, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/admin", expires });
  redirect(BASE);
}
export async function logout() {
  (await cookies()).delete({ name: SESSION_COOKIE, path: "/admin" });
  redirect(`${BASE}/login`);
}

// ------------------------------------------------------------------ candidates
export async function createCandidateAction(form: FormData) {
  await requireAdmin();
  const brand = str(form, "brand"), model = str(form, "model");
  if (!brand || !model) back(`${BASE}/new`, "err", "Marque et modèle requis.");
  let id = "";
  try {
    const { candidate, created } = await upsertCandidate({
      brand: brand!, model: model!, colorway: str(form, "colorway"), sku: str(form, "sku"),
      gender: (str(form, "gender") as "women" | "men" | "unisex" | null), style_family: str(form, "style_family"),
      official_url: url(str(form, "official_url")), official_price: num(form, "official_price"), official_currency: str(form, "official_currency"),
      notes: str(form, "notes"), source: "manual",
    });
    id = candidate.id;
    if (!created) back(`${BASE}/${id}`, "ok", "Ce candidat existe déjà (doublon évité).");
    await recompute(id);
  } catch (e) { if ((e as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw e; back(`${BASE}/new`, "err", (e as Error).message); }
  revalidatePath(BASE, "layout");
  back(`${BASE}/${id}`, "ok", "Candidat créé.");
}

export async function saveIdentity(form: FormData) {
  const id = String(form.get("id"));
  await run(`${BASE}/${id}`, async () => {
    await updateCandidate(id, {
      colorway: str(form, "colorway"), sku: str(form, "sku"),
      gender: str(form, "gender") as "women" | "men" | "unisex" | null, category: str(form, "category"), style_family: str(form, "style_family"),
      official_url: url(str(form, "official_url")), official_price: num(form, "official_price"), official_currency: str(form, "official_currency"),
      selling_price_mad: num(form, "selling_price_mad"), catalogue_handle: str(form, "catalogue_handle"), notes: str(form, "notes"),
    });
    await recompute(id);
    return "Fiche enregistrée et score recalculé.";
  });
}

/** Bound per button: decideAction.bind(null, "APPROVE") — never relies on the submitter's name/value. */
export async function decideAction(decision: DecisionAction, form: FormData) {
  const id = String(form.get("id"));
  const from = str(form, "from") ?? `${BASE}/${id}`;
  await run(from.startsWith(BASE) ? from : BASE, async () => {
    await decide(id, decision, ACTOR, str(form, "note"));
    return `Décision enregistrée : ${decision}.`;
  });
}

export async function recomputeAction(form: FormData) {
  const id = str(form, "id");
  await run(id ? `${BASE}/${id}` : BASE, async () => {
    if (id) { await recompute(id); return "Score recalculé."; }
    const r = await recomputeAll("manual");
    return `Recalcul : ${r.stats.scored}/${r.stats.candidates} scorés, ${r.stats.alerts} alerte(s).`;
  });
}

export async function prepareAction(form: FormData) {
  const id = String(form.get("id"));
  await run(`${BASE}/${id}`, async () => {
    const r = await prepareCatalogue(id);
    return r.issues.length ? `Fiche préparée (${r.issues.length} point(s) à compléter).` : "Fiche préparée, complète.";
  });
}

// ------------------------------------------------------------------ signals
export async function addMarketSignalAction(form: FormData) {
  const id = String(form.get("id"));
  await run(`${BASE}/${id}#signals`, async () => {
    const value = num(form, "value"), source = str(form, "source"), metric = str(form, "metric");
    if (value == null || !source || !metric) throw new Error("Source, mesure et valeur 0–100 requises.");
    await addMarketSignal({
      candidate_id: id, dimension: String(form.get("dimension")) as Dimension, source, metric, value,
      raw_value: num(form, "raw_value"), raw_unit: str(form, "raw_unit"), reliability: String(form.get("reliability")) as Reliability,
      source_url: url(str(form, "source_url")), observed_at: today(form), note: str(form, "note"), created_by: ACTOR,
    });
    await recompute(id);
    return "Signal ajouté, score recalculé.";
  });
}

export async function addMoroccoSignalAction(form: FormData) {
  const id = String(form.get("id"));
  await run(`${BASE}/${id}#morocco`, async () => {
    const source_name = str(form, "source_name");
    if (!source_name) throw new Error("Source requise.");
    const promo = num(form, "promotion_pct");
    await addMoroccoSignal({
      candidate_id: id, source_name, source_url: url(str(form, "source_url")),
      retailers_count: num(form, "retailers_count"), colorways_count: num(form, "colorways_count"),
      avg_price_mad: num(form, "avg_price_mad"), min_price_mad: num(form, "min_price_mad"), max_price_mad: num(form, "max_price_mad"),
      promotion_frequency: promo == null ? null : Math.min(Math.max(promo, 0), 100) / 100,
      availability: (str(form, "availability") ?? "UNKNOWN") as "IN_STOCK" | "LIMITED" | "OUT_OF_STOCK" | "UNKNOWN",
      size_availability: str(form, "size_availability"), reliability: "MARKET", observed_at: today(form), note: str(form, "note"), created_by: ACTOR,
    });
    await recompute(id);
    return "Signal Maroc ajouté, score recalculé.";
  });
}

export async function addSupplierOfferAction(form: FormData) {
  const id = String(form.get("id"));
  await run(`${BASE}/${id}#supplier`, async () => {
    const supplier_name = str(form, "supplier_name");
    if (!supplier_name) throw new Error("Fournisseur requis.");
    const sizes = str(form, "available_sizes");
    await addSupplierOffer({
      candidate_id: id, supplier_name, supplier_product_reference: str(form, "supplier_product_reference"), supplier_url: url(str(form, "supplier_url")),
      supplier_cost_mad: num(form, "supplier_cost_mad"), cost_basis: num(form, "supplier_cost_mad") == null ? null : (str(form, "cost_basis") as "CONFIRMED_COST" | "SUPPLIER_LISTED_PRICE"),
      shipping_cost_mad: num(form, "shipping_cost_mad"), minimum_order_quantity: num(form, "minimum_order_quantity"),
      available_sizes: sizes ? sizes.split(/[\s,;]+/).filter(Boolean) : null, available_quantity: num(form, "available_quantity"),
      lead_time_days: num(form, "lead_time_days"), supplier_status: (str(form, "supplier_status") ?? "UNKNOWN") as "AVAILABLE" | "LIMITED" | "OUT_OF_STOCK" | "UNKNOWN",
      images_authorized: false, image_refs: null, observed_at: today(form), note: str(form, "note"),
    });
    await recompute(id);
    return "Offre fournisseur ajoutée, score recalculé.";
  });
}

export async function recordOrderAction(form: FormData) {
  const id = String(form.get("id"));
  await run(`${BASE}/${id}#performance`, async () => {
    const handle = str(form, "handle");
    if (!handle) throw new Error("Ce candidat n'a pas de fiche en ligne (handle).");
    await recordOrder({ handle, size: str(form, "size"), quantity: num(form, "quantity") ?? 1, unitPriceMAD: num(form, "unit_price_mad"), reference: str(form, "reference"), occurredAt: today(form) });
    await recompute(id);
    return "Commande enregistrée.";
  });
}

export async function ackAlertAction(form: FormData) {
  await run(str(form, "from") ?? BASE, async () => { await acknowledgeAlert(String(form.get("alert"))); return "Alerte archivée."; });
}

// ------------------------------------------------------------------ simple mode
export async function publishAction(form: FormData) {
  const id = String(form.get("id"));
  await run(str(form, "from") ?? BASE, async () => {
    const { publishNow } = await import("../../../../radar/services/publish.ts");
    const handle = await publishNow(id, num(form, "price"), ACTOR);
    return `Publié : /products/${handle} — en ligne sur le vrai site dans 2 à 4 minutes.`;
  });
}

/** Complete a pair that has no source: BEYOND's own photos, colorway, sizes. */
export async function completeAction(form: FormData) {
  const id = String(form.get("id"));
  await run(str(form, "from") ?? BASE, async () => {
    const { getStore } = await import("../../../../radar/lib/store.ts");
    const { slugify } = await import("../../../../radar/normalizers/candidate.ts");
    const c = await getStore().get("sneaker_candidates", id);
    if (!c) throw new Error("Paire introuvable.");
    const files = form.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
    const { MIN_PHOTOS } = await import("../../../../radar/config/scoring.ts");
    if (files.length < MIN_PHOTOS) throw new Error(`Ajoute au moins ${MIN_PHOTOS} photos (${files.length} reçue(s)).`);
    const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
    const colorway = str(form, "colorway") ?? c.colorway;
    const sizes = (str(form, "sizes") ?? "").split(/[\s,;]+/).filter((x) => /^\d{2}(\.5)?$/.test(x));
    if (!sizes.length) throw new Error("Indique les pointures disponibles (ex. 38 39 40 41 42).");
    const slug = slugify(`${c.brand} ${c.model} ${colorway ?? ""}`);
    const { saveImage, ensureBucket } = await import("../../../../radar/lib/media.ts");
    await ensureBucket();
    const imgs: { url: string; width: number; height: number }[] = [];
    for (const [i, f] of files.slice(0, 10).entries()) {
      if (!EXT[f.type]) throw new Error(`${f.name} : format non accepté (JPG, PNG ou WebP).`);
      if (f.size > 15e6) throw new Error(`${f.name} : trop lourde (15 Mo max).`);
      imgs.push(await saveImage(Buffer.from(await f.arrayBuffer()), `${slug}-beyond-${Date.now().toString(36)}-${i + 1}`).catch((e) => { throw new Error(`${f.name} : ${(e as Error).message}`); }));
    }
    const urls = imgs.map((i) => i.url);
    await updateCandidate(id, { colorway, hero_image_reference: urls[0], image_rights: "AUTHORIZED" });
    await addSupplierOffer({
      candidate_id: id, supplier_name: "Saisie BEYOND", supplier_product_reference: null, supplier_url: null,
      supplier_cost_mad: num(form, "cost"), cost_basis: num(form, "cost") == null ? null : "CONFIRMED_COST", shipping_cost_mad: null,
      minimum_order_quantity: null, available_sizes: sizes, available_quantity: null, lead_time_days: null, supplier_status: "UNKNOWN",
      images_authorized: true, image_refs: urls, image_meta: imgs, observed_at: new Date().toISOString(), note: "Photos BEYOND ajoutées dans l'admin.",
    });
    await recompute(id);
    return "Photos ajoutées — la paire est prête à publier.";
  });
}

export async function deployAction() {
  await run(`${BASE}`, async () => {
    const { canDeploy, deployNow } = await import("../../../../radar/services/deploy.ts");
    if (!canDeploy()) throw new Error("La mise en ligne se lance depuis ton Mac, pas depuis le site.");
    deployNow();
    return "Mise en ligne lancée — le site est à jour dans 2 à 4 minutes.";
  });
}

/** Adds BEYOND's own photos to a product already on the site (kept in src/data/extra-images.json). */
export async function addLivePhotosAction(form: FormData) {
  const handle = String(form.get("handle"));
  await run(`${BASE}?tab=photos`, async () => {
    const { CATALOG } = await import("@/data/catalog");
    const { getStore } = await import("../../../../radar/lib/store.ts");
    const { saveImage, ensureBucket } = await import("../../../../radar/lib/media.ts");
    const { writeSiteFiles } = await import("../../../../radar/services/siteFiles.ts");
    const { markPending, scheduleDeploy } = await import("../../../../radar/services/deploy.ts");
    const product = CATALOG.find((p) => p.handle === handle);
    if (!product) throw new Error("Produit introuvable sur le site.");
    const files = form.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
    if (!files.length) throw new Error("Choisis au moins une photo.");
    await ensureBucket();
    const db = getStore();
    let n = (await db.list("site_photos", { eq: { handle } })).length;
    for (const f of files.slice(0, 8)) {
      if (!/^image\/(jpeg|png|webp)$/.test(f.type)) throw new Error(`${f.name} : format non accepté (JPG, PNG ou WebP — sur iPhone, exporte en JPG).`);
      if (f.size > 15e6) throw new Error(`${f.name} : trop lourde (15 Mo max).`);
      const img = await saveImage(Buffer.from(await f.arrayBuffer()), `${handle}-beyond-${Date.now().toString(36)}-${++n}`).catch((e) => { throw new Error(`${f.name} : ${(e as Error).message}`); });
      await db.insert("site_photos", [{ handle, url: img.url, alt_text: `${product.title} — photo BEYOND PLUS ${n}`, width: img.width, height: img.height }]);
    }
    if (!process.env.VERCEL) await writeSiteFiles();
    await markPending(handle);
    scheduleDeploy();
    return `${files.length} photo(s) ajoutée(s) à ${product.title}. Le site se met à jour dans quelques minutes.`;
  });
}

export async function removeLivePhotoAction(form: FormData) {
  const handle = String(form.get("handle")), url = String(form.get("url"));
  await run(`${BASE}?tab=photos`, async () => {
    const { getStore } = await import("../../../../radar/lib/store.ts");
    const { writeSiteFiles } = await import("../../../../radar/services/siteFiles.ts");
    const { markPending, scheduleDeploy } = await import("../../../../radar/services/deploy.ts");
    const db = getStore();
    const row = (await db.list("site_photos", { eq: { handle } })).find((p) => p.url === url);
    if (row) await db.remove("site_photos", row.id);
    if (!process.env.VERCEL) await writeSiteFiles();
    await markPending(handle);
    scheduleDeploy();
    return "Photo retirée.";
  });
}
