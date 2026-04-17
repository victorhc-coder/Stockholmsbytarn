import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ListingCard from '@/components/ListingCard'
import HomeSearch from '@/components/HomeSearch'
import HomeMap from '@/components/HomeMap'
import type { Listing } from '@/lib/types'

// Fetch all active listings — used for the map (all) and grid (first 6)
async function getActiveListings(): Promise<Listing[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('listings')
    .select('*, profiles(name, avatar_url)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(200)
  return (data ?? []) as Listing[]
}

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Skapa konto',
    desc: 'Registrera dig gratis med din e-postadress. Det tar bara en minut.',
  },
  {
    step: '02',
    title: 'Lägg upp din annons',
    desc: 'Beskriv din lägenhet, ladda upp bilder och ange vad du söker i ett byte.',
  },
  {
    step: '03',
    title: 'Hitta en match',
    desc: 'Bläddra bland annonser och filtrera på stadsdel, storlek, hyra och mycket mer.',
  },
  {
    step: '04',
    title: 'Ta kontakt direkt',
    desc: 'Skicka ett meddelande till annonsören och boka en visning.',
  },
  {
    step: '05',
    title: 'Byt lägenhet',
    desc: 'Genomför bytet och flytta in i din nya lägenhet.',
  },
]

const STATS = [
  { value: '100%', label: 'Gratis att använda' },
  { value: 'Direkt', label: 'Byte utan mäklare' },
  { value: 'Stockholm', label: 'Hela staden' },
]

const TRUST = [
  {
    title: 'Alltid gratis',
    desc: 'Inga avgifter för att lägga upp annons, kontakta andra eller genomföra ett byte.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Direktkontakt',
    desc: 'Inga mellanhänder. Du tar kontakt med annonsören direkt och hanterar bytet på egna villkor.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    title: 'Ingen tidspress',
    desc: 'Din annons ligger kvar så länge du vill. Leta i lugn och ro tills rätt möjlighet dyker upp.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Hela Stockholm',
    desc: 'Annonser från alla stadsdelar — Södermalm, Östermalm, Vasastan, Bromma och allt däremellan.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

export default async function HomePage() {
  const listings = await getActiveListings()
  const latestSix = listings.slice(0, 6)

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-white pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-500 shadow-lg mb-8">
            <span className="font-serif text-white text-4xl font-bold leading-none">S</span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-gray-900 leading-tight mb-6">
            Byt hyresrätt<br />
            <span className="text-brand-500">i Stockholm</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stockholmsbytarn är en kostnadsfri plattform som låter dig leta i lugn och ro
            och se vad som dyker upp över tid. När rätt möjlighet kommer byter du med andra
            stockholmare, helt utan avgifter.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/annonser" className="btn-primary text-base px-8 py-3.5">
              Bläddra annonser
            </Link>
            <Link href="/lagg-upp" className="btn-secondary text-base px-8 py-3.5">
              Lägg upp gratis
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-14">
            {STATS.map(stat => (
              <div key={stat.label} className="text-center">
                <div className="font-serif text-2xl font-bold text-brand-600">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sök + karta ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-6">
          <h2 className="section-title">Hitta din nästa lägenhet</h2>
          <p className="text-gray-500 mt-1">
            {listings.length > 0
              ? `${listings.length} aktiva annonser just nu i Stockholm`
              : 'Sök bland aktiva annonser i Stockholm'}
          </p>
        </div>

        <HomeSearch />

        <div
          className="mt-5 rounded-3xl overflow-hidden shadow-card"
          style={{ height: 500 }}
        >
          <HomeMap listings={listings} />
        </div>
      </section>

      {/* ── Senaste annonser ── */}
      {latestSix.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="section-title">Senaste annonserna</h2>
              <p className="text-gray-500 mt-1">Nyligen tillagda lägenheter i Stockholm</p>
            </div>
            <Link href="/annonser" className="btn-ghost hidden sm:flex">
              Visa alla →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestSix.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link href="/annonser" className="btn-secondary">
              Visa alla annonser
            </Link>
          </div>
        </section>
      )}

      {/* ── Hur det fungerar ── */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">Så här fungerar det</h2>
            <p className="text-gray-500 mt-2">Fem enkla steg till din nya lägenhet</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {HOW_IT_WORKS.map(item => (
              <div key={item.step} className="relative">
                <div className="bg-gray-50 rounded-3xl p-6 h-full">
                  <div className="font-serif text-4xl text-brand-100 font-bold mb-3">{item.step}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trygghet ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="section-title">Varför Stockholmsbytarn?</h2>
          <p className="text-gray-500 mt-2">Enkelt, gratis och utan mellanhänder</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TRUST.map(item => (
            <div key={item.title} className="bg-white rounded-3xl shadow-card p-6">
              <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-4xl p-10 md:p-14 text-center text-white">
          <h2 className="font-serif text-3xl md:text-4xl mb-4">
            Redo att byta bostad?
          </h2>
          <p className="text-brand-100 text-lg mb-8 max-w-xl mx-auto">
            Skapa din annons på under 5 minuter och nå tusentals stockholmare
            som söker precis din lägenhet.
          </p>
          <Link
            href="/lagg-upp"
            className="inline-flex items-center gap-2 bg-white text-brand-600 font-semibold px-8 py-3.5 rounded-2xl
              hover:bg-brand-50 transition-colors"
          >
            Lägg upp din annons gratis
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  )
}
