import DOMPurify from "dompurify";

const ALLOWED_URI = /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i;

/** Sanitize CMS-authored markup immediately before it reaches the DOM. */
export const sanitizeHtml = (html: string | null | undefined): string =>
  DOMPurify.sanitize(html ?? "", {
    USE_PROFILES: { html: true },
    ALLOWED_URI_REGEXP: ALLOWED_URI,
  });
