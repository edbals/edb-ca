import type { NextConfig } from 'next'

/**
 * Headers applied to every response.
 *
 * This site takes no user input, has no auth and no cookies, so the surface is
 * small — but it does frame third-party embeds and link outward, and none of
 * these cost anything.
 */
const SECURITY_HEADERS = [
  // The site itself must never be framed: there is nothing to clickjack into,
  // but a framed copy could be wrapped in someone else's chrome and passed off
  // as theirs.
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
  // Stop browsers from second-guessing declared content types.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Send the origin to other sites, never the full path. Research subpages
  // name the piece in the URL, and that shouldn't travel to every outbound
  // link and embedded network.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Nothing here needs any of these; the embeds shouldn't get them either.
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  },
]

const nextConfig: NextConfig = {
  // Don't advertise the framework and version to anyone scanning.
  poweredByHeader: false,

  // No remote image sources are configured, so next/image will only optimise
  // files shipped in public/. Stated explicitly because the default being
  // "deny" is the thing protecting the image endpoint.
  images: {
    remotePatterns: [],
  },

  async headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS }]
  },
}

export default nextConfig
