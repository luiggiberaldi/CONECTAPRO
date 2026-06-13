'use client';

import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import Loader from '@/components/shared/Loader';
import { calificarServicio } from '../api';
import { toast } from '@/hooks/use-toast';

interface CalificacionFormProps {
  ordenid: string;
  calificadorpor: string;
  calificadoa: string;
  onSuccess?: () => void;
  title?: string;
  placeholder?: string;
}

export default function CalificacionForm({
  ordenid,
  calificadorpor,
  calificadoa,
  onSuccess,
  title = 'Califica el servicio recibido',
  placeholder = 'Describe brevemente tu experiencia con el servicio...',
}: CalificacionFormProps) {
  const [estrellas, setEstrellas] = useState(0);
  const [hoverEstrellas, setHoverEstrellas] = useState(0);
  const [comentario, setComentario] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (estrellas < 1 || estrellas > 5) {
      toast.error('Por favor selecciona una puntuación entre 1 y 5 estrellas.');
      return;
    }

    setLoading(true);
    const success = await calificarServicio(
      ordenid,
      calificadorpor,
      calificadoa,
      estrellas,
      comentario.trim() || null
    );

    if (success) {
      if (onSuccess) onSuccess();
    }
    setLoading(false);
  };

  return (
    <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-150 mb-1.5 uppercase tracking-wide">
        {title}
      </h3>
      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mb-4 leading-normal">
        Tu reseña será permanente y ayudará a mantener la confianza dentro de la comunidad de ConectaPro.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Selector de estrellas */}
        <div className="flex flex-col items-center gap-1.5 py-2.5 bg-zinc-50/40 dark:bg-zinc-950/20 border border-zinc-100 dark:border-zinc-850 rounded-xl">
          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
            Tu Puntuación
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = hoverEstrellas >= star || (!hoverEstrellas && estrellas >= star);
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setEstrellas(star)}
                  onMouseEnter={() => setHoverEstrellas(star)}
                  onMouseLeave={() => setHoverEstrellas(0)}
                  disabled={loading}
                  className="p-1 hover:scale-110 active:scale-95 transition-all text-zinc-300 hover:text-amber-400 dark:text-zinc-800 dark:hover:text-amber-500"
                >
                  <Star
                    className={`h-7 w-7 transition-colors ${
                      active ? 'fill-amber-500 text-amber-500 dark:fill-amber-500 dark:text-amber-500' : ''
                    }`}
                  />
                </button>
              );
            })}
          </div>
          {estrellas > 0 && (
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 transition-all">
              {estrellas} {estrellas === 1 ? 'Estrella' : 'Estrellas'}
            </span>
          )}
        </div>

        {/* Comentario */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
            Comentario adicional
          </label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            disabled={loading}
            placeholder={placeholder}
            rows={3}
            className="w-full p-3 border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
          />
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={loading || estrellas === 0}
          className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm py-2.5 text-xs font-semibold transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <Loader size="sm" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
          Enviar Calificación
        </button>
      </form>
    </div>
  );
}
