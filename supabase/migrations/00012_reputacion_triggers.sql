-- 00012_reputacion_triggers.sql

-- 1. Función para recalcular reputación de profesionales
create or replace function public.recalcular_reputacion_profesional()
returns trigger as $$
declare
  v_usuarioid uuid;
  v_promedio numeric;
  v_total integer;
begin
  -- Identificar el ID de usuario calificado (según la operación)
  if (TG_OP = 'DELETE') then
    v_usuarioid := OLD.calificadoa;
  else
    v_usuarioid := NEW.calificadoa;
  end if;

  -- Solo actualizar si el usuario calificado es un profesional registrado
  if exists (select 1 from public.profesionales where usuarioid = v_usuarioid) then
    select coalesce(round(avg(estrellas), 2), 0), count(*)
    into v_promedio, v_total
    from public.calificaciones
    where calificadoa = v_usuarioid;

    update public.profesionales
    set calificacionpromedio = v_promedio,
        totaltrabajos = v_total
    where usuarioid = v_usuarioid;
  end if;

  return null;
end;
$$ language plpgsql security definer;

-- 2. Crear Trigger
create or replace trigger trigger_recalcular_reputacion
after insert or update or delete on public.calificaciones
for each row execute function public.recalcular_reputacion_profesional();

-- 3. Vista para ordenar órdenes disponibles por la reputación del cliente creador
create or replace view public.ordenes_disponibles_view as
select
  o.*,
  coalesce(
    (
      select round(avg(estrellas), 2)
      from public.calificaciones
      where calificadoa = o.clienteid
    ),
    0.0
  ) as cliente_reputacion
from public.ordenes o;
