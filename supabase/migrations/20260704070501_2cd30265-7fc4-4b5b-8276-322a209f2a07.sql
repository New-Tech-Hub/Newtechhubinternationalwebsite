
-- Analytics tables

CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  path text NOT NULL,
  referrer text,
  user_agent text,
  device_type text,
  browser text,
  country text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.page_views TO anon, authenticated;
GRANT ALL ON public.page_views TO service_role;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert page views" ON public.page_views
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view page views" ON public.page_views
  FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_page_views_created_at ON public.page_views(created_at DESC);
CREATE INDEX idx_page_views_session ON public.page_views(session_id);
CREATE INDEX idx_page_views_user ON public.page_views(user_id);


CREATE TABLE public.activity_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type text NOT NULL,
  event_category text,
  event_label text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.activity_events TO anon, authenticated;
GRANT ALL ON public.activity_events TO service_role;
ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert activity events" ON public.activity_events
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view activity events" ON public.activity_events
  FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_activity_events_created_at ON public.activity_events(created_at DESC);
CREATE INDEX idx_activity_events_user ON public.activity_events(user_id);
CREATE INDEX idx_activity_events_type ON public.activity_events(event_type);
