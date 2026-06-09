
-- Switch events_public to run as its owner so anonymous and authenticated
-- users can read it even when the underlying events table denies them.
ALTER VIEW public.events_public SET (security_invoker = off);
GRANT SELECT ON public.events_public TO anon, authenticated;

-- Remove broad SELECT policies that exposed email_contact.
DROP POLICY IF EXISTS events_select_active_anon ON public.events;
DROP POLICY IF EXISTS events_select_active_auth ON public.events;

-- Only the owner can read the full events row (which includes email_contact).
CREATE POLICY events_select_own ON public.events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Revoke any direct table access from anon; they should only use events_public.
REVOKE SELECT ON public.events FROM anon;
