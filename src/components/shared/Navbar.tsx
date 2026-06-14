'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  LogOut, 
  LayoutDashboard, 
  PlusCircle, 
  Wallet, 
  Search, 
  Bell, 
  MessageSquare, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const { usuario, rol, logout } = useAuth();
  const router = useRouter();
  
  // Estados de dropdowns e interacciones
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  
  const navRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdowns al hacer clic fuera del componente
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
        setIsMessagesOpen(false);
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  if (!usuario) return null;

  const getRoleBadgeColor = () => {
    switch (rol) {
      case 'admin':
        return 'bg-rose-100 text-rose-700 border-rose-205 dark:bg-rose-950/30 dark:text-rose-450 dark:border-rose-900/30';
      case 'profesional':
        return 'bg-emerald-100 text-emerald-700 border-emerald-205 dark:bg-emerald-950/30 dark:text-emerald-450 dark:border-emerald-900/30';
      default:
        return 'bg-indigo-100 text-indigo-700 border-indigo-205 dark:bg-indigo-950/30 dark:text-indigo-450 dark:border-indigo-900/30';
    }
  };

  return (
    <nav 
      ref={navRef}
      className="sticky top-0 z-40 w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link
                href={rol === 'cliente' ? '/cliente/ordenes' : rol === 'profesional' ? '/profesional/ordenes' : '/admin'}
                className="flex items-center"
              >
                <Image
                  src="/logo.png"
                  alt="ConectaPro Logo"
                  width={150}
                  height={28}
                  priority
                  className="h-7 w-auto object-contain dark:brightness-110"
                />
              </Link>
            </div>

            {/* Links de Navegación por rol - Estilo Workana */}
            <div className="hidden sm:flex sm:space-x-1 items-center">
              {rol === 'cliente' && (
                <>
                  <Link
                    href="/cliente/ordenes"
                    className="px-3.5 py-2 rounded-xl text-md font-bold text-zinc-600 hover:bg-zinc-50 dark:text-zinc-350 dark:hover:bg-zinc-900 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
                  >
                    Buscar profesionales
                  </Link>                  <Link
                    href="/cliente/ordenes"
                    className="px-3.5 py-2 rounded-xl text-md font-bold text-zinc-600 hover:bg-zinc-50 dark:text-zinc-350 dark:hover:bg-zinc-900 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
                  >
                    Mis solicitudes
                  </Link>

                  <Link
                    href="/cliente/ordenes/nueva"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-md font-bold text-white bg-indigo-650 hover:bg-indigo-500 transition-all shadow-sm active:scale-98"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Publicar solicitud
                  </Link>
                </>
              )}

              {rol === 'profesional' && (
                <>
                  <Link
                    href="/profesional/ordenes"
                    className="px-3.5 py-2 rounded-xl text-md font-bold text-zinc-600 hover:bg-zinc-50 dark:text-zinc-350 dark:hover:bg-zinc-900 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
                  >
                    Busca trabajo
                  </Link>
                  <Link
                    href="/profesional/ordenes"
                    className="px-3.5 py-2 rounded-xl text-md font-bold text-zinc-600 hover:bg-zinc-50 dark:text-zinc-350 dark:hover:bg-zinc-900 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
                  >
                    Mis trabajos
                  </Link>
                  <Link
                    href="/profesional/wallet"
                    className="px-3.5 py-2 rounded-xl text-md font-bold text-zinc-600 hover:bg-zinc-50 dark:text-zinc-350 dark:hover:bg-zinc-900 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
                  >
                    Mis finanzas
                  </Link>
                  <Link
                    href="/profesional/reputacion"
                    className="px-3.5 py-2 rounded-xl text-md font-bold text-zinc-600 hover:bg-zinc-50 dark:text-zinc-350 dark:hover:bg-zinc-900 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
                  >
                    Mi reputación
                  </Link>
                </>
              )}

              {rol === 'admin' && (
                <>
                  <Link
                    href="/admin"
                    className="px-3.5 py-2 rounded-xl text-md font-bold text-zinc-600 hover:bg-zinc-50 dark:text-zinc-350 dark:hover:bg-zinc-900 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/admin/usuarios"
                    className="px-3.5 py-2 rounded-xl text-md font-bold text-zinc-600 hover:bg-zinc-50 dark:text-zinc-350 dark:hover:bg-zinc-900 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
                  >
                    Usuarios
                  </Link>
                  <Link
                    href="/admin/recargas"
                    className="px-3.5 py-2 rounded-xl text-md font-bold text-zinc-600 hover:bg-zinc-50 dark:text-zinc-350 dark:hover:bg-zinc-900 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
                  >
                    Recargas
                  </Link>
                  <Link
                    href="/admin/ordenes"
                    className="px-3.5 py-2 rounded-xl text-md font-bold text-zinc-600 hover:bg-zinc-50 dark:text-zinc-350 dark:hover:bg-zinc-900 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
                  >
                    Órdenes
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Menú de Iconos y Dropdowns (Derecha) - Estilo Workana */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Buscador Extensible */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsSearchExpanded(!isSearchExpanded);
                  setIsNotificationsOpen(false);
                  setIsMessagesOpen(false);
                  setIsProfileOpen(false);
                }}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  isSearchExpanded 
                    ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/35 dark:text-indigo-400' 
                    : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-900'
                }`}
                title="Buscar"
              >
                <Search className="h-5 w-5" />
              </button>
              {isSearchExpanded && (
                <div className="absolute right-0 top-12 z-50 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg p-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
                  <input
                    type="text"
                    placeholder="Buscar en ConectaPro..."
                    className="w-full px-3 py-1.5 text-md bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-550 dark:text-zinc-200"
                    autoFocus
                  />
                </div>
              )}
            </div>

            {/* Notificaciones */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsMessagesOpen(false);
                  setIsProfileOpen(false);
                  setIsSearchExpanded(false);
                }}
                className={`p-2 rounded-xl relative transition-all duration-200 ${
                  isNotificationsOpen 
                    ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/35 dark:text-indigo-400' 
                    : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-900'
                }`}
                title="Notificaciones"
              >
                <Bell className="h-5 w-5" />
                {/* Indicador de notificaciones mock */}
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-550 border border-white dark:border-zinc-950" />
              </button>
              {isNotificationsOpen && (
                <div className="absolute right-0 top-12 z-50 w-72 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl py-3.5 px-4 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-800 mb-3">
                    <h3 className="text-md font-bold text-zinc-900 dark:text-zinc-100">Notificaciones</h3>
                    <span className="text-[15px] bg-zinc-100 text-zinc-660 dark:bg-zinc-800 dark:text-zinc-300 px-2 py-0.5 rounded-full font-bold">1 nueva</span>
                  </div>
                  <div className="flex flex-col items-center justify-center py-5 text-center">
                    <Bell className="h-8 w-8 text-indigo-400 dark:text-indigo-500/80 mb-2 animate-bounce" />
                    <p className="text-md font-bold text-zinc-800 dark:text-zinc-200">¡Bienvenido a ConectaPro!</p>
                    <p className="text-[15px] text-zinc-500 dark:text-zinc-400 mt-1.5 max-w-[220px]">
                      Explora la plataforma y descubre todas las herramientas de soporte técnico y profesional.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Mensajes */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsMessagesOpen(!isMessagesOpen);
                  setIsNotificationsOpen(false);
                  setIsProfileOpen(false);
                  setIsSearchExpanded(false);
                }}
                className={`p-2 rounded-xl relative transition-all duration-200 ${
                  isMessagesOpen 
                    ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/35 dark:text-indigo-400' 
                    : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-900'
                }`}
                title="Mensajes"
              >
                <MessageSquare className="h-5 w-5" />
              </button>
              {isMessagesOpen && (
                <div className="absolute right-0 top-12 z-50 w-72 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl py-3.5 px-4 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-800 mb-3">
                    <h3 className="text-md font-bold text-zinc-900 dark:text-zinc-100">Mensajes</h3>
                    <span className="text-[15px] bg-zinc-100 text-zinc-650 dark:bg-zinc-800 dark:text-zinc-300 px-2 py-0.5 rounded-full font-bold">0 nuevos</span>
                  </div>
                  <div className="flex flex-col items-center justify-center py-5 text-center">
                    <MessageSquare className="h-8 w-8 text-zinc-300 dark:text-zinc-700 mb-2" />
                    <p className="text-md font-bold text-zinc-800 dark:text-zinc-200">Sin chats nuevos</p>
                    <p className="text-[15px] text-zinc-500 dark:text-zinc-400 mt-1 max-w-[200px]">
                      Conversa con otros usuarios directamente desde el detalle de tus solicitudes asignadas.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Avatar & Perfil Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                  setIsMessagesOpen(false);
                  setIsSearchExpanded(false);
                }}
                className="flex items-center gap-1.5 focus:outline-none p-1 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                {usuario.avatar_url ? (
                  <img
                    src={usuario.avatar_url}
                    alt={usuario.nombre}
                    className="h-8 w-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-800 shadow-sm"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-black text-md shadow-sm">
                    {usuario.nombre.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <ChevronDown className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-12 z-50 w-60 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl py-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Info de Usuario */}
                  <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 flex flex-col gap-1">
                    <span className="text-md font-black text-zinc-900 dark:text-zinc-100 leading-tight">{usuario.nombre}</span>
                    <span className="text-[15px] text-zinc-500 dark:text-zinc-400 truncate max-w-full">{usuario.email}</span>
                    <span className={`inline-flex items-center self-start px-2 py-0.5 rounded-md text-base font-bold border capitalize mt-1.5 tracking-wider ${getRoleBadgeColor()}`}>
                      {rol}
                    </span>
                  </div>

                  {/* Acciones del menú */}
                  <div className="py-1">
                    <Link
                      href={rol === 'cliente' ? '/cliente/ordenes' : rol === 'profesional' ? '/profesional/ordenes' : '/admin'}
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-md font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-zinc-400" />
                      {rol === 'admin' ? 'Panel de Administración' : 'Mi Ficha de Usuario'}
                    </Link>

                    {rol === 'profesional' && (
                      <Link
                        href="/profesional/wallet"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-md font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-zinc-100 transition-colors"
                      >
                        <Wallet className="h-4 w-4 text-zinc-400" />
                        Mi Billetera
                      </Link>
                    )}
                  </div>

                  <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />

                  {/* Logout */}
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-md font-black text-rose-600 dark:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Hamburger menu toggle */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                  setIsNotificationsOpen(false);
                  setIsMessagesOpen(false);
                  setIsSearchExpanded(false);
                  setIsProfileOpen(false);
                }}
                className="p-1.5 rounded-xl text-zinc-500 hover:text-zinc-855 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-900 transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menú Mobile Colapsable */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t border-zinc-150 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 pt-2 pb-4 space-y-1.5 shadow-inner transition-all duration-200">
          {rol === 'cliente' && (
            <>
              <Link
                href="/cliente/ordenes"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-md font-bold text-zinc-750 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                Buscar profesionales
              </Link>
              <Link
                href="/cliente/ordenes"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-md font-bold text-zinc-750 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                Mis solicitudes
              </Link>

              <Link
                href="/cliente/ordenes/nueva"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-md font-bold text-white bg-indigo-650 hover:bg-indigo-500 transition-all shadow-sm"
              >
                <PlusCircle className="h-4 w-4" />
                Publicar solicitud
              </Link>
            </>
          )}

          {rol === 'profesional' && (
            <>
              <Link
                href="/profesional/ordenes"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-md font-bold text-zinc-750 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                Busca trabajo
              </Link>
              <Link
                href="/profesional/ordenes"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-md font-bold text-zinc-750 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                Mis trabajos
              </Link>
              <Link
                href="/profesional/wallet"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-md font-bold text-zinc-750 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                Mis finanzas
              </Link>
              <Link
                href="/profesional/reputacion"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-md font-bold text-zinc-750 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                Mi reputación
              </Link>
            </>
          )}

          {rol === 'admin' && (
            <>
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-md font-bold text-zinc-750 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/usuarios"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-md font-bold text-zinc-750 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                Usuarios
              </Link>
              <Link
                href="/admin/recargas"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-md font-bold text-zinc-750 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                Recargas
              </Link>
              <Link
                href="/admin/ordenes"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-md font-bold text-zinc-750 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
              >
                Órdenes
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
