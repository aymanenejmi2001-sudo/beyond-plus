import Link from "next/link";
import { CURATED } from "@/data/collections";
import styles from "./CollectionNav.module.css";

/** Discovery layer under the collection title — curated edits, one line, scrolls on mobile. */
export function CollectionNav({ current }: { current: string }) {
  return (
    <nav className={styles.nav} aria-label="Sélections">
      {CURATED.map((c) => (
        <Link key={c.handle} href={`/collections/${c.handle}`} className={styles.link} aria-current={c.handle === current ? "page" : undefined}>
          {c.title}
        </Link>
      ))}
    </nav>
  );
}
