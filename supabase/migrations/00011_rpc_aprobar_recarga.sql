-- 00011_rpc_aprobar_recarga.sql

create or replace function public.aprobar_recarga(p_recargaid uuid)
returns json as $$
declare
  v_profesionalid uuid;
  v_paquete integer;
  v_estado text;
begin
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
  -- Si el wallet por alguna razón no existe, se inserta; de lo contrario, se actualiza sumando el paquete.
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
