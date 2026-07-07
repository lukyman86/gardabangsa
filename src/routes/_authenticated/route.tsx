import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { AuthShell } from '~/components/layout/AuthShell'
import { useAuth } from '~/hooks/use-auth'
import { getServerSession } from '~/server/queries'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const session = await getServerSession()
    if (!session) {
      throw redirect({ to: '/auth', search: { mode: 'login' } })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  const { isAuthed } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthed) void navigate({ to: '/auth', search: { mode: 'login' } })
  }, [isAuthed, navigate])

  if (!isAuthed) {
    return (
      <div className="grid min-h-screen place-items-center text-sand-500">
        Memverifikasi sesi...
      </div>
    )
  }

  return <AuthShell />
}
