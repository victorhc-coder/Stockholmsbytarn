'use client'

import dynamic from 'next/dynamic'
import type { Listing } from '@/lib/types'

const HomeLeafletMap = dynamic(() => import('./HomeLeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-50 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-300 border-t-brand-600 rounded-full animate-spin" />
    </div>
  ),
})

export default function HomeMap({ listings }: { listings: Listing[] }) {
  return <HomeLeafletMap listings={listings} />
}
