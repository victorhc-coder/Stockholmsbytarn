/**
 * Geocode a street address using the Nominatim OpenStreetMap API.
 * Free, no API key required. Max 1 req/s — fine for single form submissions.
 *
 * Returns { lat, lng } on success, null on failure.
 * Always fails gracefully so the listing is still saved even if geocoding fails.
 */
export async function geocodeAddress(
  address: string,
): Promise<{ lat: number; lng: number } | null> {
  try {
    // Append Stockholm context when not already present, improves accuracy
    const query = /stockholm/i.test(address)
      ? address
      : `${address}, Stockholm, Sverige`

    const url = new URL('https://nominatim.openstreetmap.org/search')
    url.searchParams.set('q', query)
    url.searchParams.set('format', 'json')
    url.searchParams.set('limit', '1')
    url.searchParams.set('countrycodes', 'se')

    const res = await fetch(url.toString(), {
      headers: { 'Accept-Language': 'sv' },
    })

    if (!res.ok) return null

    const data = await res.json()
    if (Array.isArray(data) && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      }
    }
  } catch (e) {
    // Network error, ad-blocker, etc. — log but don't block the form save
    console.warn('Geocoding failed:', e)
  }
  return null
}
