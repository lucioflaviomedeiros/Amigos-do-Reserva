interface Props { suppliersCount: number }

export default function Hero({ suppliersCount }: Props) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--forest) 0%, var(--forest-light) 60%, #3d5a42 100%)',
      padding: '40px 20px 48px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -60, right: -60, width: 320, height: 320,
        background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>
          ✦ Lagoa dos Ingleses — Comunidade Reserva Laguna
        </p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(32px,5vw,52px)', fontWeight: 400, color: 'white', lineHeight: 1.15, marginBottom: 32 }}>
          Fornecedores de<br /><em style={{ color: 'var(--gold-light)' }}>confiança</em>, indicados<br />pelos moradores
        </h1>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          {[
            { num: suppliersCount || 87, label: 'Fornecedores' },
            { num: '4.8', label: 'Nota média' },
            { num: '100%', label: 'Indicados por moradores' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 500, color: 'var(--gold-light)', lineHeight: 1 }}>{s.num}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
