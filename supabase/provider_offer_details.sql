-- Show only the information a recipient needs to decide whether to accept an offer.
create function private.get_provider_offer_details(p_offer_id uuid)
returns table(service text, details text, has_spare boolean, has_tools boolean,
              distance_km numeric, price_cents integer, expires_at timestamptz)
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null then return; end if;
  return query
    select r.service, r.details, r.has_spare, r.has_tools,
      round((6371 * 2 * asin(sqrt(
        power(sin(radians(p.lat - r.location_lat) / 2),2) +
        cos(radians(r.location_lat)) * cos(radians(p.lat)) *
        power(sin(radians(p.lng - r.location_lng) / 2),2)
      )))::numeric,1), o.price_cents, o.expires_at
    from public.dispatch_offers o
    join public.service_requests r on r.id = o.request_id
    join public.provider_profiles p on p.user_id = o.provider_id
    where o.id = p_offer_id and o.provider_id = auth.uid()
      and o.status = 'pending' and o.expires_at > now() and r.status = 'procurando';
end $$;
revoke all on function private.get_provider_offer_details(uuid) from public, anon;
grant execute on function private.get_provider_offer_details(uuid) to authenticated;
create function public.get_provider_offer_details(p_offer_id uuid)
returns table(service text, details text, has_spare boolean, has_tools boolean,
              distance_km numeric, price_cents integer, expires_at timestamptz)
language sql security invoker set search_path = '' as $$
  select * from private.get_provider_offer_details(p_offer_id)
$$;
revoke all on function public.get_provider_offer_details(uuid) from public, anon;
grant execute on function public.get_provider_offer_details(uuid) to authenticated;
