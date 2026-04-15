'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase/client'

type AuthMode = 'magic' | 'password'
type PasswordMode = 'signin' | 'signup'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/'
  const error = searchParams.get('error')

  const supabase = createClient()
  const [authMode, setAuthMode] = useState<AuthMode>('magic')
  const [passwordMode, setPasswordMode] = useState<PasswordMode>('signin')

  // Magic link state
  const [magicEmail, setMagicEmail] = useState('')
  const [magicLoading, setMagicLoading] = useState(false)
  const [magicSent, setMagicSent] = useState(false)

  // Password state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [signupDone, setSignupDone] = useState(false)

  useEffect(() => {
    if (error === 'auth') toast.error('Inloggningslänken var ogiltig. Försök igen.')
  }, [error])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.push(redirect)
    })
  }, [])

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!magicEmail.trim()) return
    setMagicLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email: magicEmail.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirect}`,
      },
    })
    setMagicLoading(false)
    if (error) toast.error(error.message)
    else setMagicSent(true)
  }

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) return
    setPwLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })
    setPwLoading(false)
    if (error) {
      toast.error(error.message === 'Invalid login credentials'
        ? 'Felaktig e-post eller lösenord.'
        : error.message)
    } else {
      router.push(redirect)
      router.refresh()
    }
  }

  const handlePasswordSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) return
    if (password !== confirmPassword) {
      toast.error('Lösenorden matchar inte.')
      return
    }
    if (password.length < 6) {
      toast.error('Lösenordet måste vara minst 6 tecken.')
      return
    }
    setPwLoading(true)
    const { error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirect}`,
      },
    })
    setPwLoading(false)
    if (error) toast.error(error.message)
    else setSignupDone(true)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-500 shadow-md mb-4">
            <span className="font-serif text-white text-3xl font-bold leading-none">S</span>
          </Link>
          <h1 className="font-serif text-2xl text-gray-900">Välkommen</h1>
          <p className="text-sm text-gray-500 mt-1">Logga in på Stockholmsbytarn</p>
        </div>

        <div className="bg-white rounded-3xl shadow-card p-7">
          {/* Mode tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => setAuthMode('magic')}
              className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all ${
                authMode === 'magic'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Magic link
            </button>
            <button
              onClick={() => setAuthMode('password')}
              className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all ${
                authMode === 'password'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Lösenord
            </button>
          </div>

          {/* ─── Magic Link ─── */}
          {authMode === 'magic' && (
            magicSent ? (
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
                  <strong className="text-gray-700">{magicEmail}</strong>.
                  Klicka på länken för att logga in.
                </p>
                <button
                  onClick={() => setMagicSent(false)}
                  className="mt-5 text-sm text-brand-600 hover:underline"
                >
                  Skicka ny länk
                </button>
              </div>
            ) : (
              <form onSubmit={handleMagicLink} className="space-y-4">
                <div>
                  <label className="label" htmlFor="magic-email">E-postadress</label>
                  <input
                    id="magic-email"
                    type="email"
                    value={magicEmail}
                    onChange={e => setMagicEmail(e.target.value)}
                    placeholder="din@email.se"
                    className="input"
                    required
                    autoComplete="email"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  disabled={magicLoading || !magicEmail.trim()}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {magicLoading ? (
                    <span className="flex items-center gap-2 justify-center">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Skickar länk…
                    </span>
                  ) : 'Skicka inloggningslänk'}
                </button>
                <p className="text-xs text-gray-400 text-center leading-relaxed">
                  Vi skickar en magisk länk till din e-post. Inget lösenord behövs.
                </p>
              </form>
            )
          )}

          {/* ─── Password ─── */}
          {authMode === 'password' && (
            signupDone ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="font-semibold text-gray-900 mb-2">Verifiera din e-post</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Vi har skickat en bekräftelsemejl till{' '}
                  <strong className="text-gray-700">{email}</strong>.
                  Klicka på länken i mejlet för att aktivera ditt konto.
                </p>
                <button
                  onClick={() => { setSignupDone(false); setPasswordMode('signin') }}
                  className="mt-5 text-sm text-brand-600 hover:underline"
                >
                  Tillbaka till inloggning
                </button>
              </div>
            ) : (
              <>
                {/* Sign in / Sign up toggle */}
                <div className="flex gap-4 mb-5 border-b border-gray-100 pb-4">
                  <button
                    onClick={() => setPasswordMode('signin')}
                    className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
                      passwordMode === 'signin'
                        ? 'border-brand-500 text-brand-600'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    Logga in
                  </button>
                  <button
                    onClick={() => setPasswordMode('signup')}
                    className={`text-sm font-medium pb-1 border-b-2 transition-colors ${
                      passwordMode === 'signup'
                        ? 'border-brand-500 text-brand-600'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    Skapa konto
                  </button>
                </div>

                <form
                  onSubmit={passwordMode === 'signin' ? handlePasswordSignIn : handlePasswordSignUp}
                  className="space-y-4"
                >
                  <div>
                    <label className="label" htmlFor="pw-email">E-postadress</label>
                    <input
                      id="pw-email"
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
                    <label className="label" htmlFor="pw-password">Lösenord</label>
                    <input
                      id="pw-password"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder={passwordMode === 'signup' ? 'Minst 6 tecken' : '••••••••'}
                      className="input"
                      required
                      autoComplete={passwordMode === 'signin' ? 'current-password' : 'new-password'}
                    />
                  </div>
                  {passwordMode === 'signup' && (
                    <div>
                      <label className="label" htmlFor="pw-confirm">Bekräfta lösenord</label>
                      <input
                        id="pw-confirm"
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Upprepa lösenordet"
                        className="input"
                        required
                        autoComplete="new-password"
                      />
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={pwLoading || !email.trim() || !password}
                    className="btn-primary w-full disabled:opacity-50"
                  >
                    {pwLoading ? (
                      <span className="flex items-center gap-2 justify-center">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {passwordMode === 'signin' ? 'Loggar in…' : 'Skapar konto…'}
                      </span>
                    ) : passwordMode === 'signin' ? 'Logga in' : 'Skapa konto'}
                  </button>
                </form>
              </>
            )
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
