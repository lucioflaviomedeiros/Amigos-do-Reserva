'use client'
import type { Supplier } from '@/lib/types'

interface Props {
  supplier: Supplier
  catIcon: string
  isFavorited: boolean
  onOpen: () => void
  onToggleFav: () => void
  onShare: () => void
}

function Stars({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize: size, color: i <= Math.round(rating) ? 'var(--gold)' : '#ddd' }}>★</span>
      ))}
    </span>
  )
}

export default function SupplierCard({ supplier: s, catIcon, isFavorited, onOpen, onToggleFav, onShare }: Props) {
  return (
    <div onClick={onOpen} style={{
      background: 'white', borderRadius: 'var(--radius)',
      boxShadow: 'var(--card-shadow)', overflow: 'hidden',
      cursor: 'pointer', position: 'relative',
      border: '1px solid transparent',
      transition: 'all 0.3s ease', animation: 'fadeIn 0.4s ease both',
    }}
      onMouseOver={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = 'var(--card-shadow-hover)'; el.style.borderColor = 'rgba(201,168,76,0.2)' }}
      onMouseOut={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = ''; el.style.boxShadow = 'var(--card-shadow)'; el.style.borderColor = 'transparent' }}
    >
      {/* Badges */}
      <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', flexDirection: 'column', gap: 5, zIndex: 2 }}>
        {s.verified && <span style={{ background: 'var(--forest)', color: 'var(--gold-light)', padding: '3px 9px', borderRadius: 20, fontSize: 10, fontWeight: 600 }}>✓ Verificado</span>}
        {s.featured && <span style={{ background: 'var(--gold)', color: 'var(--forest)', padding: '3px 9px', borderRadius: 20, fontSize: 10, fontWeight: 600 }}>⭐ Destaque</span>}
      </div>

      {/* Fav button */}
      <button onClick={e => { e.stopPropagation(); onToggleFav() }}
        style={{ position: 'absolute', top: 14, right: 14, zIndex: 2, width: 34, height: 34, background: 'rgba(255,255,255,0.92)', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16 }}>
        {isFavorited ? '❤️' : '🤍'}
      </button>

      {/* Image area */}
      <div style={{ height: 160, background: 'linear-gradient(135deg, var(--forest-light), var(--forest))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, position: 'relative' }}>
        {catIcon}
        <span style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(201,168,76,0.9)', color: 'var(--forest)', fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, textTransform: 'uppercase' }}>{s.category}</span>
      </div>

      {/* Body */}
      <div style={{ padding: '18px 18px 14px' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: 'var(--forest)', marginBottom: 4, lineHeight: 1.2 }}>{s.name}</div>
        <div style={{ fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.5, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontWeight: 300 }}>{s.description}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
          <Stars rating={s.avg_rating} />
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--forest)' }}>{s.avg_rating.toFixed(1)}</span>
          <span style={{ fontSize: 12, color: 'var(--text-light)' }}>({s.review_count} avaliações)</span>
        </div>

        {/* Footer buttons */}
        <div style={{ display: 'flex', gap: 8, paddingTop: 14, borderTop: '1px solid var(--cream-dark)' }}>
          {s.whatsapp && (
            <a href={`https://wa.me/55${s.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: '#25D366', color: 'white', border: 'none', borderRadius: 10, padding: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              WhatsApp
            </a>
          )}
          <button onClick={e => { e.stopPropagation(); onOpen() }}
            style={{ flex: 1, background: 'var(--cream)', color: 'var(--forest)', border: '1.5px solid var(--cream-dark)', borderRadius: 10, padding: 10, fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Ver perfil
          </button>
          <button onClick={e => { e.stopPropagation(); onShare() }}
            title="Compartilhar"
            style={{ flex: '0 0 auto', background: 'var(--cream)', border: '1.5px solid var(--cream-dark)', borderRadius: 10, padding: '10px 12px', cursor: 'pointer', fontSize: 15 }}>
            ↗
          </button>
        </div>
      </div>
    </div>
  )
}
