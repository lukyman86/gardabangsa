import { createServerClient } from '@supabase/ssr'
import { getCookies, setCookie } from '@tanstack/react-start/server'
import type { Database } from './types'
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './client'

export const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY as string
export const SUPABASE_JWKS_URL = process.env.SUPABASE_JWKS_URL as string

if (!SUPABASE_SECRET_KEY || !SUPABASE_JWKS_URL) {
  console.warn(
    '[supabase] SUPABASE_SECRET_KEY / SUPABASE_JWKS_URL belum diisi di .env',
  )
}

/**
 * Server Supabase client with cookie forwarding for SSR (loaders).
 * Reads cookies via getCookies() and writes refreshed auth cookies via
 * setCookie() onto the outgoing response.
 */
export function getSupabaseServerClient() {
  return createServerClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        const cookies = getCookies()
        return Object.entries(cookies).map(([name, value]) => ({ name, value }))
      },
      setAll(
        cookieList: {
          name: string
          value: string
          options?: Record<string, unknown>
        }[],
      ) {
        for (const { name, value, options } of cookieList) {
          setCookie(name, value, options)
        }
      },
    },
  })
}
