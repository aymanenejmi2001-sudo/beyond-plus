/* eslint-disable @next/next/no-img-element -- Admin/local preview images and small brand marks use explicit dimensions or CSS bounds. */
import Link from "next/link";
import s from "../admin.module.css";
import { logout } from "./actions";

export const fmt = (n: number | null | undefined, suffix = "") => (n == null ? "," : `${Math.round(n)}${suffix}`);
export const date = (iso: string | null | undefined) => (iso ? new Date(iso).toLocaleDateString("fr-MA", { day: "2-digit", month: "short", year: "numeric" }) : ",");

export function Header({ storeKind }: { storeKind: string }) {
  return (
    <header className={s.topbar}>
      <div className={s.topbarIn}>
        <Link href="/admin/radar" className={s.logo}>
          <img src="/images/beyond/symbol-256.png" alt="" width="26" height="26" /><span className={s.logoText}>BEYOND PLUS</span><em>RADAR</em>
        </Link>
        <nav className={s.navLinks}>
          <Link href="/admin/radar">Sélection</Link>
          <Link href="/admin/radar/avance">Analyse</Link>
          <Link href="/admin/radar/commandes">Commandes</Link>
          <a href="/" target="_blank" rel="noreferrer" className={s.navSite}>Le site ↗</a>
          <form action={logout} style={{ display: "contents" }}><button title={storeKind === "supabase" ? "Données : Supabase" : "Données : fichier local"}>Sortir</button></form>
        </nav>
      </div>
    </header>
  );
}

/** Toast after an action. A "Publié : /products/x" message becomes a link. */
export function Flash({ ok, err }: { ok?: string; err?: string }) {
  const msg = err ?? ok;
  if (!msg) return null;
  const m = msg.match(/(\/products\/[\w-]+)/);
  return (
    <p className={s.toast} data-kind={err ? "err" : "ok"} role={err ? "alert" : "status"}>
      {m ? <>Publié — en ligne sur le vrai site dans 2 à 4 min. <a href={m[1]} target="_blank" rel="noreferrer">Voir la fiche ↗</a></> : msg}
    </p>
  );
}

export function Confidence({ level, value }: { level: string | null; value?: number | null }) {
  if (!level) return <span className={s.muted}>,</span>;
  return <span className={`${s.badge} ${s[level]}`} title={value != null ? `Confiance ${value}/100` : undefined}>{level}</span>;
}

export function Reco({ r }: { r: string | null }) {
  return r ? <span className={`${s.badge} ${s[r]}`}>{r}</span> : <span className={s.muted}>,</span>;
}

export function Delta({ d }: { d: number | null }) {
  if (d == null || d === 0) return <span className={s.delta}>{d === 0 ? "=" : ""}</span>;
  return <span className={`${s.delta} ${d > 0 ? s.up : s.down}`}>{d > 0 ? "▲" : "▼"}{Math.abs(d)}</span>;
}

export function Meter({ v }: { v: number | null }) {
  return (
    <span className="nowrap">
      {fmt(v)}
      {v != null && <span className={s.meter} aria-hidden><i style={{ width: `${Math.max(0, Math.min(100, v))}%` }} /></span>}
    </span>
  );
}

/** Single-series score history. Hover a point for its value; the table below is the accessible view. */
export function History({ points, launch, test }: { points: { at: string; v: number }[]; launch: number; test: number }) {
  if (points.length < 2) return <p className={s.muted}>Pas encore d&apos;historique (au moins deux calculs).</p>;
  const W = 600, H = 160, pl = 28, pr = 8, pt = 8, pb = 20;
  const x = (i: number) => pl + (i * (W - pl - pr)) / (points.length - 1);
  const y = (v: number) => pt + (1 - v / 100) * (H - pt - pb);
  return (
    <svg className={s.chart} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label="Historique du Beyond Score">
      {[0, 50, 100].map((g) => <g key={g}><line className={s.gridline} x1={pl} x2={W - pr} y1={y(g)} y2={y(g)} /><text x={0} y={y(g) + 3}>{g}</text></g>)}
      {[launch, test].map((t) => <line key={t} className={s.threshold} x1={pl} x2={W - pr} y1={y(t)} y2={y(t)} />)}
      <polyline className={s.line} points={points.map((p, i) => `${x(i)},${y(p.v)}`).join(" ")} vectorEffect="non-scaling-stroke" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(p.v)} r={12} fill="transparent"><title>{`${date(p.at)} : ${p.v}`}</title></circle>
          <circle className={s.dot} cx={x(i)} cy={y(p.v)} r={4} pointerEvents="none" />
        </g>
      ))}
      <text x={pl} y={H - 4}>{date(points[0].at)}</text>
      <text x={W - pr} y={H - 4} textAnchor="end">{date(points[points.length - 1].at)}</text>
    </svg>
  );
}
