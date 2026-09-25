-- Execute somente em um projeto Supabase exclusivo do SUPRT.
create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references auth.users(id) on delete cascade,
  service text not null check (service in ('Pneu furado','Bateria','Guincho','Outro suporte')),
  details text not null,
  address text not null,
  contact_phone text not null,
  has_spare boolean,
  has_tools boolean,
  status text not null default 'recebido' check (status in ('recebido','cancelado')),
  created_at timestamptz not null default now()
);
alter table public.service_requests enable row level security;
create policy "customers_read_own_requests" on public.service_requests for select to authenticated using ((select auth.uid()) = customer_id);
create policy "customers_create_own_requests" on public.service_requests for insert to authenticated with check ((select auth.uid()) = customer_id and status = 'recebido');
revoke all on public.service_requests from anon;
grant select, insert on public.service_requests to authenticated;
