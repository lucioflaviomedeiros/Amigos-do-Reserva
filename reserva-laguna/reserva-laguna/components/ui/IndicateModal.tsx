'use client'
import { useState } from 'react'
import type { Profile } from '@/lib/types'
import { createClient } from '@/lib/supabase-client'

interface Props {
  profile: Profile | null
  onClose: () => void
  showToast: (msg: string) => void
}

export default function IndicateModal({ profile, onClose, showToast }: Props) {
  const [nome, setNome]   = useState('')
  const [cat, setCat]     = useState('Eletricista')
  const [sec, setSec]     = useState<'obras' | 'servicos'>('servicos')
  const [wpp, setWpp]     = useState('')
  const [obs, setObs]     = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const fornLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/fornecedor-cad`

  async function submit() {
    if (!nome || !wpp) { showToast('⚠️ Preencha nome e WhatsApp'); return }
    setLoading(true)
    const { error } = await supabase.from('suppliers').insert({
      name: nome, section: sec, category: cat,
      whatsapp: wpp.replace(/\D/g, ''),
      description: obs,
      status: 'pending',
      self_registered: false,
      indicated_by: profile?.id,
      indicated_by_name: profile?.full_name,
      indicated_by_unit: profile?.unit,
    })
    setLoading(false)
    if (error) { showToast('Erro ao enviar. Tente novamente.'); return }
    showToast('✅ Indicação enviada! Aguarda aprovação do admin.')
    onClose()
  }

  function copyFornLink() {
    navigator.clipboard.writeText(fornLink).then(() => showToast('✅ Link copiado!'))
  }

  function shareWpp() {
    const msg = `Olá! Segue o link para você se cadastrar na plataforma do Reserva Laguna:\n${fornLink}`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(26,46,30,0.6)', zIndex: 200, padding: 20, overflowY: 'auto', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 560, overflow: 'hidden', margin: 'auto', animation: 'slideUp 0.3s ease' }}>

        <div style={{ background: 'linear-gradient(135deg, var(--forest), var(--forest-light))', padding: '28px 32px', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', color: 'white', fontSize: 18 }}>✕</button>
          <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>Colabore com a comunidade</p>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400, color: 'white' }}>Indicar Fornecedor</div>
        </div>

        <div style={{ padding: '28px 32px 32px' }}>

          {/* Supplier self-reg link box */}
          <div style={{ background: 'var(--gold-pale)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: 12, padding: 16, marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--forest)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>🔗 Link de auto-cadastro para fornecedores</div>
            <div style={{ fontSize: 12, color: 'var(--text-mid)', wordBreak: 'break-all', fontFamily: 'monospace', background: 'white', padding: 10, borderRadius: 8, marginBottom: 10 }}>{fornLink}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={copyFornLink} style={{ flex: 1, background: 'var(--forest)', color: 'white', border: 'none', borderRadius: 8, padding: 9, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>📋 Copiar link</button>
              <button onClick={shareWpp} style={{ flex: 1, background: '#25D366', color: 'white', border: 'none', borderRadius: 8, padding: 9, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>📲 WhatsApp</button>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-light)', marginTop: 8 }}>Envie para o fornecedor preencher e aguardar aprovação.</div>
          </div>

          <p style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 20 }}>Ou preencha abaixo para indicar diretamente:</p>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-mid)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Nome / Empresa *</label>
            <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: João Silva Elétrica"
              style={{ width: '100%', background: 'var(--cream)', border: '1.5px solid var(--cream-dark)', borderRadius: 10, padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-mid)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Seção *</label>
              <select value={sec} onChange={e => setSec(e.target.value as any)}
                style={{ width: '100%', background: 'var(--cream)', border: '1.5px solid var(--cream-dark)', borderRadius: 10, padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none' }}>
                <option value="servicos">Prestador de Serviço</option>
                <option value="obras">Obras & Construção</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-mid)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Categoria *</label>
              <input value={cat} onChange={e => setCat(e.target.value)} placeholder="Ex: Eletricista"
                style={{ width: '100%', background: 'var(--cream)', border: '1.5px solid var(--cream-dark)', borderRadius: 10, padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none' }} />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-mid)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>WhatsApp *</label>
            <input value={wpp} onChange={e => setWpp(e.target.value)} placeholder="(00) 00000-0000"
              style={{ width: '100%', background: 'var(--cream)', border: '1.5px solid var(--cream-dark)', borderRadius: 10, padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none' }} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-mid)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Sua experiência</label>
            <textarea value={obs} onChange={e => setObs(e.target.value)} placeholder="Conte como foi trabalhar com esse profissional..."
              style={{ width: '100%', minHeight: 80, background: 'var(--cream)', border: '1.5px solid var(--cream-dark)', borderRadius: 10, padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, resize: 'vertical', outline: 'none' }} />
          </div>

          <button onClick={submit} disabled={loading}
            style={{ width: '100%', background: 'var(--forest)', color: 'white', border: 'none', borderRadius: 12, padding: 14, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            {loading ? 'Enviando...' : 'Enviar indicação ✦'}
          </button>
        </div>
      </div>
    </div>
  )
}
