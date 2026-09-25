-- Prevent the same available provider from accepting two different requests at once.
create or replace function private.accept_service_offer(p_offer_id uuid) returns boolean language plpgsql security definer set search_path = '' as $$
declare v_provider uuid := auth.uid(); v_offer public.dispatch_offers%rowtype; v_request public.service_requests%rowtype;
begin
  if v_provider is null then raise exception 'Autenticação necessária'; end if;
  select * into v_offer from public.dispatch_offers where id = p_offer_id;
  if not found or v_offer.provider_id <> v_provider then raise exception 'Oferta não encontrada'; end if;
  select * into v_request from public.service_requests where id = v_offer.request_id for update;
  if v_request.status <> 'procurando' or v_offer.status <> 'pending' or v_offer.expires_at <= now() then
    raise exception 'Oferta indisponível'; end if;
  perform 1 from public.provider_profiles p where p.user_id = v_provider for update;
  if not found or not exists(select 1 from public.provider_profiles p where p.user_id = v_provider
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
