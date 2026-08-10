import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Globe } from 'lucide-react'
import { projectEntries } from '@/content/projects'
import { Reveal } from '@/components/ds/reveal'
import { SubpageHeader } from '@/components/ds/subpage-header'
import { MediaFrame } from '@/components/ds/media-frame'
import { BrowserFrame } from '@/components/ds/browser-frame'
import { DocumentPanel } from '@/components/ds/document-panel'
import { NumberedList } from '@/components/ds/numbered-list'
import { PayoffThumbnail } from '@/components/sections/PayoffThumbnail'
import { externalLinkProps } from '@/lib/external-link'

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
  // No title: subpages inherit the root `title.default` so the tab always
  // reads "Ed Sunarpo" rather than a truncated page name.
  return { description: project.description }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = projectEntries.find((entry) => entry.slug === slug)

  if (!project) notFound()

  return (
    <main className="shell pt-28 pb-28 md:pt-36">
      <SubpageHeader
        backLabel="Back to projects"
        backHref="/#projects"
        title={project.title}
        year={project.year}
      />

      {project.liveUrl ? (
        <Reveal delay={40} className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={project.liveUrl}
            {...externalLinkProps(true)}
            className="micro border-ink text-ink hover:bg-ink hover:text-ink-inverse inline-flex items-center gap-2 rounded-pill border px-6 py-3 transition-colors"
          >
            <Globe size={16} strokeWidth={1.75} aria-hidden="true" />
            Visit the live site
          </a>
          {/* Same status, same word, as the "Coming soon" badge on the
              homepage card: the live tool is real and worth trying, but a
              reader following the CTA in from that badge should see the
              same caveat here rather than have it silently disappear. */}
          {project.comingSoon ? (
            <span className="micro bg-wash text-ink-tertiary rounded-pill px-3 py-1.5">
              Coming soon
            </span>
          ) : null}
        </Reveal>
      ) : null}

      <Reveal delay={80} className="mt-12">
        {/* Live tools embed directly, the same way a research PDF or social
            post fills the document panel , so visiting the case study means
            actually trying the thing, not just reading about it. Anything
            without a live URL falls back to its static artwork. */}
        <DocumentPanel
          label="Case study"
          document={
            <MediaFrame aspect={project.liveUrl ? undefined : '16/10'}>
              {project.liveUrl ? (
                /* A browser window rather than a picture frame: this is a
                   tool to be used in place, and a letterboxed strip leaves
                   nowhere to actually read the interface. */
                <BrowserFrame
                  src={project.liveUrl}
                  title={`${project.title}, live preview`}
                  className="h-[78vh] min-h-[34rem] w-full overflow-hidden"
                />
              ) : project.visual === 'payoff' ? (
                <PayoffThumbnail />
              ) : (
                <Image
                  src={project.thumbnail}
                  alt={`${project.title} preview`}
                  fill
                  sizes="(max-width: 768px) 100vw, 1200px"
                  priority
                  className="object-cover"
                />
              )}
            </MediaFrame>
          }
        >
          <div className="flex flex-col gap-10">
            <div>
              <p className="micro text-ink-tertiary">The question</p>
              <p className="mt-4 font-serif text-subheading text-ink">
                {project.caseStudy.question}
              </p>
            </div>

            <div className="border-rule border-t pt-6">
              <p className="micro text-ink-tertiary">The experiment</p>
              <div className="mt-4 flex flex-col gap-4">
                {project.caseStudy.experiment.map((para, index) => (
                  <p
                    key={para}
                    className={
                      index === 0
                        ? 'font-serif text-subheading text-ink'
                        : 'text-body-sm text-ink-secondary'
                    }
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>

            <div className="border-rule border-t pt-6">
              <p className="micro text-ink-tertiary">Features</p>
              <div className="mt-4">
                <NumberedList items={project.caseStudy.features} divided={false} />
              </div>
            </div>

            <div className="border-rule border-t pt-6">
              <p className="micro text-ink-tertiary">What I learned</p>
              <div className="mt-4">
                <NumberedList items={project.caseStudy.learned} divided={false} />
              </div>
            </div>

            <div className="border-rule border-t pt-6">
              <p className="micro text-ink-tertiary">What&apos;s next</p>
              <div className="mt-4">
                <NumberedList items={project.caseStudy.nextSteps} divided={false} />
              </div>
            </div>
          </div>
        </DocumentPanel>
      </Reveal>
    </main>
  )
}
