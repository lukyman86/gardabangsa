-- ============================================================
-- Garda Bangsa Papua Barat — Database Schema (Supabase / Postgres)
-- Jalankan di SQL Editor Supabase (schema public).
-- ============================================================

-- 1. ENUMS -----------------------------------------------------
do $$ begin
  create type app_role as enum ('admin', 'operator', 'anggota');
exception when duplicate_object then null; end $$;

do $$ begin
  create type member_status as enum ('pending', 'active', 'rejected', 'inactive');
exception when duplicate_object then null; end $$;

-- 2. TABLES ----------------------------------------------------
create table if not exists public.cabang (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  region text,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text,
  no_ktp text,
  cabang_id uuid references public.cabang (id) on delete set null,
  avatar_url text,
  address text,
  birth_date date,
  status member_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create table if not exists public.news_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  scope text not null default 'nasional' check (scope in ('nasional', 'cabang')),
  created_at timestamptz not null default now()
);

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text not null,
  cover_url text,
  category_id uuid references public.news_categories (id) on delete set null,
  author_id uuid references auth.users (id) on delete set null,
  cabang_id uuid references public.cabang (id) on delete set null,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.galleries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  media_url text not null,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  cabang_id uuid references public.cabang (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.agenda (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location text,
  start_at timestamptz not null,
  end_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  file_url text not null,
  category text,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_profiles_cabang on public.profiles (cabang_id);
create index if not exists idx_profiles_status on public.profiles (status);
create index if not exists idx_news_published on public.news (published);
create index if not exists idx_news_cabang on public.news (cabang_id);
create index if not exists idx_user_roles_user on public.user_roles (user_id);

-- 3. GRANTS ----------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
grant insert, update, delete on
  public.profiles, public.news, public.galleries,
  public.contacts, public.agenda, public.documents,
  public.user_roles, public.cabang, public.news_categories
  to authenticated;
grant all on all tables in schema public to service_role;

-- 4. RLS HELPER (security definer, anti-recursion) ------------
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.user_roles where user_id = _user_id and role = _role
  )
$$;

-- 5. ENABLE RLS ----------------------------------------------
alter table public.profiles      enable row level security;
alter table public.user_roles    enable row level security;
alter table public.cabang        enable row level security;
alter table public.news          enable row level security;
alter table public.news_categories enable row level security;
alter table public.galleries     enable row level security;
alter table public.contacts      enable row level security;
alter table public.agenda        enable row level security;
alter table public.documents     enable row level security;

-- 6. PROFILES POLICIES ---------------------------------------
create policy "profiles read own" on public.profiles
  for select to authenticated
  using (auth.uid() = id);

create policy "profiles update own" on public.profiles
  for update to authenticated
  using (auth.uid() = id);

create policy "operator read cabang profiles" on public.profiles
  for select to authenticated
  using (
    public.has_role(auth.uid(), 'operator')
    and cabang_id = (select cabang_id from public.profiles where id = auth.uid())
  );

create policy "admin full profiles" on public.profiles
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- 7. USER_ROLES POLICIES -------------------------------------
create policy "roles read self" on public.user_roles
  for select to authenticated
  using (user_id = auth.uid());

create policy "admin manage roles" on public.user_roles
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- 8. CABANG POLICIES -----------------------------------------
create policy "cabang read public" on public.cabang
  for select to anon, authenticated using (true);

-- 9. NEWS POLICIES -------------------------------------------
create policy "public read published news" on public.news
  for select to anon, authenticated
  using (published = true);

create policy "author manage own news" on public.news
  for all to authenticated
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

create policy "operator manage cabang news" on public.news
  for all to authenticated
  using (
    public.has_role(auth.uid(), 'operator')
    and cabang_id = (select cabang_id from public.profiles where id = auth.uid())
  );

create policy "admin full news" on public.news
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- 10. NEWS_CATEGORIES POLICIES -------------------------------
create policy "categories read public" on public.news_categories
  for select to anon, authenticated using (true);

create policy "admin manage categories" on public.news_categories
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- 11. GALLERIES POLICIES -------------------------------------
create policy "galleries read public" on public.galleries
  for select to anon, authenticated using (true);

create policy "admin manage galleries" on public.galleries
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- 12. CONTACTS POLICIES --------------------------------------
create policy "anon insert contact" on public.contacts
  for insert to anon, authenticated
  with check (true);

create policy "admin read/delete contacts" on public.contacts
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- 13. AGENDA POLICIES ----------------------------------------
create policy "agenda read public" on public.agenda
  for select to anon, authenticated using (true);

create policy "admin manage agenda" on public.agenda
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- 14. DOCUMENTS POLICIES -------------------------------------
create policy "documents read public" on public.documents
  for select to anon, authenticated using (true);

create policy "admin manage documents" on public.documents
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- 15. AUTO-PROFILE ON SIGNUP --------------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    new.email
  );
  insert into public.user_roles (user_id, role)
  values (new.id, 'anggota');
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 16. STORAGE BUCKETS + POLICIES ----------------------------
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('member-docs', 'member-docs', false)
on conflict (id) do nothing;

-- gallery: public read, authed insert
create policy "gallery public read" on storage.objects
  for select using (bucket_id = 'gallery');
create policy "gallery authed insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'gallery');

-- documents: public read, admin write
create policy "documents public read" on storage.objects
  for select using (bucket_id = 'documents');
create policy "documents admin write" on storage.objects
  for all to authenticated
  using (bucket_id = 'documents' and public.has_role(auth.uid(), 'admin'));

-- member-docs: owner + admin/operator cabang
create policy "member-docs owner rw" on storage.objects
  for all to authenticated
  using (bucket_id = 'member-docs' and name like auth.uid() || '/%')
  with check (bucket_id = 'member-docs' and name like auth.uid() || '/%');

-- 17. SEED DATA ---------------------------------------------
insert into public.cabang (name, slug, region) values
  ('Manokwari', 'manokwari', 'Papua Barat'),
  ('Sorong', 'sorong', 'Papua Barat Daya'),
  ('Bintuni', 'bintuni', 'Teluk Bintuni')
on conflict (slug) do nothing;

insert into public.news_categories (name, slug, scope) values
  ('Umum', 'umum', 'nasional'),
  ('Lingkungan', 'lingkungan', 'nasional'),
  ('Pemberdayaan', 'pemberdayaan', 'cabang')
on conflict (slug) do nothing;
