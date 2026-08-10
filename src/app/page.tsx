import { Hero } from '@/components/sections/Hero'
import { Projects } from '@/components/sections/Projects'
import { Research } from '@/components/sections/Research'

/**
 * Paper canvas interrupted by ink editorial bands, the way a broadsheet
 * alternates full bleed spreads with columns of type.
 */
export default function Home() {
  return (
    <main>
      <Hero />
      <Projects />
      <Research />
    </main>
  )
}
