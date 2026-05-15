import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const SITE_URL = 'https://amigosdoreserva.vercel.app'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const errorParam = searchParams.get('error')

  if (errorParam) {
    return NextResponse.redirect(`${SITE_URL}/?error=${errorParam}`)
  }

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data.session) {
      return NextResponse.redirect(SITE_URL)
    }
    const errMsg = error?.message ?? 'unknown'
    return NextResponse.redirect(`${SITE_URL}/?error=exchange&msg=${encodeURIComponent(errMsg)}`)
  }

  return NextResponse.redirect(`${SITE_URL}/?error=no_code`)
}
