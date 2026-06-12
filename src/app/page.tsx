'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, MessageSquare, Award, ArrowRight } from 'lucide-react';
import ProfesionesSection from '@/components/shared/ProfesionesSection';

export default function Home() {
  const { usuario, rol, initialized } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (initialized && usuario) {
      if (rol === 'admin') {
        router.push('/admin');
      } else if (rol === 'profesional') {
        router.push('/profesional/ordenes');
      } else {
        router.push('/cliente/ordenes');
      }
    }
  }, [usuario, rol, initialized, router]);

  // Si ya se está verificando la sesión y hay usuario, se redirige. Mientras, mostramos vacío.
  if (initialized && usuario) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-tr from-zinc-50 via-indigo-50/10 to-zinc-50 dark:from-zinc-950 dark:via-indigo-950/10 dark:to-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="ConectaPro Logo"
              width={192}
              height={32}
              priority
              className="h-8 w-auto object-contain dark:brightness-110"
            />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/login"
              className="px-4 py-2 text-xs font-bold text-zinc-650 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/auth/registro"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-sm transition-all"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        <div className="space-y-6 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
            🚀 Marketplace de Servicios para Venezuela
          </span>
          
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Conecta con profesionales de confianza para resolver cualquier problema
          </h1>
          
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Plomería, enfermería y electricidad al alcance de un clic. Seguro, rápido y con reputación garantizada.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Link
              href="/auth/registro"
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-500 transition-all active:scale-95 group"
            >
              Comenzar Ahora
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/auth/login"
              className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 px-6 py-3 text-sm font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all active:scale-95"
            >
              Tengo una Cuenta
            </Link>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 w-full">
          <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 text-left shadow-sm">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-250">Profesionales Verificados</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
              Consulta perfiles detallados, valoraciones reales de clientes y experiencia comprobada.
            </p>
          </div>

          <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 text-left shadow-sm">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit mb-4">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-250">Chat Seguro</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
              Coordinación transparente y segura del servicio directo desde la plataforma.
            </p>
          </div>

          <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 text-left shadow-sm">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit mb-4">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-250">Pagos 100% Directos</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
              El cobro del servicio es acordado y pagado directamente al profesional. ConectaPro no cobra comisiones.
            </p>
          </div>
        </div>

        {/* Profesiones Animadas */}
        <ProfesionesSection />
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-zinc-200/50 dark:border-zinc-800/50 text-center text-xs text-zinc-450 dark:text-zinc-500 bg-white/20 dark:bg-zinc-950/20">
        <p>© 2026 ConectaPro. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
