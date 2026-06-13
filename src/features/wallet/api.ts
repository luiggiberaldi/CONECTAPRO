import { supabaseBrowser } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Wallet, Recarga } from '@/types';
import { getPrecioPaquete } from '@/lib/constants';

/**
 * Obtiene el wallet de un profesional.
 */
export async function getWallet(profesionalid: string): Promise<Wallet | null> {
  try {
    const { data, error } = await supabaseBrowser
      .from('wallet')
      .select('*')
      .eq('profesionalid', profesionalid)
      .single();

    if (error) throw error;
    return data as Wallet;
  } catch (error) {
    console.error('[getWallet]', error);
    toast.error((error as Error).message);
    return null;
  }
}

/**
 * Obtiene el historial de solicitudes de recargas de un profesional.
 */
export async function getHistorialRecargas(profesionalid: string): Promise<Recarga[] | null> {
  try {
    const { data, error } = await supabaseBrowser
      .from('recargas')
      .select('*')
      .eq('profesionalid', profesionalid)
      .order('createdat', { ascending: false });

    if (error) throw error;
    return data as Recarga[];
  } catch (error) {
    console.error('[getHistorialRecargas]', error);
    toast.error((error as Error).message);
    return null;
  }
}

/**
 * Registra una solicitud de recarga subiendo la captura a Supabase Storage
 * e insertando la transacción en la tabla recargas.
 */
export async function solicitarRecarga(
  profesionalid: string,
  paquete: number,
  metodopago: 'pagomovil' | 'zelle' | 'usdt',
  referencia: string,
  capturaFile: File
): Promise<Recarga | null> {
  try {
    // 1. Subir la imagen de captura a Supabase Storage (bucket: 'recargas')
    const fileExt = capturaFile.name.split('.').pop();
    const fileName = `${profesionalid}_${Date.now()}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabaseBrowser
      .storage
      .from('recargas')
      .upload(fileName, capturaFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Error al subir la captura de pago: ${uploadError.message}`);
    }

    if (!uploadData?.path) {
      throw new Error('No se pudo obtener la ruta del archivo subido.');
    }

    // 2. Obtener la URL pública del archivo subido
    const { data: urlData } = supabaseBrowser
      .storage
      .from('recargas')
      .getPublicUrl(fileName);

    const publicUrl = urlData?.publicUrl;
    if (!publicUrl) {
      throw new Error('No se pudo generar la URL pública de la captura de pago.');
    }

    // 3. Calcular el monto en USD con descuento progresivo
    const montousd = getPrecioPaquete(paquete);

    // 4. Registrar la recarga en la base de datos
    const { data, error } = await supabaseBrowser
      .from('recargas')
      .insert({
        profesionalid,
        paquete,
        montousd,
        metodopago,
        referencia,
        captura_url: publicUrl,
        estado: 'pendiente'
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // REGLA CRITICA: Solo mostrar toast de éxito si el insert retorna un ID real.
    if (data?.id) {
      toast.success('Solicitud de recarga enviada exitosamente. Será revisada por el administrador.');
      return data as Recarga;
    } else {
      throw new Error('La solicitud fue creada pero no se recibió confirmación de ID.');
    }

  } catch (error) {
    console.error('[solicitarRecarga]', error);
    toast.error((error as Error).message);
    return null;
  }
}
