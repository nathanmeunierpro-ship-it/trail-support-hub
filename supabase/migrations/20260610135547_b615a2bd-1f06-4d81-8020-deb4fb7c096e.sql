
-- Roles system
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users see their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage roles"
ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Secure function: admin-only export of organisateurs with email
CREATE OR REPLACE FUNCTION public.admin_export_organisateurs()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  nom text,
  type text,
  departement text,
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
  SELECT o.id, o.user_id, o.nom, o.type, o.departement,
         u.email::text, o.created_at
  FROM public.organisateurs o
  LEFT JOIN auth.users u ON u.id = o.user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_export_organisateurs() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_export_organisateurs() TO authenticated;

-- Same for benevoles
CREATE OR REPLACE FUNCTION public.admin_export_benevoles()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  email text,
  data jsonb,
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
  SELECT b.id, b.user_id, u.email::text, to_jsonb(b.*) - 'id' - 'user_id' AS data, b.created_at
  FROM public.benevoles b
  LEFT JOIN auth.users u ON u.id = b.user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_export_benevoles() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_export_benevoles() TO authenticated;
