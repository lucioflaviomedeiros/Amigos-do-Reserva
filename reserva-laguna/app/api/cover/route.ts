import { createAdminClient } from '@/lib/supabase-server'
import { requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try { await requireAdmin() } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const form = await request.formData()
  const file = form.get('file') as File
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const supabase = await createAdminClient()
  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `cover.${ext}`

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const { error } = await supabase.storage
    .from('cover-photo')
    .upload(path, buffer, { upsert: true, contentType: file.type })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = supabase.storage.from('cover-photo').getPublicUrl(path)

  await supabase.from('site_settings')
    .upsert({ id: 'singleton', cover_photo_url: publicUrl, updated_at: new Date().toISOString() })

  return NextResponse.json({ url: publicUrl })
}
