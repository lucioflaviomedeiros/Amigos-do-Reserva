import { createClient } from '@/lib/supabase-server'
import { getProfile } from '@/lib/auth'
import Header from '@/components/ui/Header'
import CoverBanner from '@/components/ui/CoverBanner'
import NoticeBar from '@/components/ui/NoticeBar'
import Hero from '@/components/ui/Hero'
import PlatformClient from '@/components/ui/PlatformClient'
import AuthHandler from '@/components/ui/AuthHandler'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = createClient()
  const profile = await getProfile()

  const { data: suppliers } = await supabase
    .from('suppliers')
    .select('*')
    .eq('status', 'approved')
    .order('featured', { ascending: false })
    .order('avg_rating', { ascending: false })

  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 'singleton')
    .single()

  let favorites: string[] = []
  if (profile) {
    const { data: favData } = await supabase
      .from('favorites')
      .select('supplier_id')
      .eq('user_id', profile.id)
    favorites = favData?.map((f: any) => f.supplier_id) ?? []
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <AuthHandler />
      <Header profile={profile} />
      <CoverBanner coverUrl={settings?.cover_photo_url ?? null} isAdmin={profile?.role === 'admin'} />
      <NoticeBar text={settings?.notice_text ?? ''} />
      <Hero suppliersCount={suppliers?.length ?? 0} />
      <PlatformClient
        initialSuppliers={suppliers ?? []}
        profile={profile}
        initialFavorites={favorites}
      />
    </div>
  )
}
