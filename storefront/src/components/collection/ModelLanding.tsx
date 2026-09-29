import Link from "next/link";
import { COMMERCE } from "@/data/commerce";
import type { ModelContent } from "@/data/model-content";
import type { Colorway } from "@/data/collections";

interface Props { name: string; content: ModelContent; sizes: number[]; count: number; colorways?: Colorway[]; guides?: { label: string; href: string }[] }

/** SEO landing block under a model grid — sells, answers, links. */
export function ModelLanding({ name, content, sizes, count, colorways = [], guides = [] }: Props) {
  const faq = content.faq.map(f => /taille|pointure|chauss/i.test(f.q) ? { ...f, a: COMMERCE.fit } : f);
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <section className="beyond-collection-seo beyond-model" aria-labelledby="model-about">
      <h2 id="model-about">{name} au Maroc</h2>
      {content.intro.map((p) => <p key={p}>{p}</p>)}

      {colorways.length > 0 && (
        <>
          <h3 id="coloris" style={{ scrollMarginTop: "6rem" }}>Coloris disponibles</h3>
          <table className="beyond-colorways">
            <thead><tr><th scope="col">Coloris</th><th scope="col">Prix</th><th scope="col">Pointures</th></tr></thead>
            <tbody>
              {colorways.map((c) => (
                <tr key={c.href}><td><Link href={c.href}>{c.name}</Link></td><td>{c.price} DH</td><td>{c.sizes}</td></tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h3>Pointures disponibles</h3>
      <p>
        {count} coloris en ligne. Pointures disponibles : {sizes.length ? sizes.join(", ") : "sur demande"}.
        La disponibilité de votre pointure est confirmée par téléphone avant l’envoi.
      </p>

      <h3>Comment ça taille</h3>
      <p>{COMMERCE.fit}</p>

      <h3>Comment la porter</h3>
      <p>{content.wear}</p>

      <h3>Livraison au Maroc</h3>
      <p>
        Commande en ligne confirmée par téléphone, livraison partout au Maroc : Casablanca, Rabat, Marrakech, Tanger, Fès, Agadir et ailleurs.
        Livraison gratuite sous 12 à 48 heures après confirmation. Échange de pointure sous 3 jours après la livraison. Répliques qualité Master Copy Premium 1:1.
      </p>

      <h3>Questions fréquentes</h3>
      <dl className="beyond-faq">
        {faq.map((f) => (
          <div key={f.q}><dt>{f.q}</dt><dd>{f.a}</dd></div>
        ))}
      </dl>

      <p className="beyond-collection-seo-links">
        {[...content.related, ...guides.filter((g) => !content.related.some((r) => r.href === g.href))].map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}
      </p>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
    </section>
  );
}
