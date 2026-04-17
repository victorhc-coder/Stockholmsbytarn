import Image from 'next/image'
import Link from 'next/link'
import type { Listing } from '@/lib/types'

interface ListingCardProps {
  listing: Listing
}

function formatRent(rent: number) {
  return new Intl.NumberFormat('sv-SE').format(rent) + ' kr/mån'
}

function formatRooms(rooms: number) {
  return rooms % 1 === 0 ? `${rooms} rum` : `${rooms} rum`
}

const PLACEHOLDER_GRADIENTS = [
  'from-blue-100 to-blue-200',
  'from-emerald-100 to-teal-200',
  'from-amber-100 to-amber-200',
  'from-pink-100 to-rose-200',
  'from-teal-100 to-cyan-200',
]

function getGradient(id: string) {
  const hash = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return PLACEHOLDER_GRADIENTS[hash % PLACEHOLDER_GRADIENTS.length]
}

export default function ListingCard({ listing }: ListingCardProps) {
  const firstImage = listing.images?.[0]
  const gradient = getGradient(listing.id)

  return (
    <Link
      href={`/annonser/${listing.id}`}
      className="group block rounded-3xl transition-transform duration-300 hover:-translate-y-1"
    >
      <article className="card h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={listing.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${gradient}`}>
              <svg className="w-12 h-12 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 21V12h6v9" />
              </svg>
            </div>
          )}
          {/* Stadsdel badge */}
          <div className="absolute top-3 left-3">
            <span className="badge bg-white/90 backdrop-blur-sm text-gray-700 shadow-sm">
              {listing.stadsdel}
            </span>
          </div>
          {listing.images?.length > 1 && (
            <div className="absolute bottom-3 right-3">
              <span className="badge bg-black/50 text-white backdrop-blur-sm">
                +{listing.images.length - 1} bilder
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-serif text-lg text-gray-900 leading-snug line-clamp-1 group-hover:text-brand-600 transition-colors">
            {listing.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1 mb-4 line-clamp-1">
            {listing.address}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-3 text-sm text-gray-600 mt-auto">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 8V6a2 2 0 012-2h2M4 16v2a2 2 0 002 2h2m8-16h2a2 2 0 012 2v2m0 8v2a2 2 0 01-2 2h-2" />
              </svg>
              {listing.size_sqm} m²
            </span>
            <span className="text-gray-300">·</span>
            <span>{formatRooms(listing.rooms)}</span>
            <span className="text-gray-300">·</span>
            <span className="ml-auto font-semibold text-gray-900">{formatRent(listing.monthly_rent)}</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
