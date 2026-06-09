-- Tighten candidatures insert: must be a registered bénévole
DROP POLICY IF EXISTS candidatures_insert_benevole ON public.candidatures;
CREATE POLICY candidatures_insert_benevole ON public.candidatures
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = benevole_id
    AND EXISTS (SELECT 1 FROM public.benevoles b WHERE b.id = auth.uid())
  );

-- Tighten avis insert: must have an accepted candidature linking reviewer and reviewee on this event
DROP POLICY IF EXISTS avis_insert_own ON public.avis;
CREATE POLICY avis_insert_own ON public.avis
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = from_user
    AND (
      -- Bénévole reviewing organisateur: candidature accepted by the organiser of this event
      EXISTS (
        SELECT 1 FROM public.candidatures c
        JOIN public.events e ON e.id = c.event_id
        WHERE c.event_id = avis.event_id
          AND c.benevole_id = auth.uid()
          AND e.user_id = avis.to_user
          AND c.statut = 'acceptee'
      )
      OR
      -- Organisateur reviewing bénévole: candidature accepted on their event for this bénévole
      EXISTS (
        SELECT 1 FROM public.candidatures c
        JOIN public.events e ON e.id = c.event_id
        WHERE c.event_id = avis.event_id
          AND e.user_id = auth.uid()
          AND c.benevole_id = avis.to_user
          AND c.statut = 'acceptee'
      )
    )
  );