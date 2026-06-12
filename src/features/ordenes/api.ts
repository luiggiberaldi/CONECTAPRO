import { supabaseBrowser } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { CrearOrdenPayload, AceptarOrdenResponse, ClienteOrden, DisponibleOrden, AsignadaOrden, OrdenDetalle } from './types';
import { Orden } from '@/types';

export async function crearOrden(payload: CrearOrdenPayload): Promise<Orden | null> {
  try {
    const { data, error } = await supabaseBrowser
      .from('ordenes')
      .insert({
        clienteid: payload.clienteid,
        categoriaid: payload.categoriaid,
        titulo: payload.titulo,
        descripcion: payload.descripcion,
        ciudad: payload.ciudad,
        zona: payload.zona,
        urgencia: payload.urgencia,
        estado: 'pendiente',
      })
      .select()
      .single();

    if (error) throw error;

    if (data?.id) {
      toast.success('Orden publicada exitosamente');
    }
    return data;
  } catch (error) {
    console.error('[crearOrden]', error);
    toast.error((error as Error).message);
    return null;
  }
}

export async function getOrdenesCliente(clienteid: string): Promise<ClienteOrden[] | null> {
  try {
    const { data, error } = await supabaseBrowser
      .from('ordenes')
      .select('*, categoria:categoriaid(nombre, slug)')
      .eq('clienteid', clienteid)
      .order('createdat', { ascending: false });

    if (error) throw error;
    return data as ClienteOrden[];
  } catch (error) {
    console.error('[getOrdenesCliente]', error);
    toast.error((error as Error).message);
    return null;
  }
}

export async function getOrdenesDisponibles(categoriaid: string): Promise<DisponibleOrden[] | null> {
  try {
    const { data, error } = await supabaseBrowser
      .from('ordenes_disponibles_view')
      .select('*, cliente:clienteid(nombre, avatar_url)')
      .eq('categoriaid', categoriaid)
      .eq('estado', 'pendiente')
      .order('cliente_reputacion', { ascending: false })
      .order('createdat', { ascending: false });

    if (error) throw error;
    return data as unknown as DisponibleOrden[];
  } catch (error) {
    console.error('[getOrdenesDisponibles]', error);
    toast.error((error as Error).message);
    return null;
  }
}

export async function getOrdenesAsignadasProfesional(profesionalid: string): Promise<AsignadaOrden[] | null> {
  try {
    const { data, error } = await supabaseBrowser
      .from('ordenes')
      .select('*, cliente:clienteid(nombre, avatar_url), categoria:categoriaid(nombre, slug)')
      .eq('profesionalid', profesionalid)
      .order('createdat', { ascending: false });

    if (error) throw error;
    return data as AsignadaOrden[];
  } catch (error) {
    console.error('[getOrdenesAsignadasProfesional]', error);
    toast.error((error as Error).message);
    return null;
  }
}

export async function getOrdenDetalle(id: string): Promise<OrdenDetalle | null> {
  try {
    const { data, error } = await supabaseBrowser
      .from('ordenes')
      .select(`
        *,
        cliente:clienteid(id, nombre, email, avatar_url, ciudad),
        profesional:profesionalid(id, nombre, email, avatar_url, ciudad),
        categoria:categoriaid(id, nombre, slug, icono)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as unknown as OrdenDetalle;
  } catch (error) {
    console.error('[getOrdenDetalle]', error);
    toast.error((error as Error).message);
    return null;
  }
}

export async function aceptarOrdenRPC(ordenid: string, profesionalid: string): Promise<AceptarOrdenResponse | null> {
  try {
    const { data, error } = await supabaseBrowser.rpc('aceptar_orden', {
      p_ordenid: ordenid,
      p_profesionalid: profesionalid,
    });

    if (error) throw error;
    
    const response = data as AceptarOrdenResponse;
    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
    return response;
  } catch (error) {
    console.error('[aceptarOrdenRPC]', error);
    toast.error((error as Error).message);
    return null;
  }
}

export async function marcarOrdenCompletada(ordenid: string, usuarioid: string): Promise<boolean> {
  try {
    // 1. Actualizar el estado de la orden a 'completada'
    const { error: updateError } = await supabaseBrowser
      .from('ordenes')
      .update({ estado: 'completada', updatedat: new Date().toISOString() })
      .eq('id', ordenid);

    if (updateError) throw updateError;

    // 2. Insertar mensaje de sistema en la orden informando la finalización
    const { error: msgError } = await supabaseBrowser
      .from('mensajes')
      .insert({
        ordenid,
        autorid: usuarioid,
        contenido: 'El servicio ha sido marcado como COMPLETADO. Las opciones de calificación ya se encuentran disponibles.',
        tipo: 'sistema',
      });

    if (msgError) throw msgError;

    toast.success('Servicio finalizado exitosamente');
    return true;
  } catch (error) {
    console.error('[marcarOrdenCompletada]', error);
    toast.error((error as Error).message);
    return false;
  }
}
