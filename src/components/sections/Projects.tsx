import Link from 'next/link'
import { projectEntries } from '@/content/projects'
import { SectionHeading } from '@/components/ds/section-heading'
import { Reveal } from '@/components/ds/reveal'
import { Tag } from '@/components/ds/tag'
import { ProjectVisual } from '@/components/sections/ProjectVisual'

/** The subject each tool is about, used as its category chip. */
const CATEGORY: Record<string, string> = {
  'options-lab': 'Options',
  'portfolio-risk-engine': 'Portfolio risk',
}

/**
 * Two cards. These screenshots are the only photographic images left on the
 * page, and they stay because a tool with no picture of itself is just a
 * paragraph claiming a tool exists.
 */
export function Projects() {
  return (
    <section className="shell py-16 md:py-21">
      {/* No count here: two cards sitting right below it already say "two". */}
      <SectionHeading id="projects" title="Projects" />

      <div className="mt-8 grid gap-9 md:grid-cols-2 md:gap-10">
        {projectEntries.map((project, index) => (
          <Reveal key={project.slug} delay={index * 70}>
            <Link href={`/projects/${project.slug}`} className="group block">
              <div className="border-rule rounded-image bg-wash relative aspect-[16/10] w-full overflow-hidden border">
                <ProjectVisual project={project} sizes="(max-width: 768px) 100vw, 45vw" />

                {project.comingSoon ? (
                  <span className="micro rounded-tag bg-paper text-ink absolute top-2.5 left-2.5 px-2.5 py-1 shadow-sm">
                    Coming soon
                  </span>
                ) : null}
              </div>

              <div className="mt-4 flex items-center gap-2.5">
                <Tag>{CATEGORY[project.slug] ?? 'Tool'}</Tag>
                <span className="micro mono-data text-ink-tertiary">{project.year}</span>
              </div>

              <h3 className="text-subheading mt-2.5">{project.title}</h3>

              <p className="text-ink-secondary mt-2 max-w-[44ch] text-body">
                {project.description}
              </p>

              <span className="text-accent mt-3.5 inline-flex items-center gap-1.5 text-body-sm font-semibold">
                Read the case study
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1"
                >
                  &rarr;
                </span>
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
