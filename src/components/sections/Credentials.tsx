import Link from 'next/link'
import type { ReactNode } from 'react'
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

/** The marker on an entry Ed has written research on. Words beside the icon,
 *  since an icon alone would need a legend to say whose research it is. */
function ResearchTag() {
  return (
    <span className="micro rounded-tag bg-accent-soft text-accent inline-flex items-center gap-1.5 px-2 py-[3px] whitespace-nowrap">
      <svg
        aria-hidden="true"
        width="11"
        height="11"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M4 1.5h5.5L13 5v9.5H4z" />
        <path d="M9.5 1.5V5H13M6.5 8.5h4M6.5 11.5h4" />
      </svg>
      See research
    </span>
  )
}

function EntryLink({ entry, children }: { entry: CredentialEntry; children: ReactNode }) {
  // Research lives on this site, so it opens in place like any other page;
  // everything else an entry links to is somebody else's site.
  if (entry.research) {
    return (
      <Link href={entry.research} className="group/entry block">
        {children}
      </Link>
    )
  }

  if (entry.href) {
    return (
      <a href={entry.href} {...externalLinkProps(true)} className="group/entry block">
        {children}
      </a>
    )
  }

  return <div className="block">{children}</div>
}

function Entry({ entry }: { entry: CredentialEntry }) {
  return (
    <EntryLink entry={entry}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        {/* Named group: `group-hover:` matches any .group ancestor, so while the
            disclosure was also a plain .group, hovering anywhere in it
            underlined every entry inside , including the ones that aren't
            links at all. */}
        <p className="text-title font-semibold group-hover/entry:underline group-hover/entry:underline-offset-4">
          {entry.ticker ? <span className="mono-data mr-2">{entry.ticker}</span> : null}
          {entry.role}
        </p>
        {/* Dates for a post, the outcome for an award , whichever one is the
            point of the entry sits in the same column. */}
        {entry.period || entry.result ? (
          <p className="mono-data text-ink-tertiary text-xs whitespace-nowrap">
            {entry.period ?? entry.result}
          </p>
        ) : null}
        {entry.research ? <ResearchTag /> : null}
      </div>
      {entry.organisation ? (
        <p className="text-ink-secondary text-body">{entry.organisation}</p>
      ) : null}
      {entry.descriptor ? <p className="text-ink-tertiary text-body-sm">{entry.descriptor}</p> : null}
    </EntryLink>
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
    <details className="group/disclosure border-rule border-b">
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
            className="mono-data text-ink-quaternary transition-transform duration-200 group-open/disclosure:rotate-90"
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
