// BEYOND RADAR — every business rule lives here. Edit, then press
// "Recalculer" in /admin/radar (or run `npm run radar:daily`).
// Nothing else in the codebase hard-codes a weight, threshold or target.

export const SCORING = {
  /** Beyond Score weights — must sum to 1. */
  weights: {
    globalDemand: 0.3,
    moroccoDemand: 0.3,
    trendVelocity: 0.15,
    marginScore: 0.15,
    supplierScore: 0.1,
  },

  /** Recommendation from the final score (0–100). */
  thresholds: { launch: 75, test: 55 }, // ≥ launch → LAUNCH, ≥ test → TEST, else WATCH

  /** A candidate needs at least this share of the total weight backed by data
   *  before it gets a score at all. Below it the score stays null. */
  minWeightCovered: 0.3,

  /** How much each source class counts, in averages and in confidence. */
  reliability: { VERIFIED: 1, MARKET: 0.7, EDITORIAL: 0.35 } as Record<string, number>,

  /** Signals older than this are ignored for scoring (still kept in history). */
  signalMaxAgeDays: 180,

  morocco: {
    retailersForFull: 6,      // this many Moroccan retailers carrying it = full marks on that part
    colorwaysForFull: 8,
    parts: { retailers: 45, colorways: 25, availability: 15, promotions: 15 }, // sum 100
    availability: { IN_STOCK: 1, LIMITED: 0.7, OUT_OF_STOCK: 0.3 } as Record<string, number>,
  },

  velocity: {
    minSpanDays: 7,           // two observations at least this far apart
    pointsPer30dChange: 2.5,  // +10 index points in 30 days → 50 + 25 = 75
  },

  margin: {
    targetGrossMarginPct: 45, // this margin (or more) = marginScore 100
    alertBelowPct: 30,        // alert when a candidate's margin drops under this
  },

  supplier: {
    status: { AVAILABLE: 60, LIMITED: 35, OUT_OF_STOCK: 0 } as Record<string, number>,
    coreSizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
    sizeCoveragePoints: 30,
    leadTime: [ { maxDays: 7, points: 10 }, { maxDays: 14, points: 5 } ],
  },

  confidence: {
    weights: { sources: 0.3, freshness: 0.25, reliability: 0.25, completeness: 0.2 },
    sourcesForFull: 5,
    freshness: [ { maxDays: 7, value: 1 }, { maxDays: 30, value: 0.6 }, { maxDays: 90, value: 0.3 } ], // older → 0
    levels: { high: 70, medium: 45 }, // ≥ high → HIGH, ≥ medium → MEDIUM, else LOW
    /** Demand backed only by editorial judgment can never read as more than LOW. */
    capWhenEditorialOnly: 40,
  },

  /** Learning loop: first-party BEYOND data gains weight as sales accumulate. */
  learning: {
    maxFirstPartyWeight: 0.6,  // never more than 60 % of the final score
    unitsForMaxWeight: 40,     // units sold at which that maximum is reached (linear before)
    minViewsForConversion: 100,
    benchmarkConversionPct: 2, // product conversion at which that half scores 100
    benchmarkUnitsPer30d: 10,  // units in the last 30 days at which that half scores 100
  },

  alerts: {
    crossLaunch: true,          // crosses thresholds.launch
    scoreJump: 10,              // +N points vs previous snapshot
    moroccoJump: 15,            // Morocco component +N points
    weakAccelerating: { wasBelow: 55, velocityAbove: 70 },
    heroConversionDropPct: 40,  // conversion down 40 % vs previous 30 days
  },
};

/** A pair is never published with fewer photos than this. */
export const MIN_PHOTOS = 4;

/** Only these recommendations are shown as "to publish" in the simple view. */
export const IN_DEMAND = ["LAUNCH", "TEST"];

export type Recommendation = "LAUNCH" | "TEST" | "WATCH";

export function recommend(score: number | null): Recommendation | null {
  if (score == null) return null;
  if (score >= SCORING.thresholds.launch) return "LAUNCH";
  if (score >= SCORING.thresholds.test) return "TEST";
  return "WATCH";
}
