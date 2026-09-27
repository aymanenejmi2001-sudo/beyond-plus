// Row shapes — one per table in radar/db/schema.sql. Unknown = null, always.

export type CandidateStatus = "DISCOVERED" | "WATCH" | "TEST" | "LAUNCH" | "APPROVED" | "REJECTED" | "IMPORTED" | "ARCHIVED";
export const STATUSES: CandidateStatus[] = ["DISCOVERED", "WATCH", "TEST", "LAUNCH", "APPROVED", "REJECTED", "IMPORTED", "ARCHIVED"];
export type Reliability = "VERIFIED" | "MARKET" | "EDITORIAL";
export type ConfidenceLevel = "HIGH" | "MEDIUM" | "LOW";
export type Dimension = "global" | "morocco" | "velocity";
export type ComponentKey = "globalDemand" | "moroccoDemand" | "trendVelocity" | "marginScore" | "supplierScore";

export interface Candidate {
  id: string;
  dedupe_key: string;
  model_id: string | null;
  brand: string;
  model: string;
  colorway: string | null;
  sku: string | null;
  gender: "women" | "men" | "unisex" | null;
  category: string | null;
  style_family: string | null;
  official_url: string | null;
  official_price: number | null;
  official_currency: string | null;
  hero_image_reference: string | null;   // path or URL — only shown when image_rights = AUTHORIZED
  image_rights: "AUTHORIZED" | "NOT_PUBLISHABLE" | "UNKNOWN";
  selling_price_mad: number | null;       // BEYOND target selling price, set by admin
  catalogue_handle: string | null;        // storefront handle once live (links first-party data)
  global_demand_score: number | null;
  morocco_demand_score: number | null;
  trend_velocity_score: number | null;
  margin_score: number | null;
  supplier_score: number | null;
  first_party_score: number | null;
  external_score: number | null;
  beyond_score: number | null;
  score_change: number | null;
  recommendation: "LAUNCH" | "TEST" | "WATCH" | null;
  confidence: number | null;
  confidence_level: ConfidenceLevel | null;
  score_explanation: ScoreExplanation | null;
  status: CandidateStatus;
  first_detected_at: string;
  last_checked_at: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  notes: string | null;
  source: string;                          // where the candidate was discovered
  created_at: string;
  updated_at: string;
}

export interface MarketSignal {
  id: string;
  candidate_id: string;
  dimension: Dimension;
  source: string;            // "Google Trends", "StockX", "Editorial manifest"…
  metric: string;            // "search_interest_index", "editorial_rating"…
  value: number;             // normalized 0–100
  raw_value: number | null;
  raw_unit: string | null;
  reliability: Reliability;
  source_url: string | null;
  observed_at: string;
  note: string | null;
  created_by: string;
  created_at: string;
}

export interface MoroccoSignal {
  id: string;
  candidate_id: string;
  source_name: string;
  source_url: string | null;
  retailers_count: number | null;
  colorways_count: number | null;
  avg_price_mad: number | null;
  min_price_mad: number | null;
  max_price_mad: number | null;
  promotion_frequency: number | null;   // 0–1 share of observed listings on promotion
  availability: "IN_STOCK" | "LIMITED" | "OUT_OF_STOCK" | "UNKNOWN";
  size_availability: string | null;
  reliability: Reliability;
  observed_at: string;
  note: string | null;
  created_by: string;
  created_at: string;
}

export interface SupplierOffer {
  id: string;
  candidate_id: string;
  supplier_name: string;
  supplier_product_reference: string | null;
  supplier_url: string | null;
  supplier_cost_mad: number | null;
  cost_basis: "CONFIRMED_COST" | "SUPPLIER_LISTED_PRICE" | null;
  shipping_cost_mad: number | null;
  estimated_landed_cost_mad: number | null;  // cost + shipping, null if either is unknown
  minimum_order_quantity: number | null;
  available_sizes: string[] | null;
  available_quantity: number | null;
  lead_time_days: number | null;
  supplier_status: "AVAILABLE" | "LIMITED" | "OUT_OF_STOCK" | "UNKNOWN";
  images_authorized: boolean;
  image_refs: string[] | null;
  image_meta?: { url: string; width: number; height: number }[] | null;
  observed_at: string;
  note: string | null;
  created_at: string;
}

export interface ComponentExplanation {
  key: ComponentKey;
  label: string;
  value: number | null;
  weight: number;
  contribution: number | null;
  lines: string[];            // human-readable, one fact per line
}

export interface ScoreExplanation {
  components: ComponentExplanation[];
  weightCovered: number;
  external: number | null;
  firstParty: { score: number | null; weight: number; lines: string[] };
  final: number | null;
  confidence: { value: number; level: ConfidenceLevel; lines: string[] };
  recommendation: string | null;
  computedAt: string;
}

export interface ScoreSnapshot {
  id: string;
  candidate_id: string;
  run_id: string | null;
  beyond_score: number | null;
  external_score: number | null;
  first_party_score: number | null;
  components: Partial<Record<ComponentKey, number | null>>;
  confidence: number | null;
  confidence_level: ConfidenceLevel | null;
  recommendation: string | null;
  created_at: string;
}

export interface Approval {
  id: string;
  candidate_id: string;
  action: string;
  from_status: CandidateStatus | null;
  to_status: CandidateStatus | null;
  actor: string;
  note: string | null;
  created_at: string;
}

export interface CatalogueDraft {
  id: string;
  candidate_id: string;
  handle: string;
  product: unknown;          // storefront Product shape (src/lib/shopify/types.ts)
  publishable: boolean;      // false until an admin marks it ready
  status: "DRAFT" | "READY" | "IMPORTED";
  issues: string[];
  created_at: string;
  updated_at: string;
}

export interface PerformanceEvent {
  id: string;
  handle: string;
  candidate_id: string | null;
  event: "view" | "add_to_cart" | "checkout_started" | "purchase" | "refund";
  size: string | null;
  quantity: number;
  revenue_mad: number | null;
  source: "MANUAL_ORDER" | "SITE_EVENT" | "GA4" | "SHOPIFY";
  reference: string | null;
  occurred_at: string;
  created_at: string;
}

export interface PerformanceMetric {
  id: string;
  handle: string;
  candidate_id: string | null;
  window_days: number;
  computed_at: string;
  views: number;
  add_to_cart: number;
  checkout_started: number;
  purchases: number;
  units: number;
  revenue_mad: number;
  refunds: number;
  size_mix: Record<string, number>;
}

export interface RadarAlert {
  id: string;
  candidate_id: string | null;
  kind: string;
  severity: "info" | "warn" | "high";
  message: string;
  created_at: string;
  acknowledged_at: string | null;
}

export interface RadarRun {
  id: string;
  kind: "daily" | "weekly" | "manual" | "seed";
  started_at: string;
  finished_at: string | null;
  status: "RUNNING" | "OK" | "PARTIAL" | "FAILED";
  stats: Record<string, number>;
  log: { level: string; msg: string }[];
}

export interface MarketingBrief {
  id: string;
  candidate_id: string;
  brief: Record<string, string | string[]>;
  created_at: string;
}

export interface Brand { id: string; name: string; official_site: string | null; priority: boolean; created_at: string }
export interface SneakerModel { id: string; brand: string; model: string; style_family: string | null; tier: string | null; priority: boolean; created_at: string }

export interface SitePhoto { id: string; handle: string; url: string; alt_text: string | null; width: number; height: number; created_at: string }

export interface Tables {
  brands: Brand;
  sneaker_models: SneakerModel;
  sneaker_candidates: Candidate;
  market_signals: MarketSignal;
  morocco_signals: MoroccoSignal;
  supplier_offers: SupplierOffer;
  product_approvals: Approval;
  catalogue_products: CatalogueDraft;
  performance_events: PerformanceEvent;
  performance_metrics: PerformanceMetric;
  score_snapshots: ScoreSnapshot;
  radar_runs: RadarRun;
  radar_alerts: RadarAlert;
  product_marketing_briefs: MarketingBrief;
  site_photos: SitePhoto;
}
export type TableName = keyof Tables;
