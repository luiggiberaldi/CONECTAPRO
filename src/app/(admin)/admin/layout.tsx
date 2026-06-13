'use client';

import React from 'react';
import RouteGuard from '@/components/shared/RouteGuard';
import Navbar from '@/components/shared/Navbar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <RouteGuard allowedRoles={['admin']}>
      <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
        <Navbar />

        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col gap-6">
          {/* Área Principal de Contenido */}
          <main className="w-full min-w-0">
            <div className="animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>
    </RouteGuard>
  );
}
