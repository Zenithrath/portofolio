-- Run this in Supabase SQL Editor after the existing portfolio schema.
-- It makes direct browser CRUD safe by granting write access only to users
-- explicitly listed in public.admin_users. Do not expose a service-role key.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

drop policy if exists "admins can read their own admin record" on public.admin_users;
create policy "admins can read their own admin record"
  on public.admin_users for select to authenticated
  using (user_id = auth.uid());

create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

revoke all on function public.is_portfolio_admin() from public;
grant execute on function public.is_portfolio_admin() to authenticated;

-- The legacy tables may have been created before browser access was needed.
-- Grant table privileges explicitly; RLS below remains the authorization layer.
grant usage on schema public to anon, authenticated;
grant select on table public.personals, public.skills, public.journeys, public.projects,
  public.project_tags, public.certificates, public.experiences, public.contacts to anon, authenticated;
grant insert, update, delete on table public.personals, public.skills, public.journeys,
  public.projects, public.project_tags, public.certificates, public.experiences, public.contacts to authenticated;
grant select on table public.admin_users to authenticated;
grant usage, select on all sequences in schema public to authenticated;

do $$
declare
  portfolio_table text;
begin
  foreach portfolio_table in array array[
    'personals', 'skills', 'journeys', 'projects', 'project_tags',
    'certificates', 'experiences', 'contacts'
  ] loop
    execute format('drop policy if exists "portfolio admins manage %1$s" on public.%1$I', portfolio_table);
    execute format(
      'create policy "portfolio admins manage %1$s" on public.%1$I for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin())',
      portfolio_table
    );
  end loop;
end $$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio',
  'portfolio',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public can read portfolio files" on storage.objects;
create policy "public can read portfolio files"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'portfolio');

drop policy if exists "portfolio admins upload files" on storage.objects;
create policy "portfolio admins upload files"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio' and public.is_portfolio_admin());

drop policy if exists "portfolio admins update files" on storage.objects;
create policy "portfolio admins update files"
  on storage.objects for update to authenticated
  using (bucket_id = 'portfolio' and public.is_portfolio_admin())
  with check (bucket_id = 'portfolio' and public.is_portfolio_admin());

drop policy if exists "portfolio admins delete files" on storage.objects;
create policy "portfolio admins delete files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio' and public.is_portfolio_admin());

-- After registering your admin account, replace the UUID and run once:
-- insert into public.admin_users (user_id) values ('YOUR_AUTH_USER_UUID');
