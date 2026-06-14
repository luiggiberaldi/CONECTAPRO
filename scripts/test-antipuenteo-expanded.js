// Scratch test — Anti-Puenteo expandido
// Ejecutar: node scripts/test-antipuenteo-expanded.js

function normalizarParaTelefono(texto) {
  let t = texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  t = t.replace(/\by\b/g, '').replace(/\bi\b/g, '');
  t = t.replace(/z/g, 's').replace(/c([ei])/g, 's$1').replace(/v/g, 'b')
       .replace(/k/g, 'c').replace(/qu/g, 'c').replace(/y/g, 'i')
       .replace(/sh/g, 'ch').replace(/x/g, 'ch');
  const nums = {
    sero:'0',uno:'1',una:'1',dos:'2',do:'2',tres:'3',tre:'3',cuatro:'4',
    sinco:'5',seis:'6',sei:'6',siete:'7',ocho:'8',nuebe:'9',dies:'10',die:'10',
    onse:'11',dose:'12',trese:'13',catorse:'14',quinse:'15',sinse:'15',
    diesiseis:'16',diesisiete:'17',diesiocho:'18',diesinuebe:'19',beinte:'20',
    beintiuno:'21',beintidos:'22',beintitres:'23',beinticuatro:'24',beinticinco:'25',
    beintiseis:'26',beintisiete:'27',beintiocho:'28',beintinuebe:'29',treinta:'30',
    cuarenta:'40',cincuenta:'50',sincuenta:'50',sesenta:'60',setenta:'70',ochenta:'80',nobenta:'90',
  };
  const sorted = Object.keys(nums).sort((a,b)=>b.length-a.length);
  for (const p of sorted) t = t.replace(new RegExp(`\\b${p}\\b`,'g'), nums[p]);
  return t.replace(/[-\s._/\\+()]/g, '');
}

function detectarTelefono(texto) {
  if (!texto) return false;
  const n = normalizarParaTelefono(texto);
  if (/(?:58)?0?4(?:12|14|24|16|26)\d{7}/.test(n)) return true;
  if (/\d{7,12}/.test(n)) return true;
  return false;
}

function detectarEmail(texto) {
  return /[\w.+\-]{2,}@[\w\-]{2,}\.[a-z]{2,}/i.test(texto);
}

function detectarRedSocial(texto) {
  const t = texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  if (/\b(ig|insta|instagram|snap|snapchat|fb|facebook|tiktok|tt|twitch|twitter|x|pinterest|linkedin|yt|youtube|telegram)\s*[:=@]\s*\S+/i.test(t)) return true;
  if (/@[\w.]{2,30}(?!\.[a-z]{2,})/i.test(t)) return true;
  return false;
}

function detectarURL(texto) {
  const t = texto.toLowerCase();
  if (/https?:\/\//i.test(t)) return true;
  if (/\bwww\./i.test(t)) return true;
  if (/\b(wa\.me|t\.me|linktr\.ee|bit\.ly|tinyurl\.com|discord\.gg|discord\.com\/invite)\b/i.test(t)) return true;
  if (/\b[\w\-]{3,}\.(com|net|org|io|ve|co|info|app|online|me|gg|link|ai|dev|biz|store)\b/i.test(t)) return true;
  return false;
}

function detectarFraseContacto(texto) {
  const t = texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const plat = /\b(whatsapp|wasap|wsp|wa|telegram|signal|skype|viber|line)\b/i;
  const accion = /\b(escribeme|escribame|contactame|contactate|llamame|llama|comunicate|mandale|mandarme|agrega|agregame|busca|buscame|encuentra|al privado|por privado|\bdm\b|mensaje directo|fuera de (la |esta )?(app|plataforma|pagina|web)|por (fuera|afuera)|mi (usuario|user|handle|arroba|cuenta) (es|seria)|busca?me como|mi (numero|numero de) (ws|wa|wsp|whatsapp)|contacto externo)\b/i;
  if (plat.test(t) && accion.test(t)) return true;
  if (accion.test(t)) return true;
  return false;
}

function analizarMensaje(texto, historial='') {
  const acumulado = historial ? `${historial} ${texto.trim()}` : texto.trim();
  const telActual=detectarTelefono(texto.trim()), telAcum=detectarTelefono(acumulado), telHist=detectarTelefono(historial);
  if (telActual || (telAcum && !telHist)) return 'BLOQUEADO:telefono';
  if (detectarEmail(texto)||detectarEmail(acumulado)) return 'BLOQUEADO:email';
  if (detectarURL(texto)||detectarURL(acumulado)) return 'BLOQUEADO:url';
  if (detectarRedSocial(texto)||detectarRedSocial(acumulado)) return 'BLOQUEADO:red_social';
  if (detectarFraseContacto(texto)||detectarFraseContacto(acumulado)) return 'BLOQUEADO:frase_contacto';
  return 'OK';
}

// ──────────────────────────────────────────────────────────────────────────
// CASOS DE PRUEBA
// ──────────────────────────────────────────────────────────────────────────

const casos = [
  // Teléfonos
  { txt:'0412-345-67-89', esperado:'BLOQUEADO:telefono', cat:'📞 Teléfono dígitos' },
  { txt:'cero cuatro doce cuarenta y cinco sesenta y siete ochenta y nueve', esperado:'BLOQUEADO:telefono', cat:'📞 Teléfono en letras' },
  { txt:'0412 treinta y tre', esperado:'BLOQUEADO:telefono', historial:'', cat:'📞 Teléfono partido (msg actual)' },
  { txt:'cuarenta y cinco sesenta y siete ochenta y nueve', esperado:'BLOQUEADO:telefono', historial:'0412 treinta y tres', cat:'📞 Teléfono acumulado en historial' },
  // Emails
  { txt:'mi correo es pedro@gmail.com', esperado:'BLOQUEADO:email', cat:'📧 Email directo' },
  { txt:'escríbeme a p.e.d.r.o+trabajo@hotmail.com', esperado:'BLOQUEADO:email', cat:'📧 Email con + y puntos' },
  // URLs
  { txt:'mándame wa.me/584121234567', esperado:'BLOQUEADO:telefono', cat:'🔗 URL wa.me (contiene teléfono → bloqueado como tel)' },
  { txt:'está en instagram.com/pedro', esperado:'BLOQUEADO:url', cat:'🔗 URL dominio .com' },
  { txt:'https://t.me/pedroserv', esperado:'BLOQUEADO:url', cat:'🔗 URL https' },
  { txt:'linktr.ee/pedro123', esperado:'BLOQUEADO:url', cat:'🔗 Linktree' },
  // Redes sociales
  { txt:'ig: pedroservicios', esperado:'BLOQUEADO:red_social', cat:'📱 Red social prefijo ig:' },
  { txt:'búscame en instagram = pedro_serv_2024', esperado:'BLOQUEADO:red_social', cat:'📱 Red social con =' },
  { txt:'@pedrooficial123', esperado:'BLOQUEADO:red_social', cat:'📱 Handle @' },
  { txt:'snap: pedro123', esperado:'BLOQUEADO:red_social', cat:'📱 Snapchat prefijo' },
  // Frases de invitación
  { txt:'escríbeme por whatsapp', esperado:'BLOQUEADO:frase_contacto', cat:'💬 Frase WA directa' },
  { txt:'mi usuario es pedro_serv buscame como ese', esperado:'BLOQUEADO:frase_contacto', cat:'💬 Frase búscame' },
  { txt:'coordina conmigo fuera de la app', esperado:'BLOQUEADO:frase_contacto', cat:'💬 Frase fuera de app' },
  // ─── FALSOS POSITIVOS (deben pasar como OK) ───
  { txt:'hola', esperado:'OK', cat:'✅ Saludo simple' },
  { txt:'puedo mañana a las doce', esperado:'OK', cat:'✅ Hora en letras' },
  { txt:'el costo es cuarenta y cinco bolivares', esperado:'OK', cat:'✅ Precio en letras' },
  { txt:'tienes cuenta en instagram?', esperado:'OK', cat:'✅ Pregunta sobre red social' },
  { txt:'usa WhatsApp para comunicarte con clientes', esperado:'OK', cat:'✅ Mención WhatsApp sin invitación' },
  { txt:'tengo dos años de experiencia', esperado:'OK', cat:'✅ Número pequeño en texto' },
  { txt:'mi correo personal lo uso para otras cosas', esperado:'OK', cat:'✅ Mención correo sin dato' },
];

let ok = 0, fail = 0;
console.log('\n══════════ TEST ANTI-PUENTEO EXPANDIDO ══════════\n');
for (const c of casos) {
  const resultado = analizarMensaje(c.txt, c.historial || '');
  const paso = resultado === c.esperado;
  const icon = paso ? '✅' : '❌';
  if (paso) ok++; else fail++;
  console.log(`${icon} [${c.cat}]`);
  if (!paso) {
    console.log(`   Texto:    "${c.txt}"`);
    console.log(`   Esperado: ${c.esperado}`);
    console.log(`   Obtenido: ${resultado}`);
  }
}
console.log(`\n══════════════════════════════════════════════════`);
console.log(`Resultado: ${ok}/${casos.length} OK  |  ${fail} fallidos\n`);
