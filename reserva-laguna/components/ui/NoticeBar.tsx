// NoticeBar.tsx
export default function NoticeBar({ text }: { text: string }) {
  if (!text) return null
  return (
    <div style={{ background: 'var(--gold-pale)', borderBottom: '1px solid rgba(201,168,76,0.3)', padding: '10px 20px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 8, height: 8, background: 'var(--gold)', borderRadius: '50%', flexShrink: 0,
          animation: 'pulse 2s infinite',
        }} />
        <p style={{ fontSize: 13, color: 'var(--text-mid)' }}>
          <strong style={{ color: 'var(--forest)' }}>Aviso do Condomínio:</strong> {text}
        </p>
      </div>
    </div>
  )
}
