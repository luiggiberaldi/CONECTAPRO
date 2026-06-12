'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Loader2, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const { login, loading } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email || !password) {
      setFormError('Por favor completa todos los campos.');
      return;
    }

    const res = await login(email, password);
    if (res?.user?.id) {
      // Redirigir según el rol del usuario asignado en base de datos
      const metadataRol = res.user.user_metadata?.rol || 'cliente';
      if (metadataRol === 'admin') {
        router.push('/admin');
      } else if (metadataRol === 'profesional') {
        router.push('/profesional/ordenes');
      } else {
        router.push('/cliente/ordenes');
      }

    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-gradient-to-tr from-zinc-50 via-indigo-50/10 to-zinc-50 dark:from-zinc-950 dark:via-indigo-950/10 dark:to-zinc-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center flex flex-col items-center">
        <Link href="/" className="mb-4 flex justify-center">
          <Image
            src="/logo.png"
            alt="ConectaPro Logo"
            width={216}
            height={36}
            priority
            className="h-9 w-auto object-contain dark:brightness-110"
          />
        </Link>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Inicia sesión en tu cuenta
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Marketplace de servicios para Venezuela
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-6 py-8 border border-white/20 dark:border-zinc-800/30 rounded-2xl shadow-xl">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {formError && (
              <div className="p-3 text-xs font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                {formError}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Correo electrónico
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border-zinc-200 dark:border-zinc-800 pl-10 pr-4 py-2.5 bg-white/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 text-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all outline-none border focus:ring-1"
                  placeholder="ejemplo@correo.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="pass" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Contraseña
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="pass"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border-zinc-200 dark:border-zinc-800 pl-10 pr-4 py-2.5 bg-white/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 text-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all outline-none border focus:ring-1"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Ingresar
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs">
            <span className="text-zinc-500 dark:text-zinc-400">¿No tienes una cuenta aún? </span>
            <Link
              href="/auth/registro"
              className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center justify-center gap-1 mt-1.5"
            >
              Regístrate aquí
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
