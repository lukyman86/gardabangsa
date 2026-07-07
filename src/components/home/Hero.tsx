import { Link } from '@tanstack/react-router'

export function Hero({
  memberCount,
  newsCount,
  agendaCount,
}: {
  memberCount?: number
  newsCount?: number
  agendaCount?: number
}) {
  return (
    <section className="relative overflow-hidden bg-pattern">
      <div className="container-gb grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div>
          <span className="inline-flex items-center rounded-full bg-forest-100 px-3 py-1 text-sm font-medium text-forest-800">
            Organisasi Kepemudaan Papua Barat
          </span>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-forest-900 md:text-5xl">
            Garda Bangsa <span className="text-gradient">Papua Barat</span>
          </h1>
          <p className="mt-4 max-w-lg text-lg text-sand-600">
            Bergerak untuk keadilan sosial, pelestarian alam Papua, dan
            pemberdayaan pemuda menuju masa depan yang sejahtera.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/auth"
            search={{ mode: 'login' }}
            className="rounded-lg bg-forest-700 px-6 py-3 text-base font-semibold text-primary-foreground hover:bg-forest-800"
          >
            Menjadi Anggota
          </Link>
            <Link
              to="/profil"
              className="rounded-lg border border-border bg-white px-6 py-3 text-base font-semibold text-foreground hover:bg-muted"
            >
              Tentang Kami
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4">
            <Stat value={memberCount ?? 0} label="Anggota" />
            <Stat value={newsCount ?? 0} label="Berita" />
            <Stat value={agendaCount ?? 0} label="Agenda" />
          </div>
        </div>

        <div className="relative hidden md:block">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-forest-600 via-ocean-600 to-cendrawasih-500 shadow-soft">
            <div className="flex h-full flex-col justify-end p-6 text-white">
              <span className="text-sm font-medium uppercase tracking-wide text-cendrawasih-200">
                Cendrawasih
              </span>
              <p className="font-display text-2xl font-bold">
                Simbol kebanggaan & kebebasan Papua
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl border border-border bg-white/70 p-4 text-center backdrop-blur">
      <div className="font-display text-2xl font-bold text-forest-800">
        {value.toLocaleString('id-ID')}
      </div>
      <div className="text-xs font-medium text-sand-600">{label}</div>
    </div>
  )
}
