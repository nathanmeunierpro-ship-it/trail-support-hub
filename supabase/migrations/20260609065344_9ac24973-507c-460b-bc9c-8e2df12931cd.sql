
-- Owner-only direct access to events (authenticated). Anon has no direct access.
DROP POLICY IF EXISTS events_select_active_auth ON public.events;
DROP POLICY IF EXISTS events_select_active_anon ON public.events;

CREATE POLICY events_select_own ON public.events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Make events_public the only public window: bypass RLS, expose safe columns of active events only.
ALTER VIEW public.events_public SET (security_invoker = off);
GRANT SELECT ON public.events_public TO anon, authenticated;

-- Restore full column SELECT for owner code paths (select * patterns) and service role.
REVOKE SELECT ON public.events FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
