import { Link } from '@tanstack/react-router'
import { cn } from '~/lib/utils'

export function Pagination({
  page,
  totalPages,
}: {
  page: number
  totalPages: number
}) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav className="mt-8 flex items-center justify-center gap-1">
      {pages.map((p) => (
      <Link
        key={p}
        to="/berita"
        search={(prev: any) => ({
          ...prev,
          page: p,
        })}
        className={cn(
            'h-10 min-w-10 rounded-lg px-3 text-sm font-semibold',
            p === page
              ? 'bg-forest-700 text-primary-foreground'
              : 'border border-border bg-white text-foreground hover:bg-muted',
          )}
        >
          {p}
        </Link>
      ))}
    </nav>
  )
}
