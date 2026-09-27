/* eslint-disable @next/next/no-img-element -- Admin/local preview images and small brand marks use explicit dimensions or CSS bounds. */
import { CATALOG } from "@/data/catalog";
import { getStore } from "../../../../radar/lib/store.ts";
import s from "../admin.module.css";
import { MIN_PHOTOS } from "../../../../radar/config/scoring.ts";
import { addLivePhotosAction, removeLivePhotoAction } from "./actions";

type Img = { url: string; altText: string | null; width: number; height: number };

/** Products already on the site with fewer than MIN_PHOTOS photos. */
export async function photoGaps() {
  const own = new Map<string, Img[]>();
  for (const ph of await getStore().list("site_photos", { order: { col: "created_at", asc: true } })) {
    own.set(ph.handle, [...(own.get(ph.handle) ?? []), { url: ph.url, altText: ph.alt_text, width: ph.width, height: ph.height }]);
  }
  return CATALOG
    .map((p) => {
      const mine = own.get(p.handle) ?? [];
      const base = p.images.filter((i) => !mine.some((m) => m.url === i.url));
      return { handle: p.handle, title: p.title, vendor: p.vendor, images: base, own: mine, total: base.length + mine.length };
    })
    .filter((p) => p.total < MIN_PHOTOS || p.own.length > 0)
    .sort((a, b) => a.total - b.total);
}

export async function PhotosTab({ here }: { here: string }) {
  const rows = await photoGaps();
  const missing = rows.filter((r) => r.total < MIN_PHOTOS);
  return (
    <>
      <p className={s.sectionSub}>
        {missing.length ? `${missing.length} paire${missing.length > 1 ? "s" : ""} en ligne ont moins de ${MIN_PHOTOS} photos.` : `Toutes les paires en ligne ont au moins ${MIN_PHOTOS} photos.`}{" "}
        Le fournisseur n&apos;en a pas d&apos;autres : ajoute tes propres photos (portées, détails, semelle, de dos). Pas de photos de marques ni de concurrents.
      </p>
      <div className={s.cards}>
        {rows.map((p) => (
          <article key={p.handle} className={s.card}>
            <div className={s.plate}>
              {p.images[0] && <img src={p.images[0].url} alt="" loading="lazy" />}
              <span className={s.tag} data-tone={p.total >= MIN_PHOTOS ? "TEST" : "LAUNCH"}>{p.total}/{MIN_PHOTOS} photos</span>
            </div>
            <div className={s.cardBody}>
              <span className={s.cardBrand}>{p.vendor}</span>
              <span className={s.cardTitle}>{p.title}</span>
              <div className={s.thumbs}>
                {p.images.map((i) => <img key={i.url} src={i.url} alt="" title="Photo fournisseur" />)}
                {p.own.map((i) => (
                  <form key={i.url} action={removeLivePhotoAction} className={s.ownThumb}>
                    <img src={i.url} alt="" title="Ta photo" />
                    <input type="hidden" name="handle" value={p.handle} /><input type="hidden" name="url" value={i.url} />
                    <button aria-label="Retirer cette photo" title="Retirer">×</button>
                  </form>
                ))}
              </div>
              <details className={s.complete} open={false}>
                <summary>{p.total >= MIN_PHOTOS ? "+ Ajouter d'autres photos" : `+ Ajouter ${MIN_PHOTOS - p.total} photo${MIN_PHOTOS - p.total > 1 ? "s" : ""} ou plus`}</summary>
                <form action={addLivePhotosAction} className={s.completeForm}>
                  <input type="hidden" name="handle" value={p.handle} /><input type="hidden" name="from" value={here} />
                  <label className={s.field}>Tes photos (JPG, PNG, WebP — 700 px minimum)<input name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple required /></label>
                  <button className={`${s.btn} ${s.btnPrimary}`}>Ajouter</button>
                </form>
              </details>
              <a className={s.cardLinks} href={`/products/${p.handle}`} target="_blank" rel="noreferrer">Voir la fiche ↗</a>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
