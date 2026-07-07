import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '~/hooks/use-auth'
import { useProfile } from '~/hooks/use-profile'
import { Card, Badge } from '~/components/ui/Card'
import { Button } from '~/components/ui/Button'
import { StatusBadge } from '~/components/admin/RoleBadge'
import { generateKta, downloadDataUrl, buildMemberId } from '~/lib/kta-generator'

export const Route = createFileRoute('/_authenticated/anggota')({
  component: AnggotaDashboard,
})

function AnggotaDashboard() {
  const { userId, email, fullName } = useAuth()
  const { profile, loading } = useProfile(userId)

  const downloadKta = async () => {
    if (!profile) return
    const dataUrl = await generateKta({
      fullName: profile.full_name,
      memberId: buildMemberId(profile),
      cabang: profile.cabang_id ?? undefined,
      status: profile.status,
      avatarUrl: profile.avatar_url,
    })
    downloadDataUrl(dataUrl, `KTA-${profile.full_name}.png`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-forest-900">Dashboard Anggota</h1>
        <p className="text-sand-600">Selamat datang, {fullName ?? email}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="font-display text-lg font-semibold text-forest-900">
            Profil Saya
          </h2>
          {loading ? (
            <p className="mt-3 text-sm text-sand-500">Memuat...</p>
          ) : profile ? (
            <dl className="mt-3 space-y-2 text-sm">
              <Row label="Nama" value={profile.full_name} />
              <Row label="Email" value={profile.email} />
              <Row label="No. HP" value={profile.phone ?? '-'} />
              <Row label="Status" value={<StatusBadge status={profile.status} />} />
            </dl>
          ) : (
            <p className="mt-3 text-sm text-sand-500">Profil belum lengkap.</p>
          )}
        </Card>

        <Card className="flex flex-col items-start justify-between p-6">
          <div>
            <h2 className="font-display text-lg font-semibold text-forest-900">
              KTA Digital
            </h2>
            <p className="mt-2 text-sm text-sand-600">
              Unduh kartu tanda anggota digital Anda dalam format PNG.
            </p>
          </div>
          <Button className="mt-4" onClick={() => void downloadKta()} disabled={!profile}>
            Unduh KTA
          </Button>
        </Card>
      </div>

      <Card className="flex items-center gap-3 p-4">
        <Badge className="bg-forest-100 text-forest-800">Anggota</Badge>
        <p className="text-sm text-sand-600">
          Lengkapi data dan pantau status verifikasi di menu Profil Saya.
        </p>
      </Card>
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border pb-2">
      <dt className="text-sand-500">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  )
}
