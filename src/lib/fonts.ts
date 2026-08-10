import { Instrument_Sans, Instrument_Serif, Space_Grotesk } from "next/font/google";

/**
 * Three faces, each with one job.
 *
 * Serif: headings, titles, subheadings. The reading voice of the page.
 * Sans:  body copy and chrome. Quiet by design.
 * Accent: company chips only. Space Grotesk has odd, drawn letterforms that
 *         make the lockups feel like objects set into the prose rather than
 *         more running text.
 */
export const serifDisplay = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const sansText = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-instrument-sans",
  display: "swap",
});

export const accentType = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});
