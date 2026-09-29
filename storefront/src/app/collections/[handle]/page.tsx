import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllCollectionHandles, getCollection, toCard } from "@/lib/shopify";
import { CollectionNav } from "@/components/collection/CollectionNav";
import { COLLECTION_SEO, COLLECTION_TRAIL, MODEL_LANDING } from "@/data/collections";
import { ModelLanding } from "@/components/collection/ModelLanding";
import { GUIDES } from "@/data/guides";
import { pageCount } from "@/lib/pagination";
import Link from "next/link";
import { CollectionHeader } from "@/components/collection/CollectionHeader";
import { ProductGrid } from "@/components/collection/ProductGrid";

interface Params {
  params: Promise<{ handle: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/** ?page=N → a valid page number, or null when it doesn't exist. */
function parsePage(raw: string | undefined, total: number): number | null {
  if (raw === undefined) return 1;
  if (!/^[1-9]\d*$/.test(raw)) return null;
  const n = Number(raw);
  return n <= pageCount(total) ? n : null;
}

export function generateStaticParams() {
  return getAllCollectionHandles().map((handle) => ({ handle }));
}

export async function generateMetadata({ params, searchParams }: Params): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollection(handle);
  if (!collection) return {};
  const sp = await searchParams;
  const page = parsePage(typeof sp.page === "string" ? sp.page : undefined, collection.products.length) ?? 1;
  // Filter or tracking parameters never create indexable pages.
  const extraParams = Object.keys(sp).some((k) => k !== "page" && !/^(utm_[a-z_]+|gclid|fbclid|msclkid)$/.test(k));
  const suffix = page > 1 ? `, Page ${page}` : "";
  const path = page > 1 ? `/collections/${handle}?page=${page}` : `/collections/${handle}`;
  const seo = COLLECTION_SEO.get(handle);
  return {
    // Keep the Google title under ~65 characters: drop the brand suffix when long.
    title: ((t) => (t.length + 15 > 65 ? { absolute: t } : t))((seo?.title ?? collection.title) + suffix),
    description: (page > 1 ? `Page ${page}. ` : "") + (seo?.description ?? collection.description),
    alternates: { canonical: path },
    ...(extraParams ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: `${seo?.title ?? collection.title} | Beyond Plus`,
      description: collection.description,
      images: collection.image ? [{ url: collection.image.url }] : undefined,
    },
  };
}

export default async function CollectionPage({ params, searchParams }: Params) {
  const { handle } = await params;
  const collection = await getCollection(handle);
  if (!collection) notFound();
  const sp = await searchParams;
  const page = parsePage(typeof sp.page === "string" ? sp.page : undefined, collection.products.length);
  if (page === null) notFound();
  // Guides that point to this page get a link back: guides and shop pages feed each other.
  const guideLinks = GUIDES.filter((g) => g.links.some((l) => l.href === `/collections/${handle}`)).map((g) => ({ label: g.title, href: `/guides/${g.slug}` }));
  const seo = COLLECTION_SEO.get(handle);
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://beyondplusmaroc.com";
  const trail = COLLECTION_TRAIL.get(handle) ?? (handle === "nouveautes" ? [] : [{ title: "Sneakers", href: "/collections/nouveautes" }]);
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { title: "Accueil", href: "/" }, ...trail, { title: collection.title, href: `/collections/${handle}` },
    ].map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.title, item: `${site}${c.href}` })),
  };

  return (
    <>
      <CollectionHeader
        title={seo?.h1 ?? collection.title}
        eyebrow={seo?.eyebrow}
        description={collection.description}
        trail={trail}
      />
      <CollectionNav current={handle} />
      <p className="beyond-catalog-note">Répliques qualité Master Copy Premium 1:1 · Commande confirmée par téléphone</p>
      <ProductGrid products={collection.products.map(toCard)} page={page} basePath={`/collections/${handle}`} />
      {MODEL_LANDING.has(handle) ? <ModelLanding {...MODEL_LANDING.get(handle)!} guides={guideLinks} /> : seo && (
        <section className="beyond-collection-seo" aria-labelledby="collection-seo">
          <h2 id="collection-seo">{seo.heading}</h2>
          {seo.body.map((p) => <p key={p}>{p}</p>)}
          {seo.faq && page === 1 && (
            <>
              <h3>Questions fréquentes</h3>
              <dl className="beyond-faq">
                {seo.faq.map((f) => <div key={f.q}><dt>{f.q}</dt><dd>{f.a}</dd></div>)}
              </dl>
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: seo.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }) }} />
            </>
          )}
          <p className="beyond-collection-seo-links">{[...seo.links, ...guideLinks.filter((g) => !seo.links.some((l) => l.href === g.href))].map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}</p>
        </section>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
    </>
  );
}
