import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
export const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  // Fail loud during development so misconfiguration is obvious.
  console.warn(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY belum diisi di .env',
  )
}

/**
 * Browser Supabase client. Used on the client after hydration and inside
 * client components / auth flows (login, register, reset password).
 */
export function getSupabaseBrowserClient() {
  return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
}

export const supabaseBrowser = getSupabaseBrowserClient()
