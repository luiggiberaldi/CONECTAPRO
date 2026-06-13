import { Recarga, Orden, Usuario, Categoria } from '@/types';

export interface AdminKPIs {
  totalOrdenesHoy: number;
  profesionalesActivos: number;
  creditosVendidos: number;
  dolaresRecaudados: number;
}

export interface AdminRecarga extends Omit<Recarga, 'usuario'> {
  usuarios: {
    nombre: string;
    email: string;
    avatar_url: string | null;
  } | null;
}

export interface AdminOrden extends Orden {
  cliente: {
    nombre: string;
    email: string;
    avatar_url: string | null;
  } | null;
  profesional: {
    nombre: string;
    email: string;
    avatar_url: string | null;
  } | null;
  categoria: Categoria | null;
}

export interface AdminUsuario extends Usuario {
  profesionales?: {
    especialidad: string;
    calificacionpromedio: number;
    totaltrabajos: number;
  }[] | null;
}
export type OrdenFilterEstado = 'todos' | 'pendiente' | 'en_proceso' | 'completada' | 'cancelada';
