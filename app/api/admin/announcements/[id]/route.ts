import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createClient as createServiceClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 500 })
    }

    // Await params if it's a Promise (Next.js 13+)
    const resolvedParams = await Promise.resolve(params)
    const id = resolvedParams?.id
    if (!id) {
      return NextResponse.json({ error: 'Missing announcement ID' }, { status: 400 })
    }

    const cookieStore = cookies()
    const rawCookieHeader = request.headers.get('cookie') || ''

    const parseCookieHeader = (header: string) =>
      header
        .split(';')
        .map((c) => c.trim())
        .filter(Boolean)
        .map((pair) => {
          const idx = pair.indexOf('=')
          const name = idx > -1 ? pair.slice(0, idx) : pair
          const value = idx > -1 ? pair.slice(idx + 1) : ''
          return { name: name.trim(), value: decodeURIComponent(value) }
        })

    const cookieBridge = {
      getAll() {
        try {
          if (typeof (cookieStore as any).getAll === 'function') {
            return (cookieStore as any).getAll()
          }
        } catch (e) {
          // ignore and fallback
        }
        return parseCookieHeader(rawCookieHeader)
      },
      setAll() {},
    }

    const serverSupabase = createServerClient(SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      cookies: cookieBridge,
    })

    const { data: { user } } = await serverSupabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const { data: admins } = await serverSupabase.from('admins').select('id').eq('id', user.id).limit(1)
    if (!admins || admins.length === 0) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const { title, content, is_active, image_url } = body

    const service = createServiceClient(SUPABASE_URL, SERVICE_ROLE_KEY)

    const { data, error } = await service
      .from('announcements')
      .update({ title, content, is_active, image_url, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ data }, { status: 200 })
  } catch (err: any) {
    console.error('PUT /api/admin/announcements/[id] error:', err)
    const isProd = process.env.NODE_ENV === 'production'
    return NextResponse.json(
      { error: err?.message || 'Unknown error', stack: isProd ? undefined : err?.stack },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'Missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 500 })
    }

    // Await params if it's a Promise (Next.js 13+)
    const resolvedParams = await Promise.resolve(params)
    const id = resolvedParams?.id
    if (!id) {
      return NextResponse.json({ error: 'Missing announcement ID' }, { status: 400 })
    }

    const cookieStore = cookies()
    const serverSupabase = createServerClient(SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {},
      },
    })

    const { data: { user } } = await serverSupabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    const { data: admins } = await serverSupabase.from('admins').select('id').eq('id', user.id).limit(1)
    if (!admins || admins.length === 0) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const service = createServiceClient(SUPABASE_URL, SERVICE_ROLE_KEY)
    const { error } = await service.from('announcements').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err: any) {
    console.error('DELETE /api/admin/announcements/[id] error:', err)
    const isProd = process.env.NODE_ENV === 'production'
    return NextResponse.json(
      { error: err?.message || 'Unknown error', stack: isProd ? undefined : err?.stack },
      { status: 500 }
    )
  }
}
