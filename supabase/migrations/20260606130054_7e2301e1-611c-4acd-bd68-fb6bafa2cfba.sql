
ALTER TABLE public.benevoles
  ADD COLUMN IF NOT EXISTS region TEXT,
  ADD COLUMN IF NOT EXISTS sports_pratiques TEXT[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS dispo_text TEXT;

CREATE TABLE IF NOT EXISTS public.favoris (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  benevole_id UUID NOT NULL,
  event_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (benevole_id, event_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.favoris TO authenticated;
GRANT ALL ON public.favoris TO service_role;
ALTER TABLE public.favoris ENABLE ROW LEVEL SECURITY;
CREATE POLICY "favoris_select_own" ON public.favoris FOR SELECT TO authenticated USING (auth.uid() = benevole_id);
CREATE POLICY "favoris_insert_own" ON public.favoris FOR INSERT TO authenticated WITH CHECK (auth.uid() = benevole_id);
CREATE POLICY "favoris_delete_own" ON public.favoris FOR DELETE TO authenticated USING (auth.uid() = benevole_id);

CREATE TABLE IF NOT EXISTS public.avis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user UUID NOT NULL,
  to_user UUID NOT NULL,
  event_id UUID NOT NULL,
  note INTEGER NOT NULL CHECK (note >= 1 AND note <= 5),
  commentaire TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (from_user, to_user, event_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.avis TO authenticated;
GRANT ALL ON public.avis TO service_role;
ALTER TABLE public.avis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "avis_select_auth" ON public.avis FOR SELECT TO authenticated USING (true);
CREATE POLICY "avis_insert_own" ON public.avis FOR INSERT TO authenticated WITH CHECK (auth.uid() = from_user);
CREATE POLICY "avis_update_own" ON public.avis FOR UPDATE TO authenticated USING (auth.uid() = from_user);
CREATE POLICY "avis_delete_own" ON public.avis FOR DELETE TO authenticated USING (auth.uid() = from_user);
