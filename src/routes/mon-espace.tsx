import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, ChevronDown, CheckCircle2, XCircle, Trash2,
  Users, FileText, UserCheck, MapPin, Calendar, Tag, Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/mon-espace")({
  head: () => ({
    meta: [
      { title: "Mon espace organisateur — Ravito" },
      { name: "description", content: "Gérez vos annonces d'événements sportifs et suivez les candidatures de vos bénévoles." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MonEspace,
});

interface Ev {
  id: string; nom: string; ville: string; date: string;
  type_sport: string; nb_benevoles: number; statut: string;
}
interface Cand {
  id: string; event_id: string; benevole_id: string;
  prenom: string; nom: string; mission_souhaitee: string | null;
  disponibilite: boolean; statut: string; email: string;
}

function useCountUp(target: number, duration = 900) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(t); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [target, duration]);
  return val;
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  const count = useCountUp(value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="bg-card border border-border rounded-2xl p-6 flex items-center gap-5 transition-shadow"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color + "20" }}>
        <div style={{ color }}>{icon}</div>
      </div>
      <div>
        <p className="text-3xl font-display font-black" style={{ color }}>{count}</p>
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
      </div>
    </motion.div>
  );
}

function MonEspace() {
  const { session, role, loading } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Ev[]>([]);
  const [cands, setCands] = useState<Cand[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [confirming, setConfirming] = useState<Record<string, string>>({});
  const [fetching, setFetching] = useState(true);
  const realtimeRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/connexion" });
  }, [loading, session, navigate]);

  const load = async () => {
    if (!session) return;
    const { data: e } = await supabase.from("events").select("*").eq("user_id", session.user.id).order("date");
    const evs = (e as Ev[]) ?? [];
    setEvents(evs);
    if (evs.length > 0) {
      const ids = evs.map((x) => x.id);
      const { data: c } = await supabase.from("candidatures").select("*").in("event_id", ids);
      setCands((c as Cand[]) ?? []);
    }
    setFetching(false);
  };

  useEffect(() => {
    load();
  }, [session]);

  // Realtime subscription
  useEffect(() => {
    if (!session) return;
    const channel = supabase.channel("mon-espace-candidatures")
      .on("postgres_changes", { event: "*", schema: "public", table: "candidatures" }, () => { load(); })
      .subscribe();
    realtimeRef.current = channel;
    return () => { supabase.removeChannel(channel); };
  }, [session]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("Supprimer cette annonce et toutes ses candidatures ?")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Annonce supprimée"); load(); }
  };

  const setStatutCand = async (candId: string, statut: string) => {
    setConfirming((s) => ({ ...s, [candId]: "loading" }));
    const { error } = await supabase.from("candidatures").update({ statut }).eq("id", candId);
    if (error) {
      toast.error(error.message);
      setConfirming((s) => ({ ...s, [candId]: "" }));
      return;
    }
    setConfirming((s) => ({ ...s, [candId]: statut }));
    setTimeout(() => {
      setConfirming((s) => { const n = { ...s }; delete n[candId]; return n; });
      setCands((prev) => prev.map((c) => c.id === candId ? { ...c, statut } : c));
    }, 1200);
    toast.success(`Statut mis à jour : ${statut === "accepte" ? "Accepté" : "Refusé"}`);
  };

  const totalCands = cands.length;
  const totalAccepted = cands.filter((c) => c.statut === "accepte").length;

  if (!session) return <PageShell><div className="px-6 py-20 text-center">Redirection…</div></PageShell>;

  return (
    <PageShell>
      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-12"
          >
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-black mb-1">Mon espace</h1>
              <p className="text-muted-foreground text-sm">Gérez vos annonces et candidatures</p>
            </div>
            <motion.div whileTap={{ scale: 0.96 }}>
              <Link to="/publier" className="btn-cta flex items-center gap-2 whitespace-nowrap" style={{ display: "inline-flex" }}>
                <Plus size={16} /> Nouvelle annonce
              </Link>
            </motion.div>
          </motion.div>

          {role && role !== "organisateur" && (
            <div className="p-4 rounded-xl bg-muted border border-border text-sm text-muted-foreground mb-8">
              Cet espace est réservé aux organisateurs.
            </div>
          )}

          {/* Stat cards */}
          <div className="grid gap-4 sm:grid-cols-3 mb-12">
            <StatCard icon={<FileText size={22} />} label="Annonces publiées" value={events.length} color="var(--color-primary)" />
            <StatCard icon={<Users size={22} />} label="Candidatures reçues" value={totalCands} color="var(--color-accent)" />
            <StatCard icon={<UserCheck size={22} />} label="Bénévoles acceptés" value={totalAccepted} color="var(--success)" />
          </div>

          {/* Events list */}
          <h2 className="font-display text-2xl font-black mb-6">Mes annonces</h2>

          {fetching ? (
            <div className="space-y-4">
              {[1, 2].map((i) => <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />)}
            </div>
          ) : events.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-16 rounded-2xl bg-card border border-border"
              style={{ boxShadow: "var(--shadow-card)" }}>
              <FileText size={40} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-5">Aucune annonce publiée.</p>
              <Link to="/publier" className="btn-cta inline-flex items-center gap-2">
                <Plus size={15} /> Publier ma première annonce
              </Link>
            </motion.div>
          ) : (
            <motion.div
              className="space-y-4"
              initial="hidden" animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            >
              {events.map((ev) => {
                const evCands = cands.filter((c) => c.event_id === ev.id);
                const acceptedCount = evCands.filter((c) => c.statut === "accepte").length;
                const pct = Math.min(100, Math.round((acceptedCount / ev.nb_benevoles) * 100));
                const isExpanded = expanded.has(ev.id);
                const dateFmt = new Date(ev.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

                return (
                  <motion.div
                    key={ev.id}
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    className="bg-card border border-border rounded-2xl overflow-hidden"
                    style={{ boxShadow: "var(--shadow-card)" }}
                  >
                    {/* Event header */}
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary text-primary-foreground">
                              {ev.type_sport}
                            </span>
                            <span className={`text-xs font-semibold ${ev.statut === "publie" ? "text-green-600" : "text-muted-foreground"}`}>
                              {ev.statut === "publie" ? "Publié" : ev.statut}
                            </span>
                          </div>
                          <h3 className="font-display text-xl font-black text-foreground mb-2">{ev.nom}</h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5"><MapPin size={13} className="text-primary" /> {ev.ville}</span>
                            <span className="flex items-center gap-1.5"><Calendar size={13} className="text-primary" /> {dateFmt}</span>
                            <span className="flex items-center gap-1.5"><Users size={13} className="text-primary" /> {ev.nb_benevoles} recherchés</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteEvent(ev.id)}
                            className="p-2 rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 size={17} />
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleExpand(ev.id)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-semibold hover:border-primary transition-colors"
                          >
                            {evCands.length} candidature{evCands.length !== 1 ? "s" : ""}
                            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                              <ChevronDown size={15} />
                            </motion.div>
                          </motion.button>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-5">
                        <div className="flex justify-between text-xs text-muted-foreground mb-2">
                          <span>{acceptedCount} bénévole{acceptedCount !== 1 ? "s" : ""} accepté{acceptedCount !== 1 ? "s" : ""}</span>
                          <span>{pct}% de l'objectif</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: pct >= 100 ? "var(--success)" : "var(--primary)" }}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {ev.nb_benevoles} bénévoles recherchés
                        </p>
                      </div>
                    </div>

                    {/* Candidates list */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden border-t border-border"
                        >
                          <div className="p-6 pt-4">
                            {evCands.length === 0 ? (
                              <p className="text-sm text-muted-foreground py-4 text-center">Aucune candidature pour l'instant.</p>
                            ) : (
                              <div className="space-y-3">
                                {evCands.map((c) => {
                                  const conf = confirming[c.id];
                                  return (
                                    <motion.div
                                      key={c.id}
                                      layout
                                      className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl bg-background border border-border"
                                    >
                                      <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm">{c.prenom} {c.nom}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{c.email}</p>
                                        {c.mission_souhaitee && (
                                          <span className="inline-flex items-center gap-1 text-xs mt-1 text-muted-foreground">
                                            <Tag size={11} /> {c.mission_souhaitee}
                                          </span>
                                        )}
                                      </div>

                                      <div className="flex items-center gap-2 flex-shrink-0">
                                        {/* Current status badge */}
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                          c.statut === "accepte" ? "bg-green-100 text-green-700" :
                                          c.statut === "refuse" ? "bg-red-100 text-red-600" :
                                          "bg-orange-100 text-orange-600"
                                        }`}>
                                          {c.statut === "accepte" ? "Accepté" : c.statut === "refuse" ? "Refusé" : "En attente"}
                                        </span>

                                        {/* Action buttons */}
                                        {c.statut !== "accepte" && (
                                          <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setStatutCand(c.id, "accepte")}
                                            disabled={!!conf}
                                            className="p-2 rounded-xl bg-green-100 text-green-700 hover:bg-green-200 transition-colors disabled:opacity-50"
                                            title="Accepter"
                                          >
                                            <AnimatePresence mode="wait" initial={false}>
                                              {conf === "loading" ? (
                                                <motion.div key="l" initial={{ scale: 0 }} animate={{ scale: 1 }}><Loader2 size={15} className="animate-spin" /></motion.div>
                                              ) : conf === "accepte" ? (
                                                <motion.div key="ok" initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 size={15} /></motion.div>
                                              ) : (
                                                <motion.div key="btn" initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 size={15} /></motion.div>
                                              )}
                                            </AnimatePresence>
                                          </motion.button>
                                        )}
                                        {c.statut !== "refuse" && (
                                          <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setStatutCand(c.id, "refuse")}
                                            disabled={!!conf}
                                            className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-colors disabled:opacity-50"
                                            title="Refuser"
                                          >
                                            <XCircle size={15} />
                                          </motion.button>
                                        )}
                                      </div>
                                    </motion.div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
