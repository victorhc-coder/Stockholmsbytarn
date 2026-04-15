'use client'

import dynamic from 'next/dynamic'
import type { Listing } from '@/lib/types'

// Leaflet can only run in the browser
const LeafletMap = dynamic(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-3xl">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-brand-300 border-t-brand-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-400">Laddar karta…</p>
      </div>
    </div>
  ),
})

interface MapViewProps {
  listings: Listing[]
}

export default function MapView({ listings }: MapViewProps) {
  return <LeafletMap listings={listings} />
}
