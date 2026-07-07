import { createFileRoute, notFound } from '@tanstack/react-router'
import { PublicShell } from '~/components/layout/PublicShell'
import { getNewsDetail } from '~/server/queries'
import { formatDate } from '~/lib/utils'

export const Route = createFileRoute('/berita/$slug')({
  component: NewsDetailPage,
  head: ({ params }) => ({ meta: [{ title: `Berita — ${params.slug}` }] }),
  loader: async ({ params }) => {
    try {
      const news = await getNewsDetail({ data: params.slug })
      return { news }
    } catch {
      throw notFound()
    }
  },
})

function NewsDetailPage() {
  const { news } = Route.useLoaderData() as { news: any }
  const raw = news as Record<string, any>

  return (
    <PublicShell>
      <article className="container-gb max-w-3xl py-12">
        <a href="/berita" className="text-sm font-semibold text-forest-700 hover:underline">
          ← Kembali ke berita
        </a>
        <h1 className="mt-4 text-3xl font-bold text-forest-900 md:text-4xl">
          {news.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-sand-500">
          <time>{formatDate(news.published_at)}</time>
          {raw.news_categories && (
            <span className="rounded-full bg-forest-100 px-2 py-0.5 text-forest-800">
              {raw.news_categories.name}
            </span>
          )}
        </div>

        {news.cover_url && (
          <img
            src={news.cover_url}
            alt={news.title}
            className="mt-6 aspect-[16/9] w-full rounded-xl object-cover"
          />
        )}

        <div className="mt-6 whitespace-pre-line text-sand-800">
          {news.content}
        </div>
      </article>
    </PublicShell>
  )
}
