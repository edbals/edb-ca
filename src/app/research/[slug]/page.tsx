import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ResearchSource } from '@/types/content'
import { researchEntries } from '@/content/research'
import { socialEmbedUrl } from '@/lib/social-embed'
import { Reveal } from '@/components/ds/reveal'
import { SubpageHeader } from '@/components/ds/subpage-header'
import { ButtonLink } from '@/components/ds/button'
import { PdfViewer } from '@/components/ds/pdf-viewer'
import { NumberedList } from '@/components/ds/numbered-list'

interface ResearchPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return researchEntries.map((entry) => ({ slug: entry.id }))
}

export async function generateMetadata({ params }: ResearchPageProps): Promise<Metadata> {
  const { slug } = await params
  const entry = researchEntries.find((item) => item.id === slug)
  if (!entry) return {}
  // No title: subpages inherit the root title so the tab always reads
  // "Ed Sunarpo" rather than a truncated page name.
  return { description: entry.description }
}

/** A social post, framed from the network's own script-free embed page. */
function SocialDocument({
  source,
  title,
}: {
  source: Extract<ResearchSource, { kind: 'social' }>
  title: string
}) {
  const embedUrl = source.embedUrl ?? socialEmbedUrl(source.network, source.href)
  // Instagram stacks a header and an action bar around the media, so a
  // portrait post needs noticeably more room than the media alone.
  const frameHeight = source.embedHeight ?? (source.network === 'Instagram' ? 880 : 620)

  return (
    <div className="border-rule rounded-panel overflow-hidden border">
      <div className="border-rule bg-paper-raised flex flex-wrap items-center gap-2.5 border-b px-3.5 py-2.5">
        <span className="micro text-ink-tertiary">Published on {source.network}</span>
        <ButtonLink href={source.href} external tone="secondary" size="sm" className="ml-auto">
          Open
        </ButtonLink>
      </div>

      <div className="bg-wash grid place-items-center p-4 md:p-6">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={title}
            loading="lazy"
            allow="encrypted-media"
            // Scripts and same-origin are what the networks' own embed pages
            // need to render at all. What is deliberately withheld is
            // top-level navigation: without it the embed cannot steer this
            // page somewhere else, which is the one thing a framed third
            // party should never be able to do.
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            referrerPolicy="strict-origin-when-cross-origin"
            className="bg-paper rounded-image w-full max-w-[540px]"
            style={{ height: `${frameHeight}px`, border: 0 }}
          />
        ) : (
          <p className="text-ink-tertiary py-16 text-body-sm">
            This post can only be read on {source.network}.
          </p>
        )}
      </div>
    </div>
  )
}

function SourceDocument({ source, title }: { source?: ResearchSource; title: string }) {
  if (!source) {
    return (
      <div className="border-rule rounded-panel text-ink-tertiary grid aspect-[4/3] place-items-center border border-dashed text-body-sm">
        Document coming soon
      </div>
    )
  }

  if (source.kind === 'pdf') return <PdfViewer href={source.href} title={title} />

  return <SocialDocument source={source} title={title} />
}

export default async function ResearchPage({ params }: ResearchPageProps) {
  const { slug } = await params
  const entry = researchEntries.find((item) => item.id === slug)

  if (!entry) notFound()

  const hasAnalysis = Boolean(entry.findings?.length)

  return (
    <main className="shell pt-11 pb-18 md:pt-14">
      <SubpageHeader
        backLabel="Publications"
        backHref="/#publications"
        category={entry.category}
        outlet={entry.outlet}
        year={entry.year}
        title={entry.title}
        subtitle={entry.subtitle}
        dek={entry.description}
      />

      {/* The document leads and the analysis runs beside it on wide screens,
          stacking beneath it on narrow ones. No collapsible panel: hiding the
          writing behind a toggle meant most readers never saw it. */}
      <Reveal delay={60} className="mt-9">
        <div className="grid gap-9 lg:grid-cols-[1.45fr_1fr] lg:gap-11">
          <div className="min-w-0">
            <SourceDocument source={entry.source} title={entry.title} />
          </div>

          {/* Sticks beside the document on wide screens, so the findings stay
              readable while the reader scrolls through the PDF rather than
              scrolling away from them. */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-20 lg:self-start">
            {entry.findings && entry.findings.length > 0 ? (
              <div>
                <h2 className="micro text-ink-tertiary">Findings</h2>
                <div className="mt-3">
                  <NumberedList items={entry.findings} divided={false} />
                </div>
              </div>
            ) : null}

            {!hasAnalysis ? (
              <p className="text-ink-tertiary text-body-sm">
                The written analysis for this piece is still being prepared.
              </p>
            ) : null}
          </div>
        </div>
      </Reveal>
    </main>
  )
}
