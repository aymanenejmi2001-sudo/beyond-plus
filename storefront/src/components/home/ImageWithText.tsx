import Image from "next/image";
import { ASSETS } from "@/data/assets";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EditorialLink } from "@/components/ui/EditorialLink";
import styles from "./ImageWithText.module.css";

export function ImageWithText() {
  return (
    <section>
      <SectionHeader title="L’esprit Beyond" />
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <p className={`eyebrow ${styles.eyebrow}`}>Sneakers. Style. Attitude.</p>
          <h3 className="display-3" data-reveal="up">
            <span>La paire change.<br />L’attitude reste.</span>
          </h3>
          <p className={styles.body}>
            Un blazer, un jean, une silhouette inattendue. Chez BEYOND PLUS, la sneaker ouvre le jeu. À vous de composer la suite.
          </p>
          <EditorialLink href="/about">Inside Beyond Plus</EditorialLink>
        </div>
        <div className={styles.media} data-reveal="frame">
          <Image
            src={ASSETS.imageWithText.src}
            alt="Silhouette sneakers de l’univers BEYOND PLUS"
            width={ASSETS.imageWithText.width}
            height={ASSETS.imageWithText.height}
            sizes="(min-width: 750px) 50vw, 100vw"
            quality={82}
          />
        </div>
      </div>
    </section>
  );
}
