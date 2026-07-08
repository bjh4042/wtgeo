
-- Restrict all client access to storage.objects for the private 'app-images' bucket.
-- Reads and writes go through the admin-action edge function (service_role), which bypasses RLS.
CREATE POLICY "app-images: block anon/auth select"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'app-images' AND false);

CREATE POLICY "app-images: block anon/auth insert"
  ON storage.objects FOR INSERT
  TO anon, authenticated
  WITH CHECK (bucket_id = 'app-images' AND false);

CREATE POLICY "app-images: block anon/auth update"
  ON storage.objects FOR UPDATE
  TO anon, authenticated
  USING (bucket_id = 'app-images' AND false)
  WITH CHECK (bucket_id = 'app-images' AND false);

CREATE POLICY "app-images: block anon/auth delete"
  ON storage.objects FOR DELETE
  TO anon, authenticated
  USING (bucket_id = 'app-images' AND false);
