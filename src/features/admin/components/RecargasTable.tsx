'use client';

import React, { useState } from 'react';
import { AdminRecarga } from '../types';
import { Eye, Check, X, AlertCircle, Calendar, User, ChevronLeft, ChevronRight, Copy, FileText, ImageOff, CreditCard, Clock, ExternalLink } from 'lucide-react';
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
  
  // Modales y estados de visualización
  const [selectedRecarga, setSelectedRecarga] = useState<AdminRecarga | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ id: string; type: 'aprobar' | 'rechazar' } | null>(null);
  
  // Estados para mejor UX del modal
  const [imageError, setImageError] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  // Derivados
  const totalPages = Math.max(1, Math.ceil(recargas.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRecargas = recargas.slice(startIndex, startIndex + pageSize);

  const handleOpenViewer = (recarga: AdminRecarga) => {
    setSelectedRecarga(recarga);
    setImageError(false);
    setCopiedRef(false);
    setIsViewerOpen(true);
  };

  const handleCopyRef = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
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
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-450 border border-zinc-200 dark:border-zinc-800 shrink-0">
                        <User className="h-4 w-4" />
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
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-black border bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">
                        Pago Móvil
                      </span>
                    )}
                    {recarga.metodopago === 'usdt' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-black border bg-amber-50 text-amber-700 border-amber-250 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30">
                        USDT (Tether)
                      </span>
                    )}
                    {recarga.metodopago !== 'pagomovil' && recarga.metodopago !== 'usdt' && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-black border bg-purple-50 text-purple-700 border-purple-250 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30">
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
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-indigo-200/60 dark:border-indigo-900/40 text-indigo-650 dark:text-indigo-400 hover:bg-indigo-50/60 dark:hover:bg-indigo-950/30 font-bold transition-all active:scale-95"
                    >
                      <Eye className="h-3 w-3" />
                      Ver Captura
                    </button>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => setConfirmAction({ id: recarga.id, type: 'aprobar' })}
                        disabled={loadingAction === recarga.id}
                        className="p-2 rounded-lg border border-emerald-200 dark:border-emerald-950/30 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 transition-colors"
                        title="Aprobar Recarga"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setConfirmAction({ id: recarga.id, type: 'rechazar' })}
                        disabled={loadingAction === recarga.id}
                        className="p-2 rounded-lg border border-rose-200 dark:border-rose-950/30 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-455 hover:bg-rose-100 dark:hover:hover:bg-rose-950/50 transition-colors"
                        title="Rechazar Recarga"
                      >
                        <X className="h-4 w-4" />
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
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 font-bold">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal Visor de Captura (Lightbox Premium) */}
      {isViewerOpen && selectedRecarga && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[92vh] animate-slide-in">
            {/* Header del Modal */}
            <div className="px-6 pb-4 border-b border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/20" style={{ paddingTop: '32px' }}>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <div className="text-left">
                  <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50">Revisión de Comprobante</h3>
                  <p className="text-[10px] text-zinc-450 dark:text-zinc-500 mt-1">Verifica detalladamente el reporte antes de acreditar</p>
                </div>
              </div>
              <button
                onClick={() => setIsViewerOpen(false)}
                className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-450 hover:text-zinc-750 dark:hover:text-zinc-250 transition-all active:scale-95"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Contenido del Modal (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              
              {/* Contenedor del Comprobante (Imagen o Fallback Digital) */}
              <div className="relative w-full h-[260px] bg-zinc-950/5 dark:bg-zinc-950/40 border border-zinc-200/60 dark:border-zinc-800/80 rounded-2xl overflow-hidden flex items-center justify-center group shadow-inner">
                {!imageError ? (
                  <>
                    <Image
                      src={selectedRecarga.captura_url}
                      alt={`Comprobante de referencia ${selectedRecarga.referencia}`}
                      fill
                      className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.02]"
                      sizes="(max-width: 768px) 100vw, 450px"
                      onError={() => setImageError(true)}
                    />
                    {/* Botón Flotante para Abrir en Nueva Pestaña */}
                    <a
                      href={selectedRecarga.captura_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-3 right-3 px-3 py-1 bg-zinc-950/80 hover:bg-zinc-950 text-white rounded-xl backdrop-blur-md shadow border border-zinc-800/50 transition-all active:scale-95 opacity-0 group-hover:opacity-100 duration-200 flex items-center gap-2 text-[11px] font-bold"
                      title="Abrir en pestaña nueva"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>Ver original</span>
                    </a>
                  </>
                ) : (
                  /* Fallback de Boleto/Ticket Digital */
                  <div className="w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br from-zinc-50 to-zinc-100/50 dark:from-zinc-900/60 dark:to-zinc-950/40 relative overflow-hidden text-left">
                    {/* Marca de agua decorativa */}
                    <FileText className="absolute h-20 w-20 pointer-events-none" style={{ right: '-20px', bottom: '-20px', color: 'currentColor', opacity: 0.05 }} />
                    
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/30 flex items-center justify-center text-amber-500 shrink-0">
                        <ImageOff className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Captura no disponible</span>
                        <p className="text-[10px] text-zinc-450 dark:text-zinc-500 mt-1">La imagen del comprobante no pudo cargarse o no está disponible en este servidor.</p>
                      </div>
                    </div>

                    <div className="my-auto py-4 border-y border-dashed border-zinc-200/80 dark:border-zinc-800/80">
                      <span className="text-[10px] uppercase font-bold text-zinc-450 dark:text-zinc-500 tracking-wider">Verificación de Transacción</span>
                      <div className="mt-3 space-y-2 text-xs font-medium text-zinc-650 dark:text-zinc-400">
                        <div className="flex justify-between"><span className="text-zinc-400 dark:text-zinc-500">Referencia de Pago:</span><span className="font-mono text-zinc-850 dark:text-zinc-150 font-bold">{selectedRecarga.referencia}</span></div>
                        <div className="flex justify-between"><span className="text-zinc-400 dark:text-zinc-500">Monto Reportado:</span><span className="text-zinc-850 dark:text-zinc-150 font-bold">${Number(selectedRecarga.montousd).toFixed(2)} USD</span></div>
                        <div className="flex justify-between"><span className="text-zinc-400 dark:text-zinc-500">Paquete Adquirido:</span><span className="text-indigo-600 dark:text-indigo-400 font-black">{selectedRecarga.paquete} Créditos</span></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-zinc-400 dark:text-zinc-500">
                      <span>ConectaPro Digital Voucher</span>
                      <span className="font-mono">{new Date(selectedRecarga.createdat).toLocaleString('es-VE')}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Grid de Detalles Administrativos */}
              <div className="bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-150 dark:border-zinc-850 rounded-2xl p-5 text-left space-y-4">
                <h4 className="text-xs uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider">Detalles de la Transacción</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Profesional */}
                  <div className="flex gap-2 min-w-0">
                    <div className="h-8 w-8 rounded-xl bg-zinc-100 dark:bg-zinc-850 border border-zinc-250/60 dark:border-zinc-800 flex items-center justify-center text-zinc-500 shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] text-zinc-450 dark:text-zinc-500">Profesional</span>
                      <span className="text-xs font-black text-zinc-800 dark:text-zinc-200 truncate" title={selectedRecarga.usuarios?.nombre}>
                        {selectedRecarga.usuarios?.nombre}
                      </span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate" title={selectedRecarga.usuarios?.email}>
                        {selectedRecarga.usuarios?.email}
                      </span>
                    </div>
                  </div>

                  {/* Método de Pago */}
                  <div className="flex gap-2">
                    <div className="h-8 w-8 rounded-xl bg-zinc-100 dark:bg-zinc-850 border border-zinc-250/60 dark:border-zinc-800 flex items-center justify-center text-zinc-500 shrink-0">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-zinc-450 dark:text-zinc-500">Método de Pago</span>
                      <div className="mt-1">
                        {selectedRecarga.metodopago === 'pagomovil' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">
                            Pago Móvil
                          </span>
                        )}
                        {selectedRecarga.metodopago === 'usdt' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30">
                            USDT (Tether)
                          </span>
                        )}
                        {selectedRecarga.metodopago !== 'pagomovil' && selectedRecarga.metodopago !== 'usdt' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-black bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30">
                            {formatMetodo(selectedRecarga.metodopago)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Referencia */}
                  <div className="flex gap-2 min-w-0">
                    <div className="h-8 w-8 rounded-xl bg-zinc-100 dark:bg-zinc-850 border border-zinc-250/60 dark:border-zinc-800 flex items-center justify-center text-zinc-500 shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-[10px] text-zinc-450 dark:text-zinc-500">Referencia</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200 truncate">{selectedRecarga.referencia}</span>
                        <button
                          onClick={() => handleCopyRef(selectedRecarga.referencia)}
                          className="p-1 hover:bg-zinc-150 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300 rounded-lg transition-colors shrink-0"
                          title="Copiar Referencia"
                        >
                          {copiedRef ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Fecha de Envío */}
                  <div className="flex gap-2">
                    <div className="h-8 w-8 rounded-xl bg-zinc-100 dark:bg-zinc-850 border border-zinc-250/60 dark:border-zinc-800 flex items-center justify-center text-zinc-500 shrink-0">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-zinc-450 dark:text-zinc-500">Fecha de Reporte</span>
                      <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-255 mt-1">
                        {new Date(selectedRecarga.createdat).toLocaleString('es-VE', { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer con Acciones */}
            <div className="px-6 border-t border-zinc-150 dark:border-zinc-800/60 flex justify-between items-center gap-3 bg-zinc-50/50 dark:bg-zinc-950/20" style={{ paddingTop: '24px', paddingBottom: '40px' }}>
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-555 tracking-wider">Acreditar Paquete</span>
                <p className="text-sm font-black text-indigo-600 dark:text-indigo-400 mt-1">
                  +{selectedRecarga.paquete} Créditos
                  <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-550 ml-2">
                    (${Number(selectedRecarga.montousd).toFixed(2)} USD)
                  </span>
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => {
                    setIsViewerOpen(false);
                    setConfirmAction({ id: selectedRecarga.id, type: 'rechazar' });
                  }}
                  className="px-4 py-2 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-455 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl text-xs font-bold transition-all active:scale-95"
                >
                  Rechazar
                </button>
                <button
                  onClick={() => {
                    setIsViewerOpen(false);
                    setConfirmAction({ id: selectedRecarga.id, type: 'aprobar' });
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-1"
                >
                  <Check className="h-4 w-4" />
                  <span>Aprobar</span>
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
