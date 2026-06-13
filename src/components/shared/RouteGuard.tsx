'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { AuthRole } from '@/features/auth/types';
import { ShieldAlert, LogOut } from 'lucide-react';
import Loader from '@/components/shared/Loader';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles: AuthRole[];
}

export default function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const { usuario, rol, loading, initialized, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialized && !loading && !usuario) {
      router.push('/auth/login');
    }
  }, [usuario, loading, initialized, router]);

  // Si aún está cargando el estado inicial de sesión, mostramos spinner
  if (!initialized || (loading && !usuario)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
        <Loader size="lg" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-4">Verificando accesos...</p>
      </div>
    );
  }

  // Si no hay usuario y ya no carga, el useEffect redirigirá. Renderizamos vacío temporalmente.
  if (!usuario) {
    return null;
  }

  // Verificar si el rol del usuario está dentro de los permitidos
  const isAllowed = rol && allowedRoles.includes(rol as AuthRole);

  if (!isAllowed) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] p-4">
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-rose-500/20 dark:border-rose-500/10 rounded-2xl p-8 max-w-md w-full text-center shadow-xl animate-slide-in">
          <ShieldAlert className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Acceso No Autorizado</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            Tu cuenta con rol <span className="font-semibold capitalize text-indigo-600 dark:text-indigo-400">&quot;{rol}&quot;</span> no tiene privilegios para acceder a esta sección.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 mt-6 justify-center">
            <button
              onClick={() => router.push(rol === 'cliente' ? '/cliente/ordenes' : rol === 'profesional' ? '/profesional/ordenes' : '/admin')}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
            >

              Ir a mi panel principal
            </button>
            <button
              onClick={async () => {
                await logout();
                router.push('/auth/login');
              }}
              className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-850 rounded-xl transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si tiene permiso, renderiza el contenido
  return <>{children}</>;
}
