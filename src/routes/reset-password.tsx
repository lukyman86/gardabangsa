import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Input, Label, FieldError } from '~/components/ui/Input'
import { Button } from '~/components/ui/Button'
import { resetPasswordSchema, type ResetPasswordInput } from '~/lib/validators'
import { supabaseBrowser } from '~/integrations/supabase/client'

export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordPage,
  head: () => ({ meta: [{ title: 'Reset Password — Garda Bangsa Papua Barat' }] }),
})

function ResetPasswordPage() {
  const [values, setValues] = useState<ResetPasswordInput>({
    password: '',
    confirm: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = resetPasswordSchema.safeParse(values)
    if (!parsed.success) {
      const errs: Record<string, string> = {}
      for (const i of parsed.error.issues) errs[String(i.path[0])] = i.message
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)
    setServerError(null)
    const { error } = await supabaseBrowser.auth.updateUser({
      password: parsed.data.password,
    })
    setLoading(false)
    if (error) {
      setServerError(error.message)
      return
    }
    setMessage('Password berhasil diperbarui. Silakan masuk.')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-pattern p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-soft">
        <h1 className="text-2xl font-bold text-forest-900">Password Baru</h1>
        <p className="mt-1 text-sm text-sand-600">
          Buat password baru untuk akun Garda Bangsa Anda.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="password">Password Baru</Label>
            <Input
              id="password"
              type="password"
              value={values.password}
              onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
            />
            <FieldError>{errors.password}</FieldError>
          </div>
          <div>
            <Label htmlFor="confirm">Konfirmasi Password</Label>
            <Input
              id="confirm"
              type="password"
              value={values.confirm}
              onChange={(e) => setValues((v) => ({ ...v, confirm: e.target.value }))}
            />
            <FieldError>{errors.confirm}</FieldError>
          </div>
          {serverError && <p className="text-sm text-red-600">{serverError}</p>}
          {message && <p className="rounded-lg bg-forest-50 p-3 text-sm text-forest-800">{message}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Memperbarui...' : 'Perbarui Password'}
          </Button>
          <Link
            to="/auth"
            search={{ mode: 'login' }}
            className="block text-center text-sm font-semibold text-forest-700 hover:underline"
          >
            ← Kembali ke login
          </Link>
        </form>
      </div>
    </div>
  )
}
