
CREATE TABLE public.gyeongnam_edits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city_id TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  mascot_image_url TEXT,
  name TEXT,
  name_hanja TEXT,
  population INTEGER,
  area NUMERIC,
  mascot TEXT,
  mascot_emoji TEXT,
  official_site TEXT,
  name_origin TEXT,
  lat NUMERIC,
  lng NUMERIC,
  highlights TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gyeongnam_edits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read gyeongnam edits"
  ON public.gyeongnam_edits FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert gyeongnam edits"
  ON public.gyeongnam_edits FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update gyeongnam edits"
  ON public.gyeongnam_edits FOR UPDATE
  USING (true);
