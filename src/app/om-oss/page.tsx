import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Om oss – Stockholmsbytarn',
  description: 'Stockholmsbytarn är en kostnadsfri plattform för lägenhetsbyte i Stockholm.',
}

export default function OmOssPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      {/* Header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-500 shadow-lg mb-6">
          <span className="font-serif text-white text-4xl font-bold leading-none">S</span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4">Om Stockholmsbytarn</h1>
        <p className="text-lg text-gray-500 leading-relaxed max-w-2xl mx-auto">
          Stockholmsbytarn är en kostnadsfri plattform som låter dig leta i lugn och ro
          och se vad som dyker upp över tid. När rätt möjlighet kommer byter du med andra
          stockholmare, helt utan avgifter.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-10">
        <div className="bg-white rounded-3xl shadow-card p-8 md:p-10">
          <h2 className="font-serif text-2xl text-gray-900 mb-4">Varför Stockholmsbytarn?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Bostadsmarknaden i Stockholm är tuff. Långa köer, höga priser och mäklare som tar
            stora avgifter gör det svårt att hitta rätt bostad. Vi tror att det finns ett bättre sätt.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Stockholmsbytarn ger hyresrättsinnehavare möjligheten att hitta varandra direkt —
            utan mellanhänder, utan avgifter, utan tidspress. Du lägger upp din annons, bläddrar
            bland andra och tar kontakt när du hittar någon med rätt lägenhet för dig.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-card p-8 md:p-10">
          <h2 className="font-serif text-2xl text-gray-900 mb-4">Hur det fungerar</h2>
          <div className="space-y-5">
            {[
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 4v16m8-8H4" />
                  </svg>
                ),
                title: 'Lägg upp din annons gratis',
                desc: 'Skapa ett konto, fyll i dina uppgifter och ladda upp bilder. Det tar under fem minuter.',
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
                title: 'Bläddra i lugn och ro',
                desc: 'Inga avgifter eller tidsgränser. Filtrera på stadsdel, rum och hyra och se vad som dyker upp.',
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                ),
                title: 'Ta kontakt direkt',
                desc: 'Hitta en intressant lägenhet? Skicka ett meddelande direkt till ägaren och boka visning.',
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Byt och flytta in',
                desc: 'När ni är överens ansöker ni om bytet hos era respektive hyresvärdar. Klart!',
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-card p-8 md:p-10">
          <h2 className="font-serif text-2xl text-gray-900 mb-4">Helt gratis — alltid</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Stockholmsbytarn tar aldrig ut några avgifter. Varken för att lägga upp annons,
            kontakta andra eller genomföra ett byte. Tjänsten är och förblir gratis.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Vi tror att ett bra bostadsbyte inte ska kosta pengar. Vår ambition är att göra
            det enklare för stockholmare att hitta varandra och byta lägenhet på egna villkor.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <Link href="/annonser" className="btn-primary text-base px-8 py-3.5">
          Bläddra annonser
        </Link>
        <p className="text-sm text-gray-400 mt-4">
          Eller{' '}
          <Link href="/hur-det-fungerar" className="text-brand-600 hover:underline">
            läs mer om hur det fungerar
          </Link>
        </p>
      </div>
    </div>
  )
}
