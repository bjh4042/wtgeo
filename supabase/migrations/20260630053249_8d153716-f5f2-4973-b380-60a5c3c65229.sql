
DROP POLICY IF EXISTS "Public insert error_reports" ON public.error_reports;
CREATE POLICY "Public insert error_reports"
  ON public.error_reports
  FOR INSERT
  TO public
  WITH CHECK (
    is_read = false
    AND char_length(coalesce(message,'')) BETWEEN 1 AND 2000
    AND char_length(coalesce(place_id,'')) BETWEEN 1 AND 200
    AND char_length(coalesce(place_name,'')) BETWEEN 1 AND 200
  );
