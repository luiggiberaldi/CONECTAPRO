import { NextResponse } from 'next/server';
import { createServiceRoleClient, supabaseServer } from '@/lib/supabase';
import type { SupabaseClient } from '@/lib/supabase';

interface AdminContext {
  adminClient: SupabaseClient;
  adminUserId: string;
}

type AdminCheckResult =
  | { ok: true; context: AdminContext }
  | { ok: false; response: NextResponse };

export async function requireAdmin(): Promise<AdminCheckResult> {
  const adminClient = createServiceRoleClient();

  if (!adminClient) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, message: 'Configuracion de servidor incompleta.' },
        { status: 500 }
      ),
    };
  }

  const sessionClient = supabaseServer();
  const {
    data: { user },
    error: userError,
  } = await sessionClient.auth.getUser();

  if (userError || !user) {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, message: 'Sesion requerida.' },
        { status: 401 }
      ),
    };
  }

  const { data: profile, error: profileError } = await adminClient
    .from('usuarios')
    .select('id, rol, estado')
    .eq('id', user.id)
    .single();

  if (profileError || profile?.rol !== 'admin' || profile?.estado !== 'activo') {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, message: 'No autorizado.' },
        { status: 403 }
      ),
    };
  }

  return {
    ok: true,
    context: {
      adminClient,
      adminUserId: user.id,
    },
  };
}

export async function readIdFromRequest(request: Request): Promise<string | null> {
  try {
    const body = (await request.json()) as { id?: unknown };
    return typeof body.id === 'string' && body.id.trim() ? body.id : null;
  } catch {
    return null;
  }
}
