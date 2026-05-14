-- ═══════════════════════════════════════════════════════════════
-- RESERVA LAGUNA — FORNECEDORES
-- Migration: 001_initial_schema.sql
-- Run this in: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── PROFILES ──────────────────────────────────────────────────
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  created_at  timestamptz default now(),
  full_name   text not null,
  unit        text not null default '',
  phone       text,
  role        text not null default 'morador' check (role in ('morador','admin')),
  invite_status text not null default 'active' check (invite_status in ('invited','active','revoked')),
  avatar_url  text
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by authenticated users"
  on public.profiles for select
  using (auth.role() = 'authenticated');

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admin can do everything on profiles"
  on public.profiles for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, unit, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'unit', ''),
    coalesce(new.raw_user_meta_data->>'role', 'morador')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── INVITES ───────────────────────────────────────────────────
create table public.invites (
  id           uuid primary key default uuid_generate_v4(),
  created_at   timestamptz default now(),
  token        text unique not null,
  full_name    text not null,
  unit         text not null,
  phone        text,
  status       text not null default 'invited' check (status in ('invited','active','revoked')),
  expires_at   timestamptz not null default (now() + interval '7 days'),
  completed_at timestamptz,
  user_id      uuid references auth.users(id)
);

alter table public.invites enable row level security;

create policy "Admins manage invites"
  on public.invites for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Anyone can read invite by token"
  on public.invites for select
  using (true);

-- ─── SUPPLIERS ─────────────────────────────────────────────────
create table public.suppliers (
  id              uuid primary key default uuid_generate_v4(),
  created_at      timestamptz default now(),
  name            text not null,
  type            text not null default 'autonomo' check (type in ('empresa','autonomo')),
  section         text not null check (section in ('obras','servicos')),
  category        text not null,
  description     text not null default '',
  phone           text,
  whatsapp        text,
  website         text,
  instagram       text,
  address         text,
  city            text,
  photos          text[] default '{}',
  avg_rating      numeric(3,2) default 0,
  review_count    integer default 0,
  verified        boolean default false,
  featured        boolean default false,
  status          text not null default 'pending' check (status in ('pending','approved','rejected')),
  indicated_by    uuid references auth.users(id),
  indicated_by_name text,
  indicated_by_unit text,
  self_registered boolean default false
);

alter table public.suppliers enable row level security;

-- Anyone can view approved suppliers
create policy "Anyone can view approved suppliers"
  on public.suppliers for select
  using (status = 'approved');

-- Authenticated moradores can insert (indicate)
create policy "Moradores can indicate suppliers"
  on public.suppliers for insert
  with check (
    auth.role() = 'authenticated' and
    exists (select 1 from public.profiles where id = auth.uid() and invite_status = 'active')
  );

-- Admins have full access
create policy "Admins have full access to suppliers"
  on public.suppliers for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ─── REVIEWS ───────────────────────────────────────────────────
create table public.reviews (
  id            uuid primary key default uuid_generate_v4(),
  created_at    timestamptz default now(),
  supplier_id   uuid references public.suppliers(id) on delete cascade not null,
  user_id       uuid references auth.users(id) not null,
  rating        integer not null check (rating between 1 and 5),
  comment       text not null,
  approved      boolean default false,
  helpful_count integer default 0,
  unique(supplier_id, user_id)
);

alter table public.reviews enable row level security;

-- Anyone can read approved reviews
create policy "Anyone can view approved reviews"
  on public.reviews for select
  using (approved = true);

-- Admins can see all reviews
create policy "Admins see all reviews"
  on public.reviews for select
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Moradores can insert reviews (not suppliers — checked by role NOT by profile join to prevent suppliers reviewing)
create policy "Moradores can insert reviews"
  on public.reviews for insert
  with check (
    auth.uid() = user_id and
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role = 'morador'
      and invite_status = 'active'
    )
  );

-- Admins manage reviews
create policy "Admins manage reviews"
  on public.reviews for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ─── HELPFUL VOTES ─────────────────────────────────────────────
create table public.helpful_votes (
  review_id uuid references public.reviews(id) on delete cascade,
  user_id   uuid references auth.users(id),
  primary key (review_id, user_id)
);

alter table public.helpful_votes enable row level security;

create policy "Authenticated users manage their votes"
  on public.helpful_votes for all
  using (auth.uid() = user_id);

-- ─── FAVORITES ─────────────────────────────────────────────────
create table public.favorites (
  supplier_id uuid references public.suppliers(id) on delete cascade,
  user_id     uuid references auth.users(id),
  created_at  timestamptz default now(),
  primary key (supplier_id, user_id)
);

alter table public.favorites enable row level security;

create policy "Users manage own favorites"
  on public.favorites for all
  using (auth.uid() = user_id);

-- ─── SITE SETTINGS ─────────────────────────────────────────────
create table public.site_settings (
  id              text primary key default 'singleton',
  cover_photo_url text,
  notice_text     text default 'Todos os fornecedores são indicados por moradores. Verifique avaliações antes de contratar.',
  updated_at      timestamptz default now()
);

alter table public.site_settings enable row level security;

create policy "Anyone can read settings"
  on public.site_settings for select using (true);

create policy "Admins manage settings"
  on public.site_settings for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Insert default settings row
insert into public.site_settings (id) values ('singleton') on conflict do nothing;

-- ─── FUNCTION: Update avg_rating on suppliers ──────────────────
create or replace function public.update_supplier_rating()
returns trigger language plpgsql security definer
as $$
begin
  update public.suppliers
  set
    avg_rating   = (select avg(rating) from public.reviews where supplier_id = coalesce(new.supplier_id, old.supplier_id) and approved = true),
    review_count = (select count(*) from public.reviews where supplier_id = coalesce(new.supplier_id, old.supplier_id) and approved = true)
  where id = coalesce(new.supplier_id, old.supplier_id);
  return new;
end;
$$;

create trigger on_review_change
  after insert or update or delete on public.reviews
  for each row execute procedure public.update_supplier_rating();

-- ─── STORAGE BUCKETS ───────────────────────────────────────────
-- Run these separately in Supabase Dashboard → Storage

-- 1. Create bucket "supplier-photos" (public)
-- 2. Create bucket "cover-photo" (public)

-- Storage policies (run in SQL Editor after creating buckets):
/*
insert into storage.buckets (id, name, public) values ('supplier-photos', 'supplier-photos', true);
insert into storage.buckets (id, name, public) values ('cover-photo', 'cover-photo', true);

create policy "Anyone can view supplier photos"
  on storage.objects for select
  using (bucket_id = 'supplier-photos');

create policy "Authenticated users can upload supplier photos"
  on storage.objects for insert
  with check (bucket_id = 'supplier-photos' and auth.role() = 'authenticated');

create policy "Anyone can view cover photo"
  on storage.objects for select
  using (bucket_id = 'cover-photo');

create policy "Admins can upload cover photo"
  on storage.objects for insert
  with check (
    bucket_id = 'cover-photo' and
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

create policy "Admins can update cover photo"
  on storage.objects for update
  using (
    bucket_id = 'cover-photo' and
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );
*/

-- ─── SEED: Create admin user ────────────────────────────────────
-- After running this migration, go to Supabase Auth → Users → Invite user
-- with email: admin@reservalaguna.com.br
-- Then run:
-- update public.profiles set role = 'admin', unit = 'Administração' where id = '<user-id>';
