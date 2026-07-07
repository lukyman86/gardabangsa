import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Input, Label, FieldError } from '~/components/ui/Input'
import { Button } from '~/components/ui/Button'
import { loginSchema, type LoginInput } from '~/lib/validators'
import { supabaseBrowser } from '~/integrations/supabase/client'

export function LoginForm() {
  const navigate = useNavigate()
  const [values, setValues] = useState<LoginInput>({ email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = loginSchema.safeParse(values)
    if (!parsed.success) {
      const errs: Record<string, string> = {}
      for (const i of parsed.error.issues) errs[String(i.path[0])] = i.message
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)
    setServerError(null)
    const { error } = await supabaseBrowser.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    })
    setLoading(false)
    if (error) {
      setServerError('Email atau password salah.')
      return
    }
    void navigate({ to: '/anggota' })
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
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={values.password}
          onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
        />
        <FieldError>{errors.password}</FieldError>
      </div>
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Masuk...' : 'Masuk'}
      </Button>
    </form>
  )
}
