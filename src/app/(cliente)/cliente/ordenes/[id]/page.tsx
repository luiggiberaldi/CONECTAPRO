'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useOrdenDetalle } from '@/features/ordenes/hooks/useOrdenDetalle';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ArrowLeft, Calendar, MapPin, AlertCircle, User, CheckCircle } from 'lucide-react';
import Loader from '@/components/shared/Loader';
import dynamic from 'next/dynamic';
const ConfirmModal = dynamic(() => import('@/components/shared/ConfirmModal'));
import Link from 'next/link';
import { ChatWindow } from '@/features/chat';
import { CalificacionForm, haCalificadoOrden } from '@/features/profesionales';

export default function ClienteOrdenDetallePage() {
  const { id } = useParams() as { id: string };
  const { usuario } = useAuth();
  const { orden, loading, actionLoading, cargarDetalle, completarOrden } = useOrdenDetalle();

  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [yaCalifico, setYaCalifico] = useState(false);
  const [checkingCalificacion, setCheckingCalificacion] = useState(true);

  useEffect(() => {
    if (id) {
      cargarDetalle(id);
    }
  }, [id, cargarDetalle]);

  useEffect(() => {
    let active = true;

    async function checkRating() {
      if (id && usuario?.id) {
        setCheckingCalificacion(true);
        const rated = await haCalificadoOrden(id, usuario.id);
        if (active) {
          setYaCalifico(rated);
          setCheckingCalificacion(false);
        }
      } else {
        setCheckingCalificacion(false);
      }
    }
    checkRating();

    return () => {
      active = false;
      setYaCalifico(false);
    };
  }, [id, usuario?.id]);

  const handleCompletar = async () => {
    if (!usuario) return;
    setIsCompleteModalOpen(false);
    await completarOrden(id, usuario.id);
  };

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
          <Loader size="lg" />
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-4">Cargando detalles de la orden...</p>
        </div>
    );
  }

  if (!orden) {
    return (
        <div className="max-w-md mx-auto mt-12 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center rounded-2xl shadow-xl">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Orden no encontrada</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">La solicitud que intentas consultar no existe o fue eliminada.</p>
          <Link href="/cliente/ordenes" className="inline-block mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-sm">
            Volver a mis solicitudes
          </Link>
        </div>
    );
  }

  const { titulo, descripcion, ciudad, zona, estado, createdat, urgencia, categoria, profesional, cliente } = orden;

  const getUrgencyBadgeColor = () => {
    return urgencia === 'hoy'
      ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400'
      : 'bg-zinc-100 text-zinc-650 border-zinc-200 dark:bg-zinc-850 dark:text-zinc-350';
  };

  const getStatusBadgeColor = () => {
    switch (estado) {
      case 'pendiente':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400';
      case 'en_proceso':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400';
      case 'completada':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400';
      default:
        return 'bg-zinc-100 text-zinc-650 border-zinc-200';
    }
  };

  return (
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/cliente/ordenes"
            className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver a mis solicitudes
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Lado Izquierdo: Detalle de Orden */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-150 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50/50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
                  <span className="capitalize">{categoria?.nombre}</span>
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border capitalize ${getStatusBadgeColor()}`}>
                  {estado.replace('_', ' ')}
                </span>
              </div>

              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                {titulo}
              </h2>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                  Creado el {new Date(createdat).toLocaleDateString('es-VE')}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                  {ciudad}, {zona}
                </span>
              </p>

              <div className="border-t border-zinc-100 dark:border-zinc-800/60 my-5 pt-4">
                <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
                  Descripción del problema
                </h4>
                <p className="text-xs text-zinc-650 dark:text-zinc-350 mt-2 whitespace-pre-line leading-relaxed">
                  {descripcion}
                </p>
              </div>

              <div className="border-t border-zinc-100 dark:border-zinc-800/60 pt-4 flex items-center justify-between">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Prioridad:</span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getUrgencyBadgeColor()}`}>
                  {urgencia === 'hoy' ? 'Urgente (Hoy)' : 'Esta semana'}
                </span>
              </div>
            </div>

            {/* Panel de Chat */}
            {estado !== 'pendiente' && (
              <ChatWindow
                ordenId={id}
                usuarioId={usuario?.id || ''}
                clienteNombre={cliente?.nombre || 'Cliente'}
                profesionalNombre={profesional?.nombre || 'Profesional'}
                ordenEstado={estado}
              />
            )}
          </div>

          {/* Lado Derecho: Info del Profesional Asignado */}
          <div className="space-y-6">
            {estado === 'pendiente' && (
              <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-blue-500/10 rounded-2xl p-5 shadow-sm text-center">
                <AlertCircle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h3 className="text-xs font-bold text-blue-700 dark:text-blue-450">Buscando profesional</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  Tu orden está en espera. Los profesionales calificados de la categoría <span className="font-semibold text-zinc-700 dark:text-zinc-300">{categoria?.nombre}</span> ya pueden verla y aceptarla. Te notificaremos de inmediato.
                </p>
              </div>
            )}

            {estado === 'en_proceso' && profesional && (
              <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-150 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide mb-4">
                  Profesional Asignado
                </h3>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-850 flex items-center justify-center text-zinc-500 flex-shrink-0">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{profesional.nombre}</h4>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">{categoria?.nombre}</span>
                  </div>
                </div>

                <div className="border-t border-zinc-100 dark:border-zinc-800/60 my-4 pt-4 space-y-2.5 text-xs text-zinc-500 dark:text-zinc-400">
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-250">{profesional.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ubicación:</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-250">{profesional.ciudad || 'No especificada'}</span>
                  </div>
                </div>

                <div className="border-t border-zinc-100 dark:border-zinc-800/60 pt-4 mt-4">
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => setIsCompleteModalOpen(true)}
                    className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm py-2.5 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Finalizar Servicio
                  </button>
                </div>
              </div>
            )}

            {estado === 'completada' && (
              <div className="space-y-4">
                {checkingCalificacion ? (
                  <div className="flex items-center justify-center p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                    <Loader size="sm" />
                  </div>
                ) : yaCalifico ? (
                  <div className="bg-emerald-50/35 dark:bg-emerald-950/15 border border-emerald-500/15 rounded-2xl p-5 shadow-sm text-center">
                    <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                    <h3 className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Servicio Completado</h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                      ¡Ya has calificado este servicio! Gracias por compartir tu reseña para ayudar a mantener la confianza en ConectaPro.
                    </p>
                  </div>
                ) : (
                  profesional && (
                    <CalificacionForm
                      ordenid={id}
                      calificadorpor={usuario?.id || ''}
                      calificadoa={profesional.id}
                      onSuccess={() => {
                        setYaCalifico(true);
                        cargarDetalle(id);
                      }}
                      title="Califica al profesional"
                      placeholder="Describe cómo fue el trabajo realizado por el profesional, su puntualidad y calidad..."
                    />
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal de Finalización */}
        <ConfirmModal
          isOpen={isCompleteModalOpen}
          onClose={() => setIsCompleteModalOpen(false)}
          onConfirm={handleCompletar}
          title="¿Marcar el servicio como Completado?"
          description="Al completar el servicio, confirmas que el profesional ha finalizado el trabajo de manera satisfactoria. Esta acción habilitará las valoraciones y cerrará el canal de chat."
          confirmText="Sí, Completar Servicio"
          cancelText="Cancelar"
          loading={actionLoading}
        />
      </main>
  );
}
