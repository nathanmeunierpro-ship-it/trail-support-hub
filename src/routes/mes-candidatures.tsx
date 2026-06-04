import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  MapPin, Calendar, Tag, Clock, CheckCircle2, XCircle, ArrowRight,
  Heart, User, History, Star, Save, Loader2, CalendarPlus,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { useAuth } from "@/lib/auth-context";
import { REGIONS_FR, TYPES_SPORT } from "@/lib/regions";

export const Route = createFileRoute("/mes-candidatures")({
  head: () => ({
    meta: [
      { title: "Mes candidatures — Ravito" },
      { name: "description", content: "Suivi de vos candidatures bénévoles : événements postulés, statuts en temps réel." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MesCandidatures,
});

type Tab = "candidatures" | "favoris" | "profil" | "historique";

interface CandRow {
  id: string; statut: string; mission_souhaitee: string | null; event_id: string;
  created_at: string; telephone: string | null;
  disponibilite_horaire: string | null; transport: string | null;
  niveau: string | null; message_perso: string | null;
  events: { nom: string; ville: string; date: string; type_sport: string } | null;
}

interface FavoriRow {
  id: string; event_id: string; created_at: string;
  events: { id: string; nom: string; ville: string; date: string; type_sport: string } | null;
}

interface BenProfile {
  prenom: string; nom: string; region: string;
  sports_pratiques: string[]; dispo_text: string; bio: string;
}

interface AvisRow { id: string; note: number; commentaire: string | null; from_user: string; created_at: string; }

const EMPTY_PROFILE: BenProfile = { prenom: "", nom: "", region: "", sports_pratiques: [], dispo_text: "", bio: "" };

const STATUS_CONFIG: Record<string, { label: string; icon: typeof CheckCircle2; color: string; bg: string }> = {
  en_attente: { label: "En attente", icon: Clock, color: "text-orange-600", bg: "bg-orange-100" },
  accepte: { label: "Accepté", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" },
  refuse: { label: "Refusé", icon: XCircle, color: "text-red-500", bg: "bg-red-100" },
};

const DOT_COLORS: Record<string, string> = {
  en_attente: "var(--secondary)",
  accepte: "var(--success)",
  refuse: "var(--destructive)",
};

const TABS: { id: Tab; label: string; icon: typeof Heart }[] = [
  { id: "candidatures", label: "Candidatures", icon: Tag },
  { id: "favoris", label: "Mes favoris", icon: Heart },
  { id: "profil", label: "Mon profil", icon: User },
  { id: "historique", label: "Historique", icon: History },
];

function fireConfetti() {
  confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ["#1D6FE8", "#F5C518", "#22c55e", "#F55D3E"] });
}

function googleCalendarUrl(nom: string, date: string, ville: string) {
  const d = new Date(date);
  const fmt = (n: number) => n.toString().padStart(2, "0");
  const day = `${d.getFullYear()}${fmt(d.getMonth() + 1)}${fmt(d.getDate())}`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(nom)}&dates=${day}/${day}&details=${encodeURIComponent("Bénévolat Ravito")}&location=${encodeURIComponent(ville)}`;
}

function Stars({ note }: { note: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={13} fill={s <= note ? "currentColor" : "none"} className={s <= note ? "text-yellow-400" : "text-muted-foreground"} />
      ))}
    </span>
  );
}

function MesCandidatures() {
  const { session, role, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("candidatures");
  const [rows, setRows] = useState<CandRow[]>([]);
  const [favoris, setFavoris] = useState<FavoriRow[]>([]);
  const [profile, setProfile] = useState<BenProfile>(EMPTY_PROFILE);
  const [savingProfile, setSavingProfile] = useState(false);
  const [avisRecus, setAvisRecus] = useState<AvisRow[]>([]);
  const [fetching, setFetching] = useState(true);

  const confettiFired = useRef(false);
  const today = new Date().toISOString().split("T")[0];
  const historique = rows.filter(
    (r) => r.statut === "accepte" && r.events?.date && r.events.date < today
  );
  const avgNote = avisRecus.length > 0
    ? (avisRecus.reduce((s, a) => s + a.note, 0) / avisRecus.length).toFixed(1)
    : null;

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/connexion" });
  }, [loading, session, navigate]);

  useEffect(() => {
    if (!session) return;

    supabase
      .from("candidatures")
      .select("id, statut, mission_souhaitee, event_id, created_at, events:event_id(nom, ville, date, type_sport)")
      .eq("benevole_id", session.user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => { setRows((data as any) ?? []); setFetching(false); });

    supabase
      .from("favoris")
      .select("id, event_id, created_at, events:event_id(id, nom, ville, date, type_sport)")
      .eq("benevole_id", session.user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setFavoris((data as any) ?? []));

    supabase
      .from("benevoles")
      .select("prenom, nom, region, sports_pratiques, dispo_text, bio")
      .eq("id", session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setProfile({
          prenom: (data as any).prenom ?? "",
          nom: (data as any).nom ?? "",
          region: (data as any).region ?? "",
          sports_pratiques: (data as any).sports_pratiques ?? [],
          dispo_text: (data as any).dispo_text ?? "",
          bio: (data as any).bio ?? "",
        });
      });

    supabase
      .from("avis")
      .select("id, note, commentaire, from_user, created_at")
      .eq("to_user", session.user.id)
      .then(({ data }) => setAvisRecus((data as any) ?? []));

  }, [session]);

  const saveProfile = async () => {
    if (!session) return;
    setSavingProfile(true);
    const { error } = await supabase.from("benevoles").update({
      prenom: profile.prenom,
      nom: profile.nom,
      region: profile.region || null,
      sports_pratiques: profile.sports_pratiques,
      dispo_text: profile.dispo_text || null,
      bio: profile.bio || null,
    }).eq("id", session.user.id);
    setSavingProfile(false);
    if (error) toast.error(error.message);
    else toast.success("Profil mis à jour !");
  };

  const toggleSport = (sport: string) => {
    setProfile((p) => ({
      ...p,
      sports_pratiques: p.sports_pratiques.includes(sport)
        ? p.sports_pratiques.filter((s) => s !== sport)
        : [...p.sports_pratiques, sport],
    }));
  };

  const removeFavori = async (favoriId: string, eventId: string) => {
    if (!session) return;
    await supabase.from("favoris").delete().eq("id", favoriId);
    setFavoris((f) => f.filter((x) => x.id !== favoriId));
    toast.success("Retiré des favoris");
  };


  if (!session) return <PageShell><div className="px-6 py-20 text-center text-muted-foreground">Redirection…</div></PageShell>;

  return (
    <PageShell>
      <section className="px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl md:text-5xl font-black mb-2">Mon espace bénévole</h1>
            {avgNote && (
              <p className="text-muted-foreground mb-2 flex items-center gap-2">
                Note moyenne reçue : <Stars note={Math.round(parseFloat(avgNote))} />
                <span className="font-bold text-foreground">{avgNote}/5</span>
                <span className="text-xs">({avisRecus.length} avis)</span>
              </p>
            )}
            <p className="text-muted-foreground mb-8">
              {fetching ? "Chargement…" : `${rows.length} candidature${rows.length !== 1 ? "s" : ""}`}
            </p>
          </motion.div>

          {role && role !== "benevole" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="p-4 rounded-xl bg-muted border border-border text-sm text-muted-foreground mb-8">
              Cet espace est réservé aux bénévoles.
            </motion.div>
          )}

          {/* Tab navigation */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-muted-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* ── Tab: Candidatures ── */}
          {activeTab === "candidatures" && (
            <>
              {fetching ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => <div key={i} className="h-36 rounded-2xl bg-muted animate-pulse" />)}
                </div>
              ) : rows.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
                    <Tag size={28} className="text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-lg mb-2">Tu n'as pas encore postulé.</p>
                  <p className="text-muted-foreground text-sm mb-6">Trouve un événement près de chez toi !</p>
                  <Link to="/annonces" className="btn-cta inline-flex items-center gap-2">
                    Voir les événements <ArrowRight size={16} />
                  </Link>
                </motion.div>
              ) : (
                <motion.div className="space-y-4" initial="hidden" animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
                  {rows.map((r, idx) => {
                    const dateFmt = r.events
                      ? new Date(r.events.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
                      : "";
                    const createdFmt = new Date(r.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

                    /* ── ACCEPTÉ ── */
                    if (r.statut === "accepte") {
                      return (
                        <motion.div key={r.id}
                          variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
                          onAnimationComplete={() => {
                            if (idx === 0 && !confettiFired.current) {
                              confettiFired.current = true;
                              fireConfetti();
                            }
                          }}
                          className="rounded-2xl p-6 border-l-4 relative overflow-hidden"
                          style={{ borderLeftColor: "#22c55e", background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.2)", borderLeftWidth: "4px", boxShadow: "var(--shadow-card)" }}
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <CheckCircle2 size={26} className="text-green-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-green-700 font-black text-lg">Tu es dans l'équipe ! 🎉</p>
                              <Link to="/annonce/$id" params={{ id: r.event_id }}
                                className="font-display text-xl font-black text-foreground hover:text-primary transition-colors line-clamp-1 mt-0.5 block">
                                {r.events?.nom ?? "Événement"}
                              </Link>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                                {r.events && (
                                  <>
                                    <span className="flex items-center gap-1.5"><MapPin size={12} className="text-green-600" /> {r.events.ville}</span>
                                    <span className="flex items-center gap-1.5"><Calendar size={12} className="text-green-600" /> {dateFmt}</span>
                                  </>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-3">L'organisateur va te contacter avec les infos pratiques.</p>
                              <div className="flex flex-wrap gap-3 mt-4">
                                {r.events && (
                                  <a href={googleCalendarUrl(r.events.nom, r.events.date, r.events.ville)}
                                    target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-green-600 text-green-700 text-sm font-bold uppercase tracking-wider hover:bg-green-600 hover:text-white transition-all">
                                    <CalendarPlus size={14} /> Ajouter au calendrier
                                  </a>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    }

                    /* ── EN ATTENTE ── */
                    if (r.statut === "en_attente") {
                      return (
                        <motion.div key={r.id}
                          variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
                          className="rounded-2xl p-6 relative overflow-hidden"
                          style={{ borderLeft: "4px solid #f97316", background: "rgba(249,115,22,0.04)", border: "1px solid rgba(249,115,22,0.2)", borderLeftWidth: "4px", boxShadow: "var(--shadow-card)" }}
                        >
                          <motion.div
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                            style={{ background: "#f97316" }}
                          />
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-2xl">
                              ⏳
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-orange-700 font-black text-lg">Candidature en cours d'examen</p>
                              <Link to="/annonce/$id" params={{ id: r.event_id }}
                                className="font-display text-xl font-black text-foreground hover:text-primary transition-colors line-clamp-1 mt-0.5 block">
                                {r.events?.nom ?? "Événement"}
                              </Link>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                                {r.events && (
                                  <>
                                    <span className="flex items-center gap-1.5"><MapPin size={12} className="text-primary" /> {r.events.ville}</span>
                                    <span className="flex items-center gap-1.5"><Calendar size={12} className="text-primary" /> {dateFmt}</span>
                                  </>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-3">L'organisateur examine ta candidature. Tu seras notifié(e) dès qu'une décision est prise.</p>
                              <p className="text-xs text-muted-foreground mt-2">Postulé le {createdFmt}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    }

                    /* ── REFUSÉ ── */
                    return (
                      <motion.div key={r.id}
                        variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
                        className="rounded-2xl p-6"
                        style={{ borderLeft: "4px solid #9ca3af", background: "rgba(156,163,175,0.04)", border: "1px solid rgba(156,163,175,0.2)", borderLeftWidth: "4px", boxShadow: "var(--shadow-card)" }}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <XCircle size={24} className="text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-muted-foreground font-bold text-lg">Candidature non retenue</p>
                            <Link to="/annonce/$id" params={{ id: r.event_id }}
                              className="font-display text-lg font-black text-foreground/60 hover:text-primary transition-colors line-clamp-1 mt-0.5 block">
                              {r.events?.nom ?? "Événement"}
                            </Link>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                              {r.events && (
                                <>
                                  <span className="flex items-center gap-1.5"><MapPin size={12} /> {r.events.ville}</span>
                                  <span className="flex items-center gap-1.5"><Calendar size={12} /> {dateFmt}</span>
                                </>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-3">Ta candidature n'a pas été retenue cette fois. Ne te décourage pas !</p>
                            <Link to="/annonces"
                              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-all">
                              Voir d'autres événements <ArrowRight size={13} />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </>
          )}

          {/* ── Tab: Favoris ── */}
          {activeTab === "favoris" && (
            <>
              {favoris.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
                    <Heart size={28} className="text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-lg mb-6">Aucun événement en favoris.</p>
                  <Link to="/annonces" className="btn-cta inline-flex items-center gap-2">
                    Explorer les annonces <ArrowRight size={16} />
                  </Link>
                </motion.div>
              ) : (
                <motion.div className="space-y-4" initial="hidden" animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.07 } } }}>
                  {favoris.map((f) => {
                    const dateFmt = f.events
                      ? new Date(f.events.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
                      : "";
                    return (
                      <motion.div key={f.id}
                        variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                        className="bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                        style={{ boxShadow: "var(--shadow-card)" }}>
                        <div className="flex-1">
                          <Link to="/annonce/$id" params={{ id: f.event_id }}
                            className="font-display text-xl font-black text-foreground hover:text-primary transition-colors">
                            {f.events?.nom ?? "Événement"}
                          </Link>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                            {f.events && (
                              <>
                                <span className="flex items-center gap-1.5"><MapPin size={12} className="text-primary" /> {f.events.ville}</span>
                                <span className="flex items-center gap-1.5"><Calendar size={12} className="text-primary" /> {dateFmt}</span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase bg-primary text-primary-foreground">
                                  {f.events.type_sport}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Link to="/annonce/$id" params={{ id: f.event_id }}
                            className="px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                            Voir
                          </Link>
                          <motion.button whileTap={{ scale: 0.9 }}
                            onClick={() => removeFavori(f.id, f.event_id)}
                            className="p-2 rounded-xl hover:bg-muted transition-colors"
                            title="Retirer des favoris">
                            <Heart size={16} fill="currentColor" className="text-red-500" />
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </>
          )}

          {/* ── Tab: Profil ── */}
          {activeTab === "profil" && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl p-6 md:p-8"
              style={{ boxShadow: "var(--shadow-card)" }}>
              <h2 className="font-display text-2xl font-black mb-6">Mon profil bénévole</h2>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Prénom</label>
                    <input value={profile.prenom} onChange={(e) => setProfile((p) => ({ ...p, prenom: e.target.value }))}
                      className="inp" placeholder="Emma" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Nom</label>
                    <input value={profile.nom} onChange={(e) => setProfile((p) => ({ ...p, nom: e.target.value }))}
                      className="inp" placeholder="Dupont" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Région</label>
                  <select value={profile.region} onChange={(e) => setProfile((p) => ({ ...p, region: e.target.value }))} className="inp">
                    <option value="">— Choisir une région —</option>
                    {REGIONS_FR.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-muted-foreground">Sports pratiqués</label>
                  <div className="flex flex-wrap gap-2">
                    {TYPES_SPORT.map((sport) => (
                      <button key={sport} type="button" onClick={() => toggleSport(sport)}
                        className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all flex items-center gap-2 ${
                          profile.sports_pratiques.includes(sport)
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-muted-foreground hover:border-primary/50"
                        }`}>
                        {profile.sports_pratiques.includes(sport) && <CheckCircle2 size={13} />}
                        {sport}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Disponibilités</label>
                  <input value={profile.dispo_text}
                    onChange={(e) => setProfile((p) => ({ ...p, dispo_text: e.target.value }))}
                    className="inp" placeholder="Ex : weekends, vacances scolaires…" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Bio courte</label>
                  <textarea value={profile.bio} onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                    className="inp resize-none" rows={3}
                    placeholder="Passionné de trail depuis 5 ans, j'ai aidé sur plusieurs courses…" />
                </div>

                <motion.button whileTap={{ scale: 0.97 }} onClick={saveProfile} disabled={savingProfile}
                  className="btn-cta inline-flex items-center gap-2 disabled:opacity-60">
                  {savingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Enregistrer le profil
                </motion.button>
              </div>

              {avisRecus.length > 0 && (
                <div className="mt-10 border-t border-border pt-8">
                  <h3 className="font-display text-lg font-black mb-4">Avis reçus</h3>
                  <div className="space-y-3">
                    {avisRecus.map((a) => (
                      <div key={a.id} className="bg-background border border-border rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <Stars note={a.note} />
                          <span className="text-xs text-muted-foreground">
                            {new Date(a.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                        {a.commentaire && <p className="text-sm text-foreground/80">{a.commentaire}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ── Tab: Historique ── */}
          {activeTab === "historique" && (
            <>
              {historique.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
                    <History size={28} className="text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground text-lg">Aucun événement passé pour l'instant.</p>
                  <p className="text-muted-foreground text-sm mt-2">L'historique affiche les événements acceptés dont la date est passée.</p>
                </motion.div>
              ) : (
                <motion.div className="space-y-4" initial="hidden" animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.07 } } }}>
                  {historique.map((r) => {
                    const dateFmt = r.events
                      ? new Date(r.events.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
                      : "";
                    return (
                      <motion.div key={r.id}
                        variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                        className="bg-card border border-border rounded-2xl p-5"
                        style={{ boxShadow: "var(--shadow-card)" }}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <Link to="/annonce/$id" params={{ id: r.event_id }}
                              className="font-display text-xl font-black text-foreground hover:text-primary transition-colors">
                              {r.events?.nom ?? "Événement"}
                            </Link>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                              {r.events && (
                                <>
                                  <span className="flex items-center gap-1.5"><MapPin size={12} className="text-primary" /> {r.events.ville}</span>
                                  <span className="flex items-center gap-1.5"><Calendar size={12} className="text-primary" /> {dateFmt}</span>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase bg-primary text-primary-foreground">
                                    {r.events.type_sport}
                                  </span>
                                </>
                              )}
                              {r.mission_souhaitee && (
                                <span className="flex items-center gap-1.5"><Tag size={12} className="text-primary" /> {r.mission_souhaitee}</span>
                              )}
                            </div>
                          </div>
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-green-100 text-green-700 flex-shrink-0">
                            <CheckCircle2 size={12} /> Participé
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
}

