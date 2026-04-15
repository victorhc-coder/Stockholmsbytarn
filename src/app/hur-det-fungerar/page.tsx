import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Hur det fungerar – Stockholmsbytarn',
  description: 'Lär dig hur du byter hyresrätt i Stockholm med Stockholmsbytarn — från annons till inflyttning.',
}

const STEPS = [
  {
    step: '01',
    title: 'Skapa din annons',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    color: 'brand',
    content: [
      {
        subtitle: 'Registrera ett konto',
        text: 'Skapa ett konto med din e-postadress. Det tar bara en minut och är helt gratis.',
      },
      {
        subtitle: 'Fyll i din lägenhetsinformation',
        text: 'Beskriv din lägenhet: adress, stadsdel, antal rum, storlek och hyra. Ju mer du berättar, desto fler intresserade hittar du.',
      },
      {
        subtitle: 'Ladda upp bilder',
        text: 'Lägg till upp till 8 bilder av din lägenhet. Annonser med bilder får betydligt fler kontakter.',
      },
      {
        subtitle: 'Berätta vad du söker',
        text: 'Ange vilken typ av lägenhet du vill byta till — stadsdel, storlek eller annat som är viktigt för dig.',
      },
    ],
  },
  {
    step: '02',
    title: 'Sök bland annonser',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    color: 'indigo',
    content: [
      {
        subtitle: 'Filtrera efter dina önskemål',
        text: 'Välj stadsdel, antal rum och maxhyra. Du kan också söka på fritext för att hitta specifika adresser eller beskrivningar.',
      },
      {
        subtitle: 'Utforska i din egen takt',
        text: 'Inga tidsgränser eller påtryckningar. Bläddra bland annonser när det passar dig och se vad som dyker upp över tid.',
      },
      {
        subtitle: 'Se lägenheten på karta',
        text: 'Använd vår kartvy för att se var alla aktiva annonser ligger i Stockholm.',
      },
    ],
  },
  {
    step: '03',
    title: 'Kontakta varandra',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    color: 'teal',
    content: [
      {
        subtitle: 'Skicka ett meddelande',
        text: 'Hittar du en lägenhet som verkar intressant? Skicka ett meddelande direkt till ägaren via plattformen.',
      },
      {
        subtitle: 'Boka en visning',
        text: 'Stäm träff och kolla lägenheterna ordentligt innan ni bestämmer er. Ta gärna med dig alla frågor du har.',
      },
      {
        subtitle: 'Diskutera villkoren',
        text: 'Kom överens om inflyttningsdatum, eventuella möbler och andra detaljer som är viktiga för er.',
      },
    ],
  },
  {
    step: '04',
    title: 'Ansök om byte hos hyresvärden',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: 'green',
    content: [
      {
        subtitle: 'Förbered ansökan',
        text: 'När ni är överens behöver båda parter ansöka om bytet hos sina respektive hyresvärdar. Ta fram kontrakt, personnummer och anledning till bytet.',
      },
      {
        subtitle: 'Hyresvärdens godkännande',
        text: 'Enligt hyreslagen har hyresgäster rätt att byta hyresrätt om det finns skäliga skäl. Hyresvärdar får endast neka i undantagsfall.',
      },
      {
        subtitle: 'Skriv under nya kontrakt',
        text: 'När båda hyresvärdar godkänt bytet skrivs nya hyreskontrakt under. Kom överens om ett gemensamt tillträdesdatum.',
      },
      {
        subtitle: 'Flytta in i din nya lägenhet',
        text: 'Dags att flytta! Välkomna till ert nya hem. Glöm inte att markera er annons som utbytt på plattformen.',
      },
    ],
  },
]

const colorMap: Record<string, { bg: string; text: string; stepBg: string }> = {
  brand:  { bg: 'bg-brand-50',  text: 'text-brand-600',  stepBg: 'bg-brand-500' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', stepBg: 'bg-indigo-500' },
  teal:   { bg: 'bg-teal-50',   text: 'text-teal-600',   stepBg: 'bg-teal-500' },
  green:  { bg: 'bg-green-50',  text: 'text-green-600',  stepBg: 'bg-green-500' },
}

export default function HurDetFungerarPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-4">
          Hur det fungerar
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Att byta hyresrätt i Stockholm behöver inte vara komplicerat. Här är allt du
          behöver veta för att komma igång.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-8">
        {STEPS.map((item) => {
          const colors = colorMap[item.color]
          return (
            <div key={item.step} className="bg-white rounded-3xl shadow-card overflow-hidden">
              {/* Step header */}
              <div className={`${colors.bg} px-8 py-6 flex items-center gap-5`}>
                <div className={`w-14 h-14 rounded-2xl ${colors.stepBg} text-white flex items-center justify-center shrink-0`}>
                  {item.icon}
                </div>
                <div>
                  <div className={`text-xs font-semibold tracking-widest uppercase ${colors.text} mb-0.5`}>
                    Steg {item.step}
                  </div>
                  <h2 className="font-serif text-2xl text-gray-900">{item.title}</h2>
                </div>
              </div>

              {/* Step content */}
              <div className="px-8 py-7 grid sm:grid-cols-2 gap-6">
                {item.content.map((c, i) => (
                  <div key={i}>
                    <h3 className="font-semibold text-gray-900 mb-1.5">{c.subtitle}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* FAQ teaser */}
      <div className="mt-12 bg-gray-50 rounded-3xl p-8 md:p-10">
        <h2 className="font-serif text-2xl text-gray-900 mb-4">Vanliga frågor</h2>
        <div className="space-y-5">
          {[
            {
              q: 'Kostar det något?',
              a: 'Nej, Stockholmsbytarn är helt gratis. Inga avgifter, inga prenumerationer.',
            },
            {
              q: 'Har hyresvärden rätt att neka ett byte?',
              a: 'Hyresvärdar kan bara neka om det finns påtaglig anledning, till exempel om bytesparten inte kan betala hyran. Kontakta Hyresgästföreningen om du är osäker.',
            },
            {
              q: 'Hur lång tid tar ett byte?',
              a: 'Det varierar. Vissa hittar rätt match inom veckor, andra väntar längre. Du bestämmer tempot och kan pausa din annons när som helst.',
            },
            {
              q: 'Kan jag byta till en annan stadsdel?',
              a: 'Absolut! Det är fullt möjligt att byta till en helt annan stadsdel i Stockholm.',
            },
          ].map((faq, i) => (
            <div key={i} className="border-b border-gray-200 pb-5 last:border-0 last:pb-0">
              <h3 className="font-semibold text-gray-900 mb-1">{faq.q}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <Link href="/lagg-upp" className="btn-primary text-base px-8 py-3.5">
          Lägg upp din annons gratis
        </Link>
        <p className="text-sm text-gray-400 mt-4">
          Redan registrerad?{' '}
          <Link href="/annonser" className="text-brand-600 hover:underline">
            Bläddra bland annonser
          </Link>
        </p>
      </div>
    </div>
  )
}
