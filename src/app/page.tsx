'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  MessageSquare,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  Zap,
  Users,
  Briefcase,
  Clock,
  MapPin,
  Lock,
  ClipboardList,
  UserCheck,
  Search,
  Coins
} from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase';
import ProfesionesSection from '@/components/shared/ProfesionesSection';

interface Categoria {
  nombre: string;
}

interface OrdenReciente {
  id: string;
  titulo: string;
  ciudad: string;
  zona: string | null;
  urgencia: string;
  createdat: string;
  categorias: Categoria | Categoria[] | null;
}

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
  const [recientes, setRecientes] = useState<OrdenReciente[]>([]);
  const [loadingRecientes, setLoadingRecientes] = useState(true);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  useEffect(() => {
    async function cargarRecientes() {
      try {
        const { data, error } = await supabaseBrowser
          .from('ordenes')
          .select(`
            id,
            titulo,
            ciudad,
            zona,
            urgencia,
            createdat,
            categorias (nombre)
          `)
          .eq('estado', 'pendiente')
          .order('createdat', { ascending: false })
          .limit(3);
        
        if (error) throw error;
        if (data) {
          setRecientes(data);
        }
      } catch (err) {
        console.error('Error al cargar órdenes recientes en el Home:', err);
      } finally {
        setLoadingRecientes(false);
      }
    }

    cargarRecientes();
  }, []);

  // Pasos de onboarding para Cliente y Profesional
  const pasosCliente = [
    {
      num: "01",
      icon: ClipboardList,
      title: "Publica tu solicitud gratis",
      desc: "Describe tu requerimiento (ej. plomería, electricidad o enfermería) en tu zona sin costo alguno."
    },
    {
      num: "02",
      icon: Users,
      title: "Recibe ofertas de expertos",
      desc: "Profesionales calificados y evaluados de tu zona revisarán tu orden de trabajo y se postularán."
    },
    {
      num: "03",
      icon: MessageSquare,
      title: "Chatea y coordina directo",
      desc: "Usa nuestro chat seguro integrado para resolver dudas, acordar el costo y pautar el día de la visita."
    },
    {
      num: "04",
      icon: CheckCircle2,
      title: "Paga directo y califica",
      desc: "Una vez finalizado el trabajo, paga directamente por el canal de tu preferencia y califica el servicio."
    }
  ];

  const pasosProfesional = [
    {
      num: "01",
      icon: UserCheck,
      title: "Carga créditos de contacto",
      desc: "Adquiere paquetes accesibles reportando tu pago directamente vía Pago Móvil, Zelle o USDT."
    },
    {
      num: "02",
      icon: Search,
      title: "Postúlate a trabajos activos",
      desc: "Examina las solicitudes de servicio en tu ciudad y usa 1 crédito de contacto para abrir el chat."
    },
    {
      num: "03",
      icon: MessageSquare,
      title: "Acuerda tarifas sin intermediarios",
      desc: "Coordina el presupuesto definitivo y la agenda técnica directamente con el cliente por chat."
    },
    {
      num: "04",
      icon: Coins,
      title: "Gana y conserva el 100%",
      desc: "Completa el trabajo, recibe tu dinero directamente y suma valoraciones positivas para destacar."
    }
  ];

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
              className="h-6 sm:h-8 w-auto object-contain dark:brightness-110"
            />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/auth/login"
              className="px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100 transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/auth/registro"
              className="px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md hover:shadow-indigo-500/20 transition-all active:scale-95"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-4 pt-20 pb-16 sm:px-6 lg:px-8 flex flex-col items-center text-center relative z-10">
          {/* Dot Grid Background */}
          <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(#e4e4e7_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#27272a_1.5px,transparent_1.5px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)] opacity-70" />

          {/* Floating Professional Card (Left) */}
          <div className="absolute left-[-10%] top-[15%] hidden xl:flex flex-col p-4 w-56 rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl backdrop-blur-md animate-float pointer-events-none select-none">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-rose-500 flex items-center justify-center text-white text-sm font-black shadow-inner">
                CM
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">Carlos Medina</p>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Plomería General</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/60 pt-2.5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-500 text-xs">★</span>
                ))}
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                <ShieldCheck className="h-3 w-3" />
                Verificado
              </span>
            </div>
          </div>

          {/* Floating Order Card (Right) */}
          <div className="absolute right-[-10%] top-[25%] hidden xl:flex flex-col p-4 w-56 rounded-2xl bg-white/70 dark:bg-zinc-900/70 border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl backdrop-blur-md animate-float-delayed pointer-events-none select-none">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
                <Zap className="h-3 w-3" />
                Solicitud Activa
              </span>
              <span className="text-xs font-semibold text-zinc-400">Hace 5m</span>
            </div>
            <p className="mt-2 text-sm font-bold text-zinc-900 dark:text-white text-left">Instalación Eléctrica</p>
            <p className="text-xs font-normal text-zinc-500 dark:text-zinc-400 text-left">Caracas, Chacao</p>
            <div className="mt-3 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/60 pt-2.5 text-xs">
              <span className="font-semibold text-zinc-400">Trato</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">Directo sin Comisión</span>
            </div>
          </div>

          <div className="space-y-6 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-50/80 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30 animate-pulse">
              <Sparkles className="h-3.5 w-3.5" />
              El Marketplace de servicios líder de Venezuela
            </span>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none text-zinc-900 dark:text-white">
              Talento profesional de confianza{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-rose-500 bg-clip-text text-transparent">
                sin intermediarios ni comisiones
              </span>
            </h1>
            
            <p className="text-sm sm:text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Consigue expertos verificados en plomería, enfermería y electricidad en minutos. Acuerda y paga directamente sin tarifas ocultas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4.5 justify-center pt-6">
              <Link
                href="/auth/registro"
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/15 hover:bg-indigo-500 hover:shadow-indigo-600/25 transition-all active:scale-95 group"
              >
                Comenzar Ahora
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/auth/login"
                className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-sm px-7 py-3.5 text-sm font-bold hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all active:scale-95"
              >
                Tengo una Cuenta
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-8 pt-12 text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-450">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                +10,000 Trabajos Resueltos
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Reputación e Historial Transparente
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Paga Directo al Profesional
              </span>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1: Col-span-2 */}
              <div className="sm:col-span-2 lg:col-span-2 bg-white dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/80 rounded-3xl p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
                <div>
                  <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl w-fit mb-6">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Plataforma 100% Libre de Comisiones</h3>
                  <p className="text-sm text-zinc-655 dark:text-zinc-400 mt-2 max-w-lg leading-relaxed">
                    A diferencia de otros servicios, no cobramos un porcentaje del trabajo final. Los clientes contratan gratis y los profesionales conservan el 100% de lo que facturan. Todo el acuerdo monetario es directo.
                  </p>
                </div>
                <div className="mt-8 pt-5 border-t border-zinc-100 dark:border-zinc-800/50 flex gap-6 text-xs font-bold text-zinc-500">
                  <div>
                    <span className="block text-2xl font-black text-indigo-650 dark:text-indigo-400">0%</span>
                    Comisión por servicio
                  </div>
                  <div className="border-l border-zinc-200 dark:border-zinc-850 pl-6">
                    <span className="block text-2xl font-black text-indigo-655 dark:text-indigo-400 font-extrabold">Directo</span>
                    Pago móvil, efectivo, Zelle
                  </div>
                </div>
              </div>

              {/* Card 2: Col-span-1 */}
              <div className="sm:col-span-1 lg:col-span-1 bg-white dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/80 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col justify-between h-full">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
                <div>
                  <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl w-fit mb-6">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Perfiles Verificados</h3>
                  <p className="text-sm text-zinc-655 dark:text-zinc-400 mt-2 leading-relaxed">
                    Revisamos exhaustivamente las especialidades, calificaciones y reseñas reales para asegurar tranquilidad en tu hogar.
                  </p>
                </div>
                
                {/* Footer unificado */}
                <div className="mt-8 pt-5 border-t border-zinc-100 dark:border-zinc-800/50 flex items-center gap-3 text-[11px] font-bold text-zinc-500">
                  <div className="flex -space-x-1.5">
                    <div className="h-6 w-6 rounded-full bg-indigo-50 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[9px] font-extrabold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
                      AM
                    </div>
                    <div className="h-6 w-6 rounded-full bg-zinc-100 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[9px] font-extrabold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-350">
                      JS
                    </div>
                    <div className="h-6 w-6 rounded-full bg-indigo-650 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[10px] text-white font-black">
                      ✓
                    </div>
                  </div>
                  <div>
                    <span className="block text-indigo-655 dark:text-indigo-400 text-xs font-black uppercase tracking-wider">100% Seguro</span>
                    Antecedentes validados
                  </div>
                </div>
              </div>

              {/* Card 3: Col-span-1 */}
              <div className="sm:col-span-1 lg:col-span-1 bg-white dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/80 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col justify-between h-full">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
                <div>
                  <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl w-fit mb-6">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Chat Seguro Integrado</h3>
                  <p className="text-sm text-zinc-655 dark:text-zinc-400 mt-2 leading-relaxed">
                    Comunícate y acuerda los detalles de tus servicios mediante nuestro sistema de chat seguro y directo en la app.
                  </p>
                </div>

                {/* Footer unificado */}
                <div className="mt-8 pt-5 border-t border-zinc-100 dark:border-zinc-800/50 flex items-center gap-2 text-[11px] font-bold text-zinc-500">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-black uppercase text-[10px] tracking-wider flex items-center gap-1">
                    <Lock className="h-3.5 w-3.5" /> Protegido
                  </span>
                  <span>• Encriptación activa</span>
                </div>
              </div>

              {/* Card 4: Col-span-2 */}
              <div className="sm:col-span-2 lg:col-span-2 bg-white dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/80 rounded-3xl p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
                <div>
                  <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl w-fit mb-6">
                    <Award className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Reputación Impecable</h3>
                  <p className="text-sm text-zinc-655 dark:text-zinc-400 mt-2 max-w-lg leading-relaxed">
                    Visualiza valoraciones con estrellas, testimonios detallados de clientes previos y la cantidad de trabajos resueltos con éxito por cada profesional antes de adjudicar.
                  </p>
                </div>
                <div className="mt-8 pt-5 border-t border-zinc-100 dark:border-zinc-800/50 flex gap-6 text-xs font-bold text-zinc-500">
                  <div>
                    <span className="block text-2xl font-black text-indigo-650 dark:text-indigo-400">★ 4.9</span>
                    Calificación promedio
                  </div>
                  <div className="border-l border-zinc-200 dark:border-zinc-850 pl-6">
                    <span className="block text-2xl font-black text-indigo-655 dark:text-indigo-400">Transparente</span>
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
        <section className="py-20 bg-zinc-50 dark:bg-zinc-950/40 border-y border-zinc-200/30 dark:border-zinc-800/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Cabecera Centrada */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-black tracking-widest text-indigo-650 dark:text-indigo-400 uppercase">
                Proceso Simple
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-white mt-1">
                ¿Cómo funciona ConectaPro?
              </h2>
              <p className="text-sm text-zinc-655 dark:text-zinc-400 mt-3 max-w-xl mx-auto leading-relaxed">
                ConectaPro conecta de manera directa a clientes y técnicos en Venezuela sin cobrar comisiones ni intermediar los pagos.
              </p>

              {/* Selector de Rol Deslizante (Centrado) */}
              <div className="relative bg-zinc-150/80 dark:bg-zinc-900/60 p-1 rounded-2xl flex border border-zinc-250/30 dark:border-zinc-800/40 max-w-xs mx-auto mt-8">
                {/* Indicador deslizante */}
                <div
                  className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-white dark:bg-zinc-800 rounded-xl shadow-sm transition-all duration-300 ease-out border border-zinc-200/10 dark:border-zinc-750/30 ${
                    activeRole === 'profesional' ? 'translate-x-full' : 'translate-x-0'
                  }`}
                />
                <button
                  onClick={() => setActiveRole('cliente')}
                  className={`relative z-10 w-1/2 py-2.5 text-xs font-black text-center transition-all flex items-center justify-center gap-1.5 rounded-xl ${
                    activeRole === 'cliente'
                      ? 'text-indigo-600 dark:text-indigo-455'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  <Users className="h-3.5 w-3.5" />
                  Soy Cliente
                </button>
                <button
                  onClick={() => setActiveRole('profesional')}
                  className={`relative z-10 w-1/2 py-2.5 text-xs font-black text-center transition-all flex items-center justify-center gap-1.5 rounded-xl ${
                    activeRole === 'profesional'
                      ? 'text-indigo-600 dark:text-indigo-455'
                      : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
                  }`}
                >
                  <Briefcase className="h-3.5 w-3.5" />
                  Soy Profesional
                </button>
              </div>
            </div>

            {/* Grid de 4 Columnas con Tarjetas Bento */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mt-12">
              {(activeRole === 'cliente' ? pasosCliente : pasosProfesional).map((paso, i) => {
                const IconComponent = paso.icon;
                return (
                  <div
                    key={`${activeRole}-${i}`}
                    className="bg-white dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800/80 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-indigo-500/20 dark:hover:border-indigo-500/10 hover:scale-[1.01] transition-all flex flex-col justify-between group relative overflow-hidden h-full min-h-[210px] duration-300"
                  >
                    {/* Número de paso gigante de fondo */}
                    <div className="absolute right-4 top-2 text-6xl font-black text-zinc-100 dark:text-zinc-850/20 select-none group-hover:scale-110 group-hover:text-indigo-500/10 transition-transform pointer-events-none duration-300">
                      {paso.num}
                    </div>

                    <div className="flex flex-col h-full justify-between z-10">
                      <div>
                        {/* Icono del paso */}
                        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-455 rounded-2xl w-fit mb-5 border border-indigo-100/30 dark:border-indigo-900/30 group-hover:bg-indigo-650 group-hover:text-white transition-colors duration-300">
                          <IconComponent className="h-5 w-5" />
                        </div>

                        <h4 className="text-base font-bold text-zinc-900 dark:text-white leading-snug group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors duration-300">
                          {paso.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-zinc-550 dark:text-zinc-400 mt-2.5 leading-relaxed">
                          {paso.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Botón de Acción Directa (CTA) Centrado */}
            <div className="flex justify-center mt-12">
              <Link
                href="/auth/registro"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-650 px-6 py-3 text-xs font-bold text-white shadow-md shadow-indigo-650/15 hover:bg-indigo-700 hover:shadow-indigo-650/25 transition-all active:scale-97 group w-full sm:w-auto text-center animate-fade-in"
              >
                {activeRole === 'cliente' ? 'Comenzar a Contratar' : 'Registrarme como Experto'}
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Sección: Muro de Solicitudes Recientes (Live Feed) */}
        <section className="py-20 bg-white dark:bg-zinc-900 border-t border-zinc-250/20 dark:border-zinc-800/30 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100/30 dark:border-emerald-900/30 text-emerald-650 dark:text-emerald-400 text-xs font-black uppercase tracking-widest animate-pulse select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Muro en vivo
              </div>
              <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white mt-3">
                Solicitudes Recientes en Venezuela
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                Revisa los últimos trabajos publicados en ConectaPro. ¡Postúlate de inmediato!
              </p>
            </div>

            {loadingRecientes ? (
              /* Shimmer loading state */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n, index) => (
                  <div key={n} className={`bg-zinc-50/50 dark:bg-zinc-950/20 border border-zinc-200/40 dark:border-zinc-850/40 p-6 rounded-2xl space-y-4 animate-pulse ${index === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-850 rounded w-20" />
                      <div className="h-3 bg-zinc-200 dark:bg-zinc-850 rounded w-10" />
                    </div>
                    <div className="h-5 bg-zinc-200 dark:bg-zinc-850 rounded w-5/6" />
                    <div className="space-y-2 pt-2">
                      <div className="h-3 bg-zinc-200 dark:bg-zinc-850 rounded w-full" />
                      <div className="h-3 bg-zinc-200 dark:bg-zinc-850 rounded w-4/5" />
                    </div>
                    <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900/50 flex justify-between items-center">
                      <div className="h-3.5 bg-zinc-200 dark:bg-zinc-850 rounded w-24" />
                      <div className="h-7 bg-zinc-200 dark:bg-zinc-850 rounded-lg w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recientes && recientes.length > 0 ? (
                  recientes.map((orden, index) => {
                    const date = new Date(orden.createdat);
                    const formattedDate = isNaN(date.getTime()) 
                      ? 'Reciente' 
                      : new Intl.DateTimeFormat('es-VE', { 
                          day: 'numeric', 
                          month: 'short', 
                          hour: 'numeric', 
                          minute: '2-digit', 
                          hour12: true 
                        }).format(date);
                    
                    const isAlta = orden.urgencia === 'alta' || orden.urgencia === 'Alta';
                    const isMedia = orden.urgencia === 'media' || orden.urgencia === 'Media';

                    let categoriaNombre = 'General';
                    if (orden.categorias) {
                      if (Array.isArray(orden.categorias)) {
                        categoriaNombre = orden.categorias[0]?.nombre || 'General';
                      } else {
                        categoriaNombre = orden.categorias.nombre || 'General';
                      }
                    }

                    return (
                      <div key={orden.id} className={`bg-white dark:bg-zinc-950/45 border border-zinc-200/50 dark:border-zinc-800/80 p-6 rounded-2xl hover:shadow-lg hover:border-indigo-500/20 dark:hover:border-indigo-500/10 hover:scale-[1.01] transition-all flex flex-col justify-between group ${index === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
                        <div className="space-y-4">
                          <div className="flex justify-between items-start gap-4">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider select-none ${
                              isAlta 
                                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-450 border-rose-100/40 dark:border-rose-900/30' 
                                : isMedia
                                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-455 border-amber-100/40 dark:border-amber-900/30'
                                : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-650 dark:text-zinc-400 border-zinc-200/50 dark:border-zinc-800/50'
                            }`}>
                              {categoriaNombre}
                            </span>
                            <span className="text-xs font-semibold text-zinc-450 dark:text-zinc-500 shrink-0 flex items-center gap-1 select-none">
                              <Clock className="h-3.5 w-3.5" />
                              {formattedDate}
                            </span>
                          </div>

                          <div>
                            <h4 className="text-base font-bold text-zinc-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {orden.titulo}
                            </h4>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                              {orden.zona 
                                ? `Solicitud para ${orden.titulo} en la zona de ${orden.zona}, ${orden.ciudad}.` 
                                : `Solicitud de servicio activo de ${categoriaNombre} en ${orden.ciudad}.`}
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 mt-6 border-t border-zinc-100 dark:border-zinc-900/60 flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1 truncate select-none">
                            <MapPin className="h-3.5 w-3.5 text-zinc-450 shrink-0" />
                            {orden.ciudad}{orden.zona ? `, ${orden.zona}` : ''}
                          </span>
                          <Link
                            href="/auth/login"
                            className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-indigo-650 dark:text-indigo-350 px-4 py-2.5 text-xs font-bold transition-colors shrink-0"
                          >
                            Postularse
                            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <>
                    {/* Fallback 1: Plomería */}
                    <div className="bg-white dark:bg-zinc-950/45 border border-zinc-200/50 dark:border-zinc-800/80 p-6 rounded-2xl hover:shadow-lg hover:border-indigo-500/20 dark:hover:border-indigo-500/10 hover:scale-[1.01] transition-all flex flex-col justify-between group">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-455 border border-rose-100/40 dark:border-rose-900/30 uppercase tracking-wider select-none">
                            Plomería
                          </span>
                          <span className="text-xs font-semibold text-zinc-450 dark:text-zinc-500 shrink-0 flex items-center gap-1 select-none">
                            <Clock className="h-3.5 w-3.5" />
                            Hace 2 horas
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-bold text-zinc-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            Reparación de tubería de 1/2 pulgada rota en pared de baño
                          </h4>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                            Tengo una filtración severa en el baño principal. Requiero picar la pared, detectar la rotura del tubo de agua blanca y reemplazar la sección afectada.
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 mt-6 border-t border-zinc-100 dark:border-zinc-900/60 flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1 truncate select-none">
                          <MapPin className="h-3.5 w-3.5 text-zinc-450 shrink-0" />
                          Baruta, Miranda
                        </span>
                        <Link
                          href="/auth/login"
                          className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-indigo-650 dark:text-indigo-350 px-4 py-2.5 text-xs font-bold transition-colors shrink-0"
                        >
                          Postularse
                          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>

                    {/* Fallback 2: Electricidad */}
                    <div className="bg-white dark:bg-zinc-950/45 border border-zinc-200/50 dark:border-zinc-800/80 p-6 rounded-2xl hover:shadow-lg hover:border-indigo-500/20 dark:hover:border-indigo-500/10 hover:scale-[1.01] transition-all flex flex-col justify-between group">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-455 border border-amber-100/40 dark:border-amber-900/30 uppercase tracking-wider select-none">
                            Electricidad
                          </span>
                          <span className="text-xs font-semibold text-zinc-450 dark:text-zinc-500 shrink-0 flex items-center gap-1 select-none">
                            <Clock className="h-3.5 w-3.5" />
                            Hace 4 horas
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-bold text-zinc-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            Cortocircuito en cocina e instalación de breakers
                          </h4>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                            Varios tomacorrientes de la cocina dejaron de funcionar de repente tras un fuerte olor a quemado. Necesito revisar el cableado y verificar la caja de breakers.
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 mt-6 border-t border-zinc-100 dark:border-zinc-900/60 flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1 truncate select-none">
                          <MapPin className="h-3.5 w-3.5 text-zinc-450 shrink-0" />
                          Chacao, Miranda
                        </span>
                        <Link
                          href="/auth/login"
                          className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-indigo-650 dark:text-indigo-350 px-4 py-2.5 text-xs font-bold transition-colors shrink-0"
                        >
                          Postularse
                          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>

                    {/* Fallback 3: Enfermería */}
                    <div className="bg-white dark:bg-zinc-950/45 border border-zinc-200/50 dark:border-zinc-800/80 p-6 rounded-2xl hover:shadow-lg hover:border-indigo-500/20 dark:hover:border-indigo-500/10 hover:scale-[1.01] transition-all flex flex-col justify-between group sm:col-span-2 lg:col-span-1">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-zinc-50 dark:bg-zinc-900 text-zinc-650 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-800/50 uppercase tracking-wider select-none">
                            Enfermería
                          </span>
                          <span className="text-xs font-semibold text-zinc-450 dark:text-zinc-500 shrink-0 flex items-center gap-1 select-none">
                            <Clock className="h-3.5 w-3.5" />
                            Hace 1 día
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-bold text-zinc-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            Cuidados domiciliarios postoperatorios para adulto mayor
                          </h4>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                            Se busca enfermero/a para control de signos vitales, administración de medicamentos vía endovenosa y curación diaria de herida quirúrgica tras operación de cadera.
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 mt-6 border-t border-zinc-100 dark:border-zinc-900/60 flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1 truncate select-none">
                          <MapPin className="h-3.5 w-3.5 text-zinc-450 shrink-0" />
                          El Hatillo, Miranda
                        </span>
                        <Link
                          href="/auth/login"
                          className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-indigo-650 dark:text-indigo-350 px-4 py-2.5 text-xs font-bold transition-colors shrink-0"
                        >
                          Postularse
                          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Botón para ver todas las ofertas */}
            <div className="flex justify-center mt-12">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-sm font-bold shadow-sm transition-all active:scale-97 group"
              >
                Ver Todas las Solicitudes Activas
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
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
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950 via-zinc-950 to-indigo-950 pointer-events-none" />
          {/* Dot Grid Background */}
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/15 rounded-full blur-[140px] pointer-events-none" />
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-10">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                ¿Listo para comenzar a resolver o{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-rose-400 bg-clip-text text-transparent">
                  generar ingresos
                </span>
                ?
              </h2>
              <p className="text-sm sm:text-base text-indigo-200 max-w-xl mx-auto leading-relaxed">
                Únete gratis a la comunidad técnica más grande y confiable de Venezuela hoy mismo.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto pt-4">
              {/* Opción Cliente */}
              <div className="group bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl border border-white/10 hover:border-indigo-500/30 p-8 rounded-3xl text-left flex flex-col justify-between space-y-8 shadow-2xl transition-all duration-300">
                <div className="space-y-6">
                  {/* Icon */}
                  <div className="p-3.5 bg-indigo-500/10 text-indigo-300 rounded-2xl w-fit border border-indigo-500/20 shadow-inner">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-white">¿Necesitas ayuda en casa?</h4>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Encuentra al profesional ideal para solucionar fallas en minutos sin pagar de más.
                    </p>
                  </div>
                  {/* Checklist */}
                  <ul className="space-y-2.5 text-xs text-zinc-200 font-medium pt-2">
                    <li className="flex items-center gap-2">
                      <span className="text-indigo-400 font-bold">✓</span> Publica solicitudes 100% gratis
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-indigo-400 font-bold">✓</span> Trato directo (sin comisiones intermedias)
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-indigo-400 font-bold">✓</span> Perfiles verificados y calificados
                    </li>
                  </ul>
                </div>
                <Link
                  href="/auth/registro"
                  className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-white hover:bg-zinc-100 text-indigo-950 py-3 text-xs font-bold transition-all active:scale-98 shadow-md hover:shadow-lg group-hover:shadow-indigo-500/5"
                >
                  Publicar un Servicio
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>

              {/* Opción Profesional */}
              <div className="group bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl border border-white/10 hover:border-indigo-500/30 p-8 rounded-3xl text-left flex flex-col justify-between space-y-8 shadow-2xl transition-all duration-300">
                <div className="space-y-6">
                  {/* Icon */}
                  <div className="p-3.5 bg-indigo-500/10 text-indigo-300 rounded-2xl w-fit border border-indigo-500/20 shadow-inner">
                    <Briefcase className="h-6 w-6" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-white">¿Ofreces tus servicios?</h4>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Postúlate a ofertas de trabajo en tu ciudad y expande tu cartera de clientes de inmediato.
                    </p>
                  </div>
                  {/* Checklist */}
                  <ul className="space-y-2.5 text-xs text-zinc-200 font-medium pt-2">
                    <li className="flex items-center gap-2">
                      <span className="text-indigo-400 font-bold">✓</span> Quédate con el 100% de tus ingresos
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-indigo-400 font-bold">✓</span> Abre chats de contacto por solo 1 crédito
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-indigo-400 font-bold">✓</span> Recargas inmediatas y soporte técnico
                    </li>
                  </ul>
                </div>
                <Link
                  href="/auth/registro"
                  className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-indigo-650 hover:bg-indigo-600 text-white py-3 text-xs font-bold transition-all border border-indigo-500/25 active:scale-98 shadow-md hover:shadow-indigo-500/20 hover:shadow-lg group-hover:shadow-indigo-500/10"
                >
                  Registrarme como Experto
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
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
