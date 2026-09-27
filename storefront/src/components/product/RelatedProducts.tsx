import Link from "next/link";
import type { Product } from "@/lib/shopify/types";
import { ProductCard } from "./ProductCard";
import styles from "./RelatedProducts.module.css";

interface Props {
  products: Product[];
  href: string;
}

export function RelatedProducts({ products, href }: Props) {
  if (products.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 className={styles.title}>Vous aimerez aussi</h2>
          <Link href={href} className={styles.link}>
            Tout voir
          </Link>
        </div>
        <div className={styles.grid}>
          {products.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              layout="editorial"
              sizes="(min-width: 750px) 25vw, 50vw"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
