import { Navbar } from './Navbar'
import { Footer } from './Footer'

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export function PublicCta() {
  return (
    <section className="bg-pattern">
      <div className="container-gb flex flex-col items-center gap-4 py-16 text-center">
        <h2 className="max-w-2xl text-3xl font-bold text-forest-900">
          Bergabunglah menjadi bagian dari Garda Bangsa Papua Barat
        </h2>
        <p className="max-w-xl text-sand-600">
          Daftar sebagai anggota untuk mendapatkan KTA digital, akses program
          kerja, dan berkontribusi bagi tanah Papua.
        </p>
        <a
          href="/auth"
          className="rounded-lg bg-cendrawasih-400 px-7 py-3 text-base font-semibold text-accent-foreground hover:bg-cendrawasih-500"
        >
          Daftar Sekarang
        </a>
      </div>
    </section>
  )
}
