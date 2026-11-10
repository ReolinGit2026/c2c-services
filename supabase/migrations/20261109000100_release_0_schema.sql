-- C2C Services Release 0 operational pilot.
-- Private intake is writable only through narrowly scoped server RPCs.

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin', 'operator')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  contact_name text not null check (char_length(contact_name) between 2 and 100),
  phone text not null check (char_length(phone) between 9 and 30),
  email text check (email is null or char_length(email) <= 254),
  area_text text not null check (char_length(area_text) between 2 and 120),
  category text not null check (category in ('geyser', 'burst-pipe', 'blocked-drain', 'leak', 'installation', 'other')),
  description text not null check (char_length(description) between 10 and 2000),
  urgency text not null check (urgency in ('urgent', 'soon', 'flexible')),
  preferred_time_text text check (preferred_time_text is null or char_length(preferred_time_text) <= 120),
  privacy_notice_version text not null check (char_length(privacy_notice_version) <= 40),
  consented_at timestamptz not null default now(),
  source text not null default 'website' check (char_length(source) <= 40),
  status text not null default 'new' check (status in ('new', 'reviewing', 'contacting_providers', 'introduced', 'follow_up', 'closed')),
  outcome text check (outcome is null or outcome in ('booked', 'not_booked', 'cancelled', 'unreachable', 'unknown')),
  first_action_at timestamptz,
  closed_at timestamptz
);

create table if not exists public.provider_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  contact_name text not null check (char_length(contact_name) between 2 and 100),
  business_name text not null check (char_length(business_name) between 2 and 150),
  phone text not null check (char_length(phone) between 9 and 30),
  email text check (email is null or char_length(email) <= 254),
  services text[] not null check (cardinality(services) between 1 and 20),
  service_areas text[] not null check (cardinality(service_areas) between 1 and 20),
  status text not null default 'new' check (status in ('new', 'reviewing', 'accepted_for_pilot', 'declined', 'inactive')),
  privacy_notice_version text not null check (char_length(privacy_notice_version) <= 40),
  consented_at timestamptz not null default now(),
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz
);

create table if not exists public.request_provider_actions (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.service_requests(id) on delete cascade,
  provider_application_id uuid not null references public.provider_applications(id) on delete restrict,
  created_at timestamptz not null default now(),
  created_by uuid not null references auth.users(id) on delete restrict,
  action text not null check (action in ('considered', 'contact_attempted', 'responded', 'declined', 'introduced')),
  response_at timestamptz,
  decline_reason text check (decline_reason is null or char_length(decline_reason) <= 300),
  notes text check (notes is null or char_length(notes) <= 1000)
);

create table if not exists public.request_events (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.service_requests(id) on delete cascade,
  actor_admin_id uuid references auth.users(id) on delete set null,
  event_type text not null check (char_length(event_type) <= 50),
  from_value text check (from_value is null or char_length(from_value) <= 100),
  to_value text check (to_value is null or char_length(to_value) <= 100),
  note text check (note is null or char_length(note) <= 1000),
  created_at timestamptz not null default now()
);

create table if not exists public.provider_application_events (
  id uuid primary key default gen_random_uuid(),
  provider_application_id uuid not null references public.provider_applications(id) on delete cascade,
  actor_admin_id uuid references auth.users(id) on delete set null,
  event_type text not null check (char_length(event_type) <= 50),
  from_value text check (from_value is null or char_length(from_value) <= 100),
  to_value text check (to_value is null or char_length(to_value) <= 100),
  note text check (note is null or char_length(note) <= 1000),
  created_at timestamptz not null default now()
);

create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_admin_id uuid references auth.users(id) on delete set null,
  action text not null check (char_length(action) <= 60),
  entity_type text not null check (char_length(entity_type) <= 60),
  entity_id uuid,
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.intake_rate_limits (
  ip_hash text not null check (ip_hash ~ '^[a-f0-9]{64}$'),
  form_type text not null check (form_type in ('request', 'provider')),
  window_start timestamptz not null,
  submission_count integer not null check (submission_count >= 0),
  primary key (ip_hash, form_type)
);

create index if not exists service_requests_status_created_idx on public.service_requests (status, created_at desc);
create index if not exists service_requests_area_created_idx on public.service_requests (area_text, created_at desc);
create index if not exists provider_applications_status_created_idx on public.provider_applications (status, created_at desc);
create index if not exists request_provider_actions_request_idx on public.request_provider_actions (request_id, created_at desc);
create index if not exists request_provider_actions_provider_idx on public.request_provider_actions (provider_application_id, created_at desc);
create index if not exists request_events_request_idx on public.request_events (request_id, created_at desc);
create index if not exists provider_events_provider_idx on public.provider_application_events (provider_application_id, created_at desc);
create index if not exists admin_audit_log_created_idx on public.admin_audit_log (created_at desc);

create or replace function public.is_active_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
set row_security = off
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = (select auth.uid()) and active = true
  );
$$;

create or replace function public.is_admin_aal2()
returns boolean
language sql
stable
security invoker
set search_path = public, auth, pg_temp
as $$
  select public.is_active_admin() and (select auth.jwt() ->> 'aal') = 'aal2';
$$;

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public, pg_temp as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger service_requests_set_updated_at before update on public.service_requests
for each row execute function public.set_updated_at();
create trigger provider_applications_set_updated_at before update on public.provider_applications
for each row execute function public.set_updated_at();

create or replace function public.audit_operational_update()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
begin
  if tg_table_name = 'service_requests' then
    if old.status is distinct from new.status then
      insert into public.request_events (request_id, actor_admin_id, event_type, from_value, to_value)
      values (new.id, auth.uid(), 'status_changed', old.status, new.status);
      insert into public.admin_audit_log (actor_admin_id, action, entity_type, entity_id)
      values (auth.uid(), 'status_changed', 'service_request', new.id);
    end if;
    if old.outcome is distinct from new.outcome then
      insert into public.request_events (request_id, actor_admin_id, event_type, from_value, to_value)
      values (new.id, auth.uid(), 'outcome_changed', old.outcome, new.outcome);
    end if;
  elsif tg_table_name = 'provider_applications' and old.status is distinct from new.status then
    new.reviewed_by := auth.uid();
    new.reviewed_at := now();
    insert into public.provider_application_events (provider_application_id, actor_admin_id, event_type, from_value, to_value)
    values (new.id, auth.uid(), 'status_changed', old.status, new.status);
    insert into public.admin_audit_log (actor_admin_id, action, entity_type, entity_id)
    values (auth.uid(), 'status_changed', 'provider_application', new.id);
  end if;
  return new;
end;
$$;

create trigger service_requests_audit_update after update on public.service_requests
for each row execute function public.audit_operational_update();
create trigger provider_applications_audit_update before update on public.provider_applications
for each row execute function public.audit_operational_update();

create or replace function public.audit_operational_delete()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
begin
  insert into public.admin_audit_log (actor_admin_id, action, entity_type, entity_id)
  values (auth.uid(), 'deleted', case when tg_table_name = 'service_requests' then 'service_request' else 'provider_application' end, old.id);
  return old;
end;
$$;

create trigger service_requests_audit_delete before delete on public.service_requests
for each row execute function public.audit_operational_delete();
create trigger provider_applications_audit_delete before delete on public.provider_applications
for each row execute function public.audit_operational_delete();

create or replace function public.check_intake_rate_limit(p_form_type text, p_ip_hash text, p_limit integer)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare v_count integer;
begin
  if p_form_type not in ('request', 'provider') or p_ip_hash !~ '^[a-f0-9]{64}$' or p_limit not between 1 and 20 then
    return false;
  end if;
  insert into public.intake_rate_limits (ip_hash, form_type, window_start, submission_count)
  values (p_ip_hash, p_form_type, date_trunc('hour', now()), 1)
  on conflict (ip_hash, form_type) do update
  set window_start = case when public.intake_rate_limits.window_start = date_trunc('hour', now()) then public.intake_rate_limits.window_start else date_trunc('hour', now()) end,
      submission_count = case when public.intake_rate_limits.window_start = date_trunc('hour', now()) then public.intake_rate_limits.submission_count + 1 else 1 end
  returning submission_count into v_count;
  delete from public.intake_rate_limits where window_start < now() - interval '2 days';
  return v_count <= p_limit;
end;
$$;

create or replace function public.submit_service_request(
  p_contact_name text, p_phone text, p_email text, p_area_text text, p_category text,
  p_description text, p_urgency text, p_preferred_time_text text, p_privacy_notice_version text
)
returns uuid
language plpgsql
security definer
set search_path = public, extensions, pg_temp
set row_security = off
as $$
declare v_id uuid;
begin
  insert into public.service_requests (contact_name, phone, email, area_text, category, description, urgency, preferred_time_text, privacy_notice_version)
  values (btrim(p_contact_name), btrim(p_phone), nullif(btrim(p_email), ''), btrim(p_area_text), p_category, btrim(p_description), p_urgency, nullif(btrim(p_preferred_time_text), ''), p_privacy_notice_version)
  returning id into v_id;
  insert into public.request_events (request_id, event_type, to_value) values (v_id, 'request_submitted', 'new');
  return v_id;
end;
$$;

create or replace function public.submit_provider_application(
  p_contact_name text, p_business_name text, p_phone text, p_email text,
  p_services text[], p_service_areas text[], p_privacy_notice_version text
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
set row_security = off
as $$
declare v_id uuid;
begin
  insert into public.provider_applications (contact_name, business_name, phone, email, services, service_areas, privacy_notice_version)
  values (btrim(p_contact_name), btrim(p_business_name), btrim(p_phone), nullif(btrim(p_email), ''), p_services, p_service_areas, p_privacy_notice_version)
  returning id into v_id;
  insert into public.provider_application_events (provider_application_id, event_type, to_value) values (v_id, 'application_submitted', 'new');
  return v_id;
end;
$$;

alter table public.admin_users enable row level security;
alter table public.service_requests enable row level security;
alter table public.provider_applications enable row level security;
alter table public.request_provider_actions enable row level security;
alter table public.request_events enable row level security;
alter table public.provider_application_events enable row level security;
alter table public.admin_audit_log enable row level security;
alter table public.intake_rate_limits enable row level security;

revoke all on public.admin_users, public.service_requests, public.provider_applications,
  public.request_provider_actions, public.request_events, public.provider_application_events,
  public.admin_audit_log, public.intake_rate_limits from anon;
revoke all on public.admin_users, public.service_requests, public.provider_applications,
  public.request_provider_actions, public.request_events, public.provider_application_events,
  public.admin_audit_log, public.intake_rate_limits from authenticated;

grant select on public.admin_users to authenticated;
grant select, update, delete on public.service_requests to authenticated;
grant select, update, delete on public.provider_applications to authenticated;
grant select, insert on public.request_provider_actions to authenticated;
grant select, insert on public.request_events, public.provider_application_events to authenticated;
grant select on public.admin_audit_log to authenticated;
grant execute on function public.is_active_admin() to authenticated;
grant execute on function public.is_admin_aal2() to authenticated;

create policy "admins read own membership" on public.admin_users for select to authenticated
  using (user_id = (select auth.uid()) and active = true);

create policy "active admins read requests" on public.service_requests for select to authenticated using (public.is_admin_aal2());
create policy "active admins update requests" on public.service_requests for update to authenticated using (public.is_admin_aal2()) with check (public.is_admin_aal2());
create policy "active admins delete requests" on public.service_requests for delete to authenticated using (public.is_admin_aal2());

create policy "active admins read providers" on public.provider_applications for select to authenticated using (public.is_admin_aal2());
create policy "active admins update providers" on public.provider_applications for update to authenticated using (public.is_admin_aal2()) with check (public.is_admin_aal2());
create policy "active admins delete providers" on public.provider_applications for delete to authenticated using (public.is_admin_aal2());

create policy "active admins read provider actions" on public.request_provider_actions for select to authenticated using (public.is_admin_aal2());
create policy "active admins create provider actions" on public.request_provider_actions for insert to authenticated with check (public.is_admin_aal2() and created_by = (select auth.uid()));
create policy "active admins read request events" on public.request_events for select to authenticated using (public.is_admin_aal2());
create policy "active admins append request events" on public.request_events for insert to authenticated with check (public.is_admin_aal2() and actor_admin_id = (select auth.uid()));
create policy "active admins read provider events" on public.provider_application_events for select to authenticated using (public.is_admin_aal2());
create policy "active admins append provider events" on public.provider_application_events for insert to authenticated with check (public.is_admin_aal2() and actor_admin_id = (select auth.uid()));
create policy "active admins read audit log" on public.admin_audit_log for select to authenticated using (public.is_admin_aal2());

revoke all on function public.check_intake_rate_limit(text, text, integer) from public, anon, authenticated;
revoke all on function public.submit_service_request(text, text, text, text, text, text, text, text, text) from public, anon, authenticated;
revoke all on function public.submit_provider_application(text, text, text, text, text[], text[], text) from public, anon, authenticated;
grant execute on function public.check_intake_rate_limit(text, text, integer) to service_role;
grant execute on function public.submit_service_request(text, text, text, text, text, text, text, text, text) to service_role;
grant execute on function public.submit_provider_application(text, text, text, text, text[], text[], text) to service_role;

-- Supabase Auth creates the initial user; an existing owner inserts an explicit allowlist row:
-- insert into public.admin_users (user_id, role) values ('<auth-user-uuid>', 'admin');
