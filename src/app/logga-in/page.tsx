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
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (error === 'auth') toast.error('Länken var ogiltig eller har gått ut. Försök igen.')
  }, [error])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.push(redirect)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })
    setLoading(false)
    if (error) {
      toast.error(
        error.message === 'Invalid login credentials'
          ? 'Felaktig e-post eller lösenord.'
          : error.message,
      )
    } else {
      router.push(redirect)
      router.refresh()
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
          <h1 className="font-serif text-2xl text-gray-900">Välkommen tillbaka</h1>
          <p className="text-sm text-gray-500 mt-1">Logga in på Stockholmsbytarn</p>
        </div>

        <div className="bg-white rounded-3xl shadow-card p-7">
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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="label mb-0" htmlFor="password">Lösenord</label>
                <Link
                  href="/glomt-losenord"
                  className="text-xs text-brand-600 hover:underline"
                >
                  Glömt lösenord?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim() || !password}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Loggar in…
                </span>
              ) : (
                'Logga in'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-5">
          Ny på Stockholmsbytarn?{' '}
          <Link href="/registrera" className="text-brand-600 font-medium hover:underline">
            Skapa ett konto
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
