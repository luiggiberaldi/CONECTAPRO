import React, { useState } from 'react';
import { Recarga } from '@/types';
import { CreditCard, Calendar, Eye, ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface HistorialRecargasProps {
  recargas: Recarga[] | null;
}

const ROWS_PER_PAGE = 10;

export default function HistorialRecargas({ recargas }: HistorialRecargasProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [verCapturaUrl, setVerCapturaUrl] = useState<string | null>(null);

  if (!recargas || recargas.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide mb-4">
          Historial de Solicitudes
        </h3>
        <div className="flex flex-col items-center justify-center py-8 text-center text-zinc-400">
          <CreditCard className="h-8 w-8 text-zinc-300 dark:text-zinc-700 mb-2 border border-dashed border-zinc-200 dark:border-zinc-850 p-1.5 rounded-lg" />
          <p className="text-[10px] font-semibold text-zinc-650 dark:text-zinc-400">Sin recargas registradas</p>
          <p className="text-[9px] text-zinc-400 dark:text-zinc-500 max-w-[200px] mt-0.5">
            Tus solicitudes de recarga y su estado se listarán en esta sección.
          </p>
        </div>
      </div>
    );
  }

  // Lógica de Paginación
  const totalPages = Math.ceil(recargas.length / ROWS_PER_PAGE);
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const paginatedRecargas = recargas.slice(startIndex, startIndex + ROWS_PER_PAGE);

  const getStatusBadgeClass = (estado: string) => {
    switch (estado) {
      case 'aprobada':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30';
      case 'rechazada':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30';
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold text-zinc-850 dark:text-zinc-150 uppercase tracking-wide">
          Historial de Solicitudes
        </h3>
        <span className="text-[9px] font-semibold text-zinc-400 dark:text-zinc-500">
          Total: {recargas.length} {recargas.length === 1 ? 'solicitud' : 'solicitudes'}
        </span>
      </div>

      <div className="overflow-x-auto border border-zinc-100 dark:border-zinc-800/80 rounded-xl">
        <table className="min-w-full divide-y divide-zinc-100 dark:divide-zinc-800/80 text-left text-xs">
          <thead className="bg-zinc-50/50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 font-bold">
            <tr>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider">Fecha</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider">Método</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider">Referencia</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-right">Créditos</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-right">Monto</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-center">Estado</th>
              <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-center">Captura</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
            {paginatedRecargas.map((recarga) => (
              <tr key={recarga.id} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/30">
                <td className="px-4 py-2.5 whitespace-nowrap text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(recarga.createdat).toLocaleDateString('es-VE')}
                  </span>
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap capitalize text-[11px]">
                  {recarga.metodopago === 'pagomovil' ? 'Pago Móvil' : recarga.metodopago}
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap text-[11px] font-semibold text-zinc-800 dark:text-zinc-200">
                  {recarga.referencia}
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap text-right text-[11px] font-bold">
                  {recarga.paquete}
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap text-right text-[11px] font-bold text-zinc-900 dark:text-zinc-100">
                  ${Number(recarga.montousd).toFixed(2)}
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap text-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border capitalize ${getStatusBadgeClass(recarga.estado)}`}>
                    {recarga.estado}
                  </span>
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap text-center">
                  <button
                    type="button"
                    onClick={() => setVerCapturaUrl(recarga.captura_url)}
                    className="inline-flex items-center justify-center p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-450 hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors"
                    title="Ver comprobante de pago"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Controles de Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 pt-4 mt-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-650 dark:text-zinc-350 transition-colors disabled:opacity-50 disabled:hover:bg-white dark:disabled:hover:bg-zinc-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Anterior
          </button>
          
          <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500">
            Página {currentPage} de {totalPages}
          </span>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-650 dark:text-zinc-350 transition-colors disabled:opacity-50 disabled:hover:bg-white dark:disabled:hover:bg-zinc-900"
          >
            Siguiente
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Modal para ver la captura de pago */}
      {verCapturaUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm transition-all"
          onClick={() => setVerCapturaUrl(null)}
        >
          <div
            className="relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden max-w-lg w-full max-h-[85vh] p-3 shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full aspect-[4/3] max-h-[70vh] rounded-xl overflow-hidden min-h-[250px] min-w-[280px] md:min-w-[400px]">
              <Image
                src={verCapturaUrl}
                alt="Comprobante de pago"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
            <button
              type="button"
              onClick={() => setVerCapturaUrl(null)}
              className="mt-3 px-4 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-750 dark:text-zinc-250 transition-colors shadow-sm"
            >
              Cerrar Vista
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
