import { createAdminClient } from '@/lib/supabase-server'
import { requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request) {
  try { await requireAdmin() } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  const { id, approved } = await request.json()
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('reviews').update({ approved }).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(request: Request) {
  try { await requireAdmin() } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  const id = new URL(request.url).searchParams.get('id')
  const supabase = createAdminClient()
  const { error } = await supabase.from('reviews').delete().eq('id', id!)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
