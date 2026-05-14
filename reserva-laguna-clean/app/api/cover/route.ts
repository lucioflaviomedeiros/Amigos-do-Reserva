import { createAdminClient } from '@/lib/supabase-server'
import { requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try { await requireAdmin() } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  const form = await request.formData()
  const file = form.get('file') as File
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
  const supabase = createAdminClient()
  const ext = file.name.split('.').pop() ?? 'jpg'
  const bytes = await file.arrayBuffer()
  const { error } = await supabase.storage.from('cover-photo').upload(`cover.${ext}`, Buffer.from(bytes), { upsert: true, contentType: file.type })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const { data: { publicUrl } } = supabase.storage.from('cover-photo').getPublicUrl(`cover.${ext}`)
  await supabase.from('site_settings').upsert({ id: 'singleton', cover_photo_url: publicUrl, updated_at: new Date().toISOString() })
  return NextResponse.json({ url: publicUrl })
}
