// Edge function: send admin email on new candidature
// Triggered by a Postgres trigger via pg_net on INSERT into public.candidatures

const ADMIN_EMAIL = "nathanmeunierpro@gmail.com";
const ADMIN_DASHBOARD_URL = "https://ravito-benevoles.fr/tableau-de-bord";
const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-secret",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const expectedSecret = Deno.env.get("CANDIDATURE_WEBHOOK_SECRET");
    const providedSecret = req.headers.get("x-webhook-secret");
    if (!expectedSecret || providedSecret !== expectedSecret) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Supabase DB webhook payload shape: { type, table, record, schema, old_record }
    const payload = await req.json();
    const record = payload.record ?? payload;
    const { prenom, nom, event_id, created_at } = record;

    // Fetch event title
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    let missionTitle = "(mission inconnue)";
    if (event_id) {
      const r = await fetch(
        `${supabaseUrl}/rest/v1/events?id=eq.${event_id}&select=nom`,
        { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } },
      );
      if (r.ok) {
        const rows = await r.json();
        if (rows[0]?.nom) missionTitle = rows[0].nom;
      }
    }

    const dateApp = new Date(created_at ?? Date.now()).toLocaleString("fr-FR", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "Europe/Paris",
    });

    const subject = `Nouvelle candidature — ${prenom} ${nom} sur ${missionTitle}`;
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#111">
        <h2 style="margin:0 0 16px">Nouvelle candidature reçue</h2>
        <p><strong>Bénévole :</strong> ${prenom} ${nom}</p>
        <p><strong>Mission :</strong> ${missionTitle}</p>
        <p><strong>Date de candidature :</strong> ${dateApp}</p>
        <p style="margin-top:24px">
          <a href="${ADMIN_DASHBOARD_URL}"
             style="background:#16a34a;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;display:inline-block">
            Ouvrir le tableau de bord
          </a>
        </p>
      </div>`;

    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!lovableKey || !resendKey) {
      return new Response(JSON.stringify({ error: "missing email keys" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const res = await fetch(`${GATEWAY_URL}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": resendKey,
      },
      body: JSON.stringify({
        from: "Ravito Bénévoles <onboarding@resend.dev>",
        to: [ADMIN_EMAIL],
        subject,
        html,
      }),
    });

    const body = await res.text();
    if (!res.ok) {
      console.error("Resend error", res.status, body);
      return new Response(JSON.stringify({ error: "send failed", status: res.status, body }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
