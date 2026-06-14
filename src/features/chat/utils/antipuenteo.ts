/**
 * Módulo Anti-Puenteo para el chat de ConectaPro.
 *
 * Detecta intentos de compartir datos de contacto externos para evadir
 * la plataforma, incluyendo: teléfonos, emails, redes sociales, URLs
 * y frases de invitación a contactar por fuera de la app.
 */

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────

export type RazonBloqueo =
  | 'telefono'
  | 'email'
  | 'red_social'
  | 'url'
  | 'frase_contacto';

export interface ResultadoAnalisis {
  bloqueado: boolean;
  razon?: RazonBloqueo;
  mensajeUsuario?: string;
}

const MENSAJES_RAZON: Record<RazonBloqueo, string> = {
  telefono:
    'No está permitido compartir números de teléfono. Toda coordinación debe hacerse dentro de la plataforma.',
  email:
    'No está permitido compartir correos electrónicos. Usa el chat interno para comunicarte.',
  red_social:
    'No está permitido compartir usuarios de redes sociales o handles externos.',
  url:
    'No está permitido compartir links o URLs externas. Mantén la comunicación en la plataforma.',
  frase_contacto:
    'Se detectó una posible invitación a contactar fuera de la plataforma. Esto no está permitido.',
};

// ─────────────────────────────────────────────
// Helpers de normalización
// ─────────────────────────────────────────────

/**
 * Prepara el texto para detección de teléfonos en palabras:
 * quita acentos, aplica normalización fonética y reemplaza palabras por dígitos.
 */
function normalizarParaTelefono(texto: string): string {
  let t = texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // Eliminar conectores "y" / "i" aislados
  t = t.replace(/\by\b/g, '').replace(/\bi\b/g, '');

  // Normalización fonética
  t = t
    .replace(/z/g, 's')
    .replace(/c([ei])/g, 's$1')
    .replace(/v/g, 'b')
    .replace(/k/g, 'c')
    .replace(/qu/g, 'c')
    .replace(/y/g, 'i')
    .replace(/sh/g, 'ch')
    .replace(/x/g, 'ch');

  // Diccionario de palabras-número (forma fonética)
  const palabrasNumeros: Record<string, string> = {
    sero: '0',
    uno: '1',
    una: '1',
    dos: '2',
    do: '2',
    tres: '3',
    tre: '3',
    cuatro: '4',
    sinco: '5',
    seis: '6',
    sei: '6',
    siete: '7',
    ocho: '8',
    nuebe: '9',
    dies: '10',
    die: '10',
    onse: '11',
    dose: '12',
    trese: '13',
    catorse: '14',
    quinse: '15',
    sinse: '15',
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

  // Reemplazar de mayor a menor longitud para evitar colisiones
  const ordenadas = Object.keys(palabrasNumeros).sort(
    (a, b) => b.length - a.length,
  );
  for (const palabra of ordenadas) {
    const rx = new RegExp(`\\b${palabra}\\b`, 'g');
    t = t.replace(rx, palabrasNumeros[palabra]);
  }

  // Eliminar separadores visuales
  return t.replace(/[-\s._/\\+()]/g, '');
}

/**
 * Normalización básica: minúsculas, sin acentos.
 */
function normalizarBasico(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// ─────────────────────────────────────────────
// Detectores individuales
// ─────────────────────────────────────────────

/** Detecta números de teléfono (dígitos o escritos en palabras). */
export function detectarTelefono(texto: string): boolean {
  if (!texto) return false;
  const normalizado = normalizarParaTelefono(texto);
  // Celulares venezolanos con o sin prefijo de país
  const regexVE = /(?:58)?0?4(?:12|14|24|16|26)\d{7}/;
  if (regexVE.test(normalizado)) return true;
  // Secuencia genérica de 7–12 dígitos continuos
  const regexGenerico = /\d{7,12}/;
  return regexGenerico.test(normalizado);
}

/** Detecta correos electrónicos. */
export function detectarEmail(texto: string): boolean {
  if (!texto) return false;
  // Admite puntos, +, guiones en la parte local; dominios con al menos 2 letras
  const regex = /[\w.+\-]{2,}@[\w\-]{2,}\.[a-z]{2,}/i;
  return regex.test(texto);
}

/** Detecta menciones de redes sociales o handles externos. */
export function detectarRedSocial(texto: string): boolean {
  if (!texto) return false;
  const t = normalizarBasico(texto);

  // Prefijos explícitos de red social seguidos de cualquier texto
  const prefijos =
    /\b(ig|insta|instagram|snap|snapchat|fb|facebook|tiktok|tt|twitch|twitter|x|pinterest|linkedin|yt|youtube|telegram)\s*[:=@]\s*\S+/i;
  if (prefijos.test(t)) return true;

  // Handle suelto: @usuario (2–30 chars alfanuméricos/guión bajo/punto)
  // Se requiere que no sea seguido de un dominio (para no confundir con emails
  // que se detectan por detectarEmail)
  const handleSuelto = /@[\w.]{2,30}(?!\.[a-z]{2,})/i;
  if (handleSuelto.test(t)) return true;

  return false;
}

/** Detecta URLs y links externos. */
export function detectarURL(texto: string): boolean {
  if (!texto) return false;
  const t = normalizarBasico(texto);

  // Protocolos explícitos
  if (/https?:\/\//i.test(t)) return true;
  if (/\bwww\./i.test(t)) return true;

  // Dominios conocidos de mensajería/bio-links sin protocolo
  const dominiosConocidos =
    /\b(wa\.me|t\.me|linktr\.ee|bit\.ly|tinyurl\.com|short\.link|lnk\.to|cutt\.ly|m\.me|vk\.com|discord\.gg|discord\.com\/invite)/i;
  if (dominiosConocidos.test(t)) return true;

  // Patrón genérico: texto.ext (mínimo 3 chars antes del punto, 2–4 chars de extensión)
  const dominioGenerico =
    /\b[\w\-]{3,}\.(com|net|org|io|ve|co|info|app|online|me|gg|link|ai|dev|biz|store)\b/i;
  if (dominioGenerico.test(t)) return true;

  return false;
}

/** Detecta frases que invitan a contactar fuera de la plataforma. */
export function detectarFraseContacto(texto: string): boolean {
  if (!texto) return false;
  const t = normalizarBasico(texto);

  // Plataformas de mensajería mencionadas como medio alternativo de contacto
  const mencionPlataforma =
    /\b(whatsapp|wasap|wsp|wa|telegram|signal|skype|viber|line)\b/i;

  // Indicadores de acción de contacto
  const accionContacto =
    /\b(escribeme|escribame|contactame|contactate|llamame|llama|comunicate|mandale|mandarme|agrega|agregame|busca|buscame|encuentra|al privado|por privado|dm\b|mensaje directo|fuera de (la |esta )?(app|plataforma|pagina|web)|por (fuera|afuera)|mi (usuario|user|handle|arroba|cuenta) (es|seria)|busca?me como|mi (numero|numero de) (ws|wa|wsp|whatsapp)|contacto externo)\b/i;

  // Bloquear si hay mención de plataforma + indicador de acción, o solo acción directa
  if (mencionPlataforma.test(t) && accionContacto.test(t)) return true;
  if (accionContacto.test(t)) return true;

  return false;
}

// ─────────────────────────────────────────────
// Orquestador principal
// ─────────────────────────────────────────────

/**
 * Analiza un texto e indica si debe ser bloqueado y por qué.
 * Evalúa el mensaje actual + historial acumulado para detectar
 * números/datos distribuidos en varios mensajes.
 *
 * @param textoActual  El texto que el usuario está escribiendo ahora.
 * @param historial    Concatenación de mensajes recientes del mismo usuario (últimos 5 min).
 */
export function analizarMensaje(
  textoActual: string,
  historial = '',
): ResultadoAnalisis {
  if (!textoActual.trim()) return { bloqueado: false };

  const textoAcumulado = historial
    ? `${historial} ${textoActual.trim()}`
    : textoActual.trim();

  // ── 1. Teléfono ──────────────────────────────────
  const telActual = detectarTelefono(textoActual.trim());
  const telAcumulado = detectarTelefono(textoAcumulado);
  const telHistorial = detectarTelefono(historial);
  if (telActual || (telAcumulado && !telHistorial)) {
    return {
      bloqueado: true,
      razon: 'telefono',
      mensajeUsuario: MENSAJES_RAZON.telefono,
    };
  }

  // ── 2. Email ─────────────────────────────────────
  if (detectarEmail(textoActual) || detectarEmail(textoAcumulado)) {
    return {
      bloqueado: true,
      razon: 'email',
      mensajeUsuario: MENSAJES_RAZON.email,
    };
  }

  // ── 3. URL ───────────────────────────────────────
  if (detectarURL(textoActual) || detectarURL(textoAcumulado)) {
    return {
      bloqueado: true,
      razon: 'url',
      mensajeUsuario: MENSAJES_RAZON.url,
    };
  }

  // ── 4. Red social ────────────────────────────────
  if (detectarRedSocial(textoActual) || detectarRedSocial(textoAcumulado)) {
    return {
      bloqueado: true,
      razon: 'red_social',
      mensajeUsuario: MENSAJES_RAZON.red_social,
    };
  }

  // ── 5. Frase de contacto ─────────────────────────
  if (
    detectarFraseContacto(textoActual) ||
    detectarFraseContacto(textoAcumulado)
  ) {
    return {
      bloqueado: true,
      razon: 'frase_contacto',
      mensajeUsuario: MENSAJES_RAZON.frase_contacto,
    };
  }

  return { bloqueado: false };
}
