import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type {
  AppRole,
  Tables,
} from '~/integrations/supabase/types'

async function getServer() {
  const { getSupabaseServerClient } = await import(
    '~/integrations/supabase/client.server'
  )
  return getSupabaseServerClient()
}

// ---------------------------------------------------------------- session
export interface SessionUser {
  id: string
  email: string | null
  fullName: string | null
  roles: AppRole[]
  role: AppRole
}

export const getServerSession = createServerFn({ method: 'GET' }).handler(
  async (): Promise<SessionUser | null> => {
    const supabase = await getServer()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)

    const roleList = (roles?.map((r) => r.role) ?? []) as AppRole[]
    const role: AppRole = roleList.includes('admin')
      ? 'admin'
      : roleList.includes('operator')
        ? 'operator'
        : 'anggota'

    return {
      id: user.id,
      email: user.email ?? null,
      fullName: (user.user_metadata?.full_name as string) ?? null,
      roles: roleList,
      role,
    }
  },
)

// ---------------------------------------------------------------- home
export const getHomeData = createServerFn({ method: 'GET' }).handler(
  async () => {
    const supabase = await getServer()
    const [news, agenda, count] = await Promise.all([
      supabase
        .from('news')
        .select(
          'id, title, slug, excerpt, cover_url, published_at',
        )
        .eq('published', true)
        .order('published_at', { ascending: false })
        .limit(3),
      supabase
        .from('agenda')
        .select('*')
        .gte('start_at', new Date().toISOString())
        .order('start_at', { ascending: true })
        .limit(4),
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active'),
    ])
    return {
      news: (news.data ?? []) as Tables<'news'>[],
      agenda: (agenda.data ?? []) as Tables<'agenda'>[],
      memberCount: count.count ?? 0,
    }
  },
)

// ---------------------------------------------------------------- galleries
export const getGalleries = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = await getServer()
  const { data } = await supabase
    .from('galleries')
    .select('*')
    .order('created_at', { ascending: false })
  return (data ?? []) as Tables<'galleries'>[]
})

// ---------------------------------------------------------------- documents
export const getDocuments = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = await getServer()
  const { data } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false })
  return (data ?? []) as Tables<'documents'>[]
})

// ---------------------------------------------------------------- cabangs
export const getCabangs = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = await getServer()
  const { data } = await supabase
    .from('cabang')
    .select('*')
    .order('name', { ascending: true })
  return (data ?? []) as Tables<'cabang'>[]
})

// ---------------------------------------------------------------- categories
export const getNewsCategories = createServerFn({ method: 'GET' })
  .validator(z.object({ scope: z.enum(['nasional', 'cabang']).optional() }))
  .handler(async ({ data }) => {
    const supabase = await getServer()
    let query = supabase.from('news_categories').select('*').order('name')
    if (data.scope) query = query.eq('scope', data.scope)
    const { data: rows } = await query
    return (rows ?? []) as Tables<'news_categories'>[]
  })

// ---------------------------------------------------------------- news list
const newsListInput = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
})

export const getNewsList = createServerFn({ method: 'GET' })
  .validator(newsListInput)
  .handler(async ({ data }) => {
    const supabase = await getServer()
    const pageSize = data.limit ?? 9
    const page = data.page ?? 1
    const offset = (page - 1) * pageSize

    let query = supabase
      .from('news')
      .select(
        'id, title, slug, excerpt, cover_url, published_at, news_categories(name, slug)',
        { count: 'exact' },
      )
      .eq('published', true)
      .order('published_at', { ascending: false })

    if (data.category) query = query.eq('news_categories.slug', data.category)
    if (data.q)
      query = query.or(`title.ilike.%${data.q}%,excerpt.ilike.%${data.q}%`)
    query = query.range(offset, offset + pageSize - 1)

    const { data: rows, count } = await query
    return {
      news: (rows ?? []) as any[],
      totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
    }
  })

// ---------------------------------------------------------------- news detail
export const getNewsDetail = createServerFn({ method: 'GET' })
  .validator(z.string())
  .handler(async ({ data: slug }) => {
    const supabase = await getServer()
    const { data, error } = await supabase
      .from('news')
      .select('*, news_categories(name, slug), profiles(full_name)')
      .eq('slug', slug)
      .eq('published', true)
      .single()
    if (error) throw error
    return data as any
  })

// ---------------------------------------------------------------- member count
export const getMemberCount = createServerFn({ method: 'GET' }).handler(
  async () => {
    const supabase = await getServer()
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
    return count ?? 0
  },
)
