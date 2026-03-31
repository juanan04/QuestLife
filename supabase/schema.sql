-- ============================================================
-- Quest Life — Schema
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- Tabla profiles: datos del jugador (xp, level, nombre)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default 'Aventurero',
  xp integer not null default 0,
  level integer not null default 1,
  join_date date not null default current_date,
  updated_at timestamptz not null default now()
);

-- Tabla quests: misiones del jugador
create table if not exists public.quests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  quest_id text not null,           -- ID lógico de la app (ej: "quest-1")
  data jsonb not null,              -- Objeto quest completo serializado
  updated_at timestamptz not null default now(),
  unique(user_id, quest_id)
);

-- Tabla habits: hábitos del jugador
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id text not null,           -- ID lógico de la app (ej: "habit-1")
  data jsonb not null,              -- Objeto habit completo serializado
  updated_at timestamptz not null default now(),
  unique(user_id, habit_id)
);

-- Tabla xp_log: historial de XP
create table if not exists public.xp_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  amount integer not null,
  reason text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

alter table public.profiles enable row level security;
alter table public.quests enable row level security;
alter table public.habits enable row level security;
alter table public.xp_log enable row level security;

-- profiles: cada usuario solo ve y edita la suya
create policy "profiles: own row" on public.profiles
  for all using (auth.uid() = id);

-- quests: cada usuario solo ve y edita las suyas
create policy "quests: own rows" on public.quests
  for all using (auth.uid() = user_id);

-- habits: cada usuario solo ve y edita los suyos
create policy "habits: own rows" on public.habits
  for all using (auth.uid() = user_id);

-- xp_log: cada usuario solo ve el suyo
create policy "xp_log: own rows" on public.xp_log
  for all using (auth.uid() = user_id);

-- ============================================================
-- Trigger: crear perfil automáticamente al registrarse
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
