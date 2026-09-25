-- Applied to the SUPRT project. Foreground location from a confirmed customer request only.
alter table public.service_requests
  add column location_lat double precision,
  add column location_lng double precision;
alter table public.service_requests
  add constraint service_requests_location_pair_check
    check ((location_lat is null and location_lng is null)
       or (location_lat between -90 and 90 and location_lng between -180 and 180));
