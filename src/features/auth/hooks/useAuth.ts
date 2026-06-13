import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { Usuario } from '@/types';
import { loginConEmail, registrarUsuario, cerrarSesion, obtenerUsuarioPerfil } from '../api';
import { RegistroPayload } from '../types';

interface AuthState {
  usuario: Usuario | null;
  rol: string | null;
  loading: boolean;
  initialized: boolean;
  setSession: (usuario: Usuario | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  usuario: null,
  rol: null,
  loading: true,
  initialized: false,
  setSession: (usuario) => set({ usuario, rol: usuario ? usuario.rol : null, loading: false }),
  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),
}));

export function useAuth() {
  const { usuario, rol, loading, initialized, setSession, setLoading } = useAuthStore(
    useShallow((state) => ({
      usuario: state.usuario,
      rol: state.rol,
      loading: state.loading,
      initialized: state.initialized,
      setSession: state.setSession,
      setLoading: state.setLoading,
    }))
  );

  const login = async (email: string, pass: string) => {
    setLoading(true);
    const res = await loginConEmail({ email, password: pass });
    if (res?.user?.id) {
      const perfil = await obtenerUsuarioPerfil(res.user.id);
      setSession(perfil);
    } else {
      setLoading(false);
    }
    return res;
  };

  const registro = async (payload: RegistroPayload) => {
    setLoading(true);
    const res = await registrarUsuario(payload);
    if (res?.user?.id) {
      const perfil = await obtenerUsuarioPerfil(res.user.id);
      setSession(perfil);
    } else {
      setLoading(false);
    }
    return res;
  };

  const logout = async () => {
    setLoading(true);
    await cerrarSesion();
    setSession(null);
    setLoading(false);
  };

  return {
    usuario,
    rol,
    loading,
    initialized,
    login,
    registro,
    logout,
  };
}
export { obtenerUsuarioPerfil };
