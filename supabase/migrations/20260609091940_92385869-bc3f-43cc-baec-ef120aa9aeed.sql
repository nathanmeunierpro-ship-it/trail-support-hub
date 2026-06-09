-- Grant Data API access to public tables (was missing, blocking favoris insert/delete and other writes)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.favoris TO authenticated;
GRANT ALL ON public.favoris TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.candidatures TO authenticated;
GRANT ALL ON public.candidatures TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT SELECT ON public.events TO anon;
GRANT ALL ON public.events TO service_role;

GRANT SELECT ON public.events_public TO anon, authenticated;
GRANT ALL ON public.events_public TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.benevoles TO authenticated;
GRANT ALL ON public.benevoles TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.organisateurs TO authenticated;
GRANT ALL ON public.organisateurs TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.avis TO authenticated;
GRANT SELECT ON public.avis TO anon;
GRANT ALL ON public.avis TO service_role;