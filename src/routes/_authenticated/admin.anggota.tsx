import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useRequireRole } from '~/hooks/use-role'
import { Card } from '~/components/ui/Card'
import { Button } from '~/components/ui/Button'
import { Select } from '~/components/ui/Input'
import { MemberVerifyTable } from '~/components/admin/MemberVerifyTable'
import { RoleBadge } from '~/components/admin/RoleBadge'
import { supabaseBrowser } from '~/integrations/supabase/client'
import type { Tables } from '~/integrations/supabase/types'

export const Route = createFileRoute('/_authenticated/admin/anggota')({
  component: AdminAnggota,
})

function AdminAnggota() {
  useRequireRole('admin')
  const [members, setMembers] = useState<Tables<'profiles'>[]>([])
  const [operators, setOperators] = useState<Tables<'profiles'>[]>([])
  const [selected, setSelected] = useState('')

  const load = async () => {
    const [{ data: m }] = await Promise.all([
      supabaseBrowser.from('profiles').select('*').order('created_at', { ascending: false }),
    ])
    const all = m ?? []
    setMembers(all)
    const opIds = (
      await supabaseBrowser.from('user_roles').select('user_id').eq('role', 'operator')
    ).data?.map((r) => r.user_id) ?? []
    setOperators(all.filter((p) => opIds.includes(p.id)))
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const addOperator = async () => {
    if (!selected) return
    await supabaseBrowser.from('user_roles').insert({ user_id: selected, role: 'operator' })
    setSelected('')
    void load()
  }

  const removeOperator = async (userId: string) => {
    await supabaseBrowser
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', 'operator')
    void load()
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-forest-900">Kelola Anggota</h1>
        <p className="text-sand-600">Verifikasi anggota & kelola operator cabang.</p>
      </div>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-forest-900">
          Verifikasi Anggota ({members.length})
        </h2>
        <MemberVerifyTable members={members} />
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-forest-900">
          Kelola Operator ({operators.length})
        </h2>
        <Card className="p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1">
              <label className="mb-1.5 block text-sm font-medium">Jadikan Operator</label>
              <Select value={selected} onChange={(e) => setSelected(e.target.value)}>
                <option value="">Pilih anggota...</option>
                {members
                  .filter((m) => !operators.some((o) => o.id === m.id))
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.full_name}
                    </option>
                  ))}
              </Select>
            </div>
            <Button onClick={() => void addOperator()} disabled={!selected}>
              Tambah Operator
            </Button>
          </div>

          <ul className="mt-4 space-y-2">
            {operators.map((o) => (
              <li
                key={o.id}
                className="flex items-center justify-between rounded-lg border border-border px-4 py-2"
              >
                <span className="text-sm">
                  <span className="font-medium text-forest-900">{o.full_name}</span>{' '}
                  <RoleBadge role="operator" />
                </span>
                <button
                  type="button"
                  onClick={() => void removeOperator(o.id)}
                  className="text-xs font-semibold text-red-600"
                >
                  Cabut
                </button>
              </li>
            ))}
            {operators.length === 0 && (
              <li className="text-sm text-sand-500">Belum ada operator.</li>
            )}
          </ul>
        </Card>
      </section>
    </div>
  )
}
