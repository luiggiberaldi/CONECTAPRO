import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  trend?: string;
  color?: 'indigo' | 'rose' | 'emerald' | 'amber';
}

export default function KPICard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  color = 'indigo',
}: KPICardProps) {
  const getColorStyles = () => {
    switch (color) {
      case 'rose':
        return {
          bg: 'bg-rose-50/80 dark:bg-rose-950/30',
          text: 'text-rose-600 dark:text-rose-400',
          border: 'border-rose-100 dark:border-rose-900/30',
          glow: 'shadow-rose-100/30 dark:shadow-rose-950/5',
          accentBg: 'bg-rose-500',
        };
      case 'emerald':
        return {
          bg: 'bg-emerald-50/80 dark:bg-emerald-950/30',
          text: 'text-emerald-600 dark:text-emerald-400',
          border: 'border-emerald-100 dark:border-emerald-900/30',
          glow: 'shadow-emerald-100/30 dark:shadow-emerald-950/5',
          accentBg: 'bg-emerald-500',
        };
      case 'amber':
        return {
          bg: 'bg-amber-50/80 dark:bg-amber-950/30',
          text: 'text-amber-600 dark:text-amber-400',
          border: 'border-amber-100 dark:border-amber-900/30',
          glow: 'shadow-amber-100/30 dark:shadow-amber-950/5',
          accentBg: 'bg-amber-500',
        };
      default:
        return {
          bg: 'bg-indigo-50/80 dark:bg-indigo-950/30',
          text: 'text-indigo-600 dark:text-indigo-400',
          border: 'border-indigo-100 dark:border-indigo-900/30',
          glow: 'shadow-indigo-100/30 dark:shadow-indigo-950/5',
          accentBg: 'bg-indigo-600',
        };
    }
  };

  const styles = getColorStyles();

  return (
    <div className={`bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/60 dark:border-zinc-800/80 p-5 pt-7 rounded-2xl shadow-sm hover:shadow-md hover:border-zinc-350 dark:hover:border-zinc-700/80 transition-all duration-300 group flex items-start justify-between hover:-translate-y-1 relative overflow-hidden ${styles.glow}`}>
      {/* Indicador superior de acento */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${styles.accentBg}`} />
      
      <div className="space-y-2.5">
        <span className="text-xs font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
          {title}
        </span>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
            {value}
          </h3>
          {trend && (
            <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded-md">
              {trend}
            </span>
          )}
        </div>
        <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 leading-normal">
          {description}
        </p>
      </div>

      <div className={`p-3 rounded-xl border ${styles.bg} ${styles.text} ${styles.border} group-hover:scale-105 transition-transform duration-300`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}
