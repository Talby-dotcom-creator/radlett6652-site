-- Allow public read access to published/active content on public-facing pages

-- Events: allow anyone to read events marked public
CREATE POLICY "Public can view published events"
  ON public.events
  FOR SELECT
  TO public
  USING (coalesce(is_public, true));

-- Blog posts (news/pillars): allow anyone to read published + public posts
CREATE POLICY "Public can view published blog posts"
  ON public.blog_posts
  FOR SELECT
  TO public
  USING ((is_published IS TRUE) AND coalesce(is_public, true));

-- Snippets: allow anyone to read active snippets
CREATE POLICY "Public can view active snippets"
  ON public.snippets
  FOR SELECT
  TO public
  USING (is_active IS TRUE);
