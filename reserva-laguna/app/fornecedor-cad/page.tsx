'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'

export default function FornecedorCadPage() {
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)
  const [form, setForm]       = useState({ name: '', type: 'autonomo', section: 'servicos', category: '', description: '', whatsapp: '', phone: '', instagram: '', website: '', city: '', email: '' })
  const supabase = createClient()

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function submit() {
    if (!form.name || !form.whatsapp || !form.category) { alert('Preencha nome, categoria e WhatsApp'); return }
    setLoading(true)
    await supabase.from('suppliers').insert({
      name: form.name, type: form.type, section: form.section,
      category: form.category, description: form.description,
      whatsapp: form.whatsapp.replace(/\D/g,''), phone: form.phone,
      instagram: form.instagram, website: form.website, city: form.city,
      status: 'pending', self_registered: true,
    })
    setLoading(false)
    setDone(true)
  }

  const inp = (label: string, key: string, placeholder: string, type = 'text') => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-mid)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{label}</label>
      <input type={type} value={(form as any)[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder}
        style={{ width: '100%', background: 'var(--cream)', border: '1.5px solid var(--cream-dark)', borderRadius: 10, padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none' }} />
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 580, overflow: 'hidden', boxShadow: 'var(--card-shadow-hover)' }}>
        <div style={{ background: 'linear-gradient(135deg, var(--forest), var(--forest-light))', padding: 32 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>Auto-cadastro</p>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: 'white', marginBottom: 4 }}>Cadastre seu negócio</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Condomínio Reserva Laguna · Parceiro indicado</div>
        </div>

        <div style={{ padding: '28px 32px 32px', maxHeight: '70vh', overflowY: 'auto' }}>
          {done ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: 'var(--forest)', marginBottom: 8 }}>Cadastro enviado!</div>
              <p style={{ fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.7 }}>Seu cadastro foi recebido e será analisado pelo administrador do condomínio em até 48h. Você receberá uma notificação quando for aprovado.</p>
            </div>
          ) : (
            <>
              <div style={{ background: 'var(--gold-pale)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: 'var(--text-mid)' }}>
                📋 Após enviar, seu cadastro será analisado pelo administrador e publicado em até 48h.
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ gridColumn: '1/-1' }}>{inp('Nome / Empresa *', 'name', 'Seu nome ou razão social')}</div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-mid)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Tipo *</label>
                  <select value={form.type} onChange={e => set('type', e.target.value)} style={{ width: '100%', background: 'var(--cream)', border: '1.5px solid var(--cream-dark)', borderRadius: 10, padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none', marginBottom: 16 }}>
                    <option value="autonomo">Autônomo / Profissional</option>
                    <option value="empresa">Empresa / CNPJ</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-mid)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Seção *</label>
                  <select value={form.section} onChange={e => set('section', e.target.value)} style={{ width: '100%', background: 'var(--cream)', border: '1.5px solid var(--cream-dark)', borderRadius: 10, padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none', marginBottom: 16 }}>
                    <option value="servicos">Prestadores de Serviço</option>
                    <option value="obras">Obras & Construção</option>
                  </select>
                </div>
              </div>

              {inp('Categoria *', 'category', 'Ex: Eletricista, Jardineiro...')}

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-mid)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Descrição dos serviços *</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Descreva seus serviços, experiência e diferenciais..."
                  style={{ width: '100%', minHeight: 80, background: 'var(--cream)', border: '1.5px solid var(--cream-dark)', borderRadius: 10, padding: '12px 16px', fontFamily: "'DM Sans', sans-serif", fontSize: 14, resize: 'vertical', outline: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>{inp('WhatsApp *', 'whatsapp', '(00) 00000-0000', 'tel')}</div>
                <div>{inp('Instagram', 'instagram', '@seuperfil')}</div>
                <div>{inp('Site', 'website', 'www.seusite.com.br', 'url')}</div>
                <div>{inp('Cidade / Região', 'city', 'Ex: Campinas e região')}</div>
              </div>

              {inp('E-mail para notificações', 'email', 'seu@email.com', 'email')}

              <button onClick={submit} disabled={loading}
                style={{ width: '100%', background: 'var(--forest)', color: 'white', border: 'none', borderRadius: 12, padding: 14, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>
                {loading ? 'Enviando...' : 'Enviar cadastro para aprovação ✦'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
