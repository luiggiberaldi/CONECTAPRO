'use client';

import React from 'react';
import { Briefcase, Calendar, MapPin, AlertCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface OrdenCardProps {
  orden: {
    id: string;
    titulo: string;
    descripcion: string;
    ciudad: string;
    zona: string;
    estado: string;
    createdat: string;
    urgencia: string;
    categoria?: {
      nombre: string;
      slug: string;
    };
  };
  href: string;
}

export default function OrdenCard({ orden, href }: OrdenCardProps) {
  const { titulo, descripcion, ciudad, zona, estado, createdat, urgencia, categoria } = orden;

  const getStatusStyles = () => {
    switch (estado) {
      case 'pendiente':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/30';
      case 'en_proceso':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800/30';
      case 'completada':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/30';
      case 'cancelada':
        return 'bg-zinc-100 text-zinc-650 border-zinc-200 dark:bg-zinc-800/30 dark:text-zinc-450 dark:border-zinc-700/30';
      default:
        return 'bg-zinc-100 text-zinc-650 border-zinc-200 dark:bg-zinc-800/30 dark:text-zinc-450 dark:border-zinc-700/30';
    }
  };

  const getUrgencyText = () => {
    return urgencia === 'hoy' ? 'Urgente: Hoy' : 'Esta semana';
  };

  const formatFecha = (fechaStr: string) => {
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleDateString('es-VE', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return fechaStr;
    }
  };

  return (
    <Link
      href={href}
      className="block group bg-white/70 dark:bg-zinc-900/70 backdrop-blur-sm hover:bg-white dark:hover:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all hover:scale-[1.01]"
    >
      <div className="flex flex-col gap-3">
        {/* Fila superior: Categoría y Estado */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50/50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
            <Briefcase className="h-3 w-3" />
            <span className="capitalize">{categoria?.nombre || 'Servicio'}</span>
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getStatusStyles()}`}>
            {estado.replace('_', ' ')}
          </span>
        </div>

        {/* Título y Descripción */}
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-1">
            {titulo}
            <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-indigo-600 dark:text-indigo-400" />
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed">
            {descripcion}
          </p>
        </div>

        {/* Info de Pie: Fecha, Zona, Urgencia */}
        <div className="border-t border-zinc-100/50 dark:border-zinc-800/40 pt-3 flex flex-wrap items-center justify-between gap-2.5 text-[11px] text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-3.5">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-zinc-400" />
              {formatFecha(createdat)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-zinc-400" />
              {ciudad}, {zona}
            </span>
          </div>

          <span className={`inline-flex items-center gap-1 font-semibold ${
            urgencia === 'hoy' ? 'text-rose-500 dark:text-rose-450' : 'text-zinc-400'
          }`}>
            <AlertCircle className="h-3 w-3" />
            {getUrgencyText()}
          </span>
        </div>
      </div>
    </Link>
  );
}
