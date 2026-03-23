import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  if (code) {
    try {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error) {
        // Next.js handles requestUrl.origin correctly on Vercel
        return NextResponse.redirect(`${requestUrl.origin}${next}`)
      } else {
        return NextResponse.redirect(`${requestUrl.origin}/login?error=${encodeURIComponent(error.message)}`)
      }
    } catch (e: any) {
      return NextResponse.redirect(`${requestUrl.origin}/login?error=${encodeURIComponent('Exception occurred')}`)
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/login?error=no_code`)
}
