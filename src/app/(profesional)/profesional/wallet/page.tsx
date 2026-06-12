'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  useWallet,
  WalletBalance,
  PaquetesGrid,
  RecargaForm,
  HistorialRecargas
} from '@/features/wallet';
import { Loader2 } from 'lucide-react';

export default function ProfesionalWalletPage() {
  const { usuario } = useAuth();
  const {
    saldo,
    totalcargado,
    totalusado,
    historial,
    loading,
    actionLoading,
    cargarDatos,
    registrarRecarga
  } = useWallet(usuario?.id || '');

  const [paqueteSeleccionado, setPaqueteSeleccionado] = useState<number | null>(null);

  useEffect(() => {
    if (usuario?.id) {
      cargarDatos();
    }
  }, [usuario, cargarDatos]);

  const handleRecargaSubmit = async (
    metodopago: 'pagomovil' | 'zelle' | 'usdt',
    referencia: string,
    capturaFile: File
  ): Promise<boolean> => {
    if (!paqueteSeleccionado) return false;
    
    const success = await registrarRecarga(
      paqueteSeleccionado,
      metodopago,
      referencia,
      capturaFile
    );

    if (success) {
      setPaqueteSeleccionado(null); // Resetear selección al completar con éxito
    }
    return success;
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
            Mi Billetera
          </h1>
          <p className="text-xs text-zinc-450 dark:text-zinc-500 mt-1">
            Administra tus créditos, adquiere nuevos paquetes y consulta el historial de recargas de tu cuenta.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[45vh] p-4 text-center">
            <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-2" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Cargando detalles de tu billetera...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Columna Izquierda (1/3): Balance y Formulario de Recarga */}
            <div className="space-y-6 lg:col-span-1">
              <WalletBalance
                saldo={saldo}
                totalcargado={totalcargado}
                totalusado={totalusado}
              />
              
              <RecargaForm
                paquete={paqueteSeleccionado}
                onSubmit={handleRecargaSubmit}
                loading={actionLoading}
              />
            </div>

            {/* Columna Derecha (2/3): Selección de Paquetes e Historial */}
            <div className="space-y-6 lg:col-span-2">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm">
                <PaquetesGrid
                  paqueteSeleccionado={paqueteSeleccionado}
                  onSelect={setPaqueteSeleccionado}
                />
              </div>

              <HistorialRecargas recargas={historial} />
            </div>
          </div>
        )}
    </main>
  );
}
