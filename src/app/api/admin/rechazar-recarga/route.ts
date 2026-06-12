import { NextResponse } from 'next/server';
import { readIdFromRequest, requireAdmin } from '../_utils';

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const id = await readIdFromRequest(request);
  if (!id) {
    return NextResponse.json(
      { success: false, message: 'Id de recarga requerido.' },
      { status: 400 }
    );
  }

  const { data, error } = await auth.context.adminClient
    .from('recargas')
    .update({ estado: 'rechazada', aprobadoat: null })
    .eq('id', id)
    .select('id')
    .single();

  if (error || !data?.id) {
    return NextResponse.json(
      { success: false, message: error?.message || 'No se pudo rechazar la recarga.' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    id: data.id,
    message: 'Solicitud de recarga rechazada.',
  });
}
