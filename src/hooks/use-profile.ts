import { useEffect, useState } from 'react'
import { supabaseBrowser } from '~/integrations/supabase/client'
import type { Tables } from '~/integrations/supabase/types'

export function useProfile(userId?: string | null) {
  const [profile, setProfile] = useState<Tables<'profiles'> | null>(null)
  const [loading, setLoading] = useState(Boolean(userId))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setProfile(null)
      setLoading(false)
      return
    }
    let mounted = true
    setLoading(true)
    supabaseBrowser
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
      .then(({ data, error }) => {
        if (!mounted) return
        if (error) setError(error.message)
        else setProfile(data)
        setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [userId])

  return { profile, loading, error }
}
