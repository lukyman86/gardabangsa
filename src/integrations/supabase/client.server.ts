import { createServerClient } from '@supabase/ssr'
import { getCookies, setCookie } from '@tanstack/react-start/server'
import type { Database } from './types'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './client'

/**
 * Server Supabase client with cookie forwarding for SSR (loaders).
 * Reads cookies via getCookies() and writes refreshed auth cookies via
 * setCookie() onto the outgoing response.
 */
export function getSupabaseServerClient() {
  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
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
