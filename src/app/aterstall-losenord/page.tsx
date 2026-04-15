'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

export default function AterstallLosenordPage() {
  const router = useRouter()
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  // The user arrives here after Supabase has exchanged the recovery code
  // for a session (via /auth/callback). We verify there's an active session.
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        toast.error('Länken är ogiltig eller har gått ut.')
        router.push('/glomt-losenord')
      } else {
        setReady(true)
      }
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      toast.error('Lösenorden matchar inte.')
      return
    }
    if (password.length < 6) {
      toast.error('Lösenordet måste vara minst 6 tecken.')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Lösenordet är uppdaterat!')
      router.push('/')
    }
  }

  if (!ready) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-500 shadow-md mb-4"
          >
            <span className="font-serif text-white text-3xl font-bold leading-none">S</span>
          </Link>
          <h1 className="font-serif text-2xl text-gray-900">Nytt lösenord</h1>
          <p className="text-sm text-gray-500 mt-1">Välj ett nytt lösenord för ditt konto</p>
        </div>

        <div className="bg-white rounded-3xl shadow-card p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="password">Nytt lösenord</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Minst 6 tecken"
                className="input"
                required
                autoComplete="new-password"
                autoFocus
              />
            </div>

            <div>
              <label className="label" htmlFor="confirm">Bekräfta lösenord</label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Upprepa lösenordet"
                className="input"
                required
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !password || !confirm}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sparar…
                </span>
              ) : (
                'Spara nytt lösenord'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
