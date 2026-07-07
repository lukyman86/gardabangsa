import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '~/hooks/use-auth'
import { useProfile } from '~/hooks/use-profile'
import { Input, Textarea, Label, FieldError } from '~/components/ui/Input'
import { Button } from '~/components/ui/Button'
import { profileUpdateSchema, type ProfileUpdateInput } from '~/lib/validators'
import { supabaseBrowser } from '~/integrations/supabase/client'

export const Route = createFileRoute('/_authenticated/anggota/profil')({
  component: ProfileEditPage,
})

function ProfileEditPage() {
  const { userId } = useAuth()
  const { profile, loading } = useProfile(userId)
  const [values, setValues] = useState<ProfileUpdateInput>({
    fullName: '',
    phone: '',
    address: '',
    birthDate: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Sync once profile loads.
  const [synced, setSynced] = useState(false)
  if (profile && !synced) {
    setValues({
      fullName: profile.full_name,
      phone: profile.phone ?? '',
      address: profile.address ?? '',
      birthDate: profile.birth_date ?? '',
    })
    setSynced(true)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    const parsed = profileUpdateSchema.safeParse(values)
    if (!parsed.success) {
      const errs: Record<string, string> = {}
      for (const i of parsed.error.issues) errs[String(i.path[0])] = i.message
      setErrors(errs)
      return
    }
    setErrors({})
    setSaving(true)
    setServerError(null)
    const { error } = await supabaseBrowser
      .from('profiles')
      .update({
        full_name: parsed.data.fullName,
        phone: parsed.data.phone || null,
        address: parsed.data.address || null,
        birth_date: parsed.data.birthDate || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
    setSaving(false)
    if (error) {
      setServerError(error.message)
      return
    }
    setMessage('Profil berhasil diperbarui.')
  }

  if (loading && !synced) {
    return <p className="text-sand-500">Memuat profil...</p>
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-forest-900">Profil Saya</h1>
      <form onSubmit={submit} className="space-y-4 rounded-xl border border-border bg-white p-6">
        <div>
          <Label htmlFor="fullName">Nama Lengkap</Label>
          <Input id="fullName" value={values.fullName} onChange={(e) => setValues((v) => ({ ...v, fullName: e.target.value }))} />
          <FieldError>{errors.fullName}</FieldError>
        </div>
        <div>
          <Label htmlFor="phone">No. HP</Label>
          <Input id="phone" value={values.phone} onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))} />
          <FieldError>{errors.phone}</FieldError>
        </div>
        <div>
          <Label htmlFor="birthDate">Tanggal Lahir</Label>
          <Input id="birthDate" type="date" value={values.birthDate} onChange={(e) => setValues((v) => ({ ...v, birthDate: e.target.value }))} />
        </div>
        <div>
          <Label htmlFor="address">Alamat</Label>
          <Textarea id="address" value={values.address} onChange={(e) => setValues((v) => ({ ...v, address: e.target.value }))} />
        </div>
        {serverError && <p className="text-sm text-red-600">{serverError}</p>}
        {message && <p className="rounded-lg bg-forest-50 p-3 text-sm text-forest-800">{message}</p>}
        <Button type="submit" disabled={saving}>
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </form>
    </div>
  )
}
