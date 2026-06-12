-- 00003_create_profesionales.sql

create table public.profesionales (
  id uuid primary key default gen_random_uuid(),
  usuarioid uuid not null references public.usuarios(id) on delete cascade,
  especialidad text not null,
  descripcion text not null,
  anyosexperiencia integer not null,
  ciudad text not null,
  calificacionpromedio numeric not null default 0,
  totaltrabajos integer not null default 0,
  createdat timestamptz not null default now()
);

-- Habilitar RLS
alter table public.profesionales enable row level security;

-- Políticas RLS

-- 1. Lectura: Cualquier usuario autenticado puede ver la lista de profesionales y sus perfiles
create policy "Permitir lectura de perfiles profesionales"
on public.profesionales
for select
to authenticated
using (true);

-- 2. Inserción: Un usuario profesional puede crear su propio perfil profesional
create policy "Permitir crear perfil profesional propio"
on public.profesionales
for insert
to authenticated
with check (auth.uid() = usuarioid);

-- 3. Actualización: Un usuario profesional puede actualizar su propio perfil profesional
create policy "Permitir actualizar perfil profesional propio"
on public.profesionales
for update
to authenticated
using (auth.uid() = usuarioid)
with check (auth.uid() = usuarioid);

-- 4. Admin: Control total
create policy "Admins control total sobre profesionales"
on public.profesionales
for all
to authenticated
using (
  coalesce(auth.jwt() -> 'user_metadata' ->> 'rol', '') = 'admin'
);
