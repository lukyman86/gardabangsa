import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Input, Select, Label, FieldError } from '~/components/ui/Input'
import { Button } from '~/components/ui/Button'
import { registerSchema, type RegisterInput } from '~/lib/validators'
import { supabaseBrowser } from '~/integrations/supabase/client'
import type { Tables } from '~/integrations/supabase/types'

export function RegisterForm({ cabangs }: { cabangs: Tables<'cabang'>[] }) {
  const [values, setValues] = useState<RegisterInput>({
    fullName: '',
    email: '',
    password: '',
    noKtp: '',
    phone: '',
    cabangId: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = registerSchema.safeParse(values)
    if (!parsed.success) {
      const errs: Record<string, string> = {}
      for (const i of parsed.error.issues) errs[String(i.path[0])] = i.message
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)
    setServerError(null)
    setMessage(null)

    const { error } = await supabaseBrowser.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: parsed.data.fullName,
          no_ktp: parsed.data.noKtp,
          phone: parsed.data.phone,
          cabang_id: parsed.data.cabangId || null,
        },
      },
    })
    setLoading(false)
    if (error) {
      setServerError(error.message)
      return
    }
    setMessage(
      'Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi sebelum masuk.',
    )
  }

  const set = <K extends keyof RegisterInput>(k: K, v: RegisterInput[K]) =>
    setValues((prev) => ({ ...prev, [k]: v }))

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label htmlFor="fullName">Nama Lengkap</Label>
        <Input id="fullName" value={values.fullName} onChange={(e) => set('fullName', e.target.value)} />
        <FieldError>{errors.fullName}</FieldError>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={values.email} onChange={(e) => set('email', e.target.value)} />
          <FieldError>{errors.email}</FieldError>
        </div>
        <div>
          <Label htmlFor="phone">No. HP</Label>
          <Input id="phone" value={values.phone} onChange={(e) => set('phone', e.target.value)} />
          <FieldError>{errors.phone}</FieldError>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="noKtp">No. KTP</Label>
          <Input id="noKtp" value={values.noKtp} onChange={(e) => set('noKtp', e.target.value)} />
          <FieldError>{errors.noKtp}</FieldError>
        </div>
        <div>
          <Label htmlFor="cabang">Cabang</Label>
          <Select id="cabang" value={values.cabangId} onChange={(e) => set('cabangId', e.target.value)}>
            <option value="">Pilih cabang</option>
            {cabangs.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          <FieldError>{errors.cabangId}</FieldError>
        </div>
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" value={values.password} onChange={(e) => set('password', e.target.value)} />
        <FieldError>{errors.password}</FieldError>
      </div>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      {message && (
        <div className="rounded-lg border border-forest-200 bg-forest-50 p-3 text-sm text-forest-800">
          {message}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Mendaftar...' : 'Daftar'}
      </Button>
      <p className="text-center text-sm text-sand-600">
        Sudah punya akun?{' '}
        <Link to="/auth" search={{ mode: 'login' }} className="font-semibold text-forest-700 hover:underline">
          Masuk
        </Link>
      </p>
    </form>
  )
}
