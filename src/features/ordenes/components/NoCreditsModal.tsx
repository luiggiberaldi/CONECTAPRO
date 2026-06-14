'use client';

import React from 'react';
import { Wallet2, AlertTriangle, X, ArrowUpRight } from 'lucide-react';

interface NoCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  saldo: number;
}

export default function NoCreditsModal({
  isOpen,
  onClose,
  onConfirm,
  saldo,
}: NoCreditsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl w-full max-w-md max-h-[calc(100vh-2rem)] flex flex-col overflow-hidden shadow-2xl animate-slide-in relative">
        
        {/* Banner de alerta con gradiente naranja/rosa */}
        <div className="relative bg-gradient-to-br from-rose-500 via-rose-600 to-rose-650 px-6 py-7 text-white text-center flex flex-col items-center flex-shrink-0">
          <div className="absolute top-[-50%] left-[-20%] w-[140%] h-[140%] rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: 'rgba(244, 63, 94, 0.15)' }} />
          
          {/* Botón de cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-white hover:bg-opacity-10 transition-colors z-10"
          >
            <X className="h-4.5 w-4.5" />
          </button>

          <div className="p-3 bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-2xl w-fit mb-3.5 shadow-inner animate-pulse-glow">
            <AlertTriangle className="h-7 w-7 text-status-warning" style={{ color: '#FBBF24' }} />
          </div>
          
          <h3 className="text-xl font-black tracking-tight text-white">
            Créditos Insuficientes
          </h3>
          <p className="text-xs text-zinc-100 mt-1 max-w-[280px]">
            No cuentas con suficientes créditos en tu billetera para aceptar este trabajo.
          </p>
        </div>


        {/* Contenido principal */}
        <div className="p-6 pb-10 space-y-6 overflow-y-auto flex-1">

          
          {/* Métrica de saldo */}
          <div className="bg-zinc-50 dark:bg-zinc-950/30 border border-zinc-100 dark:border-zinc-850/60 rounded-2xl p-5 text-center">
            <Wallet2 className="h-7 w-7 text-zinc-400 dark:text-zinc-600 mx-auto mb-2" />
            <span className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Tu Saldo de Créditos
            </span>
            <span className="block text-2xl font-black text-rose-650 dark:text-rose-400 mt-0.5">
              {saldo} <span className="text-sm font-bold">créditos</span>
            </span>
            <p className="text-xs text-zinc-500 dark:text-zinc-450 mt-2 max-w-xs mx-auto leading-relaxed">
              Necesitas un saldo mínimo de <span className="font-bold text-zinc-750 dark:text-zinc-250">1 crédito</span> para abrir contacto con el cliente y postularte a esta solicitud.
            </p>
          </div>

        </div>

        {/* Acciones */}
        <div className="bg-zinc-50 dark:bg-zinc-950/20 border-t border-zinc-150 dark:border-zinc-850 px-6 py-4.5 flex flex-col sm:flex-row gap-2.5">
          
          <button
            type="button"
            onClick={onClose}
            className="sm:w-1/3 py-2.5 text-xs font-bold text-zinc-650 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-100/50 dark:hover:bg-zinc-900 transition-colors"
          >
            Entendido
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 rounded-xl shadow-md shadow-rose-500/10 transition-all active:scale-98"
          >
            Ir a Recargar Wallet
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
