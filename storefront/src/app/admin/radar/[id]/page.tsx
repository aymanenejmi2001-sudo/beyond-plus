/* eslint-disable @next/next/no-img-element -- Admin/local preview images and small brand marks use explicit dimensions or CSS bounds. */
import Link from "next/link";
import { notFound } from "next/navigation";
import s from "../../admin.module.css";
import { SCORING } from "../../../../../radar/config/scoring.ts";
import { getStore } from "../../../../../radar/lib/store.ts";
import { computeKpis, recommendedSizeMix, sizeDistribution } from "../../../../../radar/performance/kpis.ts";
import { bestOffer, margin } from "../../../../../radar/scoring/components.ts";
import { bundle } from "../../../../../radar/services/radar.ts";
import { SOURCES } from "../../../../../radar/sources/index.ts";
import {
  ackAlertAction, addMarketSignalAction, addMoroccoSignalAction, addSupplierOfferAction, decideAction, prepareAction, recomputeAction,
  recordOrderAction, saveIdentity,
} from "../actions";
import { Confidence, Delta, Flash, Header, History, Reco, date, fmt } from "../ui";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ ok?: string; err?: string }> };

const Hidden = ({ id }: { id: string }) => <input type="hidden" name="id" value={id} />;
const Field = ({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) => (
  <label className={`${s.field} ${wide ? s.wide : ""}`}>{label}{children}</label>
);
const today = () => new Date().toISOString().slice(0, 10);

export default async function CandidatePage({ params, searchParams }: Props) {
  const { id } = await params;
  const { ok, err } = await searchParams;
  const b = await bundle(id);
  if (!b) notFound();
  const { candidate: c, market, morocco, offers, snapshots, approvals, draft, brief, alerts, events } = b;
  const x = c.score_explanation;
  const offer = bestOffer(offers);
  const m = margin(c, offer);
  const kAll = computeKpis(events), k30 = computeKpis(events, 30);
  const dist = sizeDistribution(kAll.sizeMix);
  const mix = recommendedSizeMix(kAll.sizeMix, 24);
  const points = snapshots.filter((p) => p.beyond_score != null).map((p) => ({ at: p.created_at, v: p.beyond_score! })).slice(-40);
  const weekly = new Map<string, number>();
  for (const p of points) { const d = new Date(p.at); const wk = new Date(d.getTime() - ((d.getUTCDay() + 6) % 7) * 864e5).toISOString().slice(0, 10); weekly.set(wk, p.v); }
  const open = ["DISCOVERED", "WATCH", "TEST", "LAUNCH"].includes(c.status);
  const showImage = c.image_rights === "AUTHORIZED" && c.hero_image_reference?.startsWith("/");
  const store = getStore();
  const name = `${c.brand} ${c.model}${c.colorway ? `, ${c.colorway}` : ""}`;

  return (
    <main className={s.wrap}>
      <Header storeKind={store.kind} />
      <p className={s.small}><Link href="/admin/radar">← Radar</Link></p>
      <Flash ok={ok} err={err} />

      <section className={s.grid2}>
        <div className={s.panel}>
          <h1 className={s.h1}>{name}</h1>
          <p className={s.sub}><span className={s.badge}>{c.status}</span> · détecté le {date(c.first_detected_at)} · source : {c.source}</p>
          {showImage && <img className={s.thumb} src={c.hero_image_reference!} alt={name} />}
          {!showImage && <p className={`${s.muted} ${s.small}`}>Image non affichée : droits {c.image_rights === "NOT_PUBLISHABLE" ? "non établis" : "inconnus"}.</p>}
          <dl className={s.kv} style={{ marginTop: 12 }}>
            <dt>SKU</dt><dd>{c.sku ?? "inconnu"}</dd>
            <dt>Genre</dt><dd>{c.gender ?? "inconnu"}</dd>
            <dt>Famille</dt><dd>{c.style_family ?? ","}</dd>
            <dt>Officiel</dt><dd>{c.official_url ? <a href={c.official_url} target="_blank" rel="noreferrer noopener">{c.official_url}</a> : "non renseigné"}</dd>
            <dt>Prix officiel</dt><dd>{c.official_price != null ? `${c.official_price} ${c.official_currency ?? ""}` : "inconnu"}</dd>
            <dt>Prix BEYOND</dt><dd>{c.selling_price_mad != null ? `${c.selling_price_mad} MAD` : "non fixé"}</dd>
            <dt>Fiche en ligne</dt><dd>{c.catalogue_handle ? <a href={`/products/${c.catalogue_handle}`} target="_blank" rel="noreferrer">{c.catalogue_handle}</a> : ","}</dd>
          </dl>
        </div>

        <div className={s.panel}>
          <h2 className={s.h2}>Beyond Score</h2>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
            <span className={s.bigScore}>{fmt(c.beyond_score)}</span><Delta d={c.score_change} />
            <Reco r={c.recommendation} /> <span className={s.small}>Confiance</span> <Confidence level={c.confidence_level} value={c.confidence} />
          </div>
          {c.confidence_level === "LOW" && c.beyond_score != null && <p className={s.notice} style={{ marginTop: 12 }}>Score peu étayé : à confirmer par des signaux mesurés avant toute décision.</p>}
          <History points={points} launch={SCORING.thresholds.launch} test={SCORING.thresholds.test} />
          <form action={recomputeAction} style={{ marginTop: 8 }}><Hidden id={c.id} /><button className={s.btn}>Recalculer</button></form>
        </div>
      </section>

      <section className={s.panel}>
        <h2 className={s.h2}>Décision</h2>
        <form className={s.form}>
          <Hidden id={c.id} />
          <Field label="Note (facultatif)" wide><input name="note" placeholder="Pourquoi cette décision ?" /></Field>
          <div className={`${s.actions} ${s.wide}`}>
            {open && <>
              <button className={`${s.btn} ${s.btnPrimary}`} formAction={decideAction.bind(null, "APPROVE_PREPARE")}>Approuver &amp; préparer</button>
              <button className={`${s.btn} ${s.btnGood}`} formAction={decideAction.bind(null, "APPROVE")}>Approuver</button>
              <button className={s.btn} formAction={decideAction.bind(null, "LAUNCH")}>Launch</button>
              <button className={s.btn} formAction={decideAction.bind(null, "TEST")}>Test</button>
              <button className={s.btn} formAction={decideAction.bind(null, "WATCH")}>Watch</button>
              <button className={`${s.btn} ${s.btnBad}`} formAction={decideAction.bind(null, "REJECT")}>Rejeter</button>
            </>}
            {!open && <button className={s.btn} formAction={decideAction.bind(null, "REOPEN")}>Réouvrir</button>}
            {c.status !== "ARCHIVED" && <button className={s.btn} formAction={decideAction.bind(null, "ARCHIVE")}>Archiver</button>}
          </div>
        </form>
        <p className={`${s.muted} ${s.small}`}>Approuver ne publie rien. « Approuver &amp; préparer » crée une fiche catalogue en brouillon (publishable = false).</p>
        {approvals.length > 0 && (
          <div className={s.tableScroll}><table className={s.table}><thead><tr><th>Date</th><th>Action</th><th>Statut</th><th>Par</th><th>Note</th></tr></thead><tbody>
            {approvals.map((a) => <tr key={a.id}><td>{date(a.created_at)}</td><td>{a.action}</td><td>{a.from_status} → {a.to_status}</td><td>{a.actor}</td><td>{a.note ?? ""}</td></tr>)}
          </tbody></table></div>
        )}
      </section>

      <section className={s.panel} id="why">
        <h2 className={s.h2}>Pourquoi ce score ?</h2>
        {!x ? <p className={s.muted}>Pas encore calculé.</p> : (
          <>
            <div className={s.tableScroll}><table className={s.table}>
              <thead><tr><th>Composante</th><th className={s.num}>Valeur</th><th className={s.num}>Poids</th><th className={s.num}>Contribution</th><th>Détail</th></tr></thead>
              <tbody>
                {x.components.map((k) => (
                  <tr key={k.key}>
                    <td><b>{k.label}</b></td>
                    <td className={s.num}>{k.value == null ? <span className={s.muted}>inconnu</span> : k.value}</td>
                    <td className={s.num}>{Math.round(k.weight * 100)} %</td>
                    <td className={s.num}>{k.contribution ?? ","}</td>
                    <td><ul className={s.lines}>{k.lines.map((l, i) => <li key={i}>{l}</li>)}</ul></td>
                  </tr>
                ))}
              </tbody>
            </table></div>
            <ul className={s.lines}>
              <li>Poids couvert par des données : {Math.round(x.weightCovered * 100)} %, les composantes inconnues sont exclues et les poids restants remis à l&apos;échelle (minimum {Math.round(SCORING.minWeightCovered * 100)} %).</li>
              <li>Score externe = somme des contributions = {x.external ?? "non calculable"}.</li>
              {x.firstParty.lines.map((l, i) => <li key={`fp${i}`}>{l}</li>)}
              <li>Recommandation : {x.recommendation ?? ","} (LAUNCH ≥ {SCORING.thresholds.launch}, TEST ≥ {SCORING.thresholds.test}).</li>
            </ul>
            <h2 className={s.h2} style={{ marginTop: 16 }}>Confiance</h2>
            <ul className={s.lines}>{x.confidence.lines.map((l, i) => <li key={i}>{l}</li>)}</ul>
            <p className={`${s.muted} ${s.small}`}>Calculé le {date(x.computedAt)}.</p>
          </>
        )}
        {weekly.size > 0 && (
          <details style={{ marginTop: 12 }}><summary className={s.small}>Historique par semaine (tableau)</summary>
            <table className={s.table}><thead><tr><th>Semaine du</th><th className={s.num}>Score</th></tr></thead><tbody>
              {[...weekly].map(([wk, v]) => <tr key={wk}><td>{date(wk)}</td><td className={s.num}>{v}</td></tr>)}
            </tbody></table>
          </details>
        )}
      </section>

      <section className={s.panel} id="signals">
        <h2 className={s.h2}>Signaux marché (mondial / Maroc / vélocité)</h2>
        {market.length === 0 ? <p className={s.muted}>Aucun signal.</p> : (
          <div className={s.tableScroll}><table className={s.table}><thead><tr><th>Date</th><th>Dimension</th><th>Source</th><th>Mesure</th><th className={s.num}>0–100</th><th>Brut</th><th>Fiabilité</th><th>Lien</th></tr></thead><tbody>
            {market.map((m) => <tr key={m.id}><td>{date(m.observed_at)}</td><td>{m.dimension}</td><td>{m.source}</td><td>{m.metric}</td><td className={s.num}>{m.value}</td><td>{m.raw_value ?? ""} {m.raw_unit ?? ""}</td><td>{m.reliability}</td><td>{m.source_url ? <a href={m.source_url} target="_blank" rel="noreferrer noopener">source</a> : ","}</td></tr>)}
          </tbody></table></div>
        )}
        <details style={{ marginTop: 12 }}>
          <summary className={s.btn}>+ Ajouter un signal</summary>
          <form action={addMarketSignalAction} className={s.form} style={{ marginTop: 12 }}>
            <Hidden id={c.id} />
            <Field label="Dimension"><select name="dimension" defaultValue="global"><option value="global">Mondial</option><option value="morocco">Maroc</option><option value="velocity">Vélocité</option></select></Field>
            <Field label="Source"><input name="source" required list="radar-sources" placeholder="Google Trends" /></Field>
            <Field label="Mesure"><input name="metric" required placeholder="search_interest_index" /></Field>
            <Field label="Valeur normalisée 0–100"><input name="value" type="number" min="0" max="100" step="0.1" required /></Field>
            <Field label="Valeur brute"><input name="raw_value" type="number" step="any" /></Field>
            <Field label="Unité brute"><input name="raw_unit" placeholder="indice, vues, ratio…" /></Field>
            <Field label="Fiabilité"><select name="reliability" defaultValue="MARKET"><option>VERIFIED</option><option>MARKET</option><option>EDITORIAL</option></select></Field>
            <Field label="Date du relevé"><input name="observed_at" type="date" defaultValue={today()} /></Field>
            <Field label="URL source" wide><input name="source_url" type="url" placeholder="https://" /></Field>
            <Field label="Note" wide><input name="note" /></Field>
            <button className={`${s.btn} ${s.btnPrimary}`}>Ajouter</button>
          </form>
          <datalist id="radar-sources">{SOURCES.filter((x) => x.mode === "MANUAL").map((x) => <option key={x.id} value={x.label} />)}</datalist>
          <ul className={s.lines}>{SOURCES.filter((x) => x.mode === "MANUAL").map((x) => <li key={x.id}><b>{x.label}</b> ({x.mode}), {x.howTo}</li>)}</ul>
        </details>
      </section>

      <section className={s.panel} id="morocco">
        <h2 className={s.h2}>Marché marocain (signaux, pas des ventes)</h2>
        {morocco.length === 0 ? <p className={s.muted}>Aucun relevé.</p> : (
          <div className={s.tableScroll}><table className={s.table}><thead><tr><th>Date</th><th>Source</th><th className={s.num}>Revendeurs</th><th className={s.num}>Coloris</th><th className={s.num}>Prix min / moy / max</th><th className={s.num}>Promo</th><th>Dispo</th><th>Pointures</th></tr></thead><tbody>
            {morocco.map((m) => <tr key={m.id}><td>{date(m.observed_at)}</td><td>{m.source_url ? <a href={m.source_url} target="_blank" rel="noreferrer noopener">{m.source_name}</a> : m.source_name}</td><td className={s.num}>{m.retailers_count ?? "?"}</td><td className={s.num}>{m.colorways_count ?? "?"}</td><td className={s.num}>{m.min_price_mad ?? "?"} / {m.avg_price_mad ?? "?"} / {m.max_price_mad ?? "?"}</td><td className={s.num}>{m.promotion_frequency == null ? "?" : `${Math.round(m.promotion_frequency * 100)} %`}</td><td>{m.availability}</td><td>{m.size_availability ?? "?"}</td></tr>)}
          </tbody></table></div>
        )}
        <details style={{ marginTop: 12 }}>
          <summary className={s.btn}>+ Ajouter un relevé Maroc</summary>
          <form action={addMoroccoSignalAction} className={s.form} style={{ marginTop: 12 }}>
            <Hidden id={c.id} />
            <Field label="Source (revendeur / recherche)"><input name="source_name" required /></Field>
            <Field label="Revendeurs visibles"><input name="retailers_count" type="number" min="0" /></Field>
            <Field label="Coloris visibles"><input name="colorways_count" type="number" min="0" /></Field>
            <Field label="Prix min (MAD)"><input name="min_price_mad" type="number" min="0" /></Field>
            <Field label="Prix moyen (MAD)"><input name="avg_price_mad" type="number" min="0" /></Field>
            <Field label="Prix max (MAD)"><input name="max_price_mad" type="number" min="0" /></Field>
            <Field label="% d'annonces en promo"><input name="promotion_pct" type="number" min="0" max="100" /></Field>
            <Field label="Disponibilité"><select name="availability" defaultValue="UNKNOWN"><option value="UNKNOWN">Inconnue</option><option value="IN_STOCK">En stock</option><option value="LIMITED">Limitée</option><option value="OUT_OF_STOCK">Rupture</option></select></Field>
            <Field label="Pointures visibles"><input name="size_availability" placeholder="38–44" /></Field>
            <Field label="Date du relevé"><input name="observed_at" type="date" defaultValue={today()} /></Field>
            <Field label="URL source" wide><input name="source_url" type="url" placeholder="https://" /></Field>
            <Field label="Note" wide><input name="note" placeholder="Ne pas copier de texte ou d'image concurrent" /></Field>
            <button className={`${s.btn} ${s.btnPrimary}`}>Ajouter</button>
          </form>
        </details>
      </section>

      <section className={s.grid2}>
        <div className={s.panel} id="supplier">
          <h2 className={s.h2}>Fournisseurs</h2>
          {offers.length === 0 ? <p className={s.muted}>Aucune offre.</p> : (
            <div className={s.tableScroll}><table className={s.table}><thead><tr><th>Date</th><th>Fournisseur</th><th className={s.num}>Coût</th><th className={s.num}>Transport</th><th>Statut</th><th>Pointures</th><th className={s.num}>Délai</th></tr></thead><tbody>
              {offers.map((o) => <tr key={o.id}><td>{date(o.observed_at)}</td><td>{o.supplier_url ? <a href={o.supplier_url} target="_blank" rel="noreferrer noopener">{o.supplier_name}</a> : o.supplier_name}</td><td className={s.num} title={o.cost_basis ?? ""}>{o.supplier_cost_mad ?? "?"}{o.cost_basis === "SUPPLIER_LISTED_PRICE" ? "*" : ""}</td><td className={s.num}>{o.shipping_cost_mad ?? "?"}</td><td>{o.supplier_status}</td><td className={s.small}>{o.available_sizes?.join(" ") ?? "?"}</td><td className={s.num}>{o.lead_time_days ?? "?"}</td></tr>)}
            </tbody></table></div>
          )}
          <p className={`${s.muted} ${s.small}`}>* prix affiché par le fournisseur, pas un coût confirmé. « ? » = inconnu.</p>
          <details style={{ marginTop: 12 }}>
            <summary className={s.btn}>+ Ajouter une offre</summary>
            <form action={addSupplierOfferAction} className={s.form} style={{ marginTop: 12 }}>
              <Hidden id={c.id} />
              <Field label="Fournisseur"><input name="supplier_name" required /></Field>
              <Field label="Référence"><input name="supplier_product_reference" /></Field>
              <Field label="Coût (MAD)"><input name="supplier_cost_mad" type="number" min="0" /></Field>
              <Field label="Nature du coût"><select name="cost_basis" defaultValue="CONFIRMED_COST"><option value="CONFIRMED_COST">Coût confirmé</option><option value="SUPPLIER_LISTED_PRICE">Prix affiché</option></select></Field>
              <Field label="Transport (MAD)"><input name="shipping_cost_mad" type="number" min="0" /></Field>
              <Field label="MOQ"><input name="minimum_order_quantity" type="number" min="0" /></Field>
              <Field label="Quantité dispo"><input name="available_quantity" type="number" min="0" /></Field>
              <Field label="Délai (jours)"><input name="lead_time_days" type="number" min="0" /></Field>
              <Field label="Statut"><select name="supplier_status" defaultValue="UNKNOWN"><option value="UNKNOWN">Inconnu</option><option value="AVAILABLE">Disponible</option><option value="LIMITED">Limité</option><option value="OUT_OF_STOCK">Rupture</option></select></Field>
              <Field label="Date"><input name="observed_at" type="date" defaultValue={today()} /></Field>
              <Field label="Pointures dispo (séparées par espaces)" wide><input name="available_sizes" placeholder="38 39 40 41 42" /></Field>
              <Field label="URL" wide><input name="supplier_url" type="url" placeholder="https://" /></Field>
              <button className={`${s.btn} ${s.btnPrimary}`}>Ajouter</button>
            </form>
          </details>
        </div>

        <div className={s.panel}>
          <h2 className={s.h2}>Marge</h2>
          <dl className={s.kv}>
            <dt>Prix de vente</dt><dd>{m.sellingPriceMAD != null ? `${m.sellingPriceMAD} MAD` : "non fixé"}</dd>
            <dt>Coût rendu</dt><dd>{m.landedCostMAD != null ? `${m.landedCostMAD} MAD` : "inconnu"}</dd>
            <dt>Marge brute</dt><dd>{m.grossMarginMAD != null ? `${m.grossMarginMAD} MAD (${m.grossMarginPct} %)` : "inconnue"}</dd>
          </dl>
          <ul className={s.lines}>{m.lines.map((l, i) => <li key={i}>{l}</li>)}</ul>
          <p className={`${s.muted} ${s.small}`}>Cible {SCORING.margin.targetGrossMarginPct} % · alerte sous {SCORING.margin.alertBelowPct} %.</p>
        </div>
      </section>

      <section className={s.panel}>
        <h2 className={s.h2}>Fiche &amp; notes</h2>
        <form action={saveIdentity} className={s.form}>
          <Hidden id={c.id} />
          <Field label="Coloris"><input name="colorway" defaultValue={c.colorway ?? ""} /></Field>
          <Field label="SKU"><input name="sku" defaultValue={c.sku ?? ""} /></Field>
          <Field label="Genre"><select name="gender" defaultValue={c.gender ?? ""}><option value="">Inconnu</option><option value="women">Femme</option><option value="men">Homme</option><option value="unisex">Unisexe</option></select></Field>
          <Field label="Catégorie"><input name="category" defaultValue={c.category ?? ""} /></Field>
          <Field label="Famille de style"><input name="style_family" defaultValue={c.style_family ?? ""} /></Field>
          <Field label="Prix officiel"><input name="official_price" type="number" step="any" defaultValue={c.official_price ?? ""} /></Field>
          <Field label="Devise"><input name="official_currency" defaultValue={c.official_currency ?? ""} placeholder="EUR" /></Field>
          <Field label="Prix de vente BEYOND (MAD)"><input name="selling_price_mad" type="number" min="0" defaultValue={c.selling_price_mad ?? ""} /></Field>
          <Field label="Handle boutique"><input name="catalogue_handle" defaultValue={c.catalogue_handle ?? ""} /></Field>
          <Field label="URL officielle" wide><input name="official_url" type="url" defaultValue={c.official_url ?? ""} /></Field>
          <Field label="Notes" wide><textarea name="notes" defaultValue={c.notes ?? ""} /></Field>
          <button className={`${s.btn} ${s.btnPrimary}`}>Enregistrer</button>
        </form>
      </section>

      <section className={s.grid2}>
        <div className={s.panel} id="catalogue">
          <h2 className={s.h2}>Fiche catalogue</h2>
          {!draft ? (
            <p className={s.muted}>Aucune fiche. {c.status === "APPROVED" ? "" : "Approuver d'abord."}</p>
          ) : (
            <>
              <p><span className={s.badge}>{draft.status}</span> · publishable = <b>{String(draft.publishable)}</b> · <code>{draft.handle}</code></p>
              {draft.issues.length > 0 ? <ul className={s.lines}>{draft.issues.map((i) => <li key={i} className={s.down}>{i}</li>)}</ul> : <p className={s.small}>Fiche complète.</p>}
              <details><summary className={s.small}>Données produit (format boutique)</summary><pre className={s.pre}>{JSON.stringify(draft.product, null, 1)}</pre></details>
            </>
          )}
          {c.status === "APPROVED" && (
            <form action={prepareAction} className={s.actions} style={{ marginTop: 12 }}>
              <Hidden id={c.id} />
              {draft && <button className={s.btn} formAction={prepareAction}>Re-préparer</button>}
              {!draft && <button className={s.btn}>Préparer la fiche</button>}
              {draft && draft.status === "DRAFT" && <button className={`${s.btn} ${s.btnPrimary}`} formAction={decideAction.bind(null, "MARK_READY")} disabled={draft.issues.length > 0}>Marquer prête à publier</button>}
            </form>
          )}
          <p className={`${s.muted} ${s.small}`}>Publication : <code>npm run radar:import -- --write</code> ajoute les fiches prêtes au catalogue, puis rebuild + déploiement. Rien n&apos;est publié automatiquement.</p>
        </div>

        <div className={s.panel}>
          <h2 className={s.h2}>Brief marketing (interne)</h2>
          {!brief ? <p className={s.muted}>Généré à l&apos;approbation.</p> : (
            <dl className={s.kv}>
              {Object.entries(brief.brief).map(([k, v]) => (
                <div key={k} style={{ display: "contents" }}><dt>{k.replace(/_/g, " ")}</dt><dd>{Array.isArray(v) ? <ul className={s.lines}>{v.map((l, i) => <li key={i}>{l}</li>)}</ul> : v}</dd></div>
              ))}
            </dl>
          )}
        </div>
      </section>

      <section className={s.panel} id="performance">
        <h2 className={s.h2}>Performance BEYOND (données first-party)</h2>
        {!c.catalogue_handle ? <p className={s.muted}>Pas en ligne : aucune donnée.</p> : (
          <>
            <div className={s.tableScroll}><table className={s.table}>
              <thead><tr><th>Fenêtre</th><th className={s.num}>Vues</th><th className={s.num}>Paniers</th><th className={s.num}>Checkouts</th><th className={s.num}>Commandes</th><th className={s.num}>Paires</th><th className={s.num}>CA (MAD)</th><th className={s.num}>Vue→panier</th><th className={s.num}>Conversion</th><th className={s.num}>Panier moyen</th></tr></thead>
              <tbody>
                {[["30 jours", k30], ["Total", kAll]].map(([label, k]) => {
                  const kk = k as typeof kAll;
                  return <tr key={label as string}><td>{label as string}</td><td className={s.num}>{kk.hasTraffic ? kk.views : "non suivi"}</td><td className={s.num}>{kk.hasTraffic ? kk.addToCart : ","}</td><td className={s.num}>{kk.hasTraffic ? kk.checkoutStarted : ","}</td><td className={s.num}>{kk.purchases}</td><td className={s.num}>{kk.UNITS_SOLD}</td><td className={s.num}>{kk.REVENUE}</td><td className={s.num}>{fmt(kk.VIEW_TO_CART, " %")}</td><td className={s.num}>{fmt(kk.PRODUCT_CONVERSION_RATE, " %")}</td><td className={s.num}>{fmt(kk.AOV)}</td></tr>;
                })}
              </tbody>
            </table></div>
            <p className={`${s.muted} ${s.small}`}>Trafic (vues) et demande (commandes) sont mesurés séparément. Sans suivi d&apos;événements sur le site, les taux de conversion restent inconnus.</p>
            <h2 className={s.h2} style={{ marginTop: 16 }}>Pointures vendues</h2>
            {dist.length === 0 ? <p className={s.muted}>Aucune vente enregistrée, pas de répartition inventée.</p> : (
              <table className={s.table}><tbody>
                {dist.map((d) => <tr key={d.size}><td style={{ width: 48 }}>{d.size}</td><td><div className={s.barTrack}><div className={s.bar} style={{ width: `${d.pct}%` }} /></div></td><td className={s.num} style={{ width: 90 }}>{d.pct} % ({d.units})</td></tr>)}
              </tbody></table>
            )}
            <p className={s.small}>{mix.ready ? `Mix recommandé pour 24 paires : ${mix.plan.map((p) => `${p.size}×${p.pairs}`).join(" · ")}` : `Mix recommandé : disponible à partir de ${mix.minUnits} paires vendues (${mix.total} actuellement).`}</p>
            <details style={{ marginTop: 12 }}>
              <summary className={s.btn}>+ Enregistrer une commande confirmée</summary>
              <form action={recordOrderAction} className={s.form} style={{ marginTop: 12 }}>
                <Hidden id={c.id} /><input type="hidden" name="handle" value={c.catalogue_handle} />
                <Field label="Pointure"><input name="size" required /></Field>
                <Field label="Quantité"><input name="quantity" type="number" min="1" defaultValue={1} /></Field>
                <Field label="Prix unitaire (MAD)"><input name="unit_price_mad" type="number" min="0" /></Field>
                <Field label="Référence (n° commande)"><input name="reference" /></Field>
                <Field label="Date"><input name="observed_at" type="date" defaultValue={today()} /></Field>
                <button className={`${s.btn} ${s.btnPrimary}`}>Enregistrer</button>
              </form>
            </details>
          </>
        )}
      </section>

      {alerts.length > 0 && (
        <section className={s.panel}>
          <h2 className={s.h2}>Alertes</h2>
          {alerts.map((a) => (
            <div key={a.id} className={s.alert}>
              <span><span className={s.badge}>{a.kind}</span> {a.message} <span className={`${s.muted} ${s.small}`}>· {date(a.created_at)}{a.acknowledged_at ? " · vue" : ""}</span></span>
              {!a.acknowledged_at && <form action={ackAlertAction}><input type="hidden" name="alert" value={a.id} /><input type="hidden" name="from" value={`/admin/radar/${c.id}`} /><button className={s.btn}>OK</button></form>}
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
