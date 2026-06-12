'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { getTodasOrdenes } from '@/features/admin/api';
import { AdminOrden, OrdenFilterEstado } from '@/features/admin/types';
import OrdenesTable from '@/features/admin/components/OrdenesTable';
import { Loader2, RefreshCw } from 'lucide-react';

export default function AdminOrdenesPage() {
  const [ordenes, setOrdenes] = useState<AdminOrden[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de filtro
  const [filterEstado, setFilterEstado] = useState<OrdenFilterEstado>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const loadOrdenes = useCallback(async () => {
    setLoading(true);
    const data = await getTodasOrdenes({
      estado: filterEstado,
      query: searchQuery,
    });
    if (data) {
      setOrdenes(data);
    }
    setLoading(false);
  }, [filterEstado, searchQuery]);

  useEffect(() => {
    // Debounce de búsqueda para evitar demasiados requests en base de datos
    const delayDebounceFn = setTimeout(() => {
      loadOrdenes();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [loadOrdenes]);

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            Monitoreo de Órdenes
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Audita el estado de todas las solicitudes de trabajo creadas en ConectaPro.
          </p>
        </div>
        <button
          onClick={loadOrdenes}
          disabled={loading}
          className="self-start sm:self-center flex items-center justify-center p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-all active:scale-95 disabled:opacity-50"
          title="Actualizar listado"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tabla de órdenes */}
      {loading && ordenes.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] p-4 text-center">
          <Loader2 className="h-8 w-8 text-rose-500 animate-spin mb-2" />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Consultando órdenes...</p>
        </div>
      ) : (
        <OrdenesTable
          ordenes={ordenes}
          filterEstado={filterEstado}
          onFilterEstadoChange={setFilterEstado}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
        />
      )}
    </div>
  );
}
