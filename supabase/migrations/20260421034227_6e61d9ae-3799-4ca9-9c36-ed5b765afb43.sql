ALTER TABLE public.content_edits
ADD COLUMN IF NOT EXISTS old_image_url text,
ADD COLUMN IF NOT EXISTS old_image_caption text;

ALTER TABLE public.custom_content
ADD COLUMN IF NOT EXISTS old_image_url text,
ADD COLUMN IF NOT EXISTS old_image_caption text;