import { Link } from '@tanstack/react-router'
import { Card } from '~/components/ui/Card'
import { formatDate } from '~/lib/utils'
import type { Tables } from '~/integrations/supabase/types'

export function NewsCard({ news }: { news: Tables<'news'> }) {
  const cover = news.cover_url
  return (
    <Link to="/berita/$slug" params={{ slug: news.slug }} search={{} as any}>
      <Card className="group h-full overflow-hidden transition-transform hover:-translate-y-1">
        <div className="aspect-[16/9] overflow-hidden bg-sand-100">
          {cover ? (
            <img
              src={cover}
              alt={news.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-forest-500 to-ocean-600 font-display text-3xl font-bold text-white/70">
              GB
            </div>
          )}
        </div>
        <div className="p-4">
          <time className="text-xs font-medium text-sand-500">
            {formatDate(news.published_at)}
          </time>
          <h3 className="mt-1 line-clamp-2 font-display text-lg font-bold text-forest-900">
            {news.title}
          </h3>
          {news.excerpt && (
            <p className="mt-1 line-clamp-2 text-sm text-sand-600">
              {news.excerpt}
            </p>
          )}
        </div>
      </Card>
    </Link>
  )
}
