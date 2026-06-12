export type RolUsuario = 'cliente' | 'profesional' | 'admin';
export type EstadoUsuario = 'activo' | 'suspendido';
export type UrgenciaOrden = 'hoy' | 'esta_semana';
export type EstadoOrden = 'pendiente' | 'en_proceso' | 'completada' | 'cancelada';
export type MetodoPagoRecarga = 'pagomovil' | 'zelle' | 'usdt';
export type EstadoRecarga = 'pendiente' | 'aprobada' | 'rechazada';
export type TipoMensaje = 'texto' | 'sistema';

export interface Usuario {
  id: string; // uuid, PK
  email: string;
  nombre: string;
  rol: RolUsuario;
  avatar_url: string | null;
  ciudad: string | null;
  estado: EstadoUsuario;
  createdat: string; // timestamptz
}

export interface Profesional {
  id: string; // uuid, PK
  usuarioid: string; // uuid, FK usuarios
  especialidad: string;
  descripcion: string;
  anyosexperiencia: number;
  ciudad: string;
  calificacionpromedio: number;
  totaltrabajos: number;
  createdat: string; // timestamptz
}

export interface Categoria {
  id: string; // uuid, PK
  nombre: string;
  slug: string;
  icono: string;
  activo: boolean;
}

export interface Orden {
  id: string; // uuid, PK
  clienteid: string; // uuid, FK usuarios
  profesionalid: string | null; // uuid, FK usuarios, nullable
  categoriaid: string; // uuid, FK categorias
  titulo: string;
  descripcion: string;
  ciudad: string;
  zona: string;
  urgencia: UrgenciaOrden;
  estado: EstadoOrden;
  createdat: string; // timestamptz
  updatedat: string; // timestamptz
}

export interface Wallet {
  id: string; // uuid, PK
  profesionalid: string; // uuid, FK usuarios, unique
  saldo: number;
  totalcargado: number;
  totalusado: number;
  updatedat: string; // timestamptz
}

export interface Recarga {
  id: string; // uuid, PK
  profesionalid: string; // uuid, FK usuarios
  paquete: number;
  montousd: number;
  metodopago: MetodoPagoRecarga;
  referencia: string;
  captura_url: string;
  estado: EstadoRecarga;
  createdat: string; // timestamptz
  aprobadoat: string | null; // timestamptz, nullable
}

export interface Calificacion {
  id: string; // uuid, PK
  ordenid: string; // uuid, FK ordenes
  calificadorpor: string; // uuid, FK usuarios
  calificadoa: string; // uuid, FK usuarios
  estrellas: number; // 1-5
  comentario: string | null;
  createdat: string; // timestamptz
}

export interface Mensaje {
  id: string; // uuid, PK
  ordenid: string; // uuid, FK ordenes
  autorid: string; // uuid, FK usuarios
  contenido: string;
  tipo: TipoMensaje;
  createdat: string; // timestamptz
}
