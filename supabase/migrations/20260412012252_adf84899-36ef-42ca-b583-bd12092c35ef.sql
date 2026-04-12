
CREATE TABLE public.error_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id TEXT NOT NULL,
  place_name TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.error_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read error_reports" ON public.error_reports FOR SELECT USING (true);
CREATE POLICY "Public insert error_reports" ON public.error_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update error_reports" ON public.error_reports FOR UPDATE USING (true);
CREATE POLICY "Public delete error_reports" ON public.error_reports FOR DELETE USING (true);
