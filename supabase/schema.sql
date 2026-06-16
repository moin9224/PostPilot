-- ============================================================================
-- PostPilot — Supabase schema
-- Run this in the Supabase SQL editor (or `supabase db push`).
-- Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE where possible.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  company text,
  industry text,
  profile_picture_url text,
  linkedin_profile_url text,
  linkedin_access_token text,
  subscription_plan text not null default 'free'
    check (subscription_plan in ('free', 'starter', 'pro', 'agency')),
  subscription_started_at timestamptz,
  stripe_customer_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.generated_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  tone text,
  industry text,
  audience text,
  status text not null default 'draft'
    check (status in ('draft', 'scheduled', 'published', 'failed')),
  scheduled_for timestamptz,
  published_at timestamptz,
  linkedin_post_id text,
  impressions int not null default 0,
  clicks int not null default 0,
  comments int not null default 0,
  shares int not null default 0,
  reactions int not null default 0,
  character_count int,
  hashtags text[],
  estimated_reach int,
  ai_generated boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.scheduled_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid references public.generated_posts(id) on delete set null,
  content text not null,
  scheduled_for timestamptz not null,
  timezone text not null default 'UTC',
  status text not null default 'scheduled'
    check (status in ('scheduled', 'published', 'failed')),
  published_at timestamptz,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.competitors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  linkedin_profile_url text not null,
  name text,
  industry text,
  post_frequency int,
  avg_engagement numeric,
  last_analyzed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.competitor_posts (
  id uuid primary key default gen_random_uuid(),
  competitor_id uuid not null references public.competitors(id) on delete cascade,
  linkedin_post_id text unique,
  content text,
  posted_at timestamptz,
  impressions int,
  engagement int,
  topic text,
  created_at timestamptz not null default now()
);

create table if not exists public.reach_analysis (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  analysis_data jsonb,
  analyzed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  email text not null,
  role text not null default 'editor'
    check (role in ('admin', 'editor', 'viewer')),
  status text not null default 'pending'
    check (status in ('pending', 'active', 'inactive')),
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, email)
);

create table if not exists public.content_library (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text,
  content text,
  category text,
  tags text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes for frequently queried columns
-- ---------------------------------------------------------------------------
create index if not exists idx_generated_posts_user on public.generated_posts(user_id);
create index if not exists idx_generated_posts_status on public.generated_posts(user_id, status);
create index if not exists idx_generated_posts_created on public.generated_posts(user_id, created_at desc);
create index if not exists idx_scheduled_posts_user on public.scheduled_posts(user_id);
create index if not exists idx_scheduled_posts_due on public.scheduled_posts(scheduled_for) where status = 'scheduled';
create index if not exists idx_competitors_user on public.competitors(user_id);
create index if not exists idx_competitor_posts_competitor on public.competitor_posts(competitor_id);
create index if not exists idx_reach_analysis_user on public.reach_analysis(user_id, analyzed_at desc);
create index if not exists idx_team_members_user on public.team_members(user_id);
create index if not exists idx_content_library_user on public.content_library(user_id);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array[
    'profiles', 'generated_posts', 'scheduled_posts',
    'competitors', 'content_library'
  ] loop
    execute format('drop trigger if exists trg_%I_updated on public.%I;', t, t);
    execute format(
      'create trigger trg_%I_updated before update on public.%I
         for each row execute function public.set_updated_at();', t, t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Auto-create a profile row when a new auth user signs up
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.generated_posts enable row level security;
alter table public.scheduled_posts enable row level security;
alter table public.competitors enable row level security;
alter table public.competitor_posts enable row level security;
alter table public.reach_analysis enable row level security;
alter table public.team_members enable row level security;
alter table public.content_library enable row level security;

-- profiles: a user owns the row whose id == auth.uid()
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- Helper macro: owner-scoped CRUD on a user_id column.
-- (Written out per-table because Postgres policies can't be parameterized.)

-- generated_posts
drop policy if exists "gp_all_own" on public.generated_posts;
create policy "gp_all_own" on public.generated_posts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- scheduled_posts
drop policy if exists "sp_all_own" on public.scheduled_posts;
create policy "sp_all_own" on public.scheduled_posts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- competitors
drop policy if exists "comp_all_own" on public.competitors;
create policy "comp_all_own" on public.competitors
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- competitor_posts: owned transitively through competitors
drop policy if exists "cp_all_own" on public.competitor_posts;
create policy "cp_all_own" on public.competitor_posts
  for all using (
    exists (
      select 1 from public.competitors c
      where c.id = competitor_posts.competitor_id and c.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.competitors c
      where c.id = competitor_posts.competitor_id and c.user_id = auth.uid()
    )
  );

-- reach_analysis
drop policy if exists "ra_all_own" on public.reach_analysis;
create policy "ra_all_own" on public.reach_analysis
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- team_members
drop policy if exists "tm_all_own" on public.team_members;
create policy "tm_all_own" on public.team_members
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- content_library
drop policy if exists "cl_all_own" on public.content_library;
create policy "cl_all_own" on public.content_library
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Storage bucket for media (avatars, post images)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media_read" on storage.objects;
create policy "media_read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media_write_own" on storage.objects;
create policy "media_write_own" on storage.objects
  for insert with check (
    bucket_id = 'media' and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "media_delete_own" on storage.objects;
create policy "media_delete_own" on storage.objects
  for delete using (
    bucket_id = 'media' and auth.uid()::text = (storage.foldername(name))[1]
  );
