import { useEffect, useState, useCallback } from 'react'
import { supabaseBrowser } from '~/integrations/supabase/client'
import type { AppRole } from '~/integrations/supabase/types'

export interface AuthState {
  loading: boolean
  userId: string | null
  email: string | null
  fullName: string | null
  roles: AppRole[]
  role: AppRole
  isAuthed: boolean
  signOut: () => Promise<void>
}

export function useAuth(): AuthState {
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [fullName, setFullName] = useState<string | null>(null)
  const [roles, setRoles] = useState<AppRole[]>([])

  const refreshRoles = useCallback(async (uid: string) => {
    const { data } = await supabaseBrowser
      .from('user_roles')
      .select('role')
      .eq('user_id', uid)
    const list = (data?.map((r) => r.role) ?? []) as AppRole[]
    setRoles(list)
  }, [])

  useEffect(() => {
    let mounted = true
    supabaseBrowser.auth.getSession().then(({ data }) => {
      if (!mounted) return
      const user = data.session?.user ?? null
      setUserId(user?.id ?? null)
      setEmail(user?.email ?? null)
      setFullName((user?.user_metadata?.full_name as string) ?? null)
      setLoading(false)
      if (user) void refreshRoles(user.id)
    })

    const { data: sub } = supabaseBrowser.auth.onAuthStateChange((_e, session) => {
      const user = session?.user ?? null
      setUserId(user?.id ?? null)
      setEmail(user?.email ?? null)
      setFullName((user?.user_metadata?.full_name as string) ?? null)
      if (user) void refreshRoles(user.id)
      else setRoles([])
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [refreshRoles])

  const signOut = useCallback(async () => {
    await supabaseBrowser.auth.signOut()
    setUserId(null)
    setEmail(null)
    setFullName(null)
    setRoles([])
  }, [])

  const role: AppRole = roles.includes('admin')
    ? 'admin'
    : roles.includes('operator')
      ? 'operator'
      : roles.includes('anggota')
        ? 'anggota'
        : 'anggota'

  return {
    loading,
    userId,
    email,
    fullName,
    roles,
    role,
    isAuthed: Boolean(userId),
    signOut,
  }
}
