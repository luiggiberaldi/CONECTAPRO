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
  const { data, error } = await supabase
    .from('usuarios')
    .select('*, profesionales(especialidad, calificacionpromedio, totaltrabajos), clientes(calificacionpromedio, totalproyectos)')
    .order('nombre', { ascending: true });

  if (error) {
    console.error('Error executing query:', error);
    return;
  }

  // Encontrar y mostrar el registro de Alejandro Silva
  const alejandro = data.find(u => u.nombre.includes('Alejandro Silva'));
  console.log('Alejandro Silva Data returned by Supabase Query:');
  console.log(JSON.stringify(alejandro, null, 2));
}
main();
