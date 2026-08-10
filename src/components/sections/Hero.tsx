'use client'

import { motion, useReducedMotion } from 'motion/react'
import { cvLink } from '@/content/cv'
import { contact } from '@/content/contact'
import { acresResearch, investorMuda, ubcSauder } from '@/content/hero'
import { externalLinkProps } from '@/lib/external-link'
import { ExperienceRow } from '@/components/ds/experience-row'
import { EmailMenu } from '@/components/ds/email-menu'
import { SignatureMark } from '@/components/ds/signature-mark'

const SPRING = { type: 'spring', bounce: 0, duration: 0.7 } as const

/** Key terms, weighted so the sentence can be read by its nouns alone. */
function Key({ children }: { children: React.ReactNode }) {
  return <span className="text-ink font-medium">{children}</span>
}

/**
 * The Rothenberg format: a column of large serif prose with company lockups
 * set inline. The opening is broken into short, separately weighted lines so
 * a skimming reader gets the whole proposition from the emphasised nouns.
 *
 * The column widens at `xl`, where a fixed 46rem measure starts leaving
 * flat paper on the right. Rather than filling that gap with a decorative
 * mark, the actual content, the display line and the reading measure, grows
 * into it: the signature is set in `em`s off `--text-display`, so raising
 * that token's ceiling grows it along with everything else here.
 */
export function Hero() {
  const prefersReducedMotion = useReducedMotion()

  const rise = prefersReducedMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 22 },
        visible: { opacity: 1, y: 0, transition: SPRING },
      }

  return (
    <section id="top" className="shell pt-28 pb-16 md:pt-36 md:pb-24">
      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: prefersReducedMotion ? 0 : 0.09 }}
        className="max-w-[46rem] xl:max-w-[54rem]"
      >
        <motion.h1 variants={rise} className="font-serif text-display text-ink">
          <SignatureMark />
        </motion.h1>

        <motion.div variants={rise} className="mt-8 flex max-w-[52ch] flex-col gap-5 xl:max-w-[60ch]">
          <p className="text-subheading text-ink-secondary">
            I&apos;m interested in <Key>finance</Key>, <Key>technology</Key>, and{' '}
            <Key>product design</Key>, and I enjoy exploring how technology can change the way we
            understand businesses and markets.
          </p>
          <p className="text-subheading text-ink-secondary">
            I like turning ideas into something tangible, from developing an investment thesis to
            building tools around problems I find interesting.
          </p>
        </motion.div>

        {/* Roles, titles and dates all mirror the resume PDF exactly, so the
            two never contradict each other in front of a recruiter. */}
        <motion.div variants={rise} className="mt-16 flex flex-col">
          <ExperienceRow
            role="Sophomore"
            company={ubcSauder.name}
            logo={ubcSauder.logo}
            href={ubcSauder.href}
            descriptor="Finance & Business Analytics (Intended)"
            period="Expected May 2029"
          />
          <ExperienceRow
            role="Part-Time Analyst"
            company={investorMuda.name}
            logo={investorMuda.logo}
            href={investorMuda.href}
            period="June 2026 - Present"
          />
          <ExperienceRow
            role="Director of Research II"
            company={acresResearch.name}
            logo={acresResearch.logo}
            href={acresResearch.href}
            period="June 2024 - Present"
          />
        </motion.div>

        <motion.div variants={rise} className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={cvLink.href}
            {...externalLinkProps(cvLink.external)}
            className="mono-data rounded-pill bg-ink text-ink-inverse inline-flex items-center gap-2 px-5 py-2.5 text-[11px] tracking-[0.1em] uppercase transition-opacity hover:opacity-85"
          >
            {cvLink.label}
          </a>
          <EmailMenu
            email={contact.email}
            triggerClassName="link-rule text-body-sm text-ink-secondary hover:text-ink cursor-pointer transition-colors"
          />
          <a
            href={contact.linkedinUrl}
            {...externalLinkProps(true)}
            className="link-rule text-body-sm text-ink-secondary"
          >
            {contact.linkedinLabel}
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
