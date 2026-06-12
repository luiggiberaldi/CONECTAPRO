import React from 'react';
import { Star, Award } from 'lucide-react';

interface ReputacionCardProps {
  calificacionpromedio: number;
  totaltrabajos: number;
}

export default function ReputacionCard({ calificacionpromedio, totaltrabajos }: ReputacionCardProps) {
  // Determinar nivel y badge
  const getNivel = () => {
    if (totaltrabajos >= 21) {
      return {
        label: 'Especialista Experto',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/35 dark:text-amber-400 dark:border-amber-900/30',
        description: 'Excelente reputación con más de 20 trabajos finalizados satisfactoriamente.',
      };
    }
    if (totaltrabajos >= 6) {
      return {
        label: 'Especialista Confiable',
        badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/35 dark:text-indigo-400 dark:border-indigo-900/30',
        description: 'Profesional recomendado con un historial sólido de trabajos completados.',
      };
    }
    return {
      label: 'Especialista Nuevo',
      badgeClass: 'bg-zinc-150 text-zinc-700 border-zinc-200 dark:bg-zinc-850 dark:text-zinc-400 dark:border-zinc-800',
      description: 'Profesional recién registrado en la comunidad. ¡Dale una oportunidad!',
    };
  };

  const nivel = getNivel();
  const ratingVal = Number(calificacionpromedio);

  // Renderizar estrellas
  const renderEstrellas = () => {
    const stars = [];
    const fullStars = Math.floor(ratingVal);
    const hasHalf = ratingVal % 1 >= 0.25 && ratingVal % 1 < 0.75;
    const roundedFull = ratingVal % 1 >= 0.75 ? fullStars + 1 : fullStars;

    for (let i = 1; i <= 5; i++) {
      if (i <= roundedFull) {
        stars.push(
          <Star key={i} className="h-5 w-5 fill-amber-500 text-amber-500 dark:fill-amber-500 dark:text-amber-500" />
        );
      } else if (i === roundedFull + 1 && hasHalf) {
        // En Lucide no hay media estrella directa, dibujamos una estrella coloreada parcialmente o simplemente una estrella vacía con color alterno.
        // Para simplificar y mantener compatibilidad con TypeScript de lucide-react, usamos una estrella vacía pero color ámbar.
        stars.push(
          <Star key={i} className="h-5 w-5 text-amber-500 dark:text-amber-500 opacity-70" />
        );
      } else {
        stars.push(
          <Star key={i} className="h-5 w-5 text-zinc-200 dark:text-zinc-800" />
        );
      }
    }
    return stars;
  };

  return (
    <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-4">
        Resumen de Reputación
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Promedio Grande */}
        <div className="flex flex-col items-center justify-center p-5 bg-zinc-50/40 dark:bg-zinc-950/20 border border-zinc-100 dark:border-zinc-850 rounded-2xl w-32 h-32 flex-shrink-0">
          <span className="text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
            {ratingVal.toFixed(1)}
          </span>
          <div className="flex items-center gap-0.5 mt-1.5">
            {renderEstrellas()}
          </div>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-2 font-semibold">
            {totaltrabajos} {totaltrabajos === 1 ? 'opinión' : 'opiniones'}
          </span>
        </div>

        {/* Detalles e Insignia */}
        <div className="flex-1 space-y-3 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border justify-center sm:justify-start ${nivel.badgeClass}`}>
              <Award className="h-4 w-4" />
              {nivel.label}
            </span>
          </div>

          <p className="text-xs text-zinc-650 dark:text-zinc-350 leading-relaxed">
            {nivel.description}
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 text-xs">
            <div>
              <span className="text-zinc-400 dark:text-zinc-500 block">Trabajos Completados</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">{totaltrabajos} servicios</span>
            </div>
            <div>
              <span className="text-zinc-400 dark:text-zinc-500 block">Calificación Promedio</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">{ratingVal.toFixed(2)} / 5.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
