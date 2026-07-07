import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Input, Textarea, Select, Label, FieldError } from '~/components/ui/Input'
import { Button } from '~/components/ui/Button'
import { newsSchema, type NewsInput } from '~/lib/validators'
import { supabaseBrowser } from '~/integrations/supabase/client'
import type { Tables } from '~/integrations/supabase/types'

export function NewsForm({
  categories,
  initial,
  authorId,
  cabangId,
}: {
  categories: Tables<'news_categories'>[]
  initial?: Tables<'news'>
  authorId?: string
  cabangId?: string | null
}) {
  const navigate = useNavigate()
  const [values, setValues] = useState<NewsInput>({
    title: initial?.title ?? '',
    slug: initial?.slug ?? '',
    excerpt: initial?.excerpt ?? '',
    content: initial?.content ?? '',
    categoryId: initial?.category_id ?? '',
    coverUrl: initial?.cover_url ?? '',
    published: initial?.published ?? false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const set = <K extends keyof NewsInput>(key: K, value: NewsInput[K]) =>
    setValues((v) => ({ ...v, [key]: value }))

  const onTitleBlur = () => {
    if (!initial && !values.slug) {
      set('slug', values.title.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-|-$/g, ''))
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = newsSchema.safeParse(values)
    if (!parsed.success) {
      const errs: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        errs[String(issue.path[0])] = issue.message
      }
      setErrors(errs)
      return
    }
    setErrors({})
    setSubmitting(true)
    setServerError(null)

    const payload = {
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt || null,
      content: parsed.data.content,
      category_id: parsed.data.categoryId || null,
      cover_url: parsed.data.coverUrl || null,
      published: parsed.data.published,
      published_at: parsed.data.published ? new Date().toISOString() : null,
      author_id: authorId ?? null,
      cabang_id: cabangId ?? null,
    }

    const supabase = supabaseBrowser
    const result = initial
      ? await supabase.from('news').update(payload).eq('id', initial.id)
      : await supabase.from('news').insert(payload)

    setSubmitting(false)
    if (result.error) {
      setServerError(result.error.message)
      return
    }
    void navigate({ to: '/admin/berita' })
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label htmlFor="title">Judul</Label>
        <Input
          id="title"
          value={values.title}
          onChange={(e) => set('title', e.target.value)}
          onBlur={onTitleBlur}
        />
        <FieldError>{errors.title}</FieldError>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" value={values.slug} onChange={(e) => set('slug', e.target.value)} />
          <FieldError>{errors.slug}</FieldError>
        </div>
        <div>
          <Label htmlFor="category">Kategori</Label>
          <Select
            id="category"
            value={values.categoryId}
            onChange={(e) => set('categoryId', e.target.value)}
          >
            <option value="">Tanpa kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="excerpt">Ringkasan</Label>
        <Textarea
          id="excerpt"
          value={values.excerpt}
          onChange={(e) => set('excerpt', e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="content">Konten</Label>
        <Textarea
          id="content"
          className="min-h-48"
          value={values.content}
          onChange={(e) => set('content', e.target.value)}
        />
        <FieldError>{errors.content}</FieldError>
      </div>

      <div>
        <Label htmlFor="cover">URL Cover</Label>
        <Input
          id="cover"
          value={values.coverUrl}
          onChange={(e) => set('coverUrl', e.target.value)}
          placeholder="https://..."
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={values.published}
          onChange={(e) => set('published', e.target.checked)}
          className="h-4 w-4"
        />
        Publikasikan sekarang
      </label>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Menyimpan...' : initial ? 'Perbarui' : 'Terbitkan'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => void navigate({ to: '/admin/berita' })}
        >
          Batal
        </Button>
      </div>
    </form>
  )
}
