'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useOrdenes } from '@/features/ordenes/hooks/useOrdenes';
import { useWallet } from '@/features/wallet';
import { OrdenCard } from '@/features/ordenes';
import { supabaseBrowser } from '@/lib/supabase';
import { useBCV } from '@/hooks/useBCV';
import { 
  RefreshCw, 
  Inbox, 
  ChevronLeft, 
  ChevronRight,
  Star,
  Info,
  Wallet,
  ChevronDown
} from 'lucide-react';
import Loader from '@/components/shared/Loader';
import { Profesional } from '@/types';
import Link from 'next/link';

type TabType = 'disponibles' | 'asignados';

export default function ProfesionalOrdenesPage() {
  const formatBs = useBCV((state) => state.formatBs);
  const { usuario } = useAuth();
  const { ordenes, loading, cargarOrdenesDisponibles, cargarOrdenesAsignadas } = useOrdenes();
  const [activeTab, setActiveTab] = useState<TabType>('disponibles');
  const [profesional, setProfesional] = useState<(Profesional & { categoriaid?: string }) | null>(null);
  const [loadingProf, setLoadingProf] = useState(true);

  // Estados de la ficha
  const [trabajosEnCurso, setTrabajosEnCurso] = useState(0);
  const [isWalletDetailsOpen, setIsWalletDetailsOpen] = useState(false);

  // Carga de Billetera
  const { saldo, totalcargado, totalusado } = useWallet(usuario?.id || '');

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

  // Cargar contador de trabajos en curso
  useEffect(() => {
    async function loadTrabajosCount() {
      if (!usuario?.id) return;
      try {
        const { count, error } = await supabaseBrowser
          .from('ordenes')
          .select('id', { count: 'exact', head: true })
          .eq('profesionalid', usuario.id)
          .eq('estado', 'en_proceso');
        if (!error && count !== null) {
          setTrabajosEnCurso(count);
        }
      } catch (err) {
        console.error('Error al cargar trabajos en curso:', err);
      }
    }
    if (!loadingProf) {
      loadTrabajosCount();
    }
  }, [usuario, loadingProf]);

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

  const totalPages = Math.max(1, Math.ceil(ordenes.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrdenes = ordenes.slice(startIndex, startIndex + pageSize);
  if (!usuario) return null;

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
        {/* Ficha de Usuario Estilo Workana */}
        <div className="bg-[#fdfcf9] dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm mb-4">
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
                        star <= Math.round(profesional?.calificacionpromedio || 0)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-zinc-200 dark:text-zinc-800'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-1.5 font-bold">
                    ({profesional?.totaltrabajos || 0} trabajos)
                  </span>
                </div>
              </div>
            </div>

            {/* Saldo y Proyectos en Curso */}
            <div className="flex items-center gap-8 md:gap-12">
              <div className="flex flex-col">
                <span className="text-lg font-black text-zinc-900 dark:text-zinc-55 leading-none">
                  {saldo} {saldo === 1 ? 'crédito' : 'créditos'}
                </span>
                <span className="text-[9px] font-black text-zinc-450 dark:text-zinc-500 mt-1">
                  ≈ ${(saldo * 1.20).toFixed(2)} USD / {formatBs(saldo * 1.20)}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold mt-1">
                  Saldo actual
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-lg font-black text-zinc-900 dark:text-zinc-55 flex items-center gap-1">
                  {trabajosEnCurso}
                  <span 
                    className="text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 dark:text-indigo-400 p-0.5 rounded-full inline-flex items-center justify-center cursor-help" 
                    title="Trabajos que tienes actualmente asignados y en proceso."
                  >
                    <Info className="h-3.5 w-3.5" />
                  </span>
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-bold">
                  Trabajos en curso
                </span>
              </div>
            </div>

            {/* Botón de Acción */}
            <div className="flex items-center gap-3">
              <button
                onClick={cargarDatos}
                className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-all active:scale-95"
                title="Recargar listado"
              >
                <RefreshCw className={`h-4.5 w-4.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Detalle de Saldo y Billetera Colapsable */}
        <div className="bg-white dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm mb-8">
          <button
            onClick={() => setIsWalletDetailsOpen(!isWalletDetailsOpen)}
            className="w-full px-5 py-3 flex items-center justify-between text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            <span className="flex items-center gap-2 text-md">
              <Wallet className="h-4.5 w-4.5 text-zinc-500" />
              Detalle de saldo y billetera
            </span>
            <ChevronDown className={`h-4.5 w-4.5 text-zinc-400 transition-transform duration-200 ${isWalletDetailsOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isWalletDetailsOpen && (
            <div className="px-5 pb-4 pt-3 border-t border-zinc-100 dark:border-zinc-900 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="flex flex-col gap-0.5">
                <span className="text-zinc-500 text-md">Créditos Cargados</span>
                <span className="font-extrabold text-zinc-900 dark:text-zinc-100 text-md">{totalcargado} créditos</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-zinc-500 text-md">Créditos Utilizados</span>
                <span className="font-extrabold text-zinc-900 dark:text-zinc-100 text-md">{totalusado} créditos</span>
              </div>
              <div className="flex items-center md:justify-end">
                <Link
                  href="/profesional/wallet"
                  className="text-md font-black text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1"
                >
                  Ir a mi billetera &rarr;
                </Link>
              </div>
            </div>
          )}
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
