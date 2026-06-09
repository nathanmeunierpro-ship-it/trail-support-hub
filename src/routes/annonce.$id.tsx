import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Tag, ArrowLeft, Loader2, CheckCircle2, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { useAuth } from "@/lib/auth-context";

interface Ev {
  id: string; nom: string; ville: string; region: string; date: string;
  type_sport: string; nb_benevoles: number; missions: string[] | null;
  description: string | null; photo_url: string | null;
}

export const Route = createFileRoute("/annonce/$id")({
  head: () => ({
    meta: [
      { title: "Détail de l'événement — Ravito" },
      { name: "description", content: "Consultez les détails de cet événement sportif et postulez comme bénévole en quelques clics." },
    ],
  }),
  component: AnnonceDetail,
});

function AnnonceDetail() {
  const { id } = Route.useParams();
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [ev, setEv] = useState<Ev | null>(null);
  const [loading, setLoading] = useState(true);
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
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.from("events_public").select("*").eq("id", id).maybeSingle()
      .then(({ data }) => { setEv(data as Ev | null); setLoading(false); });
  }, [id]);

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
    if (role !== "benevole") { toast.error("Seuls les bénévoles peuvent postuler"); return; }
    if (!dispoHoraire) { toast.error("Indique ta disponibilité horaire"); return; }
    if (!transport) { toast.error("Indique ton moyen de transport"); return; }
    if (!niveau) { toast.error("Indique ton niveau sportif"); return; }
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
      const msg = /Could not find|column/i.test(error.message)
        ? "Erreur de configuration, contactez le support"
        : error.message;
      toast.error(msg);
      return;
    }
    setSuccess(true);
    toast.success("Candidature envoyée !");
    // Notification email (fire-and-forget)
    try {
      const { sendEmail, htmlBlock } = await import("@/lib/email.functions");
      const eventName = (event as any)?.titre || (event as any)?.nom || "Événement";
      const html = htmlBlock(`Nouvelle candidature — ${eventName}`, {
        "Événement": eventName,
        "Bénévole": `${prenom} ${nom}`.trim(),
        "Email": email,
        "Téléphone": telephone,
        "Mission souhaitée": mission,
        "Disponibilité": dispoHoraire,
        "Transport": transport,
        "Niveau": niveau,
        "Message": messagePerso,
      });
      void sendEmail({ data: { subject: `[Ravito] Nouvelle candidature — ${eventName}`, html, replyTo: email } });
    } catch (e) { console.error("[candidature] email failed", e); }
    setTimeout(() => navigate({ to: "/mes-candidatures" }), 2000);
  };

  if (loading) return (
    <PageShell>
      <div className="px-6 py-20 max-w-4xl mx-auto">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-lg mb-6" />
        <div className="h-72 bg-muted animate-pulse rounded-2xl mb-8" />
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-4 bg-muted animate-pulse rounded" />)}
        </div>
      </div>
    </PageShell>
  );

  if (!ev) return (
    <PageShell>
      <div className="px-6 py-20 text-center">
        <p className="text-muted-foreground text-lg">Annonce introuvable.</p>
        <Link to="/annonces" className="text-primary font-semibold hover:underline mt-4 inline-block">← Retour aux annonces</Link>
      </div>
    </PageShell>
  );

  const dateFmt = new Date(ev.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <PageShell>
      {/* Hero image */}
      <div className="w-full h-64 md:h-80 overflow-hidden relative">
        <img
          src="https://images.unsplash.com/photo-1486218119243-13883505764c?w=1600&q=80"
          alt={ev.nom}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(255,248,240,0.95))" }} />
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
                <h2 className="font-display text-xl font-black mb-5">Postuler</h2>

                {!user ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground text-sm mb-4">Connecte-toi pour postuler à cette annonce.</p>
                    <Link to="/connexion" className="btn-cta inline-block">Se connecter</Link>
                  </div>
                ) : role === "organisateur" ? (
                  <p className="text-muted-foreground text-sm">Seuls les comptes bénévoles peuvent postuler.</p>
                ) : success ? (
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center py-8 text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 size={32} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-green-600">Candidature envoyée !</p>
                      <p className="text-xs text-muted-foreground mt-1">Redirection…</p>
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

                    <motion.button type="submit" disabled={submitting} whileTap={{ scale: 0.97 }}
                      className="btn-cta w-full flex items-center justify-center gap-2">
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
