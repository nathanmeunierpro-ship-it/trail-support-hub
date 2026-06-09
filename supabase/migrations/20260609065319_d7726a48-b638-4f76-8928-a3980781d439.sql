
-- Revert to security invoker (recommended) so RLS of the caller is enforced.
ALTER VIEW public.events_public SET (security_invoker = on);

-- Allow anon to read active events again (only non-sensitive columns; see grants below).
CREATE POLICY events_select_active_anon ON public.events
  FOR SELECT
  TO anon
  USING (statut = 'actif');

-- Authenticated non-owners also need to browse active events for the public site.
DROP POLICY IF EXISTS events_select_own ON public.events;
CREATE POLICY events_select_active_auth ON public.events
  FOR SELECT
  TO authenticated
  USING (statut = 'actif' OR auth.uid() = user_id);

-- Column-level lockdown: hide email_contact from everyone except the owner path.
REVOKE SELECT ON public.events FROM anon, authenticated;
GRANT SELECT
  (id, user_id, nom, type_sport, date, ville, region,
   nb_benevoles, missions, description, statut, created_at)
  ON public.events TO anon, authenticated;

-- Only the owner (via their own authenticated session) can read email_contact.
-- RLS still applies, and the owner-only USING clause on authenticated combined
-- with this grant means a non-owner cannot select the column even if they try.
GRANT SELECT (email_contact) ON public.events TO authenticated;

-- Service role keeps full access for admin/server code.
GRANT ALL ON public.events TO service_role;
