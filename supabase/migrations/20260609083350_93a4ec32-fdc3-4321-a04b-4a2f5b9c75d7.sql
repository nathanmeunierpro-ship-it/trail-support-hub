
-- Add missing columns to candidatures so bénévole applications don't fail
ALTER TABLE public.candidatures
  ADD COLUMN IF NOT EXISTS telephone text,
  ADD COLUMN IF NOT EXISTS transport text,
  ADD COLUMN IF NOT EXISTS niveau text,
  ADD COLUMN IF NOT EXISTS message_perso text;

-- Add photo column to events
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS photo_url text;

-- Recreate the public view to include photo_url
DROP VIEW IF EXISTS public.events_public;
CREATE VIEW public.events_public
WITH (security_invoker = off)
AS
SELECT id, user_id, nom, type_sport, date, ville, region,
       nb_benevoles, missions, description, photo_url, statut, created_at
FROM public.events
WHERE statut = 'actif';

GRANT SELECT ON public.events_public TO anon, authenticated;

-- Storage policies for event-images bucket (bucket created via tool)
DROP POLICY IF EXISTS "event_images_public_read" ON storage.objects;
DROP POLICY IF EXISTS "event_images_insert_own" ON storage.objects;
DROP POLICY IF EXISTS "event_images_update_own" ON storage.objects;
DROP POLICY IF EXISTS "event_images_delete_own" ON storage.objects;

CREATE POLICY "event_images_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'event-images');

CREATE POLICY "event_images_insert_own" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'event-images' AND (storage.foldername(name))[1] = (auth.uid())::text);

CREATE POLICY "event_images_update_own" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'event-images' AND (storage.foldername(name))[1] = (auth.uid())::text);

CREATE POLICY "event_images_delete_own" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'event-images' AND (storage.foldername(name))[1] = (auth.uid())::text);
