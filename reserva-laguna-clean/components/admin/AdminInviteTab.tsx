'use client'
import { useState } from 'react'
import type { Invite } from '@/lib/types'

interface Props {
  invites: Invite[]
  setInvites: (fn: (prev: Invite[]) => Invite[]) => void
  showToast: (msg: string) => void
}

export default function AdminInviteTab({ invites, setInvites, showToast }: Props) {
  const [nome, setNome]       = useState('')
  const [lote, setLote]       = useState('')
  const [phone, setPhone]     = useState('')
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState<{ nome: string; lote: string; link: string } | null>(null)
  const [search, setSearch]   = useState('')

  async function gerarConvite() {
    if (!nome || !lote) { showToast('⚠️ Preencha nome e quadra/lote'); return }
    setLoading(true)
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name: nome, unit: lote, phone: phone || null }),
    })
    const data = await res.json()
    setLoading(false)
    if (!data.link) { showToast('Erro ao gerar convite'); return }
    setGenerated({ nome, lote, link: data.link })
    setInvites(prev => [data.invite, ...prev])
    setNome(''); setLote(''); setPhone('')
    showToast('✅ Link gerado com sucesso!')
  }

  function copiarLink() {
    if (!generated) return
    navigator.clipboard.writeText(generated.link).then(() => showToast('✅ Link copiado!'))
  }

  function enviarWpp() {
    if (!generated) return
    const msg = `Olá, ${generated.nome}! 🏡\n\nVocê foi pré-cadastrado na plataforma de Fornecedores do Reserva Laguna.\n\nFinalize seu cadastro clicando no link:\n${generated.link}\n\n_Reserva Laguna — Plataforma de Fornecedores_`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const filtered = invites.filter(i =>
    !search || i.full_name.toLowerCase().includes(search.toLowerCase()) || i.unit.toLowerCase().includes(search.toLowerCase())
  )

  const statusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string; label: string }> = {
      active:  { bg: '#dcfce7', color: '#16a34a', label: '✓ Ativo' },
      invited: { bg: '#fef9c3', color: '#ca8a04', label: '📧 Convidado' },
      revoked: { bg: '#fef2f2', color: '#dc2626', label: '✕ Revogado' },
    }
    const s = styles[status] ?? styles.invited
    return <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{s.label}</span>
  }

  const thStyle: React.CSSProperties = { padding: '12px 16px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-light)', fontWeight: 600, background: 'var(--cream)', borderBottom: '1px solid var(--cream-dark)', textAlign: 'left' }
  const tdStyle: React.CSSProperties = { padding: '14px 16px', fontSize: 13, color: 'var(--text-dark)', borderBottom: '1px solid var(--cream-dark)', verticalAlign: 'middle' }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32, alignItems: 'start' }}>

        {/* Form */}
        <div style={{ background: 'white', borderRadius: 20, padding: 28, boxShadow: 'var(--card-shadow)', borderTop: '4px solid var(--gold)' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: 'var(--forest)', marginBottom: 4 }}>Pré-cadastrar Morador</div>
          <div style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 24 }}>Preencha os dados e gere o link de convite</div>
          {[
            { label: 'Nome completo *', val: nome, set: setNome, ph: 'Ex: Maria Aparecida Silva' },
            { label: 'Quadra / Lote *', val: lote, set: setLote, ph: 'Ex: Quadra 3, Lote 12' },
            { label: 'Telefone (opcional)', val: phone, set: setPhone, ph: '(00) 00000-0000' },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-mid)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{f.label}</label>
              <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph}
                style={{ width: '100%', background: 'var(--cream)', border: '1.5px solid var(--cream-dark)', borderRadius: 10, padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none' }} />
            </div>
          ))}
          <button onClick={gerarConvite} disabled={loading}
            style={{ width: '100%', background: 'var(--forest)', color: 'white', border: 'none', borderRadius: 12, padding: 14, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            {loading ? 'Gerando...' : '✦ Gerar link de convite'}
          </button>
        </div>

        {/* Generated link */}
        {generated ? (
          <div style={{ background: 'white', borderRadius: 20, padding: 28, boxShadow: 'var(--card-shadow)', borderTop: '4px solid #4ade80' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>✅</div>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: 'var(--forest)' }}>Link gerado!</div>
                <div style={{ fontSize: 12, color: 'var(--text-light)' }}>Válido por 7 dias</div>
              </div>
            </div>
            <div style={{ background: 'var(--cream)', borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-light)', fontWeight: 600, marginBottom: 6 }}>Morador</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--forest)' }}>{generated.nome}</div>
              <div style={{ fontSize: 13, color: 'var(--text-mid)' }}>{generated.lote}</div>
            </div>
            <div style={{ background: 'var(--cream)', borderRadius: 12, padding: 14, marginBottom: 14, wordBreak: 'break-all' }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-light)', fontWeight: 600, marginBottom: 6 }}>Link de convite</div>
              <div style={{ fontSize: 12, color: 'var(--forest)', fontFamily: 'monospace' }}>{generated.link}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={copiarLink} style={{ flex: 1, background: 'var(--forest)', color: 'white', border: 'none', borderRadius: 10, padding: '11px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>📋 Copiar link</button>
              <button onClick={enviarWpp} style={{ flex: 1, background: '#25D366', color: 'white', border: 'none', borderRadius: 10, padding: '11px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>📲 WhatsApp</button>
            </div>
            <div style={{ marginTop: 10, padding: '10px 14px', background: '#fef9c3', borderRadius: 10, fontSize: 12, color: '#92400e' }}>
              📧 O morador receberá um e-mail de confirmação ao concluir o cadastro.
            </div>
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: 20, padding: 28, boxShadow: 'var(--card-shadow)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200, color: 'var(--text-light)', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔗</div>
              <div style={{ fontSize: 14 }}>O link gerado aparecerá aqui</div>
            </div>
          </div>
        )}
      </div>

      {/* Invites table */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: 'var(--forest)' }}>Moradores Cadastrados</div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar morador..."
          style={{ background: 'white', border: '1.5px solid var(--cream-dark)', borderRadius: 40, padding: '9px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: 13, outline: 'none', maxWidth: 240 }} />
      </div>
      <div style={{ background: 'white', borderRadius: 16, boxShadow: 'var(--card-shadow)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>
            {['Nome', 'Quadra / Lote', 'Telefone', 'Status', 'Criado em', 'Ações'].map(h => <th key={h} style={thStyle}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map(inv => (
              <tr key={inv.id}>
                <td style={tdStyle}><strong>{inv.full_name}</strong></td>
                <td style={tdStyle}>{inv.unit}</td>
                <td style={{ ...tdStyle, fontSize: 12, color: 'var(--text-light)' }}>{inv.phone ?? '—'}</td>
                <td style={tdStyle}>{statusBadge(inv.status)}</td>
                <td style={{ ...tdStyle, fontSize: 12, color: 'var(--text-light)' }}>{new Date(inv.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => { navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL ?? ''}/convite/${inv.token}`); showToast('Link copiado!') }}
                      style={{ padding: '5px 12px', borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', background: 'var(--gold-pale)', color: 'var(--forest)' }}>
                      📋 Link
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)' }}>Nenhum morador encontrado</div>}
      </div>
    </div>
  )
}
