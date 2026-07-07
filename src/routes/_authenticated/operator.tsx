import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useAuth } from '~/hooks/use-auth'
import { useProfile } from '~/hooks/use-profile'
import { useRequireRole } from '~/hooks/use-role'
import { Card } from '~/components/ui/Card'
import { Button } from '~/components/ui/Button'
import { MemberVerifyTable } from '~/components/admin/MemberVerifyTable'
import { NewsForm } from '~/components/admin/NewsForm'
import { supabaseBrowser } from '~/integrations/supabase/client'
import type { Tables } from '~/integrations/supabase/types'

export const Route = createFileRoute('/_authenticated/operator')({
  component: OperatorDashboard,
})

function OperatorDashboard() {
  useRequireRole('operator')
  const { userId } = useAuth()
  const { profile } = useProfile(userId)
  const [members, setMembers] = useState<Tables<'profiles'>[]>([])
  const [news, setNews] = useState<Tables<'news'>[]>([])
  const [categories, setCategories] = useState<Tables<'news_categories'>[]>([])
  const [showForm, setShowForm] = useState(false)

  const cabangId = profile?.cabang_id ?? null

  useEffect(() => {
    if (!cabangId) return
    const load = async () => {
      const [{ data: m }, { data: n }, { data: c }] = await Promise.all([
        supabaseBrowser
          .from('profiles')
          .select('*')
          .eq('cabang_id', cabangId)
          .order('created_at', { ascending: false }),
        supabaseBrowser
          .from('news')
          .select('*')
          .eq('cabang_id', cabangId)
          .order('created_at', { ascending: false }),
        supabaseBrowser.from('news_categories').select('*').eq('scope', 'cabang'),
      ])
      setMembers(m ?? [])
      setNews(n ?? [])
      setCategories(c ?? [])
    }
    void load()
  }, [cabangId])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-forest-900">Panel Operator</h1>
          <p className="text-sand-600">Kelola anggota & berita cabang Anda.</p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Tutup' : 'Tulis Berita Lokal'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-forest-900">
            Berita Baru Cabang
          </h2>
          <NewsForm categories={categories} authorId={userId ?? undefined} cabangId={cabangId} />
        </Card>
      )}

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-forest-900">
          Verifikasi Anggota ({members.length})
        </h2>
        <MemberVerifyTable members={members} />
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-forest-900">
          Berita Cabang ({news.length})
        </h2>
        {news.length === 0 ? (
          <p className="text-sm text-sand-500">Belum ada berita cabang.</p>
        ) : (
          <ul className="space-y-2">
            {news.map((n) => (
              <li
                key={n.id}
                className="rounded-lg border border-border bg-white px-4 py-3 text-sm"
              >
                <span className="font-medium text-forest-900">{n.title}</span>
                <span className="ml-2 text-xs text-sand-500">
                  {n.published ? 'Publik' : 'Draft'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
