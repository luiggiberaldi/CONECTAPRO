const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const envPath = path.resolve(__dirname, '../.env.local');
const content = fs.readFileSync(envPath, 'utf8');
const env = {};
content.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const parts = trimmed.split('=');
  const key = parts[0].trim();
  const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
  env[key] = val;
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function main() {
  const { data: users, error: uerr } = await supabase.from('usuarios').select('id, nombre, email, rol');
  if (uerr) {
    console.error('Error fetching users:', uerr);
    return;
  }
  console.log('Todos los usuarios:', users);
  const clients = users.filter(u => u.rol === 'cliente');
  console.log(`Encontrados ${clients.length} usuarios con rol 'cliente' en usuarios.`);

  const { data: clientes, error: cerr } = await supabase.from('clientes').select('*');
  if (cerr) {
    console.error('Error fetching clientes:', cerr);
    return;
  }
  console.log(`Encontrados ${clientes.length} registros en la tabla clientes.`);
  console.log('Registros de clientes:', clientes);
}
main();
