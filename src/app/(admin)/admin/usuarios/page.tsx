'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { getTodosUsuarios, suspenderUsuario, activarUsuario } from '@/features/admin/api';
import { AdminUsuario } from '@/features/admin/types';
import UsuariosTable from '@/features/admin/components/UsuariosTable';
import { Loader2, RefreshCw } from 'lucide-react';

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<AdminUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadUsuarios = useCallback(async () => {
    setLoading(true);
    const data = await getTodosUsuarios();
    if (data) {
      setUsuarios(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUsuarios();
  }, [loadUsuarios]);

  const handleSuspender = async (id: string) => {
    setActionLoading(true);
    const success = await suspenderUsuario(id);
    if (success) {
      // Recargar listado local
      await loadUsuarios();
    }
    setActionLoading(false);
  };

  const handleActivar = async (id: string) => {
    setActionLoading(true);
    const success = await activarUsuario(id);
    if (success) {
      // Recargar listado local
      await loadUsuarios();
    }
    setActionLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            Gestión de Usuarios
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Modera y supervisa las cuentas de clientes y profesionales registrados en la plataforma.
          </p>
        </div>
        <button
          onClick={loadUsuarios}
          disabled={loading}
          className="self-start sm:self-center flex items-center justify-center p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-850 transition-all active:scale-95 disabled:opacity-50"
          title="Recargar usuarios"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tabla de usuarios */}
      {loading && usuarios.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] p-4 text-center">
          <Loader2 className="h-8 w-8 text-rose-500 animate-spin mb-2" />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Consultando base de usuarios...</p>
        </div>
      ) : (
        <UsuariosTable
          usuarios={usuarios}
          onSuspender={handleSuspender}
          onActivar={handleActivar}
          loadingAction={actionLoading}
        />
      )}
    </div>
  );
}
