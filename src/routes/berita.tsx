import { createFileRoute } from '@tanstack/react-router'
import { PublicShell } from '~/components/layout/PublicShell'
import { NewsCard } from '~/components/news/NewsCard'
import { NewsFilters } from '~/components/news/NewsFilters'
import { Pagination } from '~/components/news/Pagination'
import { getNewsList, getNewsCategories } from '~/server/queries'

const PAGE_SIZE = 9

export const Route = createFileRoute('/berita')({
  component: BeritaPage,
  head: () => ({ meta: [{ title: 'Berita — Garda Bangsa Papua Barat' }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === 'string' ? search.q : undefined,
    category: typeof search.category === 'string' ? search.category : undefined,
    page: Number(search.page) > 0 ? Number(search.page) : undefined,
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const [list, categories] = await Promise.all([
      getNewsList({ data: { q: deps.q, category: deps.category, page: deps.page ?? 1, limit: PAGE_SIZE } }),
      getNewsCategories({ data: {} }),
    ])
    return { news: list.news, categories, page: deps.page ?? 1, totalPages: list.totalPages }
  },
})

function BeritaPage() {
  const { news, categories, page, totalPages } = Route.useLoaderData()

  return (
    <PublicShell>
      <section className="bg-pattern">
        <div className="container-gb py-14">
          <h1 className="text-4xl font-bold text-forest-900">Berita</h1>
          <p className="mt-3 max-w-2xl text-sand-600">
            Kabar, progres, dan cerita dari seluruh cabang Garda Bangsa Papua
            Barat.
          </p>
        </div>
      </section>

      <section className="container-gb space-y-8 pb-16">
        <NewsFilters categories={categories} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((n) => (
            <NewsCard key={n.id} news={n} />
          ))}
        </div>
        {news.length === 0 && (
          <p className="text-center text-sand-500">Tidak ada berita ditemukan.</p>
        )}
        <Pagination page={page} totalPages={totalPages} />
      </section>
    </PublicShell>
  )
}
