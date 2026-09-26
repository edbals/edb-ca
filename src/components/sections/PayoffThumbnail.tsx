"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  PAYOFF_BOUND,
  SPOTS,
  SPOT_MAX,
  SPOT_MIN,
  STRATEGIES,
  strategyPayoff,
} from "@/lib/payoff";

const VIEW_WIDTH = 400;
const VIEW_HEIGHT = 300;
const PAD_X = 26;
const PAD_Y = 54;
const CYCLE_MS = 3000;

const toX = (spot: number) =>
  PAD_X + ((spot - SPOT_MIN) / (SPOT_MAX - SPOT_MIN)) * (VIEW_WIDTH - PAD_X * 2);

const toY = (payoff: number) =>
  VIEW_HEIGHT / 2 - (payoff / PAYOFF_BOUND) * (VIEW_HEIGHT / 2 - PAD_Y);

const ZERO_Y = toY(0);

function linePath(strategyIndex: number): string {
  const strategy = STRATEGIES[strategyIndex];
  return SPOTS.map((spot, index) => {
    const command = index === 0 ? "M" : "L";
    return `${command}${toX(spot).toFixed(2)},${toY(strategyPayoff(strategy, spot)).toFixed(2)}`;
  }).join(" ");
}

function areaPath(strategyIndex: number): string {
  return `${linePath(strategyIndex)} L${toX(SPOT_MAX).toFixed(2)},${ZERO_Y.toFixed(
    2,
  )} L${toX(SPOT_MIN).toFixed(2)},${ZERO_Y.toFixed(2)} Z`;
}

/**
 * The Options Lab card's artwork , the project's own payoff engine running
 * live, cycling structures, instead of a static screenshot. Same maths as
 * the hero (`lib/payoff.ts`), scaled and stripped down to read at card size.
 */
export function PayoffThumbnail() {
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % STRATEGIES.length);
    }, CYCLE_MS);
    return () => window.clearInterval(timer);
  }, [prefersReducedMotion]);

  const strategy = STRATEGIES[index];
  const transition = { duration: 0.8, ease: [0.32, 0.72, 0, 1] as const };

  return (
    <div className="absolute inset-0 bg-[linear-gradient(150deg,#1f242a_0%,#141a1d_55%,#0e1214_100%)]">
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        preserveAspectRatio="xMidYMid slice"
        className="size-full"
        role="img"
        aria-label={`Live option payoff diagram, currently showing a ${strategy.name}`}
      >
        <defs>
          <linearGradient id="thumb-profit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7bdba3" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#7bdba3" stopOpacity="0" />
          </linearGradient>
          <clipPath id="thumb-above">
            <rect x="0" y="0" width={VIEW_WIDTH} height={ZERO_Y} />
          </clipPath>
          <clipPath id="thumb-below">
            <rect x="0" y={ZERO_Y} width={VIEW_WIDTH} height={VIEW_HEIGHT - ZERO_Y} />
          </clipPath>
        </defs>

        {[85, 95, 105, 115].map((spot) => (
          <line
            key={spot}
            x1={toX(spot)}
            y1={PAD_Y * 0.4}
            x2={toX(spot)}
            y2={VIEW_HEIGHT - PAD_Y * 0.4}
            stroke="rgba(123,219,163,0.10)"
            strokeWidth="1"
          />
        ))}

        <line
          x1={toX(SPOT_MIN)}
          y1={ZERO_Y}
          x2={toX(SPOT_MAX)}
          y2={ZERO_Y}
          stroke="rgba(123,219,163,0.30)"
          strokeWidth="1"
          strokeDasharray="4 5"
        />

        <motion.path
          initial={{ d: areaPath(index) }}
          animate={{ d: areaPath(index) }}
          transition={transition}
          fill="url(#thumb-profit)"
          clipPath="url(#thumb-above)"
        />
        <motion.path
          initial={{ d: areaPath(index) }}
          animate={{ d: areaPath(index) }}
          transition={transition}
          fill="#e2654a"
          fillOpacity="0.16"
          clipPath="url(#thumb-below)"
        />
        <motion.path
          initial={{ d: linePath(index) }}
          animate={{ d: linePath(index) }}
          transition={transition}
          fill="none"
          stroke="#7bdba3"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-4">
        <span className="size-1.5 shrink-0 rounded-full bg-[#7bdba3]" aria-hidden="true" />
        <AnimatePresence mode="wait">
          <motion.span
            key={strategy.id}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="micro text-[#7bdba3]/85"
          >
            {strategy.name}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
