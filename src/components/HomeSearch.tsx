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
    <div className="bg-white rounded-3xl shadow-card p-4 flex flex-col sm:flex-row gap-3 items-end">
      <div className="flex-1 min-w-[140px]">
        <label className="label">Stadsdel</label>
        <select
          value={stadsdel}
          onChange={e => setStadsdel(e.target.value)}
          className="input"
        >
          <option value="">Alla stadsdelar</option>
          {STADSDELAR.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="w-full sm:w-36">
        <label className="label">Minst rum</label>
        <select
          value={rum}
          onChange={e => setRum(e.target.value)}
          className="input"
        >
          <option value="">Alla</option>
          {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(r => (
            <option key={r} value={r}>{r} rum</option>
          ))}
        </select>
      </div>

      <div className="w-full sm:w-44">
        <label className="label">Max hyra (kr/mån)</label>
        <select
          value={hyra}
          onChange={e => setHyra(e.target.value)}
          className="input"
        >
          <option value="">Ingen gräns</option>
          {[5000, 7000, 9000, 11000, 13000, 15000, 20000].map(r => (
            <option key={r} value={r}>{r.toLocaleString('sv-SE')} kr</option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSearch}
        className="btn-primary w-full sm:w-auto px-7 py-3 shrink-0"
      >
        Sök annonser
      </button>
    </div>
  )
}
