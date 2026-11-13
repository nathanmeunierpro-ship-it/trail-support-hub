import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Tag, ArrowLeft, ArrowRight, Loader2, CheckCircle2, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { useAuth } from "@/lib/auth-context";
import { fetchEvent, formatDate, isPast, eventImage } from "@/lib/events";
import { seo, jsonLd, SITE_URL, NB_BENEVOLES } from "@/lib/site";

interface Ev {
  id: string; nom: string; ville: string; region: string; date: string;
  type_sport: string; nb_benevoles: number; missions: string[] | null;
  description: string | null; photo_url: string | null;
}

export const Route = createFileRoute("/annonce/$id")({
  loader: async ({ params }) => {
    const ev = await fetchEvent(params.id);
    if (!ev) throw notFound();
    return ev as Ev;
  },
  head: ({ loaderData: ev }) => {
    if (!ev) return { meta: [{ title: "Annonce introuvable | Ravito" }, { name: "robots", content: "noindex" }] };
    const past = isPast(ev.date);
    const dateTxt = formatDate(ev.date);
    const title = `Bénévole ${ev.type_sport} à ${ev.ville} — ${ev.nom} (${dateTxt}) | Ravito`;
    const missions = ev.missions?.length ? ` Missions : ${ev.missions.join(", ").toLowerCase()}.` : "";
    const description = `${ev.nom} recherche ${ev.nb_benevoles ?? ""} bénévoles le ${dateTxt} à ${ev.ville} (${ev.region}).${missions} Postule gratuitement sur Ravito.`
      .replace(/\s+/g, " ")
      .slice(0, 300);
    const base = seo({ title, description, path: `/annonce/${ev.id}`, image: ev.photo_url, noindex: past, type: "event" });
    return {
      ...base,
      scripts: [
        jsonLd({
          "@context": "https://schema.org",
          "@type": "Event",
          name: ev.nom,
          description: ev.description || description,
          startDate: ev.date,
          eventStatus: "https://schema.org/EventScheduled",
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          image: [eventImage(ev)],
          url: `${SITE_URL}/annonce/${ev.id}`,
          location: {
            "@type": "Place",
            name: ev.ville,
            address: { "@type": "PostalAddress", addressLocality: ev.ville, addressRegion: ev.region, addressCountry: "FR" },
          },
          sport: ev.type_sport,
        }),
        jsonLd({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Les courses", item: `${SITE_URL}/annonces` },
            { "@type": "ListItem", position: 3, name: ev.nom, item: `${SITE_URL}/annonce/${ev.id}` },
          ],
        }),
      ],
    };
  },
  component: AnnonceDetail,
});

function AnnonceDetail() {
  const { id } = Route.useParams();
  const { user, role, refreshRole } = useAuth();
  const navigate = useNavigate();
  const ev = Route.useLoaderData();
  const past = isPast(ev.date);
  const [success, setSuccess] = useState(false);

  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [mission, setMission] = useState("");
  const [dispoHoraire, setDispoHoraire] = useState("");
  const [transport, setTransport] = useState("");
  const [niveau, setNiveau] = useState("");
  const [messagePerso, setMessagePerso] = useState("");
  const [consentContact, setConsentContact] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [existingCandidatureId, setExistingCandidatureId] = useState<string | null>(null);
  const [checkingApplication, setCheckingApplication] = useState(false);
  const [confirmingUnsubscribe, setConfirmingUnsubscribe] = useState(false);
  const [unsubscribing, setUnsubscribing] = useState(false);

  // Check existing application
  useEffect(() => {
    if (!user || !id) { setExistingCandidatureId(null); return; }
    setCheckingApplication(true);
    supabase.from("candidatures").select("id").eq("event_id", id).eq("benevole_id", user.id).maybeSingle()
      .then(({ data }) => {
        setExistingCandidatureId((data as any)?.id ?? null);
        setCheckingApplication(false);
      });
  }, [user, id, success]);

  const handleUnsubscribe = async () => {
    if (!existingCandidatureId) return;
    setUnsubscribing(true);
    const { error } = await supabase.from("candidatures").delete().eq("id", existingCandidatureId);
    setUnsubscribing(false);
    if (error) { toast.error(error.message || "Erreur lors du retrait"); return; }
    toast.success("Candidature retirée");
    setExistingCandidatureId(null);
    setConfirmingUnsubscribe(false);
    setSuccess(false);
  };

  // Pre-fill from bénévole profile
  useEffect(() => {
    if (!user) return;
    if (user.email) setEmail(user.email);
    supabase.from("benevoles")
      .select("prenom, nom, telephone, niveau_trail")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return;
        const d = data as any;
        if (d.prenom) setPrenom(d.prenom);
        if (d.nom) setNom(d.nom);
        if (d.telephone) setTelephone(d.telephone);
        if (d.niveau_trail) {
          const map: Record<string, string> = { débutant: "Débutant", intermédiaire: "Intermédiaire", passionné: "Confirmé" };
          setNiveau(map[d.niveau_trail] ?? "");
        }
      });
  }, [user]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Connecte-toi pour postuler"); navigate({ to: "/connexion" }); return; }
    console.log("[postuler] current role =", role, "user_metadata.role =", (user.user_metadata as { role?: string } | null)?.role);
    let currentRole = role;
    if (currentRole !== "benevole") {
      await refreshRole();
      currentRole = (user.user_metadata as { role?: string } | null)?.role === "benevole" ? "benevole" : currentRole;
    }
    if (currentRole !== "benevole") { toast.error("Seuls les bénévoles peuvent postuler"); return; }
    if (!dispoHoraire) { toast.error("Indique ta disponibilité horaire"); return; }
    if (!transport) { toast.error("Indique ton moyen de transport"); return; }
    if (!niveau) { toast.error("Indique ton niveau sportif"); return; }
    if (!consentContact) { toast.error("Tu dois accepter le partage de tes coordonnées avec l'organisateur"); return; }
    setSubmitting(true);
    const { error } = await (supabase.from("candidatures") as any).insert({
      event_id: id, benevole_id: user.id, prenom, nom, email,
      telephone: telephone || null,
      mission_souhaitee: mission || null,
      disponibilite: true,
      transport,
      niveau,
      message_perso: messagePerso || null,
      experience: null,
    });
    setSubmitting(false);
    if (error) {
      console.error("[candidature] insert error:", error);
      const msg = error.code === "23505"
        ? "Tu as déjà postulé à cet événement."
        : error.code === "42501" || /row-level|permission/i.test(error.message)
          ? "Accès refusé : ton profil bénévole est incomplet. Reconnecte-toi."
          : error.message || "Une erreur est survenue.";
      toast.error(msg);
      return;
    }
    setSuccess(true);
    toast.success("Candidature envoyée !");
    // E-mails : organisateur + confirmation au bénévole (fire-and-forget)
    try {
      const { notifyNewCandidature } = await import("@/lib/notifications.functions");
      void notifyNewCandidature({ data: { eventId: id } }).catch((e) => console.error("[candidature] email failed", e));
    } catch (e) { console.error("[candidature] email failed", e); }
  };

  const dateFmt = formatDate(ev.date, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <PageShell>
      {/* Hero image */}
      <div className="w-full h-64 md:h-80 overflow-hidden relative">
        <img
          src={eventImage(ev)}
          alt={ev.nom}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, var(--background))" }} />
        <div className="absolute bottom-6 left-6">
          <span className="inline-block bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
            {ev.type_sport}
          </span>
        </div>
      </div>

      <section className="px-6 pb-16">
        <div className="mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-5">
            <Link to="/annonces" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft size={15} /> Toutes les annonces
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h1 className="font-display text-4xl md:text-5xl font-black mb-5 leading-tight">{ev.nom}</h1>
            <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><MapPin size={15} className="text-primary" /> {ev.ville}, {ev.region}</span>
              <span className="flex items-center gap-2"><Calendar size={15} className="text-primary" /> {dateFmt}</span>
              <span className="flex items-center gap-2"><Users size={15} className="text-primary" /> {ev.nb_benevoles} bénévoles recherchés</span>
            </div>
          </motion.div>

          <div className="grid gap-10 md:grid-cols-5">
            <div className="md:col-span-3">
              {ev.description && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                  <h2 className="font-display text-xl font-black mb-4">À propos</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap mb-8">{ev.description}</p>
                </motion.div>
              )}

              {ev.missions && ev.missions.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                  <h2 className="font-display text-xl font-black mb-4">Missions disponibles</h2>
                  <div className="flex flex-wrap gap-2">
                    {ev.missions.map((m) => (
                      <span key={m} className="flex items-center gap-1.5 px-4 py-2 rounded-full border-2 border-border bg-card text-sm font-medium">
                        <Tag size={13} className="text-primary" /> {m}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Application form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="md:col-span-2"
            >
              <div className="bg-card border border-border rounded-2xl p-6 sticky top-24" style={{ boxShadow: "var(--shadow-card)" }}>
                <h2 className="font-display text-xl font-black mb-5">{past ? "Événement terminé" : "Postuler"}</h2>

                {past ? (
                  <div className="py-4 text-center">
                    <p className="text-muted-foreground text-sm mb-5">
                      Cette course a déjà eu lieu, les candidatures sont fermées. D'autres événements recherchent des bénévoles !
                    </p>
                    <Link to="/annonces" className="btn-cta inline-flex w-full items-center justify-center gap-2">
                      Voir les courses à venir <ArrowRight size={16} />
                    </Link>
                  </div>
                ) : !user ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground text-sm mb-5">
                      Crée ton compte gratuit pour postuler, comme les +{NB_BENEVOLES} bénévoles déjà inscrits.
                    </p>
                    <Link
                      to="/inscription"
                      search={{ role: "benevole" }}
                      className="btn-cta inline-flex items-center justify-center gap-2 w-full mb-4"
                    >
                      Créer un compte <ArrowRight size={16} />
                    </Link>
                    <p className="text-xs text-muted-foreground mb-3">Déjà inscrit ?</p>
                    <Link
                      to="/connexion"
                      className="inline-flex items-center justify-center gap-2 w-full rounded-full border-2 border-border px-5 py-2.5 text-sm font-bold uppercase tracking-wider hover:bg-muted transition"
                    >
                      Se connecter
                    </Link>
                  </div>
                ) : role === "organisateur" ? (
                  <p className="text-muted-foreground text-sm">Seuls les comptes bénévoles peuvent postuler.</p>
                ) : checkingApplication ? (
                  <div className="flex justify-center py-8"><Loader2 size={22} className="animate-spin text-muted-foreground" /></div>
                ) : existingCandidatureId ? (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center py-6 text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 size={32} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-green-600">Vous avez déjà postulé</p>
                      <p className="text-xs text-muted-foreground mt-1">Ta candidature a bien été enregistrée.</p>
                    </div>
                    {confirmingUnsubscribe ? (
                      <div className="w-full space-y-3 mt-2">
                        <p className="text-sm">Êtes-vous sûr de vouloir retirer votre candidature ?</p>
                        <div className="flex gap-2">
                          <button onClick={handleUnsubscribe} disabled={unsubscribing}
                            className="flex-1 rounded-full bg-destructive text-destructive-foreground px-4 py-2.5 text-sm font-bold uppercase tracking-wider disabled:opacity-60 flex items-center justify-center gap-2">
                            {unsubscribing ? <Loader2 size={15} className="animate-spin" /> : "Confirmer"}
                          </button>
                          <button onClick={() => setConfirmingUnsubscribe(false)} disabled={unsubscribing}
                            className="flex-1 rounded-full border-2 border-border px-4 py-2.5 text-sm font-bold uppercase tracking-wider hover:bg-muted transition">
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmingUnsubscribe(true)}
                        className="rounded-full border-2 border-destructive text-destructive px-5 py-2.5 text-sm font-bold uppercase tracking-wider hover:bg-destructive hover:text-destructive-foreground transition">
                        Se désinscrire
                      </button>
                    )}
                  </motion.div>
                ) : success ? (
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center py-8 text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 size={32} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-green-600">Candidature envoyée !</p>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={onSubmit} className="space-y-4">
                    {/* Identity */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 text-muted-foreground">Prénom *</label>
                        <input required value={prenom} onChange={(e) => setPrenom(e.target.value)} className="inp" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 text-muted-foreground">Nom *</label>
                        <input required value={nom} onChange={(e) => setNom(e.target.value)} className="inp" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 text-muted-foreground">Email *</label>
                      <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="inp" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 text-muted-foreground flex items-center gap-1.5">
                        <Phone size={11} /> Téléphone *
                      </label>
                      <input required type="tel" placeholder="06 00 00 00 00" value={telephone}
                        onChange={(e) => setTelephone(e.target.value)} className="inp" />
                    </div>

                    {/* Mission */}
                    {ev.missions && ev.missions.length > 0 && (
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 text-muted-foreground">Mission souhaitée</label>
                        <select value={mission} onChange={(e) => setMission(e.target.value)} className="inp">
                          <option value="">— Choisir —</option>
                          {ev.missions.map((m) => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                    )}

                    {/* Disponibilité horaire */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 text-muted-foreground">Disponibilité horaire *</label>
                      <select required value={dispoHoraire} onChange={(e) => setDispoHoraire(e.target.value)} className="inp">
                        <option value="">— Choisir —</option>
                        <option value="Matin">Matin</option>
                        <option value="Après-midi">Après-midi</option>
                        <option value="Journée complète">Journée complète</option>
                        <option value="Weekend">Weekend</option>
                      </select>
                    </div>

                    {/* Transport */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 text-muted-foreground">Moyen de transport *</label>
                      <select required value={transport} onChange={(e) => setTransport(e.target.value)} className="inp">
                        <option value="">— Choisir —</option>
                        <option value="Voiture">Voiture</option>
                        <option value="Transport en commun">Transport en commun</option>
                        <option value="Les deux">Les deux</option>
                      </select>
                    </div>

                    {/* Niveau sportif */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 text-muted-foreground">Niveau sportif *</label>
                      <select required value={niveau} onChange={(e) => setNiveau(e.target.value)} className="inp">
                        <option value="">— Choisir —</option>
                        <option value="Débutant">Débutant</option>
                        <option value="Intermédiaire">Intermédiaire</option>
                        <option value="Confirmé">Confirmé</option>
                      </select>
                    </div>

                    {/* Message personnalisé */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-1.5 text-muted-foreground">Message personnalisé</label>
                      <textarea value={messagePerso} onChange={(e) => setMessagePerso(e.target.value)}
                        className="inp min-h-20 resize-none"
                        placeholder="Présente-toi en quelques mots à l'organisateur…" />
                    </div>

                    {/* Consentement partage coordonnées */}
                    <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer select-none">
                      <input type="checkbox" checked={consentContact} onChange={(e) => setConsentContact(e.target.checked)}
                        className="mt-0.5 h-4 w-4 accent-primary" />
                      <span>J'accepte que mon <strong>nom, email et téléphone</strong> soient partagés avec l'organisateur de l'événement afin qu'il puisse me contacter.</span>
                    </label>

                    <motion.button type="submit" disabled={submitting || !consentContact} whileTap={{ scale: 0.97 }}
                      className="btn-cta w-full flex items-center justify-center gap-2 disabled:opacity-50">
                      {submitting ? <Loader2 size={17} className="animate-spin" /> : <>Envoyer ma candidature</>}
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
