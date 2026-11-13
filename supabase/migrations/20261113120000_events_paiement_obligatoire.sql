-- Ravito : une annonce ne peut être mise en ligne (statut 'actif') qu'après paiement.
-- 1) Verrou : un organisateur ne peut ni créer une annonce directement 'actif',
--    ni repasser lui-même son annonce en 'actif'.
-- 2) Porte sécurisée : la fonction activate_paid_event(), appelée par le webhook
--    Stripe du site avec un jeton secret, met l'annonce en ligne après paiement.

CREATE OR REPLACE FUNCTION public.events_enforce_payment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF coalesce(auth.role(), '') = 'service_role'
     OR current_user NOT IN ('authenticated', 'anon') THEN
    RETURN NEW;
  END IF;
  IF TG_OP = 'INSERT' THEN
    NEW.statut := 'en_attente_paiement';
    RETURN NEW;
  END IF;
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

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Mise en ligne après paiement (jeton vérifié par empreinte SHA-256).
CREATE OR REPLACE FUNCTION public.activate_paid_event(p_event_id uuid, p_token text)
RETURNS TABLE (id uuid, nom text, email_contact text, activated boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
#variable_conflict use_column
BEGIN
  IF encode(extensions.digest(p_token, 'sha256'), 'hex') <> '6a202785e3201b8266106fa5824f38acaa44cf26508a0c2eeab737ea4373e0aa' THEN
    RAISE EXCEPTION 'unauthorized' USING ERRCODE = '42501';
  END IF;
  RETURN QUERY
  UPDATE public.events e
     SET statut = 'actif'
   WHERE e.id = p_event_id AND e.statut = 'en_attente_paiement'
  RETURNING e.id, e.nom, e.email_contact, true;
  IF NOT FOUND THEN
    RETURN QUERY SELECT e.id, e.nom, e.email_contact, false FROM public.events e WHERE e.id = p_event_id;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.activate_paid_event(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.activate_paid_event(uuid, text) TO anon, authenticated;
