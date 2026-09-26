/**
 * Artwork for the risk engine card: a risk-contribution bar chart, which is
 * the tool's actual output , each position's share of total portfolio risk,
 * sorted, with the point that a position's weight and its risk contribution
 * are not the same number.
 *
 * Generated rather than photographed. The screenshot that sat here was a
 * placeholder with "replace with app screenshot" printed on it, and a chart
 * of what the tool computes is both honest and more informative than a
 * blurred interface would be.
 *
 * Static by design: the payoff diagram on the neighbouring card already
 * animates, and two moving thumbnails side by side compete rather than read.
 */

const VIEW_WIDTH = 320
const VIEW_HEIGHT = 200
const PAD_X = 26
const PAD_TOP = 34
const ROW_GAP = 6

/** Weight in the portfolio vs. share of total risk, in percent. */
const POSITIONS = [
  { weight: 18, risk: 31 },
  { weight: 22, risk: 24 },
  { weight: 15, risk: 18 },
  { weight: 20, risk: 13 },
  { weight: 14, risk: 9 },
  { weight: 11, risk: 5 },
] as const

const MAX_RISK = Math.max(...POSITIONS.map((position) => position.risk))
const TRACK_WIDTH = VIEW_WIDTH - PAD_X * 2
const ROW_HEIGHT = (VIEW_HEIGHT - PAD_TOP - PAD_X) / POSITIONS.length

export function RiskThumbnail() {
  return (
    <div className="absolute inset-0 bg-[linear-gradient(150deg,#1f242a_0%,#141a1d_55%,#0e1214_100%)]">
      <svg
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        preserveAspectRatio="xMidYMid slice"
        className="size-full"
        role="img"
        aria-label="Chart showing each position's contribution to total portfolio risk, which differs from its weight in the portfolio"
      >
        {POSITIONS.map((position, index) => {
          const y = PAD_TOP + index * ROW_HEIGHT
          const barHeight = ROW_HEIGHT - ROW_GAP
          const riskWidth = (position.risk / MAX_RISK) * TRACK_WIDTH
          const weightWidth = (position.weight / MAX_RISK) * TRACK_WIDTH

          return (
            <g key={index}>
              {/* The track: what an equal-risk portfolio would look like. */}
              <rect
                x={PAD_X}
                y={y}
                width={TRACK_WIDTH}
                height={barHeight}
                fill="rgba(123,219,163,0.06)"
              />
              {/* Portfolio weight, as a hairline marker behind the bar. */}
              <rect
                x={PAD_X}
                y={y}
                width={weightWidth}
                height={barHeight}
                fill="rgba(226,101,74,0.22)"
              />
              {/* Actual contribution to risk. */}
              <rect
                x={PAD_X}
                y={y}
                width={riskWidth}
                height={barHeight * 0.55}
                transform={`translate(0 ${barHeight * 0.22})`}
                fill="#7bdba3"
                fillOpacity={1 - index * 0.11}
              />
            </g>
          )
        })}
      </svg>

      {/* Sits at the bottom, matching the payoff card's label and leaving the
          top-left corner free for the "Coming soon" badge. */}
      <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-x-3 gap-y-1 p-4">
        <span className="micro text-[#7bdba3]/85">Contribution to risk</span>
        <span className="micro text-[#e2654a]/70">Weight</span>
      </div>
    </div>
  )
}
