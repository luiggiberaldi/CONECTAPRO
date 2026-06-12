'use client';

import React, { useState } from 'react';
import { Resena } from '../types';
import { Star, User, Calendar, MessageSquare, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

interface ResenasListProps {
  resenas: Resena[];
}

export default function ResenasList({ resenas }: ResenasListProps) {
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.max(1, Math.ceil(resenas.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedResenas = resenas.slice(startIndex, startIndex + pageSize);

  const renderEstrellas = (estrellas: number) => {
    return Array.from({ length: 5 }).map((_, i) => {
      const active = i < estrellas;
      return (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            active
              ? 'fill-amber-500 text-amber-500 dark:fill-amber-500 dark:text-amber-500'
              : 'text-zinc-200 dark:text-zinc-800'
          }`}
        />
      );
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4">
        Opiniones de Clientes
      </h3>

      {paginatedResenas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-zinc-250 dark:border-zinc-800 rounded-2xl bg-zinc-50/20 text-center">
          <Inbox className="h-8 w-8 text-zinc-300 dark:text-zinc-700 mb-2" />
          <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200">No hay valoraciones aún</h4>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs leading-normal">
            Las calificaciones de tus clientes completados aparecerán listadas en esta sección.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {paginatedResenas.map((resena) => (
            <div
              key={resena.id}
              className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              {/* Header de Reseña */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 border border-zinc-200 dark:border-zinc-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {resena.calificador?.avatar_url ? (
                      <img
                        src={resena.calificador.avatar_url}
                        alt={`Avatar de ${resena.calificador.nombre}`}
                        className="h-full w-full object-cover rounded-full"
                      />
                    ) : (
                      <User className="h-3.5 w-3.5 text-zinc-400" />
                    )}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                      {resena.calificador?.nombre || 'Usuario de ConectaPro'}
                    </span>
                    <span className="text-[9px] text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(resena.createdat).toLocaleDateString('es-VE')}
                    </span>
                  </div>
                </div>

                {/* Estrellas */}
                <div className="flex items-center gap-0.5">
                  {renderEstrellas(resena.estrellas)}
                </div>
              </div>

              {/* Comentario */}
              {resena.comentario ? (
                <div className="flex gap-2 items-start text-xs text-zinc-650 dark:text-zinc-350 bg-zinc-50/50 dark:bg-zinc-950/20 p-3 rounded-xl border border-zinc-100 dark:border-zinc-900/40">
                  <MessageSquare className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed italic">
                    &ldquo;{resena.comentario}&rdquo;
                  </p>
                </div>
              ) : (
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 italic block">
                  El cliente no dejó comentarios adicionales.
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Controles de Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 text-xs pt-2">
          <span className="text-zinc-500">
            Mostrando {startIndex + 1}-{Math.min(startIndex + pageSize, resenas.length)} de {resenas.length} opiniones
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
    </div>
  );
}
