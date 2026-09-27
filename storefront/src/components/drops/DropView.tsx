"use client";

import Image from "next/image";
import type { DropStatus } from "@/data/drops";
import type { Product, ShopifyImage } from "@/lib/shopify/types";
import { ProductCard } from "@/components/product/ProductCard";
import { useDropClock } from "./useDropClock";
import { Countdown } from "./Countdown";
import styles from "./Drop.module.css";
import { COMMERCE } from "@/data/commerce";

interface Props {
  eyebrow: string; title: string; subtitle: string; note: string; launchAt: string; dateLabel: string;
  fixedStatus: DropStatus | null; image: ShopifyImage | null; products: Product[]; serverNow: number;
}

export function DropView({ eyebrow, title, subtitle, note, launchAt, dateLabel, fixedStatus, image, products, serverNow }: Props) {
  const now = useDropClock(serverNow);
  const status = fixedStatus ?? (now >= Date.parse(launchAt) ? "live" : "upcoming");
  const live = status === "live";
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          {image && <Image src={image.url} alt={image.altText ?? title} fill priority sizes="(min-width: 990px) 55vw, 100vw" className={styles.heroImage} />}
        </div>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{eyebrow} · {live ? "LIVE" : status === "archived" ? "ARCHIVE" : "COMING SOON"}</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
          <dl className={styles.meta}>
            <div><dt>Lancement</dt><dd>{dateLabel}</dd></div>
            <div><dt>Paires</dt><dd>{products.length}</dd></div>
          </dl>
          {status === "upcoming" && <Countdown launchAt={launchAt} now={now} className={styles.countdown} />}
          <a href="#drop-products" className={styles.cta}>{live ? "SHOP THE DROP" : "VOIR LES PAIRES"}</a>
        </div>
      </section>

      <section id="drop-products" className={styles.products} aria-label={live ? "Shop the drop" : "Aperçu des paires"}>
        <p className={styles.productsHead}>{live ? "SHOP THE DROP" : "COMING SOON · APERÇU"}</p>
        <div className="beyond-product-selection">
          {products.map((p) => <ProductCard key={p.id} product={p} layout="editorial" sizes="(min-width: 750px) 25vw, 50vw" />)}
        </div>
      </section>

      <section className={styles.note}>
        <p>{note}</p>
        <p className={styles.small}>{COMMERCE.nature}. Paires déjà présentes dans la sélection BEYOND PLUS. {COMMERCE.shipping}</p>
      </section>
    </>
  );
}
