import { useState, useCallback } from 'react';
import { Wallet, Recarga } from '@/types';
import * as api from '../api';

/**
 * Hook para manejar el saldo de créditos, el historial de recargas
 * y el registro de nuevas solicitudes de pago para el profesional.
 */
export function useWallet(profesionalid: string) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [historial, setHistorial] = useState<Recarga[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Carga el balance del wallet y el historial de recargas simultáneamente
  const cargarDatos = useCallback(async () => {
    if (!profesionalid) return;
    setLoading(true);
    try {
      const [walletRes, historialRes] = await Promise.all([
        api.getWallet(profesionalid),
        api.getHistorialRecargas(profesionalid),
      ]);
      setWallet(walletRes);
      setHistorial(historialRes);
    } catch (err) {
      console.error('Error al cargar datos del wallet:', err);
    } finally {
      setLoading(false);
    }
  }, [profesionalid]);

  // Envía la solicitud de recarga y recarga los datos si es exitosa
  const registrarRecarga = async (
    paquete: number,
    metodopago: 'pagomovil' | 'zelle' | 'usdt',
    referencia: string,
    capturaFile: File
  ): Promise<boolean> => {
    if (!profesionalid) return false;
    setActionLoading(true);
    try {
      const res = await api.solicitarRecarga(
        profesionalid,
        paquete,
        metodopago,
        referencia,
        capturaFile
      );
      if (res) {
        await cargarDatos();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error al registrar recarga:', err);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    saldo: wallet?.saldo ?? 0,
    totalcargado: wallet?.totalcargado ?? 0,
    totalusado: wallet?.totalusado ?? 0,
    historial,
    loading,
    actionLoading,
    cargarDatos,
    registrarRecarga,
  };
}
