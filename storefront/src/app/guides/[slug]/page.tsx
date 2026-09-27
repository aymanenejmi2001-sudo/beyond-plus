import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GUIDES, GUIDE_BY_SLUG, isIndexableGuide } from "@/data/guides";
import { MODELS } from "@/data/brands";
import Image from "next/image";
import { guideProducts } from "@/data/guide-media";
import { toCard } from "@/lib/shopify";
import { ProductCard } from "@/components/product/ProductCard";

interface Params { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const g = GUIDE_BY_SLUG.get((await params).slug);
  if (!g) return {};
  return {
    title: g.title,
    description: g.description,
    alternates: { canonical: `/guides/${g.slug}` },
    ...(isIndexableGuide(g) ? {} : { robots: { index: false, follow: true } }),
    openGraph: { type: "article", title: g.title, description: g.description, publishedTime: g.published },
  };
}

export default async function GuidePage({ params }: Params) {
  const g = GUIDE_BY_SLUG.get((await params).slug);
  if (!g) notFound();
  const products = guideProducts(g, 4);
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://beyondplusmaroc.com";
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.description,
    datePublished: g.published,
    image: products.map((p) => `${site}${p.featuredImage?.url}`).filter((u) => !u.endsWith("undefined")),
    inLanguage: "fr-MA",
    author: { "@type": "Organization", name: "BEYOND PLUS" },
    publisher: { "@type": "Organization", name: "BEYOND PLUS" },
  };
  return (
    <article className="beyond-page beyond-guide">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <nav className="eyebrow" aria-label="Fil d'ariane"><Link href="/">Accueil</Link> / <Link href="/guides">Guides</Link></nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "BreadcrumbList",
        itemListElement: [["Accueil", "/"], ["Guides", "/guides"], [g.title, `/guides/${g.slug}`]].map(([name, href], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${process.env.NEXT_PUBLIC_SITE_URL || "https://beyondplusmaroc.com"}${href}` })),
      }) }} />
      <h1>{g.title}</h1>
      <p className="beyond-guide-intro">{g.intro}</p>
      {products.length > 0 && (
        <section className="beyond-guide-products" aria-label="Les paires de ce guide">
          <p className="eyebrow">Les paires de ce guide</p>
          <div className="beyond-product-selection">
            {products.map((p, i) => <ProductCard key={p.id} product={toCard(p)} layout="editorial" priority={i < 2} sizes="(min-width: 750px) 25vw, 50vw" />)}
          </div>
        </section>
      )}
      {g.sections.map((s) => (
        <section key={s.heading}>
          <h2>{s.heading}</h2>
          {s.image && /^\/(products|images\/beyond)\/[a-z0-9-]+\.(webp|jpg)$/.test(s.image.src) && (
            <figure className="beyond-guide-figure">
              <Image src={s.image.src} alt={s.image.alt} width={1200} height={1200} sizes="(min-width: 750px) 640px, 100vw" />
            </figure>
          )}
          {s.body.map((b) => <p key={b}>{b}</p>)}
          {s.table && (
            <table>
              <thead><tr>{s.table.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
              <tbody>{s.table.rows.map((r) => <tr key={r[0]}>{r.map((c) => <td key={c}>{c}</td>)}</tr>)}</tbody>
            </table>
          )}
        </section>
      ))}
      {g.slug === "quelle-pointure-choisir-sneakers" && (
        <section>
          <h2>Conseils de pointure par modèle</h2>
          <p className="beyond-collection-seo-links">
            {MODELS.map((m) => <Link key={m.handle} href={`/collections/${m.handle}`}>{m.brand === "Jordan" || m.name.includes(m.brand) ? m.name : `${m.brand} ${m.name}`}</Link>)}
          </p>
        </section>
      )}
      <nav className="beyond-guide-links" aria-label="Aller plus loin">
        {g.links.map((l) => <Link key={l.href} href={l.href} className="beyond-link">{l.label} ↗</Link>)}
      </nav>
    </article>
  );
}
