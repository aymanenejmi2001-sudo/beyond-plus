// Live-site update. After every publish, Radar waits DEPLOY_DELAY_MS (so a
// burst of publishes goes out as one update), then runs `vercel deploy --prod`
// from the owner's Mac. The button "Mettre en ligne maintenant" skips the wait.
// Never runs on Vercel itself (no CLI there).

import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { writeSiteFiles } from "./siteFiles.ts";

export const DEPLOY_DELAY_MS = 2 * 60e3;
const dir = () => join(process.cwd(), ".radar");
const flag = () => join(dir(), "pending-deploy.json");
const statusFile = () => join(dir(), "deploy-status.json");

export type DeployStatus = { state: "idle" | "scheduled" | "running" | "done" | "error"; at: string; runAt?: string; message?: string; count?: number };

export const onVercel = () => !!process.env.VERCEL;
/** Mac: Vercel CLI. Online: Vercel API, needs VERCEL_TOKEN in the project env. */
export const canDeploy = () => !onVercel() || !!process.env.VERCEL_TOKEN;

const TEAM = "team_ID4l2bskDBgY741ZjGhQcctw";
const PROJECT = "prj_PGgWQhqLeAZcGE1xw25NsMiAJZ8p";

/** Online: rebuild the current production deployment. The build's prebuild
 *  step pulls the latest Radar data from Supabase, so new pairs appear. */
export async function redeployViaApi(): Promise<string> {
  const token = process.env.VERCEL_TOKEN;
  if (!token) throw new Error("VERCEL_TOKEN manquant : la mise à jour automatique en ligne n'est pas activée.");
  const h = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  const list = await fetch(`https://api.vercel.com/v6/deployments?projectId=${PROJECT}&teamId=${TEAM}&target=production&limit=5`, { headers: h }).then((r) => r.json());
  const all = (list.deployments ?? []) as { uid: string; state?: string; readyState?: string; created: number }[];
  if (all.some((d) => ["BUILDING", "QUEUED", "INITIALIZING"].includes(d.state ?? d.readyState ?? "") && Date.now() - d.created < 60e3)) return "déjà en cours";
  const last = all.find((d) => (d.state ?? d.readyState) === "READY");
  if (!last) throw new Error("Aucune version en ligne à reconstruire.");
  const res = await fetch(`https://api.vercel.com/v13/deployments?teamId=${TEAM}&forceNew=1`, { method: "POST", headers: h, body: JSON.stringify({ name: "beyond-plus", deploymentId: last.uid, target: "production" }) });
  if (!res.ok) throw new Error(`Mise en ligne refusée par Vercel (${res.status}).`);
  return (await res.json()).url ?? "";
}

async function setStatus(s: DeployStatus) {
  if (onVercel()) return;
  await mkdir(dir(), { recursive: true });
  await writeFile(statusFile(), JSON.stringify(s));
}
export async function deployStatus(): Promise<DeployStatus> {
  try { return JSON.parse(await readFile(statusFile(), "utf8")); } catch { return { state: "idle", at: new Date(0).toISOString() }; }
}

/** Called by publishNow: something is on the Mac but not yet on the live site. */
export async function markPending(handle: string) {
  if (onVercel()) return;
  let list: string[] = [];
  try { list = JSON.parse(await readFile(flag(), "utf8")); } catch { /* none */ }
  await mkdir(dir(), { recursive: true });
  await writeFile(flag(), JSON.stringify([...new Set([...list, handle])]));
}
export async function pendingChanges(): Promise<{ pending: boolean; handles: string[] }> {
  try { const handles = JSON.parse(await readFile(flag(), "utf8")) as string[]; return { pending: handles.length > 0, handles }; }
  catch { return { pending: false, handles: [] }; }
}

// One timer per server process (survives hot reloads in dev).
const g = globalThis as unknown as { __radarDeploy?: { timer: NodeJS.Timeout | null; running: boolean; again: boolean } };
const state = (g.__radarDeploy ??= { timer: null, running: false, again: false });

/** Debounced: the live site is updated DEPLOY_DELAY_MS after the last call. */
export function scheduleDeploy(delay = DEPLOY_DELAY_MS) {
  if (!canDeploy()) return;
  if (onVercel()) { void redeployViaApi().catch((e) => console.error("[radar] redeploy", e)); return; }
  if (state.timer) clearTimeout(state.timer);
  const runAt = new Date(Date.now() + delay).toISOString();
  void setStatus({ state: "scheduled", at: new Date().toISOString(), runAt });
  state.timer = setTimeout(() => { state.timer = null; void runDeploy(); }, delay);
}

async function runDeploy() {
  if (state.running) { state.again = true; return; }
  state.running = true;
  const { handles } = await pendingChanges();
  await setStatus({ state: "running", at: new Date().toISOString(), count: handles.length });
  try {
    await deployProduction();
    await setStatus({ state: "done", at: new Date().toISOString(), count: handles.length });
  } catch (e) {
    await setStatus({ state: "error", at: new Date().toISOString(), message: (e as Error).message });
  } finally {
    state.running = false;
    if (state.again) { state.again = false; scheduleDeploy(10e3); }
  }
}

export function deployNow() { scheduleDeploy(0); }

export async function deployProduction(): Promise<string> {
  await writeSiteFiles(); // make sure the published pairs are in the files that ship
  const before = new Set((await pendingChanges()).handles);
  return new Promise((resolve, reject) => {
    execFile("vercel", ["deploy", "--prod", "--yes"], { cwd: process.cwd(), timeout: 15 * 60e3, maxBuffer: 50e6 }, async (err, stdout, stderr) => {
      if (err) return reject(new Error("Mise en ligne échouée : " + (stderr || err.message).split("\n").filter(Boolean).slice(-3).join(" ")));
      // Clear only what this deploy shipped (a publish during the upload stays pending).
      const now = (await pendingChanges()).handles.filter((h) => !before.has(h));
      await writeFile(flag(), JSON.stringify(now));
      resolve((stdout.match(/https:\/\/\S+/g) ?? []).pop() ?? "");
    });
  });
}
