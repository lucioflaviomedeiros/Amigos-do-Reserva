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
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(26,46,30,0.6)', zIndex: 200, padding: 20, overflowY: 'auto', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 420, overflow: 'hidden', animation: 'slideUp 0.3s ease' }}>

        <div style={{ background: 'linear-gradient(135deg, var(--forest), var(--forest-light))', padding: '36px 32px 28px', textAlign: 'center', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', color: 'white', fontSize: 18 }}>✕</button>
          <div style={{ width: 64, height: 64, background: 'rgba(201,168,76,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 28 }}>🏡</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400, color: 'white', marginBottom: 6 }}>Bem-vindo</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Reserva Laguna · Acesso</div>
        </div>

        <div style={{ padding: '28px 32px 32px' }}>
          {step === 'choose' && (
            <>
              <p style={{ fontSize: 14, color: 'var(--text-light)', marginBottom: 18, textAlign: 'center' }}>Escolha como deseja entrar</p>

              <button onClick={signInWithApple} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: '#000', color: 'white', border: 'none', borderRadius: 12, marginBottom: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                Continuar com Apple
              </button>

              <button onClick={signInWithGoogle} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: 'white', color: '#333', border: '1.5px solid #ddd', borderRadius: 12, marginBottom: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>
                <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continuar com Google
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0' }}>
                <div style={{ flex: 1, height: 1, background: 'var(--cream-dark)' }} />
                <span style={{ fontSize: 12, color: 'var(--text-light)' }}>ou</span>
                <div style={{ flex: 1, height: 1, background: 'var(--cream-dark)' }} />
              </div>

              <button onClick={() => setStep('email')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: 'var(--cream)', color: 'var(--forest)', border: '1.5px solid var(--cream-dark)', borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>
                ✉️ Entrar com e-mail
              </button>

              <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-light)', marginTop: 16 }}>
                Acesso exclusivo para moradores do Reserva Laguna
              </p>
            </>
          )}

          {step === 'email' && (
            <>
              <p style={{ fontSize: 14, color: 'var(--text-light)', marginBottom: 18 }}>Enviaremos um link de acesso para o seu e-mail</p>
              {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626', marginBottom: 14 }}>❌ {error}</div>}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-mid)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>E-mail</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com"
                  onKeyDown={e => e.key === 'Enter' && sendMagicLink()}
                  style={{ width: '100%', background: 'var(--cream)', border: '1.5px solid var(--cream-dark)', borderRadius: 10, padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep('choose')} style={{ flex: '0 0 auto', background: 'var(--cream)', color: 'var(--text-mid)', border: '1.5px solid var(--cream-dark)', borderRadius: 10, padding: '12px 18px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, cursor: 'pointer' }}>← Voltar</button>
                <button onClick={sendMagicLink} disabled={loading} style={{ flex: 1, background: 'var(--forest)', color: 'white', border: 'none', borderRadius: 10, padding: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  {loading ? 'Enviando...' : 'Enviar link →'}
                </button>
              </div>
            </>
          )}

          {step === 'sent' && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>📧</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: 'var(--forest)', marginBottom: 8 }}>Verifique seu e-mail!</div>
              <p style={{ fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: 20 }}>
                Enviamos um link de acesso para <strong>{email}</strong>.<br />Clique no link para entrar na plataforma.
              </p>
              <button onClick={onClose} style={{ width: '100%', background: 'var(--forest)', color: 'white', border: 'none', borderRadius: 12, padding: 14, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                Entendido ✓
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
