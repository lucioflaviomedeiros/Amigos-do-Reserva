'use client'
import { useState, useEffect, useCallback } from 'react'
import type { Supplier, Profile } from '@/lib/types'
import { createClient } from '@/lib/supabase-client'
import SupplierCard from './SupplierCard'
import SupplierModal from './SupplierModal'
import LoginModal from './LoginModal'
import IndicateModal from './IndicateModal'

const CATEGORIES = {
  obras: [
    { id: 'ferragens', name: 'Ferragens', icon: '🔩' },
    { id: 'concreto', name: 'Concreto Usinado', icon: '🪨' },
    { id: 'tijolos', name: 'Tijolos & Blocos', icon: '🧱' },
    { id: 'areia', name: 'Areia e Brita', icon: '⛏️' },
    { id: 'cimento', name: 'Cimento & Argamassa', icon: '🪣' },
    { id: 'esquadrias', name: 'Esquadrias', icon: '🪟' },
    { id: 'tintas', name: 'Tintas', icon: '🎨' },
    { id: 'gesso', name: 'Gesso & Drywall', icon: '🏗️' },
    { id: 'marmoraria', name: 'Marmoraria', icon: '🪨' },
    { id: 'piscinas', name: 'Piscinas & Spas', icon: '🏊' },
    { id: 'automacao', name: 'Automação', icon: '🤖' },
    { id: 'solar', name: 'Energia Solar', icon: '☀️' },
    { id: 'vidracaria', name: 'Vidraçaria', icon: '🔷' },
    { id: 'marcenaria', name: 'Marcenaria', icon: '🪵' },
    { id: 'serralheria', name: 'Serralheria', icon: '⚙️' },
    { id: 'coberturas', name: 'Coberturas', icon: '🏠' },
    { id: 'impermeabilizacao', name: 'Impermeabilização', icon: '💧' },
    { id: 'paisagismo', name: 'Paisagismo', icon: '🌿' },
    { id: 'iluminacao', name: 'Iluminação', icon: '💡' },
    { id: 'revestimentos', name: 'Revestimentos', icon: '🟫' },
    { id: 'pisos', name: 'Pisos & Porcelanatos', icon: '🟦' },
    { id: 'arcondicionado', name: 'Ar-condicionado', icon: '❄️' },
    { id: 'seguranca', name: 'Segurança Eletrônica', icon: '🔒' },
    { id: 'internet', name: 'Internet & Redes', icon: '📡' },
    { id: 'arquitetura', name: 'Escritório de Arquitetura', icon: '📐' },
    { id: 'engenharia', name: 'Escritório de Engenharia', icon: '📏' },
    { id: 'construtoras', name: 'Construtoras', icon: '🏢' },
    { id: 'mudancas', name: 'Mudanças & Transporte', icon: '🚛' },
    { id: 'limpeza', name: 'Limpeza Pós Obra', icon: '🧹' },
    { id: 'moveis', name: 'Móveis Planejados', icon: '🛋️' },
  ],
  servicos: [
    { id: 'arquiteto', name: 'Arquiteto', icon: '📐' },
    { id: 'engenheiro', name: 'Engenheiro', icon: '👷' },
    { id: 'bombeiro', name: 'Bombeiro Hidráulico', icon: '🚿' },
    { id: 'eletricista', name: 'Eletricista', icon: '⚡' },
    { id: 'pedreiro', name: 'Pedreiro', icon: '🧱' },
    { id: 'pintor', name: 'Pintor', icon: '🖌️' },
    { id: 'gesseiro', name: 'Gesseiro', icon: '🔆' },
    { id: 'marceneiro', name: 'Marceneiro', icon: '🪵' },
    { id: 'serralheiro', name: 'Serralheiro', icon: '⚙️' },
    { id: 'jardineiro', name: 'Jardineiro', icon: '🌿' },
    { id: 'piscineiro', name: 'Piscineiro', icon: '🏊' },
    { id: 'faxineira', name: 'Faxineira', icon: '🧽' },
    { id: 'empregada', name: 'Empregada Doméstica', icon: '🏠' },
    { id: 'baba', name: 'Babá', icon: '👶' },
    { id: 'cuidador', name: 'Cuidador de Idosos', icon: '❤️' },
    { id: 'personal', name: 'Personal Trainer', icon: '💪' },
    { id: 'professor', name: 'Professor Particular', icon: '📚' },
    { id: 'tenis', name: 'Instrutor de Tênis', icon: '🎾' },
    { id: 'natacao', name: 'Instrutor de Natação', icon: '🏊‍♀️' },
    { id: 'fisio', name: 'Fisioterapeuta', icon: '🦴' },
    { id: 'nutri', name: 'Nutricionista', icon: '🥗' },
    { id: 'ti', name: 'Técnico de TI', icon: '💻' },
    { id: 'chaveiro', name: 'Chaveiro', icon: '🔑' },
    { id: 'motorista', name: 'Motorista Particular', icon: '🚗' },
    { id: 'dogwalker', name: 'Dog Walker', icon: '🐕' },
    { id: 'adestrador', name: 'Adestrador de Cães', icon: '🐾' },
    { id: 'chef', name: 'Chef / Cozinheiro', icon: '👨‍🍳' },
    { id: 'organizador', name: 'Organizador Residencial', icon: '📦' },
    { id: 'fotografo', name: 'Fotógrafo', icon: '📷' },
    { id: 'dj', name: 'DJ / Eventos', icon: '🎵' },
    { id: 'decorador', name: 'Decorador', icon: '🪴' },
    { id: 'segurancaprivado', name: 'Segurança Particular', icon: '🛡️' },
  ],
}

interface Props {
  initialSuppliers: Supplier[]
  profile: Profile | null
  initialFavorites: string[]
}

export default function PlatformClient({ initialSuppliers, profile, initialFavorites }: Props) {
  const [section, setSection]           = useState<'obras' | 'servicos'>('obras')
  const [activeCategory, setCategory]   = useState('all')
  const [searchQuery, setSearchQuery]   = useState('')
  const [sortBy, setSortBy]             = useState<'rating' | 'recent' | 'recommended'>('rating')
  const [suppliers]                     = useState(initialSuppliers)
  const [favorites, setFavorites]       = useState<Set<string>>(new Set(initialFavorites))
  const [openSupplier, setOpenSupplier] = useState<Supplier | null>(null)
  const [loginOpen, setLoginOpen]       = useState(false)
  const [indicateOpen, setIndicateOpen] = useState(false)
  const [toast, setToast]               = useState('')
  const supabase = createClient()

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2800)
  }, [])

  // Listen to header events
  useEffect(() => {
    const onSearch  = (e: Event) => setSearchQuery((e as CustomEvent).detail)
    const onLogin   = () => setLoginOpen(true)
    const onIndicate = () => {
      if (!profile) { setLoginOpen(true); return }
      setIndicateOpen(true)
    }
    window.addEventListener('platform-search', onSearch)
    window.addEventListener('open-login', onLogin)
    window.addEventListener('open-indicate', onIndicate)
    return () => {
      window.removeEventListener('platform-search', onSearch)
      window.removeEventListener('open-login', onLogin)
      window.removeEventListener('open-indicate', onIndicate)
    }
  }, [profile])

  // Filter + sort suppliers
  const filtered = suppliers
    .filter(s => s.section === section)
    .filter(s => activeCategory === 'all' || s.category === activeCategory)
    .filter(s => {
      if (!searchQuery) return true
      const q = searchQuery.toLowerCase()
      return s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.avg_rating - a.avg_rating
      if (sortBy === 'recent') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      return b.review_count - a.review_count
    })

  const topRated = suppliers.filter(s => s.section === section && (s.featured || s.avg_rating >= 4.8))
    .sort((a, b) => b.avg_rating - a.avg_rating).slice(0, 6)

  async function toggleFavorite(supplierId: string) {
    if (!profile) { setLoginOpen(true); return }
    if (favorites.has(supplierId)) {
      await supabase.from('favorites').delete().match({ supplier_id: supplierId, user_id: profile.id })
      setFavorites(prev => { const n = new Set(prev); n.delete(supplierId); return n })
      showToast('Removido dos favoritos')
    } else {
      await supabase.from('favorites').insert({ supplier_id: supplierId, user_id: profile.id })
      setFavorites(prev => new Set([...prev, supplierId]))
      showToast('❤️ Adicionado aos favoritos!')
    }
  }

  const cats = CATEGORIES[section]

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px 100px' }}>

      {/* Section tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'white', borderRadius: 50, padding: 4, boxShadow: 'var(--card-shadow)', marginBottom: 36, width: 'fit-content' }}>
        {(['obras', 'servicos'] as const).map((sec, i) => (
          <button key={sec} onClick={() => { setSection(sec); setCategory('all') }}
            style={{
              padding: '10px 24px', borderRadius: 46, border: 'none',
              background: section === sec ? 'var(--forest)' : 'transparent',
              color: section === sec ? 'white' : 'var(--text-mid)',
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, cursor: 'pointer',
              boxShadow: section === sec ? '0 2px 12px rgba(26,46,30,0.25)' : 'none',
              transition: 'all 0.25s',
            }}>
            {i === 0 ? '🏗️ Obras & Construção' : '🔧 Prestadores de Serviço'}
          </button>
        ))}
      </div>

      {/* Top rated horizontal scroll */}
      {topRated.length > 0 && (
        <>
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 4 }}>★ Destaque da comunidade</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 500, color: 'var(--forest)' }}>Mais bem avaliados</h2>
          </div>
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8, marginBottom: 40, scrollbarWidth: 'none' }}>
            {topRated.map(s => (
              <div key={s.id} onClick={() => setOpenSupplier(s)}
                style={{
                  flex: '0 0 200px', background: 'white', borderRadius: 'var(--radius)',
                  boxShadow: 'var(--card-shadow)', padding: 20, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', textAlign: 'center', gap: 8, cursor: 'pointer',
                  transition: 'all 0.3s', border: '1px solid transparent',
                }}
                onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--card-shadow-hover)' }}
                onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--card-shadow)' }}
              >
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, var(--forest-light), var(--forest))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, border: '2px solid var(--gold-pale)' }}>
                  {cats.find(c => c.id === s.category)?.icon ?? '🔧'}
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 500, color: 'var(--forest)', lineHeight: 1.2 }}>{s.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.category}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: 'var(--gold)' }}>{'★'.repeat(Math.round(s.avg_rating))}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--gold)' }}>{s.avg_rating.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Category chips */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 24, scrollbarWidth: 'none' }}>
        <div onClick={() => setCategory('all')} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 40, background: activeCategory === 'all' ? 'var(--forest)' : 'white', border: `1.5px solid ${activeCategory === 'all' ? 'var(--forest)' : 'var(--cream-dark)'}`, color: activeCategory === 'all' ? 'white' : 'var(--text-mid)', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0 }}>
          ✦ Todos
        </div>
        {cats.map(c => (
          <div key={c.id} onClick={() => setCategory(c.id)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 40, background: activeCategory === c.id ? 'var(--forest)' : 'white', border: `1.5px solid ${activeCategory === c.id ? 'var(--forest)' : 'var(--cream-dark)'}`, color: activeCategory === c.id ? 'white' : 'var(--text-mid)', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0 }}>
            <span>{c.icon}</span> {c.name}
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, color: 'var(--text-light)', fontWeight: 500 }}>Ordenar por:</span>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
          style={{ background: 'white', border: '1.5px solid var(--cream-dark)', borderRadius: 40, padding: '7px 14px', fontFamily: "'DM Sans', sans-serif", fontSize: 13, cursor: 'pointer', outline: 'none' }}>
          <option value="rating">Melhor avaliação</option>
          <option value="recent">Mais recentes</option>
          <option value="recommended">Mais recomendados</option>
        </select>
        <span style={{ fontSize: 13, color: 'var(--text-light)', marginLeft: 'auto' }}>{filtered.length} encontrado{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-light)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: 'var(--forest)', marginBottom: 8 }}>Nenhum resultado</p>
          <p style={{ fontSize: 14 }}>Seja o primeiro a indicar um profissional nessa categoria!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {filtered.map(s => (
            <SupplierCard
              key={s.id}
              supplier={s}
              catIcon={cats.find(c => c.id === s.category)?.icon ?? '🔧'}
              isFavorited={favorites.has(s.id)}
              onOpen={() => setOpenSupplier(s)}
              onToggleFav={() => toggleFavorite(s.id)}
              onShare={() => {
                const url = `${window.location.origin}/perfil/${s.id}`
                navigator.clipboard.writeText(url).then(() => showToast('✅ Link copiado!'))
              }}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {openSupplier && (
        <SupplierModal
          supplier={openSupplier}
          profile={profile}
          catIcon={cats.find(c => c.id === openSupplier.category)?.icon ?? '🔧'}
          isFavorited={favorites.has(openSupplier.id)}
          onClose={() => setOpenSupplier(null)}
          onToggleFav={() => toggleFavorite(openSupplier.id)}
          showToast={showToast}
        />
      )}

      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
      {indicateOpen && <IndicateModal profile={profile} onClose={() => setIndicateOpen(false)} showToast={showToast} />}

      {/* Bottom nav mobile */}
      <nav style={{
        display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'white', borderTop: '1px solid var(--cream-dark)',
        padding: '10px 0 env(safe-area-inset-bottom, 10px)', zIndex: 90,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
      }} className="bottom-nav">
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {[
            { label: 'Início', icon: '🏠', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
            { label: 'Buscar', icon: '🔍', action: () => {} },
            { label: 'Indicar', icon: '➕', action: () => window.dispatchEvent(new CustomEvent('open-indicate')) },
            { label: 'Favoritos', icon: '❤️', action: () => {} },
            { label: profile ? profile.full_name.split(' ')[0] : 'Entrar', icon: '👤', action: () => profile ? null : setLoginOpen(true) },
          ].map(item => (
            <button key={item.label} onClick={item.action}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 12px', cursor: 'pointer', color: 'var(--text-light)', fontSize: 10, fontWeight: 500, background: 'none', border: 'none', fontFamily: "'DM Sans', sans-serif" }}>
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--forest)', color: 'white', padding: '12px 24px',
          borderRadius: 40, fontSize: 14, fontWeight: 500, zIndex: 300,
          whiteSpace: 'nowrap', animation: 'slideUp 0.3s ease',
        }}>{toast}</div>
      )}

      <style>{`.bottom-nav { display: block !important; } @media (min-width: 769px) { .bottom-nav { display: none !important; } }`}</style>
    </main>
  )
}
