'use client';

import React, { useState } from 'react';
import { AdminUsuario } from '../types';
import { Search, UserCheck, UserX, AlertCircle, ShieldAlert, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import ConfirmModal from '@/components/shared/ConfirmModal';
import CustomSelect, { SelectOption } from '@/components/ui/CustomSelect';


interface UsuariosTableProps {
  usuarios: AdminUsuario[];
  onSuspender: (id: string) => Promise<void>;
  onActivar: (id: string) => Promise<void>;
  loadingAction: string | null;
}

type RoleFilterType = 'todos' | 'cliente' | 'profesional' | 'admin';

export default function UsuariosTable({
  usuarios,
  onSuspender,
  onActivar,
  loadingAction,
}: UsuariosTableProps) {
  // Paginación y Filtros de búsqueda local
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilterType>('todos');
  const pageSize = 10;

  const roleOptions: SelectOption[] = [
    { value: 'todos', label: 'Todos los Roles' },
    { value: 'cliente', label: 'Clientes' },
    { value: 'profesional', label: 'Profesionales' },
    { value: 'admin', label: 'Administradores' },
  ];

  // Modal de confirmación
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: 'suspender' | 'activar'; nombre: string } | null>(null);

  // Filtrado de usuarios en frontend
  const usuariosFiltrados = usuarios.filter((user) => {
    const matchesSearch =
      user.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'todos' || user.rol === roleFilter;

    return matchesSearch && matchesRole;
  });

  const totalPages = Math.max(1, Math.ceil(usuariosFiltrados.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsuarios = usuariosFiltrados.slice(startIndex, startIndex + pageSize);

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    if (confirmAction.action === 'suspender') {
      await onSuspender(confirmAction.id);
    } else {
      await onActivar(confirmAction.id);
    }

    setConfirmAction(null);
  };

  const getStatusBadge = (estado: string) => {
    if (estado === 'suspendido') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30">
          <ShieldAlert className="h-3 w-3" />
          Suspendido
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">
        Activo
      </span>
    );
  };

  const getRoleBadge = (rol: string) => {
    switch (rol) {
      case 'admin':
        return 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-450 dark:border-rose-900/30';
      case 'profesional':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-450 dark:border-emerald-900/30';
      default:
        return 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-450 dark:border-indigo-900/30';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Búsqueda */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por nombre o correo..."
            className="w-full pl-9 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        {/* Rol */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider shrink-0">Rol:</span>
          <CustomSelect
            options={roleOptions}
            value={roleFilter}
            onChange={(val) => {
              setRoleFilter(val as RoleFilterType);
              setCurrentPage(1);
            }}
            className="w-40 shrink-0"
          />
        </div>

      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white/75 dark:bg-zinc-900/75 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl shadow-sm">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-left text-xs">
          <thead className="bg-zinc-50/75 dark:bg-zinc-950/40 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-4">Usuario</th>
              <th scope="col" className="px-6 py-4">Rol</th>
              <th scope="col" className="px-6 py-4">Ubicación</th>
              <th scope="col" className="px-6 py-4">Detalle Profesional</th>
              <th scope="col" className="px-6 py-4">Calificación / Trabajos</th>
              <th scope="col" className="px-6 py-4">Estado</th>
              <th scope="col" className="px-6 py-4 text-right">Moderación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-150 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
            {paginatedUsuarios.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-zinc-400 dark:text-zinc-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="h-6 w-6 text-zinc-300" />
                    <span>No se encontraron usuarios registrados.</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedUsuarios.map((user) => {
                // Info profesional
                const profData = user.rol === 'profesional' && user.profesionales && user.profesionales.length > 0
                  ? user.profesionales[0]
                  : null;

                return (
                  <tr key={user.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-150">
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-xs">{user.nombre}</span>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[8px] font-bold border capitalize ${getRoleBadge(user.rol)}`}>
                        {user.rol}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-405">
                      {user.ciudad || <span className="italic text-zinc-400">No especificada</span>}
                    </td>
                    <td className="px-6 py-4">
                      {profData ? (
                        <span className="capitalize font-semibold text-indigo-650 dark:text-indigo-400 text-xs">
                          {profData.especialidad}
                        </span>
                      ) : (
                        <span className="text-zinc-400 italic">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {profData ? (
                        <div className="flex items-center gap-1">
                          <Award className="h-3.5 w-3.5 text-amber-500" />
                          <span className="font-bold">{Number(profData.calificacionpromedio).toFixed(1)} ★</span>
                          <span className="text-zinc-400 dark:text-zinc-500">({profData.totaltrabajos} trab.)</span>
                        </div>
                      ) : (
                        <span className="text-zinc-400 italic">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(user.estado)}</td>
                    <td className="px-6 py-4 text-right">
                      {user.rol !== 'admin' && (
                        user.estado === 'activo' ? (
                          <button
                            onClick={() => setConfirmAction({ id: user.id, action: 'suspender', nombre: user.nombre })}
                            disabled={loadingAction === user.id}
                            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border border-rose-200 dark:border-rose-950/30 text-rose-650 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-semibold transition-all active:scale-95"
                          >
                            <UserX className="h-3 w-3" />
                            Suspender
                          </button>
                        ) : (
                          <button
                            onClick={() => setConfirmAction({ id: user.id, action: 'activar', nombre: user.nombre })}
                            disabled={loadingAction === user.id}
                            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border border-emerald-200 dark:border-emerald-950/30 text-emerald-650 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 font-semibold transition-all active:scale-95"
                          >
                            <UserCheck className="h-3 w-3" />
                            Reactivar
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Controles Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 text-xs">
          <span className="text-zinc-500">
            Mostrando {startIndex + 1}-{Math.min(startIndex + pageSize, usuariosFiltrados.length)} de {usuariosFiltrados.length} usuarios
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

      {/* Modal Confirmación de Suspensión/Activación */}
      <ConfirmModal
        isOpen={confirmAction !== null}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
        loading={confirmAction ? loadingAction === confirmAction.id : false}
        title={confirmAction?.action === 'suspender' ? '¿Suspender Cuenta de Usuario?' : '¿Reactivar Cuenta de Usuario?'}
        description={
          confirmAction?.action === 'suspender'
            ? `Al suspender la cuenta de ${confirmAction?.nombre || ''}, el usuario no podrá iniciar sesión en la aplicación ni publicar u ofertar servicios hasta que sea reactivado.`
            : `Al reactivar la cuenta de ${confirmAction?.nombre || ''}, el usuario recuperará el acceso total al sistema con sus configuraciones previas.`
        }
        confirmText={confirmAction?.action === 'suspender' ? 'Sí, Suspender' : 'Sí, Reactivar'}
        type={confirmAction?.action === 'suspender' ? 'danger' : 'primary'}
        cancelText="Cancelar"
      />
    </div>
  );
}
