'use client';

import React from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { LogOut, User, LayoutDashboard, PlusCircle, Wallet } from 'lucide-react';

export default function Navbar() {
  const { usuario, rol, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  if (!usuario) return null;

  const getRoleBadgeColor = () => {
    switch (rol) {
      case 'admin':
        return 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-450 dark:border-rose-900/30';
      case 'profesional':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-450 dark:border-emerald-900/30';
      default:
        return 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-450 dark:border-indigo-900/30';
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link
                href={rol === 'cliente' ? '/cliente/ordenes' : rol === 'profesional' ? '/profesional/ordenes' : '/admin'}
                className="flex items-center"
              >
                <Image
                  src="/logo.png"
                  alt="ConectaPro Logo"
                  width={192}
                  height={32}
                  priority
                  className="h-8 w-auto object-contain dark:brightness-110"
                />
              </Link>
            </div>

            {/* Links de Navegación por rol */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4 items-center">
              {rol === 'cliente' && (
                <>
                  <Link
                    href="/cliente/ordenes"
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-zinc-650 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-850 hover:text-zinc-900 dark:hover:text-zinc-150 transition-colors"
                  >
                    Mis Órdenes
                  </Link>
                  <Link
                    href="/cliente/ordenes/nueva"
                    className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-sm"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    Nueva Solicitud
                  </Link>
                </>
              )}

              {rol === 'profesional' && (
                <>
                  <Link
                    href="/profesional/ordenes"
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-zinc-650 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-850 hover:text-zinc-900 dark:hover:text-zinc-150 transition-colors"
                  >
                    Trabajos Disponibles
                  </Link>
                  <Link
                    href="/profesional/reputacion"
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-zinc-650 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-850 hover:text-zinc-900 dark:hover:text-zinc-150 transition-colors"
                  >
                    Mi Reputación
                  </Link>
                  <Link
                    href="/profesional/wallet"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-650 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-850 hover:text-zinc-900 dark:hover:text-zinc-150 transition-colors"
                  >
                    <Wallet className="h-3.5 w-3.5 text-zinc-400" />
                    Mi Billetera
                  </Link>
                </>
              )}

              {rol === 'admin' && (
                <>
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-650 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-850 hover:text-zinc-900 dark:hover:text-zinc-150 transition-colors"
                  >
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    Dashboard
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* User profile dropdown & logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {/* Avatar placeholder */}
              <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{usuario.nombre}</span>
                <span className={`inline-flex items-center self-start px-1.5 py-0.5 rounded text-[8px] font-bold border capitalize mt-0.5 ${getRoleBadgeColor()}`}>
                  {rol}
                </span>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-850 border border-zinc-200/50 dark:border-zinc-800/60 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
