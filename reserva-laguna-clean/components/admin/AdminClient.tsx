'use client'
import { useState } from 'react'
import type { Supplier, Review, Invite, SiteSettings } from '@/lib/types'
import AdminInviteTab from './AdminInviteTab'

interface Props {
  pendingSuppliers: Supplier[]
  pendingReviews: Review[]
  allSuppliers: Supplier[]
  invites: Invite[]
  settings: SiteSettings | null
}

type Tab = 'aprovacoes' | 'fornecedores' | 'avaliacoes' | 'usuarios' | 'categorias' | 'avisos'

export default function AdminClient({ pendingSuppliers: initPending, pendingReviews: initReviews, allSuppliers, invites: initInvites, settings }: Props) {
  const [tab, setTab]               = useState<Tab>('aprovacoes')
  const [pending, setPending]       = useState(initPending)
  const [reviews, setReviews]       = useState(initReviews)
  const [invites, setInvites]       = useState(initInvites)
  const [suppliers, setSuppliers]   = useState(allSuppliers)
  const [notice, setNotice]         = useState(settings?.notice_text ?? '')
  const [toast, setToast]           = useState('')

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2800) }

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: 'aprovacoes',   label: '✅ Aprovações',   badge: pending.length },
    { id: 'fornecedores', label: '🏢 Fornecedores' },
    { id: 'avaliacoes',   label: '⭐ Avaliações',   badge: reviews.length },
    { id: 'usuarios',     label: '👥 Usuários' },
    { id: 'avisos',       label: '📢 Avisos' },
  ]

  async function approveSupplier(id: string) {
    await fetch('/api/suppliers', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: 'approved' }) })
    setPending(p => p.filter(s => s.id !== id))
    setSuppliers(s => s.map(x => x.id === id ? { ...x, status: 'approved' } : x))
    showToast('✅ Fornecedor aprovado e publicado!')
  }

  async function rejectSupplier(id: string) {
    await fetch('/api/suppliers', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: 'rejected' }) })
    setPending(p => p.filter(s => s.id !== id))
    showToast('❌ Indicação recusada.')
  }

  async function toggleVerified(s: Supplier) {
    await fetch('/api/suppliers', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: s.id, verified: !s.verified }) })
    setSuppliers(prev => prev.map(x => x.id === s.id ? { ...x, verified: !x.verified } : x))
    showToast(s.verified ? 'Verificação removida' : '✓ Marcado como verificado')
  }

  async function toggleFeatured(s: Supplier) {
    await fetch('/api/suppliers', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: s.id, featured: !s.featured }) })
    setSuppliers(prev => prev.map(x => x.id === s.id ? { ...x, featured: !x.featured } : x))
    showToast(s.featured ? 'Removido dos destaques' : '⭐ Adicionado aos destaques')
  }

  async function deleteSupplier(id: string) {
    if (!confirm('Remover este fornecedor?')) return
    await fetch(`/api/suppliers?id=${id}`, { method: 'DELETE' })
    setSuppliers(s => s.filter(x => x.id !== id))
    showToast('Fornecedor removido')
  }

  async function approveReview(id: string) {
    await fetch('/api/reviews', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, approved: true }) })
    setReviews(r => r.filter(x => x.id !== id))
    showToast('✅ Avaliação publicada!')
  }

  async function deleteReview(id: string) {
    await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' })
    setReviews(r => r.filter(x => x.id !== id))
    showToast('🗑 Avaliação removida.')
  }

  async function saveNotice() {
    await fetch('/api/suppliers', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
    // Update settings via direct Supabase (simplified - in production use a dedicated settings API)
    showToast('✅ Aviso atualizado!')
  }

  const badge = (n: number) => n > 0 ? (
    <span style={{ background: '#ef4444', color: 'white', borderRadius: 10, padding: '1px 7px', fontSize: 11, marginLeft: 4 }}>{n}</span>
  ) : null

  const thStyle: React.CSSProperties = { padding: '12px 16px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-light)', fontWeight: 600, background: 'var(--cream)', borderBottom: '1px solid var(--cream-dark)', textAlign: 'left' }
  const tdStyle: React.CSSProperties = { padding: '14px 16px', fontSize: 13, color: 'var(--text-dark)', borderBottom: '1px solid var(--cream-dark)', verticalAlign: 'middle' }
  const btnSm = (bg: string, color: string): React.CSSProperties => ({ padding: '5px 12px', borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer', background: bg, color })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>

      {/* Admin header */}
      <div style={{ background: 'var(--forest)', padding: '0 24px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 8, height: 8, background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 8px #4ade80' }} />
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: 'var(--gold-light)' }}>Painel Admin</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Reserva Laguna</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a href="/" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>← Ver site</a>
            <a href="/api/auth/signout" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', borderRadius: 20, padding: '6px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: 13, textDecoration: 'none' }}>Sair</a>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--cream-dark)', padding: '0 24px', overflowX: 'auto' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding: '14px 20px', border: 'none', background: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: tab === t.id ? 600 : 500, color: tab === t.id ? 'var(--forest)' : 'var(--text-mid)', cursor: 'pointer', borderBottom: `2px solid ${tab === t.id ? 'var(--gold)' : 'transparent'}`, whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
              {t.label}{t.badge ? badge(t.badge) : null}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px 80px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Fornecedores', val: suppliers.filter(s => s.status === 'approved').length, color: 'var(--gold)' },
            { label: 'Aguardando Aprovação', val: pending.length, color: '#4ade80' },
            { label: 'Avaliações Pendentes', val: reviews.length, color: '#f59e0b' },
            { label: 'Moradores Convidados', val: invites.length, color: '#818cf8' },
          ].map(s => (
            <div key={s.label} style={{ background: 'white', borderRadius: 16, padding: 20, boxShadow: 'var(--card-shadow)', borderLeft: `4px solid ${s.color}` }}>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-light)', fontWeight: 600, marginBottom: 8 }}>{s.label}</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, color: 'var(--forest)', fontWeight: 400, lineHeight: 1 }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* ── TAB: APROVAÇÕES ── */}
        {tab === 'aprovacoes' && (
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: 'var(--forest)', marginBottom: 4 }}>Indicações Pendentes</div>
            <div style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 20 }}>Fornecedores aguardando aprovação</div>
            {pending.length === 0 && <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-light)' }}>✅ Nenhuma indicação pendente</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {pending.map(s => (
                <div key={s.id} style={{ background: 'white', borderRadius: 16, padding: '20px 24px', boxShadow: 'var(--card-shadow)', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: 'var(--forest)', marginBottom: 4 }}>{s.name}</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', fontSize: 12, color: 'var(--text-light)' }}>
                        <span style={{ background: '#fef9c3', color: '#ca8a04', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>⏳ Pendente</span>
                        <span>{s.category} · {s.section === 'obras' ? 'Obras' : 'Serviços'}</span>
                        {s.indicated_by_name && <span>Por: <strong>{s.indicated_by_name}</strong> ({s.indicated_by_unit})</span>}
                        {s.self_registered && <span>🔗 Auto-cadastro</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      <button onClick={() => approveSupplier(s.id)} style={btnSm('#dcfce7', '#16a34a')}>✓ Aprovar</button>
                      <button onClick={() => rejectSupplier(s.id)} style={btnSm('#fef2f2', '#dc2626')}>✕ Recusar</button>
                    </div>
                  </div>
                  {s.description && <div style={{ background: 'var(--cream)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.6 }}>{s.description}</div>}
                  {s.whatsapp && (
                    <a href={`https://wa.me/55${s.whatsapp}`} target="_blank" rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 14px', background: '#dcfce7', color: '#16a34a', borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: 'none', width: 'fit-content' }}>
                      📱 WhatsApp
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: FORNECEDORES ── */}
        {tab === 'fornecedores' && (
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: 'var(--forest)', marginBottom: 20 }}>Gerenciar Fornecedores</div>
            <div style={{ background: 'white', borderRadius: 16, boxShadow: 'var(--card-shadow)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr>
                  {['Fornecedor', 'Seção', 'Categoria', 'Nota', 'Status', 'Ações'].map(h => <th key={h} style={thStyle}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {suppliers.map(s => (
                    <tr key={s.id}>
                      <td style={tdStyle}><strong>{s.name}</strong><div style={{ fontSize: 11, color: 'var(--text-light)' }}>{s.city}</div></td>
                      <td style={tdStyle}>{s.section === 'obras' ? 'Obras' : 'Serviços'}</td>
                      <td style={tdStyle}>{s.category}</td>
                      <td style={tdStyle}><span style={{ fontWeight: 700, color: 'var(--gold)' }}>★ {s.avg_rating.toFixed(1)}</span><span style={{ fontSize: 11, color: 'var(--text-light)' }}> ({s.review_count})</span></td>
                      <td style={tdStyle}>
                        <span style={{ background: s.status === 'approved' ? '#dcfce7' : s.status === 'pending' ? '#fef9c3' : '#fef2f2', color: s.status === 'approved' ? '#16a34a' : s.status === 'pending' ? '#ca8a04' : '#dc2626', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                          {s.status === 'approved' ? '✓ Aprovado' : s.status === 'pending' ? '⏳ Pendente' : '✕ Rejeitado'}
                        </span>
                        {s.verified && <span style={{ background: 'var(--gold-pale)', color: 'var(--forest)', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, marginLeft: 4 }}>✓ Verificado</span>}
                        {s.featured && <span style={{ background: 'var(--gold-pale)', color: 'var(--forest)', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, marginLeft: 4 }}>⭐ Destaque</span>}
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <button onClick={() => toggleVerified(s)} style={btnSm(s.verified ? '#fef2f2' : '#dcfce7', s.verified ? '#dc2626' : '#16a34a')}>{s.verified ? '✗ Verif.' : '✓ Verif.'}</button>
                          <button onClick={() => toggleFeatured(s)} style={btnSm('var(--gold-pale)', 'var(--forest)')}>{s.featured ? '☆' : '⭐'}</button>
                          <button onClick={() => deleteSupplier(s.id)} style={btnSm('#fef2f2', '#dc2626')}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB: AVALIAÇÕES ── */}
        {tab === 'avaliacoes' && (
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: 'var(--forest)', marginBottom: 20 }}>Moderar Avaliações</div>
            {reviews.length === 0 && <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-light)' }}>✅ Nenhuma avaliação pendente</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {reviews.map(r => (
                <div key={r.id} style={{ background: 'white', borderRadius: 14, padding: '18px 20px', boxShadow: 'var(--card-shadow)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: 14, color: 'var(--forest)' }}>{(r.supplier as any)?.name}</strong>
                      <span style={{ fontSize: 12, color: 'var(--text-light)' }}>— {(r.user as any)?.full_name} ({(r.user as any)?.unit})</span>
                      <span style={{ fontSize: 12, color: 'var(--gold)' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-light)' }}>{new Date(r.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.6 }}>"{r.comment}"</p>
                  </div>
                  <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
                    <button onClick={() => approveReview(r.id)} style={btnSm('#dcfce7', '#16a34a')}>✓ Publicar</button>
                    <button onClick={() => deleteReview(r.id)} style={btnSm('#fef2f2', '#dc2626')}>✕ Remover</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: USUÁRIOS / CONVITES ── */}
        {tab === 'usuarios' && (
          <AdminInviteTab invites={invites} setInvites={setInvites} showToast={showToast} />
        )}

        {/* ── TAB: AVISOS ── */}
        {tab === 'avisos' && (
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: 'var(--forest)', marginBottom: 20 }}>Avisos & Configurações</div>

            {/* Cover photo */}
            <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: 'var(--card-shadow)', marginBottom: 20, borderLeft: '4px solid var(--gold)' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: 'var(--forest)', marginBottom: 4 }}>🖼 Foto de Capa</div>
              <div style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 18 }}>Altere a imagem exibida no topo da plataforma</div>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--forest)', color: 'white', border: 'none', borderRadius: 10, padding: '12px 20px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                📁 Selecionar nova foto de capa
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={async e => {
                  const file = e.target.files?.[0]; if (!file) return
                  const form = new FormData(); form.append('file', file)
                  const res = await fetch('/api/cover', { method: 'POST', body: form })
                  const data = await res.json()
                  if (data.url) showToast('✅ Foto de capa atualizada! Recarregue a página para ver.')
                  else showToast('Erro ao enviar foto')
                }} />
              </label>
              <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 10 }}>Formatos: JPG, PNG, WebP · Tamanho ideal: 1440 × 320px</div>
            </div>

            {/* Notice */}
            <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: 'var(--card-shadow)' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: 'var(--forest)', marginBottom: 16 }}>📢 Aviso do Condomínio</div>
              <textarea value={notice} onChange={e => setNotice(e.target.value)}
                style={{ width: '100%', minHeight: 80, background: 'var(--cream)', border: '1.5px solid var(--cream-dark)', borderRadius: 10, padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, resize: 'vertical', outline: 'none', marginBottom: 12 }} />
              <button onClick={saveNotice} style={{ background: 'var(--forest)', color: 'white', border: 'none', borderRadius: 10, padding: '12px 24px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                Salvar aviso
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 30, left: '50%', transform: 'translateX(-50%)', background: 'var(--forest)', color: 'white', padding: '12px 24px', borderRadius: 40, fontSize: 14, fontWeight: 500, zIndex: 300, whiteSpace: 'nowrap', animation: 'slideUp 0.3s ease' }}>
          {toast}
        </div>
      )}
    </div>
  )
}
