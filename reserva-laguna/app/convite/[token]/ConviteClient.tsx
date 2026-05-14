'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import type { Invite } from '@/lib/types'

export default function ConviteClient({ invite }: { invite: Invite }) {
  const [step, setStep]   = useState<1 | 2 | 3>(1)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/`,
        queryParams: { full_name: invite.full_name, unit: invite.unit },
      },
    })
  }

  async function signInWithApple() {
    await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: { redirectTo: `${window.location.origin}/api/auth/callback?next=/` },
    })
  }

  async function sendMagicLink() {
    if (!email || !email.includes('@')) { setError('Informe um e-mail válido'); return }
    setLoading(true); setError('')
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/`,
        data: { full_name: invite.full_name, unit: invite.unit, role: 'morador' },
      },
    })
    setLoading(false)
    if (err) { setError(err.message); return }
    setStep(3)
  }

  const stepDot = (n: 1|2|3) => ({
    width: 32, height: 32, borderRadius: '50%',
    background: step === n ? 'var(--forest)' : step > n ? 'var(--gold)' : 'var(--cream-dark)',
    color: step >= n ? 'white' : 'var(--text-light)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 700, flexShrink: 0, transition: 'all 0.3s',
  } as React.CSSProperties)

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--cream)', padding: 20 }}>
      <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 460, overflow: 'hidden', boxShadow: 'var(--card-shadow-hover)' }}>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, var(--forest), var(--forest-light))', padding: '36px 32px 28px', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, background: 'rgba(201,168,76,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 32 }}>🏡</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: 'white', marginBottom: 4 }}>Finalize seu cadastro</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>Reserva Laguna · Convite exclusivo</div>
        </div>

        <div style={{ padding: '24px 28px 32px' }}>

          {/* Pre-filled info */}
          <div style={{ background: 'var(--gold-pale)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: 12, padding: 14, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 24 }}>👋</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--forest)' }}>{invite.full_name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-mid)' }}>{invite.unit}</div>
            </div>
            <span style={{ background: '#dcfce7', color: '#16a34a', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>✓ Pré-aprovado</span>
          </div>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 24 }}>
            <div style={stepDot(1)}>1</div>
            <div style={{ flex: 1, height: 2, background: step > 1 ? 'var(--gold)' : 'var(--cream-dark)', transition: 'background 0.3s' }} />
            <div style={stepDot(2)}>2</div>
            <div style={{ flex: 1, height: 2, background: step > 2 ? 'var(--gold)' : 'var(--cream-dark)', transition: 'background 0.3s' }} />
            <div style={stepDot(3)}>3</div>
          </div>

          {/* Step 1: Choose method */}
          {step === 1 && (
            <>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--forest)', marginBottom: 4 }}>Como deseja entrar?</div>
              <div style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 18 }}>Escolha sua forma de acesso preferida</div>

              <button onClick={signInWithApple} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: '#000', color: 'white', border: 'none', borderRadius: 12, marginBottom: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                Continuar com Apple
              </button>

              <button onClick={signInWithGoogle} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: 'white', color: '#333', border: '1.5px solid #ddd', borderRadius: 12, marginBottom: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>
                <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continuar com Google
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0' }}>
                <div style={{ flex: 1, height: 1, background: 'var(--cream-dark)' }} /><span style={{ fontSize: 12, color: 'var(--text-light)' }}>ou</span><div style={{ flex: 1, height: 1, background: 'var(--cream-dark)' }} />
              </div>

              <button onClick={() => setStep(2)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: 'var(--cream)', color: 'var(--forest)', border: '1.5px solid var(--cream-dark)', borderRadius: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>
                ✉️ Cadastrar com e-mail
              </button>
            </>
          )}

          {/* Step 2: Email */}
          {step === 2 && (
            <>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--forest)', marginBottom: 4 }}>Seu e-mail</div>
              <div style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 18 }}>Vamos enviar um link de confirmação</div>
              {error && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626', marginBottom: 14 }}>❌ {error}</div>}
              <div style={{ marginBottom: 16 }}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com"
                  style={{ width: '100%', background: 'var(--cream)', border: '1.5px solid var(--cream-dark)', borderRadius: 10, padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(1)} style={{ flex: '0 0 auto', background: 'var(--cream)', color: 'var(--text-mid)', border: '1.5px solid var(--cream-dark)', borderRadius: 10, padding: '12px 18px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, cursor: 'pointer' }}>← Voltar</button>
                <button onClick={sendMagicLink} disabled={loading} style={{ flex: 1, background: 'var(--forest)', color: 'white', border: 'none', borderRadius: 10, padding: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  {loading ? 'Enviando...' : 'Enviar confirmação →'}
                </button>
              </div>
            </>
          )}

          {/* Step 3: Sent */}
          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>📧</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: 'var(--forest)', marginBottom: 8 }}>Verifique seu e-mail!</div>
              <p style={{ fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: 20 }}>
                Enviamos o link de acesso para <strong>{email}</strong>.<br />Clique no link para ativar seu acesso à plataforma.
              </p>
              <div style={{ background: 'var(--cream)', borderRadius: 12, padding: 16, fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.9, textAlign: 'left' }}>
                <strong style={{ color: 'var(--forest)' }}>Com acesso ativo você poderá:</strong><br />
                ✦ Indicar fornecedores e prestadores<br />
                ✦ Avaliar e comentar sobre parceiros<br />
                ✦ Compartilhar links de auto-cadastro
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
