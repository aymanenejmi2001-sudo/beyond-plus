"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/shopify/types";
import { formatMoney, isOnSale } from "@/lib/shopify/money";
import {
  findVariant,
  isOptionValueAvailable,
  type OptionSelection,
} from "@/lib/shopify/variants";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/Button";
import { CartIcon } from "@/components/ui/icons";
import { swatchColor } from "@/lib/swatches";
import { WishlistButton } from "./WishlistButton";
import { track } from "@/lib/commerce/track";
import styles from "./ProductCard.module.css";

interface Props {
  product: Product;
  layout?: "overlay" | "editorial";
  /** first row of a grid → eager + high priority for a clean LCP */
  priority?: boolean;
  sizes?: string;
}

export function ProductCard({
  product,
  layout = "overlay",
  priority = false,
  sizes = "(min-width: 1100px) 25vw, (min-width: 576px) 33vw, 50vw",
}: Props) {
  const { addLine } = useCart();
  const [selection, setSelection] = useState<OptionSelection>({});
  const [picking, setPicking] = useState(false);

  const sizeOption = product.options.find((o) => o.name === "Size");
  const colorOption = product.options.find((o) => o.name === "Color");
  const variant = useMemo(() => findVariant(product, selection), [product, selection]);

  const price = variant?.price ?? product.priceRange.minVariantPrice;
  const compareAt = variant?.compareAtPrice ?? product.compareAtPriceRange?.minVariantPrice ?? null;
  const onSale = isOnSale(price, compareAt);
  const soldOut = !product.availableForSale;

  const available = product.variants.filter((v) => v.availableForSale).map((v) => Number(v.title)).filter((n) => !Number.isNaN(n));
  const sizeRange = available.length ? (available.length > 1 ? `${Math.min(...available)} à ${Math.max(...available)}` : `${available[0]}`) : null;

  // The brand already sits above the name — don't repeat it.
  const brand = product.merch?.brand ?? product.vendor;
  const name = product.title.toLowerCase().startsWith(brand.toLowerCase() + " ") ? product.title.slice(brand.length + 1) : product.title;

  const [first, second] = [product.images[0], product.images[1] ?? product.images[0]];
  const href = `/products/${product.handle}`;

  const badges = (
    <div className={styles.badges}>
      {soldOut && <span className={`${styles.badge} ${styles.badgeSoldOut}`}>Épuisé</span>}
      {!soldOut && onSale && <span className={styles.badge}>Promo</span>}
      {!soldOut && !onSale && product.merch?.label && (
        <span className={styles.label} data-pick={product.merch.label === "BEYOND PICK"}>{product.merch.label}</span>
      )}
    </div>
  );

  const media = (
    <div className={styles.media}>
      {first && (
        <Image
          className={`${styles.image} ${styles.imageFirst}`}
          src={first.url}
          alt={first.altText ?? product.title}
          width={first.width}
          height={first.height}
          sizes={sizes}
          priority={priority}
          loading={priority ? "eager" : "lazy"}
        />
      )}
      {second && second !== first && (
        <Image
          className={`${styles.image} ${styles.imageSecond}`}
          src={second.url}
          alt=""
          width={second.width}
          height={second.height}
          sizes={sizes}
          loading="lazy"
          aria-hidden="true"
        />
      )}
    </div>
  );

  const priceBlock = (
    <span className={styles.price}>
      {formatMoney(price)}
      {onSale && compareAt && (
        <span className={styles.priceCompare}>{formatMoney(compareAt)}</span>
      )}
    </span>
  );

  const swatches = colorOption && (
    <div className={styles.swatches}>
      {colorOption.values.slice(0, 4).map((value) => (
        <span
          key={value}
          className={styles.swatch}
          title={value}
          style={{ ["--swatch" as string]: swatchColor(value) }}
        />
      ))}
    </div>
  );

  /* ---------------- Editorial (Almost Gods catalogue) ---------------- */
  if (layout === "editorial") {
    return (
      <article className={`${styles.card} ${styles.editorial}`}>
        <div className={styles.mediaWrap}>
        <Link href={href} className={styles.media} aria-label={product.title} onClick={() => track("select_item", product.handle)}>
          {first && (
            <Image
              className={`${styles.image} ${styles.imageFirst}`}
              src={first.url}
              alt={first.altText ?? product.title}
              width={first.width}
              height={first.height}
              sizes={sizes}
              priority={priority}
              loading={priority ? "eager" : "lazy"}
            />
          )}
          {second && second !== first && (
            <Image
              className={`${styles.image} ${styles.imageSecond}`}
              src={second.url}
              alt=""
              width={second.width}
              height={second.height}
              sizes={sizes}
              loading="lazy"
              aria-hidden="true"
            />
          )}
        </Link>

        {(soldOut || onSale || product.merch?.label) && badges}

        <WishlistButton handle={product.handle} title={product.title} className={styles.wish} />

        {!soldOut && !product.previewOnly && sizeOption && (
          <>
            <button
              type="button"
              className={styles.quickAdd}
              data-open={picking || undefined}
              aria-expanded={picking}
              aria-label={picking ? "Fermer le choix de pointure" : `Ajout rapide : ${product.title}`}
              onClick={() => setPicking((v) => !v)}
            >
              <CartIcon size={15} />
            </button>
            {picking && (
              <div className={styles.quickSizes} role="group" aria-label={`Pointure pour ${product.title}`}>
                <span className={styles.quickLabel}>Pointure</span>
                <div className={styles.quickGrid}>
                  {sizeOption.values.map((value) => {
                    const v = findVariant(product, { ...selection, Size: value });
                    const ok = !!v?.availableForSale;
                    return (
                      <button
                        key={value}
                        type="button"
                        disabled={!ok}
                        aria-label={ok ? `Ajouter en ${value}` : `${value} indisponible`}
                        onClick={() => { if (!v) return; track("select_size", product.handle, { size: value, list: "card" }); addLine(product, v); setPicking(false); }}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
        </div>

        <div className={styles.info}>
          <div className={styles.infoTop}>
            <span className={styles.vendor}>{brand}</span>
            <h3 className={styles.title}>
              <Link href={href}>{name}</Link>
            </h3>
            {priceBlock}
            {sizeRange && <span className={styles.sizeRange}>{sizeRange}</span>}
          </div>
          {sizeOption && (
            <div className={styles.options}>
              <div className={styles.sizes}>
                {sizeOption.values.map((value) => (
                  <span
                    key={value}
                    className={styles.size}
                    data-available={isOptionValueAvailable(product, selection, "Size", value)}
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    );
  }

  /* ---------------- Overlay (Zenith homepage) ---------------- */
  return (
    <article className={`${styles.card} ${styles.overlay}`}>
      <div className={styles.inner}>
        {media}

        <div className={styles.top}>
          {badges}
          <div className={styles.quickview}>
            <Button
              variant="primary"
              onClick={() => variant && addLine(product, variant)}
              disabled={!variant?.availableForSale}
              aria-label={`Ajouter ${product.title} au panier`}
            >
              Ajouter
            </Button>
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.infoTop}>
            <span className={styles.vendor}>{product.vendor}{product.previewOnly ? " / Réplique" : ""}</span>
            <h3 className={styles.title}>
              <Link href={href}>{name}</Link>
            </h3>
            <div className={styles.priceGroup}>
              {priceBlock}
              {swatches}
            </div>
          </div>

          <div className={styles.infoBottom}>
            {sizeOption && (
              <div className={styles.sizes}>
                {sizeOption.values.map((value) => {
                  const available = isOptionValueAvailable(product, selection, "Size", value);
                  return (
                    <button
                      key={value}
                      type="button"
                      className={styles.size}
                      data-selected={selection.Size === value}
                      data-available={available}
                      disabled={!available}
                      onClick={() => setSelection((s) => ({ ...s, Size: value }))}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            )}
            <div className={styles.addWrap}>
              <Button
                variant="primary"
                block
                disabled={!variant?.availableForSale}
                onClick={() => variant && addLine(product, variant)}
              >
                {product.previewOnly ? "Bientôt disponible" : variant?.availableForSale ? "Ajouter au panier" : "Épuisé"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Link href={href} className={styles.linkOverlay} aria-label={product.title} />
    </article>
  );
}
