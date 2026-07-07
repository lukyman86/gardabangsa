import { Link, Outlet, useNavigate } from '@tanstack/react-router'
import { useAuth } from '~/hooks/use-auth'
import { useRole } from '~/hooks/use-role'

export function AuthShell({ children }: { children?: React.ReactNode }) {
  const { fullName, email, signOut } = useAuth()
  const { isAdmin, isOperator } = useRole()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    void navigate({ to: '/auth', search: { mode: 'login' } })
  }

  const links = [
    { to: '/anggota', label: 'Dashboard', show: true },
    { to: '/anggota/profil', label: 'Profil Saya', show: true },
    { to: '/operator', label: 'Panel Operator', show: isOperator || isAdmin },
    { to: '/admin', label: 'Panel Admin', show: isAdmin },
  ]

  return (
    <div className="flex min-h-screen bg-sand-50">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-white md:flex">
        <Link to="/" className="flex items-center gap-2 border-b border-border p-4">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-forest-700 font-display text-lg font-bold text-primary-foreground">
            G
          </span>
          <span className="font-display font-bold text-forest-900">Garda Bangsa</span>
        </Link>
        <nav className="flex-1 space-y-1 p-3">
          {links
            .filter((l) => l.show)
            .map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-sand-700 hover:bg-muted hover:text-forest-800"
                activeProps={{ className: 'bg-forest-100 text-forest-800' }}
              >
                {l.label}
              </Link>
            ))}
        </nav>
        <div className="border-t border-border p-3">
          <p className="truncate text-sm font-medium text-foreground">{fullName ?? email}</p>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            Keluar
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-white px-4 py-3 md:hidden">
          <span className="font-display font-bold text-forest-900">Garda Bangsa</span>
          <button type="button" onClick={handleSignOut} className="text-sm font-medium">
            Keluar
          </button>
        </header>
        <main className="flex-1 p-4 md:p-8">{children ?? <Outlet />}</main>
      </div>
    </div>
  )
}
