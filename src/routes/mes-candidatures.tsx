import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Tag, Clock, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { useAuth } from "@/lib/auth-context";

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

interface Row {
  id: string; statut: string; mission_souhaitee: string | null; event_id: string;
  created_at: string;
  events: { nom: string; ville: string; date: string; type_sport: string } | null;
}

const STATUS_CONFIG: Record<string, { label: string; icon: typeof CheckCircle2; color: string; bg: string; pulse: boolean }> = {
  en_attente: { label: "En attente", icon: Clock, color: "text-orange-600", bg: "bg-orange-100", pulse: true },
  accepte: { label: "Accepté", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100", pulse: false },
  refuse: { label: "Refusé", icon: XCircle, color: "text-red-500", bg: "bg-red-100", pulse: false },
};

const DOT_COLORS: Record<string, string> = {
  en_attente: "var(--secondary)",
  accepte: "var(--success)",
  refuse: "var(--destructive)",
};

function MesCandidatures() {
  const { session, role, loading } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [fetching, setFetching] = useState(true);

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
  }, [session]);

  if (!session) return <PageShell><div className="px-6 py-20 text-center text-muted-foreground">Redirection…</div></PageShell>;

  return (
    <PageShell>
      <section className="px-6 py-12">
        <div className="mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl md:text-5xl font-black mb-2">Mes candidatures</h1>
            <p className="text-muted-foreground mb-12">
              {fetching ? "Chargement…" : `${rows.length} candidature${rows.length !== 1 ? "s" : ""}`}
            </p>
          </motion.div>

          {role && role !== "benevole" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="p-4 rounded-xl bg-muted border border-border text-sm text-muted-foreground mb-8">
              Cet espace est réservé aux bénévoles.
            </motion.div>
          )}

          {fetching ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-8 h-8 rounded-full bg-muted animate-pulse flex-shrink-0" />
                  <div className="flex-1 h-28 rounded-2xl bg-muted animate-pulse" />
                </div>
              ))}
            </div>
          ) : rows.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
                <Tag size={28} className="text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-lg mb-6">Tu n'as pas encore postulé.</p>
              <Link to="/annonces" className="btn-cta inline-flex items-center gap-2">
                Voir les annonces <ArrowRight size={16} />
              </Link>
            </motion.div>
          ) : (
            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-4 top-4 bottom-4 w-0.5" style={{ background: "var(--border)" }} />

              <motion.div
                className="space-y-6"
                initial="hidden" animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
              >
                {rows.map((r, idx) => {
                  const cfg = STATUS_CONFIG[r.statut] ?? STATUS_CONFIG.en_attente;
                  const StatusIcon = cfg.icon;
                  const dotColor = DOT_COLORS[r.statut] ?? "var(--secondary)";
                  const dateFmt = r.events
                    ? new Date(r.events.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
                    : "";
                  const createdFmt = new Date(r.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });

                  return (
                    <motion.div
                      key={r.id}
                      variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                      className="flex gap-6"
                    >
                      {/* Timeline dot */}
                      <div className="relative flex-shrink-0 z-10">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-card"
                          style={{ backgroundColor: dotColor }}
                        >
                          <StatusIcon size={14} color="white" />
                        </div>
                        {cfg.pulse && (
                          <div
                            className="absolute inset-0 rounded-full animate-pulse-ring"
                            style={{ backgroundColor: dotColor }}
                          />
                        )}
                      </div>

                      {/* Card */}
                      <motion.div
                        whileHover={{ y: -2, boxShadow: "var(--shadow-card-hover)" }}
                        className="flex-1 bg-card border border-border rounded-2xl p-5 transition-shadow"
                        style={{ boxShadow: "var(--shadow-card)" }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex-1">
                            <Link
                              to="/annonce/$id" params={{ id: r.event_id }}
                              className="font-display text-xl font-black text-foreground hover:text-primary transition-colors line-clamp-1"
                            >
                              {r.events?.nom ?? "Événement"}
                            </Link>

                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                              {r.events && (
                                <>
                                  <span className="flex items-center gap-1.5"><MapPin size={12} className="text-primary" /> {r.events.ville}</span>
                                  <span className="flex items-center gap-1.5"><Calendar size={12} className="text-primary" /> {dateFmt}</span>
                                </>
                              )}
                              {r.mission_souhaitee && (
                                <span className="flex items-center gap-1.5"><Tag size={12} className="text-primary" /> {r.mission_souhaitee}</span>
                              )}
                            </div>
                          </div>

                          {/* Status badge */}
                          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                            <AnimatePresence mode="wait">
                              <motion.span
                                key={r.statut}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${cfg.bg} ${cfg.color}`}
                              >
                                <StatusIcon size={12} />
                                {cfg.label}
                              </motion.span>
                            </AnimatePresence>
                            <span className="text-xs text-muted-foreground">Postulé le {createdFmt}</span>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
