-- Adds a dedicated column to store the PDF URL for meeting minutes
-- Safe to run multiple times (IF NOT EXISTS guard)

alter table if exists public.meeting_minutes
  add column if not exists document_url text;

-- Optional backfill: if historic rows stored a URL in `content`, copy it
-- Heuristics: starts with http(s):// or looks like a storage path
update public.meeting_minutes
   set document_url = content
 where document_url is null
   and (content ~ '^(https?://|/storage/|https?://[^\s]+\.(pdf|docx?|rtf))');

-- NOTE: If Row Level Security (RLS) is enabled, make sure your INSERT/UPDATE
-- policy allows writing `document_url` (usually covered by using *), e.g.:
-- create policy "Allow insert for authenticated" on public.meeting_minutes
-- for insert to authenticated using (true) with check (true);
-- create policy "Allow update for authenticated" on public.meeting_minutes
-- for update to authenticated using (true) with check (true);

