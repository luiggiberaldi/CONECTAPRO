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
          bg: 'bg-rose-50 dark:bg-rose-950/20',
          text: 'text-rose-600 dark:text-rose-400',
          border: 'border-rose-100 dark:border-rose-900/30',
          glow: 'shadow-rose-100/50 dark:shadow-rose-950/5',
        };
      case 'emerald':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/20',
          text: 'text-emerald-600 dark:text-emerald-400',
          border: 'border-emerald-100 dark:border-emerald-900/30',
          glow: 'shadow-emerald-100/50 dark:shadow-emerald-950/5',
        };
      case 'amber':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/20',
          text: 'text-amber-600 dark:text-amber-400',
          border: 'border-amber-100 dark:border-amber-900/30',
          glow: 'shadow-amber-100/50 dark:shadow-amber-950/5',
        };
      default:
        return {
          bg: 'bg-indigo-50 dark:bg-indigo-950/20',
          text: 'text-indigo-600 dark:text-indigo-400',
          border: 'border-indigo-100 dark:border-indigo-900/30',
          glow: 'shadow-indigo-100/50 dark:shadow-indigo-950/5',
        };
    }
  };

  const styles = getColorStyles();

  return (
    <div className={`bg-white/75 dark:bg-zinc-900/75 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group flex items-start justify-between hover:-translate-y-0.5 ${styles.glow}`}>
      <div className="space-y-2.5">
        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
          {title}
        </span>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
            {value}
          </h3>
          {trend && (
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded-md">
              {trend}
            </span>
          )}
        </div>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      </div>

      <div className={`p-3 rounded-xl border ${styles.bg} ${styles.text} ${styles.border} group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );
}
