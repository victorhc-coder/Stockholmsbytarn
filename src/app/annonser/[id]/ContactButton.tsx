'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'
import type { Listing } from '@/lib/types'

export default function ContactButton({ listing }: { listing: Listing }) {
  const router = useRouter()
  const supabase = createClient()
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!message.trim()) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push(`/logga-in?redirect=/annonser/${listing.id}`)
      return
    }

    if (user.id === listing.user_id) {
      toast.error('Du kan inte skicka meddelande till dig själv')
      return
    }

    setSending(true)
    const { error } = await supabase.from('messages').insert({
      listing_id: listing.id,
      sender_id: user.id,
      receiver_id: listing.user_id,
      body: message.trim(),
    })

    setSending(false)
    if (error) {
      toast.error('Kunde inte skicka meddelande. Försök igen.')
    } else {
      toast.success('Meddelande skickat!')
      setMessage('')
      setShowForm(false)
    }
  }

  if (showForm) {
    return (
      <div>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Hej! Jag är intresserad av ett byte. Min lägenhet är..."
          rows={4}
          className="input resize-none mb-3"
          autoFocus
        />
        <div className="flex gap-2">
          <button
            onClick={handleSend}
            disabled={sending || !message.trim()}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {sending ? 'Skickar...' : 'Skicka meddelande'}
          </button>
          <button onClick={() => setShowForm(false)} className="btn-secondary">
            Avbryt
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="btn-primary w-full"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      Skicka meddelande
    </button>
  )
}
