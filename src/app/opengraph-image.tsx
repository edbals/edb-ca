import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'Ed Sunarpo — finance, technology, and product design. edbert.ca'

/** LinkedIn, X and Slack all render 1.91:1; 1200x630 is that ratio. */
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const FONT_DIR = join(process.cwd(), 'src/assets/fonts')

const COLOR = {
  paper: '#ffffff',
  rule: '#e6e6e2',
  ruleStrong: '#cfd0cb',
  ink: '#16181d',
  ink2: '#585d68',
  ink3: '#8b909c',
  accent: '#0b6b5b',
  term: '#111417',
  termFg: '#7bdba3',
  termLabel: '#8fa89b',
} as const

/** The uppercase micro label the site uses for every eyebrow and meta line. */
function Micro({
  children,
  color = COLOR.ink3,
}: {
  children: string
  color?: string
}) {
  return (
    <div style={{ fontSize: 17, letterSpacing: 2.2, textTransform: 'uppercase', fontWeight: 600, color }}>
      {children}
    </div>
  )
}

/**
 * The link preview card.
 *
 * Built from the site's own parts rather than a generic banner: the wordmark
 * in the one serif, the opening sentence with its three nouns in the accent,
 * and a strip of terminal keys along the bottom. Someone who clicks through
 * should land on a page that looks like the card they clicked.
 */
export default async function OpenGraphImage() {
  const [sans, sansSemibold, serif] = await Promise.all([
    readFile(join(FONT_DIR, 'InstrumentSans-Regular.ttf')),
    readFile(join(FONT_DIR, 'InstrumentSans-SemiBold.ttf')),
    readFile(join(FONT_DIR, 'InstrumentSerif-Regular.ttf')),
  ])

  const keys = ['Projects', 'Publications', 'Markets']

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: COLOR.paper,
          fontFamily: 'Instrument Sans',
        }}
      >
        {/* Masthead */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            padding: '44px 64px 0',
          }}
        >
          <div style={{ fontFamily: 'Instrument Serif', fontSize: 40, color: COLOR.ink }}>
            Ed Sunarpo
          </div>
          <Micro>Vancouver, BC</Micro>
        </div>

        <div style={{ height: 1, backgroundColor: COLOR.rule, margin: '22px 64px 0' }} />

        {/* The statement */}
        <div style={{ display: 'flex', flexDirection: 'column', padding: '40px 64px 0', flexGrow: 1 }}>
          <Micro color={COLOR.accent}>A bit about me</Micro>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              fontSize: 60,
              lineHeight: 1.16,
              letterSpacing: -1.6,
              fontWeight: 600,
              color: COLOR.ink,
              marginTop: 22,
              maxWidth: 930,
            }}
          >
            <span>I&#8217;m interested in&nbsp;</span>
            <span style={{ color: COLOR.accent }}>finance</span>
            <span>,&nbsp;</span>
            <span style={{ color: COLOR.accent }}>technology</span>
            <span>,&nbsp;and&nbsp;</span>
            <span style={{ color: COLOR.accent }}>product design</span>
            <span>.</span>
          </div>

          <div
            style={{
              fontSize: 25,
              lineHeight: 1.45,
              color: COLOR.ink2,
              marginTop: 24,
              maxWidth: 800,
            }}
          >
            Sophomore at UBC Sauder.
          </div>
        </div>

        {/* Terminal strip: the keys, and the address */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: COLOR.term,
            padding: '0 64px',
            height: 92,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {keys.map((key) => (
              <div
                key={key}
                style={{
                  fontSize: 17,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  fontWeight: 600,
                  color: COLOR.termLabel,
                  marginRight: 34,
                }}
              >
                {key}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 600, color: COLOR.paper, letterSpacing: 0.4 }}>
              edbert.ca
            </div>
            <div style={{ fontSize: 22, fontWeight: 600, color: COLOR.termFg, marginLeft: 14 }}>
              &lt;GO&gt;
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Instrument Sans', data: sans, style: 'normal', weight: 400 },
        { name: 'Instrument Sans', data: sansSemibold, style: 'normal', weight: 600 },
        { name: 'Instrument Serif', data: serif, style: 'normal', weight: 400 },
      ],
    },
  )
}
