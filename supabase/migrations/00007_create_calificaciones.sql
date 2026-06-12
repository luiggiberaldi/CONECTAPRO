-- 00007_create_calificaciones.sql

create table public.calificaciones (
  id uuid primary key default gen_random_uuid(),
  ordenid uuid not null references public.ordenes(id) on delete cascade,
  calificadorpor uuid not null references public.usuarios(id) on delete cascade,
  calificadoa uuid not null references public.usuarios(id) on delete cascade,
  estrellas integer not null check (estrellas between 1 and 5),
  comentario text,
  createdat timestamptz not null default now()
);

-- Habilitar RLS
alter table public.calificaciones enable row level security;

-- Políticas RLS

-- 1. Lectura: Las calificaciones son públicas para todos los usuarios autenticados (necesario para la reputación)
create policy "Permitir lectura de calificaciones"
on public.calificaciones
for select
to authenticated
using (true);

-- 2. Inserción: Un usuario puede insertar calificaciones siempre que sea él quien califica (calificadorpor)
create policy "Permitir crear calificaciones"
on public.calificaciones
for insert
to authenticated
with check (auth.uid() = calificadorpor);

-- Nota: Las modificaciones y eliminaciones directas están denegadas para usuarios normales.
-- Las calificaciones son permanentes e inapelables según las reglas de negocio.

-- 3. Admin: Control total (moderación)
create policy "Admins control total sobre calificaciones"
on public.calificaciones
for all
to authenticated
using (
  coalesce(auth.jwt() -> 'user_metadata' ->> 'rol', '') = 'admin'
);
