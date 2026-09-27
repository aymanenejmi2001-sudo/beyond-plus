import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DROPS, dropDate, dropHeroImage, dropProducts, getDrop } from "@/data/drops";
import { toCard } from "@/lib/shopify";
import { DropView } from "@/components/drops/DropView";

interface Params { params: Promise<{ slug: string }> }

// Static, refreshed every 5 minutes; the status also switches client-side at launchAt.
export const revalidate = 300;
export const dynamicParams = false;

export function generateStaticParams() {
  return DROPS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const drop = getDrop((await params).slug);
  if (!drop) return {};
  const name = drop.name;
  const image = dropHeroImage(drop);
  return {
    title: name, // → "Low Profile Drop 01 | Beyond Plus"
    description: drop.description,
    alternates: { canonical: `/drops/${drop.slug}` },
    openGraph: { title: `${name} | Beyond Plus`, description: drop.description, images: image ? [{ url: image.url, width: image.width, height: image.height }] : undefined },
  };
}

export default async function DropPage({ params }: Params) {
  const drop = getDrop((await params).slug);
  if (!drop) notFound();
  return (
    <DropView
      eyebrow={drop.eyebrow}
      title={drop.title}
      subtitle={drop.subtitle}
      note={drop.note}
      launchAt={drop.launchAt}
      dateLabel={dropDate(drop)}
      fixedStatus={drop.status === "auto" ? null : drop.status}
      image={dropHeroImage(drop)}
      products={dropProducts(drop).map(toCard)}
      serverNow={Date.now()}
    />
  );
}
