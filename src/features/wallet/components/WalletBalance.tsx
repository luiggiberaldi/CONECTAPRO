import React from 'react';
import { Wallet, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface WalletBalanceProps {
  saldo: number;
  totalcargado: number;
  totalusado: number;
}

export default function WalletBalance({ saldo, totalcargado, totalusado }: WalletBalanceProps) {
  return (
    <div className="bg-gradient-to-br from-indigo-600 via-indigo-650 to-violet-700 text-white rounded-2xl p-4 sm:p-6 shadow-md border border-indigo-500/10">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-150">
          Balance Disponible
        </span>
        <div className="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
          <Wallet className="h-5 w-5 text-indigo-100" />
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-4xl font-extrabold tracking-tight">
          {saldo}
        </span>
        <span className="text-xs font-semibold text-indigo-200">
          {saldo === 1 ? 'crédito' : 'créditos'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 mt-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
            <ArrowUpCircle className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] text-indigo-200 font-medium leading-none">Cargados</p>
            <p className="text-sm font-bold text-white mt-1">{totalcargado} <span className="text-[9px] font-normal text-indigo-200">créd.</span></p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300">
            <ArrowDownCircle className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] text-indigo-200 font-medium leading-none">Usados</p>
            <p className="text-sm font-bold text-white mt-1">{totalusado} <span className="text-[9px] font-normal text-indigo-200">créd.</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
