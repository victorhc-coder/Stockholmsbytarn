import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Handles two Supabase auth flows:
 *
 * 1. Email verification after sign-up
 *    Supabase sends a link → /auth/callback?code=xxx
 *    We exchange the code for a session and redirect to /.
 *
 * 2. Password reset
 *    resetPasswordForEmail() uses redirectTo=/auth/callback?next=/aterstall-losenord
 *    We exchange the code and redirect to /aterstall-losenord where the user
 *    sets a new password via supabase.auth.updateUser().
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/logga-in?error=auth`)
}
