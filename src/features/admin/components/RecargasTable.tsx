'use client';

import React, { useState } from 'react';
import { AdminRecarga } from '../types';
import { Eye, Check, X, AlertCircle, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
const ConfirmModal = dynamic(() => import('@/components/shared/ConfirmModal'));

interface RecargasTableProps {
  recargas: AdminRecarga[];
  onAprobar: (id: string) => Promise<void>;
  onRechazar: (id: string) => Promise<void>;
  loadingAction: string | null;
}

export default function RecargasTable({ recargas, onAprobar, onRechazar, loadingAction }: RecargasTableProps) {
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  // Modales
  const [selectedRecarga, setSelectedRecarga] = useState<AdminRecarga | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ id: string; type: 'aprobar' | 'rechazar' } | null>(null);

  // Derivados
  const totalPages = Math.max(1, Math.ceil(recargas.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRecargas = recargas.slice(startIndex, startIndex + pageSize);

  const handleOpenViewer = (recarga: AdminRecarga) => {
    setSelectedRecarga(recarga);
    setIsViewerOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!confirmAction) return;
    
    if (confirmAction.type === 'aprobar') {
      await onAprobar(confirmAction.id);
    } else {
      await onRechazar(confirmAction.id);
    }
    
    setConfirmAction(null);
    // Ajustar página actual si nos quedamos sin registros en la página actual
    const remainingCount = recargas.length - 1;
    const newTotalPages = Math.max(1, Math.ceil(remainingCount / pageSize));
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  };

  const formatMetodo = (metodo: string) => {
    switch (metodo) {
      case 'pagomovil':
        return 'Pago Móvil';
      case 'usdt':
        return 'USDT (Tether)';
      default:
        return 'Zelle';
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white/75 dark:bg-zinc-900/75 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full table-fixed min-w-[1000px] divide-y divide-zinc-200 dark:divide-zinc-800 text-left text-xs">
          <thead className="bg-zinc-50/75 dark:bg-zinc-950/40 text-xs font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-4 pt-8 pb-4 w-[22%]">Profesional</th>
              <th scope="col" className="px-4 pt-8 pb-4 w-[11%]">Paquete</th>
              <th scope="col" className="px-4 pt-8 pb-4 w-[12%]">Monto (USD)</th>
              <th scope="col" className="px-4 pt-8 pb-4 w-[13%]">Método</th>
              <th scope="col" className="px-4 pt-8 pb-4 w-[12%]">Referencia</th>
              <th scope="col" className="px-4 pt-8 pb-4 w-[11%]">Fecha</th>
              <th scope="col" className="px-4 pt-8 pb-4 w-[11%]">Soporte</th>
              <th scope="col" className="px-4 pt-8 pb-4 w-[8%] text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-150 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
            {paginatedRecargas.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-zinc-400 dark:text-zinc-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="h-6 w-6 text-zinc-300" />
                    <span>No hay solicitudes de recarga pendientes de revisión.</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRecargas.map((recarga) => (
                <tr key={recarga.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20 transition-colors">
                  <td className="px-4 py-4 font-medium text-zinc-900 dark:text-zinc-150">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-7 w-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-450 border border-zinc-200 dark:border-zinc-800 shrink-0">
                        <User className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex flex-col text-left min-w-0 max-w-[150px]">
                        <span className="block truncate font-bold text-xs" title={recarga.usuarios?.nombre || 'Profesional'}>{recarga.usuarios?.nombre || 'Profesional'}</span>
                        <span className="block truncate text-xs text-zinc-400 dark:text-zinc-500" title={recarga.usuarios?.email}>{recarga.usuarios?.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-bold text-indigo-600 dark:text-indigo-400">
                    {recarga.paquete} cr.
                  </td>
                  <td className="px-4 py-4 font-medium">
                    ${Number(recarga.montousd).toFixed(2)}
                  </td>
                  <td className="px-4 py-4">
                    {recarga.metodopago === 'pagomovil' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black border bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">
                        Pago Móvil
                      </span>
                    )}
                    {recarga.metodopago === 'usdt' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black border bg-amber-50 text-amber-700 border-amber-250 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30">
                        USDT (Tether)
                      </span>
                    )}
                    {recarga.metodopago !== 'pagomovil' && recarga.metodopago !== 'usdt' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black border bg-purple-50 text-purple-700 border-purple-250 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30">
                        {formatMetodo(recarga.metodopago)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 font-mono font-medium text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="block truncate" title={recarga.referencia}>{recarga.referencia}</span>
                  </td>
                  <td className="px-4 py-4 text-zinc-400">
                    <span className="inline-flex items-center gap-1 font-semibold">
                      <Calendar className="h-3 w-3" />
                      {new Date(recarga.createdat).toLocaleDateString('es-VE')}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => handleOpenViewer(recarga)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-indigo-200/60 dark:border-indigo-900/40 text-indigo-650 dark:text-indigo-400 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/30 font-bold transition-all active:scale-95"
                    >
                      <Eye className="h-3 w-3" />
                      Ver Captura
                    </button>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => setConfirmAction({ id: recarga.id, type: 'aprobar' })}
                        disabled={loadingAction === recarga.id}
                        className="p-1.5 rounded-lg border border-emerald-200 dark:border-emerald-950/30 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-colors"
                        title="Aprobar Recarga"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setConfirmAction({ id: recarga.id, type: 'rechazar' })}
                        disabled={loadingAction === recarga.id}
                        className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-950/30 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-455 hover:bg-rose-100 dark:hover:hover:bg-rose-950/50 transition-colors"
                        title="Rechazar Recarga"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div>

      {/* Controles de Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 text-xs">
          <span className="text-zinc-500">
            Mostrando registros {startIndex + 1}-{Math.min(startIndex + pageSize, recargas.length)} de {recargas.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 font-bold">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal Visor de Captura (Lightbox Glassmorphic) */}
      {isViewerOpen && selectedRecarga && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white/95 dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-850 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl shadow-zinc-950/20 animate-slide-in flex flex-col max-h-[85vh]">
            {/* Header del Modal */}
            <div className="px-5 py-4 border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/20">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-150">Comprobante de Pago</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-450 mt-0.5 font-medium">
                  Ref: {selectedRecarga.referencia} | Profesional: {selectedRecarga.usuarios?.nombre}
                </p>
              </div>
              <button
                onClick={() => setIsViewerOpen(false)}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Contenido (Imagen) */}
            <div className="flex-1 p-4 bg-zinc-950/90 flex items-center justify-center min-h-[300px] relative w-full aspect-[4/3] max-h-[50vh] overflow-hidden">
              <div className="relative w-full h-full rounded-lg overflow-hidden border border-zinc-800/80">
                <Image
                  src={selectedRecarga.captura_url}
                  alt={`Comprobante de referencia ${selectedRecarga.referencia}`}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>
            </div>

            {/* Footer con Acciones */}
            <div className="px-5 py-4 border-t border-zinc-200/50 dark:border-zinc-800/50 flex justify-between items-center gap-2 bg-zinc-50/50 dark:bg-zinc-950/20">
              <div className="text-left">
                <span className="text-xs uppercase font-bold text-zinc-450 dark:text-zinc-500 tracking-wider">Monto del Paquete</span>
                <p className="text-sm font-black text-indigo-600 dark:text-indigo-400">
                  {selectedRecarga.paquete} Créditos (${Number(selectedRecarga.montousd).toFixed(2)} USD)
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsViewerOpen(false);
                    setConfirmAction({ id: selectedRecarga.id, type: 'rechazar' });
                  }}
                  className="px-3.5 py-2 border border-rose-200 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl text-xs font-bold transition-all active:scale-95"
                >
                  Rechazar
                </button>
                <button
                  onClick={() => {
                    setIsViewerOpen(false);
                    setConfirmAction({ id: selectedRecarga.id, type: 'aprobar' });
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/10 transition-all active:scale-95"
                >
                  Aprobar Créditos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ConfirmModal para Aprobación o Rechazo */}
      <ConfirmModal
        isOpen={confirmAction !== null}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
        loading={confirmAction ? loadingAction === confirmAction.id : false}
        title={confirmAction?.type === 'aprobar' ? '¿Aprobar Recarga de Créditos?' : '¿Rechazar Recarga de Créditos?'}
        description={
          confirmAction?.type === 'aprobar'
            ? 'Al aprobar la recarga, los créditos solicitados se acreditarán de manera inmediata en la billetera del profesional y esta solicitud se marcará como procesada.'
            : 'Al rechazar la solicitud, el profesional verá el estado actualizado y no se abonará ningún crédito. Asegúrate de verificar el motivo antes del rechazo.'
        }
        confirmText={confirmAction?.type === 'aprobar' ? 'Sí, Aprobar' : 'Sí, Rechazar'}
        type={confirmAction?.type === 'aprobar' ? 'primary' : 'danger'}
        cancelText="Cancelar"
      />
    </div>
  );
}
