import Link from "next/link";
import styles from "./PageHeader.module.css";

interface Props {
  title: string;
  description?: string;
}

/** Shared breadcrumb + title band for every standalone content page. */
export function PageHeader({ title, description }: Props) {
  return (
    <header className={styles.header}>
      <nav className={styles.breadcrumb} aria-label="Fil d'ariane">
        <Link href="/">Accueil</Link>
        <span className={styles.sep}>/</span>
        <span aria-current="page">{title}</span>
      </nav>
      <h1 className={styles.title}>{title}</h1>
      {description && <p className={styles.description}>{description}</p>}
    </header>
  );
}
