-- Run this in Supabase SQL Editor after the existing portfolio schema.
-- Dashboard access and CRUD use Supabase Auth only. No admin table is needed.
-- Every authenticated user can manage this single-owner portfolio.

-- Legacy tables may have been created before browser access was needed.
-- These grants provide database privileges; RLS below remains the guard.
grant usage on schema public to anon, authenticated;
grant select on table public.personals, public.skills, public.journeys, public.projects,
  public.project_tags, public.certificates, public.experiences, public.contacts to anon, authenticated;
grant insert, update, delete on table public.personals, public.skills, public.journeys,
  public.projects, public.project_tags, public.certificates, public.experiences, public.contacts to authenticated;
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
    execute format('drop policy if exists "authenticated users manage %1$s" on public.%1$I', portfolio_table);
    execute format(
      'create policy "authenticated users manage %1$s" on public.%1$I for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null)',
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
drop policy if exists "portfolio admins update files" on storage.objects;
drop policy if exists "portfolio admins delete files" on storage.objects;
drop policy if exists "authenticated users upload portfolio files" on storage.objects;
drop policy if exists "authenticated users update portfolio files" on storage.objects;
drop policy if exists "authenticated users delete portfolio files" on storage.objects;

create policy "authenticated users upload portfolio files"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio' and auth.uid() is not null);

create policy "authenticated users update portfolio files"
  on storage.objects for update to authenticated
  using (bucket_id = 'portfolio' and auth.uid() is not null)
  with check (bucket_id = 'portfolio' and auth.uid() is not null);

create policy "authenticated users delete portfolio files"
  on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio' and auth.uid() is not null);
