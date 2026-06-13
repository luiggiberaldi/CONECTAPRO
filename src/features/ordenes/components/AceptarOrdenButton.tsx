'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { supabaseBrowser } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import Loader from '@/components/shared/Loader';
import dynamic from 'next/dynamic';
const ConfirmModal = dynamic(() => import('@/components/shared/ConfirmModal'));

interface AceptarOrdenButtonProps {
  ordenid: string;
  profesionalid: string;
  onSuccess: (ordenid: string, profesionalid: string) => Promise<boolean>;
  actionLoading: boolean;
}

export default function AceptarOrdenButton({
  ordenid,
  profesionalid,
  onSuccess,
  actionLoading,
}: AceptarOrdenButtonProps) {
  const router = useRouter();
  const [saldo, setSaldo] = useState<number | null>(null);
  const [loadingSaldo, setLoadingSaldo] = useState(true);

  // Estados de modales
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isNoCreditsOpen, setIsNoCreditsOpen] = useState(false);

  const cargarSaldo = useCallback(async () => {
    try {
      const { data, error } = await supabaseBrowser
        .from('wallet')
        .select('saldo')
        .eq('profesionalid', profesionalid)
        .single();
      
      if (error) throw error;
      if (data) {
        setSaldo(data.saldo);
      }
    } catch (err) {
      console.error('Error al cargar saldo del wallet:', err);
    } finally {
      setLoadingSaldo(false);
    }
  }, [profesionalid]);

  useEffect(() => {
    if (profesionalid) {
      cargarSaldo();
    }
  }, [profesionalid, cargarSaldo]);

  const handleButtonClick = () => {
    if (saldo === null) return;

    if (saldo < 1) {
      setIsNoCreditsOpen(true);
    } else {
      setIsConfirmOpen(true);
    }
  };

  const handleConfirmAccept = async () => {
    setIsConfirmOpen(false);
    const success = await onSuccess(ordenid, profesionalid);
    if (success) {
      // Recargar saldo local posterior al descuento de crédito
      cargarSaldo();
    }
  };

  if (loadingSaldo) {
    return (
      <button
        disabled
        className="flex items-center justify-center gap-2 w-full rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 py-3 px-4 text-xs sm:text-sm font-semibold cursor-not-allowed whitespace-nowrap"
      >
        <Loader size="sm" />
        Verificando saldo...
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        disabled={actionLoading}
        onClick={handleButtonClick}
        className="flex items-center justify-center gap-2 w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/10 py-3 px-4 text-xs sm:text-sm font-bold tracking-wide transition-all active:scale-98 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap"
      >
        {actionLoading ? (
          <Loader size="sm" />
        ) : (
          <>
            <ShieldCheck className="h-4 w-4 text-indigo-200" />
            Aceptar Orden (1 crédito)
          </>
        )}
      </button>

      {/* MODAL DE CONFIRMACIÓN DE COMPRA/ACEPTACIÓN (Saldo suficiente) */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmAccept}
        title="¿Aceptar esta orden de servicio?"
        description={`Se descontará 1 crédito de tu billetera prepago. Tu saldo actual es de ${saldo} crédito(s). Una vez aceptada, tendrás acceso inmediato al chat interno y a los datos de contacto.`}
        confirmText="Aceptar y Descontar 1 Crédito"
        cancelText="Volver"
        loading={actionLoading}
      />

      {/* MODAL DE ADVERTENCIA DE CRÉDITOS INSUFICIENTES (Saldo < 1) */}
      <ConfirmModal
        isOpen={isNoCreditsOpen}
        onClose={() => setIsNoCreditsOpen(false)}
        onConfirm={() => {
          setIsNoCreditsOpen(false);
          router.push('/profesional/wallet');
        }}
        title="Créditos Insuficientes"
        description={`Necesitas al menos 1 crédito para aceptar este trabajo. Tu saldo actual es de ${saldo} créditos. Por favor realiza una recarga en tu billetera.`}
        confirmText="Ir a Recargar Wallet"
        cancelText="Entendido"
        type="danger"
      />
    </>
  );
}
