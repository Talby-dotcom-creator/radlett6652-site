-- Create snippets table
CREATE TABLE IF NOT EXISTS public.snippets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text,
  summary text,
  author text,
  publish_date timestamptz DEFAULT now(),
  is_active boolean DEFAULT false,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.snippets ENABLE ROW LEVEL SECURITY;

-- Create policies for snippets
-- Public can view active snippets
CREATE POLICY "Anyone can view active snippets"
  ON public.snippets
  FOR SELECT
  USING (is_active = true);

-- Authenticated members can view all snippets
CREATE POLICY "Members can view all snippets"
  ON public.snippets
  FOR SELECT
  TO authenticated
  USING (true);

-- Only admins can insert snippets
CREATE POLICY "Admins can insert snippets"
  ON public.snippets
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.member_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can update snippets
CREATE POLICY "Admins can update snippets"
  ON public.snippets
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.member_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.member_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can delete snippets
CREATE POLICY "Admins can delete snippets"
  ON public.snippets
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.member_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create updated_at trigger
CREATE TRIGGER update_snippets_updated_at
  BEFORE UPDATE ON public.snippets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_snippets_active ON public.snippets(is_active);
CREATE INDEX IF NOT EXISTS idx_snippets_publish_date ON public.snippets(publish_date DESC);

-- Add comment to table
COMMENT ON TABLE public.snippets IS 'Snippets table for short reflections/quotes displayed on the homepage';
