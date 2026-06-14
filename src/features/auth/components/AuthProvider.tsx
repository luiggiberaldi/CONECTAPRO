'use client';

import React, { useEffect } from 'react';
import { supabaseBrowser } from '@/lib/supabase';
import { useAuthStore, obtenerUsuarioPerfil } from '../hooks/useAuth';
import Image from 'next/image';
import { useBCV } from '@/hooks/useBCV';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { setSession, setLoading, setInitialized, initialized } = useAuthStore();
  const fetchRate = useBCV((state) => state.fetchRate);

  useEffect(() => {
    fetchRate();
  }, [fetchRate]);

  useEffect(() => {
    let active = true;

    // Función para inicializar la sesión actual
    async function initSession() {
      try {
        const { data: { session } } = await supabaseBrowser.auth.getSession();
        if (session?.user && active) {
          const perfil = await obtenerUsuarioPerfil(session.user.id);
          if (active) {
            setSession(perfil);
          }
        } else if (active) {
          setSession(null);
        }
      } catch (err) {
        console.error('Error al inicializar sesión:', err);
      } finally {
        if (active) {
          setLoading(false);
          setInitialized(true);
        }
      }
    }

    initSession();

    // Listener de cambios en el estado de autenticación (Login, Logout, Token refresh, etc.)
    const { data: { subscription } } = supabaseBrowser.auth.onAuthStateChange(async (event, session) => {
      if (!active) return;
      
      if (session?.user) {
        const perfil = await obtenerUsuarioPerfil(session.user.id);
        if (active) {
          setSession(perfil);
          setLoading(false);
        }
      } else {
        if (active) {
          setSession(null);
          setLoading(false);
        }
      }
    });

    // Cleanup obligatorio del listener
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [setSession, setLoading, setInitialized]);

  if (!initialized) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 z-50 transition-all bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/20 via-zinc-50 to-zinc-100 dark:from-indigo-950/10 dark:via-zinc-950 dark:to-zinc-950">
        {/* Glow de fondo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl animate-pulse-glow" />

        <div className="relative flex flex-col items-center max-w-sm w-full px-8 text-center">
          {/* Logo animado */}
          <div className="relative flex items-center justify-center px-6 py-4 w-52 h-16 mb-6 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl shadow-lg ring-4 ring-indigo-500/5">
            <Image
              src="/logo.png"
              alt="ConectaPro Logo"
              width={144}
              height={24}
              priority
              className="h-6 w-auto object-contain dark:brightness-110"
            />
          </div>

          {/* Textos */}
          <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 mt-2 tracking-wide max-w-[240px] leading-relaxed animate-pulse">
            Verificando tu sesión de forma segura...
          </p>

          {/* Barra de progreso premium */}
          <div className="h-[3px] w-36 bg-zinc-200/70 dark:bg-zinc-800/60 rounded-full overflow-hidden relative mt-6">
            <div className="absolute top-0 bottom-0 left-0 w-1/3 bg-indigo-600 dark:bg-indigo-500 rounded-full animate-loading-slide" />
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

