'use client';

import React, { useEffect, useState, useCallback } from 'react';
import RouteGuard from '@/components/shared/RouteGuard';
import Navbar from '@/components/shared/Navbar';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getReputacionProfesional } from '@/features/profesionales/api';
import { ReputacionProfesional } from '@/features/profesionales/types';
import ReputacionCard from '@/features/profesionales/components/ReputacionCard';
import ResenasList from '@/features/profesionales/components/ResenasList';
import { Loader2, RefreshCw, ArrowLeft, Award } from 'lucide-react';
import Link from 'next/link';

export default function ProfesionalReputacionPage() {
  const { usuario } = useAuth();
  const [reputacion, setReputacion] = useState<ReputacionProfesional | null>(null);
  const [loading, setLoading] = useState(true);

  const loadReputacion = useCallback(async () => {
    if (!usuario?.id) return;
    setLoading(true);
    const data = await getReputacionProfesional(usuario.id);
    if (data) {
      setReputacion(data);
    }
    setLoading(false);
  }, [usuario]);

  useEffect(() => {
    loadReputacion();
  }, [loadReputacion]);

  return (
    <RouteGuard allowedRoles={['profesional']}>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="mb-2">
              <Link
                href="/profesional/ordenes"
                className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Volver al panel
              </Link>
            </div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Award className="h-6 w-6 text-amber-500" />
              Mi Reputación
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Aquí puedes revisar tu calificación promedio y las opiniones recibidas de tus clientes.
            </p>
          </div>
          <button
            onClick={loadReputacion}
            disabled={loading}
            className="self-start sm:self-center flex items-center justify-center p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-all active:scale-95 disabled:opacity-50"
            title="Recargar reputación"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Contenido principal */}
        {loading && !reputacion ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] p-4 text-center">
            <Loader2 className="h-8 w-8 text-indigo-650 animate-spin mb-2" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Cargando reputación e historial...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <ReputacionCard
              calificacionpromedio={reputacion?.calificacionpromedio ?? 0}
              totaltrabajos={reputacion?.totaltrabajos ?? 0}
            />
            <ResenasList resenas={reputacion?.resenas ?? []} />
          </div>
        )}
      </main>
    </RouteGuard>
  );
}
