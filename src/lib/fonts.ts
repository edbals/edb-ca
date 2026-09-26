import { Instrument_Sans, Instrument_Serif } from "next/font/google";

/**
 * Two faces, each with one job.
 *
 * Sans:  everything , headlines, body copy and chrome. Size and weight
 *         carry the hierarchy rather than a third family.
 * Serif:  the wordmark alone, so the one serif on the page always reads as
 *         his name rather than as another kind of heading.
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

