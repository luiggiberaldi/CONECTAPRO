import React, { useState, useEffect } from 'react';
import { CreditCard, Upload, AlertCircle, ArrowRight } from 'lucide-react';
import Loader from '@/components/shared/Loader';
import { getPrecioPaquete } from '@/lib/constants';
import Image from 'next/image';

interface RecargaFormProps {
  paquete: number | null;
  onSubmit: (
    metodopago: 'pagomovil' | 'zelle' | 'usdt',
    referencia: string,
    capturaFile: File
  ) => Promise<boolean>;
  loading: boolean;
}

export default function RecargaForm({ paquete, onSubmit, loading }: RecargaFormProps) {
  const [metodo, setMetodo] = useState<'pagomovil' | 'zelle' | 'usdt'>('pagomovil');
  const [referencia, setReferencia] = useState('');
  const [capturaFile, setCapturaFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Limpiar estados cuando cambia el paquete
  useEffect(() => {
    setReferencia('');
    setCapturaFile(null);
    setPreviewUrl(null);
    setValidationError(null);
  }, [paquete]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setValidationError('Por favor selecciona un archivo de imagen válido (JPG, PNG).');
        return;
      }
      setValidationError(null);
      setCapturaFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!paquete) {
      setValidationError('Por favor selecciona un paquete antes de enviar.');
      return;
    }

    if (!referencia.trim()) {
      setValidationError('El número de referencia es obligatorio.');
      return;
    }

    if (!capturaFile) {
      setValidationError('Debes adjuntar el comprobante o captura del pago.');
      return;
    }

    const success = await onSubmit(metodo, referencia.trim(), capturaFile);
    if (success) {
      // Limpiar formulario tras éxito
      setReferencia('');
      setCapturaFile(null);
      setPreviewUrl(null);
    }
  };

  if (!paquete) {
    return (
      <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
        <CreditCard className="h-10 w-10 text-zinc-400 mb-3" />
        <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
          Inicia tu solicitud de recarga
        </h4>
        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 max-w-[280px] mt-1 leading-relaxed">
          Selecciona uno de los paquetes de créditos anteriores para habilitar las cuentas de pago y subir tu comprobante.
        </p>
      </div>
    );
  }

  const montousd = getPrecioPaquete(paquete);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm">
      <div className="mb-5 border-b border-zinc-100 dark:border-zinc-800 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Paso 2: Registrar Pago
          </h3>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
            Sube el soporte del pago correspondiente al paquete seleccionado.
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-zinc-400 block">Total a Pagar</span>
          <span className="text-sm font-black text-indigo-650 dark:text-indigo-400">
            ${montousd.toFixed(2)} USD
          </span>
        </div>
      </div>

      {validationError && (
        <div className="mb-4 px-3 py-2 bg-rose-50 dark:bg-rose-950/20 border border-rose-250 dark:border-rose-900/50 rounded-xl flex items-start gap-2 text-rose-800 dark:text-rose-400 text-[10px] font-semibold leading-relaxed">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-rose-500" />
          <span>{validationError}</span>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Selector de Método de Pago */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-wide">
            Método de Pago
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['pagomovil', 'zelle', 'usdt'] as const).map((m) => (
              <button
                key={m}
                type="button"
                disabled={loading}
                onClick={() => setMetodo(m)}
                className={`py-2 px-1 text-[10px] font-bold rounded-xl border text-center transition-all capitalize ${
                  metodo === m
                    ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/10 text-indigo-700 dark:text-indigo-400'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 text-zinc-650 dark:text-zinc-400'
                }`}
              >
                {m === 'pagomovil' ? 'Pago Móvil' : m}
              </button>
            ))}
          </div>
        </div>

        {/* Instrucciones de Pago Dinámicas */}
        <div className="bg-zinc-50 dark:bg-zinc-850/40 rounded-xl p-3 border border-zinc-150 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-1">
          <p className="font-bold text-xs text-zinc-500 dark:text-zinc-450 uppercase tracking-wide mb-1.5">
            Instrucciones para transferir
          </p>
          {metodo === 'pagomovil' && (
            <>
              <div><span className="font-semibold text-zinc-800 dark:text-zinc-250">Banco:</span> Banesco (0134)</div>
              <div><span className="font-semibold text-zinc-800 dark:text-zinc-250">Teléfono:</span> 0412-5551234</div>
              <div><span className="font-semibold text-zinc-800 dark:text-zinc-250">RIF:</span> J-45678901-2</div>
            </>
          )}
          {metodo === 'zelle' && (
            <>
              <div><span className="font-semibold text-zinc-800 dark:text-zinc-250">Correo:</span> pagos@conectapro.com</div>
              <div><span className="font-semibold text-zinc-800 dark:text-zinc-250">Titular:</span> ConectaPro C.A.</div>
            </>
          )}
          {metodo === 'usdt' && (
            <>
              <div><span className="font-semibold text-zinc-800 dark:text-zinc-250">Red:</span> Tron (TRC-20)</div>
              <div className="break-all"><span className="font-semibold text-zinc-800 dark:text-zinc-250">Dirección:</span> TYPsdgHJG35fs7sdFGsdfSDF78sdf78sd9</div>
            </>
          )}
        </div>

        {/* Banner informativo unificado */}
        <div className="bg-amber-50 dark:bg-amber-950/15 border border-amber-250/20 dark:border-amber-900/30 rounded-xl p-3.5">
          <h5 className="text-xs font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5 mb-1">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-450" />
            Información importante de recarga:
          </h5>
          <ul className="list-disc pl-4 text-xs text-amber-700/90 dark:text-amber-400/80 space-y-1 font-medium">
            {metodo === 'pagomovil' && <li><strong>Pago Móvil:</strong> Calcule el monto en Bs. a la tasa oficial del BCV del día.</li>}
            {metodo === 'zelle' && <li><strong>Zelle:</strong> Indique su nombre y apellido en la descripción del Zelle.</li>}
            {metodo === 'usdt' && <li><strong>Cripto (USDT):</strong> Envíe exactamente la cantidad neta libre de comisiones de red.</li>}
          </ul>
        </div>

        {/* Campo Referencia */}
        <div className="space-y-1">
          <label htmlFor="ref" className="text-xs font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-wide">
            Número de Referencia
          </label>
          <input
            id="ref"
            type="text"
            required
            disabled={loading}
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
            placeholder="Ej: 12345678 (últimos dígitos o referencia)"
            className="w-full text-xs rounded-xl px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 text-zinc-950 dark:text-zinc-100"
          />
        </div>

        {/* Upload de Captura */}
        <div className="space-y-1">
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-450 uppercase tracking-wide block">
            Adjuntar Captura de Pantalla
          </span>
          <div className="flex gap-4 items-center">
            <label className={`flex flex-col items-center justify-center flex-1 h-24 border border-dashed rounded-xl cursor-pointer hover:bg-zinc-50/50 dark:hover:bg-zinc-850/20 transition-all ${
              previewUrl ? 'border-indigo-400 bg-indigo-50/5' : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900'
            }`}>
              <div className="flex flex-col items-center justify-center p-3 text-center">
                <Upload className="h-5 w-5 text-zinc-400 mb-1" />
                <span className="text-xs font-bold text-zinc-650 dark:text-zinc-400">
                  {capturaFile ? capturaFile.name : 'Seleccionar captura'}
                </span>
                <span className="text-[10px] text-zinc-400 mt-0.5">JPG, PNG (máx. 5MB)</span>
              </div>
              <input
                type="file"
                accept="image/*"
                required
                disabled={loading}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {/* Vista previa de imagen cargada */}
            {previewUrl && (
              <div className="relative h-24 w-24 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex-shrink-0 bg-zinc-50">
                <Image
                  src={previewUrl}
                  alt="Vista previa de la captura"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Botón de Envío */}
        <button
          type="submit"
          disabled={loading || !referencia.trim() || !capturaFile}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader size="sm" />
              Procesando solicitud...
            </>
          ) : (
            <>
              Registrar Recarga de Créditos
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
