'use client'
import { useState, useEffect } from 'react'
import type { Supplier, Profile, Review } from '@/lib/types'
import { createClient } from '@/lib/supabase-client'

interface Props {
  supplier: Supplier
  profile: Profile | null
  catIcon: string
  isFavorited: boolean
  onClose: () => void
  onToggleFav: () => void
  showToast: (msg: string) => void
}

export default function SupplierModal({ supplier: s, profile, catIcon, isFavorited, onClose, onToggleFav, showToast }: Props) {
  const [reviews, setReviews]   = useState<Review[]>([])
  const [myRating, setMyRating] = useState(0)
  const [comment, setComment]   = useState('')
  const [submitting, setSubmitting] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('reviews').select('*, user:profiles(full_name, unit)').eq('supplier_id', s.id).eq('approved', true).order('created_at', { ascending: false })
      .then(({ data }) => setReviews(data ?? []))
  }, [s.id])

  async function submitReview() {
    if (!profile) { showToast('⚠️ Faça login para avaliar'); return }
    if (profile.role !== 'morador') { showToast('⚠️ Somente moradores podem avaliar'); return }
    if (!myRating) { showToast('⚠️ Selecione uma nota'); return }
    if (!comment.trim()) { showToast('⚠️ Escreva um comentário'); return }
    setSubmitting(true)
    const { error } = await supabase.from('reviews').upsert({
      supplier_id: s.id, user_id: profile.id, rating: myRating, comment: comment.trim(), approved: false,
    })
    setSubmitting(false)
    if (error) { showToast('Erro ao enviar avaliação'); return }
    setComment(''); setMyRating(0)
    showToast('✅ Avaliação enviada! Aguarda aprovação.')
  }

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/perfil/${s.id}`

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(26,46,30,0.6)', zIndex: 200, padding: 20, overflowY: 'auto', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 640, overflow: 'hidden', margin: 'auto', animation: 'slideUp 0.3s ease' }}>

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, var(--forest), var(--forest-light))', padding: '40px 32px 32px', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', fontSize: 18 }}>✕</button>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, marginBottom: 16, border: '2px solid rgba(201,168,76,0.5)' }}>{catIcon}</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 400, color: 'white', marginBottom: 6 }}>{s.name}</div>
          <div style={{ fontSize: 12, color: 'var(--gold-light)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{s.category} · {s.city}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            {s.verified && <span style={{ background: 'var(--gold)', color: 'var(--forest)', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>✓ Verificado</span>}
            {s.featured && <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>⭐ Destaque</span>}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 32px' }}>

          {/* Rating bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20, background: 'var(--cream)', borderRadius: 'var(--radius-sm)', marginBottom: 24 }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 44, fontWeight: 300, color: 'var(--forest)', lineHeight: 1 }}>{s.avg_rating.toFixed(1)}</div>
            <div>
              <div style={{ display: 'flex', gap: 3 }}>{[1,2,3,4,5].map(i => <span key={i} style={{ fontSize: 20, color: i <= Math.round(s.avg_rating) ? 'var(--gold)' : '#ddd' }}>★</span>)}</div>
              <div style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 4 }}>{s.review_count} avaliações de moradores</div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
            {s.whatsapp && (
              <a href={`https://wa.me/55${s.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                style={{ flex: 1, minWidth: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#25D366', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', padding: '14px 20px', fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                WhatsApp
              </a>
            )}
            <button onClick={onToggleFav} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--cream)', color: 'var(--text-dark)', border: '1.5px solid var(--cream-dark)', borderRadius: 'var(--radius-sm)', padding: '14px 20px', fontFamily: "'DM Sans', sans-serif", fontSize: 15, cursor: 'pointer' }}>
              {isFavorited ? '❤️ Favoritado' : '🤍 Favoritar'}
            </button>
            <button onClick={() => { navigator.clipboard.writeText(shareUrl); showToast('✅ Link copiado!') }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'var(--cream)', color: 'var(--text-dark)', border: '1.5px solid var(--cream-dark)', borderRadius: 'var(--radius-sm)', padding: '14px 20px', fontFamily: "'DM Sans', sans-serif", fontSize: 15, cursor: 'pointer' }}>
              ↗ Compartilhar
            </button>
          </div>

          {/* Info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'Telefone', value: s.phone },
              { label: 'Cidade', value: s.city ? `${s.city}, MG` : null },
              { label: 'Instagram', value: s.instagram },
              { label: 'Site', value: s.website },
            ].filter(i => i.value).map(i => (
              <div key={i.label}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--text-light)', fontWeight: 600, marginBottom: 3 }}>{i.label}</div>
                <div style={{ fontSize: 14, color: 'var(--text-dark)', fontWeight: 500 }}>{i.value}</div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 14, color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: 24, fontWeight: 300 }}>{s.description}</p>

          {/* Reviews */}
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 500, color: 'var(--forest)', marginBottom: 16 }}>Avaliações dos moradores</div>
          {reviews.length === 0 && <p style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 16 }}>Ainda sem avaliações. Seja o primeiro!</p>}
          {reviews.map(r => (
            <div key={r.id} style={{ borderBottom: '1px solid var(--cream-dark)', padding: '16px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--forest-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-light)', fontSize: 14, fontWeight: 600 }}>
                  {(r.user as any)?.full_name?.[0] ?? '?'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--forest)' }}>{(r.user as any)?.full_name ?? 'Morador'} · <small style={{ fontWeight: 400, color: 'var(--text-light)' }}>{(r.user as any)?.unit}</small></div>
                  <div style={{ fontSize: 11, color: 'var(--text-light)' }}>{new Date(r.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</div>
                </div>
                <div>{[1,2,3,4,5].map(i => <span key={i} style={{ fontSize: 13, color: i <= r.rating ? 'var(--gold)' : '#ddd' }}>★</span>)}</div>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.6 }}>{r.comment}</p>
            </div>
          ))}

          {/* Submit review */}
          {profile?.role === 'morador' && (
            <div style={{ marginTop: 24, padding: 20, background: 'var(--cream)', borderRadius: 'var(--radius-sm)', border: '1.5px dashed var(--cream-dark)' }}>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: 'var(--forest)', marginBottom: 12 }}>Avaliar este fornecedor</p>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {[1,2,3,4,5].map(n => (
                  <span key={n} onClick={() => setMyRating(n)} style={{ fontSize: 28, cursor: 'pointer', color: n <= myRating ? 'var(--gold)' : '#ddd', transition: 'color 0.15s' }}>★</span>
                ))}
              </div>
              <textarea value={comment} onChange={e => setComment(e.target.value)}
                placeholder="Conte sua experiência..."
                style={{ width: '100%', minHeight: 80, background: 'white', border: '1.5px solid var(--cream-dark)', borderRadius: 10, padding: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 14, resize: 'vertical', outline: 'none', marginBottom: 10 }} />
              <button onClick={submitReview} disabled={submitting}
                style={{ width: '100%', background: 'var(--forest)', color: 'white', border: 'none', borderRadius: 10, padding: 12, fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                {submitting ? 'Enviando...' : 'Enviar avaliação'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
