import { createBrowserClient, createServerClient, type CookieOptions } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Cliente de Supabase para uso exclusivo en componentes del lado del cliente (Browser)
export const supabaseBrowser = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
);

// Función para generar el cliente de Supabase para componentes del lado del servidor (SSR, Server Actions, API Routes)
export function supabaseServer() {
  // Se utiliza require para evitar que webpack intente empaquetar 'next/headers' en el lado del cliente (Browser)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { cookies } = require('next/headers');
  const cookieStore = cookies();
  
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Esto se silencia de forma segura cuando se llama desde un React Server Component
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.delete({ name, ...options });
          } catch {
            // Esto se silencia de forma segura cuando se llama desde un React Server Component
          }
        },
      },
    }
  );
}
