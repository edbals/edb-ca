import { cvLink } from '@/content/cv'
import { contact } from '@/content/contact'
import { acresResearch, ubcSauder } from '@/content/hero'
import { ButtonLink } from '@/components/ds/button'
import { EmailMenu } from '@/components/ds/email-menu'
import { RoleRow } from '@/components/ds/role-row'

/** Key terms, lifted in the accent so the sentence reads by its nouns alone. */
function Key({ children }: { children: React.ReactNode }) {
  return <b className="text-accent font-semibold">{children}</b>
}

/**
 * The opening statement, set large, with no image and nothing beside it. The
 * page earns attention by having one thing to read at the top rather than a
 * portrait, a logo wall and three columns competing for the same glance.
 */
export function Hero() {
  return (
    <section id="top" className="shell pt-18 pb-16 md:pt-26 md:pb-22">
      <p className="text-lead max-w-[30ch] font-semibold">
        I&apos;m interested in <Key>finance</Key>, <Key>technology</Key>, and{' '}
        <Key>product design</Key>, and I enjoy exploring how technology can change the way we
        understand businesses and markets.
      </p>

      <p className="text-ink-secondary mt-5 max-w-[46ch] text-[1.0625rem] leading-relaxed">
        I like turning ideas into something tangible, from developing an investment thesis to
        building tools around problems I find interesting.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <ButtonLink href={cvLink.href} external={cvLink.external}>
          {cvLink.label}
        </ButtonLink>
        <EmailMenu
          email={contact.email}
          triggerClassName="micro rounded-button border border-rule-strong text-ink hover:border-ink inline-flex cursor-pointer items-center gap-2 px-4 py-2 transition-colors"
        />
        <a
          href={contact.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="micro link-rule text-ink-secondary"
        >
          {contact.linkedinLabel}
        </a>
      </div>

      {/* Roles, titles and dates mirror the résumé PDF exactly, so the two
          never contradict each other in front of a recruiter. */}
      <div className="border-rule mt-14 border-t">
        <RoleRow
          role="Sophomore"
          organisation={ubcSauder.name}
          href={ubcSauder.href}
          descriptor="Finance & Business Analytics (Intended)"
          period="Expected May 2029"
        />
        <RoleRow
          role="Director of Research II"
          organisation={acresResearch.name}
          href={acresResearch.href}
          period="June 2024 - Present"
        />
      </div>
    </section>
  )
}
