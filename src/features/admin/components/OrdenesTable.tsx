'use client';

import React, { useState } from 'react';
import { AdminOrden, OrdenFilterEstado } from '../types';
import { 
  Search, 
  Calendar, 
  MapPin, 
  Inbox, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  X,
  Clock,
  User,
  CheckCircle2,
  ClipboardList,
  ShieldAlert,
  Wrench,
  Copy,
  Check,
  FilterX,
  Sliders,
  Briefcase,
  Activity
} from 'lucide-react';
import CustomSelect, { SelectOption } from '@/components/ui/CustomSelect';

interface OrdenesTableProps {
  ordenes: AdminOrden[];
  filterEstado: OrdenFilterEstado;
  onFilterEstadoChange: (estado: OrdenFilterEstado) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

export default function OrdenesTable({
  ordenes,
  filterEstado,
  onFilterEstadoChange,
  searchQuery,
  onSearchQueryChange,
}: OrdenesTableProps) {
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Drawer de Detalles de Orden
  const [selectedOrden, setSelectedOrden] = useState<AdminOrden | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const estadoOptions: SelectOption[] = [
    { value: 'todos', label: 'Todos los Estados' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en_proceso', label: 'En Proceso' },
    { value: 'completada', label: 'Completada' },
    { value: 'cancelada', label: 'Cancelada' },
  ];

  // Métricas dinámicas basadas en el listado cargado
  const totalOrdenes = ordenes.length;
  const totalPendientes = ordenes.filter(o => o.estado === 'pendiente').length;
  const totalEnProceso = ordenes.filter(o => o.estado === 'en_proceso').length;
  const totalCompletadas = ordenes.filter(o => o.estado === 'completada').length;

  // Derivados de Paginación
  const totalPages = Math.max(1, Math.ceil(ordenes.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrdenes = ordenes.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const resetFilters = () => {
    onSearchQueryChange('');
    onFilterEstadoChange('todos');
    setCurrentPage(1);
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

  const getUrgencyBadge = (urgencia: string) => {
    if (urgencia === 'hoy') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold border uppercase tracking-wider bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-455 dark:border-rose-900/30">
          <Clock className="h-3 w-3 animate-pulse" />
          Urgente
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold border uppercase tracking-wider bg-zinc-50 text-zinc-600 border-zinc-200 dark:bg-zinc-800/40 dark:text-zinc-400 dark:border-zinc-700">
        Esta semana
      </span>
    );
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9.5px] font-bold border uppercase tracking-wider bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
            </span>
            Pendiente
          </span>
        );
      case 'en_proceso':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9.5px] font-bold border uppercase tracking-wider bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-455 dark:border-amber-900/30">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
            </span>
            En Proceso
          </span>
        );
      case 'completada':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold border uppercase tracking-wider bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-455 dark:border-emerald-900/30">
            <CheckCircle2 className="h-3 w-3" />
            Completada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold border uppercase tracking-wider bg-zinc-50 text-zinc-500 border-zinc-200 dark:bg-zinc-800/40 dark:text-zinc-400 dark:border-zinc-700">
            <ShieldAlert className="h-3 w-3" />
            Cancelada
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Bento Grid - Métricas de Órdenes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300 group">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-55">{totalOrdenes}</span>
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mt-1">Órdenes Cargadas</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 flex items-center justify-center border border-zinc-150 dark:border-zinc-750 group-hover:scale-105 transition-transform duration-250">
            <ClipboardList className="h-5 w-5" />
          </div>
        </div>

        {/* Pendientes */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300 group">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-blue-650 dark:text-blue-400">{totalPendientes}</span>
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mt-1">Pendientes</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/35 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/50 group-hover:scale-105 transition-transform duration-250">
            <Clock className="h-5 w-5 animate-pulse" />
          </div>
        </div>

        {/* En Proceso */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300 group">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-amber-650 dark:text-amber-450">{totalEnProceso}</span>
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mt-1">En Proceso</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/35 text-amber-600 dark:text-amber-455 flex items-center justify-center border border-amber-100 dark:border-amber-900/50 group-hover:scale-105 transition-transform duration-250">
            <Wrench className="h-5 w-5" />
          </div>
        </div>

        {/* Completadas */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-300 group">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-emerald-650 dark:text-emerald-400">{totalCompletadas}</span>
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mt-1">Completadas</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/35 text-emerald-600 dark:text-emerald-450 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50 group-hover:scale-105 transition-transform duration-250">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 2. Barra de Búsqueda y Filtros */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Búsqueda */}
          <div className="md:col-span-3 flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              Buscar Orden
            </label>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchQueryChange(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Buscar por título..."
                className="w-full pl-10 pr-10 py-2.5 border border-zinc-200 dark:border-zinc-850 bg-white/70 dark:bg-zinc-950/70 rounded-xl text-xs hover:border-zinc-300 dark:hover:border-zinc-750 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => onSearchQueryChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-655 dark:hover:text-zinc-350"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filtro Estado */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider">
              Filtrar por Estado
            </label>
            <CustomSelect
              options={estadoOptions}
              value={filterEstado}
              onChange={(val) => {
                onFilterEstadoChange(val as OrdenFilterEstado);
                setCurrentPage(1);
              }}
              className="w-full"
            />
          </div>
        </div>

        {/* Limpieza de Filtros */}
        {(searchQuery || filterEstado !== 'todos') && (
          <div className="flex justify-end pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={resetFilters}
              className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-black text-zinc-600 dark:text-zinc-350 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 dark:hover:text-rose-455 transition-all active:scale-95"
            >
              <FilterX className="h-4 w-4" />
              Limpiar todos los filtros
            </button>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
        <div className="overflow-x-auto w-full">
          <table className="w-full table-fixed min-w-[920px] divide-y divide-zinc-200 dark:divide-zinc-800 text-left text-xs">
          <thead className="bg-zinc-50/50 dark:bg-zinc-950/20 text-xs font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th scope="col" className="px-4 py-4 w-[24%]">
                <span className="flex items-center gap-1.5"><ClipboardList className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-550" /> Orden / Categoría</span>
              </th>
              <th scope="col" className="px-4 py-4 w-[18%]">
                <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-550" /> Cliente</span>
              </th>
              <th scope="col" className="px-4 py-4 w-[18%]">
                <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-550" /> Profesional</span>
              </th>
              <th scope="col" className="px-2 py-4 w-[13%]">
                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-550" /> Ubicación</span>
              </th>
              <th scope="col" className="px-2 py-4 w-[11%]">
                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-550" /> Urgencia</span>
              </th>
              <th scope="col" className="px-2 py-4 w-[11%]">
                <span className="flex items-center gap-1.5"><Activity className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-550" /> Estado</span>
              </th>
              <th scope="col" className="px-2 py-4 w-[5%] text-right">
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
            {paginatedOrdenes.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center text-zinc-400 dark:text-zinc-550">
                  <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
                    <div className="h-12 w-12 rounded-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 flex items-center justify-center text-zinc-300">
                      <Inbox className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-zinc-855 dark:text-zinc-250">No hay órdenes</h3>
                      <p className="text-xs text-zinc-400 mt-1">
                        No se encontraron solicitudes de trabajo bajo esta búsqueda o estado.
                      </p>
                    </div>
                    {(searchQuery || filterEstado !== 'todos') && (
                      <button
                        onClick={resetFilters}
                        className="px-4 py-2 text-xs font-black text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                      >
                        Restablecer todos los filtros
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedOrdenes.map((orden) => (
                <tr 
                  key={orden.id} 
                  className="hover:bg-zinc-50/40 dark:hover:bg-zinc-950/15 transition-all duration-200 group cursor-pointer"
                  onClick={() => setSelectedOrden(orden)}
                >
                  {/* Título & Categoría */}
                  <td className="px-4 py-5 max-w-xs">
                    <div className="flex flex-col text-left min-w-0">
                      <span className="block truncate font-black text-zinc-900 dark:text-zinc-150 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" title={orden.titulo}>
                        {orden.titulo}
                      </span>
                      <span className="inline-flex self-start mt-1.5 px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-indigo-50/70 border border-indigo-150 text-indigo-650 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/35">
                        {orden.categoria?.nombre || 'Servicio'}
                      </span>
                    </div>
                  </td>

                  {/* Cliente */}
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {orden.cliente?.avatar_url ? (
                        <img
                          src={orden.cliente.avatar_url}
                          alt={orden.cliente.nombre}
                          className="h-8 w-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-850 shrink-0 shadow-sm"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-950/35 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center text-indigo-750 dark:text-indigo-400 font-extrabold text-[10px] shrink-0">
                          {orden.cliente?.nombre.substring(0, 2).toUpperCase() || 'CL'}
                        </div>
                      )}
                      <div className="flex flex-col text-left min-w-0 max-w-[150px]">
                        <span className="block truncate font-bold text-xs text-zinc-800 dark:text-zinc-200" title={orden.cliente?.nombre}>{orden.cliente?.nombre || 'Cliente'}</span>
                        <span className="block truncate text-[10px] text-zinc-400 dark:text-zinc-500 leading-normal" title={orden.cliente?.email}>{orden.cliente?.email}</span>
                      </div>
                    </div>
                  </td>

                  {/* Profesional */}
                  <td className="px-4 py-5">
                    {orden.profesional ? (
                      <div className="flex items-center gap-2.5 min-w-0">
                        {orden.profesional.avatar_url ? (
                          <img
                            src={orden.profesional.avatar_url}
                            alt={orden.profesional.nombre}
                            className="h-8 w-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-850 shrink-0 shadow-sm"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-emerald-50 dark:bg-emerald-950/35 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-750 dark:text-emerald-400 font-extrabold text-[10px] shrink-0">
                            {orden.profesional.nombre.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col text-left min-w-0 max-w-[150px]">
                          <span className="block truncate font-bold text-xs text-zinc-800 dark:text-zinc-200" title={orden.profesional.nombre}>{orden.profesional.nombre}</span>
                          <span className="block truncate text-[10px] text-zinc-400 dark:text-zinc-500 leading-normal" title={orden.profesional.email}>{orden.profesional.email}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-black border uppercase tracking-wider bg-zinc-50 text-zinc-400 border-zinc-200 dark:bg-zinc-950/20 dark:text-zinc-500 dark:border-zinc-900/30 shrink-0">
                        <User className="h-3 w-3" />
                        Sin asignar
                      </span>
                    )}
                  </td>

                  {/* Ubicación */}
                  <td className="px-2 py-5 font-medium text-zinc-500 dark:text-zinc-400">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                      <span className="block truncate max-w-[140px] text-xs" title={`${orden.ciudad}, ${orden.zona}`}>
                        {orden.ciudad}, {orden.zona}
                      </span>
                    </div>
                  </td>

                  {/* Urgencia */}
                  <td className="px-2 py-5 align-middle">
                    {getUrgencyBadge(orden.urgencia)}
                  </td>

                  {/* Estado */}
                  <td className="px-2 py-5 align-middle">
                    {getStatusBadge(orden.estado)}
                  </td>

                  {/* Detalles Acción */}
                  <td className="px-2 py-5 align-middle text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedOrden(orden)}
                      className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-indigo-600 hover:border-indigo-200 dark:hover:text-indigo-400 dark:hover:border-indigo-900/60 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/25 transition-all"
                      title="Ver ficha de orden"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div>

      {/* 4. Controles Paginación */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 text-xs">
          <span className="text-zinc-500 font-medium">
            Mostrando {startIndex + 1}-{Math.min(startIndex + pageSize, ordenes.length)} de {ordenes.length} órdenes
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 disabled:opacity-40 disabled:hover:bg-transparent transition-all active:scale-90"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-3 font-bold text-zinc-700 dark:text-zinc-200">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 disabled:opacity-40 disabled:hover:bg-transparent transition-all active:scale-90"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* 5. SIDE DRAWER - Ficha Completa de Detalle de Orden */}
      {selectedOrden && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setSelectedOrden(null)}
          />

          {/* Panel Lateral Drawer */}
          <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-900 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-250">
            <div className="space-y-6">
              {/* Encabezado Drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-150 dark:border-zinc-900">
                <span className="text-xs font-black uppercase text-zinc-400 tracking-wider">
                  Detalle de Solicitud
                </span>
                <button
                  onClick={() => setSelectedOrden(null)}
                  className="p-1.5 rounded-lg border border-zinc-150 dark:border-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-905 transition-colors"
                >
                  <X className="h-4 w-4 text-zinc-500" />
                </button>
              </div>

              {/* Información Core */}
              <div className="space-y-3">
                <span className="inline-flex px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-indigo-50 border border-indigo-150 text-indigo-650 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/35">
                  {selectedOrden.categoria?.nombre || 'Servicio'}
                </span>
                <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 leading-tight">
                  {selectedOrden.titulo}
                </h3>
                
                {/* ID de Orden */}
                <div className="flex items-center justify-between gap-2 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-zinc-800/60 rounded-xl px-3 py-1.5 text-xs">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider shrink-0">ID Orden</span>
                  <span className="font-mono text-[10px] text-zinc-500 truncate select-all">{selectedOrden.id}</span>
                  <button 
                    onClick={() => handleCopyId(selectedOrden.id)}
                    className="text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-0.5 shrink-0"
                    title="Copiar ID"
                  >
                    {copiedId ? <Check className="h-3.5 w-3.5 text-emerald-550" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Descripción de la Orden */}
              <div className="bg-zinc-50/40 dark:bg-zinc-900/20 border border-zinc-150 dark:border-zinc-850 rounded-2xl p-4 text-xs space-y-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Descripción del Trabajo</span>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line text-[13px] font-medium">
                  {selectedOrden.descripcion}
                </p>
              </div>

              {/* Parámetros Operacionales */}
              <div className="grid grid-cols-2 gap-3.5 bg-zinc-50/30 dark:bg-zinc-900/10 border border-zinc-250/50 dark:border-zinc-800/60 rounded-2xl p-4 text-xs">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Estado</span>
                  <span className="mt-1">{getStatusBadge(selectedOrden.estado)}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Urgencia</span>
                  <span className="mt-1">{getUrgencyBadge(selectedOrden.urgencia)}</span>
                </div>
                <div className="flex flex-col gap-0.5 col-span-2 pt-2 border-t border-zinc-150 dark:border-zinc-850">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> Ubicación
                  </span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200 mt-1">
                    {selectedOrden.ciudad}, {selectedOrden.zona}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 col-span-2 pt-2 border-t border-zinc-150 dark:border-zinc-850">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> Fecha de Publicación
                  </span>
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300 mt-1">
                    {formatDate(selectedOrden.createdat)}
                  </span>
                </div>
              </div>

              {/* Bloque de Cliente */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200/85 dark:border-zinc-800 rounded-2xl p-4 space-y-3 shadow-sm text-xs">
                <h4 className="font-extrabold text-zinc-900 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-805 pb-2">
                  Cliente que Solicita
                </h4>
                <div className="flex items-center gap-3">
                  {selectedOrden.cliente?.avatar_url ? (
                    <img
                      src={selectedOrden.cliente.avatar_url}
                      alt={selectedOrden.cliente.nombre}
                      className="h-10 w-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-850"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-150 dark:border-indigo-900 flex items-center justify-center text-indigo-750 dark:text-indigo-400 font-black text-sm">
                      {selectedOrden.cliente?.nombre.substring(0, 2).toUpperCase() || 'CL'}
                    </div>
                  )}
                  <div className="flex flex-col text-left min-w-0">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 truncate">{selectedOrden.cliente?.nombre}</span>
                    <span className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate leading-tight mt-0.5">{selectedOrden.cliente?.email}</span>
                  </div>
                </div>
              </div>

              {/* Bloque de Profesional */}
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200/85 dark:border-zinc-800 rounded-2xl p-4 space-y-3 shadow-sm text-xs">
                <h4 className="font-extrabold text-zinc-900 dark:text-zinc-200 border-b border-zinc-100 dark:border-zinc-805 pb-2">
                  Profesional Asignado
                </h4>
                {selectedOrden.profesional ? (
                  <div className="flex items-center gap-3">
                    {selectedOrden.profesional.avatar_url ? (
                      <img
                        src={selectedOrden.profesional.avatar_url}
                        alt={selectedOrden.profesional.nombre}
                        className="h-10 w-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-850"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-150 dark:border-emerald-900 flex items-center justify-center text-emerald-750 dark:text-emerald-450 font-black text-sm">
                        {selectedOrden.profesional.nombre.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col text-left min-w-0">
                      <span className="font-bold text-zinc-800 dark:text-zinc-200 truncate">{selectedOrden.profesional.nombre}</span>
                      <span className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate leading-tight mt-0.5">{selectedOrden.profesional.email}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl border border-zinc-100 bg-zinc-50/50 dark:border-zinc-900 dark:bg-zinc-950/30 text-zinc-500 dark:text-zinc-450 text-[11px] leading-relaxed">
                    <span className="relative flex h-2 w-2 mt-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <span>
                      Esta orden se encuentra en estado de espera. Aún no ha sido aceptada por ningún profesional certificado.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Drawer */}
            <div className="pt-4 border-t border-zinc-150 dark:border-zinc-900 mt-6 flex justify-end">
              <button
                onClick={() => setSelectedOrden(null)}
                className="px-5 py-2 rounded-full text-xs font-black border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
