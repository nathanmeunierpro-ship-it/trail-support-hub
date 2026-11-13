-- Ravito : une annonce ne peut être mise en ligne (statut 'actif') qu'après paiement.
-- Seul le serveur (clé service_role, utilisée par le webhook Stripe) peut passer
-- une annonce en 'actif'. Un organisateur connecté ne peut ni créer directement
-- une annonce 'actif', ni repasser lui-même son annonce en 'actif'.
--
-- ⚠️ À appliquer UNIQUEMENT une fois SUPABASE_SERVICE_ROLE_KEY ajoutée sur Vercel,
-- sinon les nouvelles annonces resteraient en attente sans pouvoir être activées.

CREATE OR REPLACE FUNCTION public.events_enforce_payment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  -- Serveur / administrateurs : aucune restriction.
  IF coalesce(auth.role(), '') = 'service_role'
     OR current_user NOT IN ('authenticated', 'anon') THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.statut := 'en_attente_paiement';
    RETURN NEW;
  END IF;

  -- UPDATE : impossible de (re)passer soi-même une annonce en 'actif'.
  IF NEW.statut = 'actif' AND OLD.statut IS DISTINCT FROM 'actif' THEN
    NEW.statut := OLD.statut;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS events_enforce_payment ON public.events;
CREATE TRIGGER events_enforce_payment
BEFORE INSERT OR UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION public.events_enforce_payment();
