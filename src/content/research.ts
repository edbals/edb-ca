import type { ResearchEntry } from "@/types/content";

/**
 * Every entry leads with the kind of work it is, never the file format.
 * Two featured pieces render large; the rest render as a thumbnail shelf.
 *
 * `purpose`, `findings` and `source` drive the /research/[slug] page. They
 * are optional on purpose: the page renders whatever exists and states
 * plainly what does not, rather than showing invented filler. See
 * CONTENT-BRIEF.md for the exact shape each one expects.
 *
 * PDF sources are pre-wired: drop the file at the matching path under
 * public/research/ and it works with no code change.
 */
export const researchEntries: ResearchEntry[] = [
  {
    id: "talen-energy",
    title: "Talen Energy: Where Power Meets Compute",
    year: "2026",
    category: "Equity Research",
    featured: true,
    // Photo: the actual Susquehanna Steam Electric Station, Talen Energy's
    // real plant, not a stock substitute. "Jakec", Wikimedia Commons,
    // CC BY-SA 4.0 (https://commons.wikimedia.org/wiki/File:Susquehanna_Steam_Electric_Station_from_Council_Cup_1.JPG).
    // Attribution required by the license , flag to Ed if a visible credit
    // line or a different image is preferred.
    thumbnail: "/images/research-talen.jpg",
    description:
      "An Outperform initiation on Talen Energy, with 28.4% upside to a $478 price target as AI-driven power demand strengthens its data centre power business.",
    purpose:
      "Whether Talen Energy was undervalued given the accelerating demand for reliable power from AI data centres and its growing exposure to the sector.",
    findings: [
      "AI-driven data centre demand is creating power supply gaps, strengthening the case for on-site generation.",
      "Talen's $18B, 17-year AWS PPA provides long-term contracted cash flows from its nuclear capacity.",
      "Normalising a $501M non-cash charge produces $6.17 adjusted EPS for FY2025.",
      "Blended valuation supports a $478 price target, implying 28.4% upside.",
    ],
    links: [{ label: "Read", href: "/research/talen-energy-equity-research.pdf" }],
    source: { kind: "pdf", href: "/research/talen-energy-equity-research.pdf" },
  },
  {
    id: "decentralised-energy",
    title: "Artificial Intelligence Meets an Ageing Grid",
    outlet: "Acres Research",
    year: "2026",
    category: "Industry Research",
    featured: true,
    thumbnail: "/images/research-energy.jpg",
    description:
      "As AI data centres drive electricity demand higher, grid constraints are making decentralised energy a critical part of the next phase of AI infrastructure.",
    purpose:
      "Whether electricity could become the next major bottleneck for AI growth as data centre demand increasingly outpaces the capacity of the existing power grid.",
    findings: [
      "Power availability is becoming a strategic constraint for AI, creating new demand for independent power generation and grid infrastructure.",
      "Data centre operators are increasingly turning to on-site generation to bypass grid bottlenecks and secure reliable electricity.",
      "Decentralised energy is emerging as an investment theme as data centre operators seek alternatives to congested power grids.",
      "Natural gas, nuclear, solar, and battery storage could benefit as data centres increasingly secure power independently of the grid.",
    ],
    links: [
      {
        label: "Read",
        href: "https://www.instagram.com/p/DbpxJL9kRie/",
      },
    ],
    source: {
      kind: "social",
      network: "Instagram",
      href: "https://www.instagram.com/p/DbpxJL9kRie/",
    },
  },
  {
    id: "jiwa-group",
    title: "Jiwa Group: Scaling Beyond Coffee",
    year: "2026",
    category: "Investment Memo",
    thumbnail: "/images/research-jiwa.jpg",
    description:
      "Jiwa Group could unlock further value through its digital ecosystem, premium café expansion, and a valuation discount to Indonesian F&B peers.",
    purpose:
      "Whether Jiwa Group could translate its scale and multi-brand platform into sustainable earnings growth and a higher valuation as it expands beyond mass-market coffee.",
    findings: [
      "Jiwa Group's multi-brand platform spans coffee, food, tea, and premium cafés; JIWA+ can deepen customer engagement and drive cross-selling across the portfolio.",
      "As coffee shops increasingly become lifestyle and social spaces, Janji Jiwa Culture gives the group an avenue into higher-value consumption, supporting stronger AOV, SSSG, and margins.",
      "Despite operating 900+ outlets, Jiwa Group trades at 9.96x its size multiple versus significantly higher peer multiples, creating potential for a valuation re-rating.",
      "With six brands competing across different segments, a more focused portfolio could improve capital allocation, profitability, and the investment case for an eventual exit.",
    ],
    links: [{ label: "Read", href: "/research/jiwa-group-investment-memo.pdf" }],
    source: { kind: "pdf", href: "/research/jiwa-group-investment-memo.pdf" },
  },
  {
    id: "simpan-am",
    title: "The Smart Investor's Guide to Investing in Indonesia",
    year: "2025",
    category: "Educational",
    thumbnail: "/images/research-simpan.jpg",
    description:
      "A practical guide to Indonesia's foreign-flow-driven equity market, pairing disciplined dollar-cost averaging with tactical buying during corrections.",
    purpose:
      "How should retail investors approach Indonesia's structurally volatile, flow-driven equity market?",
    findings: [
      "Foreign investors have averaged around 40% of trading volume since early 2024, making capital flows a major driver of Indonesian equities.",
      "Foreign outflows can weaken liquidity and pressure the rupiah, while domestic institutions and retail investors can support the market during periods of foreign selling.",
      "Blue-chip stocks tend to track the JCI during foreign inflows, while momentum-driven stocks can outperform when domestic investors drive market activity.",
      "In Indonesia's more timing-sensitive market, combining disciplined DCA with tactical capital deployment during corrections could improve long-term outcomes.",
    ],
    links: [
      {
        label: "Read",
        href: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7379427960677830656",
      },
    ],
    source: {
      kind: "social",
      network: "LinkedIn",
      href: "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7379427960677830656",
      embedUrl:
        "https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7379427960677830656?compact=1",
      embedHeight: 399,
    },
  },
  {
    id: "consumerism-slowdown",
    title: "Indonesia's Struggle with Slowing Consumerism",
    outlet: "Acres Research",
    year: "2025",
    category: "Macro",
    thumbnail: "/images/research-consumerism.jpg",
    description:
      "Indonesia's slowing consumption is weighing on growth as weaker household spending, rising layoffs, and a shrinking middle class put pressure on the economy.",
    purpose:
      "Whether weakening household consumption was becoming a structural drag on Indonesia's growth, and what could reverse the slowdown.",
    findings: [
      "Indonesia's Q1 2025 growth slowed to 4.87%, with weaker household consumption emerging as a key drag on an economy where consumption accounts for over half of GDP.",
      "Rising layoffs and a shrinking middle class are weakening consumer confidence, creating a feedback loop between lower household spending, weaker business revenues, and further job losses.",
      "With consumer savings falling to their lowest levels since 2021, households are prioritising necessities over discretionary spending, putting consumer-facing industries under pressure.",
      "Lower interest rates and planned government stimulus could provide a near-term recovery, but restoring consumer confidence and employment remains critical to breaking the slowdown.",
    ],
    links: [
      {
        label: "Read",
        href: "https://www.instagram.com/p/DKPQcYXxRQz/",
      },
    ],
    source: {
      kind: "social",
      network: "Instagram",
      href: "https://www.instagram.com/p/DKPQcYXxRQz/",
    },
  },
  {
    id: "dec-jan-effect",
    title: "The December & January Effect in Indonesia",
    outlet: "Acres Research",
    year: "2024",
    category: "Educational",
    thumbnail: "/images/research-dec-jan.jpg",
    description:
      "Do seasonal market patterns actually exist in Indonesia, or are the December and January effects simply investment myths?",
    purpose:
      "Whether the December and January effects are genuinely observable in the Jakarta Composite Index, and whether investors can use these seasonal patterns to inform their decisions.",
    findings: [
      "December has historically been the strongest month for the JCI, averaging a 3.67% return with a 92% probability of a gain since 2000.",
      "While January is often associated with stronger equity returns globally, the JCI has averaged just 0.9% in January since 2000, showing no meaningful advantage over other months.",
      "The January Effect has largely disappeared from both the S&P 500 and JCI, suggesting that the historical anomaly is no longer a reliable seasonal pattern.",
      "Seasonal rallies can become self-fulfilling as investors anticipate higher prices, but market anomalies should be treated cautiously rather than used as a substitute for fundamental research.",
    ],
    links: [
      {
        label: "Read",
        href: "https://www.instagram.com/p/DD_trm7S37U/",
      },
    ],
    source: {
      kind: "social",
      network: "Instagram",
      href: "https://www.instagram.com/p/DD_trm7S37U/",
    },
  },
];

export const featuredResearch = researchEntries.filter((entry) => entry.featured);
export const listedResearch = researchEntries.filter((entry) => !entry.featured);
