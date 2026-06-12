-- 00002_create_usuarios.sql

create table public.usuarios (
  id uuid primary key references auth.users on delete cascade,
  email text not null unique,
  nombre text not null,
  rol text not null check (rol in ('cliente', 'profesional', 'admin')),
  avatar_url text,
  ciudad text,
  estado text not null default 'activo' check (estado in ('activo', 'suspendido')),
  createdat timestamptz not null default now()
);

-- Habilitar RLS
alter table public.usuarios enable row level security;

-- Políticas RLS para usuarios

-- 1. Lectura: Cualquier usuario autenticado puede leer los perfiles (necesario para ver info del cliente/profesional asignado)
create policy "Permitir lectura de perfiles a autenticados"
on public.usuarios
for select
to authenticated
using (true);

-- 2. Actualización: Un usuario solo puede actualizar su propio perfil
create policy "Permitir actualizacion de perfil propio"
on public.usuarios
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- 3. Control de Admin: Admin tiene control total sobre todos los perfiles (sin recursión)
create policy "Admins control total sobre usuarios"
on public.usuarios
for all
to authenticated
using (
  coalesce(auth.jwt() -> 'user_metadata' ->> 'rol', '') = 'admin'
);

-- Función trigger para sincronizar auth.users -> public.usuarios
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.usuarios (id, email, nombre, rol, avatar_url, ciudad, estado)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nombre', new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'rol', 'cliente'),
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'ciudad',
    'activo'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger asociado
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
