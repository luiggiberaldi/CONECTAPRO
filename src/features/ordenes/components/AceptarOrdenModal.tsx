'use client';

import React from 'react';
import { Coins, MessageSquare, Phone, ShieldCheck, X, ArrowRight } from 'lucide-react';
import Loader from '@/components/shared/Loader';

interface AceptarOrdenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  saldo: number;
  loading?: boolean;
}

export default function AceptarOrdenModal({
  isOpen,
  onClose,
  onConfirm,
  saldo,
  loading = false,
}: AceptarOrdenModalProps) {
  if (!isOpen) return null;

  const saldoFinal = Math.max(0, saldo - 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl w-full max-w-md max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden shadow-2xl animate-slide-in relative">
        
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-455 hover:text-zinc-650 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors z-10"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {/* Banner con gradiente premium y glow */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-650 to-purple-650 px-6 py-7 text-white text-center flex flex-col items-center flex-shrink-0">
          <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[140%] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl w-fit mb-3.5 shadow-inner animate-pulse-glow">
            <Coins className="h-7 w-7 text-indigo-200" />
          </div>
          
          <h3 className="text-xl font-black tracking-tight">
            ¿Aceptar esta orden de servicio?
          </h3>
          <p className="text-xs text-indigo-150 mt-1 max-w-[280px]">
            Conéctate de manera segura y directa para coordinar los detalles del trabajo.
          </p>
        </div>

        {/* Contenido principal */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Rejilla de comparación de saldo / créditos */}
          <div className="bg-zinc-50 dark:bg-zinc-950/30 border border-zinc-100 dark:border-zinc-850/60 rounded-2xl p-4">
            <div className="grid grid-cols-3 gap-2 text-center items-center">
              
              <div className="space-y-1">
                <span className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  Saldo Actual
                </span>
                <span className="block text-base font-extrabold text-zinc-700 dark:text-zinc-300">
                  {saldo} <span className="text-xs font-semibold">créd.</span>
                </span>
              </div>
              
              <div className="flex justify-center text-zinc-300 dark:text-zinc-700">
                <ArrowRight className="h-4 w-4" />
              </div>
              
              <div className="space-y-1">
                <span className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  Saldo Final
                </span>
                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 border border-indigo-100/30 dark:border-indigo-900/30">
                  {saldoFinal} créd.
                </span>
              </div>

            </div>

            {/* Subnota de costo */}
            <div className="text-center text-[10.5px] font-semibold text-zinc-450 dark:text-zinc-500 mt-3.5 border-t border-zinc-100 dark:border-zinc-850/60 pt-2.5">
              Costo de postulación: <span className="font-extrabold text-indigo-650 dark:text-indigo-455">1 Crédito</span> (descontado al aceptar).
            </div>
          </div>

          {/* Listado de beneficios / acceso */}
          <div className="space-y-3.5">
            <h4 className="text-[11px] font-bold text-zinc-455 dark:text-zinc-500 uppercase tracking-widest mb-1.5">
              Al aceptar este trabajo obtienes:
            </h4>
            
            {/* Beneficio 1 */}
            <div className="flex items-start gap-3">
              <div className="p-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-650 dark:text-emerald-400 rounded-lg flex-shrink-0 mt-0.5">
                <MessageSquare className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  Chat Privado Inmediato
                </p>
                <p className="text-[10.5px] text-zinc-500 dark:text-zinc-450 mt-0.5">
                  Establece contacto y chatea con el cliente directamente en la plataforma.
                </p>
              </div>
            </div>

            {/* Beneficio 2 */}
            <div className="flex items-start gap-3">
              <div className="p-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-650 dark:text-emerald-400 rounded-lg flex-shrink-0 mt-0.5">
                <Phone className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  Datos de Contacto Directos
                </p>
                <p className="text-[10.5px] text-zinc-500 dark:text-zinc-450 mt-0.5">
                  Accede al número telefónico del cliente para coordinar llamadas o visitas técnicas.
                </p>
              </div>
            </div>

            {/* Beneficio 3 */}
            <div className="flex items-start gap-3">
              <div className="p-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-650 dark:text-emerald-400 rounded-lg flex-shrink-0 mt-0.5">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  Sin Comisiones por Servicio
                </p>
                <p className="text-[10.5px] text-zinc-500 dark:text-zinc-450 mt-0.5">
                  Conserva el 100% de lo cobrado. ConectaPro no cobra tarifas sobre tu cotización.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* Acciones del pie de página */}
        <div className="bg-zinc-50 dark:bg-zinc-950/20 border-t border-zinc-150 dark:border-zinc-850 px-6 py-4.5 flex flex-col sm:flex-row gap-2.5">
          
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="sm:w-1/3 py-2.5 text-xs font-bold text-zinc-650 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-100/50 dark:hover:bg-zinc-900 transition-colors disabled:opacity-50"
          >
            Volver
          </button>
          
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/15 transition-all active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <Loader size="sm" />
            ) : (
              <>
                <Coins className="h-4 w-4 text-indigo-200" />
                Aceptar y Descontar 1 Crédito
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
