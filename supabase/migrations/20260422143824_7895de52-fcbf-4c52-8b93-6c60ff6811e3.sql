-- Create public bucket for app images
INSERT INTO storage.buckets (id, name, public)
VALUES ('app-images', 'app-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Public read policy
CREATE POLICY "Public read app-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'app-images');

-- Public insert policy
CREATE POLICY "Public insert app-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'app-images');

-- Public update policy
CREATE POLICY "Public update app-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'app-images');

-- Public delete policy
CREATE POLICY "Public delete app-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'app-images');