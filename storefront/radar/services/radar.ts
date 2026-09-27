// Radar operations — the only place that writes candidates, snapshots,
// decisions and alerts. Used by the admin (server actions) and by the jobs.

import { SCORING } from "../config/scoring.ts";
import { buildBrief } from "../content/brief.ts";
import { prepareProduct } from "../catalogue/prepare.ts";
import { getStore } from "../lib/store.ts";
import type { Candidate, CandidateStatus, MarketSignal, MoroccoSignal, PerformanceEvent, RadarAlert, ScoreSnapshot, SupplierOffer } from "../lib/types.ts";
import { dedupeKey, normalizeBrand, normalizeSku } from "../normalizers/candidate.ts";
import { computeKpis } from "../performance/kpis.ts";
import { computeScore } from "../scoring/beyondScore.ts";
import { bestOffer } from "../scoring/components.ts";

const iso = () => new Date().toISOString();

// ------------------------------------------------------------------ reads
export async function bundle(id: string) {
  const db = getStore();
  const candidate = await db.get("sneaker_candidates", id);
  if (!candidate) return null;
  const [market, morocco, offers, snapshots, approvals, drafts, briefs, alerts] = await Promise.all([
    db.list("market_signals", { eq: { candidate_id: id }, order: { col: "observed_at", asc: false } }),
    db.list("morocco_signals", { eq: { candidate_id: id }, order: { col: "observed_at", asc: false } }),
    db.list("supplier_offers", { eq: { candidate_id: id }, order: { col: "observed_at", asc: false } }),
    db.list("score_snapshots", { eq: { candidate_id: id }, order: { col: "created_at", asc: true } }),
    db.list("product_approvals", { eq: { candidate_id: id }, order: { col: "created_at", asc: false } }),
    db.list("catalogue_products", { eq: { candidate_id: id } }),
    db.list("product_marketing_briefs", { eq: { candidate_id: id }, order: { col: "created_at", asc: false } }),
    db.list("radar_alerts", { eq: { candidate_id: id }, order: { col: "created_at", asc: false } }),
  ]);
  const events = candidate.catalogue_handle ? await db.list("performance_events", { eq: { handle: candidate.catalogue_handle } }) : [];
  return { candidate, market, morocco, offers, snapshots, approvals, draft: drafts[0] ?? null, brief: briefs[0] ?? null, alerts, events };
}

// ------------------------------------------------------------------ candidates
export interface NewCandidate {
  brand: string; model: string; colorway?: string | null; sku?: string | null; gender?: Candidate["gender"];
  category?: string | null; style_family?: string | null; official_url?: string | null; official_price?: number | null;
  official_currency?: string | null; hero_image_reference?: string | null; image_rights?: Candidate["image_rights"];
  model_id?: string | null; notes?: string | null; source: string; catalogue_handle?: string | null; selling_price_mad?: number | null;
}

/** Idempotent: returns the existing candidate when the dedupe key already exists. */
export async function upsertCandidate(input: NewCandidate): Promise<{ candidate: Candidate; created: boolean }> {
  const db = getStore();
  const brand = normalizeBrand(input.brand);
  const key = dedupeKey({ brand, model: input.model, colorway: input.colorway, sku: input.sku });
  const existing = (await db.list("sneaker_candidates", { eq: { dedupe_key: key } }))[0];
  if (existing) return { candidate: existing, created: false };
  const now = iso();
  const [candidate] = await db.insert("sneaker_candidates", [{
    dedupe_key: key, model_id: input.model_id ?? null, brand, model: input.model.trim(), colorway: input.colorway?.trim() || null,
    sku: normalizeSku(input.sku), gender: input.gender ?? null, category: input.category ?? "Sneakers", style_family: input.style_family ?? null,
    official_url: input.official_url ?? null, official_price: input.official_price ?? null, official_currency: input.official_currency ?? null,
    hero_image_reference: input.hero_image_reference ?? null, image_rights: input.image_rights ?? "UNKNOWN",
    selling_price_mad: input.selling_price_mad ?? null, catalogue_handle: input.catalogue_handle ?? null,
    global_demand_score: null, morocco_demand_score: null, trend_velocity_score: null, margin_score: null, supplier_score: null,
    first_party_score: null, external_score: null, beyond_score: null, score_change: null, recommendation: null,
    confidence: null, confidence_level: null, score_explanation: null,
    status: "DISCOVERED", first_detected_at: now, last_checked_at: null, approved_at: null, rejected_at: null,
    notes: input.notes ?? null, source: input.source, created_at: now, updated_at: now,
  }]);
  return { candidate, created: true };
}

export async function updateCandidate(id: string, patch: Partial<Candidate>) {
  return getStore().update("sneaker_candidates", id, { ...patch, updated_at: iso() });
}

// ------------------------------------------------------------------ signals
export async function addMarketSignal(s: Omit<MarketSignal, "id" | "created_at">) {
  if (!(s.value >= 0 && s.value <= 100)) throw new Error("La valeur normalisée doit être entre 0 et 100.");
  return (await getStore().insert("market_signals", [s]))[0];
}
export async function addMoroccoSignal(s: Omit<MoroccoSignal, "id" | "created_at">) {
  return (await getStore().insert("morocco_signals", [s]))[0];
}
export async function addSupplierOffer(o: Omit<SupplierOffer, "id" | "created_at" | "estimated_landed_cost_mad">) {
  const landed = o.supplier_cost_mad != null && o.shipping_cost_mad != null ? o.supplier_cost_mad + o.shipping_cost_mad : null;
  return (await getStore().insert("supplier_offers", [{ ...o, estimated_landed_cost_mad: landed }]))[0];
}

// ------------------------------------------------------------------ scoring
export async function recompute(id: string, runId: string | null = null) {
  const b = await bundle(id);
  if (!b) throw new Error("Candidat introuvable");
  const { candidate: c } = b;
  const res = computeScore({ candidate: c, market: b.market, morocco: b.morocco, offers: b.offers, events: b.events });
  const prev = b.snapshots[b.snapshots.length - 1] ?? null;
  const comp = Object.fromEntries(res.components.map((x) => [x.key, x.value]));
  const { marginCalc: _m, ...explanation } = res;
  const [snap] = await getStore().insert("score_snapshots", [{
    candidate_id: c.id, run_id: runId, beyond_score: res.final, external_score: res.external, first_party_score: res.firstParty.score,
    components: comp, confidence: res.confidence.value, confidence_level: res.confidence.level, recommendation: res.recommendation, created_at: iso(),
  }]);
  const updated = await updateCandidate(c.id, {
    global_demand_score: comp.globalDemand ?? null, morocco_demand_score: comp.moroccoDemand ?? null, trend_velocity_score: comp.trendVelocity ?? null,
    margin_score: comp.marginScore ?? null, supplier_score: comp.supplierScore ?? null,
    external_score: res.external, first_party_score: res.firstParty.score, beyond_score: res.final,
    score_change: prev?.beyond_score != null && res.final != null ? res.final - prev.beyond_score : null,
    recommendation: res.recommendation as Candidate["recommendation"], confidence: res.confidence.value, confidence_level: res.confidence.level,
    score_explanation: explanation, last_checked_at: iso(),
  });
  const alerts = await evaluateAlerts(updated, prev, snap, res.marginCalc.grossMarginPct, b.offers, b.events);
  return { candidate: updated, snapshot: snap, alerts };
}

export async function recomputeAll(kind: "daily" | "weekly" | "manual", log: { level: string; msg: string }[] = []) {
  const db = getStore();
  const [run] = await db.insert("radar_runs", [{ kind, started_at: iso(), finished_at: null, status: "RUNNING", stats: {}, log: [] }]);
  const list = (await db.list("sneaker_candidates")).filter((c) => c.status !== "ARCHIVED" && c.status !== "REJECTED");
  let scored = 0, alerts = 0, failed = 0;
  for (const c of list) {
    try { const r = await recompute(c.id, run.id); if (r.candidate.beyond_score != null) scored++; alerts += r.alerts.length; }
    catch (e) { failed++; log.push({ level: "error", msg: `${c.brand} ${c.model}: ${(e as Error).message}` }); }
  }
  await writePerformanceMetrics();
  return db.update("radar_runs", run.id, {
    finished_at: iso(), status: failed ? (failed === list.length ? "FAILED" : "PARTIAL") : "OK",
    stats: { candidates: list.length, scored, alerts, failed }, log,
  });
}

// ------------------------------------------------------------------ alerts
async function evaluateAlerts(c: Candidate, prev: ScoreSnapshot | null, now: ScoreSnapshot, marginPct: number | null, offers: SupplierOffer[], events: PerformanceEvent[]) {
  const A = SCORING.alerts;
  const out: Omit<RadarAlert, "id">[] = [];
  const name = `${c.brand} ${c.model}${c.colorway ? " " + c.colorway : ""}`;
  const push = (kind: string, severity: RadarAlert["severity"], message: string) => out.push({ candidate_id: c.id, kind, severity, message, created_at: iso(), acknowledged_at: null });
  const s = now.beyond_score, p = prev?.beyond_score ?? null;
  if (prev && s != null) {
    if (A.crossLaunch && (p == null || p < SCORING.thresholds.launch) && s >= SCORING.thresholds.launch) push("CROSSED_LAUNCH", "high", `${name} passe ${SCORING.thresholds.launch} (${p ?? "—"} → ${s}), confiance ${c.confidence_level}.`);
    if (p != null && s - p >= A.scoreJump) push("SCORE_JUMP", "warn", `${name} : +${s - p} points (${p} → ${s}).`);
    const m0 = prev.components.moroccoDemand, m1 = now.components.moroccoDemand;
    if (m0 != null && m1 != null && m1 - m0 >= A.moroccoJump) push("MOROCCO_JUMP", "warn", `${name} : signal Maroc +${Math.round(m1 - m0)} (${m0} → ${m1}).`);
    const v = now.components.trendVelocity;
    if (p != null && p < A.weakAccelerating.wasBelow && v != null && v >= A.weakAccelerating.velocityAbove) push("WEAK_ACCELERATING", "info", `${name} était faible (${p}) et accélère (vélocité ${v}).`);
  }
  if (marginPct != null && marginPct < SCORING.margin.alertBelowPct) push("LOW_MARGIN", "warn", `${name} : marge ${marginPct} % < ${SCORING.margin.alertBelowPct} %.`);
  const bySupplier = new Map<string, SupplierOffer[]>();
  for (const o of offers) bySupplier.set(o.supplier_name, [...(bySupplier.get(o.supplier_name) ?? []), o]);
  for (const [sup, rows] of bySupplier) {
    rows.sort((a, b) => b.observed_at.localeCompare(a.observed_at));
    if (rows[0].supplier_status === "OUT_OF_STOCK" && rows[1] && rows[1].supplier_status !== "OUT_OF_STOCK") push("SUPPLIER_OUT", "high", `${name} : rupture chez ${sup}.`);
  }
  if (c.status === "IMPORTED" && events.length) {
    const t = Date.now();
    const cur = computeKpis(events, 30, t);
    const before = computeKpis(events.filter((e) => t - Date.parse(e.occurred_at) > 30 * 864e5), 30, t - 30 * 864e5);
    if (before.UNITS_SOLD >= 5 && cur.UNITS_SOLD <= before.UNITS_SOLD * (1 - A.heroConversionDropPct / 100))
      push("HERO_DROP", "high", `${name} : ventes 30 j ${before.UNITS_SOLD} → ${cur.UNITS_SOLD}.`);
  }
  // No duplicates: skip an alert whose kind is already open for this candidate.
  const db = getStore();
  const open = (await db.list("radar_alerts", { eq: { candidate_id: c.id, acknowledged_at: null } })).map((a) => a.kind);
  return db.insert("radar_alerts", out.filter((a) => !open.includes(a.kind)));
}

export async function acknowledgeAlert(id: string) {
  return getStore().update("radar_alerts", id, { acknowledged_at: iso() });
}

// ------------------------------------------------------------------ decisions
export type DecisionAction = "APPROVE" | "APPROVE_PREPARE" | "TEST" | "WATCH" | "LAUNCH" | "REJECT" | "ARCHIVE" | "MARK_READY" | "MARK_IMPORTED" | "REOPEN";
const TARGET: Record<DecisionAction, CandidateStatus | null> = {
  APPROVE: "APPROVED", APPROVE_PREPARE: "APPROVED", TEST: "TEST", WATCH: "WATCH", LAUNCH: "LAUNCH", REJECT: "REJECTED",
  ARCHIVE: "ARCHIVED", MARK_READY: null, MARK_IMPORTED: "IMPORTED", REOPEN: "DISCOVERED",
};

export async function decide(id: string, action: DecisionAction, actor: string, note: string | null = null) {
  const db = getStore();
  const c = await db.get("sneaker_candidates", id);
  if (!c) throw new Error("Candidat introuvable");
  if (!(action in TARGET)) throw new Error("Action inconnue");
  if (action === "MARK_IMPORTED" && c.status !== "APPROVED") throw new Error("Seul un candidat APPROVED peut être marqué importé.");
  const to = TARGET[action];
  const patch: Partial<Candidate> = {};
  if (to) patch.status = to;
  if (to === "APPROVED") patch.approved_at = iso();
  if (to === "REJECTED") patch.rejected_at = iso();
  if (action === "APPROVE_PREPARE") await prepareCatalogue(id);
  if (action === "APPROVE_PREPARE" || action === "APPROVE") await ensureBrief(id);
  if (action === "MARK_READY") {
    if (c.status !== "APPROVED") throw new Error("Approuvez le candidat avant de le marquer prêt.");
    const draft = (await db.list("catalogue_products", { eq: { candidate_id: id } }))[0];
    if (!draft) throw new Error("Aucune fiche préparée.");
    if (draft.issues.length) throw new Error("Fiche incomplète : " + draft.issues.join(" "));
    await db.update("catalogue_products", draft.id, { publishable: true, status: "READY", updated_at: iso() });
  }
  if (Object.keys(patch).length) await updateCandidate(id, patch);
  await db.insert("product_approvals", [{ candidate_id: id, action, from_status: c.status, to_status: to ?? c.status, actor, note, created_at: iso() }]);
}

export async function prepareCatalogue(id: string) {
  const db = getStore();
  const b = await bundle(id);
  if (!b) throw new Error("Candidat introuvable");
  const { handle, product, issues } = await prepareProduct(b.candidate, bestOffer(b.offers));
  const row = { candidate_id: id, handle, product, publishable: false, status: "DRAFT" as const, issues, updated_at: iso() };
  if (b.draft) await db.update("catalogue_products", b.draft.id, row);
  else await db.insert("catalogue_products", [{ ...row, created_at: iso() }]);
  return { handle, issues };
}

export async function ensureBrief(id: string) {
  const db = getStore();
  const c = await db.get("sneaker_candidates", id);
  if (!c) return;
  const existing = await db.list("product_marketing_briefs", { eq: { candidate_id: id } });
  if (existing.length) return existing[0];
  return (await db.insert("product_marketing_briefs", [{ candidate_id: id, brief: buildBrief(c), created_at: iso() }]))[0];
}

// ------------------------------------------------------------------ first-party
export async function recordOrder(input: { handle: string; size: string | null; quantity: number; unitPriceMAD: number | null; reference: string | null; occurredAt?: string }) {
  const db = getStore();
  const cand = (await db.list("sneaker_candidates", { eq: { catalogue_handle: input.handle } }))[0] ?? null;
  const qty = Math.max(1, Math.floor(input.quantity));
  return (await db.insert("performance_events", [{
    handle: input.handle, candidate_id: cand?.id ?? null, event: "purchase", size: input.size, quantity: qty,
    revenue_mad: input.unitPriceMAD == null ? null : input.unitPriceMAD * qty, source: "MANUAL_ORDER", reference: input.reference,
    occurred_at: input.occurredAt ?? iso(), created_at: iso(),
  }]))[0];
}

/** Daily aggregate per handle (all-time and 30 days) for reporting. */
export async function writePerformanceMetrics() {
  const db = getStore();
  const events = await db.list("performance_events");
  const byHandle = new Map<string, PerformanceEvent[]>();
  for (const e of events) byHandle.set(e.handle, [...(byHandle.get(e.handle) ?? []), e]);
  const rows = [];
  for (const [handle, list] of byHandle) for (const w of [30, 0]) {
    const k = computeKpis(list, w || null);
    rows.push({ handle, candidate_id: list.find((e) => e.candidate_id)?.candidate_id ?? null, window_days: w, computed_at: iso(), views: k.views, add_to_cart: k.addToCart, checkout_started: k.checkoutStarted, purchases: k.purchases, units: k.units, revenue_mad: k.revenueMAD, refunds: k.refunds, size_mix: k.sizeMix });
  }
  return db.insert("performance_metrics", rows);
}
