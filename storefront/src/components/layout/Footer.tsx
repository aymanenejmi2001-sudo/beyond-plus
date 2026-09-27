import { MeasurementConsent } from "./MeasurementConsent";
import Link from "next/link";
import { FOOTER_MENUS } from "@/data/navigation";
import { PlusIcon } from "@/components/ui/icons";
import { FooterNewsletter } from "./FooterNewsletter";
import styles from "./Footer.module.css";
import { STORE } from "@/data/store";

const PAYMENTS: string[] = [];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.main} container`}>
        <div className={styles.grid}>
          <div>
            <h3 className={styles.blockTitle}>Go beyond.</h3>
            <FooterNewsletter />
          </div>

          <div className={styles.menus}>
            {FOOTER_MENUS.map((menu) => (
              <nav className={styles.menu} key={menu.title} aria-label={menu.title}>
                <details open>
                  <summary>
                    <h3 className={styles.blockTitle}>{menu.title}</h3>
                    <PlusIcon size={12} />
                  </summary>
                  <ul className={styles.menuList}>
                    {menu.items.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} className={styles.menuLink}>
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              </nav>
            ))}
          </div>

          <div className={styles.contact}>
            <h3 className={styles.blockTitle}>Contact</h3>
            <p className={styles.address}>
              Sneakers. Style. Attitude.
            </p>
            <Link href="/contact" className={styles.contactLink}>
              Nous écrire
            </Link>
            <a href={STORE.instagram} className={styles.contactLink} target="_blank" rel="me noopener">
              Instagram @beyond_plus.ma
            </a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={`${styles.bottomInner} container`}>
          <span>
            © {new Date().getFullYear()} BEYOND PLUS. Répliques qualité Master Copy, sans affiliation avec les marques citées.{" "}
            <Link href="/qualite-transparence" style={{ textDecoration: "underline", textUnderlineOffset: "0.3rem" }}>Qualité &amp; transparence</Link>
          </span>
          <nav aria-label="Informations pratiques" style={{display:"flex",flexWrap:"wrap",gap:"1.6rem"}}>
            <Link href="/policies/refund">Livraison et retours</Link>
            <Link href="/policies/terms">Conditions de vente</Link>
            <Link href="/policies/privacy">Confidentialité</Link>
          </nav>
          <div className={styles.payments}>
            <span>DH / FR</span>
            {PAYMENTS.map((p) => (
              <span className={styles.payment} key={p}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
      <MeasurementConsent />
    </footer>
  );
}
