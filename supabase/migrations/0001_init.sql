-- Bento portfolio builder — core schema
-- Run this in the Supabase SQL editor (or `supabase db push`) once per project.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_username_idx on public.profiles (username);

-- keep updated_at current on every write
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

alter table public.profiles enable row level security;

-- Anyone can read a profile that has been published.
drop policy if exists "published profiles are public" on public.profiles;
create policy "published profiles are public"
  on public.profiles for select
  using ((data ->> 'published')::boolean is true);

-- Owners can always read their own row, published or not.
drop policy if exists "owners can read own profile" on public.profiles;
create policy "owners can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "owners can insert own profile" on public.profiles;
create policy "owners can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "owners can update own profile" on public.profiles;
create policy "owners can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "owners can delete own profile" on public.profiles;
create policy "owners can delete own profile"
  on public.profiles for delete
  using (auth.uid() = id);

-- Storage bucket for uploaded images/gifs/resumes.
insert into storage.buckets (id, name, public)
values ('portfolio-uploads', 'portfolio-uploads', true)
on conflict (id) do nothing;

drop policy if exists "public read of portfolio uploads" on storage.objects;
create policy "public read of portfolio uploads"
  on storage.objects for select
  using (bucket_id = 'portfolio-uploads');

drop policy if exists "users upload into own folder" on storage.objects;
create policy "users upload into own folder"
  on storage.objects for insert
  with check (
    bucket_id = 'portfolio-uploads'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "users manage own uploads" on storage.objects;
create policy "users manage own uploads"
  on storage.objects for update using (
    bucket_id = 'portfolio-uploads'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "users delete own uploads" on storage.objects;
create policy "users delete own uploads"
  on storage.objects for delete using (
    bucket_id = 'portfolio-uploads'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
