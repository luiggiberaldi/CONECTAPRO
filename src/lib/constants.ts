export const CREDITO_USD = 1.20;
export const CREDITOS_BIENVENIDA = 3;
export const CATEGORIAS_MVP = ['enfermeria', 'plomeria', 'electricidad'] as const;

export type CategoriaSlug = typeof CATEGORIAS_MVP[number];
