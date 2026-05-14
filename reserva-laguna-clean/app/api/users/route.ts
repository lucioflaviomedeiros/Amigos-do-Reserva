import { createAdminClient, createClient } from '@/lib/supabase-server'
import { requireAdmin } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

export async function POST(request: Request) {
  try { await requireAdmin() } catch { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  const { full_name, unit, phone } = await request.json()
  if (!full_name || !unit) return NextResponse.json({ error: 'full_name and unit required' }, { status: 400 })
  const token = randomBytes(24).toString('hex')
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('invites').insert({
    token, full_name, unit, phone: phone ?? null, status: 'invited',
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  return NextResponse.json({ invite: data, link: `${appUrl}/convite/${token}` })
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 })
  const supabase = createClient()
  const { data, error } = await supabase.from('invites').select('*').eq('token', token).single()
  if (error || !data) return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
  if (data.status === 'revoked') return NextResponse.json({ error: 'Revoked' }, { status: 410 })
  if (new Date(data.expires_at) < new Date()) return NextResponse.json({ error: 'Expired' }, { status: 410 })
  return NextResponse.json({ invite: data })
}
