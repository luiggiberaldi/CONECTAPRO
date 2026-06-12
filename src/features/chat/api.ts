import { supabaseBrowser } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Mensaje } from '@/types';

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
