'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import type { Listing, Stadsdel } from '@/lib/types'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// ── Marker icons ──────────────────────────────────────────────────────────────

// Inline SVG pin — avoids webpack/CDN issues with default Leaflet icons
function makePinIcon(fill: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 40" width="28" height="40">
    <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 26 14 26S28 24.5 28 14C28 6.27 21.73 0 14 0z"
          fill="${fill}" stroke="white" stroke-width="2"/>
    <circle cx="14" cy="14" r="5.5" fill="white"/>
  </svg>`
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -42],
  })
}

const EXACT_ICON  = makePinIcon('#0066cc') // exact geocoded address — blue
const APPROX_ICON = makePinIcon('#9ca3af') // approximate stadsdel center — gray

// ── Fallback coordinates per stadsdel ────────────────────────────────────────

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

/** Deterministic jitter so listings in the same stadsdel don't stack exactly. */
function getJitter(id: string): [number, number] {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  return [((hash % 100) - 50) * 0.0003, (((hash >> 8) % 100) - 50) * 0.0004]
}

function formatRent(rent: number) {
  return rent.toLocaleString('sv-SE') + '\u00a0kr/mån'
}

// ── Component ─────────────────────────────────────────────────────────────────

interface LeafletMapProps {
  listings: Listing[]
}

export default function LeafletMap({ listings }: LeafletMapProps) {
  return (
    <MapContainer
      center={[59.3293, 18.0686]}
      zoom={12}
      scrollWheelZoom
      style={{ width: '100%', height: '100%', borderRadius: '1.5rem' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {listings.map(listing => {
        // Use exact geocoded coordinates if available, otherwise fall back to
        // the stadsdel centre with a deterministic jitter to spread pins out.
        const hasExact = listing.lat != null && listing.lng != null
        let position: [number, number]
        if (hasExact) {
          position = [listing.lat as number, listing.lng as number]
        } else {
          const base = STADSDEL_COORDS[listing.stadsdel] ?? STADSDEL_COORDS['Övrigt']
          const [jLat, jLng] = getJitter(listing.id)
          position = [base[0] + jLat, base[1] + jLng]
        }

        return (
          <Marker
            key={listing.id}
            position={position}
            icon={hasExact ? EXACT_ICON : APPROX_ICON}
          >
            <Popup maxWidth={260}>
              <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13 }}>
                {/* Cover image */}
                {listing.images?.[0] && (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    style={{
                      width: '100%', height: 120, objectFit: 'cover',
                      borderRadius: 8, marginBottom: 8, display: 'block',
                    }}
                  />
                )}

                {/* Title */}
                <div style={{ fontWeight: 700, marginBottom: 3, color: '#111827' }}>
                  {listing.title}
                </div>

                {/* Meta */}
                <div style={{ color: '#6b7280', fontSize: 12, marginBottom: 2 }}>
                  {listing.stadsdel}
                </div>
                <div style={{ color: '#6b7280', fontSize: 12, marginBottom: 6 }}>
                  {listing.rooms} rum &middot; {listing.size_sqm}&thinsp;m²
                </div>

                {/* Rent */}
                <div style={{ color: '#0066cc', fontWeight: 700, fontSize: 14, marginBottom: 10 }}>
                  {formatRent(listing.monthly_rent)}
                </div>

                {/* CTA */}
                <a
                  href={`/annonser/${listing.id}`}
                  style={{
                    display: 'inline-block',
                    background: '#0066cc',
                    color: 'white',
                    borderRadius: 8,
                    padding: '6px 14px',
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Visa annons →
                </a>

                {/* Approximate location notice */}
                {!hasExact && (
                  <div style={{ fontSize: 10, color: '#9ca3af', marginTop: 8 }}>
                    Ungefärlig position (stadsdel)
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
