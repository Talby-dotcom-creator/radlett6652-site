// src/utils/textHelpers.ts
export const stripHtml = (html: string): string => {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '').trim();
};
