'use client';

import React, { useState } from 'react';
import { AdminRecarga } from '../types';
import { Eye, Check, X, AlertCircle, Calendar, User, ChevronLeft, ChevronRight } from 'lucide-react';
import ConfirmModal from '@/components/shared/ConfirmModal';

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
      <div className="overflow-x-auto bg-white/75 dark:bg-zinc-900/75 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl shadow-sm">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-left text-xs">
          <thead className="bg-zinc-50/75 dark:bg-zinc-950/40 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-4">Profesional</th>
              <th scope="col" className="px-6 py-4">Paquete</th>
              <th scope="col" className="px-6 py-4">Monto (USD)</th>
              <th scope="col" className="px-6 py-4">Método</th>
              <th scope="col" className="px-6 py-4">Referencia</th>
              <th scope="col" className="px-6 py-4">Fecha</th>
              <th scope="col" className="px-6 py-4">Soporte</th>
              <th scope="col" className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-150 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
            {paginatedRecargas.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-zinc-400 dark:text-zinc-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="h-6 w-6 text-zinc-300" />
                    <span>No hay solicitudes de recarga pendientes de revisión.</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRecargas.map((recarga) => (
                <tr key={recarga.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-150">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-450 border border-zinc-200 dark:border-zinc-800">
                        <User className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-xs">{recarga.usuarios?.nombre || 'Profesional'}</span>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500">{recarga.usuarios?.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-indigo-600 dark:text-indigo-400">
                    {recarga.paquete} cr.
                  </td>
                  <td className="px-6 py-4 font-medium">
                    ${Number(recarga.montousd).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 uppercase font-bold text-[10px] tracking-wide text-zinc-500 dark:text-zinc-450">
                    {formatMetodo(recarga.metodopago)}
                  </td>
                  <td className="px-6 py-4 font-mono font-medium text-[11px] text-zinc-500 dark:text-zinc-400">
                    {recarga.referencia}
                  </td>
                  <td className="px-6 py-4 text-zinc-400">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(recarga.createdat).toLocaleDateString('es-VE')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleOpenViewer(recarga)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:text-zinc-900 dark:hover:text-zinc-100 font-semibold transition-all"
                    >
                      <Eye className="h-3 w-3" />
                      Ver Captura
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
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
                        className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-950/30 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 hover:bg-rose-100 dark:hover:hover:bg-rose-950/50 transition-colors"
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

      {/* Modal Visor de Captura */}
      {isViewerOpen && selectedRecarga && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-slide-in flex flex-col max-h-[85vh]">
            {/* Header del Modal */}
            <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/20">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-150">Comprobante de Pago</h3>
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
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
            <div className="flex-1 overflow-auto p-4 bg-zinc-950 flex items-center justify-center min-h-[300px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedRecarga.captura_url}
                alt={`Comprobante de referencia ${selectedRecarga.referencia}`}
                className="max-w-full max-h-[50vh] object-contain rounded"
              />
            </div>

            {/* Footer con Acciones */}
            <div className="px-5 py-4 border-t border-zinc-100 dark:border-zinc-800/60 flex justify-between items-center gap-2 bg-zinc-50/50 dark:bg-zinc-950/20">
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-500">Monto del Paquete</span>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {selectedRecarga.paquete} Créditos (${Number(selectedRecarga.montousd).toFixed(2)} USD)
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsViewerOpen(false);
                    setConfirmAction({ id: selectedRecarga.id, type: 'rechazar' });
                  }}
                  className="px-3 py-2 border border-rose-200 dark:border-rose-950/30 text-rose-650 hover:bg-rose-50 dark:hover:bg-rose-950/25 rounded-xl text-xs font-semibold transition-all active:scale-95"
                >
                  Rechazar
                </button>
                <button
                  onClick={() => {
                    setIsViewerOpen(false);
                    setConfirmAction({ id: selectedRecarga.id, type: 'aprobar' });
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-95"
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
