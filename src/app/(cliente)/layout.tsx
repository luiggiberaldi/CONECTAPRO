'use client';

import React from 'react';
import RouteGuard from '@/components/shared/RouteGuard';
import Navbar from '@/components/shared/Navbar';

interface ClienteLayoutProps {
  children: React.ReactNode;
}

export default function ClienteLayout({ children }: ClienteLayoutProps) {
  return (
    <RouteGuard allowedRoles={['cliente']}>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
        <Navbar />
        {children}
      </div>
    </RouteGuard>
  );
}
