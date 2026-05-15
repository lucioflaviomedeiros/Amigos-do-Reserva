'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'

const CALLBACK_URL = 'https://amigosdoreserva.vercel.app/api/auth/callback'

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const [step, setStep]       = useState<'choose' | 'email' | 'sent'>('choose')
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function signInWithGoogle() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: CALLBACK_URL },
    })
  }

  async function signInWithApple() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: CALLBACK_URL },
    })
  }

  async function sendMagicLink() {
    if (!email || !email.includes('@')) { setError('Informe um e-mail válido'); return }
    setLoading(true); setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: CALLBACK_URL },
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    setStep('sent')
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(26,46,30,0.6)', zIndex: 200, padding: 20, over
