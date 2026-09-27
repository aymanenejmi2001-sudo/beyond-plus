import Image from "next/image";
import { reviewsFor } from "@/data/reviews";
import styles from "./Reviews.module.css";

// Hidden until real reviews exist: no empty stars, no placeholder.
export function Reviews({ handle }: { handle: string }) {
  const { list, average } = reviewsFor(handle);
  if (!list.length || average === null) return null;
  const photos = list.filter((r) => r.photo);
  return (
    <section className={styles.section} aria-labelledby="reviews-title">
      <div className={styles.head}>
        <h2 id="reviews-title" className={styles.title}>Portées par nos clients</h2>
        <p className={styles.score}>{average.toFixed(1)} / 5 · {list.length} avis</p>
      </div>
      {photos.length > 0 && (
        <div className={styles.photos}>
          {photos.slice(0, 6).map((r) => (
            <figure key={r.photo} className={styles.photo}>
              <Image src={r.photo!} alt={`${r.model} porté par ${r.firstName}`} width={600} height={750} sizes="(min-width: 750px) 20vw, 45vw" />
              <figcaption>{r.firstName} · pointure {r.size}</figcaption>
            </figure>
          ))}
        </div>
      )}
      <ul className={styles.list}>
        {list.map((r) => (
          <li key={`${r.firstName}-${r.date}`} className={styles.item}>
            <p className={styles.stars} aria-label={`${r.rating} sur 5`}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
            <p className={styles.text}>{r.text}</p>
            <p className={styles.meta}>{r.firstName} · {r.model}, pointure {r.size} · {new Date(r.date).toLocaleDateString("fr-MA", { month: "long", year: "numeric" })}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
