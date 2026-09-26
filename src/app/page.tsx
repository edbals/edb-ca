import { Hero } from '@/components/sections/Hero'
import { Credentials } from '@/components/sections/Credentials'
import { Projects } from '@/components/sections/Projects'
import { Research } from '@/components/sections/Research'
import { MarketUpdate } from '@/components/sections/MarketUpdate'

/**
 * Regenerate the page every 15 minutes, matching MARKET_REVALIDATE_SECONDS in
 * lib/market/fetch-json.ts, which is what actually governs how often the
 * figures are refetched.
 *
 * This has to be a literal: route segment config is read statically at build
 * time, so an imported constant here is silently not applied.
 */
export const revalidate = 900

/**
 * One statement, two tools, an index of writing, then the market. Each section
 * is one thing to read, ruled off from the next.
 */
export default function Home() {
  return (
    <main>
      <Hero />
      <Credentials />
      <Projects />
      <Research />
      <MarketUpdate />
    </main>
  )
}
