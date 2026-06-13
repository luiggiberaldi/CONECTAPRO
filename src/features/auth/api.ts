import { supabaseBrowser } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { LoginPayload, RegistroPayload } from './types';
import { Usuario } from '@/types';
import { AuthResponse, AuthTokenResponse, Session } from '@supabase/supabase-js';

export async function loginConEmail({ email, password }: Required<LoginPayload>): Promise<AuthTokenResponse['data'] | null> {
  try {
    const { data, error } = await supabaseBrowser.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    
    // El toast de éxito solo se muestra si la respuesta trae id o dato real de persistencia
    if (data?.user?.id) {
      toast.success('Sesión iniciada correctamente');
    }
    return data;
  } catch (error) {
    console.error('[loginConEmail]', error);
    toast.error((error as Error).message);
    return null;
  }
}

export async function registrarUsuario(payload: RegistroPayload): Promise<AuthResponse['data'] | null> {
  try {
    const { email, password, nombre, rol, especialidad, descripcion, anyosexperiencia, ciudad } = payload;
    
    // 1. Registro en Supabase Auth. Los metadatos permiten al trigger handle_new_user crear el perfil en public.usuarios automáticamente.
    const { data, error } = await supabaseBrowser.auth.signUp({
      email,
      password: password || '',
      options: {
        data: {
          nombre,
          rol,
          ciudad: ciudad || null,
        },
      },
    });
    if (error) throw error;
    
    // 2. Si el rol es profesional, y el registro fue exitoso, insertamos en public.profesionales
    if (rol === 'profesional' && data.user) {
      const { error: profError } = await supabaseBrowser
        .from('profesionales')
        .insert({
          usuarioid: data.user.id,
          especialidad: especialidad || '',
          descripcion: descripcion || '',
          anyosexperiencia: Number(anyosexperiencia) || 0,
          ciudad: ciudad || '',
        });
      
      if (profError) throw profError;
    } else if (rol === 'cliente' && data.user) {
      const { error: clientError } = await supabaseBrowser
        .from('clientes')
        .insert({
          usuarioid: data.user.id,
          calificacionpromedio: 0,
          totalproyectos: 0,
        });
      
      if (clientError) throw clientError;
    }
    
    if (data?.user?.id) {
      toast.success('Registro completado exitosamente');
    }
    return data;
  } catch (error) {
    console.error('[registrarUsuario]', error);
    toast.error((error as Error).message);
    return null;
  }
}

export async function cerrarSesion(): Promise<void> {
  try {
    const { error } = await supabaseBrowser.auth.signOut();
    if (error) throw error;
    toast.success('Sesión cerrada');
  } catch (error) {
    console.error('[cerrarSesion]', error);
    toast.error((error as Error).message);
  }
}

export async function obtenerUsuarioPerfil(usuarioId: string): Promise<Usuario | null> {
  try {
    const { data, error } = await supabaseBrowser
      .from('usuarios')
      .select('*')
      .eq('id', usuarioId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('[obtenerUsuarioPerfil]', error);
    // No mostramos toast.error aquí para evitar ruidos molestos cuando se verifica la sesión en segundo plano.
    return null;
  }
}

export async function obtenerSesionActual(): Promise<Session | null> {
  try {
    const { data, error } = await supabaseBrowser.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    console.error('[obtenerSesionActual]', error);
    return null;
  }
}
