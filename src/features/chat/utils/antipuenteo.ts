/**
 * Detecta números de teléfono venezolanos y secuencias sospechosas de dígitos
 * en un mensaje de chat para prevenir la evasión de la plataforma (puenteo).
 */
export function detectarTelefono(texto: string): boolean {
  if (!texto) return false;

  // 1. Limpieza: Eliminar espacios, guiones, puntos, slashes, paréntesis y signos de suma
  const normalizado = texto.replace(/[-\s._/\\+()]/g, '');

  // 2. Patrón de celulares en Venezuela (0412, 0414, 0424, 0416, 0426)
  // Soporta opcionalmente prefijo de país 58
  const regexVenezuela = /(?:58)?0?4(?:12|14|24|16|26)\d{7}/;
  if (regexVenezuela.test(normalizado)) {
    return true;
  }

  // 3. Patrón genérico: Secuencia de 7 a 12 dígitos contiguos en el texto normalizado
  // Esto captura números locales (0212, etc.) u otros formatos de teléfonos
  const regexGenericaDigitos = /\d{7,12}/;
  if (regexGenericaDigitos.test(normalizado)) {
    return true;
  }

  return false;
}
