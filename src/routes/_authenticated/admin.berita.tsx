import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useAuth } from '~/hooks/use-auth'
import { useRequireRole } from '~/hooks/use-role'
import { Card } from '~/components/ui/Card'
import { Button } from '~/components/ui/Button'
import { NewsForm } from '~/components/admin/NewsForm'
import { supabaseBrowser } from '~/integrations/supabase/client'
import type { Tables } from '~/integrations/supabase/types'

export const Route = createFileRoute('/_authenticated/admin/berita')({
  component: AdminBerita,
})

function AdminBerita() {
  useRequireRole('admin')
  const { userId } = useAuth()
  const [news, setNews] = useState<Tables<'news'>[]>([])
  const [categories, setCategories] = useState<Tables<'news_categories'>[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Tables<'news'> | null>(null)

  const load = async () => {
    const [{ data: n }, { data: c }] = await Promise.all([
      supabaseBrowser.from('news').select('*').order('created_at', { ascending: false }),
      supabaseBrowser.from('news_categories').select('*').order('name'),
    ])
    setNews(n ?? [])
    setCategories(c ?? [])
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const remove = async (id: string) => {
    if (!confirm('Hapus berita ini?')) return
    await supabaseBrowser.from('news').delete().eq('id', id)
    void load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-forest-900">Kelola Berita</h1>
          <p className="text-sand-600">Total: {news.length} berita</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null)
            setShowForm((v) => !v)
          }}
        >
          {showForm ? 'Tutup' : 'Tambah Berita'}
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-forest-900">
            {editing ? 'Edit Berita' : 'Berita Baru'}
          </h2>
          <NewsForm
            categories={categories}
            initial={editing ?? undefined}
            authorId={userId ?? undefined}
            cabangId={null}
          />
        </Card>
      )}

      <div className="space-y-2">
        {news.map((n) => (
          <div
            key={n.id}
            className="flex items-center justify-between rounded-lg border border-border bg-white px-4 py-3"
          >
            <div>
              <p className="font-medium text-forest-900">{n.title}</p>
              <p className="text-xs text-sand-500">
                {n.published ? 'Publik' : 'Draft'} · {n.slug}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditing(n)
                  setShowForm(true)
                }}
              >
                Edit
              </Button>
              <Button size="sm" variant="outline" onClick={() => void remove(n.id)}>
                Hapus
              </Button>
            </div>
          </div>
        ))}
        {news.length === 0 && (
          <p className="text-sm text-sand-500">Belum ada berita.</p>
        )}
      </div>
    </div>
  )
}
