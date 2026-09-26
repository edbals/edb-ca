import { getPdfMeta } from '@/lib/pdf-meta'
import { ButtonLink } from '@/components/ds/button'

export interface PdfViewerProps {
  href: string
  /** Used for the frame's accessible name. */
  title: string
}

/**
 * A PDF in a viewer that looks like one: a toolbar naming the file and its
 * size, the document itself on a recessed mat, and one unambiguous way out to
 * the full-size file.
 *
 * `object` rather than `iframe`, because its fallback content renders when the
 * browser has no inline PDF viewer , the norm on mobile Safari and Android
 * Chrome, where the old embed showed a blank box. The height is capped in `vh`
 * so the document is tall enough to actually read without pushing the analysis
 * beside it off the screen.
 */
/**
 * PDF open parameters. The built-in viewers default to showing the page
 * thumbnail sidebar, which in a half-width column leaves the document itself
 * too narrow to read. `navpanes=0` collapses it and `view=FitH` fits the page
 * to the available width. Ignored by viewers that don't support them, so it
 * degrades to the default rather than breaking.
 */
const VIEWER_PARAMS = '#view=FitH&navpanes=0&toolbar=1'

export async function PdfViewer({ href, title }: PdfViewerProps) {
  const { fileName, size } = await getPdfMeta(href)

  return (
    <div className="border-rule rounded-panel overflow-hidden border">
      <div className="border-rule bg-paper-raised flex flex-wrap items-center gap-2.5 border-b px-3.5 py-2.5">
        <span className="micro rounded-tag bg-down px-1.5 py-[3px] text-white">PDF</span>
        <span className="mono-data text-ink-secondary min-w-0 truncate text-xs">{fileName}</span>
        {size ? (
          <span className="mono-data text-ink-tertiary ml-auto text-[0.6875rem] whitespace-nowrap">
            {size}
          </span>
        ) : null}
        <ButtonLink href={href} external tone="secondary" size="sm">
          Open
        </ButtonLink>
      </div>

      <div className="bg-wash">
        <object
          data={`${href}${VIEWER_PARAMS}`}
          type="application/pdf"
          aria-label={title}
          className="block h-[70vh] max-h-[44rem] min-h-[26rem] w-full"
        >
          {/* Rendered only when there is no inline PDF viewer. */}
          <div className="grid place-items-center p-8 text-center">
            <div>
              <p className="text-ink-secondary text-body">
                Your browser can&apos;t display this PDF inline.
              </p>
              <ButtonLink href={href} external command className="mt-4">
                Open the PDF
              </ButtonLink>
            </div>
          </div>
        </object>
      </div>
    </div>
  )
}
