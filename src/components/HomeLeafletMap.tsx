'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import type { Listing, Stadsdel } from '@/lib/types'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// ── Marker icon ───────────────────────────────────────────────────────────────

const PIN_ICON = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 40" width="24" height="34">
    <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 26 14 26S28 24.5 28 14C28 6.27 21.73 0 14 0z"
          fill="#0066cc" stroke="white" stroke-width="2"/>
    <circle cx="14" cy="14" r="5.5" fill="white"/>
  </svg>`,
  className: '',
  iconSize: [24, 34],
  iconAnchor: [12, 34],
  popupAnchor: [0, -36],
})

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
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return [((h % 100) - 50) * 0.0003, (((h >> 8) % 100) - 50) * 0.0004]
}

function pinPosition(listing: Listing): [number, number] {
  if (listing.lat != null && listing.lng != null) return [listing.lat, listing.lng]
  const base = STADSDEL_COORDS[listing.stadsdel] ?? STADSDEL_COORDS['Övrigt']
  const [jLat, jLng] = getJitter(listing.id)
  return [base[0] + jLat, base[1] + jLng]
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function HomeLeafletMap({ listings }: { listings: Listing[] }) {
  return (
    <MapContainer
      center={[59.328, 18.065]}
      zoom={11}
      scrollWheelZoom={false}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={20}
      />

      {listings.map(listing => (
        <Marker key={listing.id} position={pinPosition(listing)} icon={PIN_ICON}>
          <Popup maxWidth={230} closeButton={false}>
            <div style={{ fontFamily: 'system-ui, sans-serif', fontSize: 13 }}>
              {listing.images?.[0] && (
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  style={{ width: '100%', height: 100, objectFit: 'cover',
                           borderRadius: 8, marginBottom: 8, display: 'block' }}
                />
              )}
              <div style={{ fontWeight: 700, color: '#111827', marginBottom: 2 }}>
                {listing.title}
              </div>
              <div style={{ color: '#6b7280', fontSize: 12, marginBottom: 4 }}>
                {listing.rooms} rum &middot; {listing.size_sqm}&thinsp;m²
              </div>
              <div style={{ color: '#0066cc', fontWeight: 700, fontSize: 14, marginBottom: 10 }}>
                {listing.monthly_rent.toLocaleString('sv-SE')}&nbsp;kr/mån
              </div>
              <a
                href={`/annonser/${listing.id}`}
                style={{ display: 'inline-block', background: '#0066cc', color: 'white',
                         borderRadius: 8, padding: '5px 14px', fontSize: 12,
                         fontWeight: 600, textDecoration: 'none' }}
              >
                Visa annons →
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
