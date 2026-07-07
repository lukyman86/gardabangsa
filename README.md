# 🏛️ Garda Bangsa Papua Barat - Website CMS

Website dan CMS untuk organisasi Garda Bangsa Papua Barat dengan fitur manajemen anggota, berita, galeri, dan program kerja.

## ✨ Fitur Utama

- **Autentikasi & Otorisasi**: Login, register dengan role-based access control
- **Scoping Geografis**: Operator Daerah hanya melihat data daerah mereka
- **CMS Berita**: Kelola berita dengan status publikasi
- **CMS Galeri**: Manajemen dokumentasi kegiatan
- **Manajemen Anggota**: CRUD anggota dengan integritas data
- **Landing Page Responsif**: Tampilan publik yang menarik

## 🛠️ Tech Stack

- Node.js + Express.js
- Supabase (PostgreSQL)
- EJS Template Engine
- Bootstrap 5
- bcryptjs untuk keamanan password

## 📋 Prerequisites

- Node.js >= 14.0.0
- npm >= 6.0.0
- Akun Supabase

## 🚀 Instalasi & Setup

### 1. Clone Repository
```bash
git clone https://github.com/lukyman86/gardabangsa.git
cd gardabangsa
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
```bash
cp .env.example .env
```

Edit `.env` dengan konfigurasi Supabase Anda:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=3000
NODE_ENV=development
SESSION_SECRET=garda-bangsa-pb-secret-key
```

### 4. Setup Database
- Buka Supabase Console
- Buat database baru atau gunakan yang sudah ada
- Jalankan SQL dari `db/schema.sql`

### 5. Jalankan Aplikasi
```bash
# Development
npm run dev

# Production
npm start
```

Akses aplikasi di `http://localhost:3000`

## 📁 Struktur Project

```
gardabangsa/
├── config/              # Konfigurasi
│   └── supabase.js
├── middleware/          # Custom middleware
│   └── auth.js
├── routes/              # Route handlers
│   ├── public.js
│   ├── auth.js
│   └── admin.js
├── views/               # EJS templates
│   ├── layouts/
│   ├── public/
│   ├── admin/
│   ├── auth/
│   └── errors/
├── public/              # Static files
│   ├── css/
│   ├── js/
│   └── images/
├── db/                  # Database scripts
│   └── schema.sql
├── server.js            # Entry point
├── package.json
├── .env.example
└── README.md
```

## 👥 User Roles

| Role | Akses |
|------|-------|
| **Admin** | Full access ke semua fitur |
| **Operator Daerah** | Akses terbatas ke daerah mereka |
| **Anggota** | Dashboard & akses publik |

## 🔐 Keamanan

- Password di-hash menggunakan bcryptjs
- Session management dengan express-session
- CSRF protection
- Input validation
- Geographic scoping untuk data integrity

## 📚 API Routes

### Public Routes
- `GET /` - Halaman beranda
- `GET /profile` - Profil organisasi
- `GET /gallery` - Galeri publik
- `GET /news` - Daftar berita
- `GET /news/:slug` - Detail berita
- `GET /contact` - Halaman kontak

### Authentication Routes
- `GET /auth/login` - Form login
- `POST /auth/login` - Process login
- `GET /auth/register` - Form register
- `POST /auth/register` - Process register
- `GET /auth/logout` - Logout
- `GET /auth/forgot-password` - Form lupa password
- `POST /auth/forgot-password` - Process lupa password
- `GET /auth/reset-password?token=xxx` - Form reset password
- `POST /auth/reset-password` - Process reset password

### Admin Routes (Protected)
- `GET /admin/dashboard` - Dashboard admin
- `GET /admin/members` - Daftar anggota
- `GET /admin/members/create` - Form tambah anggota
- `POST /admin/members/create` - Tambah anggota
- `GET /admin/news` - Daftar berita
- `GET /admin/news/create` - Form buat berita
- `POST /admin/news/create` - Buat berita
- `GET /admin/gallery` - Daftar galeri
- `GET /admin/gallery/create` - Form unggah foto
- `POST /admin/gallery/create` - Unggah foto

## 🚢 Deployment

### Heroku
```bash
heroku login
heroku create garda-bangsa-pb
heroku config:set SUPABASE_URL=your_url
heroku config:set SUPABASE_SERVICE_ROLE_KEY=your_key
git push heroku main
```

### Railway
```bash
railway link
railway up
```

### Vercel (untuk serverless)
```bash
npm install -g vercel
vercel
```

## 🤝 Contributing

Kontribusi sangat diterima! Silakan:
1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

## 📝 License

MIT License - lihat file LICENSE untuk detail

## 📞 Support

Untuk pertanyaan dan support, hubungi tim development.
