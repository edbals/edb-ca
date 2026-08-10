'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { projectEntries } from '@/content/projects'
import { SectionHeading } from '@/components/ds/section-heading'
import { Reveal } from '@/components/ds/reveal'
import { TiltFrame } from '@/components/ds/tilt-frame'
import { DrawnUnderline } from '@/components/ds/drawn-underline'
import { PayoffThumbnail } from '@/components/sections/PayoffThumbnail'

/**
 * Each project is a spread rather than a row: the year runs vertically down
 * the left margin like a printed folio, the thumbnail leads, and the title,
 * prose and actions stack beneath it.
 */
export function Projects() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="band-dark">
      <div className="shell py-20 md:py-28">
        <SectionHeading id="projects" title="Projects" />

        <div className="mt-14 flex flex-col gap-20 md:gap-28">
          {projectEntries.map((project, index) => {
            const caseStudyHref = `/projects/${project.slug}`

            return (
              <Reveal key={project.slug} delay={index * 80}>
                <article className="group grid gap-8 md:grid-cols-12 md:gap-10">
                  {/* Index and year, both set horizontally. Rotating the year
                      down the margin looked like a printing flourish but just
                      made a date hard to read. */}
                  <div className="flex items-baseline gap-4 md:col-span-1 md:flex-col md:gap-2">
                    <span className="micro text-ink-tertiary">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="micro text-ink-quaternary">{project.year}</span>
                  </div>

                  <div className="md:col-span-6">
                    <Link
                      href={caseStudyHref}
                      aria-label={`${project.title}, read the case study`}
                      className="border-rule bg-wash relative block aspect-[16/10] w-full overflow-hidden rounded-image border"
                    >
                      {/* One hover treatment for the slot itself, so the live payoff
                          chart and a static screenshot scale the same way , the
                          card shouldn't behave differently depending on which
                          project you're looking at. */}
                      <TiltFrame className="relative size-full">
                        <div className="relative size-full transition-transform duration-700 ease-out group-hover:scale-[1.02]">
                          {project.visual === 'payoff' ? (
                            <PayoffThumbnail />
                          ) : (
                            <Image
                              src={project.thumbnail}
                              alt={`${project.title} preview`}
                              fill
                              sizes="(max-width: 768px) 100vw, 45vw"
                              className="object-cover"
                            />
                          )}
                        </div>
                      </TiltFrame>

                      {project.comingSoon ? (
                        <span className="micro bg-paper text-ink absolute top-3 left-3 rounded-pill px-3 py-1.5">
                          Coming soon
                        </span>
                      ) : null}
                    </Link>
                  </div>

                  <div className="md:col-span-5">
                    <h3 className="font-serif text-heading text-ink">
                      <Link href={caseStudyHref}>
                        <DrawnUnderline>{project.title}</DrawnUnderline>
                      </Link>
                    </h3>

                    <p className="text-body text-ink-secondary mt-5">
                      {project.description}
                    </p>

                    <motion.div
                      className="border-rule mt-8 border-t pt-6"
                      whileHover={prefersReducedMotion ? undefined : { x: 4 }}
                      transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
                    >
                      <Link
                        href={`/projects/${project.slug}`}
                        className="border-ink text-ink hover:bg-ink hover:text-ink-inverse inline-flex items-center gap-2 rounded-pill border px-5 py-2.5 transition-colors"
                      >
                        <span className="micro">Read the case study</span>
                        <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
                      </Link>
                    </motion.div>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
