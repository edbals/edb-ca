import { cvLink } from '@/content/cv'
import { contact } from '@/content/contact'
import { exploring } from '@/content/exploring'
import { ButtonLink, KeyGo, keyClassName, keyStyle } from '@/components/ds/button'
import { EmailMenu } from '@/components/ds/email-menu'

/**
 * The three nouns the sentence is really about. Each lights in turn with a
 * rule sweeping in beneath it, then all three settle in the accent.
 *
 * `index` only sets the stagger; the timing lives in globals.css so the
 * sequence can be retuned in one place.
 */
function Key({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <b className="kw-cycle" style={{ ['--kw-index' as string]: index }}>
      {children}
    </b>
  )
}

/**
 * The opening statement, set large, with no image and nothing beside it. The
 * page earns attention by having one thing to read at the top rather than a
 * portrait, a logo wall and three columns competing for the same glance.
 */
export function Hero() {
  return (
    <section id="top" className="shell pt-18 pb-14 md:pt-26 md:pb-18">
      <p className="text-lead max-w-[30ch] font-semibold">
        I&apos;m interested in <Key index={0}>finance</Key>, <Key index={1}>technology</Key>, and{' '}
        <Key index={2}>product design</Key>.
      </p>

      <p className="text-ink-secondary mt-5 max-w-[46ch] text-[1.0625rem] leading-relaxed">
        I love analysing emerging businesses, macro trends, and understanding the different ways
        technology can change economies and society.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <ButtonLink href={cvLink.href} external={cvLink.external} command>
          {cvLink.label}
        </ButtonLink>
        <EmailMenu
          email={contact.email}
          label={
            <>
              Email
              <KeyGo tone="secondary" />
            </>
          }
          triggerStyle={keyStyle('secondary')}
          triggerClassName={keyClassName({ tone: 'secondary' })}
        />
        <ButtonLink href={contact.linkedinUrl} external tone="linkedin">
          {contact.linkedinLabel}
        </ButtonLink>
      </div>

      {/* What's live right now, as opposed to the record below it. The marker
          is the terminal prompt rather than a bullet, which ties this to the
          publications listing without turning it into another dark panel. */}
      <div className="mt-14">
        <h2 className="micro text-ink-tertiary border-ink border-b pb-2.5">
          Currently exploring
        </h2>
        <ul className="flex flex-col">
          {exploring.map((topic) => (
            <li
              key={topic}
              className="border-rule flex gap-3 border-b py-3.5 text-[1.0625rem] leading-snug"
            >
              <span aria-hidden="true" className="mono-data text-accent pt-[0.2em] text-xs">
                &gt;
              </span>
              {topic}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
