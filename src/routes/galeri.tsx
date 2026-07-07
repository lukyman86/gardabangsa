import { createFileRoute } from '@tanstack/react-router'
import { PublicShell } from '~/components/layout/PublicShell'
import { GalleryGrid } from '~/components/gallery/GalleryGrid'
import { getGalleries } from '~/server/queries'

export const Route = createFileRoute('/galeri')({
  component: GaleriPage,
  head: () => ({ meta: [{ title: 'Galeri — Garda Bangsa Papua Barat' }] }),
  loader: async () => {
    const galleries = await getGalleries()
    return { galleries }
  },
})

function GaleriPage() {
  const { galleries } = Route.useLoaderData()

  return (
    <PublicShell>
      <section className="bg-pattern">
        <div className="container-gb py-14">
          <h1 className="text-4xl font-bold text-forest-900">Galeri</h1>
          <p className="mt-3 max-w-2xl text-sand-600">
            Dokumentasi kegiatan, aksi, dan momen bersama Garda Bangsa Papua
            Barat.
          </p>
        </div>
      </section>

      <section className="container-gb pb-16">
        <GalleryGrid items={galleries} />
      </section>
    </PublicShell>
  )
}
