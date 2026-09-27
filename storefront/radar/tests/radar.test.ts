// npm run radar:test — node:test, no dependencies. Uses a throwaway JSON store.
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

process.env.RADAR_DATA_FILE = join(mkdtempSync(join(tmpdir(), "radar-")), "db.json");
delete process.env.SUPABASE_URL;
process.env.RADAR_ADMIN_PASSWORD = "unit-test";

const { SCORING, recommend } = await import("../config/scoring.ts");
const { computeScore } = await import("../scoring/beyondScore.ts");
const { dedupeKey } = await import("../normalizers/candidate.ts");
const { computeKpis, recommendedSizeMix, sizeDistribution } = await import("../performance/kpis.ts");
const svc = await import("../services/radar.ts");
const auth = await import("../lib/auth.ts");
const { getStore } = await import("../lib/store.ts");

const NOW = Date.parse("2026-09-24T12:00:00Z");
const day = (d: number) => new Date(NOW - d * 864e5).toISOString();
const cand = (o: Record<string, unknown> = {}) => ({ id: "c1", brand: "ASICS", model: "Gel-1130", colorway: null, selling_price_mad: null, catalogue_handle: null, ...o }) as never;
const sig = (o: Record<string, unknown>) => ({ id: Math.random().toString(), candidate_id: "c1", dimension: "global", source: "Google Trends", metric: "idx", value: 50, raw_value: null, raw_unit: null, reliability: "MARKET", source_url: null, observed_at: day(1), note: null, created_by: "t", created_at: day(1), ...o }) as never;
const offer = (o: Record<string, unknown> = {}) => ({ id: "o", candidate_id: "c1", supplier_name: "S", supplier_product_reference: null, supplier_url: "u", supplier_cost_mad: 500, cost_basis: "CONFIRMED_COST", shipping_cost_mad: 50, estimated_landed_cost_mad: 550, minimum_order_quantity: null, available_sizes: ["40", "41", "42"], available_quantity: null, lead_time_days: 5, supplier_status: "AVAILABLE", images_authorized: false, image_refs: null, observed_at: day(1), note: null, created_at: day(1), ...o }) as never;

test("weights sum to 1 and thresholds map to recommendations", () => {
  assert.equal(Math.round(Object.values(SCORING.weights).reduce((a, b) => a + b, 0) * 1000), 1000);
  assert.equal(recommend(75), "LAUNCH"); assert.equal(recommend(74), "TEST"); assert.equal(recommend(55), "TEST"); assert.equal(recommend(54), "WATCH"); assert.equal(recommend(null), null);
});

test("full data: score is exactly the weighted formula", () => {
  const r = computeScore({ candidate: cand({ selling_price_mad: 1000 }), now: NOW, events: [],
    market: [sig({ value: 80 }), sig({ dimension: "morocco", value: 60 }), sig({ dimension: "velocity", value: 70 })], morocco: [], offers: [offer()] });
  // margin 45 % → 100 ; supplier 60 + 3/10*30 + 10 = 79
  const expected = 80 * 0.3 + 60 * 0.3 + 70 * 0.15 + 100 * 0.15 + 79 * 0.1;
  assert.equal(r.weightCovered, 1);
  assert.equal(r.final, Math.round(expected));
});

test("no data → no score (unknown stays unknown)", () => {
  const r = computeScore({ candidate: cand(), now: NOW, events: [], market: [], morocco: [], offers: [] });
  assert.equal(r.final, null); assert.equal(r.recommendation, null);
  assert.ok(r.components.every((c) => c.value === null));
});

test("same score, weak vs strong evidence → different confidence", () => {
  const weak = computeScore({ candidate: cand(), now: NOW, events: [], offers: [], morocco: [],
    market: [sig({ value: 83, reliability: "EDITORIAL", source: "Ed" }), sig({ dimension: "morocco", value: 83, reliability: "EDITORIAL", source: "Ed" })] });
  const strong = computeScore({ candidate: cand(), now: NOW, events: [], offers: [], morocco: [],
    market: ["A", "B", "C", "D", "E"].flatMap((s) => [sig({ value: 83, source: s, reliability: "VERIFIED" }), sig({ dimension: "morocco", value: 83, source: s, reliability: "VERIFIED" })]) });
  assert.equal(weak.final, 83); assert.equal(strong.final, 83);
  assert.equal(weak.confidence.level, "LOW");
  assert.ok(strong.confidence.value > weak.confidence.value);
  assert.notEqual(strong.confidence.level, "LOW");
});

test("stale signals are ignored", () => {
  const r = computeScore({ candidate: cand(), now: NOW, events: [], offers: [], morocco: [], market: [sig({ value: 90, observed_at: day(400) })] });
  assert.equal(r.components[0].value, null);
});

test("velocity from repeated observations", () => {
  const r = computeScore({ candidate: cand(), now: NOW, events: [], offers: [], morocco: [], market: [sig({ value: 40, observed_at: day(30) }), sig({ value: 60, observed_at: day(0) })] });
  assert.equal(r.components.find((c) => c.key === "trendVelocity")!.value, 100); // +20 pts/30 d × 2.5 + 50 → clamp 100
});

test("margin unknown when shipping unknown — never invented", () => {
  const r = computeScore({ candidate: cand({ selling_price_mad: 900 }), now: NOW, events: [], market: [], morocco: [], offers: [offer({ shipping_cost_mad: null, estimated_landed_cost_mad: null })] });
  assert.equal(r.components.find((c) => c.key === "marginScore")!.value, null);
  assert.equal(r.marginCalc.grossMarginPct, null);
});

test("first-party weight grows with units sold", () => {
  const ev = (n: number) => Array.from({ length: n }, (_, i) => ({ id: `e${i}`, handle: "h", candidate_id: "c1", event: "purchase", size: "42", quantity: 1, revenue_mad: 900, source: "MANUAL_ORDER", reference: `r${i}`, occurred_at: day(1), created_at: day(1) }) as never);
  const base = { candidate: cand({ catalogue_handle: "h" }), now: NOW, market: [sig({ value: 50 }), sig({ dimension: "morocco", value: 50 })], morocco: [], offers: [] };
  const few = computeScore({ ...base, events: ev(4) }), many = computeScore({ ...base, events: ev(40) });
  assert.ok(few.firstParty.weight < many.firstParty.weight);
  assert.equal(many.firstParty.weight, SCORING.learning.maxFirstPartyWeight);
  assert.ok(many.final! > few.final!);
});

test("KPIs and size mix use real events only", () => {
  const e = (event: string, size: string | null = null) => ({ id: Math.random().toString(), handle: "h", candidate_id: null, event, size, quantity: 1, revenue_mad: event === "purchase" ? 800 : null, source: "SITE_EVENT", reference: null, occurred_at: day(1), created_at: day(1) }) as never;
  const k = computeKpis([e("view"), e("view"), e("view"), e("view"), e("add_to_cart"), e("add_to_cart"), e("checkout_started"), e("purchase", "41"), e("purchase", "42")], null, NOW);
  assert.equal(k.VIEW_TO_CART, 50); assert.equal(k.CART_TO_CHECKOUT, 50); assert.equal(k.UNITS_SOLD, 2); assert.equal(k.REVENUE, 1600);
  assert.deepEqual(sizeDistribution({ "41": 1, "42": 3 }).map((d) => d.pct), [25, 75]);
  assert.equal(recommendedSizeMix({ "41": 1 }, 24).ready, false);
  const orders = computeKpis([e("purchase", "40")], null, NOW);
  assert.equal(orders.PRODUCT_CONVERSION_RATE, null, "no traffic → conversion unknown, not 100 %");
});

test("dedupe key", () => {
  assert.equal(dedupeKey({ brand: "asics", model: "GEL-1130", colorway: "White / Silver" }), dedupeKey({ brand: "ASICS", model: "gel 1130", colorway: "white silver" }));
  assert.equal(dedupeKey({ brand: "Nike", model: "x", sku: "hf-1234 100" }), "sku:HF1234100");
});

test("service: duplicates, approval flow, never auto-publish", async () => {
  const a = await svc.upsertCandidate({ brand: "PUMA", model: "Speedcat OG", colorway: "Black White", source: "test" });
  const b = await svc.upsertCandidate({ brand: "puma", model: "speedcat og", colorway: "black / white", source: "test" });
  assert.equal(a.created, true); assert.equal(b.created, false); assert.equal(a.candidate.id, b.candidate.id);
  const id = a.candidate.id;
  await svc.recompute(id);
  await assert.rejects(svc.decide(id, "MARK_READY", "t"), /Approuvez/);
  await svc.decide(id, "APPROVE_PREPARE", "t");
  const db = getStore();
  const [draft] = await db.list("catalogue_products", { eq: { candidate_id: id } });
  assert.equal(draft.publishable, false);
  assert.ok(draft.issues.length > 0, "no price / images → issues");
  await assert.rejects(svc.decide(id, "MARK_READY", "t"), /incomplète/);
  assert.equal((await db.get("sneaker_candidates", id))!.status, "APPROVED");
  assert.equal((await db.get("sneaker_candidates", id))!.catalogue_handle, null, "not online until imported");
  await svc.decide(id, "REJECT", "t", "test");
  const c = (await db.get("sneaker_candidates", id))!;
  assert.equal(c.status, "REJECTED"); assert.ok(c.rejected_at);
  assert.equal((await db.list("product_approvals", { eq: { candidate_id: id } })).length, 2);
  assert.ok((await db.list("product_marketing_briefs", { eq: { candidate_id: id } })).length === 1);
});

test("history: snapshots accumulate, never overwritten", async () => {
  const { candidate } = await svc.upsertCandidate({ brand: "Vans", model: "Knu Skool", colorway: "Black", source: "test" });
  await svc.addMarketSignal({ candidate_id: candidate.id, dimension: "global", source: "T", metric: "m", value: 50, raw_value: null, raw_unit: null, reliability: "MARKET", source_url: null, observed_at: day(3), note: null, created_by: "t" });
  await svc.recompute(candidate.id);
  await svc.addMarketSignal({ candidate_id: candidate.id, dimension: "global", source: "T", metric: "m", value: 90, raw_value: null, raw_unit: null, reliability: "MARKET", source_url: null, observed_at: day(0), note: null, created_by: "t" });
  const r = await svc.recompute(candidate.id);
  const snaps = await getStore().list("score_snapshots", { eq: { candidate_id: candidate.id } });
  assert.equal(snaps.length, 2);
  assert.ok(r.candidate.score_change! > 0);
  assert.ok(r.alerts.some((a) => a.kind === "SCORE_JUMP" || a.kind === "CROSSED_LAUNCH"));
});

test("auth: signed session, tamper and wrong password rejected", async () => {
  const s = await auth.createSession();
  assert.equal(await auth.verifySession(s.value), true);
  assert.equal(await auth.verifySession(s.value.replace(/.$/, (c) => (c === "0" ? "1" : "0"))), false);
  assert.equal(await auth.verifySession(`${Date.now() - 1000}.abc`), false);
  assert.equal(await auth.checkPassword("unit-test"), true);
  assert.equal(await auth.checkPassword("nope"), false);
  const saved = process.env.RADAR_ADMIN_PASSWORD; delete process.env.RADAR_ADMIN_PASSWORD;
  assert.equal(await auth.verifySession(s.value), false, "no password configured → closed");
  process.env.RADAR_ADMIN_PASSWORD = saved;
});
