import { notFound, permanentRedirect } from "next/navigation";
import retired from "@/data/retired.json";
import type { Metadata } from "next";
import { getAllProductHandles, getProduct, getRelatedProducts } from "@/lib/shopify";
import { ProductInfo } from "@/components/product/ProductInfo";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { brandPage, modelPageFor, retiredTarget } from "@/data/brands";
import { productCopy } from "@/data/product-copy";
import { COMMERCE } from "@/data/commerce";
import Link from "next/link";
import { Reviews } from "@/components/product/Reviews";
import { StoredProducts } from "@/components/product/ProductList";
import { RECENT_KEY } from "@/lib/storage-keys";

interface Params { params: Promise<{ handle: string }> }

export function generateStaticParams() {
  return getAllProductHandles().map((handle) => ({ handle }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) return {};
  const price = Math.round(Number(product.priceRange.minVariantPrice.amount));
  const description = `${product.title} au Maroc, ${price} DH. High copy, non original. Livraison gratuite en 12 à 48 h, pointure confirmée par téléphone.`.replace(/\s+/g, " ");
  // Price in the Google title: first variant that fits ~65 characters, brand suffix dropped when it does not fit.
  const title = [`${product.title} Maroc : prix ${price} DH`, `${product.title} : ${price} DH`, `${product.title} au Maroc`].find((t) => t.length <= 65) ?? product.title;
  return {
    title: title.length + 15 > 65 ? { absolute: title } : title,
    description,
    alternates: { canonical: `/products/${handle}` },
    openGraph: {
      title: `${product.title} au Maroc | Beyond Plus`,
      description,
      images: product.featuredImage ? [{ url: product.featuredImage.url, width: product.featuredImage.width, height: product.featuredImage.height }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) {
    const gone = retired.find((r) => r.handle === handle);
    if (gone) permanentRedirect(retiredTarget(gone.brand, gone.title));
    notFound();
  }

  const related = await getRelatedProducts(product);
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://beyondplusmaroc.com";

  // Structured data limited to what is factually true: a replica sold on
  // order in MAD. No brand claim, no ratings, no stock claim.
  const abs = (u: string) => (u.startsWith("http") ? u : `${site}${u}`);
  const intro = productCopy(product).paragraphs[0] ?? product.description;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.title} (réplique)`,
    description: `${intro} ${COMMERCE.nature}. ${COMMERCE.shipping} ${COMMERCE.returns}`.replace(/\s+/g, " "),
    image: product.images.map((i) => abs(i.url)),
    offers: {
      "@type": "Offer",
      url: `${site}/products/${product.handle}`,
      priceCurrency: "MAD",
      price: product.priceRange.minVariantPrice.amount,
      availability: "https://schema.org/BackOrder",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "BEYOND PLUS" },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: 0, currency: "MAD" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "MA" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 0, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "MA",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 3,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
        refundType: "https://schema.org/ExchangeRefund",
      },
    },
  };

  // Accueil → Sneakers → Marque → Modèle → Produit
  const brand = brandPage(product.merch?.brand ?? product.vendor);
  const model = modelPageFor(product);
  const trail = [
    { title: "Sneakers", href: "/collections/nouveautes" },
    ...(brand ? [{ title: brand.name, href: `/collections/${brand.handle}` }] : []),
    ...(model ? [{ title: model.name, href: `/collections/${model.handle}` }] : []),
  ];
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ title: "Accueil", href: "/" }, ...trail, { title: product.title, href: `/products/${product.handle}` }]
      .map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.title, item: `${site}${c.href}` })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumbs]) }} />
      <ProductInfo product={product} trail={trail} />
      {(() => {
        const c = productCopy(product);
        return (
          <section className="beyond-collection-seo beyond-model" aria-labelledby="product-about">
            <h2 id="product-about">À propos de cette paire</h2>
            {c.paragraphs.map((t) => <p key={t}>{t}</p>)}
            <h3>Comment ça taille</h3>
            <p>{c.fit}</p>
            <h3>Pointures disponibles</h3>
            <p>{c.sizes.length ? c.sizes.join(", ") : "Sur demande"}, {c.price} DH. Pointure confirmée avec vous avant l’envoi.</p>
            <h3>Livraison et échange</h3>
            <p>{COMMERCE.shipping} {COMMERCE.returns}</p>
            <p className="beyond-collection-seo-links">{c.links.map((l) => <Link key={l.href} href={l.href}>{l.label}</Link>)}</p>
          </section>
        );
      })()}
      <Reviews handle={product.handle} />
      <RelatedProducts products={related} href={model ? `/collections/${model.handle}` : brand ? `/collections/${brand.handle}` : "/collections/nouveautes"} />
      <StoredProducts storageKey={RECENT_KEY} max={4} title="Vus récemment" exclude={product.handle} />
    </>
  );
}
