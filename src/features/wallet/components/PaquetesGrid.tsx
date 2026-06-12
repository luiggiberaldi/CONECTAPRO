import React from 'react';
import { Coins, Check, Zap } from 'lucide-react';

interface Paquete {
  creditos: number;
  precio: number;
  popular?: boolean;
  descripcion: string;
}

interface PaquetesGridProps {
  paqueteSeleccionado: number | null;
  onSelect: (creditos: number) => void;
}

const PAQUETES: Paquete[] = [
  {
    creditos: 10,
    precio: 12.00,
    descripcion: 'Ideal para probar la plataforma y realizar tus primeros contactos.',
  },
  {
    creditos: 20,
    precio: 24.00,
    popular: true,
    descripcion: 'El más elegido. Proporciona estabilidad y flujo constante de clientes.',
  },
  {
    creditos: 50,
    precio: 60.00,
    descripcion: 'Ahorra tiempo. Para profesionales con alta demanda de servicios.',
  },
];

export default function PaquetesGrid({ paqueteSeleccionado, onSelect }: PaquetesGridProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
          <Coins className="h-4.5 w-4.5 text-indigo-500" />
          Selecciona un Paquete de Créditos
        </h3>
        <p className="text-[10px] text-zinc-450 dark:text-zinc-500 mt-0.5">
          Cada orden de servicio aceptada consume exactamente 1 crédito ($1.20 USD).
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PAQUETES.map((pkg) => {
          const esSeleccionado = paqueteSeleccionado === pkg.creditos;
          return (
            <div
              key={pkg.creditos}
              onClick={() => onSelect(pkg.creditos)}
              className={`relative cursor-pointer flex flex-col justify-between rounded-2xl p-5 border transition-all ${
                esSeleccionado
                  ? 'border-indigo-650 bg-indigo-50/20 dark:bg-indigo-950/10 ring-1 ring-indigo-650'
                  : pkg.popular
                  ? 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-2.5 right-4 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[8px] font-black uppercase bg-indigo-600 text-white shadow-sm">
                  <Zap className="h-2.5 w-2.5 fill-white" />
                  Recomendado
                </span>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                    {pkg.creditos} Créditos
                  </span>
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center transition-colors ${
                    esSeleccionado
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-zinc-300 dark:border-zinc-700'
                  }`}>
                    {esSeleccionado && <Check className="h-3 w-3" />}
                  </div>
                </div>

                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-relaxed mb-4">
                  {pkg.descripcion}
                </p>
              </div>

              <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-3 mt-2 flex items-baseline justify-between">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-550">Precio</span>
                <span className="text-base font-black text-zinc-900 dark:text-zinc-100">
                  ${pkg.precio.toFixed(2)} <span className="text-[10px] font-normal text-zinc-450">USD</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
