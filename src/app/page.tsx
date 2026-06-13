'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import {
  ShieldCheck,
  MessageSquare,
  Award,
  ArrowRight,
  ChevronDown,
  HelpCircle,
  Zap,
  Users,
  Briefcase
} from 'lucide-react';
import ProfesionesSection from '@/components/shared/ProfesionesSection';

const Home3DCanvas = dynamic(() => import('@/components/shared/Home3DCanvas'), {
  ssr: false,
});

export default function Home() {
  const { usuario, rol, initialized } = useAuth();
  const router = useRouter();

  // Redirección de sesión activa
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

  // Estados interactivos para "Cómo funciona" y "FAQs"
  const [activeRole, setActiveRole] = useState<'cliente' | 'profesional'>('cliente');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const [scrollProgress, setScrollProgress] = useState(0);
  const heroSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = heroSectionRef.current;
      if (!heroSection) return;

      const rect = heroSection.getBoundingClientRect();
      const totalHeight = heroSection.offsetHeight;
      const windowHeight = window.innerHeight;

      // El scrollable es la altura total de la sección menos el alto de la pantalla visible
      const scrollable = totalHeight - windowHeight;
      const progress = scrollable <= 0
        ? 0
        : Math.min(1, Math.max(0, -rect.top / scrollable));

      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Si ya se está verificando la sesión y hay usuario, se redirige.
  if (initialized && usuario) {
    return null;
  }

  // FAQs Data
  const faqs = [
    {
      q: '¿Cómo se le paga al profesional?',
      a: 'El pago se realiza directamente al profesional mediante los métodos acordados entre ambas partes (Pago Móvil, Zelle, efectivo o USDT). ConectaPro no retiene fondos ni actúa como intermediario de pagos.'
    },
    {
      q: '¿Tiene algún costo publicar una solicitud de servicio?',
      a: 'No, para los clientes publicar solicitudes es 100% gratis. Puedes publicar tantas solicitudes como necesites para plomería, enfermería o electricidad sin pagar cargos.'
    },
    {
      q: '¿Cómo funciona el sistema de créditos para profesionales?',
      a: 'Los profesionales compran paquetes de créditos accesibles desde su billetera digital. Cada postulación de servicio para aceptar una orden tiene un costo de 1 crédito. No cobramos comisiones sobre el monto final de tu trabajo.'
    },
    {
      q: '¿Cómo garantizan la seguridad y confianza?',
      a: 'Validamos el perfil de cada profesional, su especialidad y permitimos que la comunidad califique y reseñe cada trabajo. Además, nuestro chat cuenta con filtros anti-puenteo para asegurar las mejores prácticas.'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-indigo-500/20 overflow-x-hidden relative">
      {/* Decorative Blur Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-400/10 dark:bg-indigo-900/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[25%] right-[-10%] w-[45%] h-[45%] bg-rose-400/5 dark:bg-rose-900/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200/40 dark:border-zinc-800/40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center active:scale-98 transition-transform">
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
              className="px-4 py-2 text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/auth/registro"
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md hover:shadow-indigo-500/20 transition-all active:scale-95"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section con 3D Scrollytelling */}
      <main className="flex-1">
        <section ref={heroSectionRef} className="relative w-full h-[280vh] bg-zinc-950 text-white overflow-hidden">
          <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Lienzo WebGL 3D (Ocupa todo el fondo/lado derecho) */}
            <div className="absolute inset-0 z-0 opacity-60 dark:opacity-85 md:w-3/5 md:left-2/5 h-full">
              <Home3DCanvas progress={scrollProgress} mode={activeRole} />
            </div>

            {/* Degradados de ambiente */}
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/75 to-transparent z-5 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(99,102,241,0.06)_0%,transparent_50%)] pointer-events-none" />

            {/* HUD Indicators (Elementos Estilo Stark/Iron-Man) */}
            <div className="absolute top-24 left-6 md:left-10 z-10 flex items-center gap-2 pointer-events-none">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-ping" />
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-400">
                TELEMETRY LINK // LIVE // MODE: {activeRole.toUpperCase()}
              </span>
            </div>

            <div className="absolute top-24 right-6 md:right-10 z-10 flex items-center gap-2 pointer-events-none text-right">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-400">
                SCROLL PROGRESS:
              </span>
              <span className="font-mono text-[9px] text-indigo-400 font-bold">
                {Math.round(scrollProgress * 100)}%
              </span>
            </div>

            {/* Barra de progreso inferior del Hero */}
            <div className="absolute bottom-16 inset-x-6 md:inset-x-10 z-10">
              <div className="h-[2px] w-full bg-white/10 relative">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-75 origin-left"
                  style={{ transform: `scaleX(${scrollProgress})` }}
                />
              </div>
              <div className="flex justify-between items-center mt-2 font-mono text-[8px] md:text-[9px] uppercase tracking-[0.25em] text-zinc-500 pointer-events-none">
                <span>CONECTAPRO V1.0</span>
                <span>SYSTEM STATUS: OPERATIONAL</span>
                <span>SCROLL &darr; DISCOVER</span>
              </div>
            </div>

            {/* Contenido Izquierdo (Sticky e Interactivo) */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full h-full flex flex-col justify-center text-left">
              <div className="max-w-xl space-y-6">
                {/* Selector de Rol Dinámico */}
                <div className="inline-flex rounded-xl bg-white/5 border border-white/10 p-1 backdrop-blur-md">
                  <button
                    type="button"
                    onClick={() => setActiveRole('cliente')}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                      activeRole === 'cliente' 
                        ? 'bg-indigo-650 text-white shadow-md' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Contratar
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveRole('profesional')}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                      activeRole === 'profesional' 
                        ? 'bg-rose-650 text-white shadow-md' 
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Ser Contratado
                  </button>
                </div>

                {/* Copys e Interacciones Dinámicas */}
                <div className="space-y-4">
                  {activeRole === 'cliente' ? (
                    <>
                      <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-white transition-all duration-300">
                        Consigue talento de confianza{' '}
                        <span className="bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                          al instante
                        </span>
                      </h1>
                      <p className="text-xs md:text-sm text-zinc-400 leading-relaxed max-w-md transition-all duration-300">
                        Publica gratis y contrata expertos verificados en plomería, electricidad y enfermería. Todo el trato es directo, 100% libre de comisiones de intermediación.
                      </p>
                    </>
                  ) : (
                    <>
                      <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-white transition-all duration-300">
                        Multiplica tus ingresos{' '}
                        <span className="bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
                          sin pagar comisiones
                        </span>
                      </h1>
                      <p className="text-xs md:text-sm text-zinc-400 leading-relaxed max-w-md transition-all duration-300">
                        Postúlate a trabajos reales usando créditos económicos desde tu billetera digital prepago. Conserva el 100% de lo que facturas y contacta directamente.
                      </p>
                    </>
                  )}
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-4 pt-4">
                  <Link
                    href="/auth/registro"
                    className={`flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-xs font-bold text-white shadow-lg transition-all active:scale-95 group ${
                      activeRole === 'cliente' 
                        ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/15 hover:shadow-indigo-600/25' 
                        : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/15 hover:shadow-rose-600/25'
                    }`}
                  >
                    {activeRole === 'cliente' ? 'Comenzar Proyecto' : 'Ofrecer Servicios'}
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/auth/login"
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm px-6 py-3 text-xs font-bold text-white transition-all active:scale-95"
                  >
                    Iniciar Sesión
                  </Link>
                </div>
              </div>
            </div>

            {/* Cartas HUD Flotantes (Aparecen según el scrollProgress %) */}
            {/* CARTA 1: 0.15 a 0.35 */}
            <div 
              className={`absolute top-[22%] right-6 md:right-12 z-20 w-80 bg-zinc-900/80 border border-indigo-500/20 rounded-xl p-5 backdrop-blur-md transition-all duration-300 pointer-events-none md:pointer-events-auto ${
                scrollProgress >= 0.12 && scrollProgress <= 0.38 
                  ? 'translate-y-0 opacity-100 pointer-events-auto shadow-xl shadow-indigo-950/20' 
                  : 'translate-y-4 opacity-0'
              }`}
            >
              <div className="flex items-center justify-between border-b border-indigo-500/10 pb-2 mb-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-indigo-400">TELEMETRÍA 01 / COMMS</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wide">Chat Seguro e Anti-Puenteo</h4>
              <p className="text-[10px] text-zinc-400 mt-2 leading-relaxed">
                Nuestra IA escanea y detecta patrones de puenteo de datos de contacto de forma inmediata, garantizando que el acuerdo y la mensajería se mantengan transparentes.
              </p>
              <div className="mt-3 flex justify-between items-center text-[8px] font-mono text-zinc-500">
                <span>FILTER STATUS: ACTIVE</span>
                <span>PING 14MS</span>
              </div>
            </div>

            {/* CARTA 2: 0.45 a 0.65 */}
            <div 
              className={`absolute top-1/2 -translate-y-1/2 right-6 md:right-12 z-20 w-80 bg-zinc-900/80 border ${
                activeRole === 'cliente' ? 'border-indigo-500/20' : 'border-rose-500/20'
              } rounded-xl p-5 backdrop-blur-md transition-all duration-300 pointer-events-none md:pointer-events-auto ${
                scrollProgress >= 0.42 && scrollProgress <= 0.68 
                  ? 'translate-y-0 opacity-100 pointer-events-auto shadow-xl' 
                  : 'translate-y-4 opacity-0'
              }`}
            >
              <div className={`flex items-center justify-between border-b ${activeRole === 'cliente' ? 'border-indigo-500/10' : 'border-rose-500/10'} pb-2 mb-3`}>
                <span className={`font-mono text-[9px] uppercase tracking-[0.2em] ${activeRole === 'cliente' ? 'text-indigo-400' : 'text-rose-400'}`}>
                  TELEMETRÍA 02 / WALLET
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wide">Wallet Prepago Integrada</h4>
              <p className="text-[10px] text-zinc-400 mt-2 leading-relaxed">
                Los profesionales controlan su presupuesto mediante créditos prepagos transparentes. Descuentos progresivos del 10% y 20% y validación manual de comprobantes en tiempo real.
              </p>
              <div className="mt-3 flex justify-between items-center text-[8px] font-mono text-zinc-500">
                <span>TX STATE: STABLE</span>
                <span>FEE: 0%</span>
              </div>
            </div>

            {/* CARTA 3: 0.75 a 0.95 */}
            <div 
              className={`absolute bottom-24 right-6 md:bottom-28 md:right-12 z-20 w-80 bg-zinc-900/80 border ${
                activeRole === 'cliente' ? 'border-indigo-500/20' : 'border-rose-500/20'
              } rounded-xl p-5 backdrop-blur-md transition-all duration-300 pointer-events-none md:pointer-events-auto ${
                scrollProgress >= 0.72 && scrollProgress <= 0.98 
                  ? 'translate-y-0 opacity-100 pointer-events-auto shadow-xl' 
                  : 'translate-y-4 opacity-0'
              }`}
            >
              <div className={`flex items-center justify-between border-b ${activeRole === 'cliente' ? 'border-indigo-500/10' : 'border-rose-500/10'} pb-2 mb-3`}>
                <span className={`font-mono text-[9px] uppercase tracking-[0.2em] ${activeRole === 'cliente' ? 'text-indigo-400' : 'text-rose-400'}`}>
                  TELEMETRÍA 03 / TRUST
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wide">Reputación Impecable e Inapelable</h4>
              <p className="text-[10px] text-zinc-400 mt-2 leading-relaxed">
                Triggers de base de datos recalculan automáticamente la reputación de cada profesional. Calificaciones cruzadas transparentes garantizan la calidad del ecosistema ConectaPro.
              </p>
              <div className="mt-3 flex justify-between items-center text-[8px] font-mono text-zinc-500">
                <span>REPUTATION SYNCED</span>
                <span>RATING PRO: ★ 4.9</span>
              </div>
            </div>

          </div>
        </section>

        {/* Bento Grid: Valores Core */}
        <section className="py-16 bg-zinc-100/30 dark:bg-zinc-900/10 border-y border-zinc-200/30 dark:border-zinc-800/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold tracking-widest text-indigo-650 dark:text-indigo-400 uppercase">
                ¿Por qué elegir ConectaPro?
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight mt-2 text-zinc-900 dark:text-zinc-100">
                La forma más inteligente de contratar servicios
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Col-span-2 */}
              <div className="md:col-span-2 bg-white dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/80 rounded-3xl p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
                <div>
                  <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl w-fit mb-6">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Plataforma 100% Libre de Comisiones</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-lg leading-relaxed">
                    A diferencia de otros servicios, no cobramos un porcentaje del trabajo final. Los clientes contratan gratis y los profesionales conservan el 100% de lo que facturan. Todo el acuerdo monetario es directo.
                  </p>
                </div>
                <div className="mt-8 flex gap-6 text-xs font-bold text-zinc-500">
                  <div>
                    <span className="block text-2xl font-black text-indigo-600 dark:text-indigo-400">0%</span>
                    Comisión por servicio
                  </div>
                  <div className="border-l border-zinc-200 dark:border-zinc-800 pl-6">
                    <span className="block text-2xl font-black text-indigo-600 dark:text-indigo-400">Directo</span>
                    Pago móvil, efectivo, Zelle
                  </div>
                </div>
              </div>

              {/* Card 2: Col-span-1 */}
              <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/80 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl w-fit mb-6">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Perfiles Verificados</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  Revisamos exhaustivamente las especialidades, calificaciones y reseñas reales para asegurar tranquilidad en tu hogar.
                </p>
              </div>

              {/* Card 3: Col-span-1 */}
              <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/80 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl w-fit mb-6">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Chat Seguro Integrado</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  Comunícate y acuerda los detalles de tus servicios mediante nuestro sistema de chat seguro y directo en la app.
                </p>
              </div>

              {/* Card 4: Col-span-2 */}
              <div className="md:col-span-2 bg-white dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/80 rounded-3xl p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
                <div>
                  <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl w-fit mb-6">
                    <Award className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Reputación Impecable</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-lg leading-relaxed">
                    Visualiza valoraciones con estrellas, testimonios detallados de clientes previos y la cantidad de trabajos resueltos con éxito por cada profesional antes de adjudicar.
                  </p>
                </div>
                <div className="mt-8 flex gap-6 text-xs font-bold text-zinc-500">
                  <div>
                    <span className="block text-2xl font-black text-indigo-600 dark:text-indigo-400">★ 4.9</span>
                    Calificación promedio
                  </div>
                  <div className="border-l border-zinc-200 dark:border-zinc-800 pl-6">
                    <span className="block text-2xl font-black text-indigo-600 dark:text-indigo-400">Transparente</span>
                    Opiniones 100% verificadas
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Especialidades animadas */}
        <ProfesionesSection />

        {/* Sección interactiva: Cómo funciona */}
        <section className="py-20 bg-zinc-50 dark:bg-zinc-950">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold tracking-widest text-indigo-650 dark:text-indigo-400 uppercase">
                Proceso Simple
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight mt-2 text-zinc-900 dark:text-zinc-100">
                ¿Cómo funciona ConectaPro?
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                Selecciona tu rol para ver lo sencillo que es coordinar servicios.
              </p>
            </div>

            {/* Selector de Rol */}
            <div className="flex justify-center mb-12">
              <div className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl flex gap-1 border border-zinc-200/40 dark:border-zinc-800/40">
                <button
                  onClick={() => setActiveRole('cliente')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    activeRole === 'cliente'
                      ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-450 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-205'
                  }`}
                >
                  <Users className="h-3.5 w-3.5" />
                  Soy Cliente
                </button>
                <button
                  onClick={() => setActiveRole('profesional')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    activeRole === 'profesional'
                      ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-450 shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-205'
                  }`}
                >
                  <Briefcase className="h-3.5 w-3.5" />
                  Soy Profesional
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {activeRole === 'cliente' ? (
                <>
                  {/* Cliente Paso 1 */}
                  <div className="relative flex flex-col items-center md:items-start text-center md:text-left bg-white dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/40 p-6 rounded-2xl">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-black text-sm flex items-center justify-center mb-4 border border-indigo-100/50 dark:border-indigo-900/30">
                      1
                    </div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Publica tu Solicitud</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                      Describe tu requerimiento (ej. reparar grifo de cocina) de forma gratuita y especifica tu ubicación.
                    </p>
                  </div>
                  {/* Cliente Paso 2 */}
                  <div className="relative flex flex-col items-center md:items-start text-center md:text-left bg-white dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/40 p-6 rounded-2xl">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-black text-sm flex items-center justify-center mb-4 border border-indigo-100/50 dark:border-indigo-900/30">
                      2
                    </div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Recibe Propuestas</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                      Profesionales calificados y evaluados de tu zona revisarán la orden y se postularán para ayudarte.
                    </p>
                  </div>
                  {/* Cliente Paso 3 */}
                  <div className="relative flex flex-col items-center md:items-start text-center md:text-left bg-white dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/40 p-6 rounded-2xl">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-black text-sm flex items-center justify-center mb-4 border border-indigo-100/50 dark:border-indigo-900/30">
                      3
                    </div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Chatea y Coordina</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                      Usa el chat de la plataforma para resolver dudas, coordinar el precio final y la hora de visita.
                    </p>
                  </div>
                  {/* Cliente Paso 4 */}
                  <div className="relative flex flex-col items-center md:items-start text-center md:text-left bg-white dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/40 p-6 rounded-2xl">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-black text-sm flex items-center justify-center mb-4 border border-indigo-100/50 dark:border-indigo-900/30">
                      4
                    </div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Paga y Califica</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                      Una vez completado el servicio, paga directamente al experto y califica su reputación en la plataforma.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Profesional Paso 1 */}
                  <div className="relative flex flex-col items-center md:items-start text-center md:text-left bg-white dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/40 p-6 rounded-2xl">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-black text-sm flex items-center justify-center mb-4 border border-indigo-100/50 dark:border-indigo-900/30">
                      1
                    </div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Carga Créditos</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                      Adquiere paquetes de créditos accesibles reportando tu transferencia por Pago Móvil, Zelle o USDT.
                    </p>
                  </div>
                  {/* Profesional Paso 2 */}
                  <div className="relative flex flex-col items-center md:items-start text-center md:text-left bg-white dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/40 p-6 rounded-2xl">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-black text-sm flex items-center justify-center mb-4 border border-indigo-100/50 dark:border-indigo-900/30">
                      2
                    </div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Postúlate a Trabajos</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                      Examina las solicitudes disponibles en tu especialidad y usa 1 crédito para aceptar e iniciar la orden.
                    </p>
                  </div>
                  {/* Profesional Paso 3 */}
                  <div className="relative flex flex-col items-center md:items-start text-center md:text-left bg-white dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/40 p-6 rounded-2xl">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-black text-sm flex items-center justify-center mb-4 border border-indigo-100/50 dark:border-indigo-900/30">
                      3
                    </div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Define Detalles</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                      Comunícate con el cliente mediante el chat de la orden para concertar costos y agenda técnica.
                    </p>
                  </div>
                  {/* Profesional Paso 4 */}
                  <div className="relative flex flex-col items-center md:items-start text-center md:text-left bg-white dark:bg-zinc-900/40 border border-zinc-200/40 dark:border-zinc-800/40 p-6 rounded-2xl">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-black text-sm flex items-center justify-center mb-4 border border-indigo-100/50 dark:border-indigo-900/30">
                      4
                    </div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Factura el 100%</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                      Completa el trabajo, recibe tu remuneración completa de forma directa y mejora tu reputación digital.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Sección de FAQs Acordeón */}
        <section className="py-20 bg-zinc-100/30 dark:bg-zinc-900/10 border-t border-zinc-200/40 dark:border-zinc-800/30">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl w-fit mx-auto mb-4">
                <HelpCircle className="h-5 w-5" />
              </div>
              <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
                Preguntas Frecuentes
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Aclara tus dudas acerca de cómo opera nuestra plataforma en Venezuela.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="bg-white dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl overflow-hidden transition-all shadow-sm"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between p-5 text-left font-bold text-xs sm:text-sm text-zinc-850 dark:text-zinc-150 focus:outline-none transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`h-4 w-4 text-zinc-400 dark:text-zinc-500 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        isOpen ? 'max-h-40 border-t border-zinc-100 dark:border-zinc-800/60' : 'max-h-0'
                      }`}
                    >
                      <p className="p-5 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Bottom CTA Block */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900 via-indigo-950 to-zinc-950 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              ¿Listo para comenzar a resolver o ganar dinero?
            </h2>
            <p className="text-sm sm:text-base text-indigo-200 max-w-xl mx-auto leading-relaxed">
              Únete gratis a la comunidad técnica más grande y confiable de Venezuela hoy mismo.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto pt-4">
              {/* Opción Cliente */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-left flex flex-col justify-between space-y-6">
                <div>
                  <h4 className="text-base font-bold text-white">¿Necesitas ayuda en casa?</h4>
                  <p className="text-xs text-indigo-200 mt-1.5 leading-relaxed">
                    Publica solicitudes de plomería, enfermería o electricidad y encuentra al técnico perfecto sin comisiones intermedias.
                  </p>
                </div>
                <Link
                  href="/auth/registro"
                  className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-white hover:bg-zinc-100 text-indigo-950 py-2.5 text-xs font-bold transition-all active:scale-98"
                >
                  Publicar un Servicio
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Opción Profesional */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl text-left flex flex-col justify-between space-y-6">
                <div>
                  <h4 className="text-base font-bold text-white">¿Ofreces tus servicios?</h4>
                  <p className="text-xs text-indigo-200 mt-1.5 leading-relaxed">
                    Postúlate a ofertas activas de tu área, acuerda tus propios precios directamente y quédate con el 100% de tus ingresos.
                  </p>
                </div>
                <Link
                  href="/auth/registro"
                  className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 text-xs font-bold transition-all border border-indigo-500/25 active:scale-98"
                >
                  Registrarme como Experto
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-200/40 dark:border-zinc-800/40 text-center text-xs text-zinc-450 dark:text-zinc-500 bg-white/40 dark:bg-zinc-950/20 backdrop-blur-sm relative z-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Image
            src="/logo.png"
            alt="ConectaPro Logo"
            width={128}
            height={22}
            className="h-5.5 w-auto object-contain opacity-50 dark:brightness-110"
          />
          <p>© 2026 ConectaPro. Todos los derechos reservados. Hecho en Venezuela.</p>
        </div>
      </footer>
    </div>
  );
}
