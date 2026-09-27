import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DROPS, dropHeroImage, dropProducts, getDrop } from "@/data/drops";
import { toCard } from "@/lib/shopify";
import { DropView } from "@/components/drops/DropView";
import { launchInfo } from "../launch";

interface Params { params: Promise<{ slug: string }> }

// Static, refreshed every 5 minutes; a real drop also switches client-side at launchAt.
export const revalidate = 300;
export const dynamicParams = false;

export function generateStaticParams() {
  return DROPS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const drop = getDrop((await params).slug);
  if (!drop) return {};
  const image = dropHeroImage(drop);
  return {
    title: drop.name,
    description: drop.description,
    alternates: { canonical: `/drops/${drop.slug}` },
    openGraph: { title: `${drop.name} | Beyond Plus`, description: drop.description, images: image ? [{ url: image.url, width: image.width, height: image.height }] : undefined },
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
      image={dropHeroImage(drop)}
      products={dropProducts(drop).map(toCard)}
      launch={launchInfo(drop)}
      serverNow={Date.now()}
    />
  );
}
