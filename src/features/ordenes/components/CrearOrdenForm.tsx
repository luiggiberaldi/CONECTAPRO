'use client';

import React, { useState, useEffect } from 'react';
import { supabaseBrowser } from '@/lib/supabase';
import { crearOrden } from '../api';
import { UrgenciaOrden, Categoria } from '@/types';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Briefcase, FileText, MapPin, AlertCircle, Sparkles } from 'lucide-react';
import Loader from '@/components/shared/Loader';
import CustomSelect, { SelectOption } from '@/components/ui/CustomSelect';


export default function CrearOrdenForm() {
  const { usuario } = useAuth();
  const router = useRouter();

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Campos de formulario
  const [categoriaid, setCategoriaid] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [zona, setZona] = useState('');
  const [urgencia, setUrgencia] = useState<UrgenciaOrden>('esta_semana');

  const categoriaOptions: SelectOption[] = categorias.map((cat) => ({
    value: cat.id,
    label: cat.nombre,
  }));


  useEffect(() => {
    async function loadCategorias() {
      try {
        const { data, error } = await supabaseBrowser
          .from('categorias')
          .select('*')
          .eq('activo', true);
        if (error) throw error;
        if (data) {
          setCategorias(data);
        }
      } catch (err) {
        console.error('Error al cargar categorías:', err);
      } finally {
        setLoadingCats(false);
      }
    }

    loadCategorias();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!usuario) {
      setFormError('Debes iniciar sesión para publicar una orden.');
      return;
    }

    if (!categoriaid || !titulo || !descripcion || !ciudad || !zona || !urgencia) {
      setFormError('Por favor completa todos los campos obligatorios.');
      return;
    }

    setSubmitting(true);
    const data = await crearOrden({
      clienteid: usuario.id,
      categoriaid,
      titulo,
      descripcion,
      ciudad,
      zona,
      urgencia,
    });
    setSubmitting(false);

    if (data?.id) {
      router.push('/cliente/ordenes');
    }
  };

  if (loadingCats) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader size="md" />
        <span className="text-sm text-zinc-500 dark:text-zinc-400 ml-2">Cargando categorías disponibles...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {formError && (
        <div className="p-3 text-xs font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl">
          {formError}
        </div>
      )}

      {/* Categoría */}
      <div>
        <label htmlFor="categoria" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Categoría de Servicio
        </label>
        <div className="mt-1">
          <CustomSelect
            id="categoria"
            options={categoriaOptions}
            value={categoriaid}
            onChange={setCategoriaid}
            placeholder="Selecciona una categoría..."
            leftIcon={<Briefcase className="h-4 w-4" />}
            required
          />
        </div>
      </div>


      {/* Título de la solicitud */}
      <div>
        <label htmlFor="titulo" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Título de la solicitud
        </label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
            <FileText className="h-4 w-4" />
          </div>
          <input
            id="titulo"
            type="text"
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="block w-full rounded-xl border-zinc-200 dark:border-zinc-800 pl-10 pr-4 py-2.5 bg-white/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 text-sm focus:border-indigo-500 focus:ring-indigo-500 border outline-none focus:ring-1 transition-all"
            placeholder="Ej: Reparar fuga de agua en baño principal"
          />
        </div>
      </div>

      {/* Descripción detallada */}
      <div>
        <label htmlFor="descripcion" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Descripción detallada del problema
        </label>
        <div className="mt-1">
          <textarea
            id="descripcion"
            rows={4}
            required
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="block w-full rounded-xl border-zinc-200 dark:border-zinc-800 px-4 py-2.5 bg-white/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 text-sm focus:border-indigo-500 focus:ring-indigo-500 border outline-none focus:ring-1 transition-all resize-none"
            placeholder="Detalla qué necesitas, qué materiales o herramientas se requieren y cualquier observación para el profesional..."
          />
        </div>
      </div>

      {/* Ciudad y Zona */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              className="block w-full rounded-xl border-zinc-200 dark:border-zinc-800 pl-10 pr-4 py-2.5 bg-white/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 text-sm focus:border-indigo-500 focus:ring-indigo-500 border outline-none focus:ring-1 transition-all"
              placeholder="Valencia"
            />
          </div>
        </div>

        <div>
          <label htmlFor="zona" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Zona / Urbanización
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
              <MapPin className="h-4 w-4" />
            </div>
            <input
              id="zona"
              type="text"
              required
              value={zona}
              onChange={(e) => setZona(e.target.value)}
              className="block w-full rounded-xl border-zinc-200 dark:border-zinc-800 pl-10 pr-4 py-2.5 bg-white/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 text-sm focus:border-indigo-500 focus:ring-indigo-500 border outline-none focus:ring-1 transition-all"
              placeholder="El Viñedo"
            />
          </div>
        </div>
      </div>

      {/* Urgencia mediante botones */}
      <div>
        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 text-center sm:text-left mb-2">
          Nivel de Urgencia
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setUrgencia('hoy')}
            className={`flex items-center justify-center gap-1.5 p-3 rounded-xl border text-sm transition-all ${
              urgencia === 'hoy'
                ? 'border-rose-500 bg-rose-50/25 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 font-semibold shadow-sm ring-2 ring-rose-500/15'
                : 'border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
            }`}
          >
            <AlertCircle className="h-4 w-4" />
            Urgente (Hoy)
          </button>

          <button
            type="button"
            onClick={() => setUrgencia('esta_semana')}
            className={`flex items-center justify-center gap-1.5 p-3 rounded-xl border text-sm transition-all ${
              urgencia === 'esta_semana'
                ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm ring-2 ring-indigo-500/20'
                : 'border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            Esta semana
          </button>
        </div>
      </div>

      {/* Botón de envío */}
      <div className="pt-3">
        <button
          type="submit"
          disabled={submitting}
          className="flex w-full justify-center items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        >
          {submitting ? (
            <Loader size="sm" />
          ) : (
            'Publicar Orden de Servicio'
          )}
        </button>
      </div>
    </form>
  );
}
