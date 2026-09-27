// What every source adapter returns — one shape, whatever the site.
export interface Candidate {
  sourceName: string;
  sourceType: "supplier" | "official" | "retailer";
  imagesAuthorized: boolean;     // commercial reuse established for this source
  sourceUrl: string;
  sourceProductCode: string | null;
  handle: string;
  title: string;
  sizes: string[];
  availableSizes: string[];
  priceMAD: number | null;
  compareAtMAD: number | null;
  images: { url: string; width: number; height: number }[];
  publishedAt: string | null;
  bestSeller: boolean;
}

export interface Metadata {
  sourceUrl: string;
  sourceProductCode: string | null;
  releaseYear: number | null;
  retailPrice: number | null;
  images: string[];              // research only — NOT_PUBLISHABLE
}
