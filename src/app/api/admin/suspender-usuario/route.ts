import { NextResponse } from 'next/server';
import { readIdFromRequest, requireAdmin } from '../_utils';

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const id = await readIdFromRequest(request);
  if (!id) {
    return NextResponse.json(
      { success: false, message: 'Id de usuario requerido.' },
      { status: 400 }
    );
  }

  const { data, error } = await auth.context.adminClient
    .from('usuarios')
    .update({ estado: 'suspendido' })
    .eq('id', id)
    .neq('rol', 'admin')
    .select('id, nombre')
    .single();

  if (error || !data?.id) {
    return NextResponse.json(
      { success: false, message: error?.message || 'No se pudo suspender el usuario.' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    id: data.id,
    message: `El usuario ${data.nombre} ha sido suspendido.`,
  });
}
