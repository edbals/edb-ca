import type { ProjectEntry } from '@/types/content'

/**
 * Add a project by appending an entry. The list and the /projects/[slug]
 * case study both derive from this file.
 */
export const projectEntries: ProjectEntry[] = [
  {
    slug: 'options-lab',
    year: '2026',
    title: 'Options Learning Lab',
    description:
      'An AI-powered options research platform that helps investors explore option strategies, analyse live market data, and evaluate potential trades through AI-generated insights, risk analysis, and interactive visualisations.',
    thumbnail: '/images/project-options-lab.jpg',
    visual: 'payoff',
    liveUrl: 'https://options-lab-iota.vercel.app/',
    caseStudy: {
      question: 'As AI becomes more capable, how should investors actually use it?',
      experiment: [
        'An interactive options learning platform exploring how AI can improve the way investors learn, research, and make decisions.',
        'The platform combines live market data, interactive payoff visualisations, and AI powered research into a single experience. Users can explore option strategies, analyse live option chains, understand market events, and evaluate potential trades with AI assisted insights.',
        'Every feature is designed to make investing more systematic, intuitive, and accessible.',
      ],
      features: [
        'Interactive payoff visualisations across multiple option strategies',
        'Live CBOE option chains with real time pricing and Greeks',
        'AI powered news summaries with bullish and bearish analysis',
        'AI generated option strategy recommendations with risk explanations',
        'Reverse implied volatility solver',
        'Adjustable strike price, premium, implied volatility, and expiration',
        'Interactive learning experience designed to build intuition instead of memorisation',
      ],
      learned: [
        'AI is exceptionally good at organising information, identifying patterns, and making research more systematic.',
        'AI can reduce information overload and remove much of the emotion from the research process.',
        'However, context and conviction remain the most important parts of investing.',
      ],
      nextSteps: [
        'Saved strategy portfolios linked to live option chains',
        'Historical implied volatility analysis and benchmarking',
      ],
    },
  },
  {
    slug: 'portfolio-risk-engine',
    year: '2026',
    title: 'Portfolio Risk & Backtesting Engine',
    description:
      'A portfolio risk analysis tool that backtests historical performance and breaks down overall portfolio risk to the individual holding, showing investors which positions actually drive volatility, drawdowns, and portfolio exposure.',
    thumbnail: '/images/project-risk-engine.jpg',
    visual: 'risk',
    liveUrl: 'https://riskcalculatorv1.vercel.app',
    comingSoon: true,
    caseStudy: {
      question: 'A portfolio may look diversified, but where does its risk actually come from?',
      experiment: [
        'An investment analysis tool that breaks portfolio risk down to the individual position level.',
        'Instead of reporting a single portfolio volatility number, the platform backtests historical performance, compares returns against the S&P 500, and decomposes total portfolio risk into each holding’s contribution. The result is a clearer picture of how each position shapes the portfolio’s overall risk profile.',
      ],
      features: [
        'Historical portfolio backtesting using five years of daily market data',
        'Portfolio volatility, Sharpe ratio, maximum drawdown, and beta analysis',
        'Position level risk decomposition using covariance and correlation matrices',
        'Marginal, absolute, and percentage contribution to risk calculations',
        'Benchmark comparison against the S&P 500',
        'Flask web interface for portfolio analysis',
      ],
      learned: [
        'Diversification is about reducing risk exposure, not simply increasing the number of holdings. Companies in the same or closely related industries often move together, limiting the benefits of diversification.',
        'Portfolio volatility becomes much more meaningful when investors understand which positions are driving their overall risk profile.',
        'Building financial software reinforced the importance of mathematical correctness. Every insight is only as reliable as the assumptions and calculations behind it.',
      ],
      nextSteps: [
        'Factor based risk decomposition across sectors and investment styles',
        'Support for additional benchmarks beyond the S&P 500',
        'Portfolio rebalancing and scenario analysis',
      ],
    },
  },
]
