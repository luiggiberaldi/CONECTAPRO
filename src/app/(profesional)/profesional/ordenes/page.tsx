'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useOrdenes } from '@/features/ordenes/hooks/useOrdenes';
import { OrdenCard } from '@/features/ordenes';
import { supabaseBrowser } from '@/lib/supabase';
import { RefreshCw, Inbox, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import Loader from '@/components/shared/Loader';
import { Profesional } from '@/types';

type TabType = 'disponibles' | 'asignados';

export default function ProfesionalOrdenesPage() {
  const { usuario } = useAuth();
  const { ordenes, loading, cargarOrdenesDisponibles, cargarOrdenesAsignadas } = useOrdenes();
  const [activeTab, setActiveTab] = useState<TabType>('disponibles');
  const [profesional, setProfesional] = useState<(Profesional & { categoriaid?: string }) | null>(null);
  const [loadingProf, setLoadingProf] = useState(true);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Cargar datos de profesional vinculados
  useEffect(() => {
    async function loadProfesional() {
      if (!usuario?.id) return;
      try {
        const { data, error } = await supabaseBrowser
          .from('profesionales')
          .select('*')
          .eq('usuarioid', usuario.id)
          .single();
        if (error) throw error;
        if (data) {
          // Obtener el UUID de la categoría correspondiente a la especialidad (slug)
          const { data: catData, error: catError } = await supabaseBrowser
            .from('categorias')
            .select('id')
            .eq('slug', data.especialidad)
            .single();

          if (!catError && catData) {
            setProfesional({
              ...data,
              categoriaid: catData.id,
            });
          } else {
            setProfesional(data);
          }
        }

      } catch (err) {
        console.error('Error al cargar profesional:', err);
      } finally {
        setLoadingProf(false);
      }
    }
    loadProfesional();
  }, [usuario]);

  const cargarDatos = useCallback(() => {
    if (!usuario?.id) return;
    setCurrentPage(1);
    
    if (activeTab === 'disponibles') {
      if (profesional?.categoriaid) {
        cargarOrdenesDisponibles(profesional.categoriaid);
      } else if (profesional?.especialidad) {
        cargarOrdenesDisponibles(profesional.especialidad);
      }
    } else {
      cargarOrdenesAsignadas(usuario.id);
    }
  }, [usuario, activeTab, profesional, cargarOrdenesDisponibles, cargarOrdenesAsignadas]);

  useEffect(() => {
    if (!loadingProf) {
      cargarDatos();
    }
  }, [activeTab, loadingProf, profesional, cargarDatos]);

  // Derivados de Paginación
  const totalPages = Math.max(1, Math.ceil(ordenes.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrdenes = ordenes.slice(startIndex, startIndex + pageSize);

  if (loadingProf) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <Loader size="lg" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-4">Cargando perfil profesional...</p>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Encabezado con estadísticas rápidas */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              Panel Profesional
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Administra tus postulaciones, acepta trabajos de la categoría <span className="font-semibold capitalize text-indigo-650 dark:text-indigo-400">&quot;{profesional?.especialidad}&quot;</span> y gestiona tu wallet.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={cargarDatos}
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-all active:scale-95"
              title="Recargar listado"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-950/30 bg-indigo-50/35 dark:bg-indigo-950/20 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <Award className="h-3.5 w-3.5" />
              Calificación: {profesional?.calificacionpromedio || 0} ★ ({profesional?.totaltrabajos || 0} trab.)
            </div>
          </div>
        </div>

        {/* TABS SELECTOR */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-6 gap-2">
          <button
            onClick={() => {
              setActiveTab('disponibles');
              setCurrentPage(1);
            }}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 -mb-[2px] transition-all ${
              activeTab === 'disponibles'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-extrabold'
                : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            Trabajos Disponibles ({profesional?.especialidad})
          </button>
          <button
            onClick={() => {
              setActiveTab('asignados');
              setCurrentPage(1);
            }}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 -mb-[2px] transition-all ${
              activeTab === 'asignados'
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-extrabold'
                : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            Mis Trabajos Aceptados
          </button>
        </div>

        {/* LISTADO */}
        {loading && ordenes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader size="lg" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-4">Buscando órdenes...</p>
          </div>
        ) : ordenes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/30 text-center animate-fade-in">
            <Inbox className="h-10 w-10 text-zinc-400 mb-3" />
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
              {activeTab === 'disponibles' ? 'No hay trabajos disponibles' : 'No tienes trabajos asignados'}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs mx-auto">
              {activeTab === 'disponibles'
                ? 'Vuelve a consultar más tarde para ver nuevas solicitudes de clientes en tu zona.'
                : 'Explora los trabajos disponibles y acepta tu primera orden.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {paginatedOrdenes.map((orden) => (
                <OrdenCard
                  key={orden.id}
                  orden={orden}
                  href={`/profesional/ordenes/${orden.id}`}
                />
              ))}
            </div>

            {/* Controles de Paginación */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-2 text-xs pt-4 border-t border-zinc-200 dark:border-zinc-800/60 mt-4">
                <span className="text-zinc-500 font-medium">
                  Mostrando {startIndex + 1}-{Math.min(startIndex + pageSize, ordenes.length)} de {ordenes.length} órdenes
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="px-2 font-bold">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
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
