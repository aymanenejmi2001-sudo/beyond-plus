import Link from "next/link";
import styles from "./CollectionHeader.module.css";

interface Props {
  title: string;
  description?: string;
  parent?: { title: string; href: string };
  /** Full ancestor chain (takes precedence over parent). */
  trail?: { title: string; href: string }[];
  /** Brand line shown above the H1 (e.g. Beyond Women). */
  eyebrow?: string;
}

export function CollectionHeader({ title, description, parent, trail, eyebrow }: Props) {
  const crumbs = trail ?? (parent ? [parent] : []);
  return (
    <header className={styles.header}>
      <nav className={styles.breadcrumb} aria-label="Fil d'ariane">
        <Link href="/">Accueil</Link>
        <span className={styles.sep}>/</span>
        {crumbs.map((c) => (
          <span key={c.href}>
            <Link href={c.href}>{c.title}</Link>
            <span className={styles.sep}>/</span>
          </span>
        ))}
        <span aria-current="page">{title}</span>
      </nav>

      <div className={styles.row}>
        <div>
          {eyebrow && <p className={styles.breadcrumb} style={{ marginBottom: "1.2rem" }}>{eyebrow}</p>}
          <h1 className={styles.title}>{title}</h1>
        </div>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </header>
  );
}
