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

  const { data, error } = await auth.context.adminClient.rpc('aprobar_recarga', {
    p_recargaid: id,
  });

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }

  const response = data as { success?: boolean; message?: string } | null;
  if (!response?.success) {
    return NextResponse.json(
      { success: false, message: response?.message || 'No se pudo aprobar la recarga.' },
      { status: 400 }
    );
  }

  const { data: recarga, error: recargaError } = await auth.context.adminClient
    .from('recargas')
    .select('id')
    .eq('id', id)
    .eq('estado', 'aprobada')
    .single();

  if (recargaError || !recarga?.id) {
    return NextResponse.json(
      { success: false, message: 'La recarga no quedo confirmada como aprobada.' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    id: recarga.id,
    message: response.message || 'Recarga aprobada correctamente.',
  });
}
