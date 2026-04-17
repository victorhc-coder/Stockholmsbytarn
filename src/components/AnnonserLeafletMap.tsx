'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import type { Listing, Stadsdel } from '@/lib/types'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// ── Marker icons ──────────────────────────────────────────────────────────────

function makePinIcon(fill: string, size: [number, number]) {
  const [w, h] = size
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 40" width="${w}" height="${h}">
    <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 26 14 26S28 24.5 28 14C28 6.27 21.73 0 14 0z"
          fill="${fill}" stroke="white" stroke-width="2"/>
    <circle cx="14" cy="14" r="5.5" fill="white"/>
  </svg>`
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: size,
    iconAnchor: [w / 2, h],
    popupAnchor: [0, -(h + 4)],
  })
}

const NORMAL_ICON   = makePinIcon('#0066cc', [24, 34])
const HOVERED_ICON  = makePinIcon('#f97316', [32, 46])  // orange, larger
const APPROX_ICON   = makePinIcon('#9ca3af', [22, 32])

// ── Stadsdel fallback coords ──────────────────────────────────────────────────

const STADSDEL_COORDS: Record<Stadsdel, [number, number]> = {
  'Södermalm':   [59.3151, 18.0649],
  'Östermalm':   [59.3398, 18.0930],
  'Kungsholmen': [59.3324, 18.0182],
  'Vasastan':    [59.3453, 18.0579],
  'Norrmalm':    [59.3348, 18.0616],
  'Gamla Stan':  [59.3233, 18.0706],
  'Lidingö':     [59.3619, 18.1625],
  'Nacka':       [59.3144, 18.1633],
  'Solna':       [59.3600, 18.0004],
  'Sundbyberg':  [59.3617, 17.9720],
  'Bromma':      [59.3382, 17.9420],
  'Hägersten':   [59.3022, 17.9985],
  'Skarpnäck':   [59.2800, 18.1006],
  'Farsta':      [59.2611, 18.0913],
  'Enskede':     [59.2784, 18.0711],
  'Spånga':      [59.3823, 17.9302],
  'Hässelby':    [59.3630, 17.8375],
  'Vällingby':   [59.3630, 17.8753],
  'Övrigt':      [59.3293, 18.0686],
}

function getJitter(id: string): [number, number] {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  return [((hash % 100) - 50) * 0.0003, (((hash >> 8) % 100) - 50) * 0.0004]
}

function listingPosition(listing: Listing): [number, number] {
  if (listing.lat != null && listing.lng != null) {
    return [listing.lat, listing.lng]
  }
  const base = STADSDEL_COORDS[listing.stadsdel] ?? STADSDEL_COORDS['Övrigt']
  const [jLat, jLng] = getJitter(listing.id)
  return [base[0] + jLat, base[1] + jLng]
}

// ── Fly to highlighted listing ────────────────────────────────────────────────

function MapFocus({ listings, hoveredId }: { listings: Listing[]; hoveredId: string | null }) {
  const map = useMap()
  const prevId = useRef<string | null>(null)

  useEffect(() => {
    if (!hoveredId || hoveredId === prevId.current) return
    prevId.current = hoveredId
    const listing = listings.find(l => l.id === hoveredId)
    if (listing) {
      const [lat, lng] = listingPosition(listing)
      map.panTo([lat, lng], { animate: true, duration: 0.4 })
    }
  }, [hoveredId, listings, map])

  return null
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  listings: Listing[]
  hoveredId: string | null
}

export default function AnnonserLeafletMap({ listings, hoveredId }: Props) {
  return (
    <MapContainer
      center={[59.3293, 18.0686]}
      zoom={12}
      scrollWheelZoom
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
    >
      {/* CartoDB light tiles — clean, minimal */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={20}
      />

      <MapFocus listings={listings} hoveredId={hoveredId} />

      {listings.map(listing => {
        const isHovered = listing.id === hoveredId
        const hasExact  = listing.lat != null && listing.lng != null
        const position  = listingPosition(listing)
        const icon      = isHovered ? HOVERED_ICON : hasExact ? NORMAL_ICON : APPROX_ICON

        return (
          <Marker
            key={listing.id}
            position={position}
            icon={icon}
            zIndexOffset={isHovered ? 1000 : 0}
          >
            <Popup maxWidth={240} closeButton={false}>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13 }}>
                {listing.images?.[0] && (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    style={{ width: '100%', height: 110, objectFit: 'cover',
                             borderRadius: 8, marginBottom: 8, display: 'block' }}
                  />
                )}
                <div style={{ fontWeight: 700, color: '#111827', marginBottom: 2 }}>
                  {listing.title}
                </div>
                <div style={{ color: '#6b7280', fontSize: 12, marginBottom: 1 }}>
                  {listing.stadsdel}
                </div>
                <div style={{ color: '#6b7280', fontSize: 12, marginBottom: 6 }}>
                  {listing.rooms} rum &middot; {listing.size_sqm}&thinsp;m²
                </div>
                <div style={{ color: '#0066cc', fontWeight: 700, fontSize: 14, marginBottom: 10 }}>
                  {listing.monthly_rent.toLocaleString('sv-SE')}&nbsp;kr/mån
                </div>
                <a
                  href={`/annonser/${listing.id}`}
                  style={{ display: 'inline-block', background: '#0066cc', color: 'white',
                           borderRadius: 8, padding: '6px 14px', fontSize: 12, fontWeight: 600,
                           textDecoration: 'none' }}
                >
                  Visa annons →
                </a>
                {!hasExact && (
                  <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 8 }}>
                    Ungefärlig position
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
