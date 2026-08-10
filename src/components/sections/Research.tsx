import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { featuredResearch, listedResearch } from '@/content/research'
import { SectionHeading } from '@/components/ds/section-heading'
import { AnimatedRule } from '@/components/ds/animated-rule'
import { Reveal } from '@/components/ds/reveal'
import { TiltFrame } from '@/components/ds/tilt-frame'
import { DrawnUnderline } from '@/components/ds/drawn-underline'

export function Research() {
  return (
    <section className="shell py-20 md:py-28">
      <SectionHeading id="research" title="Research" />

      {/* Featured: image, category, title, summary. */}
      <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-2">
        {featuredResearch.map((entry, index) => (
          <Reveal key={entry.id} delay={index * 70}>
            <Link href={`/research/${entry.id}`} className="group block">
              {entry.thumbnail ? (
                <div className="border-rule bg-wash relative aspect-[4/3] w-full overflow-hidden rounded-image border">
                  <TiltFrame className="relative size-full">
                    <div className="relative size-full transition-transform duration-700 ease-out group-hover:scale-[1.02]">
                      <Image
                        src={entry.thumbnail}
                        alt={`${entry.title} preview`}
                        fill
                        sizes="(max-width: 768px) 100vw, 45vw"
                        className="object-cover"
                      />
                    </div>
                  </TiltFrame>
                </div>
              ) : null}

              <div className="mt-4 flex items-baseline justify-between gap-4">
                <p className="micro text-ink-tertiary">{entry.category}</p>
                {entry.year ? <p className="micro text-ink-quaternary">{entry.year}</p> : null}
              </div>

              <h3 className="mt-2 font-serif text-subheading text-ink">
                <DrawnUnderline>{entry.title}</DrawnUnderline>
              </h3>

              {entry.subtitle ? (
                <p className="mt-1.5 font-serif text-title text-ink-tertiary">{entry.subtitle}</p>
              ) : null}

              {entry.description ? (
                <p className="mt-3 max-w-[46ch] text-body-sm text-ink-secondary">{entry.description}</p>
              ) : null}

              <p className="micro mt-4 inline-flex items-center gap-1.5 text-ink">
                Read
                <ArrowUpRight
                  size={13}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </p>
            </Link>
          </Reveal>
        ))}
      </div>

      {/* Shelf: smaller thumbnails, stacked side by side. The divider draws
          itself as the shelf arrives, so the section reads as being ruled
          off rather than as already having been. */}
      <AnimatedRule className="mt-16" />
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 pt-10 md:grid-cols-4">
        {listedResearch.map((entry, index) => (
          <Reveal key={entry.id} delay={index * 60}>
            <Link href={`/research/${entry.id}`} className="group block">
              {entry.thumbnail ? (
                <div className="border-rule bg-wash relative aspect-[4/3] w-full overflow-hidden rounded-image border">
                  <TiltFrame className="relative size-full">
                    <div className="relative size-full transition-transform duration-700 ease-out group-hover:scale-[1.02]">
                      <Image
                        src={entry.thumbnail}
                        alt={`${entry.title} preview`}
                        fill
                        sizes="(max-width: 768px) 50vw, 22vw"
                        className="object-cover"
                      />
                    </div>
                  </TiltFrame>
                </div>
              ) : null}

              <div className="mt-3 flex items-baseline justify-between gap-3">
                <p className="micro text-ink-tertiary">{entry.category}</p>
                {entry.year ? <p className="micro text-ink-quaternary">{entry.year}</p> : null}
              </div>

              <h3 className="mt-1.5 font-serif text-title text-ink">
                <DrawnUnderline>{entry.title}</DrawnUnderline>
              </h3>

              <p className="micro mt-2 inline-flex items-center gap-1 text-ink-secondary">
                Read
                <ArrowUpRight
                  size={12}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
