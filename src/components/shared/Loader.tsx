import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Loader({ size = 'md', className = '' }: LoaderProps) {
  const svgSizes = {
    sm: { width: 18, height: 18, strokeWidth: 2.5 },
    md: { width: 36, height: 36, strokeWidth: 3 },
    lg: { width: 72, height: 72, strokeWidth: 4 },
  };

  const { width, height, strokeWidth } = svgSizes[size];

  if (size === 'sm') {
    return (
      <div className={`relative flex items-center justify-center ${className}`} role="status" aria-label="Cargando">
        <svg
          className="animate-spin text-current"
          width={width}
          height={height}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  const r = 18 - strokeWidth;
  const c = 2 * Math.PI * r;

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`} role="status" aria-label="Cargando">
      <div className="relative flex items-center justify-center">
        {/* Glow de fondo para tamaño grande */}
        {size === 'lg' && (
          <div className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-400/5 rounded-full blur-xl animate-pulse" />
        )}
        
        {/* Giro Exterior (Horario con Gradiente) */}
        <svg
          className="animate-spin-slow text-indigo-600 dark:text-indigo-400"
          width={width}
          height={height}
          viewBox="0 0 36 36"
          fill="none"
        >
          <defs>
            <linearGradient id={`loader-grad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>
          
          <circle
            className="opacity-10 dark:opacity-20 stroke-zinc-400 dark:stroke-zinc-650"
            cx="18"
            cy="18"
            r={r}
            strokeWidth={strokeWidth}
          />
          
          <circle
            stroke={`url(#loader-grad-${size})`}
            cx="18"
            cy="18"
            r={r}
            strokeWidth={strokeWidth}
            strokeDasharray={c}
            strokeDashoffset={c * 0.3}
            strokeLinecap="round"
          />
        </svg>

        {/* Giro Interior (Antihorario Segmentado) */}
        <div className="absolute inset-0 flex items-center justify-center animate-spin-reverse">
          <svg
            className="text-rose-500 dark:text-rose-450 opacity-80"
            width={width * 0.65}
            height={height * 0.65}
            viewBox="0 0 36 36"
            fill="none"
          >
            <circle
              cx="18"
              cy="18"
              r={12}
              stroke="currentColor"
              strokeWidth={strokeWidth * 0.8}
              strokeDasharray="60 100"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Pulsar central */}
        <div className={`absolute rounded-full bg-indigo-500 dark:bg-indigo-400 animate-ping opacity-75 ${
          size === 'lg' ? 'h-3.5 w-3.5' : 'h-1.5 w-1.5'
        }`} />
        <div className={`absolute rounded-full bg-gradient-to-tr from-indigo-600 to-rose-500 ${
          size === 'lg' ? 'h-2.5 w-2.5' : 'h-1 w-1'
        }`} />
      </div>
    </div>
  );
}
