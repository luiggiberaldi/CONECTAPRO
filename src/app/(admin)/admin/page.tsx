'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getKPIs } from '@/features/admin/api';
import { AdminKPIs } from '@/features/admin/types';
import KPICard from '@/features/admin/components/KPICard';
import { ClipboardList, Users, DollarSign, Sparkles, RefreshCw } from 'lucide-react';
import Loader from '@/components/shared/Loader';

export default function AdminDashboardPage() {
  const [kpis, setKpis] = useState<AdminKPIs | null>(null);
  const [loading, setLoading] = useState(true);
  const loadingRef = useRef(false);

  const loadData = useCallback(async () => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);
    try {
      const data = await getKPIs();
      if (data) {
        setKpis(data);
      }
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading && !kpis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] p-4 text-center">
        <Loader size="lg" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-4">Cargando métricas del sistema...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            Panel de Administración
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Revisa métricas generales del sistema, aprueba pagos y administra cuentas de usuario.
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="self-start sm:self-center flex items-center justify-center p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-all active:scale-95 disabled:opacity-50"
          title="Actualizar datos"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Bento Grid de KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <KPICard
          title="Órdenes de Hoy"
          value={kpis?.totalOrdenesHoy ?? 0}
          description="Nuevas solicitudes creadas hoy"
          icon={ClipboardList}
          color="indigo"
        />
        <KPICard
          title="Profesionales Activos"
          value={kpis?.profesionalesActivos ?? 0}
          description="Especialistas verificados habilitados"
          icon={Users}
          color="emerald"
        />
        <KPICard
          title="Créditos Vendidos"
          value={`${kpis?.creditosVendidos ?? 0} CR`}
          description={`Equivale a $${(kpis?.dolaresRecaudados ?? 0).toFixed(2)} USD cobrados`}
          icon={DollarSign}
          color="amber"
        />
      </div>

      {/* Sección Informativa / Guías Rápidas */}
      <div className="bg-gradient-to-br from-indigo-950 via-zinc-900 to-zinc-950 dark:from-indigo-950/40 dark:via-zinc-900/80 dark:to-zinc-950/60 text-white p-6 rounded-2xl border border-zinc-800/80 dark:border-zinc-850/80 shadow-md shadow-indigo-950/10">
        <div className="flex items-center gap-2 text-indigo-400 mb-3">
          <Sparkles className="h-4 w-4" />
          <h4 className="text-xs font-black uppercase tracking-wider">Centro de Operaciones</h4>
        </div>
        <h3 className="text-base font-bold text-zinc-100">
          Bienvenido de vuelta al Panel de ConectaPro
        </h3>
        <p className="text-xs text-zinc-300 mt-2 leading-relaxed max-w-2xl font-semibold">
          Como administrador, tienes la responsabilidad de auditar y garantizar la fluidez del marketplace.
          Utiliza la barra lateral para navegar a las herramientas de revisión de comprobantes de pago (recargas),
          moderación y suspensión de usuarios reportados, y auditoría general de órdenes de servicio en curso.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 border-t border-zinc-800/40 pt-5 text-xs">
          <div className="space-y-1 bg-zinc-950/40 dark:bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800/60">
            <span className="font-bold text-indigo-400 text-xs">1. Validar Capturas</span>
            <p className="text-xs text-zinc-300 dark:text-zinc-300 leading-relaxed font-semibold">
              Compara el número de referencia e importe en banco antes de aprobar créditos a los profesionales.
            </p>
          </div>
          <div className="space-y-1 bg-zinc-950/40 dark:bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800/60">
            <span className="font-bold text-indigo-400 text-xs">2. Moderación Activa</span>
            <p className="text-xs text-zinc-300 dark:text-zinc-300 leading-relaxed font-semibold">
              Suspende de forma temporal a usuarios con mal comportamiento o sospechas de fraude off-platform.
            </p>
          </div>
          <div className="space-y-1 bg-zinc-950/40 dark:bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800/60">
            <span className="font-bold text-indigo-400 text-xs">3. Transacciones Atómicas</span>
            <p className="text-xs text-zinc-300 dark:text-zinc-300 leading-relaxed font-semibold">
              Las aprobaciones de créditos aplican cambios atómicos directos en la billetera mediante base de datos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
