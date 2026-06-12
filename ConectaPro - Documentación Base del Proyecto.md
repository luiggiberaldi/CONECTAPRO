###### *ConectaPro — Documentación Base del Proyecto*

###### *Versión: 1.0 | Fecha: 10 de junio de 2026 |* 

###### *Autor: Desarrollador Principal | Estado: En construcción*

###### *1\. CONCEPTO DEL PROYECTO* 

###### *Tipo de documento: Documentación base (Product Requirements Document \- PRD) Proyecto: ConectaPro | Versión: 1.0 | Fecha: 10 junio 2026 | Estado: Activo*

###### *ConectaPro es una PWA (Progressive Web App) tipo marketplace de servicios, inspirada en Workana y Uber, diseñada específicamente para Venezuela. Su objetivo es conectar de forma rápida, segura y confiable a personas que necesitan un servicio (plomería, enfermería, electricidad, abogacía, mecánica) con profesionales dispuestos a resolverlo, mediante un sistema de créditos prepago, chat interno y reputación acumulada.*

###### *2\. MANIFIESTO CONECTAPRO* 

Lo que SÍ haremos

###### *\- Conectar clientes con profesionales verificados por reputación.- Cobrar al profesional 1 crédito (= $1.20) por cada orden aceptada.*

\- Regalar 3 créditos de bienvenida a cada profesional nuevo.  
\- Mantener chat interno entre cliente y profesional por orden.  
\- Mostrar reputación (estrellas \+ servicios completados) como métrica central.  
\- Permitir al cliente pagar 100% directo al profesional (la app no toca ese dinero).  
\- Tener un panel admin para aprobar recargas y moderar usuarios.

###### *Lo que NO haremos (nunca)- No procesaremos ni tocaremos el pago del servicio entre cliente y profesional.- No mostraremos el teléfono del profesional antes de que haya aceptado la orden con créditos.*

\- No permitiremos reseñas sin haber completado el servicio.  
\- No abriremos más de 3 categorías en MVP v1.0 (foco antes que alcance).  
\- No cobraremos comisión al cliente final.  
\- No permitiremos editar reseñas publicadas.  
\- No usaremos window.alert / window.confirm / window.prompt en la UI.

###### *3\. ACTORES DEL SISTEMA* 

###### *3..1 Cliente (Usuario Final)Perfil real: Carlos, 34 años, Valencia. Empleado o pequeño comerciante, maneja WhatsApp diariamente.Dolor: No tiene contactos de confianza para resolver problemas urgentes en casa. Teme estafas y desconocidos.*

Objetivo: Resolver su problema rápido con alguien verificado y con reseñas reales.  
Costo: GRATIS. No paga nada a la plataforma. Le paga el 100% al profesional directo.  
Acciones principales: Publicar orden de servicio, ver profesionales, chatear, calificar.

###### *3.2 Profesional (Proveedor de Servicio)Perfil real: Andrea, 28 años. Enfermera, electricista, plomero o abogado independiente. Trabaja por cuenta propia.Dolor: Depende solo de boca a boca y grupos de WhatsApp/Facebook para conseguir clientes.*

Objetivo: Flujo constante de clientes verificados, construir reputación online y cobrar mejor.  
Costo: Compra créditos prepago. 1 crédito \= $1.20 USD. Se descuenta al aceptar cada orden.  
Bono de bienvenida: Recibe 3 créditos gratis al registrarse (primeros 3 trabajos sin costo).  
Acciones principales: Ver órdenes disponibles, aceptar orden, chatear, marcar completado, gestionar wallet.

###### *3.3 Administrador (Yeizon / Owner)Perfil: Dueño de la plataforma. Tiene acceso total al panel de control.Acciones principales: Aprobar/rechazar recargas de créditos, suspender usuarios, ver órdenes y métricas.*

Monetización: Gana $1.20 por cada servicio conectado (cobrado por adelantado via créditos prepago).

###### *4\. MVP v1.0 — ALCANCE Y SCOPERE*

###### *REGLA: Todo lo que no esté en esta lista NO entra en la v1.0. Si surge una idea nueva, va al Roadmap Fase 2 o 3\.*

###### *4.1 Flujo Cliente (v1.0)\[ \] Registro/login simple (email \+ contraseña via Supabase Auth)\[ \] Home con grid de categorías (solo 3 al inicio: Enfermería, Plomería, Electricidad)*

\[ \] Formulario Crear Orden de Servicio (categoría, título, descripción, ciudad/zona, urgencia)  
\[ \] Pantalla de confirmación post-publicación  
\[ \] Listado de órdenes propias (tabs: Activas / En Proceso / Completadas)  
\[ \] Detalle de orden con info del profesional asignado  
\[ \] Chat interno por orden (simple, sin archivos en v1.0)  
\[ \] Marcar orden como completada  
\[ \] Pantalla de calificación post-servicio (1-5 estrellas \+ comentario)

###### *4.2 Flujo Profesional (v1.0)\[ \] Registro/Onboarding (nombre, especialidad, ciudad, descripción, años de experiencia)\[ \] Pantalla de bienvenida con 3 créditos regalados*

\[ \] Dashboard: saldo de créditos, trabajos completados, calificación promedio  
\[ \] Listado de órdenes disponibles (filtradas por su categoría)  
\[ \] Detalle de orden \+ botón Aceptar (descuenta 1 crédito \+ confirmación visual)  
\[ \] Chat interno por orden  
\[ \] Marcar orden como completada  
\[ \] Historial de trabajos \+ reputación (estrellas \+ reseñas)  
\[ \] Wallet: ver saldo, paquetes de créditos, flujo de recarga (upload de captura)

###### *4.3 Flujo Admin (v1.0)\[ \] Dashboard: KPIs (ordenes hoy, profesionales activos, créditos vendidos)\[ \] Gestión de recargas: tabla pendientes, ver captura, Aprobar / Rechazar*

\[ \] Gestión de órdenes: tabla con estado, cliente, profesional, categoría  
\[ \] Gestión de usuarios: listado con estado activo/suspendido, acción suspender

###### *4.4 Fuera del Scope v1.0 (NO tocar)- Notificaciones push / email- Geolocalización y mapas*

\- Chat con archivos/fotos  
\- Pasarela de pago integrada  
\- App nativa (iOS/Android)  
\- Sistema de cupones/descuentos  
\- Multi-idioma  
\- Reportes avanzados / analytics

###### *5\. FLUJO DE TRABAJO COMPLETO*

###### *Paso 1 — SOLICITUD: Cliente elige categoría y publica una Orden de Servicio con título, descripción, zona y urgencia.Paso 2 — MATCH: Los profesionales de esa categoría ven la orden en su listado de disponibles.*

Paso 3 — ACEPTACIÓN Y COBRO: El profesional presiona Aceptar Orden. El sistema descuenta 1 crédito ($1.20) de su wallet instantáneamente. La orden pasa a estado en\_proceso.  
Paso 4 — COMUNICACIÓN: Se habilita el chat interno. Cliente y profesional acuerdan detalles (hora, dirección, precio final). El sistema muestra aviso anti-puenteo si se detectan números de teléfono en el chat.  
Paso 5 — EJECUCIÓN Y PAGO DIRECTO: El profesional realiza el servicio. El cliente paga 100% directo al profesional (efectivo, Pago Móvil, Zelle, USD). La app NO toca ese dinero.  
Paso 6 — CIERRE Y REPUTACIÓN: La orden se marca como completada. Cliente califica profesional (1-5 estrellas \+ reseña). Profesional califica cliente. Ambas calificaciones son permanentes e inapelables.

5.7 FLUJO ADMINISTRADOR (Paralelo al sistema)  
El Administrador (Yeizon) opera en /admin con acceso protegido por rol.  
Accion A — REVISION DE RECARGAS: Recibe alerta cuando un profesional sube comprobante de recarga. Revisa captura, verifica monto, Aprueba o Rechaza desde /admin/recargas.  
Accion B — MONITOREO DE ORDENES: Puede ver todas las ordenes del sistema con filtros por estado, categoria, ciudad. Interviene solo si hay disputa reportada.  
Accion C — GESTION DE USUARIOS: Puede suspender/reactivar cuentas de clientes o profesionales desde /admin/usuarios. La suspension es reversible.  
Accion D — MODERACION: Puede eliminar resenas fraudulentas y verificar profesionales con badge de confianza desde /admin/profesionales.  
ACCESO: Ruta /admin solo accesible si usuario tiene rol \= administrador en tabla usuarios. Verificado por RouteGuard en middleware.

###### *6\. MODELO DE DOMINIO Y ENTIDADESNOTA: Estos son los nombres exactos que se usarán en Supabase, hooks y componentes. NO traducir ni cambiar convenciones.*

###### *Tabla: usuariosid (uuid, PK) | email (text, unique) | nombre (text) | rol (enum: cliente, profesional, admin) | avatar\_url (text, nullable) | ciudad (text, nullable) | estado (enum: activo, suspendido) | createdat (timestamptz)*

###### *Tabla: profesionalesid (uuid, PK) | usuarioid (uuid, FK usuarios) | especialidad (text) | descripcion (text) | anyosexperiencia (int) | ciudad (text) | calificacionpromedio (numeric, default 0\) | totaltrabajos (int, default 0\) | createdat (timestamptz)*

###### *Tabla: categoriasid (uuid, PK) | nombre (text, unique) | slug (text, unique) | icono (text) | activo (bool, default true)*

###### *Tabla: ordenesid (uuid, PK) | clienteid (uuid, FK usuarios) | profesionalid (uuid, FK usuarios, nullable) | categoriaid (uuid, FK categorias) | titulo (text) | descripcion (text) | ciudad (text) | zona (text) | urgencia (enum: hoy, esta\_semana) | estado (enum: pendiente, en\_proceso, completada, cancelada) | createdat (timestamptz) | updatedat (timestamptz)*

###### *Tabla: walletid (uuid, PK) | profesionalid (uuid, FK usuarios, unique) | saldo (int, default 0\) | totalcargado (int, default 0\) | totalusado (int, default 0\) | updatedat (timestamptz)*

###### *Tabla: recargasid (uuid, PK) | profesionalid (uuid, FK usuarios) | paquete (int: cantidad de créditos) | montousd (numeric) | metodopago (enum: pagomovil, zelle, usdt) | referencia (text) | captura\_url (text) | estado (enum: pendiente, aprobada, rechazada) | createdat (timestamptz) | aprobadoat (timestamptz, nullable)*

###### *Tabla: calificacionesid (uuid, PK) | ordenid (uuid, FK ordenes) | calificadorpor (uuid, FK usuarios) | calificadoa (uuid, FK usuarios) | estrellas (int: 1-5) | comentario (text, nullable) | createdat (timestamptz)*

###### *Tabla: mensajesid (uuid, PK) | ordenid (uuid, FK ordenes) | autorid (uuid, FK usuarios) | contenido (text) | tipo (enum: texto, sistema) | createdat (timestamptz)*

###### *7\. ARQUITECTURA Y STACK TÉCNICO7.1 Stack TecnológicoFrontend: Next.js 14+ (App Router) | React 18+ | TypeScript (modo estricto)Estilos: Tailwind CSS | Componentes: Lucide React (iconos) | shadcn/ui (base de componentes)*

Backend/BaaS: Supabase (Auth, PostgreSQL, Storage, Realtime)  
Estado global: Zustand (solo para estado UI global) | React Query / SWR para server state  
PWA: next-pwa o configuración manual de service worker  
Deploy: Vercel (frontend) | Supabase Cloud (backend)  
Testing: Vitest (unit) | Playwright (e2e)

###### *7.2 Rutas Principales/ — Landing / Bienvenida (selección de perfil o login)/auth/login — Login unificado*

/auth/registro — Registro con selección de rol  
/cliente — Home cliente (categorías)  
/cliente/ordenes — Listado de órdenes del cliente  
/cliente/ordenes/nueva — Crear orden de servicio  
/cliente/ordenes/\[id\] — Detalle de orden \+ chat  
/profesional — Dashboard profesional  
/profesional/ordenes — Listado de órdenes disponibles  
/profesional/ordenes/\[id\] — Detalle de orden \+ aceptar \+ chat  
/profesional/wallet — Saldo, paquetes, historial de recargas  
/profesional/reputacion — Historial de trabajos y reseñas  
/admin — Dashboard administrador  
/admin/recargas — Aprobar/rechazar recargas  
/admin/ordenes — Listado global de órdenes  
/admin/usuarios — Gestión de usuarios

###### *7.3 Capas del SistemaCapa 1 — UI/Pages: Componentes de página (Next.js App Router). Solo renderizan, no tienen lógica de negocio.Capa 2 — Features: Módulos funcionales (ordenes, wallet, chat, auth). Cada uno tiene sus hooks, tipos y llamadas API.*

Capa 3 — Data Hooks: Hooks tipo useOrdenes(), useWallet(), useMensajes(). Única fuente de verdad para llamadas a Supabase.  
Capa 4 — Supabase Client: lib/supabase.ts — instancia única del cliente. Nunca instanciar Supabase directamente en componentes.

###### *8\. ESTRUCTURA DE CARPETAS Y MÓDULOSconectapro/├── src/*

│   ├── app/                        \# Next.js App Router  
│   │   ├── (auth)/                 \# Grupo: rutas de autenticación  
│   │   ├── (cliente)/              \# Grupo: rutas del cliente  
│   │   ├── (profesional)/          \# Grupo: rutas del profesional  
│   │   ├── (admin)/                \# Grupo: rutas del admin  
│   │   └── layout.tsx              \# Layout raíz  
│   ├── features/                   \# Módulos funcionales independientes  
│   │   ├── auth/                   \# Login, registro, sesión  
│   │   ├── ordenes/                \# Crear, listar, aceptar, completar órdenes  
│   │   ├── chat/                   \# Chat interno por orden  
│   │   ├── wallet/                 \# Créditos, recargas, saldo  
│   │   ├── profesionales/          \# Perfil, reputación, calificaciones  
│   │   └── admin/                  \# Gestión de recargas, órdenes, usuarios  
│   ├── components/                 \# Componentes UI reutilizables  
│   │   ├── ui/                     \# Componentes base (Button, Modal, Badge, etc.)  
│   │   └── shared/                 \# Componentes compartidos (Navbar, Layout, etc.)  
│   ├── lib/                        \# Utilidades y clientes  
│   │   ├── supabase.ts             \# Cliente único de Supabase  
│   │   ├── utils.ts                \# Helpers generales  
│   │   └── constants.ts            \# Constantes del proyecto (CREDITO\_USD, etc.)  
│   ├── types/                      \# Tipos TypeScript globales  
│   │   ├── supabase.ts             \# Tipos generados por Supabase CLI  
│   │   └── index.ts                \# Tipos de dominio del proyecto  
│   └── hooks/                      \# Hooks globales (useAuth, useToast, etc.)  
├── docs/                           \# Documentación del proyecto  
│   ├── [arquitectura.md](http://arquitectura.md)  
│   ├── [mvp-v1.md](http://mvp-v1.md)  
│   ├── [manifiesto.md](http://manifiesto.md)  
│   └── bitacora.md                 \# Registro de cambios, bugs y lecciones  
├── supabase/                       \# Migraciones y schema SQL  
│   └── migrations/  
├── public/                         \# Assets estáticos, icons, manifest.json  
├── .env.local                      \# Variables de entorno (nunca en git)  
├── .eslintrc.json  
├── .prettierrc  
├── tsconfig.json                   \# TypeScript strict: true  
└── [README.md](http://README.md)

###### *Patrón de un Feature Módulo (ejemplo: features/ordenes/)components/        \# Componentes visuales de este feature (OrdenCard, OrdenForm, etc.)hooks/             \# useOrdenes.ts, [useOrdenDetalle.ts](http://useOrdenDetalle.ts)*

api.ts             \# Funciones que llaman a Supabase (createOrden, getOrdenes, etc.)  
types.ts           \# Tipos específicos del feature (Orden, OrdenEstado, etc.)  
index.ts           \# Barrel export del feature

###### *9\. CONVENCIONES Y REGLAS DE CÓDIGO*

###### *9.1 NamingComponentes: PascalCase (OrdenCard, WalletBalance)Hooks: camelCase con prefijo use (useOrdenes, useWallet)*

Funciones API: camelCase con verbo (getOrdenes, createOrden, aceptarOrden)  
Tipos/Interfaces: PascalCase (Orden, Usuario, Recarga)  
Archivos: kebab-case (orden-card.tsx, [use-ordenes.ts](http://use-ordenes.ts))  
Campos de BD/Supabase: lowercase sin guiones (clienteid, createdat, montousd) — NUNCA snake\_case con guión

###### *9.2 Reglas criticasREGLA*

###### *: Nunca instanciar supabase fuera de lib/supabase.tsREGLA: Nunca poner lógica de negocio en componentes de página (app/). Va en features/*

REGLA: Todo valor derivado de props/estado usa useMemo o cálculo directo. Nunca useState  
REGLA: Nunca usar window.alert, window.confirm ni window.prompt  
REGLA: Todo listener/suscripción de Supabase Realtime tiene cleanup obligatorio  
REGLA: Ningún archivo supera 600 líneas. Si lo hace, refactorizar en subcomponentes  
REGLA: El toast de éxito solo se muestra si la respuesta trae id o dato real de persistencia  
REGLA: Los errores reales de Supabase siempre se leen del cuerpo y se muestran al desarrollador

9.3 Patron de Manejo de Errores (try/catch obligatorio en todas las funciones [api.ts](http://api.ts))  
Patron estandar para TODAS las funciones en src/features/\*/api.ts:  
export async function nombreFuncion(params): Promise\<TipoRetorno | null\> {  
  try {  
    const { data, error } \= await supabase.from('tabla').select('\*')  
    if (error) throw error  
    return data  
  } catch (error) {  
    console.error('\[nombreFuncion\]', error)  
    toast.error('Mensaje descriptivo para el usuario')  
    return null  
  }  
}  
REGLA: Nunca propagar errores silenciosos. Si retorna null, el componente debe manejarlo con estado de error visible.  
REGLA: El toast.error() siempre usa el mensaje del error de Supabase: (error as Error).message

9.4 Variables de Entorno requeridas (.env.local)  
\# Supabase \- OBLIGATORIAS  
NEXT\_PUBLIC\_SUPABASE\_URL=https://\[tu-proyecto\].supabase.co  
NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY=\[clave-publica-anon\]  
SUPABASE\_SERVICE\_ROLE\_KEY=\[clave-privada-service-role\]

\# App  
NEXT\_PUBLIC\_APP\_URL=http://localhost:3000  
NEXT\_PUBLIC\_APP\_NAME=ConectaPro

NOTA: NUNCA exponer SUPABASE\_SERVICE\_ROLE\_KEY en el cliente. Solo usar en server-side (API routes / server actions).  
NOTA: El Prompt 1 (Setup) generara el .env.local.example con estas variables. Copiar y completar con valores reales de Supabase \> Settings \> API.

###### *9.3 Constantes clave del proyectoCREDITO\_USD \= 1.20                  // Valor en dólares de 1 créditoCREDITOS\_BIENVENIDA \= 3             // Créditos gratis al registrarse como profesional*

PAQUETES\_CREDITOS \= \[10, 20, 50\]    // Paquetes disponibles (en créditos)  
CATEGORIAS\_MVP \= \['enfermeria', 'plomeria', 'electricidad'\]  // Solo estas 3 en v1.0

###### *10\. ROADMAP POR FASESFase 1 — MVP Demo (Semanas 1-3) | Primer pago $600- Setup: repo, tooling, Supabase, estructura base, auth- Flujo completo cliente: crear orden, ver profesional asignado, chat, calificar*

\- Flujo completo profesional: dashboard, ver órdenes, aceptar (descuenta crédito), chat, completar  
\- Flujo wallet: recarga con upload de captura, estado pendiente  
\- Panel admin: ver recargas, aprobar/rechazar, ver órdenes y usuarios  
\- Demo navegable (puede ser con datos seed/mock, pero sobre el esqueleto real)

CRITERIOS DE SALIDA FASE 1 (antes de cobrar el primer pago):  
\[ \] Flujo completo cliente funciona de extremo a extremo (sin errores en consola)  
\[ \] Flujo completo profesional funciona (aceptar orden descuenta credito real)  
\[ \] Panel admin puede aprobar recarga y los creditos se acreditan en wallet  
\[ \] Chat entre cliente y profesional en orden activa funciona en tiempo real  
\[ \] App es instalable como PWA en Android (manifest \+ service worker verificados)  
\[ \] 0 errores criticos abiertos en bitacora.md  
\[ \] Deploy en Vercel funcional con dominio provisional

###### *Fase 2 — Producto Pulido (Semanas 4-5) | Segundo pago $450- RLS (Row Level Security) de Supabase configurado por rol- Lógica de créditos real con transacciones atómicas*

\- Chat en tiempo real con Supabase Realtime  
\- Filtro anti-puenteo en mensajes (detectar teléfonos y mostrar aviso)  
\- Reputación y ranking real (calificación promedio \+ posición en listado)  
\- Storage de Supabase para capturas de recargas

###### *Fase 3 — Lanzamiento (Semana 6\) | Tercer pago $450- PWA completa (manifest, service worker, installable)- Testing en dispositivos reales (Android gama media)*

\- Seed de datos beta (3-5 profesionales reales por categoría)  
\- Deploy a producción (Vercel \+ Supabase Cloud)  
\- Documentación final actualizada

###### *11\. PROMPTS BASE PARA ANTIGRAVITYINSTRUCCIONES DE USO: Copia el prompt correspondiente, pégalo en Antigravity al inicio de cada sesión o tarea. Siempre incluye el CONTEXTO BASE \+ el PROMPT ESPECÍFICO de la tarea.*

###### *PROMPT 0 — CONTEXTO BASE (usar SIEMPRE al inicio de cada sesión)Eres un experto en React, Next.js 14, TypeScript estricto y Supabase. Trabajamos en un proyecto llamado ConectaPro: una PWA marketplace de servicios profesionales para Venezuela (tipo Uber/Workana). Tiene 3 roles: cliente, profesional y admin.*

\[STACK\]

Stack: Next.js 14 App Router | TypeScript strict | Tailwind CSS | shadcn/ui | Supabase (Auth, DB, Storage, Realtime) | Zustand | Lucide React

Estructura de rutas: /(auth) /(cliente) /(profesional) /(admin) con grupos de rutas Next.jsEstructura de features: src/features/\[nombre\]/{components, hooks, api.ts, types.ts, [index.ts](http://index.ts)}

\[BD-NAMING\]

Nombres de campos en Supabase (EXACTOS, nunca cambiar): clienteid, profesionalid, categoriaid, ordenid, usuarioid, createdat, updatedat, montousd, calificacionpromedio, totaltrabajos, metodopago, captura\_url, aprobadoat

\[REGLAS\]

Reglas criticas: 1\) Nunca instanciar Supabase fuera de lib/supabase.ts. 2\) Lógica de negocio solo en features/, nunca en app/. 3\) Valores derivados con useMemo, nunca useState. 4\) Nunca window.alert/confirm/prompt. 5\) Todo listener Realtime tiene cleanup. 6\) Toast de éxito solo si response trae id real. 7\) Archivos máx 600 líneas.

\[CONSTANTES\]

Constantes clave: CREDITO\_USD=1.20 | CREDITOS\_BIENVENIDA=3 | CATEGORIAS\_MVP=\['enfermeria','plomeria','electricidad'\]  
REPO\_URL \= https://github.com/luiggiberaldi/CONECTAPRO

###### *PROMPT 1 — Setup inicial del proyecto\[CONTEXTO BASE arriba\]*

TAREA: Crea el setup inicial del proyecto ConectaPro desde cero. Necesito:  
1\. Inicializar Next.js 14 con App Router, TypeScript strict, Tailwind CSS y ESLint.  
2\. Crear la estructura exacta de carpetas: src/app/(auth) src/app/(cliente) src/app/(profesional) src/app/(admin) src/features/ src/components/ui src/components/shared src/lib/ src/types/ src/hooks/ docs/ supabase/migrations/  
3\. Configurar src/lib/supabase.ts con cliente de Supabase (browser y server).  
4\. Crear src/lib/constants.ts con CREDITO\_USD, CREDITOS\_BIENVENIDA, CATEGORIAS\_MVP.  
5\. Crear src/types/index.ts con los tipos: Usuario, Profesional, Orden, Wallet, Recarga, Calificacion, Mensaje, Categoria.  
6\. Crear .env.local.example con NEXT\_PUBLIC\_SUPABASE\_URL y NEXT\_PUBLIC\_SUPABASE\_ANON\_KEY.  
7\. Crear README.md con descripción del proyecto, stack, estructura y cómo levantar en local.  
8\. Crear docs/bitacora.md con la primera entrada (arch): 'Setup inicial del proyecto ConectaPro'.  
No escribas lógica de negocio todavía. Solo el esqueleto limpio y documentado.

###### *PROMPT 2 — Schema SQL de Supabase (Fase 1)SKILL ACTIVO: gemini-skill-maestro | MODO: Implementación | thinking\_level: high*

\[CONTEXTO BASE del Prompt 0\]

TAREA: Crea las migraciones SQL para Supabase del proyecto ConectaPro. Genera un archivo por tabla en supabase/migrations/. El orden de creación debe respetar las FK.

Tablas a crear en este orden:  
1\. categorias (id uuid PK, nombre text unique, slug text unique, icono text, activo bool default true)  
2\. usuarios (id uuid PK references auth.users, email text unique, nombre text, rol text check in (cliente,profesional,admin), avatar\_url text, ciudad text, estado text default activo, createdat timestamptz default now())  
3\. profesionales (id uuid PK, usuarioid uuid FK usuarios, especialidad text, descripcion text, anyosexperiencia int, ciudad text, calificacionpromedio numeric default 0, totaltrabajos int default 0, createdat timestamptz default now())  
4\. ordenes (id uuid PK, clienteid uuid FK usuarios, profesionalid uuid FK usuarios nullable, categoriaid uuid FK categorias, titulo text, descripcion text, ciudad text, zona text, urgencia text check in (hoy,esta\_semana), estado text default pendiente check in (pendiente,en\_proceso,completada,cancelada), createdat timestamptz default now(), updatedat timestamptz default now())  
5\. wallet (id uuid PK, profesionalid uuid FK usuarios unique, saldo int default 0, totalcargado int default 0, totalusado int default 0, updatedat timestamptz default now())  
6\. recargas (id uuid PK, profesionalid uuid FK usuarios, paquete int, montousd numeric, metodopago text check in (pagomovil,zelle,usdt), referencia text, captura\_url text, estado text default pendiente check in (pendiente,aprobada,rechazada), createdat timestamptz default now(), aprobadoat timestamptz)  
7\. calificaciones (id uuid PK, ordenid uuid FK ordenes, calificadorpor uuid FK usuarios, calificadoa uuid FK usuarios, estrellas int check between 1 and 5, comentario text, createdat timestamptz default now())  
8\. mensajes (id uuid PK, ordenid uuid FK ordenes, autorid uuid FK usuarios, contenido text, tipo text default texto check in (texto,sistema), createdat timestamptz default now())

Adicionalmente: Crea un trigger que al insertar en auth.users cree automaticamente un registro en la tabla usuarios. Crea RLS basico: cada usuario solo ve sus propios datos. Registra la decision en docs/bitacora.md como arch.  
Valida: render \-\> interaccion \-\> request \-\> persistencia antes de cerrar la tarea.

###### *PROMPT 3 — Feature: Auth (Login, Registro, Protección de rutas)SKILL ACTIVO: gemini-skill-maestro | MODO: Implementación | thinking\_level: high*

\[CONTEXTO BASE del Prompt 0\]  
TAREA: Implementa el feature de autenticacion completo en src/features/auth/.

Entregables:  
1\. src/features/auth/api.ts: funciones loginConEmail(email,password), registrarUsuario(email,password,nombre,rol), cerrarSesion(), obtenerSesionActual(). Todas llaman SOLO a lib/[supabase.ts](http://supabase.ts).  
2\. src/features/auth/hooks/useAuth.ts: hook que expone { usuario, rol, loading, login, registro, logout }. El rol se lee del campo rol de la tabla usuarios.  
3\. src/features/auth/types.ts: tipos AuthUser, AuthRole (cliente | profesional | admin), LoginPayload, RegistroPayload.  
4\. src/components/shared/RouteGuard.tsx: componente que protege rutas segun rol. Si el usuario no tiene el rol correcto, redirige a /auth/login.  
5\. src/app/(auth)/login/page.tsx: pagina de login con formulario (email \+ password). Usa useAuth. Mobile-first, sin window.alert, errores visibles en UI.  
6\. src/app/(auth)/registro/page.tsx: pagina de registro con seleccion de rol (cliente / profesional). Si es profesional, mostrar campos extra: especialidad, ciudad, descripcion. Al registrarse como profesional, crear registro en tabla profesionales y wallet con saldo=CREDITOS\_BIENVENIDA.

Reglas obligatorias del skill maestro a verificar antes de cerrar:  
\- Supabase solo en lib/[supabase.ts](http://supabase.ts)  
\- Errores reales de Supabase mostrados en UI (no mensajes genericos)  
\- Ningun window.alert/confirm/prompt  
\- Responsive mobile-first  
\- Registrar en bitacora.md: arch \- 'Implementacion feature auth con RouteGuard por rol'  
\- Validar flujo: render \-\> interaccion \-\> request \-\> persistencia

###### *PROMPT 4 — Feature: Órdenes (Flujo completo cliente \+ profesional)SKILL ACTIVO: gemini-skill-maestro | MODO: Implementación | thinking\_level: high*

\[CONTEXTO BASE del Prompt 0\]

TAREA: Implementa el feature de ordenes completo. Este es el nucleo del negocio.

Entregables:  
1\. src/features/ordenes/api.ts: crearOrden(payload), getOrdenesCliente(clienteid), getOrdenesProfesional(categoriaid), getOrdenDetalle(id), aceptarOrden(ordenid, profesionalid) \- esta funcion debe: cambiar estado a en\_proceso, asignar profesionalid, descontar 1 credito del wallet en una transaccion atomica. marcarOrdenCompletada(ordenid).  
2\. src/features/ordenes/hooks/useOrdenes.ts y useOrdenDetalle.ts3. src/features/ordenes/types.ts: tipos Orden, OrdenEstado, CrearOrdenPayload, AceptarOrdenPayload  
4\. src/features/ordenes/components/OrdenCard.tsx: tarjeta de orden con estado visual (badge de color segun estado), categoria, titulo, fecha.  
5\. src/features/ordenes/components/CrearOrdenForm.tsx: formulario con campos: titulo, descripcion, ciudad, zona, urgencia (hoy/esta\_semana). Validacion client-side antes de enviar.  
6\. src/features/ordenes/components/AceptarOrdenButton.tsx: boton que muestra saldo actual y costo (1 credito \= $1.20). Si saldo \< 1 muestra modal de recarga. Si saldo \>= 1 muestra ConfirmModal antes de descontar.  
7\. Paginas: /cliente/ordenes/page.tsx (listado con tabs), /cliente/ordenes/nueva/page.tsx, /cliente/ordenes/\[id\]/page.tsx  
8\. Paginas: /profesional/ordenes/page.tsx (listado disponibles), /profesional/ordenes/\[id\]/page.tsx (detalle \+ aceptar)

Registrar en bitacora.md: arch \- 'Feature ordenes con aceptacion atomica credito \+ estado'.Validar flujo completo: render \-\> interaccion \-\> request \-\> persistencia en cada pantalla.

###### *PROMPT 5 — Feature: Chat Interno Anti-PuenteoSKILL ACTIVO: gemini-skill-maestro | MODO: Implementación | thinking\_level: medium*

\[CONTEXTO BASE del Prompt 0\]

TAREA: Implementa el chat interno por orden. Solo se habilita cuando la orden esta en estado en\_proceso.

Entregables:

2\. src/features/chat/hooks/useChat.ts: expone { mensajes, loading, enviar, suscribirse }. La suscripcion Supabase Realtime DEBE tener return con unsubscribe en useEffect.  
3\. src/features/chat/utils/antipuenteo.ts: funcion detectarTelefono(texto: string): boolean que detecta patrones venezolanos (04XX-XXXXXXX, \+58XXXXXXXXXX, 04XXXXXXXXXX). Si detecta telefono, NO bloquear el envio pero mostrar banner de aviso: 'Recuerda que los datos de contacto se comparten automaticamente al confirmar el servicio. Usar la app protege tu reputacion.'.  
4\. src/features/chat/components/ChatWindow.tsx: componente de chat con burbujas (estilo WhatsApp), input de texto, boton enviar. Muestra banner anti-puenteo si se detecta telefono. Scroll automatico al ultimo mensaje.  
REGLA CRITICA del skill maestro: Todo listener de Supabase Realtime tiene cleanup. El useEffect de suscripcion debe retornar la funcion de unsubscribe. Nunca duplicar canales.  
Registrar en bitacora.md: arch \- 'Feature chat con Realtime y deteccion anti-puenteo'.  
Validar flujo: render \-\> envio \-\> recepcion realtime \-\> estado sincronizado.

###### *PROMPT 6 — Feature: Wallet, Créditos y RecargasSKILL ACTIVO: gemini-skill-maestro | MODO: Implementación | thinking\_level: high*

\[CONTEXTO BASE del Prompt 0\]

TAREA: Implementa el feature wallet completo para el profesional.

Entregables:  
1\. src/features/wallet/api.ts: getWallet(profesionalid), getHistorialRecargas(profesionalid), solicitarRecarga(profesionalid, paquete, metodopago, referencia, capturaFile). La funcion solicitarRecarga debe: subir la imagen a Supabase Storage en bucket 'recargas', obtener la URL publica, insertar en tabla recargas con estado=pendiente.  
2\. src/features/wallet/hooks/useWallet.ts: expone { saldo, loading, historial, solicitarRecarga }.  
3\. src/features/wallet/components/WalletBalance.tsx: muestra saldo grande con icono, total usado, total cargado.  
4\. src/features/wallet/components/PaquetesGrid.tsx: grid de tarjetas con paquetes (10, 20, 50 creditos). Cada tarjeta muestra creditos, precio en USD y boton Recargar.  
5\. src/features/wallet/components/RecargaForm.tsx: formulario de recarga con: selector de metodo (Pago Movil / Zelle / USDT), campo referencia, upload de captura (imagen). Muestra instrucciones de pago segun metodo seleccionado. Estado pendiente visible tras envio.  
6\. src/features/wallet/components/HistorialRecargas.tsx: lista paginada de recargas con estado (badge: pendiente=amarillo, aprobada=verde, rechazada=rojo).  
7\. Pagina: /profesional/wallet/page.tsx integrando todos los componentes anteriores.

REGLA CRITICA del skill maestro: El toast de exito en solicitarRecarga solo se muestra si el insert retorna un id real. Nunca mostrar exito si la respuesta no trae id. Errores de Storage o DB visibles en UI.  
Registrar en bitacora.md: arch \- 'Feature wallet con upload de captura a Supabase Storage'.  
Validar flujo: render \-\> seleccion paquete \-\> upload captura \-\> insert recarga \-\> estado pendiente visible.

###### *PROMPT 7 — Feature: Panel Admin (Dashboard, Recargas, Órdenes, Usuarios)SKILL ACTIVO: gemini-skill-maestro | MODO: Implementación | thinking\_level: high*

\[CONTEXTO BASE del Prompt 0\]

TAREA: Implementa el panel de administracion completo en src/features/admin/ y rutas /admin/\*.

Entregables:  
1\. src/features/admin/api.ts: getKPIs() \[total ordenes hoy, profesionales activos, creditos vendidos\], getRecargasPendientes(), aprobarRecarga(id) \[actualiza estado=aprobada, aprobadoat=now(), suma creditos al wallet del profesional\], rechazarRecarga(id), getTodasOrdenes(filtros), suspenderUsuario(id), activarUsuario(id).  
2\. src/features/admin/components/KPICard.tsx: tarjeta de metrica con titulo, valor grande, icono Lucide.  
3\. src/features/admin/components/RecargasTable.tsx: tabla paginada con columnas: profesional, paquete, monto, metodo, estado, fecha, acciones (Ver captura / Aprobar / Rechazar). Ver captura abre modal con imagen en grande.  
4\. src/features/admin/components/OrdenesTable.tsx: tabla paginada con filtros de estado y categoria.  
5\. src/features/admin/components/UsuariosTable.tsx: tabla con nombre, rol, estado (activo/suspendido), calificacion promedio. Accion: suspender/activar con ConfirmModal (sin window.confirm).  
6\. Paginas: /admin/page.tsx (dashboard KPIs), /admin/recargas/page.tsx, /admin/ordenes/page.tsx, /admin/usuarios/page.tsx.

REGLA CRITICA del skill maestro: La funcion aprobarRecarga es critica: debe sumar los creditos al wallet Y marcar la recarga como aprobada en una sola operacion. Si una falla, la otra no debe ejecutarse. Usar RPC o transaccion.  
Sin window.confirm en ninguna accion destructiva. Usar ConfirmModal propio.  
Paginacion obligatoria en las 3 tablas (minimo 10 filas por pagina).  
Registrar en bitacora.md: arch \- 'Panel admin con aprobacion atomica de recargas'.

###### *PROMPT 8 — Feature: Reputación y CalificacionesSKILL ACTIVO: gemini-skill-maestro | MODO: Implementación | thinking\_level: medium*

\[CONTEXTO BASE del Prompt 0\]

TAREA: Implementa el sistema de reputacion y calificaciones. Es el corazon de la retencion de profesionales.

Entregables:  
1\. src/features/profesionales/api.ts: calificarServicio(ordenid, calificadorpor, calificadoa, estrellas, comentario), getReputacionProfesional(profesionalid) \[retorna calificacionpromedio \+ totaltrabajos \+ listado de resenas\], getCalificacionCliente(clienteid).  
2\. Trigger en Supabase: al insertar en calificaciones, recalcular calificacionpromedio y totaltrabajos en tabla profesionales automaticamente.  
3\. src/features/profesionales/components/CalificacionForm.tsx: formulario post-servicio con estrellas interactivas (1-5) y campo comentario opcional. Solo visible si la orden esta en estado completada y el usuario aun no califico.  
4\. src/features/profesionales/components/ReputacionCard.tsx: muestra promedio de estrellas (visual con iconos), total de trabajos y badge de nivel (Nuevo / Confiable / Experto segun totaltrabajos: 0-5 / 6-20 / 21+).  
5\. src/features/profesionales/components/ResenasList.tsx: lista paginada de resenas con avatar del cliente, estrellas, comentario y fecha.  
6\. Pagina: /profesional/reputacion/page.tsx integrando ReputacionCard \+ ResenasList.  
7\. En el listado de ordenes disponibles (/profesional/ordenes), ordenar resultados por calificacionpromedio DESC para incentivar la reputacion.

REGLAS del skill maestro: Calificacion solo posible si orden=completada. No permitir doble calificacion por la misma orden. Reseñas son permanentes (no editar, no borrar desde UI). Registrar en bitacora.md: arch \- 'Sistema de reputacion con trigger automatico de recalculo'.

###### *PROMPT 9 — Troubleshooting / Bug (Modo Reparación Segura)SKILL ACTIVO: gemini-skill-maestro | MODO: Reparacion segura | thinking\_level: high*

\[CONTEXTO BASE del Prompt 0\]

REPORTO EL SIGUIENTE BUG / PROBLEMA:  
\[Describir aqui el error exacto, el mensaje de consola o el comportamiento inesperado\]  
\[Pegar aqui el stack trace o error de Supabase si existe\]  
\[Indicar en que pantalla o flujo ocurre: ej. 'al aceptar orden en /profesional/ordenes/\[id\]'\]

INSTRUCCION OBLIGATORIA AL MODELO:  
No arregles solo el primer error visible. Aplica el protocolo completo del gemini-skill-maestro:  
1\. Identifica la causa raiz, no solo el sintoma.  
2\. Lee TODOS los archivos involucrados antes de tocar algo.  
3\. Confirma nombres exactos de campos, props, hooks e imports antes de escribir codigo.  
4\. Aplica diff minimo: no refactorices nada fuera del bug.  
5\. Valida las 4 capas del flujo afectado: render \-\> interaccion \-\> request \-\> persistencia.  
6\. No cierres la tarea si solo compila. Cierra cuando el flujo completo funcione.  
7\. Al cerrar, registra en docs/bitacora.md: categoria bug \- causa raiz \- solucion aplicada \- validacion realizada.  
8\. Si el bug revela un patron nuevo no documentado, agrega una regla nueva al gemini-skill-maestro.

Entrega el resultado en formato:  
A) Causa raiz encontrada: …  
B) Cambio aplicado (diff minimo): …  
C) Validacion realizada (como probaste el flujo): …  
D) Riesgos o pendientes: …

###### *12\. RESUMEN DE USO — CÓMO TRABAJAR CON ESTE DOCUMENTOORDEN DE EJECUCION RECOMENDADO:*

Sesion 1: Prompt 1 (Setup) \+ Prompt 2 (Schema Supabase)  
Sesion 2: Prompt 3 (Auth \+ RouteGuard)  
Sesion 3: Prompt 4 (Ordenes \- flujo completo)  
Sesion 4: Prompt 5 (Chat Realtime) \+ Prompt 6 (Wallet)  
Sesion 5: Prompt 7 (Panel Admin)  
Sesion 6: Prompt 8 (Reputacion) \+ pulido final \+ deploy

ANTE CUALQUIER BUG: usar Prompt 9 (Troubleshooting).

REGLA DE ORO: Todo prompt de Antigravity SIEMPRE debe comenzar con:  
  SKILL ACTIVO: gemini-skill-maestro  
  MODO: \[Implementacion | Reparacion segura\]  
  thinking\_level: \[minimal | low | medium | high\]  
  \[CONTEXTO BASE del Prompt 0\]

Sin el skill activo y el contexto base, el modelo no tiene las reglas de ConectaPro cargadas y puede cometer errores de naming, arquitectura o deuda tecnica.  
PROTOCOLO ENTRE SESIONES (OBLIGATORIO al cerrar cada sesion de Antigravity):  
1\. Verificar que el flujo completo de la tarea funciona (render \-\> interaccion \-\> request \-\> persistencia)  
2\. Ejecutar en terminal: git add . && git commit \-m 'feat: \[descripcion breve\]'  
3\. Actualizar docs/bitacora.md con las decisiones de arquitectura y cualquier bug encontrado  
4\. Si hubo un nuevo patron no documentado, agregarlo al Prompt 0 como REGLA adicional  
5\. Push al repositorio: git push origin main

FORMATO DE COMMIT RECOMENDADO:  
feat: para nuevas funcionalidades  
fix: para correccion de bugs  
refactor: para mejoras de codigo sin cambio de comportamiento  
docs: para cambios en documentacion  
chore: para cambios de configuracion (tsconfig, eslint, etc.)

\--- Documento creado el 10 de junio de 2026 | ConectaPro v1.0 | GitHub: github.com/luiggiberaldi/CONECTAPRO \---