'use client'
import { useRef, useState } from 'react'
import Image from 'next/image'

interface Props {
  coverUrl: string | null
  isAdmin: boolean
}

export default function CoverBanner({ coverUrl, isAdmin }: Props) {
  const [src, setSrc] = useState(coverUrl)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/cover', { method: 'POST', body: form })
      const data = await res.json()
      if (data.url) setSrc(data.url)
    } catch {}
    setUploading(false)
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: 220, overflow: 'hidden', background: 'var(--forest-light)' }}>
      {src ? (
        <Image src={src} alt="Capa Reserva Laguna" fill style={{ objectFit: 'cover', objectPosition: 'center 40%' }} priority />
      ) : (
        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--forest) 0%, var(--forest-light) 100%)' }} />
      )}

      {/* Forest tint overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(26,46,30,0.75) 0%, rgba(45,64,51,0.60) 50%, rgba(26,46,30,0.70) 100%)',
        mixBlendMode: 'multiply',
      }} />
      {/* Bottom fade to cream */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, transparent 55%, var(--cream) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Admin edit button */}
      {isAdmin && (
        <div style={{ position: 'absolute', bottom: 14, right: 14, zIndex: 5 }}>
          <label style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(26,46,30,0.8)', color: 'var(--gold-light)',
            border: '1px solid rgba(201,168,76,0.5)',
            borderRadius: 8, padding: '7px 14px',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            backdropFilter: 'blur(4px)',
          }}>
            {uploading ? '⏳ Enviando...' : '🖼 Trocar foto de capa'}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </label>
        </div>
      )}
    </div>
  )
}
