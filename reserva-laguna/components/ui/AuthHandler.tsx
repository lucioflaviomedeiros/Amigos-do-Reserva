'use client'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'

export default function AuthHandler() {
  useEffect(() => {
    const supabase = createClient()

    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
        if (!error && data.session) {
          window.history.replaceState({}, '', '/')
          window.location.reload()
        }
      })
      return
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        window.location.reload()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return null
}
