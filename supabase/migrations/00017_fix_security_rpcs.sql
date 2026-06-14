-- 00017_fix_security_rpcs.sql
-- Optimización de ciberseguridad en funciones RPC críticas

-- 1. Redefinir aceptar_orden con validación de identidad (auth.uid)
create or replace function public.aceptar_orden(p_ordenid uuid, p_profesionalid uuid)
returns json as $$
declare
  v_saldo integer;
  v_estado text;
  v_categoriaid uuid;
begin
  -- Control de acceso: Verificar que el invocador sea el propio profesional
  if (auth.uid() <> p_profesionalid) then
    return json_build_object('success', false, 'message', 'Acción no autorizada. No puedes aceptar órdenes a nombre de otro profesional.');
  end if;

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


-- 2. Redefinir aprobar_recarga con validación de rol de admin en JWT
create or replace function public.aprobar_recarga(p_recargaid uuid)
returns json as $$
declare
  v_profesionalid uuid;
  v_paquete integer;
  v_estado text;
begin
  -- Control de acceso: Verificar que el invocador posea el rol 'admin'
  if (coalesce(auth.jwt() -> 'user_metadata' ->> 'rol', '') <> 'admin') then
    return json_build_object('success', false, 'message', 'Acción no autorizada. Requiere rol de administrador.');
  end if;

  -- 1. Obtener datos de la recarga
  select profesionalid, paquete, estado
  into v_profesionalid, v_paquete, v_estado
  from public.recargas
  where id = p_recargaid;

  if not found then
    return json_build_object('success', false, 'message', 'Recarga no encontrada.');
  end if;

  -- 2. Validar que esté pendiente
  if v_estado <> 'pendiente' then
    return json_build_object('success', false, 'message', 'La recarga ya fue procesada anteriormente.');
  end if;

  -- 3. Actualizar la recarga a aprobada
  update public.recargas
  set estado = 'aprobada', aprobadoat = now()
  where id = p_recargaid;

  -- 4. Sumar los créditos al wallet del profesional
  insert into public.wallet (profesionalid, saldo, totalcargado, totalusado)
  values (v_profesionalid, v_paquete, v_paquete, 0)
  on conflict (profesionalid) do update
  set saldo = public.wallet.saldo + v_paquete,
      totalcargado = public.wallet.totalcargado + v_paquete,
      updatedat = now();

  return json_build_object('success', true, 'message', 'Recarga aprobada exitosamente y créditos abonados.');
exception
  when others then
    return json_build_object('success', false, 'message', SQLERRM);
end;
$$ language plpgsql security definer;
