import { createFileRoute } from "@tanstack/react-router";

/**
 * Webhook Stripe : quand le Pack Organisateur est payé, l'annonce liée
 * (client_reference_id) passe de "en_attente_paiement" à "actif".
 */

const TOLERANCE_S = 300;

async function hmacHex(secret: string, payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

async function verify(raw: string, header: string | null, secret: string) {
  if (!header) return false;
  const parts = Object.fromEntries(
    header.split(",").map((kv) => {
      const i = kv.indexOf("=");
      return [kv.slice(0, i), kv.slice(i + 1)];
    }),
  );
  const t = Number(parts.t);
  if (!t || Math.abs(Date.now() / 1000 - t) > TOLERANCE_S) return false;
  const v1s = header
    .split(",")
    .filter((kv) => kv.startsWith("v1="))
    .map((kv) => kv.slice(3));
  const expected = await hmacHex(secret, `${t}.${raw}`);
  return v1s.some((v) => safeEqual(v, expected));
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const Route = createFileRoute("/api/public/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.STRIPE_WEBHOOK_SECRET;
        if (!secret) return new Response("not configured", { status: 503 });

        const raw = await request.text();
        if (!(await verify(raw, request.headers.get("stripe-signature"), secret))) {
          return new Response("bad signature", { status: 400 });
        }

        const { STRIPE_PAYMENT_LINK_ID, STATUT_ATTENTE_PAIEMENT } = await import("@/lib/site");
        const event = JSON.parse(raw) as {
          type: string;
          data: {
            object: {
              payment_link?: string | null;
              payment_status?: string;
              client_reference_id?: string | null;
              customer_details?: { email?: string | null; name?: string | null } | null;
              custom_fields?: { key: string; text?: { value?: string | null } | null }[];
              amount_total?: number | null;
            };
          };
        };
        if (event.type !== "checkout.session.completed") return Response.json({ ignored: true });
        const s = event.data.object;
        // Ce compte Stripe sert aussi à TroctonVin : on ne traite que le lien Ravito.
        if (s.payment_link !== STRIPE_PAYMENT_LINK_ID) return Response.json({ ignored: true });
        if (s.payment_status !== "paid") return Response.json({ ignored: "unpaid" });
        const eventId = s.client_reference_id;
        const nomCourse = s.custom_fields?.find((f) => f.key === "nomcourse")?.text?.value ?? "";

        // Paiement non relié à une annonce : on prévient l'admin pour faire le lien à la main.
        const alertAdmin = async (raison: string) => {
          const m = await import("@/lib/mailer.server");
          await m.sendMail({
            to: m.ADMIN_EMAIL,
            replyTo: s.customer_details?.email ?? undefined,
            subject: `[Ravito] Paiement à rattacher : ${nomCourse || "course inconnue"}`,
            html: m.layout(
              "Paiement reçu sans annonce reliée",
              `<p>${m.esc(raison)}</p>${m.table({
                "Nom de la course (saisi)": nomCourse,
                Client: s.customer_details?.name,
                Email: s.customer_details?.email,
                Montant: s.amount_total != null ? `${(s.amount_total / 100).toFixed(2)} €` : "",
              })}<p>Retrouve l'annonce de cet organisateur et mets-la en ligne, ou réponds-lui directement à cet e-mail.</p>`,
            ),
          });
        };

        if (!eventId || !UUID.test(eventId)) {
          await alertAdmin("Le client a payé depuis un lien qui n'est relié à aucune annonce.");
          return Response.json({ ok: true, linked: false });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: ev, error } = await supabaseAdmin
          .from("events")
          .update({ statut: "actif" })
          .eq("id", eventId)
          .eq("statut", STATUT_ATTENTE_PAIEMENT)
          .select("id, nom, email_contact")
          .maybeSingle();
        if (error) {
          console.error("[stripe] activation impossible", error);
          return new Response("db error", { status: 500 }); // Stripe réessaiera
        }

        if (!ev) {
          // Déjà active (Stripe renvoie parfois deux fois) ou annonce introuvable.
          const { data: exists } = await supabaseAdmin
            .from("events")
            .select("statut")
            .eq("id", eventId)
            .maybeSingle();
          if (!exists) await alertAdmin(`Annonce ${eventId} introuvable (supprimée ?).`);
          return Response.json({ ok: true, activated: false });
        }

        if (ev.email_contact) {
          const m = await import("@/lib/mailer.server");
          await m.sendMail({
            to: ev.email_contact,
            subject: `Paiement reçu : ${ev.nom} est en ligne !`,
            html: m.layout(
              "Ta course est en ligne 🎉",
              `<p>Merci, ton paiement est bien reçu. <strong>${m.esc(ev.nom)}</strong> est maintenant visible par tous les bénévoles Ravito.</p>
               ${m.button("Voir mon annonce", m.siteUrl(`/annonce/${ev.id}`))}
               <p>Tu recevras un e-mail à chaque nouvelle candidature.</p>`,
            ),
          });
        }
        return Response.json({ ok: true, activated: true });
      },
    },
  },
});
