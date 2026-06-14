import { supabaseBrowser } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Mensaje } from '@/types';

export type RazonReporte = 'puenteo' | 'spam' | 'acoso' | 'otro';

/**
 * Obtiene el historial de mensajes para una orden de servicio.
 */
export async function getMensajes(ordenid: string): Promise<Mensaje[] | null> {
  try {
    const { data, error } = await supabaseBrowser
      .from('mensajes')
      .select('*')
      .eq('ordenid', ordenid)
      .order('createdat', { ascending: true });

    if (error) throw error;
    return data as Mensaje[];
  } catch (error) {
    console.error('[getMensajes]', error);
    toast.error((error as Error).message);
    return null;
  }
}

/**
 * Envía un nuevo mensaje en la orden de servicio.
 */
export async function enviarMensaje(
  ordenid: string,
  autorid: string,
  contenido: string,
  tipo: 'texto' | 'sistema' = 'texto'
): Promise<Mensaje | null> {
  try {
    const { data, error } = await supabaseBrowser
      .from('mensajes')
      .insert({
        ordenid,
        autorid,
        contenido,
        tipo,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Mensaje;
  } catch (error) {
    console.error('[enviarMensaje]', error);
    toast.error((error as Error).message);
    return null;
  }
}

/**
 * Registra un reporte de mensaje sospechoso.
 * Si el usuario ya reportó ese mensaje, muestra un aviso en lugar de error.
 */
export async function reportarMensaje(
  mensajeid: string,
  reportadopor: string,
  razon: RazonReporte = 'puenteo',
  detalle?: string,
): Promise<boolean> {
  try {
    const { error } = await supabaseBrowser
      .from('reportes_mensajes')
      .insert({ mensajeid, reportadopor, razon, detalle });

    if (error) {
      // Código 23505 = unique_violation (ya lo reportó antes)
      if (error.code === '23505') {
        toast.info('Ya habías reportado este mensaje anteriormente.');
        return false;
      }
      throw error;
    }

    toast.success('Mensaje reportado. Nuestro equipo lo revisará.');
    return true;
  } catch (error) {
    console.error('[reportarMensaje]', error);
    toast.error('No se pudo enviar el reporte. Intenta de nuevo.');
    return false;
  }
}
