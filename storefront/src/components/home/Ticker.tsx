import { Marquee } from "@/components/ui/Marquee";
import styles from "./Ticker.module.css";

export function Ticker() {
  const words = Array.from({ length: 4 }).map((_, i) => (
    <span className={styles.word} key={i}>
      Beyond Plus
    </span>
  ));

  return (
    <section className={styles.section}>
      <Marquee duration={38}>{words}</Marquee>
      <p className={`${styles.description} container`}>
        BEYOND PLUS. La culture sneaker, à votre façon.
      </p>
    </section>
  );
}
