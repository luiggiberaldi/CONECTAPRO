-- 00010_rpc_aceptar_orden.sql

create or replace function public.aceptar_orden(p_ordenid uuid, p_profesionalid uuid)
returns json as $$
declare
  v_saldo integer;
  v_estado text;
  v_categoriaid uuid;
begin
  -- 1. Obtener la orden y su estado
  select estado, categoriaid into v_estado, v_categoriaid
  from public.ordenes
  where id = p_ordenid;

  if not found then
    return json_build_object('success', false, 'message', 'La orden no existe.');
  end if;

  if v_estado != 'pendiente' then
    return json_build_object('success', false, 'message', 'La orden ya no está disponible (ya fue aceptada o cancelada).');
  end if;

  -- 2. Obtener saldo de créditos del profesional
  select saldo into v_saldo
  from public.wallet
  where profesionalid = p_profesionalid;

  if not found then
    return json_build_object('success', false, 'message', 'El profesional no posee un wallet activo.');
  end if;

  if v_saldo < 1 then
    return json_build_object('success', false, 'message', 'Saldo de créditos insuficiente para aceptar la orden.');
  end if;

  -- 3. Descontar 1 crédito del wallet del profesional
  update public.wallet
  set saldo = saldo - 1,
      totalusado = totalusado + 1,
      updatedat = now()
  where profesionalid = p_profesionalid;

  -- 4. Asignar la orden al profesional y cambiar su estado a 'en_proceso'
  update public.ordenes
  set profesionalid = p_profesionalid,
      estado = 'en_proceso',
      updatedat = now()
  where id = p_ordenid;

  -- 5. Crear un mensaje de sistema en la orden informando que el profesional aceptó el trabajo
  insert into public.mensajes (ordenid, autorid, contenido, tipo)
  values (
    p_ordenid,
    p_profesionalid,
    'El profesional ha aceptado la orden de servicio. ¡Ya pueden iniciar el chat!',
    'sistema'
  );

  return json_build_object('success', true, 'message', '¡Orden aceptada exitosamente!');
end;
$$ language plpgsql security definer;
