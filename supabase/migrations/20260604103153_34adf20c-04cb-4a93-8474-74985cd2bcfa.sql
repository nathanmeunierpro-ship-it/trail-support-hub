
-- Profils bénévoles
CREATE TABLE public.benevoles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  prenom text,
  nom text,
  departement text,
  niveau_trail text,
  disponibilites text[],
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.benevoles TO authenticated;
GRANT ALL ON public.benevoles TO service_role;
ALTER TABLE public.benevoles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "benevoles_select_own" ON public.benevoles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "benevoles_insert_own" ON public.benevoles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "benevoles_update_own" ON public.benevoles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Profils organisateurs
CREATE TABLE public.organisateurs (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nom_organisation text,
  type_organisation text,
  departement text,
  site_web text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.organisateurs TO authenticated;
GRANT ALL ON public.organisateurs TO service_role;
ALTER TABLE public.organisateurs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "organisateurs_select_own" ON public.organisateurs FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "organisateurs_insert_own" ON public.organisateurs FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "organisateurs_update_own" ON public.organisateurs FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Events
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nom text NOT NULL,
  type_sport text NOT NULL,
  date date NOT NULL,
  ville text NOT NULL,
  region text NOT NULL,
  nb_benevoles integer NOT NULL,
  missions text[],
  description text,
  email_contact text NOT NULL,
  statut text NOT NULL DEFAULT 'actif',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Lecture publique des events actifs (incluant email_contact ; on créera une vue publique sans email)
CREATE POLICY "events_select_active_auth" ON public.events FOR SELECT TO authenticated USING (statut = 'actif' OR auth.uid() = user_id);
CREATE POLICY "events_insert_own" ON public.events FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "events_update_own" ON public.events FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "events_delete_own" ON public.events FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Vue publique sans email_contact pour rôle anon
CREATE VIEW public.events_public WITH (security_invoker=on) AS
  SELECT id, user_id, nom, type_sport, date, ville, region, nb_benevoles, missions, description, statut, created_at
  FROM public.events
  WHERE statut = 'actif';

GRANT SELECT ON public.events_public TO anon, authenticated;
-- Accès anon en lecture sur events actifs via policy dédiée
CREATE POLICY "events_select_active_anon" ON public.events FOR SELECT TO anon USING (statut = 'actif');

-- Candidatures
CREATE TABLE public.candidatures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  benevole_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prenom text NOT NULL,
  nom text NOT NULL,
  email text NOT NULL,
  mission_souhaitee text,
  disponibilite boolean NOT NULL DEFAULT true,
  experience text,
  statut text NOT NULL DEFAULT 'en_attente',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, benevole_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.candidatures TO authenticated;
GRANT ALL ON public.candidatures TO service_role;
ALTER TABLE public.candidatures ENABLE ROW LEVEL SECURITY;

-- Un bénévole voit ses propres candidatures
CREATE POLICY "candidatures_select_benevole" ON public.candidatures FOR SELECT TO authenticated
  USING (auth.uid() = benevole_id);
-- Un organisateur voit les candidatures de ses propres events
CREATE POLICY "candidatures_select_organisateur" ON public.candidatures FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.user_id = auth.uid()));
-- Un bénévole crée sa propre candidature
CREATE POLICY "candidatures_insert_benevole" ON public.candidatures FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = benevole_id);
-- L'organisateur du event met à jour le statut
CREATE POLICY "candidatures_update_organisateur" ON public.candidatures FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.events e WHERE e.id = event_id AND e.user_id = auth.uid()));
-- Bénévole peut supprimer sa candidature
CREATE POLICY "candidatures_delete_benevole" ON public.candidatures FOR DELETE TO authenticated
  USING (auth.uid() = benevole_id);
