import { createFileRoute } from '@tanstack/react-router'
import { PublicShell } from '~/components/layout/PublicShell'
import { getDocuments } from '~/server/queries'
import { formatDate } from '~/lib/utils'

export const Route = createFileRoute('/profil')({
  component: ProfilPage,
  head: () => ({ meta: [{ title: 'Profil — Garda Bangsa Papua Barat' }] }),
  loader: async () => {
    const documents = await getDocuments()
    return { documents }
  },
})

const visi =
  'Mewujudkan Papua Barat yang adil, bermartabat, dan sejahtera melalui peran aktif pemuda dalam pembangunan dan pelestarian alam.'
const misi = [
  'Membangun kepemimpinan pemuda berbasis nilai kebangsaan dan kearifan lokal.',
  'Melindungi dan melestarikan ekosistem hutan serta laut Papua.',
  'Mendorong pemberdayaan ekonomi dan pendidikan masyarakat.',
  'Memperkuat solidaritas antar-anak bangsa di Tanah Papua.',
]

function ProfilPage() {
  const { documents } = Route.useLoaderData()

  return (
    <PublicShell>
      <section className="bg-pattern">
        <div className="container-gb py-14">
          <h1 className="text-4xl font-bold text-forest-900">Profil Organisasi</h1>
          <p className="mt-3 max-w-2xl text-sand-600">
            Garda Bangsa Papua Barat adalah organisasi kepemudaan yang lahir dari
            semangat menjaga tanah, air, dan masa depan Papua.
          </p>
        </div>
      </section>

      <section className="container-gb py-12">
        <h2 className="text-2xl font-bold text-forest-900">Sejarah</h2>
        <p className="mt-3 max-w-3xl text-sand-700">
          Didirikan di Manokwari, Garda Bangsa tumbuh dari gerakan pemuda
          lintas suku yang peduli pada pelestarian alam dan keadilan sosial.
          Kini organisasi hadir di berbagai cabang di seluruh Papua Barat.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-forest-900">Visi</h2>
        <p className="mt-3 max-w-3xl text-sand-700">{visi}</p>

        <h2 className="mt-10 text-2xl font-bold text-forest-900">Misi</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {misi.map((m) => (
            <li
              key={m}
              className="rounded-xl border border-border bg-white p-4 text-sand-700"
            >
              {m}
            </li>
          ))}
        </ul>

        <h2 className="mt-10 text-2xl font-bold text-forest-900">Struktur</h2>
        <p className="mt-3 max-w-3xl text-sand-700">
          Kepengurusan terdiri dari Dewan Pembina, Ketua, Sekretaris, Bendahara,
          dan bidang-bidang program yang dikoordinasikan di tingkat provinsi
          serta cabang kabupaten/kota.
        </p>
      </section>

      <section className="container-gb pb-16">
        <h2 className="text-2xl font-bold text-forest-900">Dokumen Undahan</h2>
        <p className="mt-2 text-sand-600">Unduh AD/ART dan dokumen resmi organisasi.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((d) => (
            <a
              key={d.id}
              href={d.file_url}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl border border-border bg-white p-4 hover:bg-muted"
            >
              <p className="font-semibold text-forest-900">{d.title}</p>
              {d.description && (
                <p className="mt-1 text-sm text-sand-600">{d.description}</p>
              )}
              <p className="mt-2 text-xs text-sand-400">
                Diunggah {formatDate(d.created_at)}
              </p>
            </a>
          ))}
          {documents.length === 0 && (
            <p className="text-sm text-sand-500">Belum ada dokumen tersedia.</p>
          )}
        </div>
      </section>
    </PublicShell>
  )
}
