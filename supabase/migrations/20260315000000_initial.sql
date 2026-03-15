-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =====================
-- ENUMS
-- =====================

create type user_role as enum ('admin', 'user');
create type entry_type as enum ('travel', 'blocked', 'guest', 'custom');
create type request_status as enum ('pending', 'approved', 'rejected', 'cancelled');
create type request_type_enum as enum ('freunde', 'familie', 'arbeit', 'event', 'sonstiges');

-- =====================
-- PROFILES
-- =====================

create table profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  email text not null,
  role user_role not null default 'user',
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- Auto-create profile when a new auth user is created
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role, approved)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    'user',
    false
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- =====================
-- CALENDAR ENTRIES
-- =====================

create table calendar_entries (
  id uuid primary key default uuid_generate_v4(),
  type entry_type not null,
  title text not null,
  start_date date not null,
  end_date date not null,
  notes text,
  linked_request_id uuid,
  created_at timestamptz not null default now(),
  constraint end_after_start check (end_date >= start_date)
);

-- =====================
-- VISIT REQUESTS
-- =====================

create table visit_requests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  guest_count integer not null check (guest_count >= 1),
  message text not null,
  request_type request_type_enum,
  start_date date not null,
  end_date date not null,
  status request_status not null default 'pending',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  admin_notes text,
  constraint end_after_start check (end_date >= start_date)
);

-- FK from calendar_entries to visit_requests
alter table calendar_entries
  add constraint fk_linked_request
  foreign key (linked_request_id) references visit_requests(id) on delete set null;

-- =====================
-- ROW LEVEL SECURITY
-- =====================

alter table profiles enable row level security;
alter table calendar_entries enable row level security;
alter table visit_requests enable row level security;

-- Helper: is current user admin?
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

-- Helper: is current user approved?
create or replace function is_approved()
returns boolean as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and approved = true
  );
$$ language sql security definer;

-- profiles
create policy "Users read own profile or admin reads all"
  on profiles for select using (auth.uid() = id or is_admin());

create policy "Users update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Admins update any profile"
  on profiles for update using (is_admin());

-- calendar_entries
create policy "Approved users read calendar entries"
  on calendar_entries for select using (is_approved());

create policy "Admins insert calendar entries"
  on calendar_entries for insert with check (is_admin());

create policy "Admins update calendar entries"
  on calendar_entries for update using (is_admin());

create policy "Admins delete calendar entries"
  on calendar_entries for delete using (is_admin());

-- visit_requests
create policy "Users read own requests, admins read all"
  on visit_requests for select using (user_id = auth.uid() or is_admin());

create policy "Approved users create own requests"
  on visit_requests for insert with check (auth.uid() = user_id and is_approved());

create policy "Admins update any request"
  on visit_requests for update using (is_admin());
