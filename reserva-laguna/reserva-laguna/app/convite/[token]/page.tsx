import { createClient } from '@/lib/supabase-server'
import ConviteClient from './ConviteClient'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ConvitePage({ params }: { params: { token: string } }) {
  const supabase = await createClient()
  const { data: invite } = await supabase
    .from('invites')
    .select('*')
    .eq('token', params.token)
    .single()

  if (!invite || invite.status === 'revoked') notFound()

  if (new Date(invite.expires_at) < new Date()) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--cream)', padding: 20 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>⏰</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: 'var(--forest)', marginBottom: 8 }}>Link expirado</h2>
          <p style={{ color: 'var(--text-light)' }}>Este link de convite expirou. Solicite um novo ao administrador.</p>
        </div>
      </div>
    )
  }

  return <ConviteClient invite={invite} />
}
