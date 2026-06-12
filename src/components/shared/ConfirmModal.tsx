'use client';

import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  type?: 'primary' | 'danger';
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loading = false,
  type = 'primary',
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-slide-in pointer-events-auto">
        <div className="flex items-start gap-3.5">
          <div className={`p-2.5 rounded-xl flex-shrink-0 ${
            type === 'danger'
              ? 'bg-rose-500/10 text-rose-500'
              : 'bg-indigo-500/10 text-indigo-500'
          }`}>
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {title}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2.5 mt-6 border-t border-zinc-100 dark:border-zinc-800/60 pt-4">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-sm transition-all active:scale-95 disabled:opacity-50 ${
              type === 'danger'
                ? 'bg-rose-600 hover:bg-rose-500'
                : 'bg-indigo-600 hover:bg-indigo-500'
            }`}
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
