import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import ListingCard from '@/components/ListingCard'
import SearchFilters from '@/components/SearchFilters'
import type { Listing, Stadsdel } from '@/lib/types'

interface SearchParams {
  q?: string
  stadsdel?: string
  rum_min?: string
  hyra_max?: string
}

async function getListings(filters: SearchParams): Promise<Listing[]> {
  const supabase = await createClient()
  let query = supabase
    .from('listings')
    .select('*, profiles(name, avatar_url)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (filters.stadsdel) {
    query = query.eq('stadsdel', filters.stadsdel as Stadsdel)
  }
  if (filters.rum_min) {
    query = query.gte('rooms', parseFloat(filters.rum_min))
  }
  if (filters.hyra_max) {
    query = query.lte('monthly_rent', parseInt(filters.hyra_max))
  }
  if (filters.q) {
    query = query.or(
      `title.ilike.%${filters.q}%,address.ilike.%${filters.q}%,description.ilike.%${filters.q}%`
    )
  }

  const { data } = await query.limit(48)
  return (data ?? []) as Listing[]
}

export default async function AnnonserPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const filters = await searchParams
  const listings = await getListings(filters)
  const hasFilters = filters.q || filters.stadsdel || filters.rum_min || filters.hyra_max

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="section-title mb-1">Bläddra annonser</h1>
        <p className="text-gray-500">
          {listings.length} {listings.length === 1 ? 'annons' : 'annonser'} i Stockholm
          {hasFilters ? ' med dina filter' : ''}
        </p>
      </div>

      <Suspense>
        <SearchFilters />
      </Suspense>

      {listings.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h2 className="font-serif text-xl text-gray-900 mb-2">Inga annonser hittades</h2>
          <p className="text-gray-500 text-sm">
            {hasFilters ? 'Prova att ändra dina sökfilter' : 'Inga aktiva annonser just nu'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {listings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  )
}
