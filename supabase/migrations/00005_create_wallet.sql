-- 00005_create_wallet.sql

create table public.wallet (
  id uuid primary key default gen_random_uuid(),
  profesionalid uuid not null unique references public.usuarios(id) on delete cascade,
  saldo integer not null default 3, -- 3 créditos de bienvenida por defecto
  totalcargado integer not null default 0,
  totalusado integer not null default 0,
  updatedat timestamptz not null default now()
);

-- Habilitar RLS
alter table public.wallet enable row level security;

-- Políticas RLS

-- 1. Lectura: Un profesional solo puede ver su propia wallet
create policy "Permitir lectura de wallet propia"
on public.wallet
for select
to authenticated
using (auth.uid() = profesionalid);

-- Nota: Las inserciones, actualizaciones y eliminaciones directas desde el cliente están denegadas para evitar manipulaciones.
-- Solo se realizarán a nivel de servidor (API/Server Actions con service role) o mediante triggers de base de datos.

-- 2. Admin: Control total
create policy "Admins control total sobre wallets"
on public.wallet
for all
to authenticated
using (
  coalesce(auth.jwt() -> 'user_metadata' ->> 'rol', '') = 'admin'
);

-- Función trigger para crear automáticamente la wallet cuando se registra un profesional
create or replace function public.handle_new_professional_wallet()
returns trigger as $$
begin
  -- Inserta la wallet con 3 créditos de bienvenida
  insert into public.wallet (profesionalid, saldo, totalcargado, totalusado)
  values (new.usuarioid, 3, 0, 0)
  on conflict (profesionalid) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger asociado
create trigger on_professional_profile_created
  after insert on public.profesionales
  for each row execute procedure public.handle_new_professional_wallet();
