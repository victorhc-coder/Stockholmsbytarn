'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { STADSDELAR, type Stadsdel } from '@/lib/types'

export default function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [query, setQuery]       = useState(searchParams.get('q') ?? '')
  const [stadsdel, setStadsdel] = useState(searchParams.get('stadsdel') ?? '')
  const [roomsMin, setRoomsMin] = useState(searchParams.get('rum_min') ?? '')
  const [rentMax, setRentMax]   = useState(searchParams.get('hyra_max') ?? '')

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams()
    if (query)    params.set('q', query)
    if (stadsdel) params.set('stadsdel', stadsdel)
    if (roomsMin) params.set('rum_min', roomsMin)
    if (rentMax)  params.set('hyra_max', rentMax)
    router.push(`/annonser?${params.toString()}`)
  }, [query, stadsdel, roomsMin, rentMax, router])

  const clearFilters = () => {
    setQuery(''); setStadsdel(''); setRoomsMin(''); setRentMax('')
    router.push('/annonser')
  }

  const hasFilters = query || stadsdel || roomsMin || rentMax

  return (
    <div className="bg-white rounded-3xl shadow-card p-5">
      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Sök på adress, stadsdel..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && applyFilters()}
          className="input pl-10"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Stadsdel */}
        <div>
          <label className="label">Stadsdel</label>
          <select
            value={stadsdel}
            onChange={e => setStadsdel(e.target.value)}
            className="input"
          >
            <option value="">Alla stadsdelar</option>
            {STADSDELAR.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Rum */}
        <div>
          <label className="label">Minst antal rum</label>
          <select
            value={roomsMin}
            onChange={e => setRoomsMin(e.target.value)}
            className="input"
          >
            <option value="">Alla</option>
            {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(r => (
              <option key={r} value={r}>{r} rum</option>
            ))}
          </select>
        </div>

        {/* Hyra */}
        <div>
          <label className="label">Max hyra (kr/mån)</label>
          <select
            value={rentMax}
            onChange={e => setRentMax(e.target.value)}
            className="input"
          >
            <option value="">Ingen gräns</option>
            {[5000, 7000, 9000, 11000, 13000, 15000, 20000].map(r => (
              <option key={r} value={r}>{r.toLocaleString('sv-SE')} kr</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={applyFilters} className="btn-primary flex-1">
          Sök
        </button>
        {hasFilters && (
          <button onClick={clearFilters} className="btn-secondary">
            Rensa
          </button>
        )}
      </div>
    </div>
  )
}
