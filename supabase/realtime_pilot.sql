-- Real-time changes respect table RLS: customers see their requests; providers see their own offers.
do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'service_requests') then
    alter publication supabase_realtime add table public.service_requests;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'dispatch_offers') then
    alter publication supabase_realtime add table public.dispatch_offers;
  end if;
end $$;
