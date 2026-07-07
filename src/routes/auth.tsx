import { createFileRoute, Link } from '@tanstack/react-router'
import { LoginForm } from '~/components/auth/LoginForm'
import { RegisterForm } from '~/components/auth/RegisterForm'
import { ForgotPasswordForm } from '~/components/auth/ForgotPasswordForm'
import { getCabangs } from '~/server/queries'
import { cn } from '~/lib/utils'

export const Route = createFileRoute('/auth')({
  component: AuthPage,
  head: () => ({ meta: [{ title: 'Masuk / Daftar — Garda Bangsa Papua Barat' }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    mode: ((search.mode === 'register' || search.mode === 'forgot'
      ? search.mode
      : 'login') ?? 'login') as 'login' | 'register' | 'forgot' | undefined,
  }),
  loader: async ({ deps }) => {
    const mode = (((deps as any).mode as string | undefined) ?? 'login') as
      | 'login'
      | 'register'
      | 'forgot'
    if (mode === 'register') {
      const cabangs = await getCabangs()
      return { mode, cabangs }
    }
    return { mode, cabangs: [] }
  },
  loaderDeps: ({ search }) => search as any,
})

function AuthPage() {
  const { mode, cabangs } = Route.useLoaderData()

  return (
    <div className="flex min-h-screen flex-col bg-pattern">
      <header className="container-gb flex h-16 items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-forest-700 font-display text-lg font-bold text-primary-foreground">
            G
          </span>
          <span className="font-display text-lg font-bold text-forest-900">
            Garda Bangsa
          </span>
        </Link>
      </header>

      <main className="container-gb flex flex-1 items-center justify-center py-10">
        <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-soft">
          <Tabs mode={mode} />
          <div className="mt-6">
            {mode === 'login' && <LoginForm />}
            {mode === 'register' && <RegisterForm cabangs={cabangs} />}
            {mode === 'forgot' && <ForgotPasswordForm />}
          </div>
        </div>
      </main>
    </div>
  )
}

function Tabs({ mode }: { mode: 'login' | 'register' | 'forgot' }) {
  if (mode === 'forgot') {
    return (
      <h1 className="text-2xl font-bold text-forest-900">Lupa Password</h1>
    )
  }
  return (
    <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
      <TabLink to="/auth" mode="login" active={mode === 'login'}>
        Masuk
      </TabLink>
      <TabLink to="/auth" mode="register" active={mode === 'register'}>
        Daftar
      </TabLink>
    </div>
  )
}

function TabLink({
  to,
  mode,
  active,
  children,
}: {
  to: string
  mode: 'login' | 'register'
  active: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      to={to}
      search={{ mode }}
      className={cn(
        'rounded-md py-2 text-center text-sm font-semibold transition-colors',
        active ? 'bg-white text-forest-800 shadow-sm' : 'text-sand-600',
      )}
    >
      {children}
    </Link>
  )
}
