import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ASSETS } from "@/data/assets";
import { EditorialLink } from "@/components/ui/EditorialLink";
import styles from "./SpotlightCards.module.css";

// Multi-brand boutique — a single femme catalogue, no menswear collection to
// point the second door at, so the two spotlight slots open onto the
// storefront's two natural entry points instead.
const ITEMS = [
  { title: "Beyond Women", href: "/collections/femme", image: ASSETS.spotlight.women },
  { title: "Beyond Men", href: "/collections/homme", image: ASSETS.spotlight.men },
];

// Columns sized in proportion to each photo's own ratio, so both photos share
// one height and together span the full width with no crop and no gap.
const COLUMNS = ITEMS.map(
  (item) => `minmax(0, ${item.image.width / item.image.height}fr)`,
).join(" ");

export function SpotlightCards() {
  return (
    <section
      className={styles.grid}
      aria-label="Univers"
      style={{ "--spotlight-columns": COLUMNS } as CSSProperties}
    >
      {ITEMS.map((item) => (
        <article
          className={styles.item}
          key={item.href}
          data-reveal="fade"
          style={{ aspectRatio: `${item.image.width} / ${item.image.height}` }}
        >
          <Image
            className={styles.image}
            src={item.image.src}
            alt=""
            width={item.image.width}
            height={item.image.height}
            sizes="(min-width: 750px) 50vw, 100vw"
            quality={78}
          />
          <div className={styles.info}>
            <h2 className="display-2">{item.title}</h2>
            <span className={styles.cta}>
              <EditorialLink href={item.href} onImage tabIndex={-1}>
                Explorer
              </EditorialLink>
            </span>
          </div>
          <Link href={item.href} className={styles.link} aria-label={`${item.title}, voir la collection`} />
        </article>
      ))}
    </section>
  );
}
