# 🏛️ Garda Bangsa Papua Barat

Website organisasi dinamis untuk **Garda Bangsa Papua Barat** — dibangun dengan
**TanStack Start + React + Tailwind CSS + Supabase**.

## ✨ Fitur

- **Halaman publik (SSR)** dengan OG tags: Beranda, Profil, Galeri, Berita
  (list + detail + search + kategori + pagination), Kontak.
- **Autentikasi** email+password, register (auto role `anggota`), lupa/reset
  password via email Supabase.
- **Dashboard Anggota**: profil, KTA digital (canvas → PNG), status keanggotaan.
- **Dashboard Operator**: verifikasi anggota cabang, upload berita lokal.
- **Dashboard Admin**: CRUD berita/galeri, kelola operator, verifikasi anggota.
- **Database**: PostgreSQL + RLS (row level security) yang aman per role & cabang.
- **Storage**: bucket `gallery` (publik), `documents` (publik), `member-docs`
  (privat).
- **SEO**: sitemap dinamis (`/api/sitemap.xml`) + `robots.txt`.

## 🛠️ Tech Stack

- [TanStack Start](https://tanstack.com/start) (React SSR framework)
- React 19 + TypeScript
- Tailwind CSS v4 (design token `oklch` — palet Papua Barat)
- Supabase (Auth, Postgres, Storage) via `@supabase/ssr`

## 📋 Prerequisites

- Node.js >= 20
- Akun Supabase (project URL + anon key)
- Storage buckets & tabel sesuai `db/schema.sql`

## 🚀 Instalasi & Setup

```bash
# 1. Install dependencies
npm install

# 2. Environment variables
cp .env.example .env
#   isi SUPABASE_URL, SUPABASE_ANON_KEY, SITE_URL

# 3. Setup database
#   Buka Supabase SQL Editor, jalankan seluruh isi db/schema.sql

# 4. Jalankan di development
npm run dev      # http://localhost:3000

# 5. Build & preview
npm run build
npm run start
```

## 📁 Struktur Project

```text
src/
  routes/                 # File-based routing (public + _authenticated + api)
  components/             # ui, layout, home, news, gallery, admin, auth
  hooks/                  # use-auth, use-profile, use-role
  lib/                    # supabase-helpers, kta-generator, validators, utils
  integrations/supabase/  # client (browser), client.server, types, auth-middleware
  styles.css              # Design system (oklch tokens)
db/schema.sql             # Enums, tabel, RLS, trigger, storage buckets
```

## 🔐 Role & Akses

| Role      | Akses                                                        |
|-----------|-------------------------------------------------------------|
| `admin`   | Full access (CRUD berita/galeri/anggota, kelola operator)   |
| `operator`| Verifikasi anggota & berita cabangnya                       |
| `anggota` | Dashboard pribadi, KTA digital, edit profil                 |

## 🚢 Deployment (Vercel)

`vercel.json` sudah disiapkan: build memakai `vite build` (output `dist/`),
lalu semua request di-rewrite ke serverless function `api/server.ts` yang
mengekspos `fetch` handler dari TanStack Start (`dist/server/server.js`).

1. Push repo ke GitHub.
2. Import project di Vercel (Framework: **Other**).
3. Tambahkan environment variables: `VITE_SUPABASE_URL`,
   `VITE_SUPABASE_ANON_KEY`, `VITE_SITE_URL` (+ `SITE_URL`).
4. Deploy — `vercel.json` akan menangani build & rewrite otomatis.

## 💻 Menjalankan di Production (lokal)

```bash
npm run build
npm run start      # node server.mjs → http://localhost:3000
```

## 📝 License

MIT
