
-- Tighten write access: remove public write policies on data tables. Writes go through admin edge function (service_role).

DROP POLICY IF EXISTS "Public insert content_edits" ON public.content_edits;
DROP POLICY IF EXISTS "Public update content_edits" ON public.content_edits;

DROP POLICY IF EXISTS "Public insert custom_content" ON public.custom_content;
DROP POLICY IF EXISTS "Public update custom_content" ON public.custom_content;
DROP POLICY IF EXISTS "Public delete custom_content" ON public.custom_content;

DROP POLICY IF EXISTS "Public insert custom_places" ON public.custom_places;
DROP POLICY IF EXISTS "Public update custom_places" ON public.custom_places;
DROP POLICY IF EXISTS "Public delete custom_places" ON public.custom_places;

-- error_reports: keep public insert (users submit), remove public update/delete
DROP POLICY IF EXISTS "Public update error_reports" ON public.error_reports;
DROP POLICY IF EXISTS "Public delete error_reports" ON public.error_reports;

DROP POLICY IF EXISTS "Anyone can insert gyeongnam edits" ON public.gyeongnam_edits;
DROP POLICY IF EXISTS "Anyone can update gyeongnam edits" ON public.gyeongnam_edits;

DROP POLICY IF EXISTS "Public insert place_edits" ON public.place_edits;
DROP POLICY IF EXISTS "Public update place_edits" ON public.place_edits;

DROP POLICY IF EXISTS "Public insert quiz_questions" ON public.quiz_questions;
DROP POLICY IF EXISTS "Public update quiz_questions" ON public.quiz_questions;
DROP POLICY IF EXISTS "Public delete quiz_questions" ON public.quiz_questions;

DROP POLICY IF EXISTS "Public insert school_edits" ON public.school_edits;
DROP POLICY IF EXISTS "Public update school_edits" ON public.school_edits;

DROP POLICY IF EXISTS "Public insert site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public update site_settings" ON public.site_settings;

-- Storage: app-images bucket. Bucket stays public (direct URL serving works without RLS).
-- Drop all object policies so listing & writes are denied; uploads go through admin edge function (service_role).
DROP POLICY IF EXISTS "Public insert app-images" ON storage.objects;
DROP POLICY IF EXISTS "Public update app-images" ON storage.objects;
DROP POLICY IF EXISTS "Public delete app-images" ON storage.objects;
DROP POLICY IF EXISTS "Public read app-images" ON storage.objects;

-- Lock down SECURITY DEFINER increment_visitor: only service_role may invoke (via edge function).
REVOKE EXECUTE ON FUNCTION public.increment_visitor() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.increment_visitor() FROM anon;
REVOKE EXECUTE ON FUNCTION public.increment_visitor() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.increment_visitor() TO service_role;

-- Strip developer email from publicly readable site_info row.
UPDATE public.site_settings
   SET value = (value::jsonb - 'devEmail')
 WHERE key = 'site_info'
   AND value ? 'devEmail';
