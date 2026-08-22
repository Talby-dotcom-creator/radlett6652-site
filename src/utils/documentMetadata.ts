import type { LodgeDocument } from "../types";

export const formatDocumentDate = (value?: string | null): string => {
  if (!value) return "Unknown";

  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);
  const date = new Date(dateOnly ? `${value}T12:00:00Z` : value);
  if (Number.isNaN(date.getTime())) return "Unknown";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  }).format(date);
};

export const getDocumentTimestamp = (doc: LodgeDocument): number => {
  const source =
    doc.meeting_date ?? doc.document_date ?? doc.created_at ?? doc.updated_at;
  if (!source) return 0;

  const timestamp = new Date(source).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

export const getMeetingMetadata = (
  doc: LodgeDocument
): string | null => {
  if (!doc.meeting_date && doc.meeting_number == null) return null;

  const parts: string[] = [];
  if (doc.meeting_number != null) parts.push(`Meeting ${doc.meeting_number}`);
  if (doc.meeting_date) parts.push(formatDocumentDate(doc.meeting_date));

  return parts.join(" — ");
};
