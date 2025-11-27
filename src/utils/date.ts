// Simple UK date formatter used across the app
export function formatDateUK(
  input: string | Date | null | undefined,
  opts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" }
): string {
  if (!input) return "";
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", opts);
}

