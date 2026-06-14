import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useChat } from '../hooks/useChat';
import { analizarMensaje, ResultadoAnalisis } from '../utils/antipuenteo';
import { reportarMensaje } from '../api';
import {
  Send,
  AlertTriangle,
  MessageSquare,
  Clock,
  User,
  Info,
  Flag,
  ShieldAlert,
  ShieldCheck,
  Link2Off,
  MailX,
  AtSign,
  MessageCircleWarning,
} from 'lucide-react';
import Loader from '@/components/shared/Loader';
import { toast } from '@/hooks/use-toast';

interface ChatWindowProps {
  ordenId: string;
  usuarioId: string;
  clienteNombre: string;
  profesionalNombre: string;
  ordenEstado: string;
}

// Icono y color según la razón del bloqueo
const RAZON_CONFIG = {
  telefono: {
    icono: ShieldAlert,
    color: 'rose',
  },
  email: {
    icono: MailX,
    color: 'rose',
  },
  red_social: {
    icono: AtSign,
    color: 'rose',
  },
  url: {
    icono: Link2Off,
    color: 'rose',
  },
  frase_contacto: {
    icono: MessageCircleWarning,
    color: 'amber',
  },
} as const;

export default function ChatWindow({
  ordenId,
  usuarioId,
  clienteNombre,
  profesionalNombre,
  ordenEstado,
}: ChatWindowProps) {
  const { mensajes, loading, enviar } = useChat(ordenId, usuarioId);
  const [inputMsg, setInputMsg] = useState('');
  const [analisis, setAnalisis] = useState<ResultadoAnalisis>({ bloqueado: false });
  const [enviando, setEnviando] = useState(false);
  const [reportandoId, setReportandoId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll al último mensaje
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (mensajes.length > 0) {
      scrollToBottom();
    }
  }, [mensajes]);

  /**
   * Construye el historial de mensajes recientes (últimos 5 min) del mismo usuario
   * para detectar teléfonos/datos distribuidos en varios mensajes.
   */
  const construirHistorial = useCallback((): string => {
    const ahora = new Date();
    const recientes: string[] = [];
    for (let i = mensajes.length - 1; i >= 0; i--) {
      const msg = mensajes[i];
      if (msg.autorid !== usuarioId || msg.tipo !== 'texto') break;
      const diff = (ahora.getTime() - new Date(msg.createdat).getTime()) / 60000;
      if (diff > 5) break;
      recientes.unshift(msg.contenido);
    }
    return recientes.join(' ');
  }, [mensajes, usuarioId]);

  // Manejar el cambio de texto del input
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInputMsg(val);
    if (!val.trim()) {
      setAnalisis({ bloqueado: false });
      return;
    }
    const historial = construirHistorial();
    setAnalisis(analizarMensaje(val.trim(), historial));
  };

  // Enviar mensaje
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    const historial = construirHistorial();
    const resultado = analizarMensaje(inputMsg.trim(), historial);

    if (resultado.bloqueado) {
      toast.error(resultado.mensajeUsuario ?? 'Mensaje bloqueado por políticas de seguridad.');
      return;
    }

    if (!inputMsg.trim() || enviando || ordenEstado !== 'en_proceso') return;

    setEnviando(true);
    const success = await enviar(inputMsg.trim(), 'texto');
    if (success) {
      setInputMsg('');
      setAnalisis({ bloqueado: false });
      inputRef.current?.focus();
    }
    setEnviando(false);
  };

  // Manejar enter en el textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  // Reportar un mensaje sospechoso
  const handleReportar = async (mensajeId: string) => {
    if (reportandoId) return; // evitar doble-click
    setReportandoId(mensajeId);
    await reportarMensaje(mensajeId, usuarioId, 'puenteo');
    setReportandoId(null);
  };

  // Nombre de quien envió el mensaje
  const getAutorNombre = (autorid: string) => {
    if (autorid === usuarioId) return 'Tú';
    return clienteNombre || profesionalNombre || 'Contraparte';
  };

  const getFormatedTime = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleTimeString('es-VE', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return '';
    }
  };

  const esChatDeshabilitado = ordenEstado !== 'en_proceso';
  const warningActivo = analisis.bloqueado;

  // Config del warning actual
  const warningConfig = analisis.razon ? RAZON_CONFIG[analisis.razon] : null;
  const WarningIcono = warningConfig?.icono ?? AlertTriangle;
  const warningEsAmbar = warningConfig?.color === 'amber';

  return (
    <div className="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800/80 rounded-2xl shadow-sm overflow-hidden h-[500px]">
      {/* Cabecera del Chat */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="h-8.5 w-8.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <User className="h-4.5 w-4.5" />
            </div>
            {ordenEstado === 'en_proceso' && (
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
            )}
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              {usuarioId === mensajes[0]?.autorid
                ? clienteNombre || profesionalNombre
                : profesionalNombre || clienteNombre}
            </h4>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium flex items-center gap-1">
              {esChatDeshabilitado ? (
                'Chat inactivo'
              ) : (
                <>
                  <ShieldCheck className="h-2.5 w-2.5 text-emerald-500" />
                  Canal seguro de comunicación
                </>
              )}
            </p>
          </div>
        </div>
        <div>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold border capitalize ${
              ordenEstado === 'en_proceso'
                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400'
                : 'bg-zinc-100 text-zinc-550 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
            }`}
          >
            {ordenEstado.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Historial de Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/30 dark:bg-zinc-950/10">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400">
            <Loader size="md" />
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-2">Cargando conversación...</p>
          </div>
        ) : mensajes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="h-12 w-12 rounded-full bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-500 mb-3 border border-dashed border-indigo-200 dark:border-indigo-900">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h5 className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Sin mensajes aún</h5>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 max-w-[200px] mt-1">
              {esChatDeshabilitado
                ? 'No se registraron mensajes en esta orden de servicio.'
                : 'Saluda a la contraparte para coordinar los detalles del servicio.'}
            </p>
          </div>
        ) : (
          mensajes.map((msg) => {
            if (msg.tipo === 'sistema') {
              return (
                <div key={msg.id} className="flex justify-center my-2.5">
                  <div className="bg-amber-50/60 dark:bg-amber-950/15 border border-amber-200/60 dark:border-amber-900/40 text-amber-800 dark:text-amber-400 text-[10px] md:text-[11px] px-4 py-2 rounded-xl max-w-md text-center font-medium leading-relaxed flex items-start gap-2">
                    <Info className="h-3.5 w-3.5 mt-0.5 text-amber-600 dark:text-amber-500 flex-shrink-0" />
                    <span>{msg.contenido}</span>
                  </div>
                </div>
              );
            }

            const esMio = msg.autorid === usuarioId;
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-1.5 ${esMio ? 'justify-end' : 'justify-start'}`}
              >
                {/* Botón de reporte — solo en mensajes ajenos */}
                {!esMio && (
                  <button
                    onClick={() => handleReportar(msg.id)}
                    disabled={reportandoId === msg.id}
                    title="Reportar mensaje sospechoso"
                    className="opacity-0 group-hover:opacity-100 flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center text-zinc-300 hover:text-rose-500 dark:text-zinc-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all self-start mt-1"
                  >
                    {reportandoId === msg.id ? (
                      <Loader size="sm" />
                    ) : (
                      <Flag className="h-3 w-3" />
                    )}
                  </button>
                )}

                <div
                  className={`group relative max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm text-xs ${
                    esMio
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-zinc-800 text-zinc-850 dark:text-zinc-150 border border-zinc-150 dark:border-zinc-750 rounded-tl-none'
                  }`}
                >
                  {!esMio && (
                    <p className="text-[9px] font-bold text-indigo-650 dark:text-indigo-400 mb-0.5">
                      {getAutorNombre(msg.autorid)}
                    </p>
                  )}
                  <p className="whitespace-pre-line break-words leading-relaxed text-[11px] md:text-xs">
                    {msg.contenido}
                  </p>
                  <div
                    className={`flex items-center justify-end gap-1 mt-1 text-[9px] ${
                      esMio ? 'text-indigo-200' : 'text-zinc-400'
                    }`}
                  >
                    <Clock className="h-2.5 w-2.5" />
                    <span>{getFormatedTime(msg.createdat)}</span>
                  </div>

                  {/* Botón de reporte integrado en el hover de la burbuja */}
                  {!esMio && (
                    <button
                      onClick={() => handleReportar(msg.id)}
                      disabled={reportandoId === msg.id}
                      title="Reportar mensaje sospechoso"
                      className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 h-5 w-5 rounded-full bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 flex items-center justify-center text-zinc-400 hover:text-rose-500 hover:border-rose-400 dark:hover:text-rose-400 dark:hover:border-rose-500/50 transition-all shadow-sm"
                    >
                      {reportandoId === msg.id ? (
                        <Loader size="sm" />
                      ) : (
                        <Flag className="h-2.5 w-2.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Alerta Anti-Puenteo — razón específica */}
      {warningActivo && analisis.mensajeUsuario && (
        <div
          className={`px-4 py-2.5 flex items-start gap-2 animate-fadeIn border-t ${
            warningEsAmbar
              ? 'bg-amber-50/95 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40'
              : 'bg-rose-50/95 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40'
          }`}
        >
          <WarningIcono
            className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
              warningEsAmbar
                ? 'text-amber-500'
                : 'text-rose-500'
            }`}
          />
          <div
            className={`text-[10px] leading-relaxed font-semibold ${
              warningEsAmbar
                ? 'text-amber-800 dark:text-amber-400'
                : 'text-rose-800 dark:text-rose-400'
            }`}
          >
            {analisis.mensajeUsuario}
          </div>
        </div>
      )}

      {/* Input de Mensajería */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex items-end gap-2"
      >
        <textarea
          ref={inputRef}
          rows={1}
          value={inputMsg}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={esChatDeshabilitado || enviando}
          placeholder={
            esChatDeshabilitado
              ? 'El chat ha finalizado para esta orden.'
              : 'Escribe un mensaje aquí...'
          }
          className={`flex-1 max-h-20 min-h-[38px] rounded-xl px-3 py-2 text-xs bg-white dark:bg-zinc-800 border focus:outline-none focus:ring-1 transition-all resize-none text-zinc-950 dark:text-zinc-100 leading-normal ${
            warningActivo
              ? warningEsAmbar
                ? 'border-amber-400 dark:border-amber-500/60 focus:border-amber-500 focus:ring-amber-500/50'
                : 'border-rose-400 dark:border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/50'
              : 'border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 focus:ring-indigo-500/50'
          } disabled:bg-zinc-100 dark:disabled:bg-zinc-800/40 disabled:text-zinc-400`}
        />
        <button
          type="submit"
          disabled={!inputMsg.trim() || warningActivo || enviando || esChatDeshabilitado}
          className={`h-[38px] w-[38px] rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm transition-all active:scale-95 ${
            warningActivo
              ? warningEsAmbar
                ? 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/20 border border-amber-500/30 cursor-not-allowed'
                : 'bg-rose-500/10 text-rose-500 dark:bg-rose-500/20 border border-rose-500/30 dark:border-rose-500/20 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-450'
          }`}
        >
          {enviando ? (
            <Loader size="sm" />
          ) : warningActivo ? (
            <WarningIcono className="h-4 w-4" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </form>
    </div>
  );
}
