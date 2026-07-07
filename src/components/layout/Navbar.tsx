import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { cn } from '~/lib/utils'

const navLinks = [
  { to: '/', label: 'Beranda', active: '/' },
  { to: '/profil', label: 'Profil', active: '/profil' },
  { to: '/galeri', label: 'Galeri', active: '/galeri' },
  { to: '/berita', label: 'Berita', active: '/berita' },
  { to: '/kontak', label: 'Kontak', active: '/kontak' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="container-gb flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-forest-700 font-display text-lg font-bold text-primary-foreground">
            G
          </span>
          <span className="font-display text-lg font-bold leading-tight text-forest-900">
            Garda Bangsa
            <span className="block text-xs font-medium text-ocean-600">
              Papua Barat
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === '/' }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-sand-700 transition-colors hover:bg-muted hover:text-forest-800 data-[status=active]:text-forest-800"
              activeProps={{ className: 'bg-muted' }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/auth"
            search={{ mode: 'login' }}
            className="ml-2 rounded-lg bg-forest-700 px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-forest-800"
          >
            Masuk
          </Link>
        </nav>

        <button
          type="button"
          className="rounded-lg p-2 md:hidden"
          aria-label="Buka menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block h-0.5 w-6 bg-foreground" />
          <span className={cn('mt-1.5 block h-0.5 w-6 bg-foreground', open && 'opacity-60')} />
          <span className="mt-1.5 block h-0.5 w-6 bg-foreground" />
        </button>
      </div>

      {open && (
        <nav className="border-t border-border bg-background md:hidden">
          <div className="container-gb flex flex-col py-2">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-sand-700 hover:bg-muted"
                activeProps={{ className: 'bg-muted text-forest-800' }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/auth"
              search={{ mode: 'login' }}
              onClick={() => setOpen(false)}
              className="mt-1 rounded-lg bg-forest-700 px-4 py-2 text-center text-sm font-semibold text-primary-foreground"
            >
              Masuk
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
