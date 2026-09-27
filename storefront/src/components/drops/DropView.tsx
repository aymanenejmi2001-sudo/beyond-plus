"use client";

import Image from "next/image";
import type { Product, ShopifyImage } from "@/lib/shopify/types";
import { ProductCard } from "@/components/product/ProductCard";
import { COMMERCE } from "@/data/commerce";
import { useDropClock } from "./useDropClock";
import { Countdown } from "./Countdown";
import { statusAt, STATUS_LABEL, type LaunchInfo } from "./types";
import styles from "./Drop.module.css";

interface Props {
  eyebrow: string; title: string; subtitle: string; note: string; image: ShopifyImage | null;
  products: Product[]; launch: LaunchInfo | null; serverNow: number;
}

export function DropView({ eyebrow, title, subtitle, note, image, products, launch, serverNow }: Props) {
  const now = useDropClock(serverNow);
  const status = statusAt(launch, now);
  const shop = status === "available" || status === "live";
  const shopLabel = status === "available" ? "SHOP THE EDIT" : "SHOP THE DROP";
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          {image && <Image src={image.url} alt={image.altText ?? title} fill priority sizes="(min-width: 750px) 55vw, 100vw" className={styles.heroImage} />}
        </div>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{eyebrow} · {STATUS_LABEL[status]}</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
          <dl className={styles.meta}>
            {launch && <div><dt>Lancement</dt><dd>{launch.dateLabel}</dd></div>}
            <div><dt>Paires</dt><dd>{products.length}</dd></div>
          </dl>
          {launch && status === "upcoming" && <Countdown launchAt={launch.launchAt} now={now} className={styles.countdown} />}
          <a href="#drop-products" className={styles.cta}>{shop ? shopLabel : "VOIR LES PAIRES"}</a>
        </div>
      </section>

      <section id="drop-products" className={styles.products} aria-label={shop ? shopLabel : "Aperçu des paires"}>
        <p className={styles.productsHead}>{shop ? shopLabel : "COMING SOON · APERÇU"}</p>
        <div className="beyond-product-selection">
          {products.map((p) => <ProductCard key={p.id} product={p} layout="editorial" sizes="(min-width: 750px) 25vw, 50vw" />)}
        </div>
      </section>

      <section className={styles.note}>
        <p>{note}</p>
        <p className={styles.small}>{COMMERCE.nature}. {COMMERCE.shipping}</p>
      </section>
    </>
  );
}
