-- 00006_create_recargas.sql

create table public.recargas (
  id uuid primary key default gen_random_uuid(),
  profesionalid uuid not null references public.usuarios(id) on delete cascade,
  paquete integer not null,
  montousd numeric not null,
  metodopago text not null check (metodopago in ('pagomovil', 'zelle', 'usdt')),
  referencia text not null,
  captura_url text not null,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'aprobada', 'rechazada')),
  createdat timestamptz not null default now(),
  aprobadoat timestamptz
);

-- Habilitar RLS
alter table public.recargas enable row level security;

-- Políticas RLS

-- 1. Lectura: Un profesional puede ver sus propias recargas
create policy "Permitir lectura de recargas propias"
on public.recargas
for select
to authenticated
using (auth.uid() = profesionalid);

-- 2. Inserción: Un profesional puede registrar una solicitud de recarga para sí mismo
create policy "Permitir crear solicitudes de recarga propias"
on public.recargas
for insert
to authenticated
with check (auth.uid() = profesionalid);

-- 3. Admin: Control total (incluye aprobación/rechazo)
create policy "Admins control total sobre recargas"
on public.recargas
for all
to authenticated
using (
  coalesce(auth.jwt() -> 'user_metadata' ->> 'rol', '') = 'admin'
);
