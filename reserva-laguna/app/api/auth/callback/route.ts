import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const errorParam = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Se o Supabase retornou erro diretamente
  if (errorParam) {
    return NextResponse.redirect(`${origin}/?error=${errorParam}&desc=${errorDescription}`)
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
      return NextResponse.redirect(`${origin}/`)
    }
    // Redirect with error details
    const errMsg = error?.message ?? 'unknown'
    return NextResponse.redirect(`${origin}/?error=exchange&msg=${encodeURIComponent(errMsg)}`)
  }

  return NextResponse.redirect(`${origin}/?error=no_code`)
}
