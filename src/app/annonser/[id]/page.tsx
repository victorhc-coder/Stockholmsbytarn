import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ContactButton from './ContactButton'
import type { Listing } from '@/lib/types'

async function getListing(id: string): Promise<Listing | null> {
  const supabase = await createClient()

  // Öka visningsantal (fire-and-forget)
  void supabase.rpc('increment_views', { listing_id: id })

  const { data } = await supabase
    .from('listings')
    .select('*, profiles(id, name, email, phone, avatar_url, created_at)')
    .eq('id', id)
    .single()

  return data as Listing | null
}

function formatRent(rent: number) {
  return new Intl.NumberFormat('sv-SE').format(rent) + ' kr/mån'
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const listing = await getListing(id)

  if (!listing || listing.status === 'deleted') {
    notFound()
  }

  const profile = listing.profiles as any

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-600 transition-colors">Hem</Link>
        <span>/</span>
        <Link href="/annonser" className="hover:text-brand-600 transition-colors">Annonser</Link>
        <span>/</span>
        <span className="text-gray-900 truncate max-w-[200px]">{listing.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left – main content */}
        <div className="lg:col-span-2">
          {/* Image gallery */}
          <div className="rounded-3xl overflow-hidden bg-gray-100 mb-6">
            {listing.images?.length > 0 ? (
              <div>
                <div className="relative aspect-video">
                  <Image
                    src={listing.images[0]}
                    alt={listing.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 66vw"
                  />
                </div>
                {listing.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-1 p-1 bg-gray-100">
                    {listing.images.slice(1, 5).map((img, i) => (
                      <div key={img} className="relative aspect-square">
                        <Image
                          src={img}
                          alt={`Bild ${i + 2}`}
                          fill
                          className="object-cover rounded"
                          sizes="150px"
                        />
                        {i === 3 && listing.images.length > 5 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
                            <span className="text-white font-semibold text-sm">
                              +{listing.images.length - 5}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100">
                <svg className="w-20 h-20 text-brand-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 21V12h6v9" />
                </svg>
              </div>
            )}
          </div>

          {/* Title + info */}
          <div className="bg-white rounded-3xl shadow-card p-6 mb-5">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="badge bg-brand-50 text-brand-700">{listing.stadsdel}</span>
              <span className="badge bg-green-50 text-green-700">Aktiv</span>
            </div>

            <h1 className="font-serif text-2xl md:text-3xl text-gray-900 mb-2">{listing.title}</h1>
            <p className="text-gray-500 flex items-center gap-1.5 text-sm mb-5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {listing.address}
            </p>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Storlek', value: `${listing.size_sqm} m²` },
                { label: 'Rum', value: `${listing.rooms} rum` },
                { label: 'Hyra', value: formatRent(listing.monthly_rent) },
                { label: 'Våning', value: listing.floor ? `${listing.floor}/${listing.total_floors ?? '?'}` : 'Okänd' },
              ].map(stat => (
                <div key={stat.label} className="bg-gray-50 rounded-2xl p-3 text-center">
                  <div className="text-xs text-gray-500 mb-0.5">{stat.label}</div>
                  <div className="font-semibold text-gray-900 text-sm">{stat.value}</div>
                </div>
              ))}
            </div>

            <h2 className="font-semibold text-gray-900 mb-2">Om lägenheten</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">{listing.description}</p>

            {listing.floor_plan && (
              <>
                <h2 className="font-semibold text-gray-900 mt-5 mb-2">Planlösning</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{listing.floor_plan}</p>
              </>
            )}

            {listing.move_in_date && (
              <div className="mt-5 flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Inflyttningsdatum:</span>
                <span className="font-medium">
                  {new Date(listing.move_in_date).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            )}
          </div>

          {/* What they want */}
          {listing.wants_desc && (
            <div className="bg-brand-50 rounded-3xl p-6">
              <h2 className="font-semibold text-brand-900 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Söker i byte
              </h2>
              <p className="text-brand-800 text-sm leading-relaxed">{listing.wants_desc}</p>
            </div>
          )}
        </div>

        {/* Right – contact card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="bg-white rounded-3xl shadow-card p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Kontakta annonsören</h2>

              {/* Profile */}
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
                <div className="w-11 h-11 rounded-full bg-brand-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {profile?.avatar_url ? (
                    <Image src={profile.avatar_url} alt={profile.name ?? ''} width={44} height={44} className="object-cover" />
                  ) : (
                    <span className="font-serif text-brand-600 text-lg">
                      {(profile?.name ?? 'A')[0].toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">{profile?.name ?? 'Annonsör'}</div>
                  <div className="text-xs text-gray-500">
                    Medlem sedan {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString('sv-SE', { year: 'numeric', month: 'long' })
                      : ''}
                  </div>
                </div>
              </div>

              <ContactButton listing={listing} />

              <p className="text-xs text-gray-400 mt-3 text-center">
                {listing.views} visningar · Annons från {new Date(listing.created_at).toLocaleDateString('sv-SE')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
