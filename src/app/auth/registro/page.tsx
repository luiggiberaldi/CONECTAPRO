'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { User, Mail, Lock, Sparkles, Briefcase, MapPin, Award, UserPlus, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import Loader from '@/components/shared/Loader';
import Link from 'next/link';
import Image from 'next/image';
import CustomSelect, { SelectOption } from '@/components/ui/CustomSelect';


export default function RegistroPage() {
  const { registro, loading } = useAuth();
  const router = useRouter();

  // Campos comunes
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState<'cliente' | 'profesional'>('cliente');

  // Campos adicionales para profesional
  const [especialidad, setEspecialidad] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [anyosexperiencia, setAnyosexperiencia] = useState('');

  const [formError, setFormError] = useState<string | null>(null);

  const especialidadesOptions: SelectOption[] = [
    { value: 'enfermeria', label: 'Enfermería' },
    { value: 'plomeria', label: 'Plomería' },
    { value: 'electricidad', label: 'Electricidad' },
  ];


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validar comunes
    if (!email || !password || !confirmPassword || !nombre) {
      setFormError('Por favor completa todos los campos comunes.');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Las contraseñas no coinciden.');
      return;
    }

    // Validar profesional
    if (rol === 'profesional') {
      if (!especialidad || !ciudad || !descripcion || !anyosexperiencia) {
        setFormError('Por favor completa toda la información profesional requerida.');
        return;
      }
      if (isNaN(Number(anyosexperiencia)) || Number(anyosexperiencia) < 0) {
        setFormError('Los años de experiencia deben ser un número válido mayor o igual a 0.');
        return;
      }
    }

    const res = await registro({
      email,
      password,
      nombre,
      rol,
      especialidad: rol === 'profesional' ? especialidad : undefined,
      descripcion: rol === 'profesional' ? descripcion : undefined,
      anyosexperiencia: rol === 'profesional' ? Number(anyosexperiencia) : undefined,
      ciudad: rol === 'profesional' ? ciudad : undefined,
    });

    if (res?.user?.id) {
      // Redirigir según el rol elegido
      if (rol === 'profesional') {
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
          Crea tu cuenta
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Comienza a conectar con soluciones reales en Venezuela
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-6 py-8 border border-white/20 dark:border-zinc-800/30 rounded-2xl shadow-xl">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {formError && (
              <div className="p-3 text-xs font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                {formError}
              </div>
            )}

            {/* SELECCIÓN DE ROL MEDIANTE TARJETAS INTERACTIVAS */}
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 text-center mb-3">
                Selecciona tu tipo de cuenta
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRol('cliente')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                    rol === 'cliente'
                      ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-semibold shadow-md ring-2 ring-indigo-500/20'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                  }`}
                >
                  <User className={`h-8 w-8 mb-2 ${rol === 'cliente' ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400'}`} />
                  <span className="text-sm">Quiero contratar</span>
                  <span className="text-[10px] text-zinc-400 font-normal mt-0.5">Necesito resolver un problema en casa</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRol('profesional')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                    rol === 'profesional'
                      ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-semibold shadow-md ring-2 ring-indigo-500/20'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                  }`}
                >
                  <Briefcase className={`h-8 w-8 mb-2 ${rol === 'profesional' ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400'}`} />
                  <span className="text-sm">Soy un profesional</span>
                  <span className="text-[10px] text-zinc-400 font-normal mt-0.5">Quiero ofrecer mis servicios y ganar</span>
                </button>
              </div>
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-850 pt-5 space-y-4">
              {/* Nombre Completo */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Nombre completo
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="block w-full rounded-xl border-zinc-200 dark:border-zinc-800 pl-10 pr-4 py-2.5 bg-white/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 text-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all border outline-none focus:ring-1"
                    placeholder="Carlos Pérez"
                  />
                </div>
              </div>

              {/* Correo Electrónico */}
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
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border-zinc-200 dark:border-zinc-800 pl-10 pr-4 py-2.5 bg-white/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 text-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all border outline-none focus:ring-1"
                    placeholder="ejemplo@correo.com"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label htmlFor="pass" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-350">
                  Contraseña
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="pass"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border-zinc-200 dark:border-zinc-800 pl-10 pr-10 py-2.5 bg-white/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 text-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all border outline-none focus:ring-1"
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-355 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirmar Contraseña */}
              <div>
                <label htmlFor="confirm-pass" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-350">
                  Confirmar contraseña
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="confirm-pass"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full rounded-xl border-zinc-200 dark:border-zinc-800 pl-10 pr-10 py-2.5 bg-white/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 text-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all border outline-none focus:ring-1"
                    placeholder="Repite tu contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-355 transition-colors focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* SECCIÓN ADICIONAL PARA PROFESIONALES */}
            {rol === 'profesional' && (
              <div className="border-t border-zinc-100 dark:border-zinc-850 pt-5 space-y-4 animate-slide-in">
                <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-1">
                  <Sparkles className="h-4 w-4" />
                  Información de Proveedor de Servicios
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Especialidad */}
                  <div>
                    <label htmlFor="especialidad" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Especialidad / Oficio
                    </label>
                    <div className="mt-1">
                      <CustomSelect
                        id="especialidad"
                        options={especialidadesOptions}
                        value={especialidad}
                        onChange={setEspecialidad}
                        placeholder="Selecciona..."
                        leftIcon={<Briefcase className="h-4 w-4" />}
                      />
                    </div>
                  </div>


                  {/* Ciudad */}
                  <div>
                    <label htmlFor="ciudad" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Ciudad
                    </label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <input
                        id="ciudad"
                        type="text"
                        required
                        value={ciudad}
                        onChange={(e) => setCiudad(e.target.value)}
                        className="block w-full rounded-xl border-zinc-200 dark:border-zinc-800 pl-10 pr-4 py-2.5 bg-white/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 text-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all border outline-none focus:ring-1"
                        placeholder="Caracas"
                      />
                    </div>
                  </div>
                </div>

                {/* Años de Experiencia */}
                <div>
                  <label htmlFor="anyosexperiencia" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Años de experiencia
                  </label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                      <Award className="h-4 w-4" />
                    </div>
                    <input
                      id="anyosexperiencia"
                      type="number"
                      required
                      min="0"
                      value={anyosexperiencia}
                      onChange={(e) => setAnyosexperiencia(e.target.value)}
                      className="block w-full rounded-xl border-zinc-200 dark:border-zinc-800 pl-10 pr-4 py-2.5 bg-white/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 text-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all border outline-none focus:ring-1"
                      placeholder="Ej. 5"
                    />
                  </div>
                </div>

                {/* Descripción Profesional */}
                <div>
                  <label htmlFor="descripcion" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    Descripción de perfil profesional
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="descripcion"
                      rows={3}
                      required
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      className="block w-full rounded-xl border-zinc-200 dark:border-zinc-800 px-4 py-2.5 bg-white/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 text-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all border outline-none focus:ring-1 resize-none"
                      placeholder="Describe tus habilidades, certificaciones y el tipo de servicios que realizas."
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <Loader size="sm" />
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Registrarme
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-xs">
            <span className="text-zinc-500 dark:text-zinc-400">¿Ya tienes una cuenta? </span>
            <Link
              href="/auth/login"
              className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center justify-center gap-1 mt-1.5"
            >
              <ArrowLeft className="h-3 w-3" />
              Inicia sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
