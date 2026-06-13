'use client';

import React, { useState } from 'react';
import { AdminOrden, OrdenFilterEstado } from '../types';
import { Search, Calendar, MapPin, Inbox, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const pageSize = 10;

  const estadoOptions: SelectOption[] = [
    { value: 'todos', label: 'Todos los Estados' },
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'en_proceso', label: 'En Proceso' },
    { value: 'completada', label: 'Completada' },
    { value: 'cancelada', label: 'Cancelada' },
  ];


  // Derivados
  const totalPages = Math.max(1, Math.ceil(ordenes.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedOrdenes = ordenes.slice(startIndex, startIndex + pageSize);

  const getUrgencyBadge = (urgencia: string) => {
    if (urgencia === 'hoy') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black border bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30 uppercase tracking-wider">
          Urgente
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black border bg-zinc-50 text-zinc-600 border-zinc-200 dark:bg-zinc-800/40 dark:text-zinc-400 dark:border-zinc-700 uppercase tracking-wider">
        Esta semana
      </span>
    );
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black border bg-blue-50/70 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30 uppercase tracking-wider">
            Pendiente
          </span>
        );
      case 'en_proceso':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black border bg-amber-50/70 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30 uppercase tracking-wider">
            En Proceso
          </span>
        );
      case 'completada':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black border bg-emerald-50/70 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30 uppercase tracking-wider">
            Completada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black border bg-zinc-100/70 text-zinc-600 border-zinc-200 dark:bg-zinc-800/40 dark:text-zinc-400 dark:border-zinc-700 uppercase tracking-wider">
            Cancelada
          </span>
        );
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-4">
      {/* Filtros superiores */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Barra de búsqueda */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              onSearchQueryChange(e.target.value);
              setCurrentPage(1); // Resetear a pág 1 al buscar
            }}
            placeholder="Buscar por título..."
            className="w-full pl-9 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 rounded-xl text-xs hover:border-zinc-300 dark:hover:border-zinc-700/80 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        {/* Filtro de estado */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide shrink-0">Estado:</span>
          <CustomSelect
            options={estadoOptions}
            value={filterEstado}
            onChange={(val) => {
              onFilterEstadoChange(val as OrdenFilterEstado);
              setCurrentPage(1); // Resetear a pág 1 al cambiar filtro
            }}
            className="w-44 shrink-0"
          />
        </div>

      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white/75 dark:bg-zinc-900/75 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl shadow-sm">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-left text-xs">
          <thead className="bg-zinc-50/75 dark:bg-zinc-950/40 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-4">Orden / Categoría</th>
              <th scope="col" className="px-6 py-4">Cliente</th>
              <th scope="col" className="px-6 py-4">Profesional</th>
              <th scope="col" className="px-6 py-4">Ubicación</th>
              <th scope="col" className="px-6 py-4">Urgencia</th>
              <th scope="col" className="px-6 py-4">Estado</th>
              <th scope="col" className="px-6 py-4">Creada</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-150 dark:divide-zinc-800/60 text-zinc-700 dark:text-zinc-300">
            {paginatedOrdenes.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-zinc-400 dark:text-zinc-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Inbox className="h-6 w-6 text-zinc-300" />
                    <span>No se encontraron órdenes de servicio.</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedOrdenes.map((orden) => (
                <tr key={orden.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-150 max-w-xs">
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-xs truncate max-w-[200px]" title={orden.titulo}>
                        {orden.titulo}
                      </span>
                      <span className="inline-flex self-start mt-1 px-2.5 py-0.5 rounded text-xs font-black uppercase tracking-wider bg-indigo-50/70 border border-indigo-150 text-indigo-650 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/35">
                        {orden.categoria?.nombre || 'Categoría'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-xs">{orden.cliente?.nombre || 'Cliente'}</span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">{orden.cliente?.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {orden.profesional ? (
                      <div className="flex flex-col text-left">
                        <span className="font-bold text-xs text-zinc-800 dark:text-zinc-200">{orden.profesional.nombre}</span>
                        <span className="text-xs text-zinc-400 dark:text-zinc-500">{orden.profesional.email}</span>
                      </div>
                    ) : (
                      <span className="text-zinc-400 dark:text-zinc-500 italic">No asignado</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                    <span className="inline-flex items-center gap-1 font-medium">
                      <MapPin className="h-3 w-3 text-zinc-400" />
                      {orden.ciudad}, {orden.zona}
                    </span>
                  </td>
                  <td className="px-6 py-4">{getUrgencyBadge(orden.urgencia)}</td>
                  <td className="px-6 py-4">{getStatusBadge(orden.estado)}</td>
                  <td className="px-6 py-4 text-zinc-400">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(orden.createdat).toLocaleDateString('es-VE')}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 text-xs">
          <span className="text-zinc-500">
            Mostrando {startIndex + 1}-{Math.min(startIndex + pageSize, ordenes.length)} de {ordenes.length} órdenes
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 font-bold">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
