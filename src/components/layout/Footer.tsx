import { Link } from '@tanstack/react-router'

export function Footer() {
  return (
    <footer className="mt-16 bg-forest-900 text-forest-50">
      <div className="container-gb grid gap-8 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-cendrawasih-400 font-display text-lg font-bold text-accent-foreground">
              G
            </span>
            <span className="font-display text-lg font-bold">Garda Bangsa</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-forest-100">
            Organisasi kepemudaan Garda Bangsa Papua Barat — bergerak untuk
            keadilan, pelestarian alam, dan kesejahteraan masyarakat.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-cendrawasih-300">
            Navigasi
          </h4>
          <ul className="mt-3 space-y-2 text-sm text-forest-100">
            <li>
              <Link to="/profil" className="hover:text-cendrawasih-300">
                Profil
              </Link>
            </li>
            <li>
          <Link to="/berita" search={{} as any} className="hover:text-cendrawasih-300">
            Berita
          </Link>
            </li>
            <li>
              <Link to="/galeri" className="hover:text-cendrawasih-300">
                Galeri
              </Link>
            </li>
            <li>
              <Link to="/kontak" className="hover:text-cendrawasih-300">
                Kontak
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-cendrawasih-300">
            Sekretariat
          </h4>
          <address className="mt-3 space-y-1 text-sm not-italic text-forest-100">
            <p>Jl. Percetakan Negara, Manokwari</p>
            <p>Papua Barat, Indonesia</p>
            <p>info@gardabangsa-pb.id</p>
            <p>+62 812-0000-0000</p>
          </address>
        </div>
      </div>
      <div className="border-t border-forest-800 py-4">
        <p className="container-gb text-center text-xs text-forest-200">
          © {new Date().getFullYear()} Garda Bangsa Papua Barat. Hak cipta
          dilindungi.
        </p>
      </div>
    </footer>
  )
}
