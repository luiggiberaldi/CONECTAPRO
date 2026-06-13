-- 00014_create_clientes.sql

-- 1. Crear tabla de clientes
create table public.clientes (
  id uuid primary key default gen_random_uuid(),
  usuarioid uuid not null unique references public.usuarios(id) on delete cascade,
  calificacionpromedio numeric not null default 0,
  totalproyectos integer not null default 0,
  createdat timestamptz not null default now()
);

-- 2. Habilitar RLS
alter table public.clientes enable row level security;

-- 3. Políticas RLS
create policy "Permitir lectura de perfiles de clientes"
on public.clientes
for select
to authenticated
using (true);

create policy "Permitir crear perfil de cliente propio"
on public.clientes
for insert
to authenticated
with check (auth.uid() = usuarioid);

create policy "Permitir actualizar perfil de cliente propio"
on public.clientes
for update
to authenticated
using (auth.uid() = usuarioid)
with check (auth.uid() = usuarioid);

create policy "Admins control total sobre clientes"
on public.clientes
for all
to authenticated
using (
  coalesce(auth.jwt() -> 'user_metadata' ->> 'rol', '') = 'admin'
);

-- 4. Función y Trigger para recalcular reputación de clientes
create or replace function public.recalcular_reputacion_cliente()
returns trigger as $$
declare
  v_usuarioid uuid;
  v_promedio numeric;
begin
  -- Identificar el ID de usuario calificado (según la operación)
  if (TG_OP = 'DELETE') then
    v_usuarioid := OLD.calificadoa;
  else
    v_usuarioid := NEW.calificadoa;
  end if;

  -- Solo actualizar si el usuario calificado es un cliente registrado
  if exists (select 1 from public.clientes where usuarioid = v_usuarioid) then
    select coalesce(round(avg(estrellas), 2), 0)
    into v_promedio
    from public.calificaciones
    where calificadoa = v_usuarioid;

    update public.clientes
    set calificacionpromedio = v_promedio
    where usuarioid = v_usuarioid;
  end if;

  return null;
end;
$$ language plpgsql security definer;

create or replace trigger trigger_recalcular_reputacion_cliente
after insert or update or delete on public.calificaciones
for each row execute function public.recalcular_reputacion_cliente();

-- 5. Función y Trigger para recalcular total de proyectos del cliente
create or replace function public.recalcular_proyectos_cliente()
returns trigger as $$
declare
  v_clienteid uuid;
  v_total integer;
begin
  -- Identificar el ID de cliente (según la operación)
  if (TG_OP = 'DELETE') then
    v_clienteid := OLD.clienteid;
  else
    v_clienteid := NEW.clienteid;
  end if;

  -- Solo actualizar si el cliente existe en la tabla de clientes
  if exists (select 1 from public.clientes where usuarioid = v_clienteid) then
    select count(*)
    into v_total
    from public.ordenes
    where clienteid = v_clienteid;

    update public.clientes
    set totalproyectos = v_total
    where usuarioid = v_clienteid;
  end if;

  return null;
end;
$$ language plpgsql security definer;

create or replace trigger trigger_recalcular_proyectos_cliente
after insert or update or delete on public.ordenes
for each row execute function public.recalcular_proyectos_cliente();

-- 6. Migrar usuarios existentes con rol 'cliente'
insert into public.clientes (usuarioid, calificacionpromedio, totalproyectos)
select 
  u.id as usuarioid,
  coalesce(
    (
      select round(avg(estrellas), 2)
      from public.calificaciones
      where calificadoa = u.id
    ),
    0.0
  ) as calificacionpromedio,
  coalesce(
    (
      select count(*)
      from public.ordenes
      where clienteid = u.id
    ),
    0
  ) as totalproyectos
from public.usuarios u
where u.rol = 'cliente'
on conflict (usuarioid) do nothing;

-- 7. Redefinir la vista de órdenes disponibles usando la reputación cacheada del cliente
create or replace view public.ordenes_disponibles_view as
select
  o.*,
  coalesce(
    (
      select calificacionpromedio
      from public.clientes
      where usuarioid = o.clienteid
    ),
    0.0
  ) as cliente_reputacion
from public.ordenes o;
