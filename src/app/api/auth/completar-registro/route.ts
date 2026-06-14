import { NextResponse } from 'next/server';
import { createServiceRoleClient, supabaseServer } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, rol, especialidad, descripcion, anyosexperiencia, ciudad } = body;

    if (!userId || !rol) {
      return NextResponse.json(
        { success: false, message: 'Faltan parámetros obligatorios (userId o rol).' },
        { status: 400 }
      );
    }

    // Validar sesión del usuario
    const sessionClient = supabaseServer();
    const { data: { user }, error: authError } = await sessionClient.auth.getUser();

    if (authError || !user || user.id !== userId) {
      return NextResponse.json(
        { success: false, message: 'No autorizado. La sesión activa no coincide con el identificador del usuario.' },
        { status: 403 }
      );
    }

    const adminClient = createServiceRoleClient();
    if (!adminClient) {
      return NextResponse.json(
        { success: false, message: 'Configuración del servidor incompleta (service role).' },
        { status: 500 }
      );
    }

    if (rol === 'profesional') {
      const { error: profError } = await adminClient
        .from('profesionales')
        .insert({
          usuarioid: userId,
          especialidad: especialidad || '',
          descripcion: descripcion || '',
          anyosexperiencia: Number(anyosexperiencia) || 0,
          ciudad: ciudad || '',
          calificacionpromedio: 0,
          totaltrabajos: 0,
        });

      if (profError) {
        console.error('Error insertando profesional con service role:', profError);
        return NextResponse.json(
          { success: false, message: profError.message },
          { status: 500 }
        );
      }
    } else if (rol === 'cliente') {
      const { error: clientError } = await adminClient
        .from('clientes')
        .insert({
          usuarioid: userId,
          calificacionpromedio: 0,
          totalproyectos: 0,
        });

      if (clientError) {
        console.error('Error insertando cliente con service role:', clientError);
        return NextResponse.json(
          { success: false, message: clientError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[completar-registro API]', error);
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}
