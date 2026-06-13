const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Desactivar verificación estricta de SSL en entornos locales que puedan tener problemas con certificados raíz
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// 1. Cargar variables de entorno desde .env.local
const envPath = path.resolve(__dirname, '../.env.local');
if (!fs.existsSync(envPath)) {
  console.error('No se encontró el archivo .env.local en:', envPath);
  process.exit(1);
}

const content = fs.readFileSync(envPath, 'utf8');
const env = {};
content.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const parts = trimmed.split('=');
  const key = parts[0].trim();
  const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
  env[key] = val;
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRole) {
  console.error('Falta la URL de Supabase o la clave service_role en el archivo .env.local.');
  process.exit(1);
}

// 2. Inicializar cliente con rol de servicio para omitir políticas RLS
const supabase = createClient(supabaseUrl, supabaseServiceRole, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

const action = process.argv[2];
if (action !== 'seed' && action !== 'clean') {
  console.log('Uso: node scripts/manage-demo.js [seed|clean]');
  process.exit(1);
}

const DEMO_SUFFIX = '@conectapro-demo.com';

// Categorías registradas en la DB (mapeadas a sus IDs correspondientes)
const CATEGORIAS = {
  enfermeria: 'af410a6f-0e2a-44dd-b0fe-4724a5779c64',
  plomeria: 'dc376691-81bf-4596-8066-19d1cd28b1d2',
  electricidad: '3ac94a14-d9f3-4cc6-9369-c70e844a2a81'
};

// Función para obtener una fecha histórica relativa
function getDateAgo(daysAgo, hoursAgo = 0) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(date.getHours() - hoursAgo);
  return date;
}

async function cleanDemoData() {
  console.log('=== INICIANDO LIMPIEZA DE DATOS DEMO ===');
  
  // 1. Obtener todos los usuarios cuyo email termina con el sufijo demo
  const { data: users, error: fetchError } = await supabase
    .from('usuarios')
    .select('id, email')
    .like('email', `%${DEMO_SUFFIX}`);

  if (fetchError) {
    console.error('Error al consultar usuarios demo:', fetchError);
    return;
  }

  if (!users || users.length === 0) {
    console.log('No se encontraron usuarios demo en la base de datos.');
    return;
  }

  console.log(`Encontrados ${users.length} usuarios demo para eliminar.`);

  for (const user of users) {
    console.log(`Eliminando de auth.users: ${user.email} (${user.id})...`);
    // Al eliminar de auth.users, el trigger 'on delete cascade' limpia todas las tablas asociadas:
    // public.usuarios, public.profesionales, public.wallet, public.ordenes, public.calificaciones, public.recargas, etc.
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
    if (deleteError) {
      console.error(`Error al eliminar usuario ${user.email}:`, deleteError);
    } else {
      console.log(`✓ Eliminado: ${user.email}`);
    }
  }

  console.log('=== LIMPIEZA DE DATOS DEMO COMPLETADA ===\n');
}

async function seedDemoData() {
  // Primero limpiamos cualquier residuo previo para evitar duplicidades
  await cleanDemoData();

  console.log('=== INICIANDO CARGA DE DATOS DEMO (SEED DE 6 MESES) ===');

  // 1. Definir Clientes (Con antigüedad de ingreso escalonada en el periodo de 6 meses)
  const clientesData = [
    { nombre: 'Maria Gomez', email: `maria.gomez${DEMO_SUFFIX}`, pass: 'demo.maria123', ciudad: 'Caracas', daysJoined: 180 },
    { nombre: 'Alejandro Silva', email: `alejandro.silva${DEMO_SUFFIX}`, pass: 'demo.ale123', ciudad: 'Caracas', daysJoined: 150 },
    { nombre: 'Valentina Rivas', email: `valentina.rivas${DEMO_SUFFIX}`, pass: 'demo.vale123', ciudad: 'Caracas', daysJoined: 120 },
    { nombre: 'Gabriela Lopez', email: `gaby.lopez${DEMO_SUFFIX}`, pass: 'demo.gaby123', ciudad: 'Valencia', daysJoined: 90 },
    { nombre: 'Luis Martinez', email: `luis.martinez${DEMO_SUFFIX}`, pass: 'demo.luis123', ciudad: 'Caracas', daysJoined: 60 },
    { nombre: 'Ana Rodriguez', email: `ana.rodriguez${DEMO_SUFFIX}`, pass: 'demo.ana123', ciudad: 'Maracay', daysJoined: 45 },
    { nombre: 'Pedro Castillo', email: `pedro.castillo${DEMO_SUFFIX}`, pass: 'demo.pedro123', ciudad: 'Caracas', daysJoined: 30 },
    { nombre: 'Elena Rojas', email: `elena.rojas${DEMO_SUFFIX}`, pass: 'demo.elena123', ciudad: 'Barquisimeto', daysJoined: 15 },
    { nombre: 'Miguel Delgado', email: `miguel.delgado${DEMO_SUFFIX}`, pass: 'demo.miguel123', ciudad: 'Caracas', daysJoined: 5 }
  ];

  // 2. Definir Profesionales (Con antigüedad, especialidades y balances de wallet realistas)
  const profesionalesData = [
    {
      nombre: 'Carlos Medina',
      email: `carlos.medina${DEMO_SUFFIX}`,
      pass: 'demo.carlos123',
      ciudad: 'Caracas',
      especialidad: 'plomeria',
      descripcion: 'Especialista en tuberías, filtraciones y calentadores de agua. Con más de 8 años de experiencia en el área metropolitana de Caracas.',
      experiencia: 8,
      daysJoined: 180,
      wallet: { saldo: 25, cargado: 60, usado: 35 } // 35 créditos gastados en 7 postulaciones exitosas/completadas
    },
    {
      nombre: 'Nelson Perez',
      email: `nelson.perez${DEMO_SUFFIX}`,
      pass: 'demo.nelson123',
      ciudad: 'Caracas',
      especialidad: 'electricidad',
      descripcion: 'Técnico electricista certificado. Instalaciones eléctricas residenciales y comerciales, tableros de control y resolución de cortocircuitos.',
      experiencia: 12,
      daysJoined: 150,
      wallet: { saldo: 40, cargado: 90, usado: 50 } // 50 créditos gastados en 10 postulaciones
    },
    {
      nombre: 'Yelitza Torres',
      email: `yelitza.torres${DEMO_SUFFIX}`,
      pass: 'demo.yelitza123',
      ciudad: 'Caracas',
      especialidad: 'enfermeria',
      descripcion: 'Enfermera graduada con experiencia en cuidados intensivos, cuidado de adultos mayores, administración de tratamientos y curas a domicilio.',
      experiencia: 15,
      daysJoined: 120,
      wallet: { saldo: 15, cargado: 45, usado: 30 }
    },
    {
      nombre: 'Jose Rodriguez',
      email: `jose.rodriguez${DEMO_SUFFIX}`,
      pass: 'demo.jose123',
      ciudad: 'Caracas',
      especialidad: 'plomeria',
      descripcion: 'Destapes de cañerías, limpieza de tanques subterráneos, instalación de grifería y mantenimiento sanitario residencial.',
      experiencia: 6,
      daysJoined: 90,
      wallet: { saldo: 10, cargado: 30, usado: 20 }
    },
    {
      nombre: 'Sofia Hernandez',
      email: `sofia.hernandez${DEMO_SUFFIX}`,
      pass: 'demo.sofia123',
      ciudad: 'Caracas',
      especialidad: 'enfermeria',
      descripcion: 'Licenciada en enfermería. Cuidado especializado de pacientes pediátricos y postoperatorios a domicilio. Trato humano y profesional.',
      experiencia: 10,
      daysJoined: 90,
      wallet: { saldo: 20, cargado: 40, usado: 20 }
    },
    {
      nombre: 'Carmen Ortiz',
      email: `carmen.ortiz${DEMO_SUFFIX}`,
      pass: 'demo.carmen123',
      ciudad: 'Caracas',
      especialidad: 'enfermeria',
      descripcion: 'Profesional de la salud dedicada al cuidado integral del paciente. Amplia experiencia en estimulación cognitiva y cuidado geriátrico.',
      experiencia: 10,
      daysJoined: 60,
      wallet: { saldo: 15, cargado: 35, usado: 20 }
    },
    {
      nombre: 'Daniel Vargas',
      email: `daniel.vargas${DEMO_SUFFIX}`,
      pass: 'demo.daniel123',
      ciudad: 'Valencia',
      especialidad: 'electricidad',
      descripcion: 'Técnico superior en electricidad industrial. Ofrezco servicios de cableado, balanceo de cargas y reparación de fallas de acometidas.',
      experiencia: 5,
      daysJoined: 45,
      wallet: { saldo: 10, cargado: 20, usado: 10 }
    },
    {
      nombre: 'Francisco Blanco',
      email: `francisco.blanco${DEMO_SUFFIX}`,
      pass: 'demo.francisco123',
      ciudad: 'Maracay',
      especialidad: 'plomeria',
      descripcion: 'Servicio técnico especializado en plomería residencial, filtraciones no visibles mediante geófono, bombas de agua e hidroneumáticos.',
      experiencia: 7,
      daysJoined: 30,
      wallet: { saldo: 15, cargado: 25, usado: 10 }
    },
    {
      nombre: 'Laura Gil',
      email: `laura.gil${DEMO_SUFFIX}`,
      pass: 'demo.laura123',
      ciudad: 'Caracas',
      especialidad: 'enfermeria',
      descripcion: 'Enfermera instrumentista certificada. Apoyo pre y postoperatorio a domicilio, asepsia, manejo de drenajes y asistencia médica.',
      experiencia: 9,
      daysJoined: 30,
      wallet: { saldo: 15, cargado: 25, usado: 10 }
    },
    {
      nombre: 'Hector Mendez',
      email: `hector.mendez${DEMO_SUFFIX}`,
      pass: 'demo.hector123',
      ciudad: 'Caracas',
      especialidad: 'electricidad',
      descripcion: 'Electricista instalador. Iluminación empotrada, instalación de sensores de movimiento, cableados estructurados y reparaciones menores.',
      experiencia: 4,
      daysJoined: 15,
      wallet: { saldo: 5, cargado: 10, usado: 5 }
    },
    {
      nombre: 'Andres Castro',
      email: `andres.castro${DEMO_SUFFIX}`,
      pass: 'demo.andres123',
      ciudad: 'Valencia',
      especialidad: 'plomeria',
      descripcion: 'Plomería en general, remodelación de salas de baño, colocación de fluxómetros, mantenimiento de tanques de agua y sistemas de presión.',
      experiencia: 11,
      daysJoined: 15,
      wallet: { saldo: 5, cargado: 15, usado: 10 }
    },
    {
      nombre: 'Patricia Suarez',
      email: `patricia.suarez${DEMO_SUFFIX}`,
      pass: 'demo.patricia123',
      ciudad: 'Barquisimeto',
      especialidad: 'enfermeria',
      descripcion: 'Especialista en atención domiciliaria a pacientes con movilidad reducida o crónicos. Excelente trato, empática y dedicada.',
      experiencia: 6,
      daysJoined: 10,
      wallet: { saldo: 5, cargado: 10, usado: 5 }
    },
    {
      nombre: 'Ricardo Ruiz',
      email: `ricardo.ruiz${DEMO_SUFFIX}`,
      pass: 'demo.ricardo123',
      ciudad: 'Maracay',
      especialidad: 'electricidad',
      descripcion: 'Servicio eléctrico integral. Cableado de tableros trifásicos y monofásicos, instalación de plantas eléctricas residenciales, y reparaciones.',
      experiencia: 8,
      daysJoined: 5,
      wallet: { saldo: 10, cargado: 10, usado: 0 }
    }
  ];

  const clientesMap = {};
  const profesionalesMap = {};

  // 3. Crear Clientes en Auth
  console.log('\n--- Creando Clientes ---');
  for (const c of clientesData) {
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: c.email,
      password: c.pass,
      email_confirm: true,
      user_metadata: { rol: 'cliente', nombre: c.nombre, ciudad: c.ciudad }
    });

    if (authError) {
      console.error(`Error al crear cliente ${c.email}:`, authError);
      continue;
    }

    const userId = authUser.user.id;
    clientesMap[c.email] = userId;
    console.log(`✓ Cliente creado: ${c.nombre} (${userId})`);

    // Actualizar fecha de creación histórica real
    const joinDate = getDateAgo(c.daysJoined);
    await supabase.from('usuarios').update({ createdat: joinDate }).eq('id', userId);

    // Insertar perfil cliente
    const { error: clientError } = await supabase.from('clientes').insert({
      usuarioid: userId,
      calificacionpromedio: 0,
      totalproyectos: 0
    });

    if (clientError) {
      console.error(`  Error al crear perfil cliente para ${c.nombre}:`, clientError);
    } else {
      console.log(`  ✓ Perfil cliente creado`);
    }
  }

  // 4. Crear Profesionales en Auth + Perfiles en profesionales + Cargar Wallets
  console.log('\n--- Creando Profesionales ---');
  for (const p of profesionalesData) {
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: p.email,
      password: p.pass,
      email_confirm: true,
      user_metadata: { rol: 'profesional', nombre: p.nombre, ciudad: p.ciudad }
    });

    if (authError) {
      console.error(`Error al crear profesional ${p.email}:`, authError);
      continue;
    }

    const userId = authUser.user.id;
    profesionalesMap[p.email] = userId;
    console.log(`✓ Profesional Auth creado: ${p.nombre} (${userId})`);

    // Insertar perfil profesional
    const { error: profError } = await supabase.from('profesionales').insert({
      usuarioid: userId,
      especialidad: p.especialidad,
      descripcion: p.descripcion,
      anyosexperiencia: p.experiencia,
      ciudad: p.ciudad
    });

    if (profError) {
      console.error(`Error al crear perfil profesional para ${p.nombre}:`, profError);
      continue;
    }
    console.log(`  ✓ Perfil profesional creado`);

    // Forzar fecha de creación histórica
    const joinDate = getDateAgo(p.daysJoined);
    await supabase.from('usuarios').update({ createdat: joinDate }).eq('id', userId);
    await supabase.from('profesionales').update({ createdat: joinDate }).eq('usuarioid', userId);

    // Actualizar Wallet con los saldos históricos de la demo
    const { error: walletError } = await supabase
      .from('wallet')
      .update({
        saldo: p.wallet.saldo,
        totalcargado: p.wallet.cargado,
        totalusado: p.wallet.usado,
        updatedat: joinDate
      })
      .eq('profesionalid', userId);

    if (walletError) {
      console.error(`  Error al configurar wallet para ${p.nombre}:`, walletError);
    } else {
      console.log(`  ✓ Billetera configurada: Saldo = ${p.wallet.saldo} créditos`);
    }

    // Insertar recargas históricas aprobadas (distribuidas en el tiempo para simular recargas de 10, 20 o 30 créditos)
    let restanteAProbar = p.wallet.cargado;
    let recargaIdx = 1;
    while (restanteAProbar > 0) {
      const paqueteRecarga = restanteAProbar >= 30 ? 30 : (restanteAProbar >= 20 ? 20 : 10);
      restanteAProbar -= paqueteRecarga;

      const diasAtras = Math.floor(Math.random() * (p.daysJoined - 5)) + 5; // Siempre después de su ingreso
      const fechaRecarga = getDateAgo(diasAtras);

      await supabase.from('recargas').insert({
        profesionalid: userId,
        paquete: paqueteRecarga,
        montousd: paqueteRecarga * 1.20,
        metodopago: recargaIdx % 2 === 0 ? 'usdt' : (recargaIdx % 3 === 0 ? 'zelle' : 'pagomovil'),
        referencia: `REF-${Math.floor(1000000 + Math.random() * 9000000)}`,
        captura_url: 'https://xrwidvwsmpmoqhbaiado.supabase.co/storage/v1/object/public/recargas/demo_receipt.png',
        estado: 'aprobada',
        createdat: fechaRecarga,
        aprobadoat: fechaRecarga
      });
      recargaIdx++;
    }
  }

  // 5. Crear Recargas PENDIENTES (Para que el administrador tenga material para revisar en tiempo real en la demo)
  console.log('\n--- Creando Recargas en Proceso (Pendientes de Revisión) ---');
  const recargasPendientesData = [
    {
      profesionalEmail: `carlos.medina${DEMO_SUFFIX}`,
      paquete: 15,
      metodo: 'pagomovil',
      referencia: 'PM-49201934',
      horasAtras: 26
    },
    {
      profesionalEmail: `nelson.perez${DEMO_SUFFIX}`,
      paquete: 30,
      metodo: 'usdt',
      referencia: 'TX-0x8f2d7c1a938c4',
      horasAtras: 18
    },
    {
      profesionalEmail: `yelitza.torres${DEMO_SUFFIX}`,
      paquete: 50,
      metodo: 'zelle',
      referencia: 'ZEL-839210492',
      horasAtras: 10
    },
    {
      profesionalEmail: `carmen.ortiz${DEMO_SUFFIX}`,
      paquete: 20,
      metodo: 'pagomovil',
      referencia: 'PM-88392109',
      horasAtras: 4
    },
    {
      profesionalEmail: `daniel.vargas${DEMO_SUFFIX}`,
      paquete: 10,
      metodo: 'pagomovil',
      referencia: 'PM-10398457',
      horasAtras: 2
    }
  ];

  for (const r of recargasPendientesData) {
    const profId = profesionalesMap[r.profesionalEmail];
    if (!profId) continue;

    const fechaPendiente = getDateAgo(0, r.horasAtras);
    const { error: insertError } = await supabase.from('recargas').insert({
      profesionalid: profId,
      paquete: r.paquete,
      montousd: r.paquete * 1.20,
      metodopago: r.metodo,
      referencia: r.referencia,
      captura_url: 'https://xrwidvwsmpmoqhbaiado.supabase.co/storage/v1/object/public/recargas/demo_receipt.png',
      estado: 'pendiente',
      createdat: fechaPendiente
    });

    if (insertError) {
      console.error(`Error al insertar recarga pendiente para ${r.profesionalEmail}:`, insertError);
    } else {
      console.log(`✓ Recarga PENDIENTE creada para ${r.profesionalEmail} (Monto: $${(r.paquete * 1.2).toFixed(2)})`);
    }
  }

  // 6. Crear Órdenes (Ofertas de Trabajo) distribuidas en los 6 meses
  console.log('\n--- Creando Órdenes (Historial de 6 meses) ---');

  const ordenesData = [
    // --- ÓRDENES COMPLETADAS (Datos históricos de 6 meses a 4 días atrás) ---
    {
      key: 'o1',
      clienteEmail: `maria.gomez${DEMO_SUFFIX}`,
      profesionalEmail: `carlos.medina${DEMO_SUFFIX}`,
      categoriaid: CATEGORIAS.plomeria,
      titulo: 'Filtración en pared del baño principal',
      descripcion: 'Tengo una filtración muy húmeda en la pared del baño que colinda con la cocina. Necesito romper la cerámica y soldar la tubería de cobre averiada.',
      ciudad: 'Caracas',
      zona: 'Chacao',
      urgencia: 'hoy',
      estado: 'completada',
      diasAtras: 170
    },
    {
      key: 'o2',
      clienteEmail: `alejandro.silva${DEMO_SUFFIX}`,
      profesionalEmail: `nelson.perez${DEMO_SUFFIX}`,
      categoriaid: CATEGORIAS.electricidad,
      titulo: 'Instalación de tablero eléctrico y acometida',
      descripcion: 'Requiero instalar un tablero eléctrico de 12 circuitos nuevo en el apartamento y recablear los breakers principales desde la tanquilla exterior.',
      ciudad: 'Caracas',
      zona: 'El Hatillo',
      urgencia: 'esta_semana',
      estado: 'completada',
      diasAtras: 140
    },
    {
      key: 'o3',
      clienteEmail: `valentina.rivas${DEMO_SUFFIX}`,
      profesionalEmail: `yelitza.torres${DEMO_SUFFIX}`,
      categoriaid: CATEGORIAS.enfermeria,
      titulo: 'Cuidado postoperatorio a domicilio',
      descripcion: 'Busco enfermera certificada para el acompañamiento, aseo personal y administración de analgésicos a paciente femenina de 70 años recién operada de cadera.',
      ciudad: 'Caracas',
      zona: 'Las Mercedes',
      urgencia: 'hoy',
      estado: 'completada',
      diasAtras: 110
    },
    {
      key: 'o4',
      clienteEmail: `maria.gomez${DEMO_SUFFIX}`,
      profesionalEmail: `jose.rodriguez${DEMO_SUFFIX}`,
      categoriaid: CATEGORIAS.plomeria,
      titulo: 'Destape de tubería interna de fregadero',
      descripcion: 'La tubería del fregadero de la cocina se encuentra obstruida con grasa sólida y restos de comida. He intentado con químicos y no funciona.',
      ciudad: 'Caracas',
      zona: 'Chacao',
      urgencia: 'hoy',
      estado: 'completada',
      diasAtras: 85
    },
    {
      key: 'o5',
      clienteEmail: `valentina.rivas${DEMO_SUFFIX}`,
      profesionalEmail: `sofia.hernandez${DEMO_SUFFIX}`,
      categoriaid: CATEGORIAS.enfermeria,
      titulo: 'Administración de tratamiento de quimioterapia',
      descripcion: 'Se solicita enfermera con experiencia oncológica para canalizar vía e infundir sueros de soporte post-quimioterapia a paciente en domicilio.',
      ciudad: 'Caracas',
      zona: 'Las Mercedes',
      urgencia: 'hoy',
      estado: 'completada',
      diasAtras: 75
    },
    {
      key: 'o6',
      clienteEmail: `alejandro.silva${DEMO_SUFFIX}`,
      profesionalEmail: `nelson.perez${DEMO_SUFFIX}`,
      categoriaid: CATEGORIAS.electricidad,
      titulo: 'Instalación de tomacorrientes y lámparas colgantes',
      descripcion: 'Necesito cablear 4 tomacorrientes nuevos en sala y colgar 3 lámparas decorativas de techo en la barra desayunadora.',
      ciudad: 'Caracas',
      zona: 'El Hatillo',
      urgencia: 'esta_semana',
      estado: 'completada',
      diasAtras: 60
    },
    {
      key: 'o7',
      clienteEmail: `gaby.lopez${DEMO_SUFFIX}`,
      profesionalEmail: `carmen.ortiz${DEMO_SUFFIX}`,
      categoriaid: CATEGORIAS.enfermeria,
      titulo: 'Acompañamiento y estimulación cognitiva a abuela',
      descripcion: 'Requerimos enfermera para cuidado diurno (8am a 4pm) de abuelita de 78 años con demencia senil leve. Actividades de lectura, paseos e higiene.',
      ciudad: 'Valencia',
      zona: 'El Trigal',
      urgencia: 'esta_semana',
      estado: 'completada',
      diasAtras: 50
    },
    {
      key: 'o8',
      clienteEmail: `luis.martinez${DEMO_SUFFIX}`,
      profesionalEmail: `carlos.medina${DEMO_SUFFIX}`,
      categoriaid: CATEGORIAS.plomeria,
      titulo: 'Limpieza e impermeabilización de tanque subterráneo',
      descripcion: 'Mantenimiento anual de tanque de agua potable de 8,000 litros. Incluye vaciado, cepillado de paredes, desinfección con cloro y sellado de grietas.',
      ciudad: 'Caracas',
      zona: 'San Bernardino',
      urgencia: 'esta_semana',
      estado: 'completada',
      diasAtras: 42
    },
    {
      key: 'o9',
      clienteEmail: `ana.rodriguez${DEMO_SUFFIX}`,
      profesionalEmail: `francisco.blanco${DEMO_SUFFIX}`,
      categoriaid: CATEGORIAS.plomeria,
      titulo: 'Cambio de grifería completa de cocina y lavaplatos',
      descripcion: 'Sustitución de grifo monomando antiguo deteriorado por uno nuevo tipo cuello de cisne. Requiere cambio de mangueras y teflón.',
      ciudad: 'Maracay',
      zona: 'Las Delicias',
      urgencia: 'hoy',
      estado: 'completada',
      diasAtras: 28
    },
    {
      key: 'o10',
      clienteEmail: `pedro.castillo${DEMO_SUFFIX}`,
      profesionalEmail: `daniel.vargas${DEMO_SUFFIX}`,
      categoriaid: CATEGORIAS.electricidad,
      titulo: 'Instalación de reflectores de seguridad exteriores',
      ciudad: 'Caracas',
      zona: 'La Castellana',
      descripcion: 'Colocación de 4 reflectores LED con sensor de movimiento en las esquinas perimetrales de la quinta. Conexión a interruptor central.',
      urgencia: 'esta_semana',
      estado: 'completada',
      diasAtras: 22
    },
    {
      key: 'o11',
      clienteEmail: `elena.rojas${DEMO_SUFFIX}`,
      profesionalEmail: `laura.gil${DEMO_SUFFIX}`,
      categoriaid: CATEGORIAS.enfermeria,
      titulo: 'Curación diaria de heridas postquirúrgicas',
      descripcion: 'Se solicita profesional de enfermería para realizar curaciones y cambio de gasas diario a paciente masculino dado de alta por cirugía abdominal.',
      ciudad: 'Barquisimeto',
      zona: 'Cabudare',
      urgencia: 'hoy',
      estado: 'completada',
      diasAtras: 14
    },
    {
      key: 'o12',
      clienteEmail: `miguel.delgado${DEMO_SUFFIX}`,
      profesionalEmail: `nelson.perez${DEMO_SUFFIX}`,
      categoriaid: CATEGORIAS.electricidad,
      titulo: 'Balanceo de cargas en tablero bifásico',
      descripcion: 'El breaker principal se dispara cuando se encienden los aires acondicionados simultáneamente. Requiere balancear los consumos.',
      ciudad: 'Caracas',
      zona: 'La Urbina',
      urgencia: 'hoy',
      estado: 'completada',
      diasAtras: 4
    },
    {
      key: 'o13',
      clienteEmail: `maria.gomez${DEMO_SUFFIX}`,
      profesionalEmail: `andres.castro${DEMO_SUFFIX}`,
      categoriaid: CATEGORIAS.plomeria,
      titulo: 'Sustitución de bomba de agua de 1 HP',
      descripcion: 'La bomba del sistema hidroneumático se quemó. Necesito desmontar la dañada e instalar una bomba Pedrollo nueva de 1 HP.',
      ciudad: 'Valencia',
      zona: 'Prebo',
      urgencia: 'hoy',
      estado: 'completada',
      diasAtras: 8
    },
    {
      key: 'o14',
      clienteEmail: `luis.martinez${DEMO_SUFFIX}`,
      profesionalEmail: `jose.rodriguez${DEMO_SUFFIX}`,
      categoriaid: CATEGORIAS.plomeria,
      titulo: 'Instalación de calentador termoeléctrico de 27 litros',
      descripcion: 'Instalar calentador Start Terapy de pared. Incluye tuberías de termofusión para agua fría y caliente y conexión eléctrica de 220V.',
      ciudad: 'Caracas',
      zona: 'El Paraíso',
      urgencia: 'esta_semana',
      estado: 'completada',
      diasAtras: 6
    },

    // --- ÓRDENES EN PROCESO (Activas actualmente, asignadas a un profesional) ---
    {
      key: 'o15',
      clienteEmail: `valentina.rivas${DEMO_SUFFIX}`,
      profesionalEmail: `yelitza.torres${DEMO_SUFFIX}`,
      categoriaid: CATEGORIAS.enfermeria,
      titulo: 'Asistencia y administración de medicamentos',
      descripcion: 'Servicio de enfermería a domicilio por horas para paciente con tratamiento controlado de hipertensión y diabetes. Monitoreo diario.',
      ciudad: 'Caracas',
      zona: 'Altamira',
      urgencia: 'esta_semana',
      estado: 'en_proceso',
      diasAtras: 8
    },
    {
      key: 'o16',
      clienteEmail: `gaby.lopez${DEMO_SUFFIX}`,
      profesionalEmail: `nelson.perez${DEMO_SUFFIX}`,
      categoriaid: CATEGORIAS.electricidad,
      titulo: 'Revisión y recableado de local comercial',
      descripcion: 'El sistema eléctrico de la tienda comercial presenta caídas de voltaje recurrentes. Requiere revisión de líneas principales y cajas de empalme.',
      ciudad: 'Valencia',
      zona: 'Guataparo',
      urgencia: 'esta_semana',
      estado: 'en_proceso',
      diasAtras: 6
    },
    {
      key: 'o17',
      clienteEmail: `pedro.castillo${DEMO_SUFFIX}`,
      profesionalEmail: `andres.castro${DEMO_SUFFIX}`,
      categoriaid: CATEGORIAS.plomeria,
      titulo: 'Instalación de ramales de aguas servidas',
      descripcion: 'Reubicación y tendido de tubería de PVC de 4 pulgadas para desagüe de baño nuevo en planta alta en fase de construcción.',
      ciudad: 'Valencia',
      zona: 'San Diego',
      urgencia: 'esta_semana',
      estado: 'en_proceso',
      diasAtras: 5
    },
    {
      key: 'o18',
      clienteEmail: `elena.rojas${DEMO_SUFFIX}`,
      profesionalEmail: `carmen.ortiz${DEMO_SUFFIX}`,
      categoriaid: CATEGORIAS.enfermeria,
      titulo: 'Cuidado y rehabilitación de paciente ACV',
      descripcion: 'Apoyo en rehabilitación física pasiva en casa, movilización y alimentación asistida a paciente en recuperación post-derrame cerebral.',
      ciudad: 'Barquisimeto',
      zona: 'Este',
      urgencia: 'hoy',
      estado: 'en_proceso',
      diasAtras: 3
    },
    {
      key: 'o19',
      clienteEmail: `ana.rodriguez${DEMO_SUFFIX}`,
      profesionalEmail: `hector.mendez${DEMO_SUFFIX}`,
      categoriaid: CATEGORIAS.electricidad,
      titulo: 'Mantenimiento preventivo de breakers residenciales',
      descripcion: 'Limpieza de bornes, reapriete de conexiones del tablero y reemplazo de 2 breakers termo-magnéticos desgastados que zumban.',
      ciudad: 'Maracay',
      zona: 'Base Aragua',
      urgencia: 'esta_semana',
      estado: 'en_proceso',
      diasAtras: 2
    },
    {
      key: 'o20',
      clienteEmail: `miguel.delgado${DEMO_SUFFIX}`,
      profesionalEmail: `patricia.suarez${DEMO_SUFFIX}`,
      categoriaid: CATEGORIAS.enfermeria,
      titulo: 'Colocación de inyección intramuscular diaria',
      descripcion: 'Enfermera para asistir a domicilio a colocar dosis diaria de antinflamatorio vía glútea a paciente con lumbago severo durante 5 días.',
      ciudad: 'Caracas',
      zona: 'Los Ruices',
      urgencia: 'hoy',
      estado: 'en_proceso',
      diasAtras: 1
    },

    // --- ÓRDENES PENDIENTES (Ofertas activas en el tablero, sin profesional asignado) ---
    {
      key: 'o21',
      clienteEmail: `alejandro.silva${DEMO_SUFFIX}`,
      profesionalEmail: null,
      categoriaid: CATEGORIAS.plomeria,
      titulo: 'Destape de fregadero y limpieza de tubería de grasa',
      descripcion: 'El desagüe de la cocina está trancado y el agua se rebosa. Necesito un plomero con guaya eléctrica para limpiar la tubería a fondo.',
      ciudad: 'Caracas',
      zona: 'Baruta',
      urgencia: 'hoy',
      estado: 'pendiente',
      diasAtras: 2
    },
    {
      key: 'o22',
      clienteEmail: `valentina.rivas${DEMO_SUFFIX}`,
      profesionalEmail: null,
      categoriaid: CATEGORIAS.electricidad,
      titulo: 'Instalación de lámparas LED empotradas en Drywall',
      descripcion: 'Se requiere electricista con sierra de corona para perforar techo de drywall e instalar y cablear 8 ojos de buey LED nuevos en la sala.',
      ciudad: 'Caracas',
      zona: 'Las Mercedes',
      urgencia: 'esta_semana',
      estado: 'pendiente',
      diasAtras: 1
    },
    {
      key: 'o23',
      clienteEmail: `gaby.lopez${DEMO_SUFFIX}`,
      profesionalEmail: null,
      categoriaid: CATEGORIAS.plomeria,
      titulo: 'Fuga de gas en cocina empotrada',
      descripcion: 'Huele a gas levemente detrás de la cocina empotrada al abrir la llave de paso de la bombona. Urge técnico para revisar manguera y conexiones.',
      ciudad: 'Valencia',
      zona: 'Guataparo',
      urgencia: 'hoy',
      estado: 'pendiente',
      diasAtras: 0,
      horasAtras: 18
    },
    {
      key: 'o24',
      clienteEmail: `luis.martinez${DEMO_SUFFIX}`,
      profesionalEmail: null,
      categoriaid: CATEGORIAS.electricidad,
      titulo: 'Alimentación eléctrica exclusiva para aire acondicionado',
      descripcion: 'Tendido de cable calibre 10 desde el tablero principal hasta el cuarto principal (aprox. 15 metros) para instalar toma de 220V para aire de 12k BTU.',
      ciudad: 'Caracas',
      zona: 'Coche',
      urgencia: 'esta_semana',
      estado: 'pendiente',
      diasAtras: 0,
      horasAtras: 14
    },
    {
      key: 'o25',
      clienteEmail: `ana.rodriguez${DEMO_SUFFIX}`,
      profesionalEmail: null,
      categoriaid: CATEGORIAS.enfermeria,
      titulo: 'Sustitución de sonda vesical a domicilio',
      descripcion: 'Solicito licenciada en enfermería para el retiro de sonda vesical antigua y colocación de una nueva a paciente femenino con tratamiento médico en casa.',
      ciudad: 'Maracay',
      zona: 'El Limón',
      urgencia: 'hoy',
      estado: 'pendiente',
      diasAtras: 0,
      horasAtras: 8
    },
    {
      key: 'o26',
      clienteEmail: `pedro.castillo${DEMO_SUFFIX}`,
      profesionalEmail: null,
      categoriaid: CATEGORIAS.plomeria,
      titulo: 'Sustitución de llave de paso general del apartamento',
      descripcion: 'La llave de paso principal de agua de 3/4 en la entrada del apartamento está trancada y no gira. Necesito cambiarla por una llave de bola nueva.',
      ciudad: 'Caracas',
      zona: 'Macaracuay',
      urgencia: 'hoy',
      estado: 'pendiente',
      diasAtras: 0,
      horasAtras: 5
    },
    {
      key: 'o27',
      clienteEmail: `elena.rojas${DEMO_SUFFIX}`,
      profesionalEmail: null,
      categoriaid: CATEGORIAS.electricidad,
      titulo: 'Fallo eléctrico generalizado en sala de estar',
      descripcion: 'De pronto la mitad de los enchufes y las luces de la sala dejaron de funcionar. Los breakers están arriba. Sospecho de un cable neutro quemado.',
      ciudad: 'Barquisimeto',
      zona: 'Oeste',
      urgencia: 'hoy',
      estado: 'pendiente',
      diasAtras: 0,
      horasAtras: 2
    }
  ];

  const ordenesMap = {};

  for (const o of ordenesData) {
    const cliId = clientesMap[o.clienteEmail];
    const profId = o.profesionalEmail ? profesionalesMap[o.profesionalEmail] : null;
    const fechaCreacion = o.horasAtras ? getDateAgo(0, o.horasAtras) : getDateAgo(o.diasAtras);

    const { data: insertedOrder, error: orderError } = await supabase
      .from('ordenes')
      .insert({
        clienteid: cliId,
        profesionalid: profId,
        categoriaid: o.categoriaid,
        titulo: o.titulo,
        descripcion: o.descripcion,
        ciudad: o.ciudad,
        zona: o.zona,
        urgencia: o.urgencia,
        estado: o.estado,
        createdat: fechaCreacion,
        updatedat: fechaCreacion
      })
      .select('id')
      .single();

    if (orderError) {
      console.error(`Error al insertar orden "${o.titulo}":`, orderError);
      continue;
    }

    ordenesMap[o.key] = insertedOrder.id;
    console.log(`✓ Orden creada: "${o.titulo}" (${insertedOrder.id})`);
  }

  // 7. Crear Calificaciones (Reseñas cruzadas cliente <=> profesional para las órdenes completadas)
  console.log('\n--- Creando Calificaciones y Reseñas Históricas ---');

  const calificacionesData = [
    // Orden 1: Maria <=> Carlos
    {
      ordenid: ordenesMap.o1,
      calificadorpor: clientesMap[`maria.gomez${DEMO_SUFFIX}`],
      calificadoa: profesionalesMap[`carlos.medina${DEMO_SUFFIX}`],
      estrellas: 5,
      comentario: 'Excelente servicio. Carlos llegó súper puntual, localizó el tramo de tubería roto rápidamente y lo soldó de forma perfecta. Muy limpio.',
      diasAtras: 168
    },
    {
      ordenid: ordenesMap.o1,
      calificadorpor: profesionalesMap[`carlos.medina${DEMO_SUFFIX}`],
      calificadoa: clientesMap[`maria.gomez${DEMO_SUFFIX}`],
      estrellas: 5,
      comentario: 'Excelente cliente. Me dio las facilidades para trabajar y realizó el pago acordado por Pago Móvil de inmediato al culminar.',
      diasAtras: 168
    },

    // Orden 2: Alejandro <=> Nelson
    {
      ordenid: ordenesMap.o2,
      calificadorpor: clientesMap[`alejandro.silva${DEMO_SUFFIX}`],
      calificadoa: profesionalesMap[`nelson.perez${DEMO_SUFFIX}`],
      estrellas: 4,
      comentario: 'Muy profesional y educado. Resolvió el recableado del tablero perfectamente. Tardó una hora extra pero el acabado final es de primera.',
      diasAtras: 138
    },
    {
      ordenid: ordenesMap.o2,
      calificadorpor: profesionalesMap[`nelson.perez${DEMO_SUFFIX}`],
      calificadoa: clientesMap[`alejandro.silva${DEMO_SUFFIX}`],
      estrellas: 5,
      comentario: 'Recomendado para futuros servicios. Comunicación clara, estuvo al tanto de la compra de materiales y fue súper receptivo.',
      diasAtras: 138
    },

    // Orden 3: Valentina <=> Yelitza
    {
      ordenid: ordenesMap.o3,
      calificadorpor: clientesMap[`valentina.rivas${DEMO_SUFFIX}`],
      calificadoa: profesionalesMap[`yelitza.torres${DEMO_SUFFIX}`],
      estrellas: 5,
      comentario: 'Yelitza es una enfermera espectacular. Cuidó de mi madre con un cariño increíble tras su operación, sumamente profesional y atenta.',
      diasAtras: 108
    },
    {
      ordenid: ordenesMap.o3,
      calificadorpor: profesionalesMap[`yelitza.torres${DEMO_SUFFIX}`],
      calificadoa: clientesMap[`valentina.rivas${DEMO_SUFFIX}`],
      estrellas: 5,
      comentario: 'Una familia encantadora. Me brindaron todas las comodidades durante el servicio. Altamente recomendada.',
      diasAtras: 108
    },

    // Orden 4: Maria <=> Jose
    {
      ordenid: ordenesMap.o4,
      calificadorpor: clientesMap[`maria.gomez${DEMO_SUFFIX}`],
      calificadoa: profesionalesMap[`jose.rodriguez${DEMO_SUFFIX}`],
      estrellas: 5,
      comentario: 'José resolvió el problema del fregadero en media hora. Usó la herramienta adecuada y no dejó nada sucio. Precios muy razonables.',
      diasAtras: 84
    },
    {
      ordenid: ordenesMap.o4,
      calificadorpor: profesionalesMap[`jose.rodriguez${DEMO_SUFFIX}`],
      calificadoa: clientesMap[`maria.gomez${DEMO_SUFFIX}`],
      estrellas: 5,
      comentario: 'Cliente atenta y respetuosa. Explicó bien el problema y todo fluyó rápido.',
      diasAtras: 84
    },

    // Orden 5: Valentina <=> Sofia
    {
      ordenid: ordenesMap.o5,
      calificadorpor: clientesMap[`valentina.rivas${DEMO_SUFFIX}`],
      calificadoa: profesionalesMap[`sofia.hernandez${DEMO_SUFFIX}`],
      estrellas: 5,
      comentario: 'Excelente profesional. Sofia tiene muy buen pulso para las vías y trató con suma empatía al paciente oncológico. La volveríamos a contratar.',
      diasAtras: 73
    },
    {
      ordenid: ordenesMap.o5,
      calificadorpor: profesionalesMap[`sofia.hernandez${DEMO_SUFFIX}`],
      calificadoa: clientesMap[`valentina.rivas${DEMO_SUFFIX}`],
      estrellas: 5,
      comentario: 'Gracias por abrirme las puertas de su hogar. Paciente muy colaborador. Un gusto asistirles.',
      diasAtras: 73
    },

    // Orden 6: Alejandro <=> Nelson
    {
      ordenid: ordenesMap.o6,
      calificadorpor: clientesMap[`alejandro.silva${DEMO_SUFFIX}`],
      calificadoa: profesionalesMap[`nelson.perez${DEMO_SUFFIX}`],
      estrellas: 5,
      comentario: 'Instalación de tomacorrientes rápida y sin contratiempos. Las lámparas de la barra desayunadora quedaron bellísimas.',
      diasAtras: 58
    },
    {
      ordenid: ordenesMap.o6,
      calificadorpor: profesionalesMap[`nelson.perez${DEMO_SUFFIX}`],
      calificadoa: clientesMap[`alejandro.silva${DEMO_SUFFIX}`],
      estrellas: 4,
      comentario: 'El cliente suministró lámparas de buena calidad. Todo el proceso fue bastante transparente. Recomendado.',
      diasAtras: 58
    },

    // Orden 7: Gabriela <=> Carmen
    {
      ordenid: ordenesMap.o7,
      calificadorpor: clientesMap[`gaby.lopez${DEMO_SUFFIX}`],
      calificadoa: profesionalesMap[`carmen.ortiz${DEMO_SUFFIX}`],
      estrellas: 5,
      comentario: 'Carmen es sumamente paciente y amorosa. Logró conectar muy rápido con mi abuela y realizar las dinámicas de memoria de forma divertida.',
      diasAtras: 48
    },
    {
      ordenid: ordenesMap.o7,
      calificadorpor: profesionalesMap[`carmen.ortiz${DEMO_SUFFIX}`],
      calificadoa: clientesMap[`gaby.lopez${DEMO_SUFFIX}`],
      estrellas: 5,
      comentario: 'Excelente comunicación familiar y pagos al día. Cuidar de su abuela fue un verdadero placer.',
      diasAtras: 48
    },

    // Orden 8: Luis <=> Carlos
    {
      ordenid: ordenesMap.o8,
      calificadorpor: clientesMap[`luis.martinez${DEMO_SUFFIX}`],
      calificadoa: profesionalesMap[`carlos.medina${DEMO_SUFFIX}`],
      estrellas: 5,
      comentario: 'Limpieza profunda del tanque subterráneo. Todo quedó super limpio e higienizado. Muy recomendado.',
      diasAtras: 40
    },
    {
      ordenid: ordenesMap.o8,
      calificadorpor: profesionalesMap[`carlos.medina${DEMO_SUFFIX}`],
      calificadoa: clientesMap[`luis.martinez${DEMO_SUFFIX}`],
      estrellas: 4,
      comentario: 'Contratante amable. El acceso al sótano fue rápido y nos facilitó la toma de corriente para la hidrolavadora.',
      diasAtras: 40
    },

    // Orden 9: Ana <=> Francisco
    {
      ordenid: ordenesMap.o9,
      calificadorpor: clientesMap[`ana.rodriguez${DEMO_SUFFIX}`],
      calificadoa: profesionalesMap[`francisco.blanco${DEMO_SUFFIX}`],
      estrellas: 5,
      comentario: 'Francisco instaló el monomando de la cocina de manera impecable. Trajo sus propias herramientas y adaptó los racores de cobre de forma prolija.',
      diasAtras: 27
    },
    {
      ordenid: ordenesMap.o9,
      calificadorpor: profesionalesMap[`francisco.blanco${DEMO_SUFFIX}`],
      calificadoa: clientesMap[`ana.rodriguez${DEMO_SUFFIX}`],
      estrellas: 5,
      comentario: 'Excelente comunicación y pago inmediato por transferencia. Totalmente recomendada como contratante.',
      diasAtras: 27
    },

    // Orden 10: Pedro <=> Daniel
    {
      ordenid: ordenesMap.o10,
      calificadorpor: clientesMap[`pedro.castillo${DEMO_SUFFIX}`],
      calificadoa: profesionalesMap[`daniel.vargas${DEMO_SUFFIX}`],
      estrellas: 5,
      comentario: 'Daniel colocó los reflectores en el jardín rápidamente. Funciona perfectamente el sensor. Profesional recomendado.',
      diasAtras: 21
    },
    {
      ordenid: ordenesMap.o10,
      calificadorpor: profesionalesMap[`daniel.vargas${DEMO_SUFFIX}`],
      calificadoa: clientesMap[`pedro.castillo${DEMO_SUFFIX}`],
      estrellas: 5,
      comentario: 'Pedro fue muy atento, el trabajo se hizo rápido y las indicaciones de montaje fueron muy claras.',
      diasAtras: 21
    },

    // Orden 11: Elena <=> Laura
    {
      ordenid: ordenesMap.o11,
      calificadorpor: clientesMap[`elena.rojas${DEMO_SUFFIX}`],
      calificadoa: profesionalesMap[`laura.gil${DEMO_SUFFIX}`],
      estrellas: 5,
      comentario: 'Super recomendada. Las curaciones diarias fueron hechas con un alto estándar de asepsia y técnica quirúrgica. La cicatrización va excelente.',
      diasAtras: 13
    },
    {
      ordenid: ordenesMap.o11,
      calificadorpor: profesionalesMap[`laura.gil${DEMO_SUFFIX}`],
      calificadoa: clientesMap[`elena.rojas${DEMO_SUFFIX}`],
      estrellas: 5,
      comentario: 'Elena es una excelente contratante, muy cuidadosa y responsable con los requerimientos médicos del paciente.',
      diasAtras: 13
    },

    // Orden 12: Miguel <=> Nelson
    {
      ordenid: ordenesMap.o12,
      calificadorpor: clientesMap[`miguel.delgado${DEMO_SUFFIX}`],
      calificadoa: profesionalesMap[`nelson.perez${DEMO_SUFFIX}`],
      estrellas: 5,
      comentario: 'Nelson balanceó el tablero general de breakers. Ahora podemos encender los aires sin problemas. Profesional altamente técnico.',
      diasAtras: 3
    },
    {
      ordenid: ordenesMap.o12,
      calificadorpor: profesionalesMap[`nelson.perez${DEMO_SUFFIX}`],
      calificadoa: clientesMap[`miguel.delgado${DEMO_SUFFIX}`],
      estrellas: 4,
      comentario: 'Todo bien con Miguel. Mostró buena disposición para coordinar el horario de corte de energía para el balanceo.',
      diasAtras: 3
    },

    // Orden 13: Maria <=> Andres
    {
      ordenid: ordenesMap.o13,
      calificadorpor: clientesMap[`maria.gomez${DEMO_SUFFIX}`],
      calificadoa: profesionalesMap[`andres.castro${DEMO_SUFFIX}`],
      estrellas: 5,
      comentario: 'Andrés sustituyó la bomba de agua del edificio rápidamente. Volvimos a tener agua el mismo día. Gran plomero.',
      diasAtras: 7
    },
    {
      ordenid: ordenesMap.o13,
      calificadorpor: profesionalesMap[`andres.castro${DEMO_SUFFIX}`],
      calificadoa: clientesMap[`maria.gomez${DEMO_SUFFIX}`],
      estrellas: 5,
      comentario: 'Maria coordinó muy bien el acceso con la junta de condominio. Excelente comunicación.',
      diasAtras: 7
    },

    // Orden 14: Luis <=> Jose
    {
      ordenid: ordenesMap.o14,
      calificadorpor: clientesMap[`luis.martinez${DEMO_SUFFIX}`],
      calificadoa: profesionalesMap[`jose.rodriguez${DEMO_SUFFIX}`],
      estrellas: 5,
      comentario: 'Instalación impecable del calentador eléctrico de agua. Hizo las conexiones de termofusión perfectas. Todo al 100%.',
      diasAtras: 5
    },
    {
      ordenid: ordenesMap.o14,
      calificadorpor: profesionalesMap[`jose.rodriguez${DEMO_SUFFIX}`],
      calificadoa: clientesMap[`luis.martinez${DEMO_SUFFIX}`],
      estrellas: 5,
      comentario: 'Un contratante muy amable y serio en el trato. Pago inmediato y ambiente laboral cómodo.',
      diasAtras: 5
    }
  ];

  for (const c of calificacionesData) {
    const fechaResena = getDateAgo(c.diasAtras);

    const { error: rateError } = await supabase.from('calificaciones').insert({
      ordenid: c.ordenid,
      calificadorpor: c.calificadorpor,
      calificadoa: c.calificadoa,
      estrellas: c.estrellas,
      comentario: c.comentario,
      createdat: fechaResena
    });

    if (rateError) {
      console.error(`Error al insertar calificación para orden ID ${c.ordenid}:`, rateError);
    } else {
      console.log(`✓ Reseña creada: ${c.estrellas}★ de ${c.calificadorpor.substring(0, 5)}... a ${c.calificadoa.substring(0, 5)}...`);
    }
  }

  console.log('\n=== CARGA DE DATOS DEMO (6 MESES DE HISTORIA) COMPLETADA ===');
}

async function run() {
  if (action === 'clean') {
    await cleanDemoData();
  } else if (action === 'seed') {
    await seedDemoData();
  }
}

run();
