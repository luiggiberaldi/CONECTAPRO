'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useOrdenes } from '@/features/ordenes/hooks/useOrdenes';
import { OrdenCard } from '@/features/ordenes';
import { supabaseBrowser } from '@/lib/supabase';
import { 
  Inbox, 
  RefreshCw, 
  ChevronLeft, 
  ChevronRight,
  Star,
  Info,
  PlusCircle
} from 'lucide-react';
import Loader from '@/components/shared/Loader';
import Link from 'next/link';

type TabType = 'activas' | 'completadas' | 'canceladas';

export default function ClienteOrdenesPage() {
  const { usuario } = useAuth();
  const { ordenes, loading, cargarOrdenesCliente } = useOrdenes();
  const [activeTab, setActiveTab] = useState<TabType>('activas');
  
  // Estadísticas del Cliente
  const [rating, setRating] = useState(0);
  const [totalCalifs, setTotalCalifs] = useState(0);
  const [proyectosEnCurso, setProyectosEnCurso] = useState(0);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const fetchOrders = useCallback(() => {
    if (usuario?.id) {
      cargarOrdenesCliente(usuario.id);
      setCurrentPage(1);
    }
  }, [usuario, cargarOrdenesCliente]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Cargar estadísticas del cliente
  useEffect(() => {
    async function loadClientStats() {
      if (!usuario?.id) return;
      try {
        // 1. Obtener calificaciones recibidas
        const { data: califs, error: errCalifs } = await supabaseBrowser
          .from('calificaciones')
          .select('estrellas')
          .eq('calificadoa', usuario.id);
          
         if (!errCalifs && califs) {
           const total = califs.length;
           const prom = total > 0 
             ? califs.reduce((acc, curr) => acc + curr.estrellas, 0) / total 
             : 0;
           setRating(prom);
           setTotalCalifs(total);
         }

         // 2. Obtener órdenes activas (pendiente o en_proceso)
         const { count: activeCount, error: errActive } = await supabaseBrowser
           .from('ordenes')
           .select('id', { count: 'exact', head: true })
           .eq('clienteid', usuario.id)
           .in('estado', ['pendiente', 'en_proceso']);

         if (!errActive && activeCount !== null) {
           setProyectosEnCurso(activeCount);
         }
      } catch (err) {
        console.error('Error al cargar estadísticas del cliente:', err);
      }
    }
    loadClientStats();
  }, [usuario]);

  // Filtrar según el tab activo
  const ordenesFiltradas = ordenes.filter((o) => {
    if (activeTab === 'activas') {
      return o.estado === 'pendiente' || o.estado === 'en_proceso';
    }
    if (activeTab === 'completadas') {
      return o.estado === 'completada';
    }
    return o.estado === 'cancelada';
  });

  const totalPages = Math.max(1, Math.ceil(ordenesFiltradas.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrdenes = ordenesFiltradas.slice(startIndex, startIndex + pageSize);
  if (!usuario) return null;

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Ficha de Usuario Cliente Estilo Workana */}
        <div className="bg-[#fdfcf9] dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              {usuario.avatar_url ? (
                <img
                  src={usuario.avatar_url}
                  alt={usuario.nombre}
                  className="h-16 w-16 rounded-full object-cover border border-zinc-200 dark:border-zinc-850 shadow-sm"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-indigo-50 dark:bg-indigo-950/45 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-center text-indigo-750 dark:text-indigo-400 font-black text-xl shadow-sm">
                  {usuario.nombre.substring(0, 2).toUpperCase()}
                </div>
              )}
              {/* Nombre y Estrellas */}
              <div className="flex flex-col">
                <h2 className="text-lg font-black text-zinc-900 dark:text-zinc-55">{usuario.nombre}</h2>
                <div className="flex items-center gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(rating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-zinc-200 dark:text-zinc-800'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-1.5 font-bold">
                    ({totalCalifs} valoraciones)
                  </span>
                </div>
              </div>
            </div>

            {/* Proyectos en Curso */}
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-lg font-black text-zinc-900 dark:text-zinc-55 flex items-center gap-1">
                  {proyectosEnCurso}
                  <span 
                    className="text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 dark:text-indigo-400 p-0.5 rounded-full inline-flex items-center justify-center cursor-help" 
                    title="Solicitudes de servicio activas o en proceso."
                  >
                    <Info className="h-3.5 w-3.5" />
                  </span>
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold">
                  Proyectos activos
                </span>
              </div>
            </div>

            {/* Botón de Acción */}
            <div className="flex items-center gap-3">
              <button
                onClick={fetchOrders}
                className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-all active:scale-95"
                title="Recargar listado"
              >
                <RefreshCw className={`h-4.5 w-4.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              
              <Link
                href="/cliente/ordenes/nueva"
                className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-black text-white bg-indigo-650 hover:bg-indigo-500 transition-all shadow-sm active:scale-98"
              >
                <PlusCircle className="h-4.5 w-4.5" />
                Publicar proyecto
              </Link>
            </div>
          </div>
        </div>

        {/* TABS SELECTOR */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-6 gap-2">
          {(['activas', 'completadas', 'canceladas'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`px-4 py-2.5 text-xs font-bold capitalize border-b-2 -mb-[2px] transition-all ${
                activeTab === tab
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-extrabold'
                  : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* LISTADO */}
        {loading && ordenes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader size="lg" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-4">Cargando tus solicitudes...</p>
          </div>
        ) : ordenesFiltradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/30 text-center animate-fade-in">
            <Inbox className="h-10 w-10 text-zinc-400 mb-3" />
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">No hay solicitudes</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs mx-auto">
              No tienes ninguna orden en la categoría <span className="font-semibold">{activeTab}</span>.
            </p>
            {activeTab === 'activas' && (
              <Link
                href="/cliente/ordenes/nueva"
                className="mt-4 px-4 py-2 text-xs font-semibold text-indigo-600 hover:text-indigo-500 border border-indigo-200 dark:border-indigo-900 rounded-xl hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all"
              >
                Crear mi primera solicitud
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {paginatedOrdenes.map((orden) => (
                <OrdenCard
                  key={orden.id}
                  orden={orden}
                  href={`/cliente/ordenes/${orden.id}`}
                />
              ))}
            </div>

            {/* Controles de Paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-2 text-xs pt-4 border-t border-zinc-200 dark:border-zinc-800/60 mt-4">
                <span className="text-zinc-500 font-medium">
                  Mostrando {startIndex + 1}-{Math.min(startIndex + pageSize, ordenesFiltradas.length)} de {ordenesFiltradas.length} solicitudes
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="px-2 font-bold">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
    </main>
  );
}
