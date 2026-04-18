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


const TRUST = [
  {
    title: 'Alltid gratis',
    desc: 'Att lägga upp en annons, kontakta andra och genomföra ett byte kostar ingenting — varken nu eller senare.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Direktkontakt',
    desc: 'Du kommunicerar direkt med den du vill byta med. Inga mellanhänder, inga omvägar.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    title: 'Ingen tidspress',
    desc: 'Bostadsmarknaden tar tid — din annons är kvar tills rätt byte dyker upp.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Hela Stockholm',
    desc: 'Från Södermalm till Bromma, från Östermalm till Kungsholmen — hela staden på ett ställe.',
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

          <h1 className="animate-hero animate-hero-d0 font-serif text-4xl md:text-6xl lg:text-7xl text-gray-900 leading-tight mb-6">
            Byt hyresrätt<br />
            <span className="text-brand-500">i Stockholm</span>
          </h1>

          <p className="animate-hero animate-hero-d1 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stockholmsbytarn är en kostnadsfri plattform som låter dig leta i lugn och ro
            och se vad som dyker upp över tid. När rätt möjlighet kommer byter du med andra
            stockholmare, helt utan avgifter.
          </p>

          <div className="animate-hero animate-hero-d2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/annonser" className="btn-primary text-base px-8 py-3.5">
              Bläddra annonser
            </Link>
            <Link href="/lagg-upp" className="btn-secondary text-base px-8 py-3.5">
              Lägg upp gratis
            </Link>
          </div>

          <div className="animate-hero animate-hero-d3 flex items-center justify-center gap-6 mt-8 flex-wrap">
            {['100% gratis', 'Se hela marknadens utbud, utan att missa något', 'Hela Stockholm'].map(pill => (
              <span key={pill} className="inline-flex items-center gap-1.5 text-sm text-gray-400">
                <svg className="w-4 h-4 text-brand-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {pill}
              </span>
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
      <section className="py-16 md:py-24" style={{ backgroundColor: '#f5f5f7' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl md:text-4xl text-gray-900">Så fungerar Stockholmsbytarn</h2>
            <p className="text-gray-500 mt-3 text-lg">Tre steg från annons till inflytt.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {[
              {
                n: '1',
                title: 'Lägg upp din annons',
                desc: 'Skapa ett konto och publicera din annons på några minuter. Beskriv lägenheten, ladda upp bilder och ange vad du söker.',
              },
              {
                n: '2',
                title: 'Hitta din match',
                desc: 'Bläddra bland aktiva annonser i hela Stockholm. Filtrera på stadsdel, storlek, hyra och mer. Se alla annonser på karta.',
              },
              {
                n: '3',
                title: 'Ta kontakt och byt',
                desc: 'Hör av dig till annonsören direkt. Boka en visning, kom överens — och ansök om bytet hos era hyresvärdar.',
              },
            ].map((item, i) => (
              <div key={item.n} className="relative flex flex-col md:flex-row md:items-start gap-4">
                {/* Arrow between steps */}
                {i < 2 && (
                  <div className="hidden md:flex absolute -right-5 top-10 z-10 items-center justify-center w-10">
                    <svg className="w-5 h-5 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
                {/* Card */}
                <div className="bg-white rounded-3xl shadow-card p-8 flex flex-col flex-1">
                  <div className="font-serif text-6xl font-bold leading-none mb-6 select-none" style={{ color: '#0066cc' }}>
                    {item.n}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-xl mb-3">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.desc}</p>
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
