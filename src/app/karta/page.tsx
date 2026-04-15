import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import MapView from '@/components/MapView'
import type { Listing } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Karta – Stockholmsbytarn',
  description: 'Se alla aktiva bytesannonser på karta över Stockholm.',
}

async function getActiveListings(): Promise<Listing[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
  return (data ?? []) as Listing[]
}

export default async function KartaPage() {
  const listings = await getActiveListings()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-3xl md:text-4xl text-gray-900 mb-2">
          Annonser på karta
        </h1>
        <p className="text-gray-500">
          {listings.length === 0
            ? 'Inga aktiva annonser just nu.'
            : `${listings.length} aktiva ${listings.length === 1 ? 'annons' : 'annonser'} i Stockholm — klicka på en pin för att se detaljer.`}
        </p>
      </div>

      {/* Map */}
      <div className="w-full rounded-3xl overflow-hidden shadow-card" style={{ height: '70vh', minHeight: 400 }}>
        <MapView listings={listings} />
      </div>

      {/* Legend */}
      <p className="text-xs text-gray-400 mt-3 text-center">
        Pins visas ungefärligt per stadsdel. Kartdata från{' '}
        <a
          href="https://www.openstreetmap.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-brand-600 underline underline-offset-2"
        >
          OpenStreetMap
        </a>.
      </p>
    </div>
  )
}
