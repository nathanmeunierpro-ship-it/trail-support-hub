CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.notify_new_candidature()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  payload jsonb;
BEGIN
  payload := jsonb_build_object(
    'type', 'INSERT',
    'table', 'candidatures',
    'schema', 'public',
    'record', to_jsonb(NEW)
  );

  PERFORM net.http_post(
    url := 'https://xhtbflcuvsqxmbzvvtyh.supabase.co/functions/v1/notify-candidature',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := payload
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_candidature_created_notify_admin ON public.candidatures;
CREATE TRIGGER on_candidature_created_notify_admin
AFTER INSERT ON public.candidatures
FOR EACH ROW
EXECUTE FUNCTION public.notify_new_candidature();