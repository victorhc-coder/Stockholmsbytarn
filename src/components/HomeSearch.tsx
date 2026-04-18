'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { STADSDELAR } from '@/lib/types'

export default function HomeSearch() {
  const router = useRouter()
  const [stadsdel, setStadsdel] = useState('')
  const [rum,      setRum]      = useState('')
  const [hyra,     setHyra]     = useState('')

  const handleSearch = () => {
    const p = new URLSearchParams()
    if (stadsdel) p.set('stadsdel', stadsdel)
    if (rum)      p.set('rum_min',  rum)
    if (hyra)     p.set('hyra_max', hyra)
    router.push(`/annonser?${p.toString()}`)
  }

  return (
    <div className="bg-white rounded-3xl shadow-card p-5 sm:p-6 flex flex-col sm:flex-row gap-4 items-end">
      <div className="flex-1 w-full">
        <label className="label">Stadsdel</label>
        <select
          value={stadsdel}
          onChange={e => setStadsdel(e.target.value)}
          className="input py-3.5 text-base"
        >
          <option value="">Var i Stockholm?</option>
          {STADSDELAR.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="w-full sm:w-40">
        <label className="label">Antal rum</label>
        <select
          value={rum}
          onChange={e => setRum(e.target.value)}
          className="input py-3.5 text-base"
        >
          <option value="">Spelar ingen roll</option>
          {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(r => (
            <option key={r} value={r}>Minst {r} rum</option>
          ))}
        </select>
      </div>

      <div className="w-full sm:w-48">
        <label className="label">Max hyra</label>
        <select
          value={hyra}
          onChange={e => setHyra(e.target.value)}
          className="input py-3.5 text-base"
        >
          <option value="">Ingen gräns</option>
          {[5000, 7000, 9000, 11000, 13000, 15000, 20000].map(r => (
            <option key={r} value={r}>Upp till {r.toLocaleString('sv-SE')} kr</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSearch}
        className="btn-primary w-full sm:w-auto px-7 py-3.5 text-base shrink-0 gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        Sök annonser
      </button>
    </div>
  )
}
