import { Link } from '@tanstack/react-router'
import { NewsCard } from '~/components/news/NewsCard'
import type { Tables } from '~/integrations/supabase/types'

export function NewsPreview({ news }: { news: Tables<'news'>[] }) {
  return (
    <section className="container-gb py-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-forest-900">Berita Terbaru</h2>
          <p className="mt-1 text-sand-600">
            Kabar dan kegiatan terkini dari Garda Bangsa Papua Barat.
          </p>
        </div>
        <Link
          to="/berita"
          search={{} as any}
          className="hidden text-sm font-semibold text-forest-700 hover:underline md:block"
        >
          Lihat semua →
        </Link>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {news.slice(0, 3).map((n) => (
          <NewsCard key={n.id} news={n} />
        ))}
      </div>
    </section>
  )
}
