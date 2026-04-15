'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import ImageUpload from '@/components/ImageUpload'
import { STADSDELAR, ROOMS_OPTIONS, type Stadsdel } from '@/lib/types'
import { geocodeAddress } from '@/lib/geocode'
import type { User } from '@supabase/supabase-js'

interface FormData {
  title: string
  address: string
  stadsdel: Stadsdel | ''
  size_sqm: string
  rooms: string
  monthly_rent: string
  floor: string
  total_floors: string
  description: string
  floor_plan: string
  wants_desc: string
  move_in_date: string
  images: string[]
  balcony: '' | 'true' | 'false'
  elevator: '' | 'true' | 'false'
  pets_allowed: '' | 'true' | 'false'
}

const INITIAL: FormData = {
  title: '', address: '', stadsdel: '', size_sqm: '', rooms: '',
  monthly_rent: '', floor: '', total_floors: '', description: '',
  floor_plan: '', wants_desc: '', move_in_date: '', images: [],
  balcony: '', elevator: '', pets_allowed: '',
}

export default function LaggUppPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [form, setForm] = useState<FormData>(INITIAL)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/logga-in?redirect=/lagg-upp')
      else setUser(data.user)
    })
  }, [])

  const set = (field: keyof FormData, value: string | string[]) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    // Validering
    const required: (keyof FormData)[] = ['title', 'address', 'stadsdel', 'size_sqm', 'rooms', 'monthly_rent', 'description']
    for (const field of required) {
      if (!form[field]) {
        toast.error('Fyll i alla obligatoriska fält')
        return
      }
    }

    setSaving(true)

    // Geocode the address — fail gracefully if it doesn't work
    const coords = await geocodeAddress(form.address.trim())

    const { data, error } = await supabase.from('listings').insert({
      user_id: user.id,
      title: form.title.trim(),
      address: form.address.trim(),
      stadsdel: form.stadsdel,
      size_sqm: parseInt(form.size_sqm),
      rooms: parseFloat(form.rooms),
      monthly_rent: parseInt(form.monthly_rent),
      floor: form.floor ? parseInt(form.floor) : null,
      total_floors: form.total_floors ? parseInt(form.total_floors) : null,
      description: form.description.trim(),
      floor_plan: form.floor_plan.trim() || null,
      wants_desc: form.wants_desc.trim() || null,
      move_in_date: form.move_in_date || null,
      images: form.images,
      balcony:      form.balcony      === '' ? null : form.balcony      === 'true',
      elevator:     form.elevator     === '' ? null : form.elevator     === 'true',
      pets_allowed: form.pets_allowed === '' ? null : form.pets_allowed === 'true',
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
      status: 'active',
    }).select().single()

    setSaving(false)
    if (error) {
      toast.error('Kunde inte spara annonsen. Försök igen.')
      console.error(error)
    } else {
      toast.success('Annonsen är publicerad!')
      router.push(`/annonser/${data.id}`)
    }
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="section-title mb-1">Lägg upp annons</h1>
        <p className="text-gray-500">Berätta om din lägenhet och vad du söker i ett byte</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Om lägenheten */}
        <section className="bg-white rounded-3xl shadow-card p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Om lägenheten</h2>
          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="title">Rubrik *</label>
              <input id="title" type="text" value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="T.ex. Ljus 2:a på Södermalm"
                className="input" required />
            </div>

            <div>
              <label className="label" htmlFor="address">Adress *</label>
              <input id="address" type="text" value={form.address}
                onChange={e => set('address', e.target.value)}
                placeholder="Gatugatan 1, Stockholm"
                className="input" required />
              <p className="text-xs text-gray-400 mt-1.5">
                Adressen används för att placera din annons på rätt plats på kartan.
              </p>
            </div>

            <div>
              <label className="label" htmlFor="stadsdel">Stadsdel *</label>
              <select id="stadsdel" value={form.stadsdel}
                onChange={e => set('stadsdel', e.target.value)}
                className="input" required>
                <option value="">Välj stadsdel</option>
                {STADSDELAR.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="size_sqm">Storlek (m²) *</label>
                <input id="size_sqm" type="number" min="10" max="500" value={form.size_sqm}
                  onChange={e => set('size_sqm', e.target.value)}
                  placeholder="55"
                  className="input" required />
              </div>
              <div>
                <label className="label" htmlFor="rooms">Antal rum *</label>
                <select id="rooms" value={form.rooms}
                  onChange={e => set('rooms', e.target.value)}
                  className="input" required>
                  <option value="">Välj</option>
                  {ROOMS_OPTIONS.map(r => <option key={r} value={r}>{r} rum</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="label" htmlFor="monthly_rent">Hyra kr/mån *</label>
                <input id="monthly_rent" type="number" min="1000" max="100000" value={form.monthly_rent}
                  onChange={e => set('monthly_rent', e.target.value)}
                  placeholder="8500"
                  className="input" required />
              </div>
              <div>
                <label className="label" htmlFor="floor">Våning</label>
                <input id="floor" type="number" min="0" max="50" value={form.floor}
                  onChange={e => set('floor', e.target.value)}
                  placeholder="3"
                  className="input" />
              </div>
              <div>
                <label className="label" htmlFor="total_floors">Av totalt</label>
                <input id="total_floors" type="number" min="1" max="50" value={form.total_floors}
                  onChange={e => set('total_floors', e.target.value)}
                  placeholder="6"
                  className="input" />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="move_in_date">Inflyttningsdatum</label>
              <input id="move_in_date" type="date" value={form.move_in_date}
                onChange={e => set('move_in_date', e.target.value)}
                className="input" />
            </div>
          </div>
        </section>

        {/* Faciliteter */}
        <section className="bg-white rounded-3xl shadow-card p-6">
          <h2 className="font-semibold text-gray-900 mb-1">Faciliteter</h2>
          <p className="text-sm text-gray-500 mb-5">Lämna tomt om du är osäker — det går att uppdatera senare.</p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="label">Balkong</label>
              <select value={form.balcony} onChange={e => set('balcony', e.target.value as FormData['balcony'])} className="input">
                <option value="">Ej angivet</option>
                <option value="true">Ja</option>
                <option value="false">Nej</option>
              </select>
            </div>
            <div>
              <label className="label">Hiss</label>
              <select value={form.elevator} onChange={e => set('elevator', e.target.value as FormData['elevator'])} className="input">
                <option value="">Ej angivet</option>
                <option value="true">Ja</option>
                <option value="false">Nej</option>
              </select>
            </div>
            <div>
              <label className="label">Husdjur tillåtet</label>
              <select value={form.pets_allowed} onChange={e => set('pets_allowed', e.target.value as FormData['pets_allowed'])} className="input">
                <option value="">Ej angivet</option>
                <option value="true">Ja</option>
                <option value="false">Nej</option>
              </select>
            </div>
          </div>
        </section>

        {/* Beskrivning */}
        <section className="bg-white rounded-3xl shadow-card p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Beskrivning</h2>
          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="description">Om lägenheten *</label>
              <textarea id="description" rows={5} value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Berätta om lägenhetens skick, läge, utsikt, renovering..."
                className="input resize-none" required />
            </div>

            <div>
              <label className="label" htmlFor="floor_plan">Planlösning</label>
              <textarea id="floor_plan" rows={3} value={form.floor_plan}
                onChange={e => set('floor_plan', e.target.value)}
                placeholder="T.ex. Öppen planlösning med samlat kök/vardagsrum, 2 sovrum, hall med garderob..."
                className="input resize-none" />
            </div>

            <div>
              <label className="label" htmlFor="wants_desc">Vad söker du i byte?</label>
              <textarea id="wants_desc" rows={3} value={form.wants_desc}
                onChange={e => set('wants_desc', e.target.value)}
                placeholder="T.ex. Söker 3:a på Östermalm eller Vasastan, max 11 000 kr/mån..."
                className="input resize-none" />
            </div>
          </div>
        </section>

        {/* Bilder */}
        <section className="bg-white rounded-3xl shadow-card p-6">
          <h2 className="font-semibold text-gray-900 mb-1">Bilder</h2>
          <p className="text-sm text-gray-500 mb-4">Lägg till upp till 8 bilder. Den första blir omslagsbilden.</p>
          <ImageUpload
            userId={user.id}
            images={form.images}
            onChange={imgs => set('images', imgs)}
          />
        </section>

        {/* Submit */}
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary flex-1 py-3.5 disabled:opacity-50">
            {saving ? (
              <span className="flex items-center gap-2 justify-center">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Publicerar...
              </span>
            ) : (
              'Publicera annons'
            )}
          </button>
          <Link href="/annonser" className="btn-secondary py-3.5 px-5">Avbryt</Link>
        </div>
      </form>
    </div>
  )
}
