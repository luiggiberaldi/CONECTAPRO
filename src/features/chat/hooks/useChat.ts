import { useEffect, useState, useCallback } from 'react';
import { Mensaje } from '@/types';
import { getMensajes, enviarMensaje } from '../api';
import { supabaseBrowser } from '@/lib/supabase';

/**
 * Hook para manejar la lógica de chat en tiempo real para una orden específica.
 */
export function useChat(ordenid: string, usuarioid: string) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 1. Cargar historial de mensajes al montar o cambiar ordenid
  useEffect(() => {
    let active = true;

    async function cargarHistorial() {
      setLoading(true);
      const data = await getMensajes(ordenid);
      if (active && data) {
        setMensajes(data);
      }
      if (active) {
        setLoading(false);
      }
    }

    if (ordenid) {
      cargarHistorial();
    }

    return () => {
      active = false;
    };
  }, [ordenid]);

  // 2. Suscribirse a mensajes en tiempo real con cleanup para evitar memory leaks
  useEffect(() => {
    if (!ordenid) return;

    const channel = supabaseBrowser
      .channel(`chat_orden_${ordenid}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensajes',
          filter: `ordenid=eq.${ordenid}`,
        },
        (payload) => {
          const nuevo = payload.new as Mensaje;
          setMensajes((prev) => {
            // Evitar agregar duplicados si el remitente lo insertó y llegó por callback local
            if (prev.some((m) => m.id === nuevo.id)) return prev;
            return [...prev, nuevo];
          });
        }
      )
      .subscribe();

    return () => {
      supabaseBrowser.removeChannel(channel);
    };
  }, [ordenid]);

  // 3. Función para enviar mensaje
  const enviar = useCallback(
    async (contenido: string, tipo: 'texto' | 'sistema' = 'texto'): Promise<boolean> => {
      if (!contenido.trim()) return false;
      const res = await enviarMensaje(ordenid, usuarioid, contenido, tipo);
      if (res) {
        setMensajes((prev) => {
          if (prev.some((m) => m.id === res.id)) return prev;
          return [...prev, res];
        });
        return true;
      }
      return false;
    },
    [ordenid, usuarioid]
  );

  return {
    mensajes,
    loading,
    enviar,
  };
}
