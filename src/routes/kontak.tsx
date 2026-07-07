import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { PublicShell } from '~/components/layout/PublicShell'
import { Input, Textarea, Label, FieldError } from '~/components/ui/Input'
import { Button } from '~/components/ui/Button'
import { contactSchema, type ContactInput } from '~/lib/validators'
import { supabaseBrowser } from '~/integrations/supabase/client'

export const Route = createFileRoute('/kontak')({
  component: KontakPage,
  head: () => ({ meta: [{ title: 'Kontak — Garda Bangsa Papua Barat' }] }),
})

function KontakPage() {
  return (
    <PublicShell>
      <section className="bg-pattern">
        <div className="container-gb py-14">
          <h1 className="text-4xl font-bold text-forest-900">Kontak</h1>
          <p className="mt-3 max-w-2xl text-sand-600">
            Hubungi sekretariat atau kirim pesan melalui form di bawah ini.
          </p>
        </div>
      </section>

      <section className="container-gb grid gap-10 pb-16 md:grid-cols-2">
        <div className="space-y-4">
          <InfoCard title="Sekretariat" lines={['Jl. Percetakan Negara', 'Manokwari, Papua Barat']} />
          <InfoCard title="Email" lines={['info@gardabangsa-pb.id']} />
          <InfoCard title="Telepon" lines={['+62 812-0000-0000']} />
        </div>
        <ContactForm />
      </section>
    </PublicShell>
  )
}

function InfoCard({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <h3 className="font-display font-semibold text-forest-900">{title}</h3>
      {lines.map((l) => (
        <p key={l} className="mt-1 text-sand-600">
          {l}
        </p>
      ))}
    </div>
  )
}

function ContactForm() {
  const [values, setValues] = useState<ContactInput>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = contactSchema.safeParse(values)
    if (!parsed.success) {
      const errs: Record<string, string> = {}
      for (const i of parsed.error.issues) errs[String(i.path[0])] = i.message
      setErrors(errs)
      return
    }
    setErrors({})
    setLoading(true)
    setServerError(null)
    const { error } = await supabaseBrowser.from('contacts').insert({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject || null,
      message: parsed.data.message,
    })
    setLoading(false)
    if (error) {
      setServerError(error.message)
      return
    }
    setMessage('Pesan Anda telah terkirim. Terima kasih!')
    setValues({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl border border-border bg-white p-6">
      <div>
        <Label htmlFor="name">Nama</Label>
        <Input id="name" value={values.name} onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))} />
        <FieldError>{errors.name}</FieldError>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={values.email} onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))} />
        <FieldError>{errors.email}</FieldError>
      </div>
      <div>
        <Label htmlFor="subject">Subjek (opsional)</Label>
        <Input id="subject" value={values.subject} onChange={(e) => setValues((v) => ({ ...v, subject: e.target.value }))} />
      </div>
      <div>
        <Label htmlFor="message">Pesan</Label>
        <Textarea id="message" value={values.message} onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))} />
        <FieldError>{errors.message}</FieldError>
      </div>
      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      {message && <p className="rounded-lg bg-forest-50 p-3 text-sm text-forest-800">{message}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? 'Mengirim...' : 'Kirim Pesan'}
      </Button>
    </form>
  )
}
