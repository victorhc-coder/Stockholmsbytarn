export type Stadsdel =
  | 'Södermalm' | 'Östermalm' | 'Kungsholmen' | 'Vasastan' | 'Norrmalm'
  | 'Gamla Stan' | 'Lidingö' | 'Nacka' | 'Solna' | 'Sundbyberg' | 'Bromma'
  | 'Hägersten' | 'Skarpnäck' | 'Farsta' | 'Enskede' | 'Spånga'
  | 'Hässelby' | 'Vällingby' | 'Övrigt'

export type ListingStatus = 'active' | 'paused' | 'swapped' | 'deleted'

export interface Profile {
  id: string
  email: string
  name: string | null
  phone: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Listing {
  id: string
  user_id: string
  title: string
  description: string
  address: string
  stadsdel: Stadsdel
  floor: number | null
  total_floors: number | null
  size_sqm: number
  rooms: number
  monthly_rent: number
  floor_plan: string | null
  move_in_date: string | null
  wants_desc: string | null
  images: string[]
  status: ListingStatus
  views: number
  lat: number | null
  lng: number | null
  created_at: string
  updated_at: string
  profiles?: Profile
}

export interface SavedListing {
  id: string
  user_id: string
  listing_id: string
  created_at: string
  listings?: Listing
}

export interface Message {
  id: string
  listing_id: string
  sender_id: string
  receiver_id: string
  body: string
  read_at: string | null
  created_at: string
  sender?: Profile
  receiver?: Profile
}

export interface SearchFilters {
  stadsdel?: Stadsdel | ''
  rooms_min?: number
  rooms_max?: number
  rent_min?: number
  rent_max?: number
  query?: string
}

export const STADSDELAR: Stadsdel[] = [
  'Södermalm', 'Östermalm', 'Kungsholmen', 'Vasastan', 'Norrmalm',
  'Gamla Stan', 'Lidingö', 'Nacka', 'Solna', 'Sundbyberg', 'Bromma',
  'Hägersten', 'Skarpnäck', 'Farsta', 'Enskede', 'Spånga',
  'Hässelby', 'Vällingby', 'Övrigt',
]

export const ROOMS_OPTIONS = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
