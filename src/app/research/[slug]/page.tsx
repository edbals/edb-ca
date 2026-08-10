import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowUpRight } from 'lucide-react'
import type { ResearchSource } from '@/types/content'
import { researchEntries } from '@/content/research'
import { socialEmbedUrl } from '@/lib/social-embed'
import { externalLinkProps } from '@/lib/external-link'
import { Reveal } from '@/components/ds/reveal'
import { SubpageHeader } from '@/components/ds/subpage-header'
import { MediaFrame } from '@/components/ds/media-frame'
import { NumberedList } from '@/components/ds/numbered-list'
import { DocumentPanel } from '@/components/ds/document-panel'

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
  // No title: subpages inherit the root `title.default` so the tab always
  // reads "Ed Sunarpo" rather than a truncated page name.
  return { description: entry.description }
}

/**
 * The document, sized to be read rather than glanced at. A PDF renders in
 * place; a social post cannot be framed without third party scripts, so it
 * is presented as a card that opens the original instead of a broken embed.
 */
function SourceDocument({ source, title }: { source?: ResearchSource; title: string }) {
  if (!source) {
    return (
      <MediaFrame aspect="4/3" center>
        <p className="micro text-ink-tertiary">Document coming soon</p>
      </MediaFrame>
    )
  }

  if (source.kind === 'pdf') {
    return (
      <MediaFrame>
        <object
          data={source.href}
          type="application/pdf"
          className="rounded-image h-[75vh] min-h-[32rem] w-full"
        >
          {/* Shown when the browser has no inline PDF viewer, which is the
              norm on mobile Safari and Android Chrome. */}
          <div className="grid h-[24rem] place-items-center p-8 text-center">
            <div>
              <p className="text-body text-ink-secondary">
                Your browser can&apos;t display this PDF inline.
              </p>
              <a
                href={source.href}
                {...externalLinkProps(true)}
                className="micro border-ink text-ink hover:bg-ink hover:text-ink-inverse mt-5 inline-flex items-center gap-2 rounded-pill border px-5 py-2.5 transition-colors"
              >
                Open the PDF
                <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
              </a>
            </div>
          </div>
        </object>
      </MediaFrame>
    )
  }

  const embedUrl = source.embedUrl ?? socialEmbedUrl(source.network, source.href)
  // Instagram stacks a header and an action bar around the media, so a
  // portrait post needs noticeably more room than the media alone.
  const defaultHeight = source.network === 'Instagram' ? 880 : 620
  const frameHeight = source.embedHeight ?? defaultHeight

  return (
    <MediaFrame>
      {embedUrl ? (
        <div className="flex flex-col items-center gap-4 p-4 md:p-6">
          {/* The post itself, framed from the network's own script-free embed
              page so none of their tracking bundles load into this site. */}
          <iframe
            src={embedUrl}
            title={title}
            loading="lazy"
            allow="encrypted-media"
            className="bg-paper w-full max-w-[540px] rounded-image"
            style={{ height: `${frameHeight}px`, border: 0 }}
          />
          <a
            href={source.href}
            {...externalLinkProps(true)}
            className="micro text-ink-secondary hover:text-ink inline-flex items-center gap-1.5 transition-colors"
          >
            Open on {source.network}
            <ArrowUpRight size={13} strokeWidth={1.75} aria-hidden="true" />
          </a>
        </div>
      ) : (
        <div className="grid aspect-[4/3] place-items-center p-8 text-center">
          <div>
            <p className="micro text-ink-tertiary">Published on {source.network}</p>
            <a
              href={source.href}
              {...externalLinkProps(true)}
              className="micro border-ink text-ink hover:bg-ink hover:text-ink-inverse mt-5 inline-flex items-center gap-2 rounded-pill border px-5 py-2.5 transition-colors"
            >
              Open on {source.network}
              <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </MediaFrame>
  )
}

export default async function ResearchPage({ params }: ResearchPageProps) {
  const { slug } = await params
  const entry = researchEntries.find((item) => item.id === slug)

  if (!entry) notFound()

  return (
    <main className="shell pt-28 pb-28 md:pt-36">
      {/* No outbound action here on purpose: the document panel below
          already carries its own open link right next to the content
          itself, so repeating it in the header was the same link twice
          on one page. */}
      <SubpageHeader
        backLabel="Back to research"
        backHref="/#research"
        title={entry.title}
        subtitle={entry.subtitle}
        tags={[entry.category, entry.outlet]}
        year={entry.year}
      />

      <Reveal delay={80} className="mt-12">
        <DocumentPanel
          label="Summary"
          document={<SourceDocument source={entry.source} title={entry.title} />}
        >
          <div className="flex flex-col gap-10">
            {entry.description ? (
              <p className="font-serif text-subheading text-ink">{entry.description}</p>
            ) : null}

            {entry.purpose ? (
              <div className="border-rule border-t pt-6">
                <p className="micro text-ink-tertiary">Purpose</p>
                <p className="mt-4 text-body text-ink-secondary">{entry.purpose}</p>
              </div>
            ) : null}

            {entry.findings && entry.findings.length > 0 ? (
              <div className="border-rule border-t pt-6">
                <p className="micro text-ink-tertiary">Findings</p>
                <div className="mt-4">
                  <NumberedList items={entry.findings} divided={false} />
                </div>
              </div>
            ) : null}

            {!entry.purpose && !entry.findings ? (
              <div className="border-rule border-t pt-6">
                <p className="text-body-sm text-ink-tertiary">
                  The written analysis for this piece is still being prepared.
                </p>
              </div>
            ) : null}
          </div>
        </DocumentPanel>
      </Reveal>
    </main>
  )
}
