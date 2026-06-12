import { useState, useCallback } from 'react';
import { getOrdenDetalle, aceptarOrdenRPC, marcarOrdenCompletada } from '../api';
import { OrdenDetalle } from '../types';

export function useOrdenDetalle() {
  const [orden, setOrden] = useState<OrdenDetalle | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const cargarDetalle = useCallback(async (id: string) => {
    setLoading(true);
    const data = await getOrdenDetalle(id);
    if (data) {
      setOrden(data);
    }
    setLoading(false);
  }, []);

  const aceptarOrden = useCallback(async (ordenid: string, profesionalid: string): Promise<boolean> => {
    setActionLoading(true);
    const res = await aceptarOrdenRPC(ordenid, profesionalid);
    setActionLoading(false);
    if (res?.success) {
      // Recargar detalles
      await cargarDetalle(ordenid);
      return true;
    }
    return false;
  }, [cargarDetalle]);

  const completarOrden = useCallback(async (ordenid: string, usuarioid: string): Promise<boolean> => {
    setActionLoading(true);
    const success = await marcarOrdenCompletada(ordenid, usuarioid);
    setActionLoading(false);
    if (success) {
      // Recargar detalles
      await cargarDetalle(ordenid);
      return true;
    }
    return false;
  }, [cargarDetalle]);

  return {
    orden,
    loading,
    actionLoading,
    cargarDetalle,
    aceptarOrden,
    completarOrden,
  };
}
