import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Input, Label, FieldError } from '~/components/ui/Input'
import { Button } from '~/components/ui/Button'
import { forgotPasswordSchema, type ForgotPasswordInput } from '~/lib/validators'
import { supabaseBrowser } from '~/integrations/supabase/client'

export function ForgotPasswordForm() {
  const [values, setValues] = useState<ForgotPasswordInput>({ email: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = forgotPasswordSchema.safeParse(values)
    if (!parsed.success) {
      const errs: Record<string, string> = {}
      for (const i of parsed.error.issues) errs[String(i.path[0])] = i.message
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)
    setServerError(null)
    const { error } = await supabaseBrowser.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
    if (error) {
      setServerError(error.message)
      return
    }
    setMessage('Link reset password telah dikirim ke email Anda.')
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          placeholder="nama@email.com"
        />
        <FieldError>{errors.email}</FieldError>
      </div>
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      {message && (
        <div className="rounded-lg border border-forest-200 bg-forest-50 p-3 text-sm text-forest-800">
          {message}
        </div>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Mengirim...' : 'Kirim Link Reset'}
      </Button>
      <Link
        to="/auth"
        search={{ mode: 'login' }}
        className="block text-center text-sm font-semibold text-forest-700 hover:underline"
      >
        ← Kembali ke login
      </Link>
    </form>
  )
}
