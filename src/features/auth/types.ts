import { Usuario, RolUsuario } from '@/types';

export type AuthRole = RolUsuario;

export type AuthUser = Usuario;

export interface LoginPayload {
  email: string;
  password?: string; // En Next.js 14, password es opcional si usamos magic links, pero obligatorio en password auth.
}

export interface RegistroPayload {
  email: string;
  password?: string;
  nombre: string;
  rol: AuthRole;
  // Campos opcionales para profesionales
  especialidad?: string;
  descripcion?: string;
  anyosexperiencia?: number;
  ciudad?: string;
}
