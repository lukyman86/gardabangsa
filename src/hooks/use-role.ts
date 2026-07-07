import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from './use-auth'

export function useRole() {
  const { role, roles, isAuthed, loading } = useAuth()
  return {
    role,
    roles,
    isAuthed,
    loading,
    isAdmin: roles.includes('admin'),
    isOperator: roles.includes('operator'),
    isAnggota: roles.includes('anggota'),
    can: (r: 'admin' | 'operator' | 'anggota') => roles.includes(r),
  }
}

/** Client-side role gate: redirects away when the role is missing. */
export function useRequireRole(role: 'admin' | 'operator' | 'anggota') {
  const { roles, isAuthed, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return
    if (!isAuthed || !roles.includes(role)) {
      void navigate({ to: '/anggota' })
    }
  }, [loading, isAuthed, roles, role, navigate])

  return { allowed: isAuthed && roles.includes(role), loading }
}
