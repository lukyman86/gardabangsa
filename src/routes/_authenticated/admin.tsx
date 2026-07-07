import { createFileRoute, Link } from '@tanstack/react-router'
import { useRequireRole } from '~/hooks/use-role'
import { Card } from '~/components/ui/Card'

export const Route = createFileRoute('/_authenticated/admin')({
  component: AdminDashboard,
})

const nav = [
  { to: '/admin/berita', label: 'Kelola Berita', desc: 'Buat, edit, dan publikasikan berita.' },
  { to: '/admin/galeri', label: 'Kelola Galeri', desc: 'Unggah foto & video kegiatan.' },
  { to: '/admin/anggota', label: 'Kelola Anggota', desc: 'Verifikasi anggota & kelola operator.' },
]

function AdminDashboard() {
  useRequireRole('admin')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-forest-900">Panel Admin</h1>
        <p className="text-sand-600">Kontrol penuh atas konten & keanggotaan organisasi.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {nav.map((n) => (
          <Link key={n.to} to={n.to}>
            <Card className="h-full p-6 transition-transform hover:-translate-y-1">
              <h2 className="font-display text-lg font-semibold text-forest-900">
                {n.label}
              </h2>
              <p className="mt-1 text-sm text-sand-600">{n.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
