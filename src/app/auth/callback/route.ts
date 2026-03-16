import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  console.log('[auth/callback] Received. code:', code ? 'present' : 'missing', 'origin:', origin)

  if (code) {
    try {
      const supabase = await createClient()
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      console.log('[auth/callback] exchangeCodeForSession result:', error ? error.message : 'success', 'user:', data?.user?.email)

      if (!error) {
        const forwardedHost = request.headers.get('x-forwarded-host')
        const isLocalEnv = process.env.NODE_ENV === 'development'
        
        const redirectTo = isLocalEnv
          ? `${origin}${next}`
          : forwardedHost
            ? `https://${forwardedHost}${next}`
            : `${origin}${next}`
        
        console.log('[auth/callback] Redirecting to:', redirectTo)
        return NextResponse.redirect(redirectTo)
      } else {
        console.error('[auth/callback] Auth error:', error.message, error.status)
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
      }
    } catch (e: any) {
      console.error('[auth/callback] Exception:', e.message)
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(e.message)}`)
    }
  }

  console.log('[auth/callback] No code param found')
  return NextResponse.redirect(`${origin}/login?error=no_code`)
}
