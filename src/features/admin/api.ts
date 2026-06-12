import { supabaseBrowser } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { AdminKPIs, AdminRecarga, AdminOrden, AdminUsuario, OrdenFilterEstado } from './types';

interface AdminActionResponse {
  success: boolean;
  id?: string;
  message: string;
}

async function postAdminAction(endpoint: string, id: string): Promise<boolean> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });

  const result = (await response.json()) as AdminActionResponse;

  if (!response.ok || !result.success || !result.id) {
    toast.error(result.message || 'No se pudo completar la accion solicitada.');
    return false;
  }

  toast.success(result.message);
  return true;
}

/**
 * Obtiene métricas clave del sistema para el dashboard del administrador.
 */
export async function getKPIs(): Promise<AdminKPIs | null> {
  try {
    // 1. Total de órdenes creadas hoy (hora local venezolana o UTC 00:00:00 del día actual)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const { count: totalOrdenesHoy, error: errOrdenes } = await supabaseBrowser
      .from('ordenes')
      .select('*', { count: 'exact', head: true })
      .gte('createdat', startOfDay.toISOString());

    if (errOrdenes) throw errOrdenes;

    // 2. Profesionales activos registrados en el sistema
    const { count: profesionalesActivos, error: errProfesionales } = await supabaseBrowser
      .from('usuarios')
      .select('*', { count: 'exact', head: true })
      .eq('rol', 'profesional')
      .eq('estado', 'activo');

    if (errProfesionales) throw errProfesionales;

    // 3. Suma total de créditos vendidos (por recargas con estado = 'aprobada')
    const { data: recargas, error: errRecargas } = await supabaseBrowser
      .from('recargas')
      .select('paquete')
      .eq('estado', 'aprobada');

    if (errRecargas) throw errRecargas;

    const creditosVendidos = (recargas || []).reduce((acc, current) => acc + (current.paquete || 0), 0);

    return {
      totalOrdenesHoy: totalOrdenesHoy || 0,
      profesionalesActivos: profesionalesActivos || 0,
      creditosVendidos,
    };
  } catch (error) {
    console.error('[getKPIs]', error);
    toast.error((error as Error).message);
    return null;
  }
}

/**
 * Obtiene el listado de recargas en estado pendiente, ordenadas por fecha de creación (ascendente).
 */
export async function getRecargasPendientes(): Promise<AdminRecarga[] | null> {
  try {
    const { data, error } = await supabaseBrowser
      .from('recargas')
      .select('*, usuarios:profesionalid(nombre, email, avatar_url)')
      .eq('estado', 'pendiente')
      .order('createdat', { ascending: true });

    if (error) throw error;
    return data as unknown as AdminRecarga[];
  } catch (error) {
    console.error('[getRecargasPendientes]', error);
    toast.error((error as Error).message);
    return null;
  }
}

/**
 * Aprueba una recarga invocando la RPC de base de datos 'aprobar_recarga'.
 */
export async function aprobarRecarga(id: string): Promise<boolean> {
  try {
    return await postAdminAction('/api/admin/aprobar-recarga', id);
  } catch (error) {
    console.error('[aprobarRecarga]', error);
    toast.error((error as Error).message);
    return false;
  }
}

/**
 * Rechaza una recarga pendiente.
 */
export async function rechazarRecarga(id: string): Promise<boolean> {
  try {
    return await postAdminAction('/api/admin/rechazar-recarga', id);
  } catch (error) {
    console.error('[rechazarRecarga]', error);
    toast.error((error as Error).message);
    return false;
  }
}

/**
 * Obtiene todas las órdenes del sistema con filtros de estado y de búsqueda por título.
 */
export async function getTodasOrdenes(filters: {
  estado?: OrdenFilterEstado;
  query?: string;
}): Promise<AdminOrden[] | null> {
  try {
    let queryBuilder = supabaseBrowser
      .from('ordenes')
      .select(`
        *,
        cliente:clienteid(nombre, email, avatar_url),
        profesional:profesionalid(nombre, email, avatar_url),
        categoria:categoriaid(nombre, slug, icono)
      `)
      .order('createdat', { ascending: false });

    if (filters.estado && filters.estado !== 'todos') {
      queryBuilder = queryBuilder.eq('estado', filters.estado);
    }

    if (filters.query) {
      queryBuilder = queryBuilder.ilike('titulo', `%${filters.query}%`);
    }

    const { data, error } = await queryBuilder;

    if (error) throw error;
    return data as unknown as AdminOrden[];
  } catch (error) {
    console.error('[getTodasOrdenes]', error);
    toast.error((error as Error).message);
    return null;
  }
}

/**
 * Obtiene el listado completo de usuarios registrados en la base de datos (clientes y profesionales).
 */
export async function getTodosUsuarios(): Promise<AdminUsuario[] | null> {
  try {
    const { data, error } = await supabaseBrowser
      .from('usuarios')
      .select('*, profesionales(especialidad, calificacionpromedio, totaltrabajos)')
      .order('nombre', { ascending: true });

    if (error) throw error;
    return data as unknown as AdminUsuario[];
  } catch (error) {
    console.error('[getTodosUsuarios]', error);
    toast.error((error as Error).message);
    return null;
  }
}

/**
 * Suspende a un usuario para impedir su acceso al sistema.
 */
export async function suspenderUsuario(id: string): Promise<boolean> {
  try {
    return await postAdminAction('/api/admin/suspender-usuario', id);
  } catch (error) {
    console.error('[suspenderUsuario]', error);
    toast.error((error as Error).message);
    return false;
  }
}

/**
 * Activa a un usuario suspendido.
 */
export async function activarUsuario(id: string): Promise<boolean> {
  try {
    return await postAdminAction('/api/admin/activar-usuario', id);
  } catch (error) {
    console.error('[activarUsuario]', error);
    toast.error((error as Error).message);
    return false;
  }
}
