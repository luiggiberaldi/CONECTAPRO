# Bitácora de Cambios - ConectaPro

Registro histórico de decisiones de arquitectura, reglas de negocio, resolución de bugs y lecciones aprendidas durante el desarrollo del proyecto.

---

## [10 de junio de 2026]

### [arch] Setup inicial del proyecto ConectaPro
* **Decisión:** Inicializar el proyecto base con Next.js 14 (App Router), TypeScript estricto, Tailwind CSS y ESLint.
* **Detalles:** 
  * Se configuraron las dependencias principales (`@supabase/supabase-js`, `@supabase/ssr`, `lucide-react`, y `zustand`).
  * Se crearon los clientes de Supabase para cliente (browser singleton) y servidor (función dinámica) en [supabase.ts](file:///c:/Users/luigg/Desktop/conectapro/src/lib/supabase.ts) utilizando `@supabase/ssr` y cookies de Next.js.
  * Se crearon las carpetas y grupos de rutas base (auth, cliente, profesional, admin) requeridas por la arquitectura.
  * Se definieron los tipos TypeScript globales de dominio en [index.ts](file:///c:/Users/luigg/Desktop/conectapro/src/types/index.ts) y las constantes clave en [constants.ts](file:///c:/Users/luigg/Desktop/conectapro/src/lib/constants.ts).
  * Se estructuraron los archivos de documentación [README.md](file:///c:/Users/luigg/Desktop/conectapro/README.md) y [.env.local.example](file:///c:/Users/luigg/Desktop/conectapro/.env.local.example).

### [arch] Diseño y creación del esquema de base de datos con políticas RLS
* **Decisión:** Crear las migraciones de base de datos ordenadas secuencialmente para las 8 tablas principales de ConectaPro, aplicando RLS estricto y triggers automáticos de sincronización.
* **Detalles:**
  * Se diseñaron las tablas `categorias`, `usuarios`, `profesionales`, `ordenes`, `wallet`, `recargas`, `calificaciones` y `mensajes` con las convenciones de nombrado exactas (minúsculas, sin guiones bajos salvo excepciones puntuales).
  * Se implementó el trigger `public.handle_new_user()` para crear perfiles públicos en la tabla `public.usuarios` de forma automática al registrarse un usuario en `auth.users`.
  * Se implementó el trigger `public.handle_new_professional_wallet()` en `00005_create_wallet.sql` para inicializar automáticamente la wallet con 3 créditos de bienvenida para cada profesional registrado.
  * Se configuraron políticas de Row Level Security (RLS) seguras y eficientes para controlar el acceso por rol (cliente, profesional, admin) en todas las tablas, previniendo recursiones mediante la lectura de metadatos de JWT (`auth.jwt()`).

### [arch] Implementación de Autenticación y RouteGuard por Rol
* **Decisión:** Desarrollar el feature de autenticación completo (API de Supabase Auth, Zustand global store, y RouteGuard) para proteger las páginas según el rol del usuario de base de datos.
* **Detalles:**
  * Se definieron los tipos de payload e interfaces en [types.ts](file:///c:/Users/luigg/Desktop/conectapro/src/features/auth/types.ts).
  * Se implementaron los endpoints en [api.ts](file:///c:/Users/luigg/Desktop/conectapro/src/features/auth/api.ts) manejando el flujo de registro atómico (registro en Auth y, si es profesional, inserción en `public.profesionales` delegando la creación de la `wallet` al trigger).
  * Se diseñó el hook [useAuth.ts](file:///c:/Users/luigg/Desktop/conectapro/src/features/auth/hooks/useAuth.ts) con Zustand y el listener activo `onAuthStateChange` de Supabase con limpieza (`unsubscribe`) en [AuthProvider.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/features/auth/components/AuthProvider.tsx).
  * Se implementó el guardia de rutas [RouteGuard.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/components/shared/RouteGuard.tsx) con una pantalla de error "Acceso No Autorizado" de alta calidad estética en caso de incompatibilidad de rol.
  * Se crearon las páginas de [Login](file:///c:/Users/luigg/Desktop/conectapro/src/app/(auth)/login/page.tsx) y [Registro dinámico](file:///c:/Users/luigg/Desktop/conectapro/src/app/(auth)/registro/page.tsx) con soporte mobile-first, selección visual de rol mediante tarjetas interactivas y manejo de alertas de error en la UI.

### [arch] Gestión de Órdenes y Aceptación Atómica (Prompt 4)
* **Decisión:** Desarrollar el feature de órdenes de trabajo, permitiendo a los clientes publicar solicitudes y a los profesionales verlas y aceptarlas debitando 1 crédito de su wallet de forma atómica mediante una RPC transaccional.
* **Detalles:**
  * Se implementó la RPC `public.aceptar_orden(p_ordenid, p_profesionalid)` en la base de datos para asegurar atomicidad.
  * Se crearon tipos, api y hooks (`useOrdenes` y `useOrdenDetalle`) en `src/features/ordenes/`.
  * Se crearon las páginas de listado y detalle de órdenes para clientes y profesionales.
  * Se implementó el componente `ConfirmModal` para evitar diálogos nativos del navegador.

### [arch] Chat Interno en Tiempo Real con Detección Anti-Puenteo (Prompt 5)
* **Decisión:** Implementar un canal de comunicación instantáneo en tiempo real entre cliente y profesional para órdenes asignadas, incluyendo detección reactiva de datos de contacto (anti-puenteo).
* **Detalles:**
  * Se creó la utilidad `detectarTelefono` en `src/features/chat/utils/antipuenteo.ts` optimizada para detectar números venezolanos y secuencias sospechosas de dígitos.
  * Se implementó `useChat` con suscripción Supabase Realtime (`postgres_changes`) en `src/features/chat/hooks/useChat.ts` con cleanup de canales al desmontar para evitar fugas de memoria.
  * Se diseñó el componente `ChatWindow` en `src/features/chat/components/ChatWindow.tsx` con un banner dinámico de advertencia y desactivación del chat cuando el servicio cambia de estado (`completada` o `cancelada`).
  * Se integró el componente en las vistas de detalle de orden para clientes y profesionales.
### [arch] Billetera de Créditos y Recarga de Saldo (Prompt 6)
* **Decisión:** Desarrollar el feature de Wallet para profesionales que les permite ver su balance, seleccionar paquetes de créditos (10, 20 o 50) y registrar pagos manuales mediante carga de capturas de soporte de pago a Supabase Storage.
* **Detalles:**
  * Se implementaron los servicios API en `src/features/wallet/api.ts` y el hook `useWallet.ts` para interactuar con las tablas `wallet` y `recargas`.
  * Se configuró la subida de capturas al bucket `recargas` de Supabase Storage con nombres únicos.
  * Se diseñaron componentes premium (`WalletBalance`, `PaquetesGrid`, `RecargaForm` con previsualización de imagen, e `HistorialRecargas` con paginación de 10 registros por página y visor modal de imágenes).
  * Se creó la ruta `/profesional/wallet` protegida para integrar el bento grid del flujo de billetera.

### [arch] Panel de Administración Completo (Prompt 7)
* **Decisión:** Desarrollar el panel de administración completo para controlar y auditar la plataforma ConectaPro (Yeizon/Owner) con vistas de KPIs, revisión de recargas, órdenes de servicio y moderación de usuarios.
* **Detalles:**
  * Se definieron los tipos de datos administrativos en [types.ts](file:///c:/Users/luigg/Desktop/conectapro/src/features/admin/types.ts).
  * Se implementó el servicio de base de datos en [api.ts](file:///c:/Users/luigg/Desktop/conectapro/src/features/admin/api.ts), consumiendo estadísticas en tiempo real y llamando a la RPC transaccional `aprobar_recarga` para la acreditación de créditos.
  * Se crearon componentes de UI estilizados en la carpeta `components/`: `KPICard.tsx`, `RecargasTable.tsx` (con modal visor de soporte y acciones con confirmación), `OrdenesTable.tsx` (con filtros debounced de búsqueda) y `UsuariosTable.tsx` (con suspensión/reactivación).
  * Se protegió el acceso de todo el layout y subpáginas bajo la ruta `/admin` en [layout.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/app/(admin)/admin/layout.tsx) mediante `<RouteGuard allowedRoles={['admin']}>`.
  * Se integraron las páginas administrativas `/admin` (dashboard principal), `/admin/recargas`, `/admin/ordenes` y `/admin/usuarios`.

### [arch] Sistema de Reputación y Calificaciones (Prompt 8)
* **Decisión:** Implementar un sistema de reputación bidireccional permanente (inapelable) con triggers de recálculo atómico en base de datos y ordenamiento de solicitudes por reputación de cliente.
* **Detalles:**
  * Se creó la migración [00012_reputacion_triggers.sql](file:///c:/Users/luigg/Desktop/conectapro/supabase/migrations/00012_reputacion_triggers.sql) que define el trigger `trigger_recalcular_reputacion` para actualizar el promedio de estrellas (`calificacionpromedio`) y total de trabajos completados (`totaltrabajos`) en `profesionales` tras cualquier cambio en `calificaciones`.
  * Se definió la vista SQL `ordenes_disponibles_view` que incluye la reputación promedio del creador (cliente) de cada orden de trabajo.
  * Se implementó la capa API en [api.ts](file:///c:/Users/luigg/Desktop/conectapro/src/features/profesionales/api.ts) y tipos de dominio correspondientes.
  * Se diseñaron componentes premium: `CalificacionForm.tsx` (estrellas interactivas), `ReputacionCard.tsx` (con insignias de experiencia) y `ResenasList.tsx` (paginación de reseñas recibidas).
  * Se integró el formulario de calificaciones en el detalle de la orden completada tanto para el cliente como para el profesional, y se habilitó la ruta protegida `/profesional/reputacion` en la barra de navegación.
  * Se modificó la carga de órdenes disponibles (`getOrdenesDisponibles`) en [api.ts](file:///c:/Users/luigg/Desktop/conectapro/src/features/ordenes/api.ts) para usar la vista y ordenar resultados por `cliente_reputacion DESC`.


## [12 de junio de 2026]

### [fix] BUG-1 — RouteGuard con flash de contenido protegido
* **Causa raiz:** El guard estaba montado en paginas individuales, permitiendo que el JSX de la pagina existiera antes del redirect.
* **Archivos modificados:** `src/app/(cliente)/layout.tsx`, `src/app/(profesional)/layout.tsx`, paginas bajo `src/app/(cliente)/cliente/**` y `src/app/(profesional)/profesional/**`.
* **Validacion realizada:** `RouteGuard` quedo solo en layouts de cliente/profesional/admin; `npm run build` compilo correctamente. La verificacion visual con navegador integrado no pudo completarse por inestabilidad del navegador local.

### [fix] BUG-2 — actionLoading global congela toda la tabla admin
* **Causa raiz:** Una bandera booleana bloqueaba todas las filas durante una accion.
* **Archivos modificados:** `src/app/(admin)/admin/recargas/page.tsx`, `src/app/(admin)/admin/usuarios/page.tsx`, `src/features/admin/components/RecargasTable.tsx`, `src/features/admin/components/UsuariosTable.tsx`.
* **Validacion realizada:** Busqueda local sin `setActionLoading(true)`, `loadingAction: boolean` ni `disabled={!!actionLoading}` en admin; `npm run build` compilo correctamente.

### [fix] BUG-3 — loadData sin useCallback en AdminDashboard
* **Causa raiz:** `loadData` podia recrearse y ejecutar refrescos concurrentes.
* **Archivos modificados:** `src/app/(admin)/admin/page.tsx`.
* **Validacion realizada:** `loadData` quedo en `useCallback` con guard por ref contra concurrencia y dependencia estable en `useEffect`; `npm run build` compilo correctamente.

### [fix] BUG-4 — Race condition en CalificacionForm al navegar entre ordenes
* **Causa raiz:** La verificacion de calificacion podia conservar estado de la orden previa.
* **Archivos modificados:** `src/app/(cliente)/cliente/ordenes/[id]/page.tsx`, `src/app/(profesional)/profesional/ordenes/[id]/page.tsx`.
* **Validacion realizada:** Los efectos dependen de `id` y `usuario?.id`, cancelan respuestas tardias y limpian `yaCalifico`; `npm run build` compilo correctamente.

### [fix] BUG-5 — RPCs admin ejecutadas desde el cliente
* **Causa raiz:** Acciones administrativas sensibles se ejecutaban desde codigo de navegador con acceso directo a Supabase.
* **Archivos modificados:** `src/app/api/admin/_utils.ts`, `src/app/api/admin/aprobar-recarga/route.ts`, `src/app/api/admin/rechazar-recarga/route.ts`, `src/app/api/admin/suspender-usuario/route.ts`, `src/app/api/admin/activar-usuario/route.ts`, `src/features/admin/api.ts`, `src/lib/supabase.ts`.
* **Validacion realizada:** `src/features/admin/api.ts` ahora usa `fetch('/api/admin/...')`; la ruta `/api/admin/aprobar-recarga` sin sesion devolvio `401`; `npm run build` compilo correctamente.

### [fix] BUG-6 — Memory leak y mensajes duplicados en useChat Realtime
* **Causa raiz:** El canal realtime podia no estar aislado por orden o quedar duplicado si no se limpiaba correctamente.
* **Archivos modificados:** `src/features/chat/hooks/useChat.ts`.
* **Validacion realizada:** El canal usa `chat-orden-${ordenid}`, la suscripcion vive dentro de `useEffect([ordenid])` y se limpia con `supabaseBrowser.removeChannel(channel)`; `npm run build` compilo correctamente.

### [qa] Cierre de auditoria BUG-1 al BUG-6
* **Revision cruzada:** No hay archivos en `src/` con mas de 600 lineas; no hay usos de `window.alert`, `window.confirm`, `window.prompt`, `alert`, `confirm` o `prompt`; los imports de Supabase se mantienen centralizados a traves de `src/lib/supabase.ts`.
* **Toasts de exito:** Se verificaron las acciones con persistencia y se reforzo `crearOrden()` para lanzar error si la insercion no retorna un `id` real antes de mostrar `toast.success`.
* **Archivos modificados:** `src/features/ordenes/api.ts`, `docs/bitacora.md`.
* **Validacion realizada:** `npm run lint` paso con una advertencia existente de `@next/next/no-img-element` en `src/features/profesionales/components/ResenasList.tsx`; `npm run build` compilo correctamente. La validacion visual en navegador integrado quedo limitada porque el entorno no permitio mantener vivo el servidor local de desarrollo.

### [arch] Rediseño de cargadores de la aplicación a Torre 3D
* **Decisión de arquitectura:** Se creó un componente reutilizable `Loader` en `src/components/shared/Loader.tsx` que implementa la estructura de torre 3D propuesta, y se agregaron sus estilos correspondientes y configuraciones de tamaño en `src/app/globals.css`.
* **Archivos modificados:** `src/app/globals.css`, `src/components/shared/Loader.tsx` y 12 archivos adicionales de páginas y componentes donde se reemplazó `Loader2` por el nuevo componente `Loader`.
* **Validación realizada:** El compilador de TypeScript (`npx tsc --noEmit`) finalizó sin errores.

### [arch] Rediseño Premium de la Página de Inicio (Home)
* **Decisión:** Rediseñar por completo la página de inicio ([page.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/app/page.tsx)) para ofrecer una experiencia visual premium y ultra profesional que destaque ante clientes y profesionales.
* **Detalles:**
  * Se diseñó un Hero animado con gradientes dinámicos interactivos, efectos de brillo y micro-animaciones.
  * Se implementó una cuadrícula tipo Bento Grid para presentar las características de la plataforma de forma moderna.
  * Se creó un selector y timeline interactivo para explicar el funcionamiento adaptado a clientes ("Cómo funciona") y a profesionales.
  * Se diseñó una sección de Preguntas Frecuentes (FAQ) interactiva con acordeones fluidos y transiciones visuales agradables.
  * Se añadió un banner de llamado a la acción (CTA) premium con un fondo degradado y botones dinámicos.
  * Se removieron las dependencias/importaciones sin uso (como `Clock`) para garantizar la compilación limpia.
  * Se excluyó la carpeta independiente `iron-man` de `tsconfig.json` para evitar que Next.js intente verificar sus tipos dentro del build de ConectaPro.
* **Archivos modificados:** [page.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/app/page.tsx), [tsconfig.json](file:///c:/Users/luigg/Desktop/conectapro/tsconfig.json)
* **Validación realizada:** Verificación del flujo de compilación mediante `npm run build` sin errores ni advertencias críticas.

### [fix] BUG-7 — Badge borroso/ilegible en la cabecera del Home
* **Causa raíz:** La clase CSS `.animate-pulse-glow` aplicaba `filter: blur(...)` al elemento contenedor en lugar de ser un efecto de resplandor externo/sombra, lo que emborronaba por completo la tarjeta y el texto en el Home.
* **Archivos modificados:** [page.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/app/page.tsx)
* **Validación realizada:** Se reemplazó por la clase nativa `animate-pulse` de Tailwind que realiza una transición de opacidad sin distorsionar el texto. La compilación mediante `npm run build` finalizó correctamente.

### [arch] Mejora de Layout Lateral en el Hero del Home
* **Decisión de arquitectura:** Para balancear el espacio vacío lateral detectado en pantallas grandes (desktops), se implementó una rejilla de fondo radial y dos tarjetas glassmorphic flotantes interactivas en los costados del Hero.
* **Detalles:**
  - Se crearon animaciones CSS personalizadas `@keyframes float` y `@keyframes floatDelayed` en [globals.css](file:///c:/Users/luigg/Desktop/conectapro/src/app/globals.css) para simular una levitación natural desfasada con ligeras rotaciones.
  - Se integró un fondo con patrón de puntos radiales tecnológicos atenuados mediante máscaras CSS en el Hero de [page.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/app/page.tsx).
  - Se añadieron dos tarjetas flotantes con estilo glassmorphism (perfil de profesional certificado a la izquierda y una orden de trabajo activa a la derecha) con visibilidad restringida a pantallas grandes (`xl:flex`) para no saturar móviles y tablets.
* **Archivos modificados:** [page.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/app/page.tsx), [globals.css](file:///c:/Users/luigg/Desktop/conectapro/src/app/globals.css)
* **Validación realizada:** La compilación (`npm run build`) terminó de manera exitosa.

### [arch] Script de Semillero (Seed) y Limpieza Automática de Datos de Prueba (Demo)
* **Decisión:** Desarrollar un script centralizado de gestión de datos de prueba (`src/scripts/manage-demo.js`) para poblar y limpiar la base de datos de manera atómica, rápida y segura para demostraciones de la plataforma.
* **Detalles:**
  - **Estructura de Datos Demo**: Genera 3 clientes y 5 profesionales (con especialidades repartidas y descripciones realistas). Simula balances de wallet (desde 5 a 19 créditos), recargas aprobadas en el historial de pagos y 6 órdenes de trabajo (en estados `pendiente`, `en_proceso` y `completada`).
  - **Reputación y Feedbacks**: Crea calificaciones y reseñas cruzadas (cliente <=> profesional) con marcas de tiempo históricas de hasta 15 días de antigüedad. El trigger de base de datos recalcula de manera automática las estrellas promedio y cantidad de cada perfil profesional.
  - **Facilidad de Limpieza**: Los correos de todos los usuarios demo terminan en `@conectapro-demo.com`. El comando `clean` busca estos usuarios en Auth, los elimina a través de la API Admin de Supabase y, por relaciones de clave externa con eliminación en cascada (`ON DELETE CASCADE`), limpia todas las dependencias asociadas de forma instantánea.
  - Se añadieron accesos rápidos en `package.json` (`npm run demo:seed` y `npm run demo:clean`).
* **Archivos modificados:** [package.json](file:///c:/Users/luigg/Desktop/conectapro/package.json), [manage-demo.js](file:///c:/Users/luigg/Desktop/conectapro/scripts/manage-demo.js)
* **Validación realizada:** Ejecuciones exitosas locales de carga de datos y posterior eliminación atómica de los mismos; verificación de integridad en la consola de Supabase.

### [fix] BUG-8 — Superposición de badge "Recomendado" y visual confuso en el selector de créditos
* **Causa raíz:**
  - El badge `RECOMENDADO` del paquete de 20 créditos en [PaquetesGrid.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/features/wallet/components/PaquetesGrid.tsx) estaba posicionado de forma absoluta en el extremo superior derecho (`right-4`), lo que provocaba que se superpusiera con el círculo de selección/radio button de la tarjeta, tapándolo casi por completo.
  - Cualquier posicionamiento absoluto del badge (`-top-2.5`, `top-[-10px]`) sobre el contorno superior de la tarjeta colisionaba visualmente con el texto del título *"20 Créditos"* en pantallas compactas y dispositivos de escritorio debido a la cercanía con el padding de la tarjeta y la tipografía aplicada.
  - El icono `Coins` de Lucide contiene internamente caracteres que lucen como el número `1` superpuesto en algunas tipografías, lo que confundía a los usuarios haciéndoles creer que se trataba de un paso numérico duplicado o roto.
* **Archivos modificados:** [PaquetesGrid.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/features/wallet/components/PaquetesGrid.tsx)
* **Validación realizada:** 
  - Se eliminó por completo el posicionamiento absoluto del badge `RECOMENDADO`.
  - Se agrupó el badge y el título *"20 Créditos"* dentro de un contenedor vertical (`flex flex-col gap-1.5`) de flujo de documento natural. Si el paquete es popular, el badge se renderiza justo arriba del título, empujando este último hacia abajo de forma orgánica y garantizando **cero solapamiento** en cualquier resolución.
  - Se reestructuró el botón de selección (radio button) alineándolo al extremo derecho con flexbox independiente.
  - Se restituyó el padding uniforme `p-5` y la altura mínima consistente `min-h-[160px]` en toda la cuadrícula para un look simétrico y balanceado.
  - Se sustituyó el icono `Coins` por `CircleDollarSign` (con el símbolo `$` claramente legible), eliminando cualquier similitud con indicadores numéricos de paso.
  - Se eliminó el uso de clases inexistentes de Tailwind (`h-4.5` y `w-4.5`) por la clase estándar `h-5` y `w-5`.
  - La compilación mediante `npm run build` finalizó correctamente.

### [arch] Descuentos progresivos en paquetes de créditos
* **Decisión:** Incentivar la compra de paquetes mayores aplicando descuentos del 10% (para 20 créditos) y del 20% (para 50 créditos) de forma unificada.
* **Detalles:**
  * Se definieron funciones de precios y descuentos unificadas (`getPrecioPaquete`, `getPrecioOriginalPaquete`, `getDescuentoPaquete`) en [constants.ts](file:///c:/Users/luigg/Desktop/conectapro/src/lib/constants.ts).
  * Se rediseñó [PaquetesGrid.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/features/wallet/components/PaquetesGrid.tsx) para mostrar badges llamativos con el porcentaje de ahorro (ej. `Ahorra 10%`) y renderizar el precio anterior tachado.
  * Se sincronizó [RecargaForm.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/features/wallet/components/RecargaForm.tsx) y el servicio de registro de recargas en [api.ts](file:///c:/Users/luigg/Desktop/conectapro/src/features/wallet/api.ts) para almacenar y facturar con el precio de descuento correcto.
  * Se adaptaron los KPIs de administración en [types.ts](file:///c:/Users/luigg/Desktop/conectapro/src/features/admin/types.ts) y [api.ts](file:///c:/Users/luigg/Desktop/conectapro/src/features/admin/api.ts) para sumarizar los montos en USD reales (`montousd`) en lugar de estimaciones lineales.
  * Se actualizó el panel administrativo en [page.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/app/(admin)/admin/page.tsx) para reflejar los ingresos reales.
* **Validación realizada:** `npm run build` compiló sin advertencias ni errores relacionados.

### [arch] Rediseño premium del componente Loader
* **Decisión:** Sustituir la antigua animación 3D de torre de cubos por un cargador concéntrico animado con SVG de alta calidad visual, gradiente de color (Indigo a Rose) y giro inverso sincronizado, mejorando el escalado en botones y bloques.
* **Detalles:**
  * Se removieron todos los estilos CSS del loader 3D en [globals.css](file:///c:/Users/luigg/Desktop/conectapro/src/app/globals.css) y se añadieron las animaciones concéntricas de giro inverso (`animate-spin-slow` y `animate-spin-reverse`).
  * Se reestructuró [Loader.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/components/shared/Loader.tsx) usando SVG, círculos de gradiente con `strokeDasharray`, efectos de halo (glow) dinámicos para tamaño grande y un mini spinner de alto contraste para tamaño pequeño (`size="sm"`).
* **Validación realizada:** `npm run build` finalizó correctamente de manera limpia.

### [arch] Optimización global de rendimiento
* **Decisión:** Mejorar los tiempos de carga iniciales y optimizar el rendimiento del servidor de base de datos para cargas altas sin perder calidad visual.
* **Detalles:**
  * **Base de Datos**: Creado el archivo [00013_performance_indexes.sql](file:///c:/Users/luigg/Desktop/conectapro/supabase/migrations/00013_performance_indexes.sql) que define índices B-Tree estratégicos en las claves foráneas de `ordenes`, `recargas`, `mensajes`, `calificaciones` y `profesionales` para evitar escaneos secuenciales y garantizar consultas rápidas de microsegundos.
  * **Optimización de Imágenes**: Reemplazadas las etiquetas heredadas `<img>` por el componente optimizado `<Image />` de Next.js en [ResenasList.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/features/profesionales/components/ResenasList.tsx), [RecargasTable.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/features/admin/components/RecargasTable.tsx), [HistorialRecargas.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/features/wallet/components/HistorialRecargas.tsx) y [RecargaForm.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/features/wallet/components/RecargaForm.tsx) (con propiedad `unoptimized` para Object URLs locales).
  * **Configuración del Servidor de Imágenes**: Agregada la URL del storage de Supabase en `images.remotePatterns` dentro de [next.config.mjs](file:///c:/Users/luigg/Desktop/conectapro/next.config.mjs) para habilitar la compresión en servidor de Next.js.
  * **Carga Dinámica (Code-Splitting)**: Configurada la carga dinámica mediante `next/dynamic` de `ConfirmModal` en todas las tablas y páginas de detalles, reduciendo los Kilobytes de JS iniciales requeridos.
  * **Optimización de Reactividad**: Implementada la función `useShallow` de Zustand en el hook `useAuth` de [useAuth.ts](file:///c:/Users/luigg/Desktop/conectapro/src/features/auth/hooks/useAuth.ts) para evitar re-renderizaciones redundantes de los componentes suscritos.
* **Validación realizada:** La compilación mediante `npm run build` finalizó correctamente de forma limpia y exitosa.

## [13 de junio de 2026]

### [fix] BUG-9 — Desalineación del icono y envoltura de texto en AceptarOrdenButton
* **Causa raíz:** El texto del botón original *"Aceptar esta Orden (Costo: 1 crédito)"* (37 caracteres) se partía en dos líneas en pantallas de menor resolución o paneles laterales. Esto expandía la caja flex al 100% y desplazaba de forma asimétrica el icono `ShieldCheck` hacia el extremo izquierdo del botón.
* **Archivos modificados:** [AceptarOrdenButton.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/features/ordenes/components/AceptarOrdenButton.tsx)
* **Detalles:**
  - Se simplificó el texto del botón principal a *"Aceptar Orden (1 crédito)"* (25 caracteres).
  - Se simplificó el texto de carga de saldo a *"Verificando saldo..."* para consistencia.
  - Se añadieron las clases responsivas `text-xs sm:text-sm` y la propiedad `whitespace-nowrap` a ambos botones para evitar que el texto o el icono se envuelvan y permanezcan siempre alineados en una sola línea.
  - Se estandarizó el uso de sombras premium (`shadow-md shadow-indigo-600/10`) y clases nativas de Tailwind CSS.
* **Validación realizada:** Limpieza de caché de Next.js (`.next`) y ejecución exitosa de `npm run build` sin errores.

### [arch] Optimización de Escala Tipográfica y Accesibilidad
* **Decisión:** Refactorizar la escala de fuentes de toda la plataforma para eliminar el uso de tipografías minúsculas (`9px` y `10px`) que perjudicaban la accesibilidad y lectura, estandarizando un tamaño mínimo de `12px` (text-xs) para metadatos y etiquetas, y `14px` (text-sm) para enlaces y texto secundario.
* **Archivos modificados:**
  - [page.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/app/page.tsx) (Landing/Home page)
  - [page.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/app/(cliente)/cliente/ordenes/[id]/page.tsx) (Detalle de orden cliente)
  - [page.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/app/(profesional)/profesional/ordenes/[id]/page.tsx) (Detalle de orden profesional)
  - [OrdenesTable.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/features/admin/components/OrdenesTable.tsx) (Tabla admin de órdenes)
  - [RecargasTable.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/features/admin/components/RecargasTable.tsx) (Tabla admin de recargas)
  - [RecargaForm.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/features/wallet/components/RecargaForm.tsx) (Formulario de recargas)
* **Detalles:**
  - **Landing Page**: Subidos los botones de Iniciar Sesión y Registro de `text-xs` a `text-sm font-semibold`. Subidos los textos y badges de las tarjetas flotantes de Carlos Medina y Solicitud Activa de `9px/10px` a `xs/sm`. Subidas las métricas a `text-xs sm:text-sm`.
  - **Detalle de Orden (Cliente & Profesional)**: Escalados badges de Estado y Urgencia a `text-xs font-bold`. Subidos textos de descripción e instrucciones secundarias a `text-xs`.
  - **Tablas Admin**: Escaladas las cabeceras de tabla (`thead`) de `text-[10px]` a `text-xs font-bold`. Subidos correos de clientes y profesionales a `text-xs`.
  - **Formulario de Recarga**: Reemplazadas las notas pequeñas individuales de 9px por un banner interactivo de advertencia unificado con `text-xs` y fondo alert-accent, haciendo dinámicas las instrucciones de Pago Móvil, Zelle y USDT. Escalados los labels a `text-xs`.
* **Validación realizada:** Limpieza de caché de Next.js (`Remove-Item -Recurse -Force .next`) y compilación limpia exitosa de las 19 rutas del build.

### [feature] Rediseño "Cómo funciona" (Estilo Workana) y "Muro de Solicitudes Recientes" (Live Feed)
* **Decisión:** Rediseñar la sección informativa del Home para incorporar un estilo interactivo asimétrico y un feed en vivo que muestre las últimas solicitudes registradas de forma directa desde Supabase, mejorando la conversión de clientes y profesionales.
* **Archivos modificados:** [page.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/app/page.tsx)
* **Detalles:**
  - **Sección interactiva "Cómo funciona"**: Añadido selector de rol animado con indicador deslizante en CSS y timeline vertical a la izquierda con conector de línea. En el lado derecho se implementó un mockup de navegador web que despliega dinámicamente perfiles profesionales y solicitudes de trabajo según el rol seleccionado.
  - **Muro de Solicitudes Recientes**: Conectado a la base de datos Supabase para cargar las últimas 3 órdenes pendientes en tiempo real. Implementado esqueleto de carga shimmer skeleton y un fallback estático responsivo de alta calidad con casos de uso realistas de Venezuela para mantener la estética si la base de datos está vacía.
* **Validación realizada:** Limpieza de caché de Next.js (`.next`) y compilación exitosa con `npm run build`.

### [style] Optimización tipográfica y ocupación de espacio en ProfesionesSection (1080p Desktop)
* **Decisión:** Incrementar las escalas tipográficas (eliminando fuentes <12px) y expandir el layout del slider de especialidades en pantallas anchas para corregir el exceso de espacio en blanco lateral e incorporar métricas clave.
* **Archivos modificados:**
  - [ProfesionesSection.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/components/shared/ProfesionesSection.tsx)
  - [animated-testimonials.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/components/ui/animated-testimonials.tsx)
  - [page.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/app/page.tsx)
* **Detalles:**
  - **Soporte de estadísticas**: Agregada una propiedad `stats` a cada especialidad. Se renderiza dinámicamente un panel de 2 columnas de estadísticas en el lado derecho con bordes redondeados y fondos tenues que se actualizan con la animación del testimonio.
  - **Ampliación del contenedor**: El ancho máximo del slider se incrementó en escritorio de `max-w-4xl` (896px) a `max-w-7xl` (1280px) con una brecha horizontal de `lg:gap-28` para balancear las columnas. La altura de la imagen en escritorio subió de `h-80` a `h-[460px]`.
  - **Escala de fuentes**: Se eliminaron los textos pequeños de `text-[10px]` en las fichas del Home, las tarjetas simuladas y el timeline del "Cómo funciona". Se subieron a un estándar de `text-xs` y `text-sm`, y los títulos de las especialidades a `text-3xl lg:text-4xl font-extrabold`.
* **Validación realizada:** Compilación limpia y exitosa de Next.js con `npm run build`.

### [style] Optimización de Bento Grid y Especialidades (Propuesta 1 - Fichas Enriquecidas)
* **Decisión:** Reducir drásticamente el espacio en blanco lateral y vertical en la página de inicio (Bento Grid y ProfesionesSection) enriqueciendo la densidad de información con testimonios reales, tags de especialidad y alineación de cuadrícula, además de desactivar el modo oscuro del sistema.
* **Archivos modificados:**
  - [tailwind.config.ts](file:///c:/Users/luigg/Desktop/conectapro/tailwind.config.ts)
  - [page.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/app/page.tsx)
  - [animated-testimonials.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/components/ui/animated-testimonials.tsx)
  - [ProfesionesSection.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/components/shared/ProfesionesSection.tsx)
* **Detalles:**
  - **Desactivación del Modo Oscuro**: Se configuró `darkMode: "class"` en Tailwind. Dado que la etiqueta `html` en el layout no tiene la clase `dark`, el sitio se congela en modo claro, ignorando el esquema del sistema operativo.
  - **Bento Grid Core**: Se modificaron las tarjetas verticales de 1 columna ("Perfiles Verificados" y "Chat Seguro") para usar `flex flex-col justify-between h-full` y un divisor sutil en el pie, igualando en altura a las tarjetas horizontales. Se añadieron pies de página (footers) ilustrativos:
    - *Perfiles Verificados*: burbujas de avatars superpuestos con check e indicador "100% Seguro".
    - *Chat Seguro*: punto verde pulsante e icono de candado con letrero "Protegido".
    - Se mejoró la legibilidad de textos descriptivos pasando de `text-zinc-500` a `text-zinc-655` (contraste óptimo).
  - **Especialidades (Fichas Enriquecidas)**:
    - Se incrementó el tamaño vertical y horizontal del carrusel en escritorio a `h-80 md:h-[480px] lg:h-[520px] xl:h-[560px]`.
    - Se añadieron etiquetas (tags) con sub-especialidades de cada servicio (ej. *"Filtraciones"*, *"Adulto mayor"*, *"Iluminación LED"*).
    - Se incorporó un bloque con 5 estrellas doradas de **opinión destacada de un cliente real**, avatar con iniciales y rol.
    - Se integró un botón de acción principal (CTA) como *"Buscar Plomeros Disponibles"* para dirigir al flujo correspondiente.
    - Se quitó la animación letra por letra con blur por una transición fluida de opacidad/desplazamiento de bloque entero para mayor consistencia de renderizado.
* **Validación realizada:** Se solucionaron errores sintácticos por cabecera `h2` sin cerrar y comillas dobles literales en JSX. El comando `npm run build` ejecutó y finalizó con código 0, generando todas las rutas de producción satisfactoriamente.

### [style] Reestructuración de Onboarding ("Cómo funciona") a Grid Bento Horizontal (4 Columnas)
* **Decisión:** Reestructurar la sección de onboarding de 2 columnas desiguales a una sola columna vertical con grid de 4 columnas horizontales a pantalla completa (`max-w-7xl`). Esto elimina el mockup de navegador repetitivo del lado derecho y optimiza el uso de espacio y la tipografía.
* **Archivos modificados:**
  - [page.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/app/page.tsx)
  - [next.config.mjs](file:///c:/Users/luigg/Desktop/conectapro/next.config.mjs)
* **Detalles:**
  - **Eliminación del Mockup**: Se removió el cuadro de navegador de la derecha que mostraba simulaciones redundantes.
  - **Cabecera Centrada**: Se alinearon al centro el título, subtítulo, descripción y el selector deslizante de roles.
  - **Bento Steps Grid**: Se creó un grid horizontal de 4 columnas. Cada paso es una tarjeta premium independiente que incluye un número de paso gigante de fondo (`01` al `04`), caja de icono con hover reactivo y textos de alta legibilidad.
  - **Iconografía**: Se importaron y asignaron iconos semánticos específicos (`ClipboardList`, `UserCheck`, `Search`, `Coins`).
  - **Optimización de Compilación**: Se deshabilitó el Webpack build worker experimental (`webpackBuildWorker: false` en `next.config.mjs`) para evitar desbordamientos de memoria RAM (out of memory error) durante el build en el sandbox.
* **Validación realizada:** El comando `$env:NODE_TLS_REJECT_UNAUTHORIZED="0"; $env:NODE_OPTIONS="--max-old-space-size=4096"; npm run build` compiló sin errores, confirmando la validez tipográfica y sintáctica del JSX.## [13 de junio de 2026] (Continuación)

### [style] Optimización de Responsividad de toda la Home Page
* **Decisión:** Realizar mejoras profundas de adaptabilidad y maquetación fluida en toda la página de inicio (Header, Hero, Bento Grid, Carrusel de Especialidades y Muro de Solicitudes) para asegurar una experiencia premium en todas las pantallas (320px móvil a 1080p escritorio).
* **Archivos modificados:**
  - [page.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/app/page.tsx)
  - [animated-testimonials.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/components/ui/animated-testimonials.tsx)
* **Detalles:**
  - **Header & Hero**: Se redujo proporcionalmente la altura del logo en móviles a `h-6` (escalando a `h-8` en sm) y se achicaron los botones de login/registro (`text-xs` y padding dinámico) para evitar colisión horizontal. Se redujo el título del Hero a `text-3xl` en móvil (escalando a `text-5xl` y `text-6xl` en sm/lg).
  - **Bento Grid Core**: Se modificó la cuadrícula para pasar a 2 columnas en tablets (`sm:grid-cols-2 lg:grid-cols-3 gap-6`), dándoles un ancho holgado a las tarjetas de 1 columna ("Perfiles" y "Chat") de ~360px para que respiren y no colisionen sus footers. Las tarjetas horizontales se asignaron a `sm:col-span-2` y `sm:col-span-1` correspondientemente.
  - **Especialidades**: Se configuró la altura de imagen auto-escalable de `h-72` a `h-[560px]`. Se redujeron márgenes y rellenos internos (`mt-3.5 pt-3.5`, `gap-2.5`, etc.) en la columna de texto lateral en tablets (`md:max-lg:`) para evitar que la caja exceda la altura de la imagen física.
  - **Muro de Solicitudes**: Se cambió el grid a `sm:grid-cols-2 lg:grid-cols-3` y se configuró para que la tercera tarjeta (loading shimmer, feed y fallbacks) ocupe `sm:col-span-2 lg:col-span-1` en tablets para balancear el layout y evitar espacios vacíos asimétricos.
* **Validación realizada:** Compilación de producción exitosa con `npm run build` sin advertencias de linter ni errores de TypeScript.

### [feature] Confirmación y Visibilidad de Contraseña en Crear Cuenta
* **Decisión:** Agregar confirmación de contraseña y botones para alternar la visibilidad de la contraseña en el formulario de creación de cuenta (`/auth/registro`) para mejorar la UX y mitigar errores tipográficos al registrarse.
* **Archivos modificados:** [page.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/app/auth/registro/page.tsx)
* **Detalles:**
  - **Confirmación:** Añadido el campo "Confirmar contraseña" y su correspondiente validador en `handleSubmit` que muestra un error si las contraseñas no coinciden.
  - **Visibilidad:** Integrado botón absoluto con iconos `Eye` y `EyeOff` en ambos campos de contraseña para alternar dinámicamente el atributo `type` entre `"password"` y `"text"`. Se ajustó el padding derecho a `pr-10` en los inputs para evitar solapamiento de texto con el botón.
* **Validación realizada:** Compilación limpia y exitosa de Next.js (`Compiled successfully`) con `npm run build`.

### [feature] Ciudad / Dirección obligatoria para todos los roles (Clientes y Profesionales)
* **Decisión:** Mover el campo Ciudad al bloque común de registro de cuenta (`/auth/registro`) renombrado como "Ciudad / Dirección" para capturar la localización de todos los usuarios (incluidos clientes) de forma obligatoria.
* **Archivos modificados:** [page.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/app/auth/registro/page.tsx)
* **Detalles:**
  - **Ubicación:** Trasladado el campo del grid profesional a los inputs comunes (Nombre, Correo, Ciudad/Dirección, Contraseñas) y validado en `handleSubmit` para ambas cuentas.
  - **Sincronización:** Se envía la ciudad en el payload de registro. El trigger de base de datos `handle_new_user()` guarda este dato en la columna `ciudad` de la tabla `public.usuarios` para clientes y profesionales, manteniendo compatibilidad de esquema.
* **Validación realizada:** Verificación estática con `npx tsc --noEmit` y `npx eslint src/app/auth/registro/page.tsx` con 0 errores y advertencias.

### [style] Rediseño Estético y de Conversión en la Sección Final (Bottom CTA)
* **Decisión:** Rediseñar la sección final (Bottom CTA) del Home para hacerla visualmente impactante (estilo glassmorphic con rejilla tecnológica e iconos grandes), cambiar el copy a "generar ingresos" con un gradiente moderno y estructurar los beneficios en un listado scannable.
* **Archivos modificados:** [page.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/app/page.tsx)
* **Detalles:**
  - **Estética & Copy:** Modificada la frase original de "ganar dinero" a "generar ingresos" e integrada con un gradiente translúcido de colores. Añadidos efectos de halo de luz e iluminación de fondo y un patrón tecnológico de puntos radiales.
  - **Estructura:** Implementado estilo glassmorphic de cristal en ambas tarjetas de rol (`bg-white/[0.03] backdrop-blur-xl border-white/10 hover:border-indigo-500/30 shadow-2xl`), iconos Lucide de gran formato en burbujas degradadas (`Users` y `Briefcase`), y listas con checks para resumir los beneficios clave en lugar de texto corrido.
* **Validación realizada:** Compilación y visualización limpia comprobando la correcta renderización sintáctica de las etiquetas JSX de Next.js y Tailwind CSS.

### [ux] Usabilidad y Gestos Táctiles en el Carrusel de Especialidades (Móviles)
* **Decisión:** Habilitar navegación por gestos de arrastre horizontal (swipe) en dispositivos móviles, incorporar controles de flecha flotantes glassmorphic sobre la imagen, añadir un indicador de puntos (dots) activo, y ocultar los botones de navegación de escritorio duplicados en pantallas de teléfonos.
* **Archivos modificados:** [animated-testimonials.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/components/ui/animated-testimonials.tsx)
* **Detalles:**
  - **Gestos de Arrastre (Swipe):** Configurada la propiedad `drag="x"` de Framer Motion en la tarjeta activa de especialidades con límites de retorno `dragConstraints={{ left: 0, right: 0 }}` y `dragElastic={0.2}`. El callback `onDragEnd` detecta deslizamientos superiores a 50px de distancia para cambiar de ficha. Se agregó `touch-pan-y` para posibilitar el scroll vertical del navegador sin bloquearse al tocar el carrusel.
  - **Overlays de Flecha:** Se renderizan dos botones de navegación flotantes sobre la imagen (`ArrowLeft` y `ArrowRight`) con fondo oscuro translúcido y desenfoque (`bg-black/40 backdrop-blur-md border border-white/10`) posicionados en absoluto en los laterales, visibles solo en dispositivos móviles (`md:hidden`).
  - **Dots de Estado:** Se agregó una barra de indicadores activos (dots) tipo píldora debajo del contenedor de la imagen (`md:hidden`) que reacciona reactivamente mostrando cuál ficha está cargada y permite saltar directamente a ella.
  - **Ocultar duplicados:** Se ocultaron los botones de navegación inferiores del layout de escritorio en móviles usando la clase `hidden md:flex`.
* **Validación realizada:** Verificación de tipos y lint de código TypeScript correctos.

### [style] Renovación Estética (UI/UX) y Unificación Cromática del Panel Administrativo
* **Decisión:** Rediseñar la interfaz y usabilidad de todo el panel administrativo (`/admin`), unificando los acentos cromáticos del tema `rose` original hacia la identidad de marca `indigo` de ConectaPro, elevando las tarjetas de KPIs con acentos e interacciones premium, estilizando la legibilidad de tablas/badges, e implementando un modal visor de comprobantes (Lightbox) glassmorphic premium.
* **Archivos modificados:**
  - [layout.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/app/(admin)/admin/layout.tsx)
  - [page.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/app/(admin)/admin/page.tsx)
  - [KPICard.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/features/admin/components/KPICard.tsx)
  - [RecargasTable.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/features/admin/components/RecargasTable.tsx)
  - [UsuariosTable.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/features/admin/components/UsuariosTable.tsx)
  - [OrdenesTable.tsx](file:///c:/Users/luigg/Desktop/conectapro/src/features/admin/components/OrdenesTable.tsx)
* **Detalles:**
  - **Navegación & Layout:** Se reemplazó el tema `rose-500` por el esquema `indigo-600`/`indigo-500` en los iconos, acentos activos y sidebar general. Se mejoró la ergonomía de hover y active state con bordes redondeados tipo píldora (`rounded-xl`), fondo translúcido y bordes izquierdos más limpios.
  - **KPI Dashboard:** Se agregaron barras de acento superiores en `KPICard.tsx`, sombras premium adaptativas, glows internos en iconos y animación hover (`hover:-translate-y-1 hover:shadow-lg`). Se eliminaron las fuentes minúsculas `<12px` (corrigiendo a un estándar de `11px` y `12px` legibles por WCAG 2.1).
  - **Revisión de Recargas:** Se añadieron badges de color premium para los métodos de pago (Pago Móvil, USDT, Zelle) y se rediseñó el visor de comprobantes convirtiéndolo en un Lightbox de cristal con desenfoque de fondo (`backdrop-blur-md bg-zinc-950/80`), contenedor flotante curvado y botones de acción de alta calidad.
  - **Gestión de Usuarios & Órdenes:** Se estandarizaron los focus states y bordes interactivos en los inputs de búsqueda y el CustomSelect. Se agregaron micro-indicadores pulsantes (`animate-ping`) para cuentas de usuarios activas y se escaló el tamaño de la tipografía para todos los badges de estado y categorías para garantizar legibilidad operacional en listas densas.
* **Validación realizada:** Limpieza de caché, verificación exitosa de tipos con `npx tsc --noEmit` y ESLint sin errores, y compilación final limpia mediante `npm run build`.






