import { Orden, UrgenciaOrden, Usuario, Categoria } from '@/types';

export interface CrearOrdenPayload {
  clienteid: string;
  categoriaid: string;
  titulo: string;
  descripcion: string;
  ciudad: string;
  zona: string;
  urgencia: UrgenciaOrden;
}

export interface AceptarOrdenPayload {
  ordenid: string;
  profesionalid: string;
}

export interface AceptarOrdenResponse {
  success: boolean;
  message: string;
}

export interface OrdenDetalle extends Orden {
  cliente: Pick<Usuario, 'id' | 'nombre' | 'email' | 'avatar_url' | 'ciudad'>;
  profesional: (Pick<Usuario, 'id' | 'nombre' | 'email' | 'avatar_url' | 'ciudad'> & {
    profesionales?: { especialidad: string; calificacionpromedio: number }
  }) | null;
  categoria: Pick<Categoria, 'id' | 'nombre' | 'slug' | 'icono'>;
}

export interface ClienteOrden extends Orden {
  categoria?: { nombre: string; slug: string };
}

export interface DisponibleOrden extends Orden {
  cliente?: { nombre: string; avatar_url: string | null };
}

export interface AsignadaOrden extends Orden {
  cliente?: { nombre: string; avatar_url: string | null };
  categoria?: { nombre: string; slug: string };
}
