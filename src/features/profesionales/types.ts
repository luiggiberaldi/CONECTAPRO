import { Calificacion } from '@/types';

export interface Resena extends Calificacion {
  calificador: {
    nombre: string;
    avatar_url: string | null;
  } | null;
}

export interface ReputacionProfesional {
  calificacionpromedio: number;
  totaltrabajos: number;
  resenas: Resena[];
}
