
-- Place edits (modifications to default places)
CREATE TABLE public.place_edits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id TEXT NOT NULL UNIQUE,
  name TEXT,
  description TEXT,
  address TEXT,
  lat NUMERIC,
  lng NUMERIC,
  category TEXT,
  image_url TEXT,
  origin TEXT,
  reference_url TEXT,
  youtube_url TEXT,
  sub_category TEXT,
  grade TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.place_edits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read place_edits" ON public.place_edits FOR SELECT USING (true);
CREATE POLICY "Public insert place_edits" ON public.place_edits FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update place_edits" ON public.place_edits FOR UPDATE USING (true);

-- Custom places (admin-added new places)
CREATE TABLE public.custom_places (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  place_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  lat NUMERIC NOT NULL,
  lng NUMERIC NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  origin TEXT,
  reference_url TEXT,
  youtube_url TEXT,
  sub_category TEXT,
  grade TEXT DEFAULT 'all',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.custom_places ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read custom_places" ON public.custom_places FOR SELECT USING (true);
CREATE POLICY "Public insert custom_places" ON public.custom_places FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update custom_places" ON public.custom_places FOR UPDATE USING (true);
CREATE POLICY "Public delete custom_places" ON public.custom_places FOR DELETE USING (true);

-- Content edits
CREATE TABLE public.content_edits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id TEXT NOT NULL UNIQUE,
  name TEXT,
  description TEXT,
  lat NUMERIC,
  lng NUMERIC,
  content_type TEXT,
  icon TEXT,
  image_url TEXT,
  source TEXT,
  reference_url TEXT,
  youtube_url TEXT,
  grade TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.content_edits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read content_edits" ON public.content_edits FOR SELECT USING (true);
CREATE POLICY "Public insert content_edits" ON public.content_edits FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update content_edits" ON public.content_edits FOR UPDATE USING (true);

-- Custom content
CREATE TABLE public.custom_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  lat NUMERIC NOT NULL,
  lng NUMERIC NOT NULL,
  content_type TEXT NOT NULL,
  icon TEXT DEFAULT '📍',
  image_url TEXT,
  source TEXT,
  reference_url TEXT,
  youtube_url TEXT,
  grade TEXT DEFAULT 'all',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.custom_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read custom_content" ON public.custom_content FOR SELECT USING (true);
CREATE POLICY "Public insert custom_content" ON public.custom_content FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update custom_content" ON public.custom_content FOR UPDATE USING (true);
CREATE POLICY "Public delete custom_content" ON public.custom_content FOR DELETE USING (true);

-- School edits
CREATE TABLE public.school_edits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_index INTEGER NOT NULL UNIQUE,
  name TEXT,
  address TEXT,
  lat NUMERIC,
  lng NUMERIC,
  phone TEXT,
  district TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.school_edits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read school_edits" ON public.school_edits FOR SELECT USING (true);
CREATE POLICY "Public insert school_edits" ON public.school_edits FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update school_edits" ON public.school_edits FOR UPDATE USING (true);

-- Site settings (notice, site info, visitor count)
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public insert site_settings" ON public.site_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update site_settings" ON public.site_settings FOR UPDATE USING (true);
