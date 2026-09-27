import type { MetadataRoute } from "next";
import { CATALOG } from "@/data/catalog";
import { COLLECTIONS } from "@/data/collections";
import { GUIDES, isIndexableGuide } from "@/data/guides";
import { DROPS, isPublic } from "@/data/drops";

const site = process.env.NEXT_PUBLIC_SITE_URL || "https://beyondplusmaroc.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number, changeFrequency: "daily" | "weekly" | "monthly" = "weekly") =>
    ({ url: `${site}${path}`, changeFrequency, priority });
  return [
    page("/", 1, "daily"),
    ...COLLECTIONS.map((c) => page(`/collections/${c.handle}`, 0.8, "daily")),
    ...CATALOG.map((p) => ({ ...page(`/products/${p.handle}`, 0.6), images: p.images.slice(0, 1).map((i) => `${site}${i.url}`) })),
    page("/drops", 0.6),
    ...DROPS.filter(isPublic).map((d) => page(`/drops/${d.slug}`, 0.6)),
    page("/marques", 0.8),
    page("/qualite-transparence", 0.5, "monthly"),
    page("/guides", 0.6),
    ...GUIDES.filter(isIndexableGuide).map((g) => page(`/guides/${g.slug}`, 0.6, "monthly")),
    page("/lookbook", 0.4, "monthly"),
    page("/about", 0.4, "monthly"),
    page("/contact", 0.3, "monthly"),
    page("/policies/refund", 0.4, "monthly"),
    page("/policies/terms", 0.2, "monthly"),
    page("/policies/privacy", 0.2, "monthly"),
  ];
}
