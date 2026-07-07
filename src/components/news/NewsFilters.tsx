import { useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Input, Select, Label } from '~/components/ui/Input'
import { Button } from '~/components/ui/Button'
import type { Tables } from '~/integrations/supabase/types'

export function NewsFilters({
  categories,
}: {
  categories: Tables<'news_categories'>[]
}) {
  const search = useSearch({ from: '/berita' }) as {
    q?: string
    category?: string
  }
  const navigate = useNavigate({ from: '/berita' })
  const [q, setQ] = useState(search.q ?? '')
  const [category, setCategory] = useState(search.category ?? '')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    void navigate({
      search: (prev) => ({
        ...prev,
        q: q || undefined,
        category: category || undefined,
        page: 1,
      }),
    })
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-3 rounded-xl border border-border bg-white p-4 sm:flex-row sm:items-end"
    >
      <div className="flex-1">
        <Label htmlFor="q">Cari berita</Label>
        <Input
          id="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ketik kata kunci..."
        />
      </div>
      <div className="sm:w-56">
        <Label htmlFor="category">Kategori</Label>
        <Select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Semua kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>
      <Button type="submit">Terapkan</Button>
    </form>
  )
}
