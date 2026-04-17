import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Så byter du lägenhet – Stockholmsbytarn',
  description:
    'Allt du behöver veta om direktbyte av hyresrätt i Stockholm — regler, krav, olika typer av byten och hur du hittar rätt match.',
}

const SWAP_TYPES = [
  {
    title: 'Direktbyte',
    sub: '2 parter',
    desc: 'Det vanligaste bytet. Du och en annan hyresgäst byter lägenheter direkt med varandra. Enkelt och rakt på sak.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    color: 'brand',
  },
  {
    title: 'Trepartsbyte',
    sub: '3 parter',
    desc: 'Tre hyresgäster byter i en kedja. Person A flyttar till B:s lägenhet, B till C:s och C till A:s. Kräver att alla tre är överens och godkänns av respektive hyresvärd.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: 'indigo',
  },
  {
    title: '2 mot 1-byte',
    sub: 'En stor mot två mindre',
    desc: 'En hyresgäst med en stor lägenhet byter mot två mindre lägenheter. Passar till exempel den som vill dela upp ett stort boende efter en separation.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    color: 'teal',
  },
]

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  brand:  { bg: 'bg-brand-50',  text: 'text-brand-600',  border: 'border-brand-100'  },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100' },
  teal:   { bg: 'bg-teal-50',   text: 'text-teal-600',   border: 'border-teal-100'   },
}

const REQUIREMENTS = [
  {
    title: 'Förstahandskontrakt',
    desc: 'Du måste ha ett eget hyreskontrakt — andrahandsboende kan inte bytas.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: 'Bott minst 1 år',
    desc: 'De flesta hyresvärdar kräver att du bott i lägenheten minst ett år innan byte.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Godkänt skäl till bytet',
    desc: 'Det ska finnas beaktansvärda skäl — t.ex. arbete på annan ort, samboende eller familjeskäl.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Tillräcklig inkomst',
    desc: 'Du behöver ha råd med den nya hyran. Hyresvärden kan kontrollera din ekonomi.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Inga skulder',
    desc: 'Inga obetalda hyror eller skulder till hyresvärden. En ren historik ökar chanserna.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
  },
  {
    title: 'Goda referenser',
    desc: 'En positiv kontakt med din nuvarande hyresvärd gör processen smidigare för alla parter.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
]

const HOW_STEPS = [
  {
    step: '1',
    title: 'Lägg upp din annons',
    desc: 'Skapa ett konto och publicera din annons på några minuter. Beskriv lägenheten, ladda upp bilder och ange vad du söker.',
  },
  {
    step: '2',
    title: 'Hitta din match',
    desc: 'Bläddra bland aktiva annonser i hela Stockholm. Filtrera på stadsdel, storlek, hyra och mer. Se alla annonser på karta.',
  },
  {
    step: '3',
    title: 'Ta kontakt och byt',
    desc: 'Hör av dig till annonsören direkt. Boka en visning, kom överens — och ansök om bytet hos era hyresvärdar.',
  },
]

export default function SaByterdPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">

      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4 leading-tight">
          Så byter du lägenhet
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Allt du behöver veta om direktbyte av hyresrätt i Stockholm.
        </p>
      </div>

      {/* Section 1 — Vad är ett lägenhetsbyte? */}
      <section className="mb-14">
        <div className="bg-white rounded-3xl shadow-card p-8 md:p-10">
          <h2 className="font-serif text-2xl md:text-3xl text-gray-900 mb-4">
            Vad är ett lägenhetsbyte?
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Ett lägenhetsbyte innebär att du byter din hyresrätt direkt med en annan hyresgäst.
            Ni tar helt enkelt över varandras kontrakt och flyttar in i varandras hem — utan att
            gå via en mäklare eller sälja något.
          </p>
          <p className="text-gray-600 leading-relaxed">
            För många stockholmare är direktbytet det snabbaste sättet att flytta. Istället för
            att stå i en bostadskö i flera decennier kan du hitta rätt match redan idag — om du
            har en lägenhet att erbjuda i utbyte. Stockholmsbytarn gör det enkelt att hitta
            varandra.
          </p>
        </div>
      </section>

      {/* Section 2 — Typer av byten */}
      <section className="mb-14">
        <h2 className="font-serif text-2xl md:text-3xl text-gray-900 mb-6">
          Olika typer av byten
        </h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {SWAP_TYPES.map(item => {
            const c = colorMap[item.color]
            return (
              <div key={item.title} className={`bg-white rounded-3xl shadow-card p-6 border ${c.border}`}>
                <div className={`w-11 h-11 rounded-xl ${c.bg} ${c.text} flex items-center justify-center mb-4`}>
                  {item.icon}
                </div>
                <div className={`text-xs font-semibold tracking-wide uppercase ${c.text} mb-1`}>
                  {item.sub}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Section 3 — Krav */}
      <section className="mb-14">
        <div className="bg-white rounded-3xl shadow-card p-8 md:p-10">
          <h2 className="font-serif text-2xl md:text-3xl text-gray-900 mb-2">
            Vad krävs för att få byta?
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Hyresvärden kan inte neka ett byte utan giltiga skäl — men det finns ett antal
            grundkrav som brukar gälla. Kontrollera med din hyresvärd om du är osäker.
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            {REQUIREMENTS.map(req => (
              <div key={req.title} className="flex gap-4">
                <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 mt-0.5">
                  {req.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-0.5">{req.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{req.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-400 leading-relaxed">
              <strong className="text-gray-600">Tips:</strong> Är du osäker på dina rättigheter?
              Hyresgästföreningen erbjuder gratis rådgivning till sina medlemmar.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4 — Så fungerar Stockholmsbytarn */}
      <section className="mb-14">
        <h2 className="font-serif text-2xl md:text-3xl text-gray-900 mb-6">
          Så fungerar Stockholmsbytarn
        </h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {HOW_STEPS.map(item => (
            <div key={item.step} className="bg-white rounded-3xl shadow-card p-6">
              <div className="font-serif text-4xl text-brand-100 font-bold mb-3 leading-none">
                {item.step}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-4xl p-10 md:p-14 text-center text-white">
        <h2 className="font-serif text-2xl md:text-3xl mb-3">
          Redo att hitta ditt nästa hem?
        </h2>
        <p className="text-brand-100 mb-8 max-w-md mx-auto leading-relaxed">
          Skapa ett gratis konto och lägg upp din annons idag. Tusentals stockholmare
          letar redan efter precis din lägenhet.
        </p>
        <Link
          href="/registrera"
          className="inline-flex items-center gap-2 bg-white text-brand-600 font-semibold
                     px-8 py-3.5 rounded-2xl hover:bg-brand-50 transition-colors"
        >
          Lägg upp din annons
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

    </div>
  )
}
