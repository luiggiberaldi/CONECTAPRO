-- 00015_create_reportes_mensajes.sql
-- Tabla para registrar reportes de mensajes sospechosos de puenteo.
-- Los usuarios pueden reportar mensajes; los admins los revisan en el panel.

create table public.reportes_mensajes (
  id           uuid         primary key default gen_random_uuid(),
  mensajeid    uuid         not null references public.mensajes(id) on delete cascade,
  reportadopor uuid         not null references public.usuarios(id) on delete cascade,
  razon        text         not null default 'puenteo'
                             check (razon in ('puenteo', 'spam', 'acoso', 'otro')),
  detalle      text,
  createdat    timestamptz  not null default now(),
  -- Evitar reportes duplicados del mismo usuario sobre el mismo mensaje
  unique (mensajeid, reportadopor)
);

-- Índice para consultas del panel admin
create index idx_reportes_createdat on public.reportes_mensajes(createdat desc);
create index idx_reportes_mensajeid on public.reportes_mensajes(mensajeid);

-- Habilitar RLS
alter table public.reportes_mensajes enable row level security;

-- Política: Cualquier usuario autenticado puede insertar un reporte
create policy "Usuarios pueden reportar mensajes"
on public.reportes_mensajes
for insert
to authenticated
with check (
  auth.uid() = reportadopor
);

-- Política: Solo admins pueden leer reportes
create policy "Solo admins pueden leer reportes"
on public.reportes_mensajes
for select
to authenticated
using (
  coalesce(auth.jwt() -> 'user_metadata' ->> 'rol', '') = 'admin'
);

-- Política: Admins control total
create policy "Admins control total sobre reportes"
on public.reportes_mensajes
for all
to authenticated
using (
  coalesce(auth.jwt() -> 'user_metadata' ->> 'rol', '') = 'admin'
);
