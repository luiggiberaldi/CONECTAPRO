'use client';

import React from 'react';
import { useToastStore, type ToastItem } from '@/hooks/use-toast';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full sm:w-auto p-4 sm:p-0 pointer-events-none">
      {toasts.map((item) => (
        <ToastCard key={item.id} item={item} onClose={() => removeToast(item.id)} />
      ))}
    </div>
  );
}

function ToastCard({ item, onClose }: { item: ToastItem; onClose: () => void }) {
  const getIcon = () => {
    switch (item.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-rose-500 flex-shrink-0" />;
      case 'info':
        return <Info className="h-5 w-5 text-sky-500 flex-shrink-0" />;
    }
  };

  const getBorderColor = () => {
    switch (item.type) {
      case 'success':
        return 'border-emerald-500/30';
      case 'error':
        return 'border-rose-500/30';
      case 'info':
        return 'border-sky-500/30';
    }
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 w-full sm:min-w-[320px] sm:max-w-sm p-4 rounded-xl border bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-lg transition-all duration-300 animate-slide-in ${getBorderColor()}`}
      role="alert"
    >
      {getIcon()}
      <div className="flex-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
        {item.message}
      </div>
      <button
        onClick={onClose}
        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 p-0.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
