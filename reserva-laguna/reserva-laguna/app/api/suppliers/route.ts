import { createClient, createAdminClient } from '@/lib/supabase-server'
import { requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const status = url.searchParams.get('status') ?? 'approved'
  const section = url.searchParams.get('section')
  const supabase = createClient()
  let query = supabase.from('suppliers').select('*').eq('status', status)
  if (section) query = query.eq('section', section)
  const { data, error } = await query.order('featured', { ascending: false }).order('avg_rating', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(request: Request) {
  try { await requireAdmin() } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  const { id, ...updates } = await request.json()
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('suppliers').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(request: Request) {
  try { await requireAdmin() } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  const id = new URL(request.url).searchParams.get('id')
  const supabase = createAdminClient()
  const { error } = await supabase.from('suppliers').delete().eq('id', id!)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
