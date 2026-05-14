'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase-client'
import type { Profile } from '@/lib/types'

interface Props {
  profile: Profile | null
}

export default function Header({ profile: initialProfile }: Props) {
  const [profile, setProfile] = useState(initialProfile)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    // Check current session on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user && !profile) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
        if (data) setProfile(data)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          if (data) setProfile(data)
          else window.location.reload()
        } else if (event === 'SIGNED_OUT') {
          setProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return (
    <header style={{
      background: 'var(--forest)',
      position: 'sticky', top: 0, zIndex: 100,
      padding: '0 20px',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        height: 64, gap: 16,
      }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <Image
            src="/logo.png"
            alt="Reserva Laguna"
            width={40} height={40}
            style={{ objectFit: 'contain', mixBlendMode: 'screen', filter: 'brightness(1.2)' }}
          />
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 22, fontWeight: 400,
            color: 'var(--gold-light)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>Fornecedores</span>
        </a>

        <div style={{ flex: 1, maxWidth: 440, position: 'relative' }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"
            viewBox="0 0 24 24"
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar fornecedores, serviços..."
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(201,168,76,0.25)',
              borderRadius: 40, padding: '9px 16px 9px 40px',
              color: 'white',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14, outline: 'none',
            }}
            onChange={e => {
              window.dispatchEvent(new CustomEvent('platform-search', { detail: e.target.value }))
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-indicate'))}
            style={{
              background: 'var(--gold)', color: 'var(--forest)',
              border: 'none', borderRadius: 40,
              padding: '8px 16px', fontFamily: "'DM Sans', sans-serif",
              fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >+ Indicar</button>

          {profile ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(201,168,76,0.4)',
                  borderRadius: 40, padding: '7px 14px',
                  color: profile.role === 'admin' ? 'var(--gold)' : 'var(--gold-light)',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13, cursor: 'pointer',
                }}
              >
                {profile.role === 'admin' ? '⚙️ Admin' : profile.full_name.split(' ')[0]}
              </button>
              {menuOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: 44,
                  background: 'white', borderRadius: 12,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  padding: 8, minWidth: 160, zIndex: 50,
                }}>
                  {profile.role === 'admin' && (
                    <a href="/admin" style={{ display: 'block', padding: '10px 14px', fontSize: 14, color: 'var(--forest)', fontWeight: 600, textDecoration: 'none' }}>
                      ⚙️ Painel Admin
                    </a>
                  )}
                  <div style={{ height: 1, background: 'var(--cream-dark)', margin: '4px 0' }} />
                  <a href="/api/auth/signout" style={{ display: 'block', padding: '10px 14px', fontSize: 14, color: '#dc2626', textDecoration: 'none' }}>
                    Sair
                  </a>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-login'))}
              style={{
                background: 'transparent',
                border: '1px solid rgba(201,168,76,0.4)',
                borderRadius: 40, padding: '8px 16px',
                color: 'var(--gold-light)',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13, cursor: 'pointer',
              }}
            >Entrar</button>
          )}
        </div>
      </div>
    </header>
  )
}
