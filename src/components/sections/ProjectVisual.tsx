import Image from 'next/image'
import type { ProjectEntry } from '@/types/content'
import { PayoffThumbnail } from '@/components/sections/PayoffThumbnail'
import { RiskThumbnail } from '@/components/sections/RiskThumbnail'

export interface ProjectVisualProps {
  project: ProjectEntry
  /** Passed to next/image when the project falls back to a screenshot. */
  sizes: string
  priority?: boolean
}

/**
 * Whatever a project shows in place of itself: its own generated output where
 * there is one, a screenshot otherwise.
 *
 * One component rather than the same ternary repeated on the card, the case
 * study and the case study's mobile fallback , which is exactly how the risk
 * engine ended up still showing a placeholder screenshot on phones after its
 * artwork had been added everywhere else.
 */
export function ProjectVisual({ project, sizes, priority }: ProjectVisualProps) {
  if (project.visual === 'payoff') return <PayoffThumbnail />
  if (project.visual === 'risk') return <RiskThumbnail />

  return (
    <Image
      src={project.thumbnail}
      alt={`${project.title} preview`}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover"
    />
  )
}
