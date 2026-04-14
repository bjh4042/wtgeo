
-- Atomic increment function for visitor stats
CREATE OR REPLACE FUNCTION public.increment_visitor()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _today TEXT;
  _hour_key TEXT;
  _hourly JSONB;
  _daily JSONB;
  _hour_count INT;
  _day_count INT;
BEGIN
  _today := to_char(now() AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD');
  _hour_key := to_char(now() AT TIME ZONE 'Asia/Seoul', 'YYYY-MM-DD-HH24');

  -- Atomic hourly update
  SELECT value INTO _hourly FROM site_settings WHERE key = 'visitor_hourly' FOR UPDATE;
  IF _hourly IS NULL THEN
    INSERT INTO site_settings (key, value) VALUES ('visitor_hourly', jsonb_build_object(_hour_key, 1))
    ON CONFLICT (key) DO UPDATE SET value = jsonb_build_object(_hour_key, 1), updated_at = now();
  ELSE
    _hour_count := COALESCE((_hourly->>_hour_key)::int, 0) + 1;
    -- Prune keys older than 7 days (keep max 168 entries)
    UPDATE site_settings 
    SET value = (
      SELECT jsonb_object_agg(k, v)
      FROM (
        SELECT k, v FROM jsonb_each(_hourly || jsonb_build_object(_hour_key, _hour_count)) AS x(k, v)
        ORDER BY k DESC LIMIT 168
      ) sub
    ), updated_at = now()
    WHERE key = 'visitor_hourly';
  END IF;

  -- Atomic daily update
  SELECT value INTO _daily FROM site_settings WHERE key = 'visitor_daily' FOR UPDATE;
  IF _daily IS NULL THEN
    INSERT INTO site_settings (key, value) VALUES ('visitor_daily', jsonb_build_object(_today, 1))
    ON CONFLICT (key) DO UPDATE SET value = jsonb_build_object(_today, 1), updated_at = now();
  ELSE
    _day_count := COALESCE((_daily->>_today)::int, 0) + 1;
    UPDATE site_settings
    SET value = (
      SELECT jsonb_object_agg(k, v)
      FROM (
        SELECT k, v FROM jsonb_each(_daily || jsonb_build_object(_today, _day_count)) AS x(k, v)
        ORDER BY k DESC LIMIT 30
      ) sub
    ), updated_at = now()
    WHERE key = 'visitor_daily';
  END IF;

  -- Update total
  UPDATE site_settings 
  SET value = to_jsonb(COALESCE((value)::int, 0) + 1), updated_at = now()
  WHERE key = 'visitor_count';
  IF NOT FOUND THEN
    INSERT INTO site_settings (key, value) VALUES ('visitor_count', '1'::jsonb);
  END IF;

  -- Update today count
  INSERT INTO site_settings (key, value) 
  VALUES ('visitor_today', jsonb_build_object('date', _today, 'count', 1))
  ON CONFLICT (key) DO UPDATE SET 
    value = CASE 
      WHEN site_settings.value->>'date' = _today 
      THEN jsonb_build_object('date', _today, 'count', COALESCE((site_settings.value->>'count')::int, 0) + 1)
      ELSE jsonb_build_object('date', _today, 'count', 1)
    END,
    updated_at = now();
END;
$$;

-- Add unique constraint on key if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'site_settings_key_key'
  ) THEN
    ALTER TABLE site_settings ADD CONSTRAINT site_settings_key_key UNIQUE (key);
  END IF;
END $$;
