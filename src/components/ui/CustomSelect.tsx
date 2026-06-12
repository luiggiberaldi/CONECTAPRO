'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  id?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  leftIcon?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
}

export default function CustomSelect({
  id,
  options,
  value,
  onChange,
  placeholder = 'Selecciona...',
  className = '',
  leftIcon,
  required = false,
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Encontrar opción seleccionada
  const selectedOption = options.find((opt) => opt.value === value);

  // Cerrar al hacer clic fuera del componente
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Manejar teclado (Escape para cerrar, enter en opciones, etc.)
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isOpen) return;
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div id={id} ref={containerRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 px-4 py-2.5 text-left text-sm text-zinc-900 dark:text-zinc-100 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:bg-white dark:hover:bg-zinc-950 ${
          isOpen ? 'border-indigo-500 ring-1 ring-indigo-500' : ''
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          {leftIcon && <span className="text-zinc-400 shrink-0">{leftIcon}</span>}
          {selectedOption ? (
            <span className="truncate flex items-center gap-2">
              {selectedOption.icon}
              {selectedOption.label}
            </span>
          ) : (
            <span className="text-zinc-400 dark:text-zinc-650 truncate">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-zinc-450 dark:text-zinc-500 shrink-0 transition-transform duration-250 ${
            isOpen ? 'rotate-180 text-indigo-500' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1.5 max-h-60 w-full overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-1.5 shadow-xl outline-none animate-in fade-in slide-in-from-top-1 duration-150">
          {options.length === 0 ? (
            <div className="px-4 py-2.5 text-xs text-zinc-450 dark:text-zinc-500">No hay opciones disponibles</div>
          ) : (
            options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-850/50'
                  }`}
                >
                  {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                  <span className="truncate">{opt.label}</span>
                </button>
              );
            })
          )}
        </div>
      )}
      {/* Campo oculto para compatibilidad con validación de formularios HTML nativos */}
      {required && (
        <input
          type="text"
          value={value}
          onChange={() => {}}
          required
          tabIndex={-1}
          className="absolute inset-0 opacity-0 pointer-events-none w-full h-full"
        />
      )}
    </div>
  );
}
