'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/'

  const supabase = createClient()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.push(redirect)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      toast.error('Lösenordet måste vara minst 6 tecken.')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { name: name.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      setDone(true)
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
          <h1 className="font-serif text-2xl text-gray-900">Skapa konto</h1>
          <p className="text-sm text-gray-500 mt-1">Gratis och tar under en minut</p>
        </div>

        <div className="bg-white rounded-3xl shadow-card p-7">
          {done ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="font-semibold text-gray-900 mb-2">Kolla din e-post!</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Vi har skickat ett aktiveringsmejl till{' '}
                <strong className="text-gray-700">{email}</strong>.
                Klicka på länken i mejlet för att aktivera ditt konto.
              </p>
              <p className="text-xs text-gray-400 mt-4">
                Inget mejl? Kolla skräpposten eller{' '}
                <button
                  onClick={() => setDone(false)}
                  className="text-brand-600 hover:underline"
                >
                  försök igen
                </button>
                .
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label" htmlFor="name">Visningsnamn</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Förnamn Efternamn"
                  className="input"
                  required
                  autoComplete="name"
                  autoFocus
                />
              </div>

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
                />
              </div>

              <div>
                <label className="label" htmlFor="password">Lösenord</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minst 6 tecken"
                  className="input"
                  required
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !name.trim() || !email.trim() || !password}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Skapar konto…
                  </span>
                ) : (
                  'Skapa konto'
                )}
              </button>

              <p className="text-xs text-gray-400 text-center leading-relaxed">
                Genom att skapa ett konto godkänner du att använda tjänsten i enlighet
                med gällande regler för lägenhetsbyte.
              </p>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Har du redan ett konto?{' '}
          <Link href="/logga-in" className="text-brand-600 font-medium hover:underline">
            Logga in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function RegistreraPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}
