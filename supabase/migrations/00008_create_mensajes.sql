-- 00008_create_mensajes.sql

create table public.mensajes (
  id uuid primary key default gen_random_uuid(),
  ordenid uuid not null references public.ordenes(id) on delete cascade,
  autorid uuid not null references public.usuarios(id) on delete cascade,
  contenido text not null,
  tipo text not null default 'texto' check (tipo in ('texto', 'sistema')),
  createdat timestamptz not null default now()
);

-- Habilitar RLS
alter table public.mensajes enable row level security;

-- Políticas RLS

-- 1. Lectura: Un usuario puede leer los mensajes de una orden si es el autor de los mensajes, o si es el cliente o profesional asignado a dicha orden.
create policy "Permitir lectura de mensajes de la orden"
on public.mensajes
for select
to authenticated
using (
  auth.uid() = autorid or
  exists (
    select 1 from public.ordenes
    where ordenes.id = mensajes.ordenid
    and (ordenes.clienteid = auth.uid() or ordenes.profesionalid = auth.uid())
  )
);

-- 2. Inserción: Un usuario puede enviar un mensaje si es el autor (autorid = auth.uid()) y es el cliente o profesional asignado a dicha orden.
create policy "Permitir enviar mensajes en la orden"
on public.mensajes
for insert
to authenticated
with check (
  auth.uid() = autorid and
  exists (
    select 1 from public.ordenes
    where ordenes.id = ordenid
    and (ordenes.clienteid = auth.uid() or ordenes.profesionalid = auth.uid())
  )
);

-- 3. Admin: Control total
create policy "Admins control total sobre mensajes"
on public.mensajes
for all
to authenticated
using (
  coalesce(auth.jwt() -> 'user_metadata' ->> 'rol', '') = 'admin'
);
