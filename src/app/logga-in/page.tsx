'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/'
  const error = searchParams.get('error')

  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (error === 'auth') toast.error('Inloggningslänken var ogiltig. Försök igen.')
  }, [error])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.push(redirect)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirect}`,
      },
    })

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
          <Link href="/" className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-500 shadow-md mb-4">
            <span className="font-serif text-white text-3xl font-bold leading-none">S</span>
          </Link>
          <h1 className="font-serif text-2xl text-gray-900">Välkommen tillbaka</h1>
          <p className="text-sm text-gray-500 mt-1">Logga in med din e-postadress</p>
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
              <h2 className="font-semibold text-gray-900 mb-2">Kolla din e-post!</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Vi har skickat en inloggningslänk till{' '}
                <strong className="text-gray-700">{email}</strong>.
                Klicka på länken för att logga in.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-5 text-sm text-brand-600 hover:underline"
              >
                Skicka ny länk
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
                    Skickar länk...
                  </span>
                ) : (
                  'Skicka inloggningslänk'
                )}
              </button>

              <p className="text-xs text-gray-400 text-center leading-relaxed">
                Vi skickar en magisk länk till din e-post.
                Inget lösenord behövs.
              </p>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Ny på Stockholmsbytarn?{' '}
          <Link href="/lagg-upp" className="text-brand-600 font-medium hover:underline">
            Lägg upp en annons gratis
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoggaInPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
