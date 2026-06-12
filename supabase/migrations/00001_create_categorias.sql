-- 00001_create_categorias.sql

create table public.categorias (
  id uuid primary key default gen_random_uuid(),
  nombre text not null unique,
  slug text not null unique,
  icono text not null,
  activo boolean not null default true
);

-- Habilitar Row Level Security (RLS)
alter table public.categorias enable row level security;

-- Política RLS: Lectura pública para cualquier usuario (autenticado o anónimo)
create policy "Permitir lectura publica de categorias"
on public.categorias
for select
using (true);

-- Política RLS: Modificación (insert, update, delete) permitida solo a usuarios con rol 'admin'
create policy "Modificacion restringida a administradores"
on public.categorias
for all
to authenticated
using (
  coalesce(auth.jwt() -> 'user_metadata' ->> 'rol', '') = 'admin'
);
