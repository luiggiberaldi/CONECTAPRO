-- 00016_fn_validar_mensaje.sql
-- Trigger de validación server-side que bloquea mensajes con datos de contacto
-- externos antes de que lleguen a la base de datos.
-- Esta es la última línea de defensa (la primera está en el frontend).

create or replace function public.fn_validar_contenido_mensaje()
returns trigger
language plpgsql
security definer
as $$
declare
  contenido_lower text;
begin
  -- Solo validar mensajes de tipo 'texto' (los de sistema son internos)
  if NEW.tipo <> 'texto' then
    return NEW;
  end if;

  contenido_lower := lower(NEW.contenido);

  -- ── 1. Teléfonos venezolanos ─────────────────────────────────────────────
  -- Patrón: 0412, 0414, 0424, 0416, 0426 seguidos de 7 dígitos (con o sin separadores)
  if regexp_replace(contenido_lower, '[\s\-\.\(\)\/\\]', '', 'g')
       ~ '(58)?0?4(12|14|24|16|26)[0-9]{7}'
  then
    raise exception 'ANTIPUENTEO:telefono'
      using hint = 'No está permitido compartir números de teléfono.';
  end if;

  -- Secuencia genérica de 7-12 dígitos continuos
  if regexp_replace(contenido_lower, '[\s\-\.\(\)\/\\]', '', 'g')
       ~ '[0-9]{7,12}'
  then
    raise exception 'ANTIPUENTEO:telefono'
      using hint = 'No está permitido compartir secuencias numéricas que puedan ser teléfonos.';
  end if;

  -- ── 2. Correos electrónicos ──────────────────────────────────────────────
  if NEW.contenido ~ '[A-Za-z0-9.+\-]{2,}@[A-Za-z0-9\-]{2,}\.[A-Za-z]{2,}'
  then
    raise exception 'ANTIPUENTEO:email'
      using hint = 'No está permitido compartir correos electrónicos.';
  end if;

  -- ── 3. URLs y links externos ─────────────────────────────────────────────
  if contenido_lower ~ 'https?://'
  or contenido_lower ~ '\bwww\.'
  or contenido_lower ~ '\b(wa\.me|t\.me|linktr\.ee|bit\.ly|tinyurl\.com|discord\.gg)\b'
  then
    raise exception 'ANTIPUENTEO:url'
      using hint = 'No está permitido compartir links o URLs externas.';
  end if;

  -- ── 4. Handles de redes sociales explícitos ──────────────────────────────
  if contenido_lower ~ '\b(ig|insta|instagram|snap|fb|facebook|tiktok|twitter|telegram)\s*[:=@]\s*\S+'
  then
    raise exception 'ANTIPUENTEO:red_social'
      using hint = 'No está permitido compartir usuarios de redes sociales.';
  end if;

  return NEW;
end;
$$;

-- Asignar el trigger a la tabla mensajes
drop trigger if exists trg_validar_contenido_mensaje on public.mensajes;

create trigger trg_validar_contenido_mensaje
  before insert on public.mensajes
  for each row
  execute function public.fn_validar_contenido_mensaje();
