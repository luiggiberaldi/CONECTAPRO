-- 00004_create_ordenes.sql

create table public.ordenes (
  id uuid primary key default gen_random_uuid(),
  clienteid uuid not null references public.usuarios(id) on delete cascade,
  profesionalid uuid references public.usuarios(id) on delete set null,
  categoriaid uuid not null references public.categorias(id) on delete cascade,
  titulo text not null,
  descripcion text not null,
  ciudad text not null,
  zona text not null,
  urgencia text not null check (urgencia in ('hoy', 'esta_semana')),
  estado text not null default 'pendiente' check (estado in ('pendiente', 'en_proceso', 'completada', 'cancelada')),
  createdat timestamptz not null default now(),
  updatedat timestamptz not null default now()
);

-- Habilitar RLS
alter table public.ordenes enable row level security;

-- Políticas RLS

-- 1. Lectura: Un usuario puede ver la orden si es el creador (cliente), el profesional asignado, o si la orden está pendiente (para que los profesionales la vean)
create policy "Permitir lectura de ordenes"
on public.ordenes
for select
to authenticated
using (
  auth.uid() = clienteid or 
  auth.uid() = profesionalid or 
  estado = 'pendiente'
);

-- 2. Inserción: Solo el creador de la orden (clienteid) puede insertar la orden, asegurando que coincida con su auth.uid()
create policy "Permitir crear ordenes a los clientes"
on public.ordenes
for insert
to authenticated
with check (auth.uid() = clienteid);

-- 3. Actualización: El cliente de la orden, el profesional asignado, o un profesional que intente aceptar una orden pendiente pueden actualizarla
create policy "Permitir actualizar ordenes"
on public.ordenes
for update
to authenticated
using (
  auth.uid() = clienteid or 
  auth.uid() = profesionalid or 
  estado = 'pendiente'
);

-- 4. Admin: Control total
create policy "Admins control total sobre ordenes"
on public.ordenes
for all
to authenticated
using (
  coalesce(auth.jwt() -> 'user_metadata' ->> 'rol', '') = 'admin'
);
