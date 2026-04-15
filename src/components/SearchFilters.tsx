'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { STADSDELAR } from '@/lib/types'

const FLOOR_OPTIONS = [
  { value: '1-3',  label: 'Våning 1–3' },
  { value: '4-6',  label: 'Våning 4–6' },
  { value: '7+',   label: 'Våning 7+' },
]

const SORT_OPTIONS = [
  { value: 'nyast',      label: 'Nyast' },
  { value: 'lagst_hyra', label: 'Lägst hyra' },
  { value: 'hogst_hyra', label: 'Högst hyra' },
  { value: 'storst',     label: 'Störst' },
  { value: 'minst',      label: 'Minst' },
]

export default function SearchFilters() {
  const router = useRouter()
  const sp = useSearchParams()

  // Basic filters
  const [query,    setQuery]    = useState(sp.get('q')        ?? '')
  const [stadsdel, setStadsdel] = useState(sp.get('stadsdel') ?? '')
  const [roomsMin, setRoomsMin] = useState(sp.get('rum_min')  ?? '')
  const [rentMax,  setRentMax]  = useState(sp.get('hyra_max') ?? '')
  const [sort,     setSort]     = useState(sp.get('sort')     ?? '')

  // Extra filters
  const [floor,      setFloor]      = useState(sp.get('vagning')  ?? '')
  const [balcony,    setBalcony]    = useState(sp.get('balkong')  ?? '')
  const [elevator,   setElevator]   = useState(sp.get('hiss')     ?? '')
  const [pets,       setPets]       = useState(sp.get('husdjur')  ?? '')

  const [showExtra, setShowExtra] = useState(
    !!(sp.get('vagning') || sp.get('balkong') || sp.get('hiss') || sp.get('husdjur'))
  )

  const extraCount = [floor, balcony, elevator, pets].filter(Boolean).length

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams()
    if (query)    params.set('q',        query)
    if (stadsdel) params.set('stadsdel', stadsdel)
    if (roomsMin) params.set('rum_min',  roomsMin)
    if (rentMax)  params.set('hyra_max', rentMax)
    if (sort)     params.set('sort',     sort)
    if (floor)    params.set('vagning',  floor)
    if (balcony)  params.set('balkong',  balcony)
    if (elevator) params.set('hiss',     elevator)
    if (pets)     params.set('husdjur',  pets)
    router.push(`/annonser?${params.toString()}`)
  }, [query, stadsdel, roomsMin, rentMax, sort, floor, balcony, elevator, pets, router])

  const clearFilters = () => {
    setQuery(''); setStadsdel(''); setRoomsMin(''); setRentMax(''); setSort('')
    setFloor(''); setBalcony(''); setElevator(''); setPets('')
    router.push('/annonser')
  }

  const hasAnyFilter = query || stadsdel || roomsMin || rentMax || sort ||
                       floor || balcony || elevator || pets

  return (
    <div className="bg-white rounded-3xl shadow-card p-5">
      {/* Search bar */}
      <div className="relative mb-4">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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

      {/* Primary filters row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        <div>
          <label className="label">Stadsdel</label>
          <select value={stadsdel} onChange={e => setStadsdel(e.target.value)} className="input">
            <option value="">Alla</option>
            {STADSDELAR.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Minst rum</label>
          <select value={roomsMin} onChange={e => setRoomsMin(e.target.value)} className="input">
            <option value="">Alla</option>
            {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(r => (
              <option key={r} value={r}>{r} rum</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Max hyra</label>
          <select value={rentMax} onChange={e => setRentMax(e.target.value)} className="input">
            <option value="">Ingen gräns</option>
            {[5000, 7000, 9000, 11000, 13000, 15000, 20000].map(r => (
              <option key={r} value={r}>{r.toLocaleString('sv-SE')} kr</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Sortering</label>
          <select value={sort} onChange={e => setSort(e.target.value)} className="input">
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Extra filters toggle */}
      <button
        type="button"
        onClick={() => setShowExtra(v => !v)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 transition-colors mb-3"
      >
        <svg
          className={`w-4 h-4 transition-transform ${showExtra ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        Fler filter
        {extraCount > 0 && (
          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full
                           bg-brand-500 text-white text-[10px] font-bold leading-none">
            {extraCount}
          </span>
        )}
      </button>

      {/* Extra filters panel */}
      {showExtra && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3 pt-1">
          <div>
            <label className="label">Våning</label>
            <select value={floor} onChange={e => setFloor(e.target.value)} className="input">
              <option value="">Alla</option>
              {FLOOR_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Balkong</label>
            <select value={balcony} onChange={e => setBalcony(e.target.value)} className="input">
              <option value="">Spelar ingen roll</option>
              <option value="ja">Ja</option>
              <option value="nej">Nej</option>
            </select>
          </div>

          <div>
            <label className="label">Hiss</label>
            <select value={elevator} onChange={e => setElevator(e.target.value)} className="input">
              <option value="">Spelar ingen roll</option>
              <option value="ja">Ja</option>
              <option value="nej">Nej</option>
            </select>
          </div>

          <div>
            <label className="label">Husdjur tillåtet</label>
            <select value={pets} onChange={e => setPets(e.target.value)} className="input">
              <option value="">Spelar ingen roll</option>
              <option value="ja">Ja</option>
              <option value="nej">Nej</option>
            </select>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button onClick={applyFilters} className="btn-primary flex-1">
          Sök
        </button>
        {hasAnyFilter && (
          <button onClick={clearFilters} className="btn-secondary">
            Rensa
          </button>
        )}
      </div>
    </div>
  )
}
