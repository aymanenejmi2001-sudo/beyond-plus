// Normalized BEYOND PLUS product — every source adapter produces this shape.

export type StyleFamily =
  | "low-profile" | "retro-runner" | "y2k-runner" | "skate" | "basketball-retro"
  | "terrace" | "racing" | "technical" | "icon";
export type TrendTier = "CORE" | "RISING" | "EXPERIMENTAL";
export type Gender = "women" | "men" | "unisex";
export type ColorFamily =
  | "silver-white" | "black-silver" | "black-white" | "cream" | "grey" | "brown"
  | "burgundy" | "red-white" | "pink-silver" | "statement";
export type CuratedCollection = "trending-now" | "low-profile" | "retro-runners" | "skate" | "icons" | "basketball" | "tech-runners";
export type Label = "NEW IN" | "TRENDING" | "BEYOND PICK";
export type Provenance = "VERIFIED_DATA" | "MARKET_SIGNAL" | "EDITORIAL_JUDGMENT";
export type Migration = "KEEP_HERO" | "KEEP_CATALOGUE" | "DEPRIORITIZE" | "REVIEW" | "NEW";

export interface Signal { value: number; source: Provenance; note: string } // value 0–5

export interface ImageAsset {
  file: string | null;          // /products/… once ingested (publishable only)
  sourceUrl: string;
  width: number;
  height: number;
  sha256: string | null;
  lowRes: boolean;              // longest edge < 1400 px
  alt: string;
}

export interface NormalizedProduct {
  id: string;
  slug: string;
  brand: string;
  model: string;
  fullName: string;
  colorway: string;
  colorFamily: ColorFamily;
  gender: Gender;
  category: "Sneakers";
  silhouette: string;           // manifest family id
  styleFamily: StyleFamily;
  description: string;          // original BEYOND PLUS copy
  shortDescription: string;
  sourceUrl: string;
  sourceType: "supplier" | "official" | "retailer";
  sourceName: string;
  sourceProductCode: string | null;
  releaseYear: number | null;
  retailPrice: number | null;
  marketReferencePrice: number | null;
  priceMAD: number;
  compareAtPriceMAD: number | null;
  currency: "MAD";
  sizes: string[];
  availableSizes: string[];
  images: ImageAsset[];
  heroImage: string | null;
  gallery: string[];
  tags: string[];
  collections: CuratedCollection[];
  featured: boolean;
  newArrival: boolean;
  trending: boolean;
  label: Label | null;
  trendTier: TrendTier;
  trendScore: number;
  scoreBreakdown: Record<string, Signal>;
  stockStatus: "ON_REQUEST";                 // no BEYOND PLUS inventory data exists
  supplierStatus: "AVAILABLE_AT_SUPPLIER" | "UNAVAILABLE";
  authenticityStatus: "REPLICA_DECLARED_BY_SUPPLIER" | "UNVERIFIED";
  imageRights: "AUTHORIZED_SUPPLIER" | "NOT_PUBLISHABLE";
  publishable: boolean;
  migration: Migration;
  createdAt: string;
  updatedAt: string;
}
