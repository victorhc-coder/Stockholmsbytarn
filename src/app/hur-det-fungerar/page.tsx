import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Hur det fungerar – Stockholmsbytarn',
  description: 'Fem enkla steg till din nya lägenhet med Stockholmsbytarn.',
}

const STEPS = [
  {
    step: '01',
    title: 'Skapa konto',
    desc: 'Registrera dig gratis med din e-postadress. Det tar bara en minut.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Lägg upp din annons',
    desc: 'Beskriv din lägenhet, ladda upp bilder och ange vad du söker i ett byte.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Hitta en match',
    desc: 'Bläddra bland annonser och filtrera på stadsdel, storlek, hyra och mycket mer.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    step: '04',
    title: 'Ta kontakt direkt',
    desc: 'Skicka ett meddelande till annonsören och boka en visning.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    step: '05',
    title: 'Byt lägenhet',
    desc: 'Genomför bytet och flytta in i din nya lägenhet.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
]

export default function HurDetFungerarPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      {/* Header */}
      <div className="text-center mb-14">
        <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-3">
          Så här fungerar det
        </h1>
        <p className="text-lg text-gray-500">Fem enkla steg till din nya lägenhet</p>
      </div>

      {/* Steps */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-7 top-8 bottom-8 w-px bg-gray-100 hidden sm:block" />

        <div className="space-y-4">
          {STEPS.map((item, i) => (
            <div key={item.step} className="relative flex gap-5 sm:gap-7">
              {/* Step circle */}
              <div className="relative z-10 shrink-0 w-14 h-14 rounded-2xl bg-brand-500 text-white
                              flex items-center justify-center shadow-sm">
                {item.icon}
              </div>

              {/* Content */}
              <div className="bg-white rounded-3xl shadow-card flex-1 px-6 py-5 flex items-center gap-4">
                <div className="font-serif text-3xl text-brand-100 font-bold leading-none w-10 shrink-0 hidden sm:block">
                  {item.step}
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 mb-1">{item.title}</h2>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-14 text-center space-y-3">
        <Link href="/registrera" className="btn-primary text-base px-8 py-3.5 inline-block">
          Skapa konto gratis
        </Link>
        <p className="text-sm text-gray-400">
          Redan registrerad?{' '}
          <Link href="/annonser" className="text-brand-600 hover:underline">
            Bläddra bland annonser
          </Link>
        </p>
      </div>
    </div>
  )
}
