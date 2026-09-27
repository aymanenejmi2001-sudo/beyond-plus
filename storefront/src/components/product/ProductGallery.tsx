"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ShopifyImage } from "@/lib/shopify/types";
import { useBodyLock } from "@/lib/hooks/useBodyLock";
import { CloseIcon } from "@/components/ui/icons";
import styles from "./ProductGallery.module.css";

interface Props {
  images: ShopifyImage[];
  title: string;
}

export function ProductGallery({ images, title }: Props) {
  const [zoomed, setZoomed] = useState<number | null>(null);
  const [current, setCurrent] = useState(0);
  const rail = useRef<HTMLDivElement>(null);

  useBodyLock(zoomed !== null);

  useEffect(() => {
    if (zoomed === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoomed(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [zoomed]);

  // Mobile carousel position, derived from scroll so it always tells the truth.
  const onScroll = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    setCurrent(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
  }, []);

  return (
    <div>
      <div className={styles.gallery} ref={rail} onScroll={onScroll}>
        {images.map((image, i) => (
          <figure
            className={styles.item}
            key={image.url + i}
            onClick={() => setZoomed(i)}
            role="button"
            tabIndex={-1}
            aria-label={`Agrandir le visuel ${i + 1}`}
          >
            <Image
              src={image.url}
              alt={image.altText ?? `${title}, visuel ${i + 1}`}
              width={image.width}
              height={image.height}
              // The pinned plate and its neighbour are half the gallery; the
              // rest render at the same width, so one hint covers them all.
              sizes="(min-width: 990px) 28vw, 100vw"
              priority={i === 0}
              loading={i === 0 ? "eager" : "lazy"}
              quality={82}
            />
          </figure>
        ))}
      </div>

      <div className={styles.counter} aria-hidden="true">
        {images.map((image, i) => (
          <span className={styles.dot} key={image.url + i} data-active={i === current} />
        ))}
      </div>

      <div
        className={styles.lightbox}
        data-open={zoomed !== null}
        onClick={() => setZoomed(null)}
        role="dialog"
        aria-modal="true"
        aria-label={`${title}, visuel agrandi`}
      >
        <button type="button" className={styles.lightboxClose} aria-label="Fermer">
          <CloseIcon size={20} />
        </button>
        {zoomed !== null && (
          <Image
            className={styles.lightboxImage}
            src={images[zoomed].url}
            alt={images[zoomed].altText ?? title}
            width={images[zoomed].width}
            height={images[zoomed].height}
            sizes="88vw"
            quality={88}
          />
        )}
      </div>
    </div>
  );
}
