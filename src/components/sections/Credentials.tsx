import {
  credentialSections,
  type CredentialEntry,
  type CredentialSection,
} from '@/content/credentials'
import { externalLinkProps } from '@/lib/external-link'
import { cn } from '@/lib/utils'

/** The ledger's two columns: label, then everything else. */
const LEDGER = 'md:grid md:grid-cols-[13rem_1fr]'
/** Applied to whatever sits in the second column, so the rule runs unbroken. */
const CONTENT = 'md:border-rule md:border-l md:pl-6'

function Entry({ entry }: { entry: CredentialEntry }) {
  const Wrapper = entry.href ? 'a' : 'div'

  return (
    <Wrapper
      {...(entry.href ? { href: entry.href, ...externalLinkProps(true) } : {})}
      className={entry.href ? 'group block' : 'block'}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-title font-semibold group-hover:underline group-hover:underline-offset-4">
          {entry.role}
        </p>
        {/* Dates for a post, the outcome for an award , whichever one is the
            point of the entry sits in the same column. */}
        {entry.period || entry.result ? (
          <p className="mono-data text-ink-tertiary text-xs whitespace-nowrap">
            {entry.period ?? entry.result}
          </p>
        ) : null}
      </div>
      {entry.organisation ? (
        <p className="text-ink-secondary text-body">{entry.organisation}</p>
      ) : null}
      {entry.descriptor ? <p className="text-ink-tertiary text-body-sm">{entry.descriptor}</p> : null}
    </Wrapper>
  )
}

function Body({ section }: { section: CredentialSection }) {
  if (section.pending) {
    return <p className="mono-data text-ink-quaternary text-body-sm">{section.pending}</p>
  }

  return (
    <div className="flex flex-col gap-5">
      {section.entries?.map((entry) => (
        <Entry key={`${entry.role}-${entry.organisation ?? ''}`} entry={entry} />
      ))}
    </div>
  )
}

function Label({ section }: { section: CredentialSection }) {
  return (
    <h2 className="micro text-accent pt-4 md:pt-5 md:pr-4 md:pb-5">{section.label}</h2>
  )
}

/**
 * A section that folds shut.
 *
 * `details` rather than a click handler: it toggles with no JavaScript, is
 * already in the tab order, and announces its own expanded state, none of
 * which a div and a `useState` would give for free.
 */
function CollapsedSection({ section }: { section: CredentialSection }) {
  const count = section.entries?.length ?? 0

  return (
    <details className="group border-rule border-b">
      <summary
        className={cn(
          LEDGER,
          // The default disclosure triangle is removed in both engines, since
          // the row draws its own marker on the right.
          'cursor-pointer list-none items-baseline [&::-webkit-details-marker]:hidden',
        )}
      >
        <Label section={section} />
        <div
          className={cn(
            CONTENT,
            'flex items-center justify-between gap-3 pt-2 pb-4 md:py-5',
          )}
        >
          <span className="text-ink-tertiary text-body-sm">
            {count} {count === 1 ? 'entry' : 'entries'}
          </span>
          <span
            aria-hidden="true"
            className="mono-data text-ink-quaternary transition-transform duration-200 group-open:rotate-90"
          >
            &gt;
          </span>
        </div>
      </summary>

      <div className={LEDGER}>
        <div aria-hidden="true" className="hidden md:block" />
        <div className={cn(CONTENT, 'pb-5 md:-mt-1')}>
          <Body section={section} />
        </div>
      </div>
    </details>
  )
}

function OpenSection({ section }: { section: CredentialSection }) {
  return (
    <section
      aria-labelledby={`cred-${section.id}`}
      className={cn(LEDGER, 'border-rule border-b')}
    >
      <h2 id={`cred-${section.id}`} className="micro text-accent pt-4 md:pt-5 md:pr-4 md:pb-5">
        {section.label}
      </h2>
      <div className={cn(CONTENT, 'pt-2 pb-4 md:py-5')}>
        <Body section={section} />
      </div>
    </section>
  )
}

/**
 * The record as a ledger: the section label sits in its own column and the
 * entries run beside it, so the whole thing reads down one edge.
 *
 * The supporting sections , memberships, awards, certificates , start folded.
 * They are what a reader checks rather than what they skim, and printed open
 * they made the record three times longer than the part anyone reads first.
 */
export function Credentials() {
  return (
    <div className="shell pb-16 md:pb-21">
      {/* "Profile" is the terminal's own word for this page , DES gives you a
          security's profile , and it reads as plain English besides. */}
      <h2 className="micro text-ink-tertiary border-ink border-b pb-2.5">Profile</h2>
      <div>
        {credentialSections.map((section) =>
          section.collapsed ? (
            <CollapsedSection key={section.id} section={section} />
          ) : (
            <OpenSection key={section.id} section={section} />
          ),
        )}
      </div>
    </div>
  )
}
