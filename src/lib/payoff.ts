export interface OptionLeg {
  type: "call" | "put";
  position: "long" | "short";
  strike: number;
  premium: number;
}

export interface Strategy {
  id: string;
  name: string;
  view: string;
  legs: OptionLeg[];
}

/** Underlying price range the diagram is drawn across. */
export const SPOT_MIN = 74;
export const SPOT_MAX = 126;

/**
 * Fixed sample count across every strategy, so the SVG paths all share a
 * point structure and can morph into one another instead of snapping.
 */
export const SAMPLE_COUNT = 96;

/** Value of a single leg at expiration, net of the premium paid or received. */
function legPayoff(leg: OptionLeg, spot: number): number {
  const intrinsic =
    leg.type === "call" ? Math.max(spot - leg.strike, 0) : Math.max(leg.strike - spot, 0);
  return leg.position === "long" ? intrinsic - leg.premium : leg.premium - intrinsic;
}

/** Net profit or loss of the whole structure at expiration. */
export function strategyPayoff(strategy: Strategy, spot: number): number {
  return strategy.legs.reduce((total, leg) => total + legPayoff(leg, spot), 0);
}

/**
 * Four shapes chosen because they look nothing alike. The morph between
 * them is what makes the mechanics legible at a glance.
 */
export const STRATEGIES: Strategy[] = [
  {
    id: "long-call",
    name: "Long Call",
    view: "Bullish · defined risk",
    legs: [{ type: "call", position: "long", strike: 100, premium: 4.5 }],
  },
  {
    id: "long-straddle",
    name: "Long Straddle",
    view: "Volatility, either direction",
    legs: [
      { type: "call", position: "long", strike: 100, premium: 4.5 },
      { type: "put", position: "long", strike: 100, premium: 4.2 },
    ],
  },
  {
    id: "bull-call-spread",
    name: "Bull Call Spread",
    view: "Bullish · capped upside",
    legs: [
      { type: "call", position: "long", strike: 96, premium: 6.6 },
      { type: "call", position: "short", strike: 108, premium: 2.1 },
    ],
  },
  {
    id: "iron-condor",
    name: "Iron Condor",
    view: "Range-bound · premium capture",
    legs: [
      { type: "put", position: "long", strike: 88, premium: 1.1 },
      { type: "put", position: "short", strike: 94, premium: 2.6 },
      { type: "call", position: "short", strike: 106, premium: 2.6 },
      { type: "call", position: "long", strike: 112, premium: 1.1 },
    ],
  },
];

/** Evenly spaced spot prices the diagram samples at. */
export const SPOTS: number[] = Array.from(
  { length: SAMPLE_COUNT },
  (_, index) => SPOT_MIN + ((SPOT_MAX - SPOT_MIN) * index) / (SAMPLE_COUNT - 1),
);

/** Widest P/L excursion across all strategies, so one scale fits them all. */
export const PAYOFF_BOUND: number = Math.max(
  ...STRATEGIES.flatMap((strategy) => SPOTS.map((spot) => Math.abs(strategyPayoff(strategy, spot)))),
);
