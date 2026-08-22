begin;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'member-documents',
  'member-documents',
  false,
  15728640,
  array['application/pdf']::text[]
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

alter table public.lodge_documents
  add column if not exists storage_path text;

drop policy if exists "Active members can read member documents" on storage.objects;
create policy "Active members can read member documents"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'member-documents'
  and exists (
    select 1
    from public.member_profiles profile
    where profile.user_id = (select auth.uid())
      and profile.status = 'active'
  )
);

drop policy if exists "Admins can upload member documents" on storage.objects;
create policy "Admins can upload member documents"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'member-documents'
  and public.is_admin()
);

drop policy if exists "Admins can update member documents" on storage.objects;
create policy "Admins can update member documents"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'member-documents'
  and public.is_admin()
)
with check (
  bucket_id = 'member-documents'
  and public.is_admin()
);

drop policy if exists "Admins can delete member documents" on storage.objects;
create policy "Admins can delete member documents"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'member-documents'
  and public.is_admin()
);

create index if not exists lodge_documents_storage_path_idx
  on public.lodge_documents (storage_path)
  where storage_path is not null;

comment on column public.lodge_documents.storage_path is
  'Object path in the private member-documents bucket; resolved to a short-lived signed URL for authenticated members.';

commit;
