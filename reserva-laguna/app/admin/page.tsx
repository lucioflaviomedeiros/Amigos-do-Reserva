import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { createClient } from '@/lib/supabase-server'
import AdminClient from '@/components/admin/AdminClient'

export default async function AdminPage() {
  try {
    await requireAdmin()
  } catch {
    redirect('/')
  }

  const supabase = await createClient()

  const [
    { data: pendingSuppliers },
    { data: pendingReviews },
    { data: allSuppliers },
    { data: invites },
    { data: settings },
  ] = await Promise.all([
    supabase.from('suppliers').select('*').eq('status', 'pending').order('created_at', { ascending: false }),
    supabase.from('reviews').select('*, user:profiles(full_name,unit), supplier:suppliers(name)').eq('approved', false).order('created_at', { ascending: false }),
    supabase.from('suppliers').select('*').order('created_at', { ascending: false }),
    supabase.from('invites').select('*').order('created_at', { ascending: false }),
    supabase.from('site_settings').select('*').eq('id', 'singleton').single(),
  ])

  return (
    <AdminClient
      pendingSuppliers={pendingSuppliers ?? []}
      pendingReviews={pendingReviews ?? []}
      allSuppliers={allSuppliers ?? []}
      invites={invites ?? []}
      settings={settings}
    />
  )
}
