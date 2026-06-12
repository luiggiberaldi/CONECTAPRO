import { supabaseBrowser } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { ReputacionProfesional, Resena } from './types';

/**
 * Registra una calificación para un servicio (cliente a profesional, o profesional a cliente).
 */
export async function calificarServicio(
  ordenid: string,
  calificadorpor: string,
  calificadoa: string,
  estrellas: number,
  comentario: string | null
): Promise<boolean> {
  try {
    // 1. Validar si ya existe una calificación por este usuario para esta orden
    const { data: existe, error: errCheck } = await supabaseBrowser
      .from('calificaciones')
      .select('id')
      .eq('ordenid', ordenid)
      .eq('calificadorpor', calificadorpor)
      .maybeSingle();

    if (errCheck) throw errCheck;

    if (existe) {
      toast.error('Ya has calificado este servicio anteriormente.');
      return false;
    }

    // 2. Insertar calificación
    const { data, error } = await supabaseBrowser
      .from('calificaciones')
      .insert({
        ordenid,
        calificadorpor,
        calificadoa,
        estrellas,
        comentario,
      })
      .select()
      .single();

    if (error) throw error;

    // REGLA CRITICA: Toast de éxito solo si retorna un ID real
    if (data?.id) {
      toast.success('Calificación registrada exitosamente.');
      return true;
    }

    return false;
  } catch (error) {
    console.error('[calificarServicio]', error);
    toast.error((error as Error).message);
    return false;
  }
}

/**
 * Obtiene la reputación y el listado de reseñas de un profesional.
 */
export async function getReputacionProfesional(usuarioid: string): Promise<ReputacionProfesional | null> {
  try {
    // 1. Obtener datos del perfil del profesional
    const { data: prof, error: errProf } = await supabaseBrowser
      .from('profesionales')
      .select('calificacionpromedio, totaltrabajos')
      .eq('usuarioid', usuarioid)
      .single();

    if (errProf) throw errProf;

    // 2. Obtener reseñas recibidas (donde calificadoa = usuarioid)
    const { data: reviews, error: errReviews } = await supabaseBrowser
      .from('calificaciones')
      .select(`
        *,
        calificador:calificadorpor(nombre, avatar_url)
      `)
      .eq('calificadoa', usuarioid)
      .order('createdat', { ascending: false });

    if (errReviews) throw errReviews;

    return {
      calificacionpromedio: Number(prof.calificacionpromedio) || 0,
      totaltrabajos: prof.totaltrabajos || 0,
      resenas: (reviews as unknown as Resena[]) || [],
    };
  } catch (error) {
    console.error('[getReputacionProfesional]', error);
    toast.error((error as Error).message);
    return null;
  }
}

/**
 * Obtiene las reseñas y reputación promedio de un cliente (calificaciones dejadas por profesionales).
 */
export async function getCalificacionCliente(clienteid: string): Promise<ReputacionProfesional | null> {
  try {
    const { data: reviews, error } = await supabaseBrowser
      .from('calificaciones')
      .select(`
        *,
        calificador:calificadorpor(nombre, avatar_url)
      `)
      .eq('calificadoa', clienteid)
      .order('createdat', { ascending: false });

    if (error) throw error;

    const resenas = (reviews as unknown as Resena[]) || [];
    const total = resenas.length;
    const promedio = total > 0 ? resenas.reduce((acc, r) => acc + r.estrellas, 0) / total : 0;

    return {
      calificacionpromedio: Number(promedio.toFixed(2)),
      totaltrabajos: total,
      resenas,
    };
  } catch (error) {
    console.error('[getCalificacionCliente]', error);
    toast.error((error as Error).message);
    return null;
  }
}

/**
 * Verifica si un usuario ya calificó una orden.
 */
export async function haCalificadoOrden(ordenid: string, calificadorpor: string): Promise<boolean> {
  try {
    const { data, error } = await supabaseBrowser
      .from('calificaciones')
      .select('id')
      .eq('ordenid', ordenid)
      .eq('calificadorpor', calificadorpor)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('[haCalificadoOrden]', error);
    return false;
  }
}
