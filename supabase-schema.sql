-- Supabase schema for Trainer App
-- Run this in the Supabase SQL editor

-- clients
create table if not exists clients (
  id         text primary key,
  name       text not null,
  created_at timestamptz,
  user_id    uuid references auth.users not null
);
alter table clients enable row level security;
create policy "clients: owner access"
  on clients for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- sessions
create table if not exists sessions (
  id         text primary key,
  client_id  text,
  client_ids text[],
  date       timestamptz,
  notes      text,
  exercises  jsonb,
  user_id    uuid references auth.users not null
);
alter table sessions enable row level security;
create policy "sessions: owner access"
  on sessions for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);
create index if not exists sessions_client_id_idx on sessions(client_id);
create index if not exists sessions_user_id_idx   on sessions(user_id);

-- exercise_library
create table if not exists exercise_library (
  id         text primary key,
  name       text not null,
  pattern    text,
  unilateral boolean,
  user_id    uuid references auth.users not null
);
alter table exercise_library enable row level security;
create policy "exercise_library: owner access"
  on exercise_library for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- templates
create table if not exists templates (
  id        text primary key,
  name      text not null,
  exercises jsonb,
  user_id   uuid references auth.users not null
);
alter table templates enable row level security;
create policy "templates: owner access"
  on templates for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- backups
create table if not exists backups (
  id         bigserial primary key,
  created_at timestamptz default now(),
  snapshot   jsonb,
  user_id    uuid references auth.users not null
);
alter table backups enable row level security;
create policy "backups: owner access"
  on backups for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);
create index if not exists backups_user_created_idx on backups(user_id, created_at);
