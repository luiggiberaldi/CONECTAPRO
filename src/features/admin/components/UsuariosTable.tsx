'use client';

import React, { useState } from 'react';
import { AdminUsuario } from '../types';
import { 
  Search, 
  UserCheck, 
  UserX, 
  AlertCircle, 
  ShieldAlert, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Shield, 
  Briefcase, 
  User, 
  Users, 
  X, 
  Eye, 
  FilterX, 
  Star,
  Activity,
  Sliders
} from 'lucide-react';
import CustomSelect, { SelectOption } from '@/components/ui/CustomSelect';
import dynamic from 'next/dynamic';
import Loader from '@/components/shared/Loader';

const ConfirmModal = dynamic(() => import('@/components/shared/ConfirmModal'));
import UsuarioDrawer from './UsuarioDrawer';

interface UsuariosTableProps {
  usuarios: AdminUsuario[];
  onSuspender: (id: string) => Promise<void>;
  onActivar: (id: string) => Promise<void>;
  loadingAction: string | null;
}

type RoleFilterType = 'todos' | 'cliente' | 'profesional' | 'admin';
type StatusFilterType = 'todos' | 'activo' | 'suspendido';

export default function UsuariosTable({
  usuarios,
  onSuspender,
  onActivar,
  loadingAction,
}: UsuariosTableProps) {
  // Paginación y Filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilterType>('todos');
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>('todos');
  const pageSize = 8;

  // Drawer de Detalles de Usuario
  const [selectedUser, setSelectedUser] = useState<AdminUsuario | null>(null);

  // Modal de confirmación
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: 'suspender' | 'activar'; nombre: string } | null>(null);

  const roleOptions: SelectOption[] = [
    { value: 'todos', label: 'Todos los Roles' },
    { value: 'cliente', label: 'Clientes' },
    { value: 'profesional', label: 'Profesionales' },
    { value: 'admin', label: 'Administradores' },
  ];

  const statusOptions: SelectOption[] = [
    { value: 'todos', label: 'Todos los Estados' },
    { value: 'activo', label: 'Cuentas Activas' },
    { value: 'suspendido', label: 'Cuentas Suspendidas' },
  ];

  // Métricas dinámicas calculadas basadas en los usuarios cargados
  const totalUsers = usuarios.length;
  const totalClientes = usuarios.filter(u => u.rol === 'cliente').length;
  const totalProfesionales = usuarios.filter(u => u.rol === 'profesional').length;
  const totalSuspendidos = usuarios.filter(u => u.estado === 'suspendido').length;

  // Filtrado de usuarios
  const usuariosFiltrados = usuarios.filter((user) => {
    const matchesSearch =
      user.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'todos' || user.rol === roleFilter;
    const matchesStatus = statusFilter === 'todos' || user.estado === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(usuariosFiltrados.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsuarios = usuariosFiltrados.slice(startIndex, startIndex + pageSize);

  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    if (confirmAction.action === 'suspender') {
      await onSuspender(confirmAction.id);
      // Actualizar el usuario seleccionado en el drawer si está abierto
      if (selectedUser?.id === confirmAction.id) {
        setSelectedUser(prev => prev ? { ...prev, estado: 'suspendido' } : null);
      }
    } else {
      await onActivar(confirmAction.id);
      // Actualizar el usuario seleccionado en el drawer si está abierto
      if (selectedUser?.id === confirmAction.id) {
        setSelectedUser(prev => prev ? { ...prev, estado: 'activo' } : null);
      }
    }

    setConfirmAction(null);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setRoleFilter('todos');
    setStatusFilter('todos');
    setCurrentPage(1);
  };

  const getStatusBadge = (estado: string) => {
    if (estado === 'suspendido') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-black border bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-455 dark:border-rose-900/30">
          <ShieldAlert className="h-3 w-3" />
          Suspendido
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-black border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-455 dark:border-emerald-900/30">
        Activo
      </span>
    );
  };

  const getRoleBadge = (rol: string) => {
    switch (rol) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-455 dark:border-rose-900/30">
            <Shield className="h-3 w-3" />
            Admin
          </span>
        );
      case 'profesional':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-455 dark:border-emerald-900/30">
            <Briefcase className="h-3 w-3" />
            Profesional
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30">
            <User className="h-3 w-3" />
            Cliente
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Bento Grid - Tarjetas de Métricas Rápidas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300 group">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-55">{totalUsers}</span>
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mt-1">Total Usuarios</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 flex items-center justify-center border border-zinc-150 dark:border-zinc-750 group-hover:scale-105 transition-transform duration-250">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Clientes */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300 group">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-indigo-650 dark:text-indigo-400">{totalClientes}</span>
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mt-1">Clientes</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/35 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/50 group-hover:scale-105 transition-transform duration-250">
            <User className="h-5 w-5" />
          </div>
        </div>

        {/* Profesionales */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300 group">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-emerald-650 dark:text-emerald-400">{totalProfesionales}</span>
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mt-1">Profesionales</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/35 text-emerald-600 dark:text-emerald-455 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50 group-hover:scale-105 transition-transform duration-250">
            <Briefcase className="h-5 w-5" />
          </div>
        </div>

        {/* Suspendidos */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300 group">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-rose-655 dark:text-rose-500">{totalSuspendidos}</span>
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mt-1">Suspendidos</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-950/35 text-rose-600 dark:text-rose-455 flex items-center justify-center border border-rose-100 dark:border-rose-900/50 group-hover:scale-105 transition-transform duration-250">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 2. Barra de Filtros y Búsqueda */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end w-full">
          {/* Búsqueda */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Buscar Usuario
            </label>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Buscar por nombre o correo..."
                className="w-full pl-10 pr-10 py-2 border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 rounded-xl text-xs hover:border-zinc-300 dark:hover:border-zinc-750 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-655 dark:hover:text-zinc-350"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Select de Roles */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Filtrar por Rol
            </label>
            <CustomSelect
              options={roleOptions}
              value={roleFilter}
              onChange={(val) => {
                setRoleFilter(val as RoleFilterType);
                setCurrentPage(1);
              }}
              className="w-full"
            />
          </div>

          {/* Select de Estados */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Filtrar por Estado
            </label>
            <CustomSelect
              options={statusOptions}
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val as StatusFilterType);
                setCurrentPage(1);
              }}
              className="w-full"
            />
          </div>
        </div>

        {/* Limpieza de Filtros */}
        {(searchQuery || roleFilter !== 'todos' || statusFilter !== 'todos') && (
          <div className="flex justify-end pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-4 py-2 text-xs font-black text-zinc-600 dark:text-zinc-350 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 dark:hover:text-rose-455 transition-all active:scale-95"
            >
              <FilterX className="h-4 w-4" />
              Limpiar todos los filtros
            </button>
          </div>
        )}
      </div>

      {/* 3. Listado Principal (Tabla Rediseñada) */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
        <div className="overflow-x-auto w-full">
          <table className="w-full table-fixed min-w-[950px] text-left text-xs">
          <thead className="bg-zinc-50/80 dark:bg-zinc-950/30 text-[10px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th scope="col" className="pr-4 pb-4 w-[28%]" style={{ paddingLeft: '24px', paddingTop: '28px' }}>
                <span className="flex items-center gap-1"><Users className="h-4 w-4 text-zinc-400 dark:text-zinc-550" /> Usuario</span>
              </th>
              <th scope="col" className="px-4 pb-4 w-[14%]" style={{ paddingTop: '28px' }}>
                <span className="flex items-center gap-1"><Shield className="h-4 w-4 text-zinc-400 dark:text-zinc-550" /> Rol</span>
              </th>
              <th scope="col" className="px-4 pb-4 w-[14%]" style={{ paddingTop: '28px' }}>
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-zinc-400 dark:text-zinc-550" /> Ubicación</span>
              </th>
              <th scope="col" className="px-4 pb-4 w-[20%]" style={{ paddingTop: '28px' }}>
                <span className="flex items-center gap-1"><Briefcase className="h-4 w-4 text-zinc-400 dark:text-zinc-550" /> Profesión / Reputación</span>
              </th>
              <th scope="col" className="px-4 pb-4 w-[12%]" style={{ paddingTop: '28px' }}>
                <span className="flex items-center gap-1"><Activity className="h-4 w-4 text-zinc-400 dark:text-zinc-550" /> Estado</span>
              </th>
              <th scope="col" className="px-4 pb-4 w-[12%] text-right" style={{ paddingTop: '28px' }}>
                <span className="flex items-center justify-end gap-1"><Sliders className="h-4 w-4 text-zinc-400 dark:text-zinc-550" /> Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="text-zinc-700 dark:text-zinc-300">
            {paginatedUsuarios.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-zinc-400 dark:text-zinc-550">
                  <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
                    <div className="h-12 w-12 rounded-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 flex items-center justify-center text-zinc-300">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-zinc-855 dark:text-zinc-250">Sin resultados</h3>
                      <p className="text-xs text-zinc-400 mt-1">
                        No hay usuarios que coincidan con la búsqueda o filtros seleccionados en este momento.
                      </p>
                    </div>
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 text-xs font-black text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                    >
                      Restablecer todos los filtros
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedUsuarios.map((user) => {
                const profData = user.rol === 'profesional' && user.profesionales && user.profesionales.length > 0
                  ? user.profesionales[0]
                  : null;
 
                // Color accent bar per role/status
                const accentColor = user.estado === 'suspendido'
                  ? 'bg-amber-400'
                  : user.rol === 'admin'
                  ? 'bg-rose-400'
                  : user.rol === 'profesional'
                  ? 'bg-emerald-400'
                  : 'bg-indigo-400';
 
                return (
                  <tr 
                    key={user.id} 
                    className="relative hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 transition-all duration-150 group cursor-pointer border-b border-zinc-100 dark:border-zinc-800/60 last:border-0"
                    onClick={() => setSelectedUser(user)}
                  >
                    {/* Perfil & Avatar — border-left como accent bar */}
                    <td 
                      className={`pr-4 py-5 border-l-[3px] ${accentColor.replace('bg-', 'border-')} group-hover:border-opacity-100 border-opacity-60 transition-all duration-150`}
                      style={{ paddingLeft: '24px' }}
                    >
                      <div className="flex items-center gap-3">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={user.nombre}
                            className="h-8 w-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shrink-0 shadow-sm"
                            onClick={(e) => { e.stopPropagation(); setSelectedUser(user); }}
                          />
                        ) : (
                          <div 
                            className={`h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-black border shadow-sm shrink-0 ${
                              user.rol === 'admin' 
                                ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/40' 
                                : user.rol === 'profesional'
                                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-450 border-emerald-100 dark:border-emerald-900/40'
                                : 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-455 border-indigo-100 dark:border-indigo-900/40'
                            }`}
                            onClick={(e) => { e.stopPropagation(); setSelectedUser(user); }}
                          >
                            {user.nombre.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col text-left min-w-0 max-w-[190px] sm:max-w-xs">
                          <span className="block truncate font-bold text-[13px] text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight" title={user.nombre}>
                            {user.nombre}
                          </span>
                          <span className="block truncate text-[11px] text-zinc-400 dark:text-zinc-550 mt-1" title={user.email}>
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Badge Rol */}
                    <td className="px-4 py-5 align-middle">
                      {getRoleBadge(user.rol)}
                    </td>

                    {/* Ciudad */}
                    <td className="px-4 py-5 align-middle">
                      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 min-w-0">
                        <MapPin className="h-3 w-3 text-zinc-350 dark:text-zinc-550 shrink-0" />
                        <span className="block truncate" title={user.ciudad || ''}>
                          {user.ciudad || <span className="italic text-zinc-350 dark:text-zinc-600">—</span>}
                        </span>
                      </div>
                    </td>

                    {/* Detalle Profesional / Reputación */}
                    <td className="px-4 py-5 align-middle">
                      {profData ? (
                        <div className="flex flex-col gap-1 text-left">
                          <span className="capitalize font-bold text-indigo-600 dark:text-indigo-400 text-[12px] leading-tight">
                            {profData.especialidad}
                          </span>
                          <div className="flex items-center gap-1 text-[11px]">
                            <div className="flex items-center gap-[2px]">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-3 w-3 ${star <= Math.round(profData.calificacionpromedio || 0) ? 'fill-amber-400 text-amber-400' : 'text-zinc-200 dark:text-zinc-700'}`} 
                                />
                              ))}
                            </div>
                            <span className="font-semibold text-zinc-600 dark:text-zinc-400">
                              {Number(profData.calificacionpromedio).toFixed(1)}
                            </span>
                            <span className="text-zinc-400 dark:text-zinc-550">· {profData.totaltrabajos} trab.</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-zinc-350 dark:text-zinc-600 text-[11px] italic">N/A</span>
                      )}
                    </td>

                    {/* Estado */}
                    <td className="px-4 py-5 align-middle">
                      {getStatusBadge(user.estado)}
                    </td>

                    {/* Acciones - visible solo en hover */}
                    <td className="px-4 py-5 align-middle text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-150">
                        {/* Botón Ver Ficha */}
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-400 hover:text-indigo-600 hover:border-indigo-300 dark:hover:text-indigo-400 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all active:scale-90"
                          title="Ver ficha de usuario"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Botón Moderación */}
                        {user.rol !== 'admin' ? (
                          user.estado === 'activo' ? (
                            <button
                              onClick={() => setConfirmAction({ id: user.id, action: 'suspender', nombre: user.nombre })}
                              disabled={loadingAction === user.id}
                              className="inline-flex items-center justify-center p-2 rounded-lg border border-rose-200 dark:border-rose-900/40 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-700 dark:hover:text-rose-300 hover:border-rose-300 transition-all active:scale-90 disabled:opacity-40"
                              title="Suspender usuario"
                            >
                              {loadingAction === user.id ? (
                                <Loader size="sm" />
                              ) : (
                                <UserX className="h-4 w-4" />
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => setConfirmAction({ id: user.id, action: 'activar', nombre: user.nombre })}
                              disabled={loadingAction === user.id}
                              className="inline-flex items-center justify-center p-2 rounded-lg border border-emerald-200 dark:border-emerald-900/40 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-700 dark:hover:text-emerald-300 hover:border-emerald-300 transition-all active:scale-90 disabled:opacity-40"
                              title="Reactivar usuario"
                            >
                              {loadingAction === user.id ? (
                                <Loader size="sm" />
                              ) : (
                                <UserCheck className="h-4 w-4" />
                              )}
                            </button>
                          )
                        ) : (
                          <span className="inline-block w-[30px]" />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      </div>

      {/* 4. Controles Paginación */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 text-xs">
          <span className="text-zinc-500 font-medium">
            Mostrando {startIndex + 1}-{Math.min(startIndex + pageSize, usuariosFiltrados.length)} de {usuariosFiltrados.length} usuarios
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 disabled:opacity-40 disabled:hover:bg-transparent transition-all active:scale-90"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 font-bold text-zinc-700 dark:text-zinc-200">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 disabled:opacity-40 disabled:hover:bg-transparent transition-all active:scale-90"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* 5. SIDE DRAWER - Ficha Completa de Detalle de Usuario */}
      {selectedUser && (
        <UsuarioDrawer
          selectedUser={selectedUser}
          onClose={() => setSelectedUser(null)}
          onActionClick={(action) => setConfirmAction({ id: selectedUser.id, action, nombre: selectedUser.nombre })}
          loadingAction={loadingAction}
        />
      )}

      {/* 6. Modal Confirmación de Acción (Suspender / Reactivar) */}
      <ConfirmModal
        isOpen={confirmAction !== null}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
        loading={confirmAction ? loadingAction === confirmAction.id : false}
        title={confirmAction?.action === 'suspender' ? '¿Suspender Cuenta de Usuario?' : '¿Reactivar Cuenta de Usuario?'}
        description={
          confirmAction?.action === 'suspender'
            ? `Al confirmar, la cuenta de ${confirmAction?.nombre || ''} cambiará a estado suspendido y se le cerrará la sesión actual.`
            : `Al confirmar, la cuenta de ${confirmAction?.nombre || ''} volverá a estar activa con acceso inmediato a ConectaPro.`
        }
        confirmText={confirmAction?.action === 'suspender' ? 'Sí, Suspender' : 'Sí, Reactivar'}
        type={confirmAction?.action === 'suspender' ? 'danger' : 'primary'}
        cancelText="Cancelar"
      />
    </div>
  );
}
