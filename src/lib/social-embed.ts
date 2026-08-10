/**
 * Instagram and LinkedIn both serve a script-free embed page that can be
 * framed directly. That avoids loading their tracking bundles into the site
 * and keeps the post rendering even with third party scripts blocked.
 *
 * Returns null when a URL doesn't match the expected shape, so the caller
 * falls back to a plain link rather than framing something broken.
 */

/** e.g. https://www.instagram.com/p/DbpxJL9kRie/ , captures "DbpxJL9kRie". */
const INSTAGRAM_POST = /instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/

/** LinkedIn embeds are keyed by the numeric activity or share URN. */
const LINKEDIN_URN = /(?:activity[:-]|ugcPost[:-]|share[:-])(\d{6,})/

export function instagramEmbedUrl(href: string): string | null {
  const match = href.match(INSTAGRAM_POST)
  return match ? `https://www.instagram.com/p/${match[1]}/embed` : null
}

export function linkedinEmbedUrl(href: string): string | null {
  const match = href.match(LINKEDIN_URN)
  return match ? `https://www.linkedin.com/embed/feed/update/urn:li:share:${match[1]}` : null
}

export function socialEmbedUrl(network: 'Instagram' | 'LinkedIn', href: string): string | null {
  return network === 'Instagram' ? instagramEmbedUrl(href) : linkedinEmbedUrl(href)
}
