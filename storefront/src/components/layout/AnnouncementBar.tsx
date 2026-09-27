import styles from "./AnnouncementBar.module.css";

const MESSAGES = [
  "BEYOND PLUS",
  "LIVRAISON GRATUITE",
  "12 À 48 H APRÈS CONFIRMATION",
];

/** Duplicated once so the -50% keyframe loops seamlessly. */
export function AnnouncementBar() {
  const line = (
    <div className={styles.line} aria-hidden={undefined}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div className={styles.block} key={i}>
          {MESSAGES.map((m, j) => (
            <span key={j}>
              {m}
              {j < MESSAGES.length - 1 && <span className={styles.sep}>, </span>}
            </span>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.bar} role="region" aria-label="Annonces">
      <div className={styles.track} style={{ ["--ticker-duration" as string]: "100s" }}>
        {line}
        <div aria-hidden="true" style={{ display: "contents" }}>
          {line}
        </div>
      </div>
    </div>
  );
}
