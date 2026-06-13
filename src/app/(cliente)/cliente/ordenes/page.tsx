'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useOrdenes } from '@/features/ordenes/hooks/useOrdenes';
import { OrdenCard } from '@/features/ordenes';
import { Plus, Inbox, RefreshCw } from 'lucide-react';
import Loader from '@/components/shared/Loader';
import Link from 'next/link';

type TabType = 'activas' | 'completadas' | 'canceladas';

export default function ClienteOrdenesPage() {
  const { usuario } = useAuth();
  const { ordenes, loading, cargarOrdenesCliente } = useOrdenes();
  const [activeTab, setActiveTab] = useState<TabType>('activas');

  const fetchOrders = useCallback(() => {
    if (usuario?.id) {
      cargarOrdenesCliente(usuario.id);
    }
  }, [usuario, cargarOrdenesCliente]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
              Mis Solicitudes de Servicio
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Administra tus trabajos solicitados, chatea y califica a los profesionales.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchOrders}
              className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-all active:scale-95"
              title="Recargar listado"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              href="/cliente/ordenes/nueva"
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-sm active:scale-95"
            >
              <Plus className="h-4 w-4" />
              Nueva Solicitud
            </Link>
          </div>
        </div>

        {/* TABS SELECTOR */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-6 gap-2">
          {(['activas', 'completadas', 'canceladas'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
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
          <div className="grid grid-cols-1 gap-4">
            {ordenesFiltradas.map((orden) => (
              <OrdenCard
                key={orden.id}
                orden={orden}
                href={`/cliente/ordenes/${orden.id}`}
              />
            ))}
          </div>
        )}
    </main>
  );
}
