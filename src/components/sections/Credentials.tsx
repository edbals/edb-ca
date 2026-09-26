import { credentialSections, type CredentialSection } from '@/content/credentials'
import { RoleRow } from '@/components/ds/role-row'
import { ButtonLink } from '@/components/ds/button'

function Section({ section }: { section: CredentialSection }) {
  return (
    <section aria-labelledby={`cred-${section.id}`}>
      <h2
        id={`cred-${section.id}`}
        className="micro text-ink-tertiary border-ink border-b pb-2.5"
      >
        {section.label}
      </h2>

      {section.entries?.length ? (
        <div>
          {section.entries.map((entry) => (
            <RoleRow
              key={`${entry.role}-${entry.organisation}`}
              role={entry.role}
              organisation={entry.organisation}
              descriptor={entry.descriptor}
              period={entry.period}
              href={entry.href}
            />
          ))}
        </div>
      ) : null}

      {section.action ? (
        <div className="border-rule border-b py-4">
          <ButtonLink
            href={section.action.href}
            external={section.action.external}
            tone="secondary"
            size="sm"
          >
            {section.action.label}
          </ButtonLink>
        </div>
      ) : null}

      {section.pending ? (
        <p className="border-rule text-ink-quaternary mono-data border-b py-4 text-body-sm">
          {section.pending}
        </p>
      ) : null}
    </section>
  )
}

/** The record, one labelled block per kind of thing. */
export function Credentials() {
  return (
    <div className="shell flex flex-col gap-10 pb-16 md:pb-21">
      {credentialSections.map((section) => (
        <Section key={section.id} section={section} />
      ))}
    </div>
  )
}
