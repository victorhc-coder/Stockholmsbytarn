import { createClient } from '@/lib/supabase/server'
import AnnonserLayout, { type FilterState } from './AnnonserLayout'
import type { Listing, Stadsdel } from '@/lib/types'

interface SearchParams {
  q?:        string
  stadsdel?: string
  rum_min?:  string
  hyra_max?: string
  sort?:     string
  vagning?:  string
  balkong?:  string
  hiss?:     string
  husdjur?:  string
}

async function getListings(f: SearchParams): Promise<Listing[]> {
  const supabase = await createClient()

  type Col = 'created_at' | 'monthly_rent' | 'size_sqm'
  const sortMap: Record<string, { col: Col; asc: boolean }> = {
    nyast:      { col: 'created_at',   asc: false },
    lagst_hyra: { col: 'monthly_rent', asc: true  },
    hogst_hyra: { col: 'monthly_rent', asc: false },
    storst:     { col: 'size_sqm',     asc: false },
    minst:      { col: 'size_sqm',     asc: true  },
  }
  const { col, asc } = sortMap[f.sort ?? ''] ?? sortMap.nyast

  let q = supabase
    .from('listings')
    .select('*, profiles(name, avatar_url)')
    .eq('status', 'active')
    .order(col, { ascending: asc })

  if (f.stadsdel) q = q.eq('stadsdel', f.stadsdel as Stadsdel)
  if (f.rum_min)  q = q.gte('rooms', parseFloat(f.rum_min))
  if (f.hyra_max) q = q.lte('monthly_rent', parseInt(f.hyra_max))
  if (f.q) {
    q = q.or(
      `title.ilike.%${f.q}%,address.ilike.%${f.q}%,description.ilike.%${f.q}%`
    )
  }
  if (f.vagning === '1-3') q = q.gte('floor', 1).lte('floor', 3)
  if (f.vagning === '4-6') q = q.gte('floor', 4).lte('floor', 6)
  if (f.vagning === '7+')  q = q.gte('floor', 7)

  if (f.balkong === 'ja')  q = q.eq('balcony', true)
  if (f.balkong === 'nej') q = q.eq('balcony', false)
  if (f.hiss    === 'ja')  q = q.eq('elevator', true)
  if (f.hiss    === 'nej') q = q.eq('elevator', false)
  if (f.husdjur === 'ja')  q = q.eq('pets_allowed', true)
  if (f.husdjur === 'nej') q = q.eq('pets_allowed', false)

  const { data } = await q.limit(100)
  return (data ?? []) as Listing[]
}

export default async function AnnonserPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const listings = await getListings(sp)

  const initialFilters: FilterState = {
    q:        sp.q        ?? '',
    stadsdel: sp.stadsdel ?? '',
    rum_min:  sp.rum_min  ?? '',
    hyra_max: sp.hyra_max ?? '',
    sort:     sp.sort     ?? '',
    vagning:  sp.vagning  ?? '',
    balkong:  sp.balkong  ?? '',
    hiss:     sp.hiss     ?? '',
    husdjur:  sp.husdjur  ?? '',
  }

  return <AnnonserLayout listings={listings} initialFilters={initialFilters} />
}
