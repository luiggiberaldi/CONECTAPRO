'use client';

import React, { useState } from 'react';
import { AdminUsuario } from '../types';
import { 
  X, 
  MapPin, 
  Calendar, 
  Shield, 
  Briefcase, 
  User, 
  Star, 
  Copy, 
  Check, 
  Activity, 
  ShieldAlert,
  UserX,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import Loader from '@/components/shared/Loader';

interface UsuarioDrawerProps {
  selectedUser: AdminUsuario;
  onClose: () => void;
  onActionClick: (action: 'suspender' | 'activar') => void;
  loadingAction: string | null;
}

export default function UsuarioDrawer({ 
  selectedUser, 
  onClose, 
  onActionClick, 
  loadingAction 
}: UsuarioDrawerProps) {
  const [copiedId, setCopiedId] = useState(false);

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const isClient = selectedUser.rol === 'cliente';
  const isProfessional = selectedUser.rol === 'profesional';
  const isAdmin = selectedUser.rol === 'admin';

  const profProfile = isProfessional && selectedUser.profesionales && selectedUser.profesionales.length > 0
    ? selectedUser.profesionales[0]
    : null;

  const clienteProfile = isClient && selectedUser.clientes
    ? selectedUser.clientes
    : null;

  let bannerGradient = 'from-zinc-700 to-zinc-900';
  let bannerText = 'ADMINISTRADOR';
  if (isProfessional) {
    bannerGradient = 'from-emerald-500 to-teal-600 dark:from-emerald-650 dark:to-teal-850';
    bannerText = 'PROFESIONAL';
  } else if (isClient) {
    bannerGradient = 'from-indigo-500 to-purple-650 dark:from-indigo-650 dark:to-purple-850';
    bannerText = 'CLIENTE';
  }

  const getStatusBadge = (estado: string) => {
    if (estado === 'suspendido') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black border bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30">
          <ShieldAlert className="h-3 w-3" />
          Suspendido
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black border bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-450 dark:border-emerald-900/30">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        Activo
      </span>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Panel Lateral Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-900 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-250">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Encabezado Drawer */}
          <div className="flex items-center justify-between p-6 pb-4 border-b border-zinc-150 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-950/50">
            <span className="text-xs font-black uppercase text-zinc-400 tracking-wider">
              Ficha de Usuario
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-lg border border-zinc-150 dark:border-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 hover:text-zinc-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 pb-6">
            {/* Perfil Principal */}
            <div className="relative flex flex-col items-center text-center space-y-3 py-8 px-6 bg-zinc-50/30 dark:bg-zinc-950/20 border-b border-zinc-100 dark:border-zinc-900">
              {/* Banner Accent */}
              <div className={`absolute top-0 inset-x-0 h-2 bg-gradient-to-r ${bannerGradient}`} />
              
              {/* Avatar Container */}
              <div className="relative mt-2 shrink-0" style={{ width: '80px', height: '80px' }}>
                {selectedUser.avatar_url ? (
                  <img
                    src={selectedUser.avatar_url}
                    alt={selectedUser.nombre}
                    className="rounded-full object-cover border-2 border-white dark:border-zinc-900 ring-4 ring-indigo-500/10 shadow-md shrink-0"
                    style={{ width: '80px', height: '80px' }}
                  />
                ) : (
                  <div className="rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/40 dark:to-indigo-900/30 border border-indigo-150 dark:border-indigo-900/50 flex items-center justify-center text-indigo-750 dark:text-indigo-400 font-black text-2xl shadow-sm shrink-0" style={{ width: '80px', height: '80px' }}>
                    {selectedUser.nombre.substring(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 flex items-center justify-center gap-1.5">
                  {selectedUser.nombre}
                  <span className={`inline-block h-2.5 w-2.5 rounded-full shrink-0 ${
                    selectedUser.estado === 'activo' ? 'bg-emerald-500' : 'bg-rose-500'
                  }`} title={selectedUser.estado === 'activo' ? 'Usuario Activo' : 'Usuario Suspendido'} />
                </h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">{selectedUser.email}</p>
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  isAdmin 
                    ? 'bg-zinc-150 text-zinc-700 border border-zinc-250 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800' 
                    : isProfessional
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-150 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30'
                    : 'bg-indigo-50 text-indigo-700 border border-indigo-150 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/30'
                }`}>
                  <Shield className="h-3 w-3" />
                  {bannerText}
                </span>
                {getStatusBadge(selectedUser.estado)}
              </div>
            </div>

            {/* Bento Grid de Detalles */}
            <div className="space-y-3 px-6">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
                <Activity className="h-4 w-4" /> Detalles de Cuenta
              </h4>

              <div className="grid grid-cols-2 gap-3">
                {/* Ubicación */}
                <div className="p-3 bg-blue-50/20 dark:bg-blue-950/10 border border-blue-100/10 dark:border-blue-950/20 rounded-2xl flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-450">
                    <MapPin className="h-4 w-4" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Ubicación</span>
                  </div>
                  <span className="text-xs font-extrabold text-zinc-750 dark:text-zinc-300 truncate">
                    {selectedUser.ciudad || 'No especificada'}
                  </span>
                </div>

                {/* Fecha de Registro */}
                <div className="p-3 bg-amber-50/20 dark:bg-amber-950/10 border border-amber-100/10 dark:border-amber-950/20 rounded-2xl flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-450">
                    <Calendar className="h-4 w-4" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Registro</span>
                  </div>
                  <span className="text-xs font-extrabold text-zinc-750 dark:text-zinc-300">
                    {formatDate(selectedUser.createdat)}
                  </span>
                </div>

                {/* ID de Usuario (Full width) */}
                <div className="col-span-2 p-4 bg-zinc-50/80 dark:bg-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl flex flex-col gap-2">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">ID de Usuario</span>
                  <div className="flex items-center justify-between gap-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-1">
                    <span className="font-mono text-[9px] text-zinc-500 truncate select-all">{selectedUser.id}</span>
                    <button 
                      onClick={() => handleCopyId(selectedUser.id)}
                      className="text-zinc-400 hover:text-indigo-655 dark:hover:text-indigo-400 p-1 shrink-0 transition-transform active:scale-90"
                      title="Copiar ID"
                    >
                      {copiedId ? <Check className="h-4 w-4 text-emerald-550" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Ficha Profesional Adicional */}
            {profProfile && (
              <div className="mx-6 p-4 bg-gradient-to-br from-indigo-50/5 to-purple-50/5 dark:from-zinc-900/50 dark:to-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl space-y-4 shadow-sm">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-550 border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-2">
                  <Briefcase className="h-4 w-4" /> Perfil Profesional
                </h4>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Especialidad</span>
                    <span className="font-extrabold text-indigo-650 dark:text-indigo-400 capitalize">
                      {profProfile.especialidad}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Calificación</span>
                    <div className="flex items-center gap-1">
                      <span className="font-black text-zinc-800 dark:text-zinc-200">
                        {Number(profProfile.calificacionpromedio).toFixed(1)}
                      </span>
                      <div className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.round(profProfile.calificacionpromedio)
                                ? 'fill-amber-400 text-amber-450'
                                : 'text-zinc-200 dark:text-zinc-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 col-span-2">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Reputación y Servicios</span>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-extrabold text-zinc-700 dark:text-zinc-300">
                        {profProfile.totaltrabajos} servicios completados
                      </span>
                      {/* Badge de Nivel */}
                      <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider ${
                        profProfile.totaltrabajos >= 15
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400'
                          : profProfile.totaltrabajos >= 5
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                          : 'bg-zinc-100 text-zinc-650 dark:bg-zinc-900 dark:text-zinc-400'
                      }`}>
                        {profProfile.totaltrabajos >= 15
                          ? 'Elite'
                          : profProfile.totaltrabajos >= 5
                          ? 'Pro'
                          : 'Principiante'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Ficha Cliente Adicional */}
            {isClient && (
              <div className="mx-6 p-4 bg-gradient-to-br from-purple-50/5 to-indigo-50/5 dark:from-zinc-900/50 dark:to-zinc-900/50 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl space-y-4 shadow-sm">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-550 border-b border-zinc-100 dark:border-zinc-800 pb-2 flex items-center gap-2">
                  <User className="h-4 w-4" /> Perfil Contratante
                </h4>
                {clienteProfile ? (
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Tipo de Cuenta</span>
                      <span className="font-extrabold text-purple-650 dark:text-purple-400">
                        Cliente
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Reputación</span>
                      <div className="flex items-center gap-1">
                        <span className="font-black text-zinc-800 dark:text-zinc-200">
                          {Number(clienteProfile.calificacionpromedio).toFixed(1)}
                        </span>
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.round(clienteProfile.calificacionpromedio)
                                  ? 'fill-amber-400 text-amber-450'
                                  : 'text-zinc-200 dark:text-zinc-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 col-span-2">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Solicitudes Creadas</span>
                      <div className="flex items-center justify-between mt-1">
                        <span className="font-extrabold text-zinc-700 dark:text-zinc-300">
                          {clienteProfile.totalproyectos} solicitudes publicadas
                        </span>
                        <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider ${
                          clienteProfile.totalproyectos >= 10
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400'
                            : clienteProfile.totalproyectos >= 3
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                            : 'bg-zinc-100 text-zinc-650 dark:bg-zinc-900 dark:text-zinc-400'
                        }`}>
                          {clienteProfile.totalproyectos >= 10
                            ? 'Inversionista'
                            : clienteProfile.totalproyectos >= 3
                            ? 'Frecuente'
                            : 'Nuevo'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs py-1">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Tipo de Cuenta</span>
                      <span className="font-extrabold text-purple-650 dark:text-purple-400">Cliente / Contratador</span>
                    </div>
                    <span className="px-2 py-1 rounded bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 font-extrabold text-[9px] uppercase border border-indigo-100/30 dark:border-indigo-900/30">
                      Contratante Activo
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Acciones de Moderación del Drawer */}
        <div className="p-6 border-t border-zinc-150 dark:border-zinc-900 bg-zinc-50/20 dark:bg-zinc-950/20">
          {!isAdmin ? (
            selectedUser.estado === 'activo' ? (
              <div className="space-y-3">
                <div className="flex items-start gap-2 p-3 rounded-xl border border-rose-100 bg-rose-50/20 text-rose-800 dark:border-rose-950/30 dark:bg-rose-950/10 dark:text-rose-455 text-[11px] leading-relaxed">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-1 text-rose-500 animate-pulse" />
                  <span>
                    Suspender esta cuenta impedirá que el usuario acceda al sistema, realice postulaciones o cree nuevas órdenes de servicio.
                  </span>
                </div>
                <button
                  onClick={() => onActionClick('suspender')}
                  disabled={loadingAction === selectedUser.id}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-white bg-rose-600 hover:bg-rose-500 hover:shadow-lg hover:shadow-rose-500/10 active:scale-98 transition-all disabled:opacity-50"
                >
                  {loadingAction === selectedUser.id ? (
                    <Loader size="sm" />
                  ) : (
                    <>
                      <UserX className="h-4 w-4" />
                      Suspender Cuenta de Usuario
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start gap-2 p-3 rounded-xl border border-emerald-100 bg-emerald-50/20 text-emerald-800 dark:border-emerald-950/30 dark:bg-emerald-950/10 dark:text-emerald-455 text-[11px] leading-relaxed">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-1 text-emerald-500" />
                  <span>
                    Reactivar esta cuenta le restituirá todos los privilegios del sistema con el mismo correo, saldo de créditos y datos de historial.
                  </span>
                </div>
                <button
                  onClick={() => onActionClick('activar')}
                  disabled={loadingAction === selectedUser.id}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 active:scale-98 transition-all disabled:opacity-50"
                >
                  {loadingAction === selectedUser.id ? (
                    <Loader size="sm" />
                  ) : (
                    <>
                      <UserCheck className="h-4 w-4" />
                      Reactivar Cuenta de Usuario
                    </>
                  )}
                </button>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center text-center gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-550 dark:text-zinc-400 shadow-sm">
              <ShieldAlert className="h-5 w-5 text-indigo-650 dark:text-indigo-400" />
              <div className="space-y-1">
                <p className="font-extrabold text-xs text-zinc-855 dark:text-zinc-200">Cuenta Administrativa Protegida</p>
                <p className="text-[10px] text-zinc-400">No es posible moderar cuentas de administradores.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
