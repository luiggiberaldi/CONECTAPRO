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

  // 2. Remover los conectores "y" o "i" cuando están como palabra sola para unificar números compuestos (ej: noventa y tres -> noventa tres)
  textoProcesado = textoProcesado.replace(/\by\b/g, '');
  textoProcesado = textoProcesado.replace(/\bi\b/g, ''); // en caso de simplificaciones y -> i

  // 3. Normalización fonética para neutralizar deliberadas faltas de ortografía (ej: doze -> dose, kuatro -> cuatro)
  textoProcesado = textoProcesado
    .replace(/z/g, 's')              // z -> s (doze -> dose, trez -> tres, zinco -> sinco)
    .replace(/c([ei])/g, 's$1')      // c antes de e/i -> s (doce -> dose, cero -> sero)
    .replace(/v/g, 'b')              // v -> b (nueve -> nuebe, veinte -> beinte)
    .replace(/k/g, 'c')              // k -> c (kuatro -> cuatro)
    .replace(/qu/g, 'c')             // qu -> c (quince -> cince/sinse)
    .replace(/y/g, 'i')              // y -> i (treynta -> treinta)
    .replace(/sh/g, 'ch')            // sh -> ch (osho -> ocho)
    .replace(/x/g, 'ch');            // x -> ch (oxo -> ocho)

  // 4. Diccionario de números escritos en palabras en español (representados en su forma fonética simplificada)
  const palabrasNumeros: { [key: string]: string } = {
    sero: '0',
    uno: '1',
    una: '1',
    dos: '2',
    tres: '3',
    cuatro: '4',
    sinco: '5',
    seis: '6',
    siete: '7',
    ocho: '8',
    nuebe: '9',
    dies: '10',
    onse: '11',
    dose: '12',
    trese: '13',
    catorse: '14',
    quinse: '15',
    sinse: '15',     // quince -> cince -> sinse
    diesiseis: '16',
    diesisiete: '17',
    diesiocho: '18',
    diesinuebe: '19',
    beinte: '20',
    beintiuno: '21',
    beintidos: '22',
    beintitres: '23',
    beinticuatro: '24',
    beinticinco: '25',
    beintiseis: '26',
    beintisiete: '27',
    beintiocho: '28',
    beintinuebe: '29',
    treinta: '30',
    cuarenta: '40',
    cincuenta: '50',
    sincuenta: '50',
    sesenta: '60',
    setenta: '70',
    ochenta: '80',
    nobenta: '90',
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
