import { credentialSections, type CredentialSection } from '@/content/credentials'
import { externalLinkProps } from '@/lib/external-link'

function Entries({ section }: { section: CredentialSection }) {
  if (section.pending) {
    return <p className="mono-data text-ink-quaternary text-body-sm">{section.pending}</p>
  }

  return (
    <div className="flex flex-col gap-5">
      {section.entries?.map((entry) => {
        const Wrapper = entry.href ? 'a' : 'div'
        return (
          <Wrapper
            key={`${entry.role}-${entry.organisation}`}
            {...(entry.href ? { href: entry.href, ...externalLinkProps(true) } : {})}
            className={entry.href ? 'group block' : 'block'}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="text-title font-semibold group-hover:underline group-hover:underline-offset-4">
                {entry.role}
              </p>
              {entry.period ? (
                <p className="mono-data text-ink-tertiary text-xs whitespace-nowrap">
                  {entry.period}
                </p>
              ) : null}
            </div>
            <p className="text-ink-secondary text-body">{entry.organisation}</p>
            {entry.descriptor ? (
              <p className="text-ink-tertiary text-body-sm">{entry.descriptor}</p>
            ) : null}
          </Wrapper>
        )
      })}
    </div>
  )
}

/**
 * The record as a ledger: the section label sits in its own column and the
 * entries run beside it, so the whole thing reads down one edge.
 *
 * The previous version stacked each label full-width above its own rule, which
 * gave four one-line sections the same visual weight as the content and made a
 * short record look like a long empty one.
 */
export function Credentials() {
  return (
    <div className="shell pb-16 md:pb-21">
      <div className="border-ink border-t-2">
        {credentialSections.map((section) => (
          <section
            key={section.id}
            aria-labelledby={`cred-${section.id}`}
            className="border-rule grid border-b md:grid-cols-[13rem_1fr]"
          >
            <h2
              id={`cred-${section.id}`}
              className="micro text-accent pt-4 md:pt-5 md:pr-4 md:pb-5"
            >
              {section.label}
            </h2>
            <div className="border-rule pt-2 pb-4 md:border-l md:pt-5 md:pb-5 md:pl-6">
              <Entries section={section} />
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
