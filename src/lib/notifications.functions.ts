import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * E-mails automatiques. Les destinataires sont toujours déterminés côté
 * serveur à partir de la base (jamais fournis par le navigateur), pour
 * qu'aucun utilisateur ne puisse se servir du site pour envoyer des mails
 * à n'importe qui.
 */

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  });

/** Un bénévole vient de postuler : mail à l'organisateur + confirmation au bénévole. */
export const notifyNewCandidature = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ eventId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const m = await import("./mailer.server");

    const { data: cand } = await supabaseAdmin
      .from("candidatures")
      .select("*")
      .eq("event_id", data.eventId)
      .eq("benevole_id", context.userId)
      .maybeSingle();
    if (!cand) return { ok: false };
    const { data: ev } = await supabaseAdmin
      .from("events")
      .select("id, nom, date, ville, email_contact, user_id")
      .eq("id", data.eventId)
      .maybeSingle();
    if (!ev) return { ok: false };

    const c = cand as unknown as { prenom: string; nom: string; email: string } & Record<
      string,
      string | null
    >;
    const nomBenevole = `${c.prenom} ${c.nom}`.trim();

    // Organisateur : adresse de contact de l'annonce, sinon e-mail du compte.
    let orgEmail: string | null = ev.email_contact || null;
    if (!orgEmail && ev.user_id) {
      const { data: u } = await supabaseAdmin.auth.admin.getUserById(ev.user_id);
      orgEmail = u?.user?.email ?? null;
    }

    const jobs: Promise<boolean>[] = [];
    if (orgEmail) {
      jobs.push(
        m.sendMail({
          to: orgEmail,
          replyTo: c.email,
          subject: `Nouvelle candidature bénévole pour ${ev.nom}`,
          html: m.layout(
            `${nomBenevole} veut être bénévole sur ${ev.nom} 🎉`,
            `<p>Bonne nouvelle ! Un bénévole vient de postuler à ton événement du <strong>${m.esc(fmtDate(ev.date))}</strong>.</p>
             ${m.table({
               Bénévole: nomBenevole,
               Email: c.email,
               Téléphone: c.telephone,
               "Mission souhaitée": c.mission_souhaitee,
               Transport: c.transport,
               Niveau: c.niveau,
               Message: c.message_perso,
             })}
             <p>Accepte ou refuse sa candidature depuis ton espace : le bénévole sera prévenu automatiquement. Tu peux aussi lui répondre directement en répondant à cet e-mail.</p>
             ${m.button("Gérer mes candidatures", m.siteUrl("/mon-espace"))}`,
          ),
        }),
      );
    }
    jobs.push(
      m.sendMail({
        to: c.email,
        subject: `Ta candidature pour ${ev.nom} est envoyée`,
        html: m.layout(
          `Merci ${c.prenom}, ta candidature est bien envoyée !`,
          `<p>L'organisateur de <strong>${m.esc(ev.nom)}</strong> (${m.esc(ev.ville)}, ${m.esc(fmtDate(ev.date))}) a reçu ta candidature.</p>
           <p>Tu recevras un e-mail dès qu'il l'aura acceptée. En attendant, tu peux suivre son statut dans ton espace.</p>
           ${m.button("Suivre mes candidatures", m.siteUrl("/mes-candidatures"))}
           <p style="color:#666;font-size:13px">Un empêchement ? Tu peux retirer ta candidature à tout moment depuis la page de l'événement.</p>`,
        ),
      }),
    );
    await Promise.all(jobs);
    return { ok: true };
  });

/** L'organisateur accepte / refuse une candidature : le bénévole est prévenu. */
export const notifyCandidatureStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ candidatureId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const m = await import("./mailer.server");

    const { data: cand } = await supabaseAdmin
      .from("candidatures")
      .select("*")
      .eq("id", data.candidatureId)
      .maybeSingle();
    if (!cand) return { ok: false };
    const { data: ev } = await supabaseAdmin
      .from("events")
      .select("id, nom, date, ville, email_contact, user_id")
      .eq("id", cand.event_id)
      .maybeSingle();
    // Seul l'organisateur de l'événement peut déclencher ce mail.
    if (!ev || ev.user_id !== context.userId) return { ok: false };
    if (cand.statut !== "accepte" && cand.statut !== "refuse") return { ok: false };

    const accepted = cand.statut === "accepte";
    await m.sendMail({
      to: cand.email,
      replyTo: ev.email_contact || undefined,
      subject: accepted
        ? `C'est validé : tu es bénévole sur ${ev.nom} !`
        : `Ta candidature pour ${ev.nom}`,
      html: accepted
        ? m.layout(
            `Bienvenue dans l'équipe, ${cand.prenom} !`,
            `<p>L'organisateur de <strong>${m.esc(ev.nom)}</strong> a accepté ta candidature.</p>
             ${m.table({ Événement: ev.nom, Date: fmtDate(ev.date), Lieu: ev.ville, Mission: cand.mission_souhaitee })}
             <p>L'organisateur va te recontacter pour les détails pratiques (horaires, lieu de rendez-vous…). Pour toute question, réponds simplement à cet e-mail.</p>
             ${m.button("Voir mes candidatures", m.siteUrl("/mes-candidatures"))}`,
          )
        : m.layout(
            `Merci pour ta candidature, ${cand.prenom}`,
            `<p>L'organisateur de <strong>${m.esc(ev.nom)}</strong> a complété son équipe et n'a pas pu retenir ta candidature cette fois-ci.</p>
             <p>D'autres courses cherchent encore des bénévoles près de chez toi :</p>
             ${m.button("Voir les courses à venir", m.siteUrl("/annonces"))}`,
          ),
    });
    return { ok: true };
  });

/** Bienvenue après inscription (bénévole ou organisateur) + alerte admin. */
export const notifyWelcome = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        role: z.enum(["benevole", "organisateur"]),
        prenom: z.string().max(120).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const m = await import("./mailer.server");
    const { PRIX_ANNONCE, STRIPE_PAYMENT_LINK } = await import("./site");
    const email = (context.claims as { email?: string }).email;
    if (!email) return { ok: false };
    const hello = data.prenom ? `Bienvenue sur Ravito, ${data.prenom} !` : "Bienvenue sur Ravito !";

    const html =
      data.role === "benevole"
        ? m.layout(
            hello,
            `<p>Ton compte bénévole est prêt. Tu fais maintenant partie de la communauté de bénévoles qui font vivre les trails, courses et triathlons partout en France.</p>
             <p><strong>Comment ça marche :</strong></p>
             <ol style="padding-left:18px"><li>Parcours les courses qui recherchent des bénévoles</li><li>Postule en 2 clics</li><li>L'organisateur te répond par e-mail</li></ol>
             ${m.button("Trouver une course", m.siteUrl("/annonces"))}`,
          )
        : m.layout(
            hello,
            `<p>Ton compte organisateur est prêt. Publie ta course et touche directement les +200 bénévoles inscrits sur Ravito.</p>
             <p><strong>Pack Organisateur — ${m.esc(PRIX_ANNONCE)} par événement :</strong> annonce en ligne jusqu'au jour J, candidatures illimitées, tableau de bord pour accepter ou refuser chaque bénévole, badge événement vérifié.</p>
             ${m.button("Publier ma course", m.siteUrl("/publier"))}
             <p style="font-size:13px;color:#666">Paiement sécurisé par Stripe : <a href="${m.esc(STRIPE_PAYMENT_LINK)}" style="color:#3d6e1a">régler le Pack Organisateur</a>.</p>`,
          );

    await Promise.all([
      m.sendMail({ to: email, subject: hello, html }),
      m.sendMail({
        to: m.ADMIN_EMAIL,
        subject: `[Ravito] Nouvelle inscription ${data.role} — ${data.prenom ?? email}`,
        html: m.layout(
          "Nouvelle inscription",
          m.table({ Rôle: data.role, Prénom: data.prenom, Email: email }),
        ),
      }),
    ]);
    return { ok: true };
  });

/** Annonce publiée : confirmation + lien de paiement à l'organisateur, alerte admin. */
export const notifyEventPublished = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ eventId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const m = await import("./mailer.server");
    const { PRIX_ANNONCE, STRIPE_PAYMENT_LINK } = await import("./site");

    const { data: ev } = await supabaseAdmin
      .from("events")
      .select("*")
      .eq("id", data.eventId)
      .maybeSingle();
    if (!ev || ev.user_id !== context.userId) return { ok: false };
    const email = ev.email_contact || (context.claims as { email?: string }).email;

    const details = m.table({
      Événement: ev.nom,
      Sport: ev.type_sport,
      Date: fmtDate(ev.date),
      Lieu: `${ev.ville} (${ev.region})`,
      "Bénévoles recherchés": ev.nb_benevoles,
    });
    await Promise.all([
      email
        ? m.sendMail({
            to: email,
            subject: `Ton annonce ${ev.nom} est enregistrée`,
            html: m.layout(
              "Ton annonce est enregistrée ✅",
              `<p>Merci ! Voici le récapitulatif de ton annonce :</p>${details}
               <p>Pour finaliser la publication, règle ton <strong>Pack Organisateur (${m.esc(PRIX_ANNONCE)})</strong> en ligne, par carte bancaire, en toute sécurité :</p>
               ${m.button(`Payer ${PRIX_ANNONCE}`, STRIPE_PAYMENT_LINK)}
               <p>Tu recevras un e-mail à chaque nouvelle candidature. Tu peux modifier ton annonce à tout moment depuis <a href="${m.siteUrl("/mon-espace")}" style="color:#3d6e1a">ton espace</a>.</p>`,
            ),
          })
        : Promise.resolve(false),
      m.sendMail({
        to: m.ADMIN_EMAIL,
        replyTo: email || undefined,
        subject: `[Ravito] Événement publié — ${ev.nom}`,
        html: m.layout(
          "Nouvel événement publié",
          details + m.table({ Contact: email, Description: ev.description }),
        ),
      }),
    ]);
    return { ok: true };
  });
