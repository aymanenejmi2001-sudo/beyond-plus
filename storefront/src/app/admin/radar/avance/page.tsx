import Link from "next/link";
import s from "../../admin.module.css";
import { getStore } from "../../../../../radar/lib/store.ts";
import type { Candidate } from "../../../../../radar/lib/types.ts";
import { ackAlertAction, decideAction, recomputeAction } from "../actions";
import { Confidence, Delta, Flash, Header, Meter, Reco, date, fmt } from "../ui";

const OPEN = ["DISCOVERED", "WATCH", "TEST", "LAUNCH"];
const VIEWS: { id: string; label: string; test: (c: Candidate) => boolean }[] = [
  { id: "new", label: "Nouvelles opportunités", test: (c) => c.status === "DISCOVERED" },
  { id: "launch", label: "Candidats LAUNCH", test: (c) => OPEN.includes(c.status) && c.recommendation === "LAUNCH" },
  { id: "test", label: "Candidats TEST", test: (c) => OPEN.includes(c.status) && c.recommendation === "TEST" },
  { id: "watch", label: "Watchlist", test: (c) => c.status === "WATCH" || (OPEN.includes(c.status) && c.recommendation === "WATCH") },
  { id: "approved", label: "Approuvés", test: (c) => c.status === "APPROVED" },
  { id: "imported", label: "En ligne", test: (c) => c.status === "IMPORTED" },
  { id: "closed", label: "Rejetés / archivés", test: (c) => c.status === "REJECTED" || c.status === "ARCHIVED" },
  { id: "all", label: "Tous", test: () => true },
];

type SP = Promise<{ view?: string; q?: string; ok?: string; err?: string }>;

export default async function RadarHome({ searchParams }: { searchParams: SP }) {
  const { view = "launch", q = "", ok, err } = await searchParams;
  const db = getStore();
  const [all, alerts, runs] = await Promise.all([
    db.list("sneaker_candidates"),
    db.list("radar_alerts", { eq: { acknowledged_at: null }, order: { col: "created_at", asc: false }, limit: 30 }),
    db.list("radar_runs", { order: { col: "started_at", asc: false }, limit: 1 }),
  ]);
  const v = VIEWS.find((x) => x.id === view) ?? VIEWS[1];
  const needle = q.trim().toLowerCase();
  const rows = all
    .filter(v.test)
    .filter((c) => !needle || `${c.brand} ${c.model} ${c.colorway ?? ""} ${c.sku ?? ""}`.toLowerCase().includes(needle))
    .sort((a, b) => (b.beyond_score ?? -1) - (a.beyond_score ?? -1));
  const byId = new Map(all.map((c) => [c.id, c]));
  const here = `/admin/radar/avance?view=${v.id}${q ? `&q=${encodeURIComponent(q)}` : ""}`;
  const readOnlyRisk = db.kind === "file" && process.env.VERCEL;

  return (
    <main className={s.wrap}>
      <Header storeKind={db.kind} />
      <Flash ok={ok} err={err} />
      {readOnlyRisk && <p className={s.notice}>Stockage fichier sur Vercel : les écritures ne sont pas persistées. Configurez SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY.</p>}

      <nav className={s.tiles} aria-label="Vues">
        {VIEWS.filter((x) => x.id !== "all").map((x) => (
          <Link key={x.id} href={`/admin/radar/avance?view=${x.id}`} className={s.tile} data-active={x.id === v.id}>
            <b>{all.filter(x.test).length}</b><span>{x.label}</span>
          </Link>
        ))}
      </nav>

      {alerts.length > 0 && (
        <section className={s.panel} aria-labelledby="alerts">
          <h2 className={s.h2} id="alerts">Alertes ({alerts.length})</h2>
          {alerts.map((a) => (
            <div key={a.id} className={s.alert}>
              <span>
                <span className={`${s.badge} ${a.severity === "high" ? s.LOW : a.severity === "warn" ? s.MEDIUM : ""}`}>{a.kind}</span>{" "}
                {a.candidate_id && byId.has(a.candidate_id) ? <Link href={`/admin/radar/${a.candidate_id}`}>{a.message}</Link> : a.message}
                <span className={`${s.muted} ${s.small}`}> · {date(a.created_at)}</span>
              </span>
              <form action={ackAlertAction}><input type="hidden" name="alert" value={a.id} /><input type="hidden" name="from" value={here} /><button className={s.btn}>OK</button></form>
            </div>
          ))}
        </section>
      )}

      <section className={s.panel}>
        <div className={s.top} style={{ marginBottom: 12 }}>
          <div>
            <h1 className={s.h1}>{v.label}</h1>
            <p className={`${s.muted} ${s.small}`} style={{ margin: 0 }}>
              {rows.length} candidat(s) · dernier calcul {runs[0] ? `${date(runs[0].started_at)} (${runs[0].kind}, ${runs[0].status})` : "jamais"}
            </p>
          </div>
          <div className={s.actions}>
            <form method="get" action="/admin/radar/avance" className={s.actions}>
              <input type="hidden" name="view" value={v.id} />
              <label className={s.field}><span className="visually-hidden">Rechercher</span><input name="q" defaultValue={q} placeholder="Rechercher…" /></label>
            </form>
            <Link className={s.btn} href="/admin/radar/avance?view=all">Tous ({all.length})</Link>
            <form action={recomputeAction}><button className={`${s.btn} ${s.btnPrimary}`}>Recalculer</button></form>
          </div>
        </div>

        {rows.length === 0 ? <p className={s.muted}>Rien dans cette vue.</p> : (
          <div className={s.tableScroll}>
            <table className={`${s.table} ${s.list}`}>
              <thead>
                <tr><th>Produit</th><th className={s.num}>Score</th><th>Reco.</th><th>Confiance</th><th>Mondial</th><th>Maroc</th><th>Vélocité</th><th>Marge</th><th>Fourn.</th><th>Statut</th><th>MAJ</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr key={c.id}>
                    <td><Link href={`/admin/radar/${c.id}`}><b>{c.brand} {c.model}</b></Link><br /><span className={`${s.muted} ${s.small}`}>{c.colorway ?? "modèle (tous coloris)"}</span></td>
                    <td className={s.num} data-label="Score"><span className={s.score}>{fmt(c.beyond_score)}</span><Delta d={c.score_change} /></td>
                    <td data-label="Reco."><Reco r={c.recommendation} /></td>
                    <td data-label="Confiance"><Confidence level={c.confidence_level} value={c.confidence} /></td>
                    <td data-label="Mondial"><Meter v={c.global_demand_score} /></td>
                    <td data-label="Maroc"><Meter v={c.morocco_demand_score} /></td>
                    <td data-label="Vélocité"><Meter v={c.trend_velocity_score} /></td>
                    <td data-label="Marge"><Meter v={c.margin_score} /></td>
                    <td data-label="Fournisseur"><Meter v={c.supplier_score} /></td>
                    <td data-label="Statut"><span className={s.badge}>{c.status}</span></td>
                    <td data-label="MAJ" className={s.small}>{date(c.last_checked_at)}</td>
                    <td>
                      <div className={s.actions}>
                        {["DISCOVERED", "WATCH", "TEST", "LAUNCH"].includes(c.status) && (
                          <>
                            {([["APPROVE", "Approuver", s.btnGood], ["TEST", "Test", ""], ["WATCH", "Watch", ""], ["REJECT", "Rejeter", s.btnBad]] as const).map(([a, label, cls]) => (
                              <form key={a} action={decideAction.bind(null, a)}>
                                <input type="hidden" name="id" value={c.id} /><input type="hidden" name="from" value={here} />
                                <button className={`${s.btn} ${cls}`} disabled={c.status === a}>{label}</button>
                              </form>
                            ))}
                          </>
                        )}
                        <Link className={s.btn} href={`/admin/radar/${c.id}`}>Détails</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <p className={`${s.muted} ${s.small}`}>
        Score 0–100 · LAUNCH ≥ 75, TEST ≥ 55 (radar/config/scoring.ts). Un score avec une confiance LOW repose surtout sur du jugement éditorial ou des données incomplètes : à vérifier avant de décider. Aucun produit n&apos;est publié sans approbation.
      </p>
    </main>
  );
}
