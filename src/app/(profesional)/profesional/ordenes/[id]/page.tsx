'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import RouteGuard from '@/components/shared/RouteGuard';
import Navbar from '@/components/shared/Navbar';
import { useOrdenDetalle } from '@/features/ordenes/hooks/useOrdenDetalle';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { AceptarOrdenButton } from '@/features/ordenes';
import ConfirmModal from '@/components/shared/ConfirmModal';
import { supabaseBrowser } from '@/lib/supabase';
import { Loader2, ArrowLeft, Calendar, MapPin, AlertCircle, User, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Profesional } from '@/types';
import { ChatWindow } from '@/features/chat';
import { CalificacionForm, haCalificadoOrden } from '@/features/profesionales';

export default function ProfesionalOrdenDetallePage() {
  const { id } = useParams() as { id: string };
  const { usuario } = useAuth();
  const { orden, loading, actionLoading, cargarDetalle, aceptarOrden, completarOrden } = useOrdenDetalle();

  const [profesional, setProfesional] = useState<Profesional | null>(null);
  const [loadingProf, setLoadingProf] = useState(true);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [yaCalifico, setYaCalifico] = useState(false);
  const [checkingCalificacion, setCheckingCalificacion] = useState(true);

  // Cargar datos de profesional vinculados
  useEffect(() => {
    async function loadProfesional() {
      if (!usuario?.id) return;
      try {
        const { data, error } = await supabaseBrowser
          .from('profesionales')
          .select('*')
          .eq('usuarioid', usuario.id)
          .single();
        if (error) throw error;
        if (data) {
          setProfesional(data);
        }
      } catch (err) {
        console.error('Error al cargar profesional:', err);
      } finally {
        setLoadingProf(false);
      }
    }
    loadProfesional();
  }, [usuario]);

  useEffect(() => {
    if (id) {
      cargarDetalle(id);
    }
  }, [id, cargarDetalle]);

  useEffect(() => {
    async function checkRating() {
      if (id && usuario?.id) {
        const rated = await haCalificadoOrden(id, usuario.id);
        setYaCalifico(rated);
        setCheckingCalificacion(false);
      }
    }
    checkRating();
  }, [id, usuario]);

  const handleAceptarSuccess = async (oid: string, pid: string): Promise<boolean> => {
    return await aceptarOrden(oid, pid);
  };

  const handleCompletar = async () => {
    if (!usuario) return;
    setIsCompleteModalOpen(false);
    await completarOrden(id, usuario.id);
  };

  if (loading || loadingProf) {
    return (
      <RouteGuard allowedRoles={['profesional']}>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-2" />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Cargando detalles de la orden...</p>
        </div>
      </RouteGuard>
    );
  }

  if (!orden) {
    return (
      <RouteGuard allowedRoles={['profesional']}>
        <Navbar />
        <div className="max-w-md mx-auto mt-12 p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center rounded-2xl shadow-xl">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Orden no encontrada</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">La solicitud que intentas consultar no existe o ya no está disponible.</p>
          <Link href="/profesional/ordenes" className="inline-block mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-sm">
            Volver a trabajos disponibles
          </Link>
        </div>
      </RouteGuard>
    );
  }

  const { titulo, descripcion, ciudad, zona, estado, createdat, urgencia, categoria, cliente } = orden;

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

  // Verificar si esta orden está asignada a este profesional
  const esAsignadoAmi = orden.profesionalid === usuario?.id;

  return (
    <RouteGuard allowedRoles={['profesional']}>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/profesional/ordenes"
            className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver a trabajos disponibles
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
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getStatusBadgeColor()}`}>
                  {estado.replace('_', ' ')}
                </span>
              </div>

              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                {titulo}
              </h2>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                  Publicado el {new Date(createdat).toLocaleDateString('es-VE')}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                  {ciudad}, {zona}
                </span>
              </p>

              <div className="border-t border-zinc-100 dark:border-zinc-800/60 my-5 pt-4">
                <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide">
                  Detalles del trabajo solicitado
                </h4>
                <p className="text-xs text-zinc-650 dark:text-zinc-350 mt-2 whitespace-pre-line leading-relaxed">
                  {descripcion}
                </p>
              </div>

              <div className="border-t border-zinc-100 dark:border-zinc-800/60 pt-4 flex items-center justify-between">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Nivel de urgencia:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getUrgencyBadgeColor()}`}>
                  {urgencia === 'hoy' ? 'Urgente (Hoy)' : 'Esta semana'}
                </span>
              </div>
            </div>

            {/* Panel de Chat */}
            {estado !== 'pendiente' && esAsignadoAmi && (
              <ChatWindow
                ordenId={id}
                usuarioId={usuario?.id || ''}
                clienteNombre={cliente?.nombre || 'Cliente'}
                profesionalNombre={usuario?.nombre || 'Profesional'}
                ordenEstado={estado}
              />
            )}
          </div>

          {/* Lado Derecho: Acciones o Detalles del Cliente */}
          <div className="space-y-6">
            {estado === 'pendiente' && profesional && (
              <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-150 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide mb-4">
                  Acción requerida
                </h3>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed">
                  Para acceder al chat interno y contactar al cliente, debes aceptar el trabajo. Esto tiene un costo de 1 crédito.
                </p>
                <AceptarOrdenButton
                  ordenid={id}
                  profesionalid={profesional.usuarioid}
                  onSuccess={handleAceptarSuccess}
                  actionLoading={actionLoading}
                />
              </div>
            )}

            {estado === 'en_proceso' && esAsignadoAmi && cliente && (
              <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-150 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm">
                <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wide mb-4">
                  Datos del Cliente
                </h3>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-855 border border-zinc-200 dark:border-zinc-850 flex items-center justify-center text-zinc-500 flex-shrink-0">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{cliente.nombre}</h4>
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400">Cliente contratista</span>
                  </div>
                </div>

                <div className="border-t border-zinc-100 dark:border-zinc-800/60 my-4 pt-4 space-y-2.5 text-xs text-zinc-500 dark:text-zinc-400">
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-250">{cliente.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ubicación:</span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-250">{cliente.ciudad || 'No especificada'}</span>
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
                    Marcar como Completado
                  </button>
                </div>
              </div>
            )}

            {estado === 'en_proceso' && !esAsignadoAmi && (
              <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-150 rounded-2xl p-5 shadow-sm text-center">
                <AlertCircle className="h-8 w-8 text-zinc-400 mx-auto mb-2" />
                <h3 className="text-xs font-bold text-zinc-800">Servicio en Curso</h3>
                <p className="text-[10px] text-zinc-500 mt-1.5 leading-relaxed">
                  Esta orden ya ha sido asignada a otro profesional y se encuentra en desarrollo.
                </p>
              </div>
            )}

            {estado === 'completada' && esAsignadoAmi && (
              <div className="space-y-4">
                {checkingCalificacion ? (
                  <div className="flex items-center justify-center p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                    <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                  </div>
                ) : yaCalifico ? (
                  <div className="bg-emerald-50/35 dark:bg-emerald-950/15 border border-emerald-500/15 rounded-2xl p-5 shadow-sm text-center">
                    <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                    <h3 className="text-xs font-bold text-emerald-700 dark:text-emerald-450 font-extrabold">Trabajo Finalizado</h3>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                      ¡Buen trabajo! Has completado este servicio y calificado al cliente. Tu reputación ha sido actualizada en tu perfil.
                    </p>
                  </div>
                ) : (
                  cliente && (
                    <CalificacionForm
                      ordenid={id}
                      calificadorpor={usuario?.id || ''}
                      calificadoa={cliente.id}
                      onSuccess={() => {
                        setYaCalifico(true);
                        cargarDetalle(id);
                      }}
                      title="Califica al cliente"
                      placeholder="Describe la comunicación, trato y claridad del cliente durante el trabajo..."
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
          description="Al completar el servicio, confirmas que has terminado el trabajo de manera satisfactoria. Esto cerrará el canal de chat y permitirá al cliente valorarte."
          confirmText="Sí, Completar Trabajo"
          cancelText="Cancelar"
          loading={actionLoading}
        />
      </main>
    </RouteGuard>
  );
}
