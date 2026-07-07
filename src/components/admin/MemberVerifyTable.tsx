import { useState } from 'react'
import { supabaseBrowser } from '~/integrations/supabase/client'
import { StatusBadge } from './RoleBadge'
import { Button } from '~/components/ui/Button'
import { formatDate } from '~/lib/utils'
import type { MemberStatus, Tables } from '~/integrations/supabase/types'

export function MemberVerifyTable({
  members,
  cabangName,
}: {
  members: Tables<'profiles'>[]
  cabangName?: string
}) {
  const [statuses, setStatuses] = useState<Record<string, MemberStatus>>(
    Object.fromEntries(members.map((m) => [m.id, m.status])),
  )
  const [busy, setBusy] = useState<string | null>(null)

  const update = async (id: string, status: MemberStatus) => {
    setBusy(id)
    const { error } = await supabaseBrowser
      .from('profiles')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (!error) setStatuses((s) => ({ ...s, [id]: status }))
    setBusy(null)
  }

  if (members.length === 0) {
    return <p className="text-sm text-sand-600">Tidak ada anggota untuk diverifikasi.</p>
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted text-sand-700">
          <tr>
            <th className="px-4 py-3 font-semibold">Nama</th>
            <th className="px-4 py-3 font-semibold">Email</th>
            <th className="px-4 py-3 font-semibold">Daftar</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id} className="border-t border-border">
              <td className="px-4 py-3 font-medium text-foreground">{m.full_name}</td>
              <td className="px-4 py-3 text-sand-600">{m.email}</td>
              <td className="px-4 py-3 text-sand-600">{formatDate(m.created_at)}</td>
              <td className="px-4 py-3">
                <StatusBadge status={statuses[m.id] ?? m.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    disabled={busy === m.id || statuses[m.id] === 'active'}
                    onClick={() => void update(m.id, 'active')}
                  >
                    Verifikasi
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy === m.id || statuses[m.id] === 'rejected'}
                    onClick={() => void update(m.id, 'rejected')}
                  >
                    Tolak
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {cabangName && (
        <p className="border-t border-border px-4 py-2 text-xs text-sand-500">
          Menampilkan anggota cabang: {cabangName}
        </p>
      )}
    </div>
  )
}
