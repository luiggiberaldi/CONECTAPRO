export const CREDITO_USD = 1.20;
export const CREDITOS_BIENVENIDA = 3;
export const CATEGORIAS_MVP = ['enfermeria', 'plomeria', 'electricidad'] as const;

export type CategoriaSlug = typeof CATEGORIAS_MVP[number];

// Obtiene el precio final de un paquete con descuento aplicado
export function getPrecioPaquete(creditos: number): number {
  if (creditos === 10) return 12.00;
  if (creditos === 20) return 21.60; // 10% Descuento ($1.08 / crédito)
  if (creditos === 50) return 48.00; // 20% Descuento ($0.96 / crédito)
  return creditos * 1.20; // Fallback
}

// Obtiene el precio original de un paquete sin descuento
export function getPrecioOriginalPaquete(creditos: number): number {
  return creditos * 1.20;
}

// Obtiene el porcentaje de descuento del paquete
export function getDescuentoPaquete(creditos: number): number {
  if (creditos === 20) return 10;
  if (creditos === 50) return 20;
  return 0;
}
