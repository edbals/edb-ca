import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Globe } from 'lucide-react'
import { projectEntries } from '@/content/projects'
import { Reveal } from '@/components/ds/reveal'
import { SubpageHeader } from '@/components/ds/subpage-header'
import { ButtonLink } from '@/components/ds/button'
import { BrowserFrame } from '@/components/ds/browser-frame'
import { NumberedList } from '@/components/ds/numbered-list'
import { ProjectVisual } from '@/components/sections/ProjectVisual'

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return projectEntries.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = projectEntries.find((entry) => entry.slug === slug)
  if (!project) return {}
  // No title: subpages inherit the root title so the tab always reads
  // "Ed Sunarpo" rather than a truncated page name.
  return { description: project.description }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = projectEntries.find((entry) => entry.slug === slug)

  if (!project) notFound()

  return (
    <main className="shell pt-11 pb-18 md:pt-14">
      <SubpageHeader
        backLabel="Projects"
        backHref="/#projects"
        year={project.year}
        title={project.title}
        dek={project.caseStudy.question}
      />

      {project.liveUrl ? (
        <Reveal delay={40} className="mt-7 flex flex-wrap items-center gap-3">
          <ButtonLink href={project.liveUrl} external>
            <Globe size={14} strokeWidth={1.75} aria-hidden="true" />
            Visit the live site
          </ButtonLink>
          {/* Same word as the card's badge on the home page: a reader who
              followed that badge in should see the same caveat here rather
              than have it quietly disappear. */}
          {project.comingSoon ? (
            <span className="micro rounded-tag bg-wash text-ink-secondary px-2.5 py-1.5">
              Coming soon
            </span>
          ) : null}
        </Reveal>
      ) : null}

      <Reveal delay={70} className="mt-9">
        <div className="grid gap-9 lg:grid-cols-[1.45fr_1fr] lg:gap-11">
          <div className="min-w-0">
            {project.liveUrl ? (
              <>
                {/* Below md, the live frame would be scaling a 1440px desktop
                    layout down past the point of being readable. The button
                    above already puts the real tool one tap away in its own
                    tab, so mobile gets the artwork instead. */}
                <div className="border-rule rounded-panel relative aspect-[16/10] w-full overflow-hidden border md:hidden">
                  <ProjectVisual project={project} sizes="100vw" />
                  <span className="micro rounded-tag bg-paper text-ink absolute top-2.5 left-2.5 px-2.5 py-1 shadow-sm">
                    Best on a larger screen
                  </span>
                </div>

                <div className="border-rule rounded-panel hidden h-[70vh] min-h-[30rem] w-full overflow-hidden border md:block">
                  <BrowserFrame
                    src={project.liveUrl}
                    title={`${project.title}, live preview`}
                    className="size-full"
                  />
                </div>
              </>
            ) : (
              <div className="border-rule rounded-panel bg-wash relative aspect-[16/10] w-full overflow-hidden border">
                <ProjectVisual project={project} sizes="(max-width: 768px) 100vw, 1000px" priority />
              </div>
            )}
          </div>

          {/* Sticks beside the live tool on wide screens, so the write-up
              stays in view while the embedded app is being used. */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-20 lg:self-start">
            <div>
              <h2 className="micro text-ink-tertiary">The experiment</h2>
              <div className="mt-2.5 flex flex-col gap-3">
                {project.caseStudy.experiment.map((paragraph, index) => (
                  <p
                    key={paragraph}
                    className={
                      index === 0
                        ? 'text-[1.0625rem] leading-relaxed'
                        : 'text-ink-secondary text-body-sm'
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="border-rule border-t pt-5">
              <h2 className="micro text-ink-tertiary">Features</h2>
              <div className="mt-3">
                <NumberedList items={project.caseStudy.features} divided={false} />
              </div>
            </div>

            <div className="border-rule border-t pt-5">
              <h2 className="micro text-ink-tertiary">What I learned</h2>
              <div className="mt-3">
                <NumberedList items={project.caseStudy.learned} divided={false} />
              </div>
            </div>

            <div className="border-rule border-t pt-5">
              <h2 className="micro text-ink-tertiary">What&apos;s next</h2>
              <div className="mt-3">
                <NumberedList items={project.caseStudy.nextSteps} divided={false} />
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </main>
  )
}
