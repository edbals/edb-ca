import { stat } from 'node:fs/promises'
import path from 'node:path'

export interface PdfMeta {
  /** e.g. "1.9 MB". Absent when the file isn't on disk yet. */
  size?: string
  fileName: string
}

const BYTES_PER_MB = 1024 * 1024
const BYTES_PER_KB = 1024

function formatBytes(bytes: number): string {
  if (bytes >= BYTES_PER_MB) return `${(bytes / BYTES_PER_MB).toFixed(1)} MB`
  return `${Math.round(bytes / BYTES_PER_KB)} KB`
}

/**
 * Reads what can be known for certain about a PDF in `public/`: its name and
 * its exact size.
 *
 * Deliberately no page count. These files use compressed object streams, where
 * counting `/Type /Page` and reading the page tree's `/Count` disagree with
 * each other, and a viewer chrome that prints a confidently wrong page count is
 * worse than one that prints none , the embedded viewer reports pages itself.
 *
 * A missing file is a normal state, not an error: research entries are wired up
 * before the document is dropped in.
 */
export async function getPdfMeta(href: string): Promise<PdfMeta> {
  const fileName = href.split('/').pop() ?? href

  // Only ever resolves inside public/, and only for the app's own paths.
  if (!href.startsWith('/')) return { fileName }

  try {
    const absolute = path.join(process.cwd(), 'public', href)
    const stats = await stat(absolute)
    return { fileName, size: formatBytes(stats.size) }
  } catch {
    return { fileName }
  }
}
