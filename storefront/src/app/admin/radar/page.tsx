/* eslint-disable @next/next/no-img-element -- Admin/local preview images and small brand marks use explicit dimensions or CSS bounds. */
import Link from "next/link";
import s from "../admin.module.css";
import { IN_DEMAND, MIN_PHOTOS } from "../../../../radar/config/scoring.ts";
import { getStore } from "../../../../radar/lib/store.ts";
import type { Candidate, SupplierOffer } from "../../../../radar/lib/types.ts";
import { bestOffer } from "../../../../radar/scoring/components.ts";
import { CATALOG } from "@/data/catalog";
import { completeAction, decideAction, deployAction, publishAction } from "./actions";
import { DeployButton } from "./DeployButton";
import { PublishButton } from "./PublishButton";
import { PhotosTab, photoGaps } from "./PhotosTab";
import { canDeploy, deployStatus, pendingChanges } from "../../../../radar/services/deploy.ts";
import { Flash, Header } from "./ui";

// Sélection — the simple mode: see the pairs, set a price, publish or set aside.
// Scores, signals and history live in /admin/radar/avance ("Analyse").

const POTENTIAL: Record<string, string> = { LAUNCH: "Fort potentiel", TEST: "À tester", WATCH: "À surveiller" };
const RANK: Record<string, number> = { LAUNCH: 0, TEST: 1, WATCH: 2 };
type SP = Promise<{ tab?: string; brand?: string; q?: string; f?: string; ok?: string; err?: string }>;

const NEW_HOURS = 24;
const COLLAB_RX = /\bx\b|travis|off-white|comme des|wales bonner|sacai|jacquemus|union|fragment|stussy|supreme|aime leon|kiko|concepts|loewe|a ma maniere/i;
const isNew = (c: Candidate) => Date.now() - Date.parse(c.first_detected_at) < NEW_HOURS * 3600e3;
const FOCUS: { id: string; label: string; test: (c: Candidate) => boolean }[] = [
  { id: "new", label: "Nouveautés", test: isNew },
  { id: "collab", label: "Collabs", test: (c) => /collab/i.test(c.notes ?? "") || COLLAB_RX.test(`${c.model} ${c.colorway ?? ""}`) },
  { id: "femme", label: "Femme", test: (c) => c.gender === "women" },
  { id: "enfant", label: "Enfant", test: (c) => /enfant/i.test(c.notes ?? "") },
];

export default async function Selection({ searchParams }: { searchParams: SP }) {
  const { tab = "publier", brand = "", q = "", f = "", ok, err } = await searchParams;
  const db = getStore();
  const [all, offers, live, dep, gaps] = await Promise.all([db.list("sneaker_candidates"), db.list("supplier_offers"), Promise.resolve(new Set(CATALOG.map((p) => p.handle))), pendingChanges(), photoGaps()]);
  const ds = await deployStatus();
  const hhmm = (iso?: string) => (iso ? new Date(iso).toLocaleTimeString("fr-MA", { hour: "2-digit", minute: "2-digit" }) : "");
  const photoMissing = gaps.filter((g) => g.total < MIN_PHOTOS).length;
  const byCand = new Map<string, SupplierOffer[]>();
  for (const o of offers) byCand.set(o.candidate_id, [...(byCand.get(o.candidate_id) ?? []), o]);

  const isLive = (c: Candidate) => !!c.catalogue_handle && live.has(c.catalogue_handle);
  const closed = (c: Candidate) => c.status === "REJECTED" || c.status === "ARCHIVED";
  const view = (c: Candidate) => {
    const o = bestOffer(byCand.get(c.id) ?? []);
    const photos = [...new Set([
      ...(c.image_rights === "AUTHORIZED" && c.hero_image_reference?.startsWith("/") ? [c.hero_image_reference] : []),
      ...(byCand.get(c.id) ?? []).filter((x) => x.images_authorized).flatMap((x) => x.image_refs ?? []),
    ])];
    const img = photos[0] ?? null;
    const sizes = o?.available_sizes?.length ? o.available_sizes : null;
    const blocker = photos.length < MIN_PHOTOS ? `${photos.length}/${MIN_PHOTOS} photos` : !sizes ? "Pointures inconnues" : null;
    return { c, o, img, sizes, photos: photos.length, blocker };
  };
  const TABS = [
    { id: "publier", label: "À publier", test: (c: Candidate) => !isLive(c) && !closed(c) && IN_DEMAND.includes(c.recommendation ?? "") },
    { id: "en-ligne", label: "En ligne", test: isLive },
    { id: "ecartes", label: "Écartées", test: (c: Candidate) => closed(c) && !isLive(c) },
  ];
  const t = TABS.find((x) => x.id === tab) ?? TABS[0];
  const inTab = all.filter(t.test);
  const brands = [...new Set(inTab.map((c) => c.brand))].sort((a, b) => a.localeCompare(b));
  const needle = q.trim().toLowerCase();
  const focus = FOCUS.find((x) => x.id === f);
  const rows = inTab
    .filter((c) => !brand || c.brand === brand)
    .filter((c) => !focus || focus.test(c))
    .filter((c) => !needle || `${c.brand} ${c.model} ${c.colorway ?? ""}`.toLowerCase().includes(needle))
    .map(view)
    .sort((a, b) => Number(!!a.blocker) - Number(!!b.blocker)
      || (RANK[a.c.recommendation ?? ""] ?? 3) - (RANK[b.c.recommendation ?? ""] ?? 3)
      || (b.c.beyond_score ?? -1) - (a.c.beyond_score ?? -1));
  const qs = (o: Record<string, string>) => "/admin/radar?" + new URLSearchParams(Object.fromEntries(Object.entries({ tab: t.id, brand, q, f, ...o }).filter(([, v]) => v))).toString();
  const here = qs({});
  const ready = all.filter((c) => TABS[0].test(c)).map(view).filter((v) => !v.blocker).length;

  type Row = ReturnType<typeof view>;
  const Cards = ({ list }: { list: Row[] }) => (
      <div className={s.cards}>
        {list.map(({ c, o, img, sizes, photos, blocker }) => {
          const on = isLive(c);
          return (
            <article key={c.id} className={s.card}>
              <Link href={`/admin/radar/${c.id}`} className={s.plate} aria-label={`Détails ${c.brand} ${c.model}`}>
                {img ? <img src={img} alt="" loading="lazy" /> : <span className={s.plateEmpty}>Pas de photo<br />autorisée</span>}
                {c.recommendation && <span className={s.tag} data-tone={c.recommendation}>{POTENTIAL[c.recommendation]}</span>}
                {isNew(c) ? <span className={`${s.tag} ${s.tagNew}`}>Nouveau</span>
                  : c.confidence_level === "LOW" && c.recommendation && <span className={`${s.tag} ${s.tagRight}`} title="Surtout basé sur notre jugement, peu de données mesurées">estimation</span>}
              </Link>
              <div className={s.cardBody}>
                <span className={s.cardBrand}>{c.brand}</span>
                <span className={s.cardTitle}>{c.model}{c.colorway ? ` ${c.colorway}` : ""}</span>
                <span className={s.cardMeta}>
                  {sizes ? `${sizes[0]}–${sizes[sizes.length - 1]} · ${sizes.length} pointures` : "Pointures inconnues"} · {photos} photo{photos > 1 ? "s" : ""}
                  {o?.supplier_cost_mad != null && ` · fournisseur ${o.supplier_cost_mad} DH`}
                </span>

                {on ? (
                  <a className={s.liveLink} href={`/products/${c.catalogue_handle}`} target="_blank" rel="noreferrer">En ligne — voir ↗</a>
                ) : closed(c) ? null : blocker ? (
                  <details className={s.complete}>
                    <summary>+ Ajouter {MIN_PHOTOS} photos minimum</summary>
                    <form action={completeAction} className={s.completeForm}>
                      <input type="hidden" name="id" value={c.id} /><input type="hidden" name="from" value={here} />
                      <label className={s.field}>Photos — au moins 4, les tiennes (JPG, PNG, WebP)<input name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple required /></label>
                      <label className={s.field}>Coloris<input name="colorway" defaultValue={c.colorway ?? ""} placeholder="ex. White / Silver" required /></label>
                      <label className={s.field}>Pointures dispo<input name="sizes" placeholder="38 39 40 41 42" required /></label>
                      <label className={s.field}>Ton coût d&apos;achat (DH, facultatif)<input name="cost" type="number" min="0" /></label>
                      <button className={`${s.btn} ${s.btnPrimary}`}>Enregistrer</button>
                    </form>
                  </details>
                ) : (
                  <form action={publishAction} className={s.priceRow}>
                    <input type="hidden" name="id" value={c.id} /><input type="hidden" name="from" value={here} />
                    <label>DH<input name="price" type="number" min="1" required inputMode="numeric" aria-label="Prix de vente en dirhams" defaultValue={c.selling_price_mad ?? o?.supplier_cost_mad ?? ""} /></label>
                    <PublishButton />
                  </form>
                )}

                <div className={s.cardLinks}>
                  <Link href={`/admin/radar/${c.id}`}>Détails</Link>
                  {!on && !closed(c) && <form action={decideAction.bind(null, "REJECT")}><input type="hidden" name="id" value={c.id} /><input type="hidden" name="from" value={here} /><button>Écarter</button></form>}
                  {closed(c) && <form action={decideAction.bind(null, "REOPEN")}><input type="hidden" name="id" value={c.id} /><input type="hidden" name="from" value={here} /><button>Remettre en sélection</button></form>}
                </div>
              </div>
            </article>
          );
        })}
      </div>
  );

  return (
    <main className={s.wrap}>
      <Header storeKind={db.kind} />
      <Flash ok={ok} err={err} />

      {canDeploy() && !process.env.VERCEL && (dep.pending || ds.state === "running" || ds.state === "error") && (
        <div className={s.deployBar} data-state={ds.state}>
          <span>
            {ds.state === "running" ? <><b>Mise en ligne en cours…</b> Le vrai site sera à jour dans 2 à 4 minutes.</>
              : ds.state === "scheduled" ? <><b>{dep.handles.length} changement{dep.handles.length > 1 ? "s" : ""} en attente.</b> Mise en ligne automatique à {hhmm(ds.runAt)}.</>
              : ds.state === "error" ? <><b>La dernière mise en ligne a échoué.</b> {ds.message}</>
              : <><b>{dep.handles.length} changement{dep.handles.length > 1 ? "s" : ""} pas encore sur le vrai site.</b></>}
          </span>
          {ds.state !== "running" && <form action={deployAction}><DeployButton /></form>}
        </div>
      )}
      {process.env.VERCEL && (() => {
        const waiting = all.filter((c) => c.status === "IMPORTED" && c.catalogue_handle && !live.has(c.catalogue_handle)).length;
        return waiting > 0 ? (
          <div className={s.deployBar} data-state="running">
            <span><b>{waiting} paire{waiting > 1 ? "s" : ""} en cours de mise en ligne.</b> {process.env.VERCEL_TOKEN ? "Le site se met à jour tout seul (2 à 4 min) — rafraîchis ensuite." : "Mise à jour automatique non activée : ajoute VERCEL_TOKEN dans Vercel."}</span>
          </div>
        ) : null;
      })()}
      {canDeploy() && !process.env.VERCEL && !dep.pending && ds.state === "done" && (
        <p className={s.sectionSub}>✓ Vrai site à jour depuis {hhmm(ds.at)}.</p>
      )}
      <section className={s.hero}>
        <div>
          <p className={s.eyebrow}>Beyond Radar — sélection</p>
          <h1 className={s.heroTitle}>Les paires<br /><span>à sortir.</span></h1>
          <p className={s.heroSub}>{ready} paire{ready > 1 ? "s" : ""} prête{ready > 1 ? "s" : ""} à publier. Fixe le prix, publie, puis « Mettre en ligne » pour le vrai site.</p>
        </div>
      </section>

      <nav className={s.tabs} aria-label="Vues">
        {TABS.map((x) => (
          <Link key={x.id} href={`/admin/radar?tab=${x.id}`} data-active={tab !== "photos" && x.id === t.id}>{x.label}<sup>{all.filter(x.test).length}</sup></Link>
        ))}
        <Link href="/admin/radar?tab=photos" data-active={tab === "photos"}>Photos à compléter<sup>{photoMissing}</sup></Link>
      </nav>

      {tab === "photos" ? <PhotosTab here="/admin/radar?tab=photos" /> : (<>
      <div className={s.toolbar}>
        {FOCUS.map((x) => { const n = inTab.filter(x.test).length; return n ? <Link key={x.id} className={`${s.chip} ${s.chipFocus}`} href={qs({ f: f === x.id ? "" : x.id })} data-active={f === x.id}>{x.label} <sup>{n}</sup></Link> : null; })}
        <span className={s.chipSep} aria-hidden />
        <Link className={s.chip} href={qs({ brand: "" })} data-active={!brand}>Toutes</Link>
        {brands.map((b) => <Link key={b} className={s.chip} href={qs({ brand: b })} data-active={b === brand}>{b}</Link>)}
        <form method="get" action="/admin/radar" style={{ display: "contents" }}>
          <input type="hidden" name="tab" value={t.id} />{brand && <input type="hidden" name="brand" value={brand} />}{f && <input type="hidden" name="f" value={f} />}
          <input className={s.search} name="q" defaultValue={q} placeholder="Rechercher un modèle…" aria-label="Rechercher" />
        </form>
      </div>

      {rows.length === 0 && <p className={s.muted} style={{ padding: "40px 0" }}>Aucune paire ici.</p>}

      {t.id === "publier" && rows.every((r) => r.blocker) && (
        <p className={s.sectionSub} style={{ padding: "24px 0" }}>Aucune paire demandée n&apos;a encore {MIN_PHOTOS} photos. Complète-les ci-dessous.</p>
      )}
      {[{ key: "ready", title: null as string | null, list: rows.filter((r) => t.id !== "publier" || !r.blocker) },
        { key: "todo", title: `Demandées — moins de ${MIN_PHOTOS} photos`, list: t.id === "publier" ? rows.filter((r) => r.blocker) : [] }]
        .filter((g) => g.list.length).map((g) => (
      <section key={g.key}>
      {g.title ? (
      <details className={s.todoGroup}>
      <summary className={s.sectionTitle}>{g.title} <sup>{g.list.length}</sup></summary>
      <p className={s.sectionSub}>Pas publiables tant qu&apos;elles n&apos;ont pas {MIN_PHOTOS} photos. Ajoute tes propres photos (pas celles des marques ni des concurrents), le coloris et les pointures.</p>
      <Cards list={g.list} />
      </details>
      ) : <Cards list={g.list} />}
      </section>
      ))}

      </>)}

      <div className={s.legend}>
        <span><b>Fort potentiel</b> — à sortir en priorité</span>
        <span><b>À tester</b> — lancer en petite quantité</span>
        <span><b>À surveiller</b> — attendre</span>
        <span><b>Estimation</b> — basé surtout sur notre jugement, pas encore sur des chiffres</span>
      </div>
    </main>
  );
}
