import { useState, useCallback } from 'react';
import { getOrdenesCliente, getOrdenesDisponibles, getOrdenesAsignadasProfesional } from '../api';
import { ClienteOrden, DisponibleOrden, AsignadaOrden } from '../types';

export function useOrdenes() {
  const [ordenes, setOrdenes] = useState<(ClienteOrden | DisponibleOrden | AsignadaOrden)[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const cargarOrdenesCliente = useCallback(async (clienteid: string) => {
    setLoading(true);
    const data = await getOrdenesCliente(clienteid);
    if (data) {
      setOrdenes(data);
    }
    setLoading(false);
  }, []);

  const cargarOrdenesDisponibles = useCallback(async (categoriaid: string) => {
    setLoading(true);
    const data = await getOrdenesDisponibles(categoriaid);
    if (data) {
      setOrdenes(data);
    }
    setLoading(false);
  }, []);

  const cargarOrdenesAsignadas = useCallback(async (profesionalid: string) => {
    setLoading(true);
    const data = await getOrdenesAsignadasProfesional(profesionalid);
    if (data) {
      setOrdenes(data);
    }
    setLoading(false);
  }, []);

  return {
    ordenes,
    loading,
    cargarOrdenesCliente,
    cargarOrdenesDisponibles,
    cargarOrdenesAsignadas,
  };
}
