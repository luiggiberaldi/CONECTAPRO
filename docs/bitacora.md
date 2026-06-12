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


