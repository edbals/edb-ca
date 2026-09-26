# OG image fonts

Only used by `app/opengraph-image.tsx`. The share card is rendered with Satori,
which needs real TTF/OTF data — it cannot use the woff2 that `next/font` loads
for the site itself, and it has no system fonts to fall back on.

`InstrumentSans-{Regular,SemiBold}.ttf` are static instances cut from Google's
variable `InstrumentSans[wdth,wght].ttf` at wght 400 and 600, wdth 100. Google
ships only the variable file, and Satori applies variation axes unreliably, so
the weights are baked in here instead.

Instrument Sans and Instrument Serif are both SIL Open Font License 1.1.
