
DROP FUNCTION IF EXISTS public.admin_export_organisateurs();
DROP FUNCTION IF EXISTS public.admin_export_benevoles();

CREATE OR REPLACE FUNCTION public.admin_export_organisateurs()
RETURNS TABLE (
  id uuid,
  nom_organisation text,
  type_organisation text,
  departement text,
  site_web text,
  email text,
  created_at timestamptz
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Forbidden: admin role required';
  END IF;
  RETURN QUERY
  SELECT o.id, o.nom_organisation, o.type_organisation, o.departement, o.site_web,
         u.email::text, o.created_at
  FROM public.organisateurs o
  LEFT JOIN auth.users u ON u.id = o.id;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_export_organisateurs() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_export_organisateurs() TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_export_benevoles()
RETURNS TABLE (
  id uuid,
  prenom text,
  nom text,
  email text,
  phone text,
  departement text,
  region text,
  niveau_trail text,
  sports_pratiques text[],
  disponibilites text[],
  dispo_text text,
  bio text,
  avatar_url text,
  created_at timestamptz
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Forbidden: admin role required';
  END IF;
  RETURN QUERY
  SELECT b.id, b.prenom, b.nom, u.email::text, b.phone, b.departement, b.region,
         b.niveau_trail, b.sports_pratiques, b.disponibilites, b.dispo_text,
         b.bio, b.avatar_url, b.created_at
  FROM public.benevoles b
  LEFT JOIN auth.users u ON u.id = b.id;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_export_benevoles() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_export_benevoles() TO authenticated;
