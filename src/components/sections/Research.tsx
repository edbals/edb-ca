import Link from 'next/link'
import { researchEntries } from '@/content/research'
import { SectionHeading } from '@/components/ds/section-heading'
import { Terminal, TerminalCommand, TerminalPrompt } from '@/components/ds/terminal'

/** "Equity Research" to "equity-research", so it reads as a real path token. */
function slugifyCategory(category: string): string {
  return category.toLowerCase().replace(/\s+/g, '-')
}

/** Newest first. Entries without a year sort last rather than throwing. */
function byYearDescending(a: { year?: string }, b: { year?: string }): number {
  return Number(b.year ?? 0) - Number(a.year ?? 0)
}

/**
 * The research index as a directory listing. Six thumbnails said nothing about
 * six documents , the images were interchangeable, and the category and date
 * are what a reader actually chooses on. A shell listing shows exactly those,
 * in columns, and carries the one retro-terminal note on the page without
 * dressing the rest of it up.
 *
 * Below `md` the columns collapse into two stacked lines per entry. A fixed
 * four-column table on a phone can only be reached by sideways scrolling, and
 * the column it pushes off the screen is the title , the one thing the reader
 * came to read.
 */
export function Research() {
  const entries = [...researchEntries].sort(byYearDescending)
  const years = entries.map((entry) => Number(entry.year)).filter(Number.isFinite)
  const range = years.length > 0 ? `${Math.min(...years)}–${Math.max(...years)}` : undefined

  return (
    <section className="shell py-16 md:py-21">
      <SectionHeading
        id="research"
        title="Research"
        aside={[`${entries.length} pieces`, range].filter(Boolean).join(' · ')}
      />

      <Terminal path="~/research" className="mt-8">
        <TerminalCommand command="ls research/ --sort=date" />

        <div className="mt-3.5">
          {/* The header labels the columns, so it only makes sense where
              there are columns. */}
          <div className="micro text-term-faint border-term-rule hidden grid-cols-[13rem_4rem_1fr_auto] gap-4 border-b pb-2 md:grid">
            <span>Category</span>
            <span>Year</span>
            <span>Title</span>
            <span className="sr-only">Open</span>
          </div>

          {entries.map((entry) => (
            <Link
              key={entry.id}
              href={`/research/${entry.id}`}
              className="group border-term-rule hover:bg-term-hover flex flex-col gap-1 border-b py-2.5 transition-colors md:grid md:grid-cols-[13rem_4rem_1fr_auto] md:items-baseline md:gap-4"
            >
              {/* On a phone the category and year share one line, since
                  together they are shorter than either is beside a title. */}
              <span className="text-term-faint flex items-baseline gap-2 md:block md:truncate">
                {slugifyCategory(entry.category)}
                <span className="text-term-dim md:hidden">{entry.year}</span>
              </span>
              <span className="text-term-dim hidden md:block">{entry.year}</span>
              <span className="text-term-fg group-hover:underline group-hover:underline-offset-4">
                {entry.title}
              </span>
              <span
                aria-hidden="true"
                className="text-term-faint hidden opacity-0 transition-opacity group-hover:opacity-100 md:block"
              >
                &rarr;
              </span>
            </Link>
          ))}
        </div>

        <TerminalPrompt className="mt-4" />
      </Terminal>
    </section>
  )
}
