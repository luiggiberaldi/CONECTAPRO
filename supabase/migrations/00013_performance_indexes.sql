-- 00013_performance_indexes.sql
-- Índices estratégicos para acelerar consultas y mejorar el rendimiento bajo carga

-- 1. Profesionales: Indexar usuarioid para acelerar el enlace con usuarios
CREATE INDEX IF NOT EXISTS idx_profesionales_usuarioid ON public.profesionales(usuarioid);

-- 2. Órdenes: Indexar clientes, profesionales y estados para búsquedas de paneles e historial
CREATE INDEX IF NOT EXISTS idx_ordenes_clienteid ON public.ordenes(clienteid);
CREATE INDEX IF NOT EXISTS idx_ordenes_profesionalid ON public.ordenes(profesionalid);
CREATE INDEX IF NOT EXISTS idx_ordenes_estado ON public.ordenes(estado);
CREATE INDEX IF NOT EXISTS idx_ordenes_categoriaid ON public.ordenes(categoriaid);

-- 3. Mensajes: Indexar ordenid y createdat para chats en tiempo real ultra rápidos
CREATE INDEX IF NOT EXISTS idx_mensajes_ordenid ON public.mensajes(ordenid);
CREATE INDEX IF NOT EXISTS idx_mensajes_createdat ON public.mensajes(createdat ASC);

-- 4. Recargas: Indexar profesionalid y estado para paneles de administración e historial
CREATE INDEX IF NOT EXISTS idx_recargas_profesionalid ON public.recargas(profesionalid);
CREATE INDEX IF NOT EXISTS idx_recargas_estado ON public.recargas(estado);

-- 5. Calificaciones: Indexar calificadoa, calificadorpor y ordenid para el cálculo de reputación
CREATE INDEX IF NOT EXISTS idx_calificaciones_calificadoa ON public.calificaciones(calificadoa);
CREATE INDEX IF NOT EXISTS idx_calificaciones_calificadorpor ON public.calificaciones(calificadorpor);
CREATE INDEX IF NOT EXISTS idx_calificaciones_ordenid ON public.calificaciones(ordenid);
