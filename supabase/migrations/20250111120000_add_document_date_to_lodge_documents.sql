-- Add document_date column to lodge_documents table
-- This allows documents to be sorted by their actual date rather than created_at

ALTER TABLE public.lodge_documents
ADD COLUMN IF NOT EXISTS document_date DATE;

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_lodge_documents_document_date 
ON public.lodge_documents(document_date DESC);

-- Add a comment explaining the column
COMMENT ON COLUMN public.lodge_documents.document_date IS 'The actual date of the document (for sorting), distinct from created_at which is when it was uploaded';
