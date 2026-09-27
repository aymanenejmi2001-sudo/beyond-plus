-- BEYOND RADAR — Supabase / PostgreSQL schema. Run once in the SQL editor.
-- Server-only access with the service role key; RLS on, no public policies,
-- so the anon key can read nothing.

create extension if not exists pgcrypto;

create table if not exists brands (id uuid primary key default gen_random_uuid(), name text unique not null, official_site text, priority boolean default false, created_at timestamptz default now());
create table if not exists sneaker_models (id uuid primary key default gen_random_uuid(), brand text not null, model text not null, style_family text, tier text, priority boolean default false, created_at timestamptz default now(), unique (brand, model));

create table if not exists sneaker_candidates (
  id uuid primary key default gen_random_uuid(),
  dedupe_key text unique not null,
  model_id uuid references sneaker_models(id),
  brand text not null, model text not null, colorway text, sku text, gender text, category text, style_family text,
  official_url text, official_price numeric, official_currency text,
  hero_image_reference text, image_rights text not null default 'UNKNOWN',
  selling_price_mad numeric, catalogue_handle text,
  global_demand_score numeric, morocco_demand_score numeric, trend_velocity_score numeric, margin_score numeric, supplier_score numeric,
  first_party_score numeric, external_score numeric, beyond_score numeric, score_change numeric,
  recommendation text check (recommendation in ('LAUNCH','TEST','WATCH')),
  confidence numeric, confidence_level text check (confidence_level in ('HIGH','MEDIUM','LOW')),
  score_explanation jsonb,
  status text not null default 'DISCOVERED' check (status in ('DISCOVERED','WATCH','TEST','LAUNCH','APPROVED','REJECTED','IMPORTED','ARCHIVED')),
  first_detected_at timestamptz not null default now(), last_checked_at timestamptz, approved_at timestamptz, rejected_at timestamptz,
  notes text, source text not null, created_at timestamptz default now(), updated_at timestamptz default now()
);
create index if not exists sneaker_candidates_status on sneaker_candidates(status);
create index if not exists sneaker_candidates_handle on sneaker_candidates(catalogue_handle);

create table if not exists market_signals (
  id uuid primary key default gen_random_uuid(), candidate_id uuid not null references sneaker_candidates(id) on delete cascade,
  dimension text not null check (dimension in ('global','morocco','velocity')), source text not null, metric text not null,
  value numeric not null check (value between 0 and 100), raw_value numeric, raw_unit text,
  reliability text not null check (reliability in ('VERIFIED','MARKET','EDITORIAL')), source_url text,
  observed_at timestamptz not null, note text, created_by text not null, created_at timestamptz default now()
);
create table if not exists morocco_signals (
  id uuid primary key default gen_random_uuid(), candidate_id uuid not null references sneaker_candidates(id) on delete cascade,
  source_name text not null, source_url text, retailers_count int, colorways_count int,
  avg_price_mad numeric, min_price_mad numeric, max_price_mad numeric, promotion_frequency numeric check (promotion_frequency between 0 and 1),
  availability text not null default 'UNKNOWN', size_availability text, reliability text not null default 'MARKET',
  observed_at timestamptz not null, note text, created_by text not null, created_at timestamptz default now()
);
create table if not exists supplier_offers (
  id uuid primary key default gen_random_uuid(), candidate_id uuid not null references sneaker_candidates(id) on delete cascade,
  supplier_name text not null, supplier_product_reference text, supplier_url text,
  supplier_cost_mad numeric, cost_basis text, shipping_cost_mad numeric, estimated_landed_cost_mad numeric,
  minimum_order_quantity int, available_sizes text[], available_quantity int, lead_time_days int,
  supplier_status text not null default 'UNKNOWN', images_authorized boolean default false, image_refs text[], image_meta jsonb,
  observed_at timestamptz not null, note text, created_at timestamptz default now()
);
create table if not exists product_approvals (
  id uuid primary key default gen_random_uuid(), candidate_id uuid not null references sneaker_candidates(id) on delete cascade,
  action text not null, from_status text, to_status text, actor text not null, note text, created_at timestamptz default now()
);
create table if not exists catalogue_products (
  id uuid primary key default gen_random_uuid(), candidate_id uuid unique not null references sneaker_candidates(id) on delete cascade,
  handle text not null, product jsonb not null, publishable boolean not null default false,
  status text not null default 'DRAFT' check (status in ('DRAFT','READY','IMPORTED')), issues text[] not null default '{}',
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists product_marketing_briefs (id uuid primary key default gen_random_uuid(), candidate_id uuid not null references sneaker_candidates(id) on delete cascade, brief jsonb not null, created_at timestamptz default now());
create table if not exists performance_events (
  id uuid primary key default gen_random_uuid(), handle text not null, candidate_id uuid references sneaker_candidates(id) on delete set null,
  event text not null check (event in ('view','add_to_cart','checkout_started','purchase','refund')), size text, quantity int not null default 1,
  revenue_mad numeric, source text not null, reference text, occurred_at timestamptz not null, created_at timestamptz default now()
);
create index if not exists performance_events_handle on performance_events(handle);
create table if not exists performance_metrics (
  id uuid primary key default gen_random_uuid(), handle text not null, candidate_id uuid, window_days int not null, computed_at timestamptz not null,
  views int, add_to_cart int, checkout_started int, purchases int, units int, revenue_mad numeric, refunds int, size_mix jsonb, created_at timestamptz default now()
);
create table if not exists score_snapshots (
  id uuid primary key default gen_random_uuid(), candidate_id uuid not null references sneaker_candidates(id) on delete cascade, run_id uuid,
  beyond_score numeric, external_score numeric, first_party_score numeric, components jsonb, confidence numeric, confidence_level text, recommendation text,
  created_at timestamptz default now()
);
create index if not exists score_snapshots_candidate on score_snapshots(candidate_id, created_at);
create table if not exists radar_runs (id uuid primary key default gen_random_uuid(), kind text not null, started_at timestamptz not null, finished_at timestamptz, status text not null, stats jsonb, log jsonb, created_at timestamptz default now());
create table if not exists radar_alerts (
  id uuid primary key default gen_random_uuid(), candidate_id uuid references sneaker_candidates(id) on delete cascade,
  kind text not null, severity text not null, message text not null, created_at timestamptz default now(), acknowledged_at timestamptz
);

do $$ declare t text; begin
  foreach t in array array['brands','sneaker_models','sneaker_candidates','market_signals','morocco_signals','supplier_offers','product_approvals','catalogue_products','product_marketing_briefs','performance_events','performance_metrics','score_snapshots','radar_runs','radar_alerts']
  loop execute format('alter table %I enable row level security', t); end loop;
end $$;

-- BEYOND PLUS's own photos added to products already on the site.
create table if not exists site_photos (
  id uuid primary key default gen_random_uuid(), handle text not null, url text not null, alt_text text,
  width int, height int, created_at timestamptz default now()
);
create index if not exists site_photos_handle on site_photos(handle);
alter table site_photos enable row level security;
