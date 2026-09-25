-- SUPRT pilot dispatch. Run only on the dedicated SUPRT project.
-- Provider approval remains a manual operations step; payments and push are not active.
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

alter table public.service_requests
  add column assigned_provider_id uuid references auth.users(id),
  add column price_cents integer,
  add column accepted_at timestamptz,
  add column updated_at timestamptz not null default now();
alter table public.service_requests drop constraint service_requests_status_check;
alter table public.service_requests add constraint service_requests_status_check
  check (status in ('recebido','procurando','aceito','a_caminho','chegou','em_servico','concluido','cancelado','sem_prestador'));
alter table public.service_requests add constraint service_requests_price_check check (price_cents is null or price_cents > 0);

create table public.provider_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  kind text not null check (kind in ('pf','pj')),
  display_name text not null check (char_length(display_name) between 2 and 100),
  approval_status text not null default 'pending' check (approval_status in ('pending','approved','rejected','suspended')),
  tire boolean not null default false,
  battery boolean not null default false,
  air boolean not null default false,
  towing boolean not null default false,
  has_jack boolean not null default false,
  has_jumper boolean not null default false,
  has_compressor boolean not null default false,
  is_available boolean not null default false,
  lat double precision,
  lng double precision,
  location_updated_at timestamptz,
  created_at timestamptz not null default now(),
  constraint provider_position_check check ((lat is null and lng is null) or (lat between -90 and 90 and lng between -180 and 180))
);
alter table public.provider_profiles enable row level security;
create policy provider_read_self on public.provider_profiles for select to authenticated using ((select auth.uid()) = user_id);
create policy provider_create_self on public.provider_profiles for insert to authenticated
  with check ((select auth.uid()) = user_id and approval_status = 'pending' and not is_available and lat is null and lng is null);
create policy provider_update_self on public.provider_profiles for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
revoke all on public.provider_profiles from anon, authenticated;
grant select, insert on public.provider_profiles to authenticated;
grant update (display_name,tire,battery,air,towing,has_jack,has_jumper,has_compressor,is_available,lat,lng) on public.provider_profiles to authenticated;

create function private.validate_provider_update() returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  if new.lat is distinct from old.lat or new.lng is distinct from old.lng then
    new.location_updated_at := now();
  end if;
  if new.is_available and (new.approval_status <> 'approved' or new.lat is null or new.lng is null
     or not (new.tire or new.battery or new.air or new.towing)) then
    raise exception 'Prestador não aprovado ou sem localização/capacidade';
  end if;
  if new.is_available and exists (
    select 1 from public.service_requests r where r.assigned_provider_id = new.user_id
      and r.status in ('aceito','a_caminho','chegou','em_servico')
  ) then raise exception 'Atendimento em andamento'; end if;
  return new;
end $$;
create trigger validate_provider_before_update before update on public.provider_profiles
  for each row execute function private.validate_provider_update();

create table public.dispatch_offers (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.service_requests(id) on delete cascade,
  provider_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','accepted','declined','expired')),
  price_cents integer not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '5 minutes'),
  unique(request_id,provider_id)
);
create index dispatch_offers_provider_idx on public.dispatch_offers(provider_id,status,expires_at);
alter table public.dispatch_offers enable row level security;
create policy offer_read_self on public.dispatch_offers for select to authenticated using ((select auth.uid()) = provider_id);
revoke all on public.dispatch_offers from anon, authenticated;
grant select on public.dispatch_offers to authenticated;

-- Clients insert only a draft request. The server assigns its quote and offers.
drop policy customers_create_own_requests on public.service_requests;
create policy customers_create_own_requests on public.service_requests for insert to authenticated
  with check ((select auth.uid()) = customer_id and status = 'recebido' and assigned_provider_id is null and price_cents is null);
create policy assigned_provider_read_request on public.service_requests for select to authenticated
  using ((select auth.uid()) = assigned_provider_id);

create function private.dispatch_new_request() returns trigger language plpgsql security definer set search_path = '' as $$
declare v_price integer;
begin
  v_price := case
    when new.service = 'Pneu furado' and new.has_spare is true then case when new.has_tools is true then 6900 else 8900 end
    when new.service = 'Bateria' then 7900
    when new.service = 'Calibragem' then 5900
    else null end;
  update public.service_requests set price_cents = v_price, updated_at = now() where id = new.id;
  if v_price is null or new.location_lat is null or new.location_lng is null then
    update public.service_requests set status = 'sem_prestador' where id = new.id;
    return null;
  end if;
  insert into public.dispatch_offers(request_id,provider_id,price_cents)
    select new.id, eligible.user_id, v_price from (
      select p.user_id,
        6371000 * 2 * asin(sqrt(
          power(sin(radians(p.lat - new.location_lat) / 2),2) +
          cos(radians(new.location_lat)) * cos(radians(p.lat)) *
          power(sin(radians(p.lng - new.location_lng) / 2),2)
        )) as distance_m
      from public.provider_profiles p
      where p.approval_status = 'approved' and p.is_available
        and p.location_updated_at >= now() - interval '10 minutes'
        and p.lat is not null and p.lng is not null
        and ((new.service = 'Pneu furado' and p.tire and (new.has_tools is true or p.has_jack))
          or (new.service = 'Bateria' and p.battery and p.has_jumper)
          or (new.service = 'Calibragem' and p.air and p.has_compressor))
    ) eligible where eligible.distance_m <= 10000 order by eligible.distance_m limit 5;
  update public.service_requests set status = case when exists
    (select 1 from public.dispatch_offers where request_id = new.id) then 'procurando' else 'sem_prestador' end,
    updated_at = now() where id = new.id;
  return null;
end $$;
revoke all on function private.dispatch_new_request() from public, anon, authenticated;
create trigger dispatch_after_insert after insert on public.service_requests
  for each row execute function private.dispatch_new_request();

create function private.accept_service_offer(p_offer_id uuid) returns boolean language plpgsql security definer set search_path = '' as $$
declare v_provider uuid := auth.uid(); v_offer public.dispatch_offers%rowtype; v_request public.service_requests%rowtype;
begin
  if v_provider is null then raise exception 'Autenticação necessária'; end if;
  select * into v_offer from public.dispatch_offers where id = p_offer_id;
  if not found or v_offer.provider_id <> v_provider then raise exception 'Oferta não encontrada'; end if;
  select * into v_request from public.service_requests where id = v_offer.request_id for update;
  if v_request.status <> 'procurando' or v_offer.status <> 'pending' or v_offer.expires_at <= now() then
    raise exception 'Oferta indisponível'; end if;
  if not exists(select 1 from public.provider_profiles p where p.user_id = v_provider
     and p.approval_status = 'approved' and p.is_available
     and p.location_updated_at >= now() - interval '10 minutes') then
    raise exception 'Prestador indisponível'; end if;
  update public.service_requests set assigned_provider_id = v_provider, status = 'aceito',
    accepted_at = now(), updated_at = now() where id = v_request.id;
  update public.dispatch_offers set status = case when id = p_offer_id then 'accepted' else 'expired' end
    where request_id = v_request.id and status = 'pending';
  update public.provider_profiles set is_available = false where user_id = v_provider;
  return true;
end $$;
revoke all on function private.accept_service_offer(uuid) from public, anon;
grant execute on function private.accept_service_offer(uuid) to authenticated;
create function public.accept_service_offer(p_offer_id uuid) returns boolean language sql security invoker set search_path = '' as $$
  select private.accept_service_offer(p_offer_id)
$$;
revoke all on function public.accept_service_offer(uuid) from public, anon;
grant execute on function public.accept_service_offer(uuid) to authenticated;

create function private.progress_service(p_request_id uuid, p_next_status text) returns boolean language plpgsql security definer set search_path = '' as $$
declare v_user uuid := auth.uid(); v_request public.service_requests%rowtype;
begin
  if v_user is null then raise exception 'Autenticação necessária'; end if;
  select * into v_request from public.service_requests where id = p_request_id for update;
  if not found then raise exception 'Pedido não encontrado'; end if;
  if p_next_status = 'cancelado' then
    if v_user <> v_request.customer_id or v_request.status not in ('procurando','aceito','a_caminho','chegou') then
      raise exception 'Cancelamento indisponível'; end if;
  elsif v_user <> v_request.assigned_provider_id or not (
    (v_request.status = 'aceito' and p_next_status = 'a_caminho') or
    (v_request.status = 'a_caminho' and p_next_status = 'chegou') or
    (v_request.status = 'chegou' and p_next_status = 'em_servico') or
    (v_request.status = 'em_servico' and p_next_status = 'concluido')
  ) then raise exception 'Transição não autorizada'; end if;
  update public.service_requests set status = p_next_status, updated_at = now() where id = p_request_id;
  if p_next_status in ('cancelado','concluido') and v_request.assigned_provider_id is not null then
    update public.provider_profiles set is_available = false where user_id = v_request.assigned_provider_id;
  end if;
  return true;
end $$;
revoke all on function private.progress_service(uuid,text) from public, anon;
grant execute on function private.progress_service(uuid,text) to authenticated;
create function public.progress_service(p_request_id uuid,p_next_status text) returns boolean language sql security invoker set search_path = '' as $$
  select private.progress_service(p_request_id,p_next_status)
$$;
revoke all on function public.progress_service(uuid,text) from public, anon;
grant execute on function public.progress_service(uuid,text) to authenticated;

create function private.get_assigned_provider(p_request_id uuid)
returns table(display_name text, lat double precision, lng double precision, location_updated_at timestamptz)
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null or not exists (
    select 1 from public.service_requests r where r.id = p_request_id and r.customer_id = auth.uid()
       and r.assigned_provider_id is not null and r.status in ('aceito','a_caminho','chegou','em_servico')
  ) then return; end if;
  return query select p.display_name,p.lat,p.lng,p.location_updated_at from public.provider_profiles p
    join public.service_requests r on r.assigned_provider_id = p.user_id where r.id = p_request_id;
end $$;
revoke all on function private.get_assigned_provider(uuid) from public, anon;
grant execute on function private.get_assigned_provider(uuid) to authenticated;
create function public.get_assigned_provider(p_request_id uuid)
returns table(display_name text, lat double precision, lng double precision, location_updated_at timestamptz)
language sql security invoker set search_path = '' as $$
  select * from private.get_assigned_provider(p_request_id)
$$;
revoke all on function public.get_assigned_provider(uuid) from public, anon;
grant execute on function public.get_assigned_provider(uuid) to authenticated;

-- Add calibragem to the service catalog; guincho and other cases require manual quote.
alter table public.service_requests drop constraint service_requests_service_check;
alter table public.service_requests add constraint service_requests_service_check
  check (service in ('Pneu furado','Bateria','Calibragem','Guincho','Outro suporte'));
