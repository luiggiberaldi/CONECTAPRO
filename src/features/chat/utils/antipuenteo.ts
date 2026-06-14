/**
 * Detecta números de teléfono venezolanos y secuencias sospechosas de dígitos
 * en un mensaje de chat para prevenir la evasión de la plataforma (puenteo).
 * Admite tanto números en dígitos como números escritos en palabras en español (ej: cero, cuatro, doce).
 */
export function detectarTelefono(texto: string): boolean {
  if (!texto) return false;

  // 1. Convertir a minúsculas y quitar acentos comunes para mayor robustez
  let textoProcesado = texto.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // Quita acentos (á->a, é->e, etc.)

  // 2. Remover el conector "y" cuando está como palabra sola para unificar números compuestos (ej: noventa y tres -> noventa tres)
  textoProcesado = textoProcesado.replace(/\by\b/g, '');

  // 3. Diccionario de números escritos en palabras en español
  const palabrasNumeros: { [key: string]: string } = {
    cero: '0',
    uno: '1',
    una: '1',
    dos: '2',
    tres: '3',
    cuatro: '4',
    cinco: '5',
    seis: '6',
    siete: '7',
    ocho: '8',
    nueve: '9',
    diez: '10',
    once: '11',
    doce: '12',
    trece: '13',
    catorce: '14',
    quince: '15',
    dieciseis: '16',
    diecisiete: '17',
    dieciocho: '18',
    diecinueve: '19',
    veinte: '20',
    veintiuno: '21',
    veintidos: '22',
    veintidós: '22',
    veintitres: '23',
    veintitrés: '23',
    veinticuatro: '24',
    veinticinco: '25',
    veintiseis: '26',
    veintiséis: '26',
    veintisiete: '27',
    veintiocho: '28',
    veintinueve: '29',
    treinta: '30',
    cuarenta: '40',
    cincuenta: '50',
    sesenta: '60',
    setenta: '70',
    ochenta: '80',
    noventa: '90',
  };

  // Reemplazar las palabras por dígitos, empezando por las más largas para no dañar palabras compuestas
  const palabrasOrdenadas = Object.keys(palabrasNumeros).sort((a, b) => b.length - a.length);
  for (const palabra of palabrasOrdenadas) {
    const regex = new RegExp(`\\b${palabra}\\b`, 'g');
    textoProcesado = textoProcesado.replace(regex, palabrasNumeros[palabra]);
  }

  // 4. Limpieza final: Eliminar espacios, guiones, puntos, slashes, paréntesis y signos de suma
  const normalizado = textoProcesado.replace(/[-\s._/\\+()]/g, '');

  // 5. Patrón de celulares en Venezuela (0412, 0414, 0424, 0416, 0426)
  // Soporta opcionalmente prefijo de país 58
  const regexVenezuela = /(?:58)?0?4(?:12|14|24|16|26)\d{7}/;
  if (regexVenezuela.test(normalizado)) {
    return true;
  }

  // 6. Patrón genérico: Secuencia de 7 a 12 dígitos contiguos
  const regexGenericaDigitos = /\d{7,12}/;
  if (regexGenericaDigitos.test(normalizado)) {
    return true;
  }

  return false;
}
