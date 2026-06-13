const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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

  console.log('=== INICIANDO CARGA DE DATOS DEMO (SEED) ===');

  // 1. Definir Clientes
  const clientesData = [
    { nombre: 'Maria Gomez', email: `maria.gomez${DEMO_SUFFIX}`, pass: 'demo.maria123', ciudad: 'Caracas' },
    { nombre: 'Alejandro Silva', email: `alejandro.silva${DEMO_SUFFIX}`, pass: 'demo.ale123', ciudad: 'Caracas' },
    { nombre: 'Valentina Rivas', email: `valentina.rivas${DEMO_SUFFIX}`, pass: 'demo.vale123', ciudad: 'Caracas' }
  ];

  // 2. Definir Profesionales
  const profesionalesData = [
    {
      nombre: 'Carlos Medina',
      email: `carlos.medina${DEMO_SUFFIX}`,
      pass: 'demo.carlos123',
      ciudad: 'Caracas',
      especialidad: 'plomeria',
      descripcion: 'Especialista en tuberías, filtraciones y calentadores de agua. Con más de 8 años de experiencia en el área metropolitana de Caracas.',
      experiencia: 8,
      wallet: { saldo: 15, cargado: 25, usado: 10 }
    },
    {
      nombre: 'Nelson Perez',
      email: `nelson.perez${DEMO_SUFFIX}`,
      pass: 'demo.nelson123',
      ciudad: 'Caracas',
      especialidad: 'electricidad',
      descripcion: 'Técnico electricista certificado. Instalaciones eléctricas residenciales y comerciales, tableros de control y resolución de cortocircuitos.',
      experiencia: 12,
      wallet: { saldo: 8, cargado: 15, usado: 7 }
    },
    {
      nombre: 'Yelitza Torres',
      email: `yelitza.torres${DEMO_SUFFIX}`,
      pass: 'demo.yelitza123',
      ciudad: 'Caracas',
      especialidad: 'enfermeria',
      descripcion: 'Enfermera graduada con experiencia en cuidados intensivos, cuidado de adultos mayores, administración de tratamientos y curas a domicilio.',
      experiencia: 15,
      wallet: { saldo: 12, cargado: 20, usado: 8 }
    },
    {
      nombre: 'Jose Rodriguez',
      email: `jose.rodriguez${DEMO_SUFFIX}`,
      pass: 'demo.jose123',
      ciudad: 'Caracas',
      especialidad: 'plomeria',
      descripcion: 'Destapes de cañerías, limpieza de tanques subterráneos, instalación de grifería y mantenimiento sanitario residencial.',
      experiencia: 6,
      wallet: { saldo: 5, cargado: 10, usado: 5 }
    },
    {
      nombre: 'Sofia Hernandez',
      email: `sofia.hernandez${DEMO_SUFFIX}`,
      pass: 'demo.sofia123',
      ciudad: 'Caracas',
      especialidad: 'enfermeria',
      descripcion: 'Licenciada en enfermería. Cuidado especializado de pacientes pediátricos y postoperatorios a domicilio. Trato humano y profesional.',
      experiencia: 10,
      wallet: { saldo: 19, cargado: 30, usado: 11 }
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

    // Actualizar fecha de creación histórica (hace 30 días)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    await supabase.from('usuarios').update({ createdat: thirtyDaysAgo }).eq('id', userId);
  }

  // 4. Crear Profesionales en Auth + Perfiles en profesionales
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

    // Forzar fecha de creación histórica (hace 30 días)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    await supabase.from('usuarios').update({ createdat: thirtyDaysAgo }).eq('id', userId);
    await supabase.from('profesionales').update({ createdat: thirtyDaysAgo }).eq('usuarioid', userId);

    // Actualizar Wallet con los saldos históricos de la demo
    const { error: walletError } = await supabase
      .from('wallet')
      .update({
        saldo: p.wallet.saldo,
        totalcargado: p.wallet.cargado,
        totalusado: p.wallet.usado,
        updatedat: thirtyDaysAgo
      })
      .eq('profesionalid', userId);

    if (walletError) {
      console.error(`  Error al configurar wallet para ${p.nombre}:`, walletError);
    } else {
      console.log(`  ✓ Billetera configurada: Saldo = ${p.wallet.saldo} créditos`);
    }

    // Insertar recargas de prueba aprobadas históricas
    const rechargeDate = new Date();
    rechargeDate.setDate(rechargeDate.getDate() - 25);
    await supabase.from('recargas').insert({
      profesionalid: userId,
      paquete: p.wallet.cargado,
      montousd: p.wallet.cargado * 1.20,
      metodopago: 'pagomovil',
      referencia: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      captura_url: 'https://xrwidvwsmpmoqhbaiado.supabase.co/storage/v1/object/public/recargas/demo_receipt.png',
      estado: 'aprobada',
      createdat: rechargeDate,
      aprobadoat: rechargeDate
    });
  }

  // 5. Crear Órdenes con fechas y estados variados
  console.log('\n--- Creando Órdenes ---');
  
  const o1Date = new Date(); o1Date.setDate(o1Date.getDate() - 10); // Hace 10 días
  const o2Date = new Date(); o2Date.setDate(o2Date.getDate() - 8);  // Hace 8 días
  const o3Date = new Date(); o3Date.setDate(o3Date.getDate() - 2);  // Hace 2 días
  const o4Date = new Date(); o4Date.setDate(o4Date.getDate() - 15); // Hace 15 días
  const o5Date = new Date(); o5Date.setHours(o5Date.getHours() - 3); // Hace 3 horas
  const o6Date = new Date(); o6Date.setDate(o6Date.getDate() - 1);  // Hace 1 día

  const ordenesData = [
    {
      key: 'o1',
      clienteid: clientesMap[`maria.gomez${DEMO_SUFFIX}`],
      profesionalid: profesionalesMap[`carlos.medina${DEMO_SUFFIX}`],
      categoriaid: CATEGORIAS.plomeria,
      titulo: 'Filtración en pared del baño principal',
      descripcion: 'Tengo una filtración muy húmeda en la pared del baño que colinda con la cocina. Necesito romper y soldar la tubería averiada.',
      ciudad: 'Caracas',
      zona: 'Chacao',
      urgencia: 'hoy',
      estado: 'completada',
      createdat: o1Date
    },
    {
      key: 'o2',
      clienteid: clientesMap[`alejandro.silva${DEMO_SUFFIX}`],
      profesionalid: profesionalesMap[`nelson.perez${DEMO_SUFFIX}`],
      categoriaid: CATEGORIAS.electricidad,
      titulo: 'Instalación de tablero eléctrico y cableado',
      descripcion: 'Requiero instalar un tablero eléctrico de 12 circuitos nuevo en el apartamento y recablear los breakers principales desde la tanquilla exterior.',
      ciudad: 'Caracas',
      zona: 'El Hatillo',
      urgencia: 'esta_semana',
      estado: 'completada',
      createdat: o2Date
    },
    {
      key: 'o3',
      clienteid: clientesMap[`valentina.rivas${DEMO_SUFFIX}`],
      profesionalid: profesionalesMap[`yelitza.torres${DEMO_SUFFIX}`],
      categoriaid: CATEGORIAS.enfermeria,
      titulo: 'Cuidado nocturno a paciente de tercera edad',
      descripcion: 'Busco enfermera certificada para el acompañamiento y administración de medicamentos vía oral a paciente femenino de 85 años, horario nocturno.',
      ciudad: 'Caracas',
      zona: 'Las Mercedes',
      urgencia: 'esta_semana',
      estado: 'en_proceso',
      createdat: o3Date
    },
    {
      key: 'o4',
      clienteid: clientesMap[`maria.gomez${DEMO_SUFFIX}`],
      profesionalid: profesionalesMap[`sofia.hernandez${DEMO_SUFFIX}`],
      categoriaid: CATEGORIAS.enfermeria,
      titulo: 'Administración de antibióticos endovenosos',
      descripcion: 'Necesito enfermera a domicilio por 5 días para colocar tratamiento endovenoso recetado cada 12 horas. Indispensable excelente pulso para vías.',
      ciudad: 'Caracas',
      zona: 'Chacao',
      urgencia: 'hoy',
      estado: 'completada',
      createdat: o4Date
    },
    {
      key: 'o5',
      clienteid: clientesMap[`alejandro.silva${DEMO_SUFFIX}`],
      profesionalid: null,
      categoriaid: CATEGORIAS.plomeria,
      titulo: 'Destape de fregadero y mantenimiento de sifones',
      descripcion: 'El fregadero de la cocina está completamente tapado. El agua no baja y gotea por el sifón inferior. Requiere limpieza urgente.',
      ciudad: 'Caracas',
      zona: 'Baruta',
      urgencia: 'hoy',
      estado: 'pendiente',
      createdat: o5Date
    },
    {
      key: 'o6',
      clienteid: clientesMap[`valentina.rivas${DEMO_SUFFIX}`],
      profesionalid: null,
      categoriaid: CATEGORIAS.electricidad,
      titulo: 'Instalación de focos LED en sala y terraza',
      descripcion: 'Necesito empotrar 8 ojos de buey LED nuevos en techo de drywall y colgar una lámpara decorativa en el área de la terraza exterior.',
      ciudad: 'Caracas',
      zona: 'Las Mercedes',
      urgencia: 'esta_semana',
      estado: 'pendiente',
      createdat: o6Date
    }
  ];

  const ordenesMap = {};

  for (const o of ordenesData) {
    const { data: insertedOrder, error: orderError } = await supabase
      .from('ordenes')
      .insert({
        clienteid: o.clienteid,
        profesionalid: o.profesionalid,
        categoriaid: o.categoriaid,
        titulo: o.titulo,
        descripcion: o.descripcion,
        ciudad: o.ciudad,
        zona: o.zona,
        urgencia: o.urgencia,
        estado: o.estado,
        createdat: o.createdat,
        updatedat: o.createdat
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

  // 6. Crear Calificaciones (Calificaciones cruzadas cliente <=> profesional)
  console.log('\n--- Creando Calificaciones y Reseñas ---');

  const calificacionesData = [
    // Orden 1: Maria califica a Carlos, Carlos califica a Maria
    {
      ordenid: ordenesMap.o1,
      calificadorpor: clientesMap[`maria.gomez${DEMO_SUFFIX}`],
      calificadoa: profesionalesMap[`carlos.medina${DEMO_SUFFIX}`],
      estrellas: 5,
      comentario: 'Excelente servicio. Carlos llegó súper puntual, localizó el tramo de tubería roto rápidamente y lo soldó de forma perfecta. Muy limpio.',
      daysOffset: 10
    },
    {
      ordenid: ordenesMap.o1,
      calificadorpor: profesionalesMap[`carlos.medina${DEMO_SUFFIX}`],
      calificadoa: clientesMap[`maria.gomez${DEMO_SUFFIX}`],
      estrellas: 5,
      comentario: 'Excelente cliente. Me dio las facilidades para trabajar y realizó el pago acordado por Pago Móvil de inmediato al culminar.',
      daysOffset: 10
    },

    // Orden 2: Alejandro califica a Nelson, Nelson califica a Alejandro
    {
      ordenid: ordenesMap.o2,
      calificadorpor: clientesMap[`alejandro.silva${DEMO_SUFFIX}`],
      calificadoa: profesionalesMap[`nelson.perez${DEMO_SUFFIX}`],
      estrellas: 4,
      comentario: 'Muy profesional y educado. Resolvió el recableado del tablero perfectamente. Tardó una hora extra pero el acabado final es de primera.',
      daysOffset: 8
    },
    {
      ordenid: ordenesMap.o2,
      calificadorpor: profesionalesMap[`nelson.perez${DEMO_SUFFIX}`],
      calificadoa: clientesMap[`alejandro.silva${DEMO_SUFFIX}`],
      estrellas: 5,
      comentario: 'Recomendado para futuros servicios. Comunicación clara, estuvo al tanto de la compra de materiales y fue súper receptivo.',
      daysOffset: 8
    },

    // Orden 4: Maria califica a Sofia, Sofia califica a Maria
    {
      ordenid: ordenesMap.o4,
      calificadorpor: clientesMap[`maria.gomez${DEMO_SUFFIX}`],
      calificadoa: profesionalesMap[`sofia.hernandez${DEMO_SUFFIX}`],
      estrellas: 5,
      comentario: 'Sofia es una enfermera excelente. Trató a mi tía con mucho cuidado, tiene una mano fantástica para las vías endovenosas. Muy confiable.',
      daysOffset: 15
    },
    {
      ordenid: ordenesMap.o4,
      calificadorpor: profesionalesMap[`sofia.hernandez${DEMO_SUFFIX}`],
      calificadoa: clientesMap[`maria.gomez${DEMO_SUFFIX}`],
      estrellas: 5,
      comentario: 'Trato muy respetuoso, ambiente de trabajo cómodo y familiar. Muchas gracias por la confianza.',
      daysOffset: 15
    }
  ];

  for (const c of calificacionesData) {
    const rateDate = new Date();
    rateDate.setDate(rateDate.getDate() - c.daysOffset);

    const { error: rateError } = await supabase.from('calificaciones').insert({
      ordenid: c.ordenid,
      calificadorpor: c.calificadorpor,
      calificadoa: c.calificadoa,
      estrellas: c.estrellas,
      comentario: c.comentario,
      createdat: rateDate
    });

    if (rateError) {
      console.error(`Error al insertar calificación para orden ID ${c.ordenid}:`, rateError);
    } else {
      console.log(`✓ Reseña creada: ${c.estrellas}★ de ${c.calificadorpor.substring(0, 5)}... a ${c.calificadoa.substring(0, 5)}...`);
    }
  }

  console.log('\n=== CARGA DE DATOS DEMO (SEED) COMPLETADA ===');
}

async function run() {
  if (action === 'clean') {
    await cleanDemoData();
  } else if (action === 'seed') {
    await seedDemoData();
  }
}

run();
