'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import type { Listing, ListingStatus } from '@/lib/types'
import type { User } from '@supabase/supabase-js'

const STATUS_LABELS: Record<ListingStatus, string> = {
  active:  'Aktiv',
  paused:  'Pausad',
  swapped: 'Bytt',
  deleted: 'Raderad',
}

const STATUS_COLORS: Record<ListingStatus, string> = {
  active:  'bg-green-50 text-green-700',
  paused:  'bg-yellow-50 text-yellow-700',
  swapped: 'bg-blue-50 text-blue-700',
  deleted: 'bg-red-50 text-red-700',
}

function formatRent(rent: number) {
  return new Intl.NumberFormat('sv-SE').format(rent) + ' kr/mån'
}

export default function MinaAnnonserPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push('/logga-in?redirect=/mina-annonser')
        return
      }
      setUser(data.user)
      await loadListings(data.user.id)
    })
  }, [])

  const loadListings = async (userId: string) => {
    setLoading(true)
    const { data } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', userId)
      .neq('status', 'deleted')
      .order('created_at', { ascending: false })

    setListings((data ?? []) as Listing[])
    setLoading(false)
  }

  const updateStatus = async (id: string, status: ListingStatus) => {
    const { error } = await supabase
      .from('listings')
      .update({ status })
      .eq('id', id)

    if (error) {
      toast.error('Kunde inte uppdatera annonsen')
    } else {
      toast.success(status === 'deleted' ? 'Annonsen raderades' : 'Status uppdaterad')
      setListings(prev =>
        status === 'deleted'
          ? prev.filter(l => l.id !== id)
          : prev.map(l => l.id === id ? { ...l, status } : l)
      )
    }
  }

  const handleDelete = (id: string) => {
    if (!confirm('Är du säker på att du vill radera annonsen?')) return
    updateStatus(id, 'deleted')
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="section-title mb-1">Mina annonser</h1>
          <p className="text-gray-500">{listings.length} {listings.length === 1 ? 'annons' : 'annonser'}</p>
        </div>
        <Link href="/lagg-upp" className="btn-primary">
          + Ny annons
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-card p-10 text-center">
          <div className="w-16 h-16 rounded-3xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 21V12h6v9" />
            </svg>
          </div>
          <h2 className="font-serif text-xl text-gray-900 mb-2">Du har inga annonser ännu</h2>
          <p className="text-gray-500 text-sm mb-5">Lägg upp din lägenhet och börja söka byte!</p>
          <Link href="/lagg-upp" className="btn-primary">
            Lägg upp din första annons
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map(listing => (
            <div key={listing.id} className="bg-white rounded-3xl shadow-card overflow-hidden">
              <div className="flex gap-4 p-4">
                {/* Thumbnail */}
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
                  {listing.images?.[0] ? (
                    <Image
                      src={listing.images[0]}
                      alt={listing.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-brand-50">
                      <svg className="w-8 h-8 text-brand-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/annonser/${listing.id}`}
                        className="font-semibold text-gray-900 hover:text-brand-600 transition-colors line-clamp-1"
                      >
                        {listing.title}
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5">{listing.stadsdel} · {listing.rooms} rum · {formatRent(listing.monthly_rent)}</p>
                    </div>
                    <span className={`badge flex-shrink-0 ${STATUS_COLORS[listing.status]}`}>
                      {STATUS_LABELS[listing.status]}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 mt-2">
                    {listing.views} visningar · {new Date(listing.created_at).toLocaleDateString('sv-SE')}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Link href={`/annonser/${listing.id}`} className="btn-ghost text-xs py-1.5 px-3">
                      Visa
                    </Link>
                    {listing.status === 'active' ? (
                      <button
                        onClick={() => updateStatus(listing.id, 'paused')}
                        className="btn-ghost text-xs py-1.5 px-3"
                      >
                        Pausa
                      </button>
                    ) : listing.status === 'paused' ? (
                      <button
                        onClick={() => updateStatus(listing.id, 'active')}
                        className="btn-ghost text-xs py-1.5 px-3"
                      >
                        Aktivera
                      </button>
                    ) : null}
                    <button
                      onClick={() => updateStatus(listing.id, 'swapped')}
                      className="btn-ghost text-xs py-1.5 px-3 text-blue-600"
                    >
                      Markera som bytt
                    </button>
                    <button
                      onClick={() => handleDelete(listing.id)}
                      className="btn-ghost text-xs py-1.5 px-3 text-red-500 hover:bg-red-50"
                    >
                      Radera
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
