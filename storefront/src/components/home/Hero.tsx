"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { EditorialLink } from "@/components/ui/EditorialLink";
import { PHOTOS } from "@/data/assets";
import { HOME_MERCHANDISING } from "@/data/merchandising";
import styles from "./Hero.module.css";

const SLIDES = HOME_MERCHANDISING.heroSlides.map((s) => ({
  ...s,
  photo: PHOTOS[s.photo],
  title: <>{s.title[0]}<br />{s.title[1]}</>,
}));
const DELAY = 6000;

export function Hero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const touch = useRef<number | null>(null);
  const go = useCallback((n: number) => setIndex((n + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const t = setTimeout(() => go(index + 1), DELAY);
    return () => clearTimeout(t);
  }, [index, paused, reducedMotion, go]);

  return (
    <section
      className={styles.hero}
      data-tone={SLIDES[index].tone}
      aria-roledescription="carrousel"
      onMouseEnter={() => setPaused(true)}
      onFocusCapture={() => setPaused(true)}
      onTouchStart={(e) => { setPaused(true); touch.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touch.current === null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
        touch.current = null;
      }}
    >
      {SLIDES.map((s, i) => (
        <div key={s.href} className={styles.slide} data-active={i === index} data-tone={s.tone} style={{ background: s.bg }} aria-hidden={i !== index}>
          <Image
            src={s.photo.src}
            alt={s.photo.alt}
            fill
            priority={i === 0}
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "low"}
            sizes="(min-width: 990px) 54vw, 100vw"
            quality={82}
            className={styles.image}
            style={{ objectPosition: s.focus }}
          />
          <div className={styles.content}>
            {/* One H1 for the page: the first slide carries the main query. */}
            {i === 0 ? (
              <h1>
                <span className={styles.eyebrow} style={{ display: "block", marginBottom: "1.6rem" }}>{s.eyebrow}</span>
                <span className={styles.title} style={{ display: "block" }}>{s.title}</span>
              </h1>
            ) : (
              <>
                <p className={styles.eyebrow}>{s.eyebrow}</p>
                <p className={styles.title}>{s.title}</p>
              </>
            )}
            <p className={styles.text}>{s.text}</p>
            <EditorialLink href={s.href} onImage tabIndex={i === index ? 0 : -1}>{s.cta}</EditorialLink>
          </div>
        </div>
      ))}

      <div className={styles.nav}>
        {SLIDES.map((s, i) => (
          <button
            key={s.href}
            type="button"
            className={styles.dot}
            data-active={i === index}
            data-paused={paused}
            onClick={() => go(i)}
            aria-label={i === 0 ? "Beyond Women" : s.eyebrow}
            aria-current={i === index}
          >
            <span className={styles.label}>{i === 0 ? "Beyond Women" : s.eyebrow}</span>
            <span className={styles.bar}><span key={index} className={styles.fill} /></span>
          </button>
        ))}
      </div>
    </section>
  );
}
