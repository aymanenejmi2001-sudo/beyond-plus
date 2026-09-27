-- Run in the existing Supabase project before enabling production storage.
-- No personal contact details are stored here. Service-role access only.
create table if not exists public.commerce_events (
  id uuid primary key,
  kind text not null,
  created_at timestamptz not null default now(),
  payload jsonb not null
);
alter table public.commerce_events enable row level security;
revoke all on public.commerce_events from anon, authenticated;
grant all on public.commerce_events to service_role;
create index if not exists commerce_events_created_at on public.commerce_events(created_at);
-- Operational maintenance: remove optional audience events after 90 days.
-- Keep request records according to the merchant's validated retention policy.
