'use client';

import React from 'react';
import RouteGuard from '@/components/shared/RouteGuard';
import Navbar from '@/components/shared/Navbar';
import { CrearOrdenForm } from '@/features/ordenes';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NuevaOrdenPage() {
  return (
    <RouteGuard allowedRoles={['cliente']}>
      <Navbar />
      <main className="max-w-xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/cliente/ordenes"
            className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver a mis solicitudes
          </Link>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-3">
            Publicar nueva orden de servicio
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Cuéntanos qué necesitas resolver para recibir el contacto de profesionales verificados.
          </p>
        </div>

        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-6 py-8 border border-white/20 dark:border-zinc-800/30 rounded-2xl shadow-xl">
          <CrearOrdenForm />
        </div>
      </main>
    </RouteGuard>
  );
}
