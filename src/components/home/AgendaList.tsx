import { Link } from '@tanstack/react-router'
import { formatDate } from '~/lib/utils'
import type { Tables } from '~/integrations/supabase/types'

export function AgendaList({ agenda }: { agenda: Tables<'agenda'>[] }) {
  if (agenda.length === 0) {
    return (
      <p className="text-sm text-sand-600">Belum ada agenda mendatang.</p>
    )
  }
  return (
    <section className="container-gb py-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-forest-900">Agenda</h2>
          <p className="mt-1 text-sand-600">Kegiatan dan program kerja mendatang.</p>
        </div>
        <Link
          to="/kontak"
          className="hidden text-sm font-semibold text-forest-700 hover:underline md:block"
        >
          Ajak kolaborasi →
        </Link>
      </div>

      <ul className="mt-8 space-y-3">
        {agenda.slice(0, 4).map((a) => (
          <li
            key={a.id}
            className="flex flex-col gap-2 rounded-xl border border-border bg-white p-4 sm:flex-row sm:items-center"
          >
            <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-forest-100 text-forest-800">
              <span className="font-display text-lg font-bold">
                {new Date(a.start_at).getDate()}
              </span>
              <span className="text-[10px] uppercase">
                {new Date(a.start_at).toLocaleString('id-ID', { month: 'short' })}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold text-forest-900">
                {a.title}
              </h3>
              {a.location && (
                <p className="text-sm text-sand-600">📍 {a.location}</p>
              )}
            </div>
            <time className="text-sm text-sand-500">
              {formatDate(a.start_at, { hour: '2-digit', minute: '2-digit' })}
            </time>
          </li>
        ))}
      </ul>
    </section>
  )
}
