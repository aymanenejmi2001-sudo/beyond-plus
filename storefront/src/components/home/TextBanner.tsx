import Image from "next/image";
import { ASSETS } from "@/data/assets";
import { EditorialLink } from "@/components/ui/EditorialLink";
import styles from "./TextBanner.module.css";

export function TextBanner() {
  return (
    <section className={styles.section}>
      <div className={`${styles.wrapper} container`}>
        <div className={styles.content}>
          <h2 className="display-2" data-reveal="up">
            <span>
              Votre style n’a pas de ligne d’arrivée.
            </span>
          </h2>
          <EditorialLink href="/collections/nouveautes">Explorer les sneakers</EditorialLink>
        </div>
        <div className={styles.image} data-reveal="frame" style={{ ["--reveal-delay" as string]: "150ms" }}>
          <Image
            src={ASSETS.textBanner.src}
            alt=""
            width={ASSETS.textBanner.width}
            height={ASSETS.textBanner.height}
            sizes="182px"
          />
        </div>
      </div>
    </section>
  );
}
