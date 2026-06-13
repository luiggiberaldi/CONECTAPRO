'use client';

import React from 'react';
import RouteGuard from '@/components/shared/RouteGuard';
import Navbar from '@/components/shared/Navbar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CreditCard, ClipboardList, Users, Shield } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const navigation = [
    { name: 'KPIs & Estadísticas', href: '/admin', icon: LayoutDashboard },
    { name: 'Revisión de Recargas', href: '/admin/recargas', icon: CreditCard },
    { name: 'Monitoreo de Órdenes', href: '/admin/ordenes', icon: ClipboardList },
    { name: 'Gestión de Usuarios', href: '/admin/usuarios', icon: Users },
  ];

  return (
    <RouteGuard allowedRoles={['admin']}>
      <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
        <Navbar />

        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col md:flex-row gap-6">
          {/* Sidebar / Navegación */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl p-4 md:sticky md:top-20 shadow-sm space-y-4">
              <div className="flex items-center gap-2 px-2 pb-3 border-b border-zinc-150 dark:border-zinc-800/60">
                <Shield className="h-4 w-4 text-indigo-600 dark:text-indigo-455" />
                <span className="text-xs font-black tracking-wider uppercase text-zinc-800 dark:text-zinc-200">
                  Panel de Control
                </span>
              </div>

              <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-1 pb-2 md:pb-0 scrollbar-none">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all active:scale-97 md:hover:translate-x-1 duration-200 ${
                        isActive
                          ? 'bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 font-black border-l-4 border-indigo-600 shadow-sm shadow-indigo-500/5'
                          : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-850/50'
                      }`}
                    >
                      <Icon className={`h-4 w-4 transition-colors duration-200 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400'}`} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Área Principal de Contenido */}
          <main className="flex-1 min-w-0">
            <div className="animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    </RouteGuard>
  );
}
