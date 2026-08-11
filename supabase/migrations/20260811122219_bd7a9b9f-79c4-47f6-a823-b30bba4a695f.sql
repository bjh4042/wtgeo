CREATE TABLE public.place_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  category text NOT NULL,
  phone text,
  description text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.place_requests TO service_role;

ALTER TABLE public.place_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No public access to place_requests"
ON public.place_requests
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE OR REPLACE FUNCTION public.update_place_requests_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_place_requests_updated_at
BEFORE UPDATE ON public.place_requests
FOR EACH ROW EXECUTE FUNCTION public.update_place_requests_updated_at();

CREATE INDEX idx_place_requests_created_at ON public.place_requests (created_at DESC);
CREATE UNIQUE INDEX idx_place_requests_pending_dup ON public.place_requests (lower(btrim(name)), lower(btrim(address))) WHERE status = 'pending';