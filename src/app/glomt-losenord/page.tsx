'use client'

import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

export default function GlomtLosenordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      {
        redirectTo: `${window.location.origin}/auth/callback?next=/aterstall-losenord`,
      },
    )
    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      setSent(true)
    }
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
          <h1 className="font-serif text-2xl text-gray-900">Glömt lösenord?</h1>
          <p className="text-sm text-gray-500 mt-1">
            Vi skickar en återställningslänk till din e-post
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-card p-7">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="font-semibold text-gray-900 mb-2">Mejl skickat!</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Om det finns ett konto kopplat till{' '}
                <strong className="text-gray-700">{email}</strong> har vi skickat
                en återställningslänk. Kolla även skräpposten.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-5 text-sm text-brand-600 hover:underline"
              >
                Skicka igen
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label" htmlFor="email">E-postadress</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="din@email.se"
                  className="input"
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Skickar…
                  </span>
                ) : (
                  'Skicka återställningslänk'
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          <Link href="/logga-in" className="text-brand-600 font-medium hover:underline">
            ← Tillbaka till inloggning
          </Link>
        </p>
      </div>
    </div>
  )
}
