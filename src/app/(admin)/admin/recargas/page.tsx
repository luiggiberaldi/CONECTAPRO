'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { getRecargasPendientes, aprobarRecarga, rechazarRecarga } from '@/features/admin/api';
import { AdminRecarga } from '@/features/admin/types';
import RecargasTable from '@/features/admin/components/RecargasTable';
import { Loader2, RefreshCw } from 'lucide-react';

export default function AdminRecargasPage() {
  const [recargas, setRecargas] = useState<AdminRecarga[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadRecargas = useCallback(async () => {
    setLoading(true);
    const data = await getRecargasPendientes();
    if (data) {
      setRecargas(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadRecargas();
  }, [loadRecargas]);

  const handleAprobar = async (id: string) => {
    setActionLoading(id);
    try {
      const success = await aprobarRecarga(id);
      if (success) {
        await loadRecargas();
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleRechazar = async (id: string) => {
    setActionLoading(id);
    try {
      const success = await rechazarRecarga(id);
      if (success) {
        await loadRecargas();
      }
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            Revisión de Recargas
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Revisa y procesa las transferencias reportadas por los profesionales para la recarga de créditos.
          </p>
        </div>
        <button
          onClick={loadRecargas}
          disabled={loading}
          className="self-start sm:self-center flex items-center justify-center p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-all active:scale-95 disabled:opacity-50"
          title="Recargar solicitudes"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tabla de recargas */}
      {loading && recargas.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] p-4 text-center">
          <Loader2 className="h-8 w-8 text-rose-500 animate-spin mb-2" />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Buscando solicitudes pendientes...</p>
        </div>
      ) : (
        <RecargasTable
          recargas={recargas}
          onAprobar={handleAprobar}
          onRechazar={handleRechazar}
          loadingAction={actionLoading}
        />
      )}
    </div>
  );
}
