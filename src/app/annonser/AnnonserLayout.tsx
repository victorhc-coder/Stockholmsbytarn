'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { STADSDELAR } from '@/lib/types'
import type { Listing } from '@/lib/types'

// Leaflet must be loaded client-side only
const AnnonserMap = dynamic(() => import('@/components/AnnonserLeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-50 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-300 border-t-brand-600 rounded-full animate-spin" />
    </div>
  ),
})

// ── Types ─────────────────────────────────────────────────────────────────────

export interface FilterState {
  q:        string
  stadsdel: string
  rum_min:  string
  hyra_max: string
  sort:     string
  vagning:  string
  balkong:  string
  hiss:     string
  husdjur:  string
}

interface Props {
  listings: Listing[]
  initialFilters: FilterState
}

// ── Layout component ──────────────────────────────────────────────────────────

export default function AnnonserLayout({ listings, initialFilters }: Props) {
  const router = useRouter()
  const [hoveredId,   setHoveredId]   = useState<string | null>(null)
  const [mobileView,  setMobileView]  = useState<'list' | 'map'>('list')
  const [showExtra,   setShowExtra]   = useState(
    !!(initialFilters.vagning || initialFilters.balkong ||
       initialFilters.hiss    || initialFilters.husdjur)
  )
  const [filters, setFilters] = useState<FilterState>(initialFilters)

  // Build URL and navigate
  const applyFilters = useCallback((f: FilterState) => {
    const p = new URLSearchParams()
    if (f.q)        p.set('q',        f.q)
    if (f.stadsdel) p.set('stadsdel', f.stadsdel)
    if (f.rum_min)  p.set('rum_min',  f.rum_min)
    if (f.hyra_max) p.set('hyra_max', f.hyra_max)
    if (f.sort)     p.set('sort',     f.sort)
    if (f.vagning)  p.set('vagning',  f.vagning)
    if (f.balkong)  p.set('balkong',  f.balkong)
    if (f.hiss)     p.set('hiss',     f.hiss)
    if (f.husdjur)  p.set('husdjur',  f.husdjur)
    router.push(`/annonser?${p.toString()}`)
  }, [router])

  // Dropdowns apply immediately; text search waits for Enter
  const update = (key: keyof FilterState, value: string) => {
    const updated = { ...filters, [key]: value }
    setFilters(updated)
    if (key !== 'q') applyFilters(updated)
  }

  const clearFilters = () => {
    const empty: FilterState = {
      q: '', stadsdel: '', rum_min: '', hyra_max: '', sort: '',
      vagning: '', balkong: '', hiss: '', husdjur: '',
    }
    setFilters(empty)
    router.push('/annonser')
  }

  const extraCount = [filters.vagning, filters.balkong, filters.hiss, filters.husdjur].filter(Boolean).length
  const hasFilters  = Object.values(filters).some(Boolean)

  const selectCls = 'input py-1.5 text-xs'

  return (
    // Full-height container, split horizontally on desktop
    <div className="flex flex-col md:flex-row" style={{ height: 'calc(100vh - 4rem)' }}>

      {/* ── Mobile toggle bar ── */}
      <div className="md:hidden flex shrink-0 border-b border-gray-100 bg-white z-10">
        {(['list', 'map'] as const).map(v => (
          <button
            key={v}
            onClick={() => setMobileView(v)}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors
              ${mobileView === v
                ? 'text-brand-600 border-b-2 border-brand-500'
                : 'text-gray-400 hover:text-gray-600'}`}
          >
            {v === 'list' ? `Lista (${listings.length})` : 'Karta'}
          </button>
        ))}
      </div>

      {/* ── Left panel: filters + listing list ── */}
      <div
        className={`
          md:w-[40%] flex flex-col bg-white border-r border-gray-100
          md:flex
          ${mobileView === 'map' ? 'hidden' : 'flex flex-1'}
        `}
      >
        {/* Compact filter bar */}
        <div className="p-3 border-b border-gray-100 shrink-0 space-y-2">

          {/* Text search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Sök adress, stadsdel..."
              value={filters.q}
              onChange={e => setFilters(f => ({ ...f, q: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && applyFilters(filters)}
              className="input py-2 pl-9 text-sm"
            />
          </div>

          {/* Primary selects */}
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            <select value={filters.stadsdel} onChange={e => update('stadsdel', e.target.value)}
                    className={selectCls}>
              <option value="">Alla stadsdelar</option>
              {STADSDELAR.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select value={filters.rum_min} onChange={e => update('rum_min', e.target.value)}
                    className={selectCls}>
              <option value="">Alla rum</option>
              {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(r => (
                <option key={r} value={r}>≥ {r} rum</option>
              ))}
            </select>

            <select value={filters.hyra_max} onChange={e => update('hyra_max', e.target.value)}
                    className={selectCls}>
              <option value="">Max hyra</option>
              {[5000,7000,9000,11000,13000,15000,20000].map(r => (
                <option key={r} value={r}>≤ {r.toLocaleString('sv-SE')} kr</option>
              ))}
            </select>

            <select value={filters.sort} onChange={e => update('sort', e.target.value)}
                    className={selectCls}>
              <option value="">Nyast</option>
              <option value="lagst_hyra">Lägst hyra</option>
              <option value="hogst_hyra">Högst hyra</option>
              <option value="storst">Störst</option>
              <option value="minst">Minst</option>
            </select>
          </div>

          {/* Extra filters toggle row */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowExtra(v => !v)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-brand-600 transition-colors"
            >
              <svg className={`w-3.5 h-3.5 transition-transform ${showExtra ? 'rotate-180' : ''}`}
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Fler filter
              {extraCount > 0 && (
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full
                                 bg-brand-500 text-white text-[9px] font-bold leading-none ml-0.5">
                  {extraCount}
                </span>
              )}
            </button>
            {hasFilters && (
              <button onClick={clearFilters}
                      className="text-xs text-gray-400 hover:text-red-500 transition-colors">
                Rensa filter
              </button>
            )}
          </div>

          {/* Extra filter dropdowns */}
          {showExtra && (
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 pt-0.5">
              <select value={filters.vagning} onChange={e => update('vagning', e.target.value)}
                      className={selectCls}>
                <option value="">Våning</option>
                <option value="1-3">1–3</option>
                <option value="4-6">4–6</option>
                <option value="7+">7+</option>
              </select>
              <select value={filters.balkong} onChange={e => update('balkong', e.target.value)}
                      className={selectCls}>
                <option value="">Balkong</option>
                <option value="ja">Ja</option>
                <option value="nej">Nej</option>
              </select>
              <select value={filters.hiss} onChange={e => update('hiss', e.target.value)}
                      className={selectCls}>
                <option value="">Hiss</option>
                <option value="ja">Ja</option>
                <option value="nej">Nej</option>
              </select>
              <select value={filters.husdjur} onChange={e => update('husdjur', e.target.value)}
                      className={selectCls}>
                <option value="">Husdjur</option>
                <option value="ja">Ja</option>
                <option value="nej">Nej</option>
              </select>
            </div>
          )}
        </div>

        {/* Result count */}
        <div className="px-4 py-2 text-xs text-gray-400 shrink-0 bg-gray-50 border-b border-gray-100">
          {listings.length === 0
            ? 'Inga annonser matchar dina filter'
            : `${listings.length} ${listings.length === 1 ? 'annons' : 'annonser'}${hasFilters ? ' med dina filter' : ' i Stockholm'}`}
        </div>

        {/* Scrollable listing list */}
        <div className="flex-1 overflow-y-auto">
          {listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">Inga annonser hittades</p>
              <p className="text-xs text-gray-400">Prova att ändra dina sökfilter</p>
              {hasFilters && (
                <button onClick={clearFilters}
                        className="mt-3 text-xs text-brand-600 hover:underline">
                  Rensa alla filter
                </button>
              )}
            </div>
          ) : (
            listings.map(listing => (
              <CompactCard
                key={listing.id}
                listing={listing}
                isHighlighted={hoveredId === listing.id}
                onHoverEnter={() => setHoveredId(listing.id)}
                onHoverLeave={() => setHoveredId(null)}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Right panel: sticky map ── */}
      <div
        className={`
          md:w-[60%]
          ${mobileView === 'list' ? 'hidden md:block' : 'flex-1'}
        `}
        style={{ height: 'calc(100vh - 4rem)', position: 'sticky', top: '4rem' }}
      >
        <AnnonserMap listings={listings} hoveredId={hoveredId} />
      </div>
    </div>
  )
}

// ── Compact listing card ──────────────────────────────────────────────────────

interface CardProps {
  listing: Listing
  isHighlighted: boolean
  onHoverEnter: () => void
  onHoverLeave: () => void
}

function CompactCard({ listing, isHighlighted, onHoverEnter, onHoverLeave }: CardProps) {
  return (
    <Link href={`/annonser/${listing.id}`}>
      <div
        onMouseEnter={onHoverEnter}
        onMouseLeave={onHoverLeave}
        className={`flex gap-3 p-3 border-b border-gray-100 transition-colors cursor-pointer
          ${isHighlighted ? 'bg-brand-50 border-l-2 border-l-brand-400' : 'hover:bg-gray-50'}`}
      >
        {/* Thumbnail */}
        <div className="w-[88px] h-[70px] rounded-xl overflow-hidden shrink-0 bg-gray-100">
          {listing.images?.[0] ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 22V12h6v10" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-900 leading-snug truncate">
            {listing.title}
          </div>
          <div className="text-xs text-gray-400 mt-0.5 truncate">
            {listing.address}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {listing.rooms} rum &middot; {listing.size_sqm} m²
          </div>
          <div className="text-sm font-bold text-brand-600 mt-0.5 leading-tight">
            {listing.monthly_rent.toLocaleString('sv-SE')} kr/mån
          </div>
          {listing.wants_desc && (
            <div className="text-xs text-gray-400 mt-0.5 truncate">
              Söker: {listing.wants_desc}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
