-- Run in Supabase SQL editor (Dashboard → SQL) for project myrpaonxszltnsnexafv
-- Creates a public-read lot image bucket. Writes go through the server using the service role.

insert into storage.buckets (id, name, public)
values ('lot-images', 'lot-images', true)
on conflict (id) do update set public = true;

-- Public read for gallery URLs
drop policy if exists "Public read lot images" on storage.objects;
create policy "Public read lot images"
on storage.objects for select
using (bucket_id = 'lot-images');

-- Authenticated users may upload into lots/ prefix (optional client uploads)
drop policy if exists "Auth upload lot images" on storage.objects;
create policy "Auth upload lot images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'lot-images' and (storage.foldername(name))[1] = 'lots');

-- Service role bypasses RLS; admin uploads use SUPABASE_SERVICE_ROLE_KEY on the server.
