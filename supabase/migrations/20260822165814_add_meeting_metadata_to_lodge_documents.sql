begin;

alter table public.lodge_documents
  add column if not exists meeting_date date,
  add column if not exists meeting_number integer;

alter table public.lodge_documents
  drop constraint if exists lodge_documents_meeting_number_positive,
  add constraint lodge_documents_meeting_number_positive
    check (meeting_number is null or meeting_number > 0);

create index if not exists lodge_documents_meeting_date_idx
  on public.lodge_documents (meeting_date desc)
  where meeting_date is not null;

comment on column public.lodge_documents.meeting_date is
  'Date on which a Lodge meeting took place; distinct from upload and document dates.';
comment on column public.lodge_documents.meeting_number is
  'Printed or approved sequential number of the Lodge meeting.';

commit;
