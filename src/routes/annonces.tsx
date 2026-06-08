import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Users, ChevronDown, Check, Loader2, Filter, Search, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { REGIONS_FR, TYPES_SPORT } from "@/lib/regions";
import { useAuth } from "@/lib/auth-context";

interface EventCard {
  id: string;
  nom: string;
  ville: string;
  region: string;
  date: string;
  type_sport: string;
  nb_benevoles: number | null;
  missions: string[] | null;
}

export const Route = createFileRoute("/annonces")({
  head: () => ({
    meta: [
      { title: "Événements sportifs — Ravito" },
      {
        name: "description",
        content:
          "Parcours les annonces de trails, running, vélo et triathlon en France. Postule comme bénévole en quelques clics.",
      },
    ],
  }),
  component: AnnoncesPage,
});

const PAGE_SIZE = 12;

const TYPE_COLORS: Record<string, string> = {
  Trail: "bg-primary text-primary-foreground",
  Running: "bg-primary text-primary-foreground",
  Triathlon: "bg-primary text-primary-foreground",
  Cyclosportive: "bg-primary text-primary-foreground",
  Autre: "bg-muted text-foreground",
};

type ApplyStatus = "idle" | "loading" | "success";

function AnnoncesPage() {
  const { user, role, loading: authLoading } = useAuth();
  console.log("[annonces] auth role =", role, "loading =", authLoading);
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventCard[]>([]);
  const [postules, setPostules] = useState<Set<string>>(new Set());
  const [applyStatus, setApplyStatus] = useState<Record<string, ApplyStatus>>({});
  const [benProfile, setBenProfile] = useState<{ prenom: string; nom: string } | null>(null);
  const [favoris, setFavoris] = useState<Set<string>>(new Set());
  const [favoriLoading, setFavoriLoading] = useState<Set<string>>(new Set());
  const [loadingData, setLoadingData] = useState(true);
  const [region, setRegion] = useState("");
  const [type, setType] = useState("");
  const [dateMin, setDateMin] = useState("");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    supabase
      .from("events_public")
      .select("id, nom, ville, region, date, type_sport, nb_benevoles, missions")
      .or("status.is.null,status.eq.active")
      .order("date", { ascending: true })
      .then(({ data }) => {
        setEvents((data as EventCard[]) ?? []);
        setLoadingData(false);
      });
  }, []);

  useEffect(() => {
    if (!user) {
      setPostules(new Set());
      setBenProfile(null);
      setFavoris(new Set());
      return;
    }
    supabase
      .from("candidatures")
      .select("event_id")
      .eq("benevole_id", user.id)
      .then(({ data }) =>
        setPostules(new Set((data ?? []).map((c: any) => c.event_id)))
      );
    supabase
      .from("favoris")
      .select("event_id")
      .eq("benevole_id", user.id)
      .then(({ data }) =>
        setFavoris(new Set((data ?? []).map((f: any) => f.event_id)))
      );
    if (role === "benevole") {
      supabase
        .from("benevoles")
        .select("prenom, nom")
        .eq("id", user.id)
        .maybeSingle()
        .then(({ data }) => setBenProfile(data as any));
    }
  }, [user, role]);

  const toggleFavori = async (eventId: string) => {
    if (!user) { navigate({ to: "/connexion" }); return; }
    setFavoriLoading((s) => new Set([...s, eventId]));
    if (favoris.has(eventId)) {
      await supabase.from("favoris").delete().eq("benevole_id", user.id).eq("event_id", eventId);
      setFavoris((s) => { const n = new Set(s); n.delete(eventId); return n; });
    } else {
      await supabase.from("favoris").insert({ benevole_id: user.id, event_id: eventId });
      setFavoris((s) => new Set([...s, eventId]));
    }
    setFavoriLoading((s) => { const n = new Set(s); n.delete(eventId); return n; });
  };

  const filtered = useMemo(
    () =>
      events.filter((e) => {
        if (region && e.region !== region) return false;
        if (type && e.type_sport !== type) return false;
        if (dateMin && e.date < dateMin) return false;
        return true;
      }),
    [events, region, type, dateMin]
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const quickApply = async (eventId: string) => {
    if (!user) {
      navigate({ to: "/connexion" });
      return;
    }
    if (authLoading) {
      toast.info("Chargement de ton profil…");
      return;
    }
    if (role === "organisateur") {
      toast.error("Seuls les bénévoles peuvent postuler.");
      return;
    }
    setApplyStatus((s) => ({ ...s, [eventId]: "loading" }));

    const profile = benProfile;
    if (!profile) {
      toast.error("Profil introuvable. Reconnecte-toi.");
      setApplyStatus((s) => ({ ...s, [eventId]: "idle" }));
      return;
    }

    const { error } = await supabase.from("candidatures").insert({
      event_id: eventId,
      benevole_id: user.id,
      prenom: profile.prenom,
      nom: profile.nom,
      email: user.email!,
      disponibilite: true,
    });

    if (error) {
      const msg =
        error.code === "23505"
          ? "Tu as déjà postulé à cet événement."
          : /Could not find|column/i.test(error.message)
            ? "Erreur de configuration, contactez le support"
            : "Une erreur est survenue. Réessaie."; 
      toast.error(msg);
      setApplyStatus((s) => ({ ...s, [eventId]: "idle" }));
      return;
    }
    setApplyStatus((s) => ({ ...s, [eventId]: "success" }));
    setPostules((p) => new Set([...p, eventId]));
    toast.success("Candidature envoyée !");
    setTimeout(
      () => setApplyStatus((s) => ({ ...s, [eventId]: "idle" })),
      2500
    );
  };

  const activeFilters = [region, type, dateMin].filter(Boolean).length;

  return (
    <PageShell>
      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
          >
            <div>
              <h1 className="font-display text-4xl md:text-6xl font-black mb-2">
                Les événements qui cherchent des bénévoles
              </h1>
              <p className="text-muted-foreground">
                {loadingData
                  ? "Chargement des annonces…"
                  : `${filtered.length} événement${filtered.length !== 1 ? "s" : ""} disponible${filtered.length !== 1 ? "s" : ""}`}
              </p>
            </div>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-border bg-card text-sm font-semibold transition-colors hover:border-primary self-start md:self-auto"
            >
              <Filter size={16} />
              Filtres
              {activeFilters > 0 && (
                <span className="w-5 h-5 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`}
              />
            </motion.button>
          </motion.div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden mb-8"
              >
                <div
                  className="p-6 rounded-2xl bg-card border border-border grid gap-4 md:grid-cols-3"
                  style={{ boxShadow: "var(--shadow-card)" }}
                >
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">
                      Région
                    </label>
                    <select
                      value={region}
                      onChange={(e) => {
                        setRegion(e.target.value);
                        setPage(1);
                      }}
                      className="inp"
                    >
                      <option value="">Toutes les régions</option>
                      {REGIONS_FR.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">
                      Type de sport
                    </label>
                    <select
                      value={type}
                      onChange={(e) => {
                        setType(e.target.value);
                        setPage(1);
                      }}
                      className="inp"
                    >
                      <option value="">Tous les sports</option>
                      {TYPES_SPORT.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">
                      À partir du
                    </label>
                    <input
                      type="date"
                      value={dateMin}
                      onChange={(e) => {
                        setDateMin(e.target.value);
                        setPage(1);
                      }}
                      className="inp"
                    />
                  </div>
                  {activeFilters > 0 && (
                    <button
                      onClick={() => {
                        setRegion("");
                        setType("");
                        setDateMin("");
                        setPage(1);
                      }}
                      className="md:col-span-3 text-sm text-primary font-semibold hover:underline text-left"
                    >
                      ✕ Effacer tous les filtres
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cards grid */}
          {loadingData ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-52 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : shown.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Search size={40} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg mb-2">
                Aucun événement correspondant.
              </p>
              {activeFilters > 0 && (
                <button
                  onClick={() => {
                    setRegion("");
                    setType("");
                    setDateMin("");
                  }}
                  className="text-primary font-semibold hover:underline text-sm"
                >
                  Effacer les filtres
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
            >
              {shown.map((ev) => {
                const alreadyApplied = postules.has(ev.id);
                const status: ApplyStatus = applyStatus[ev.id] ?? "idle";
                const dateFmt = new Date(ev.date).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <motion.div
                    key={ev.id}
                    variants={{
                      hidden: { opacity: 0, y: 24 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="bg-card rounded-2xl border border-border overflow-hidden flex flex-col group"
                    style={{ boxShadow: "var(--shadow-card)" }}
                  >
                    {/* Top accent bar */}
                    <div className="h-1.5 bg-secondary" />

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`inline-flex w-fit text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${TYPE_COLORS[ev.type_sport] ?? "bg-muted text-foreground"}`}
                        >
                          {ev.type_sport}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => toggleFavori(ev.id)}
                          disabled={favoriLoading.has(ev.id)}
                          title={favoris.has(ev.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                          className="p-1.5 rounded-full transition-colors hover:bg-muted disabled:opacity-50"
                        >
                          <Heart
                            size={18}
                            className={favoris.has(ev.id) ? "text-red-500" : "text-muted-foreground"}
                            fill={favoris.has(ev.id) ? "currentColor" : "none"}
                          />
                        </motion.button>
                      </div>

                      <h2 className="font-display text-xl font-black text-foreground group-hover:text-primary transition-colors mb-3 leading-tight line-clamp-2">
                        {ev.nom}
                      </h2>

                      <div className="flex flex-col gap-1.5 text-sm text-muted-foreground mb-5">
                        <span className="flex items-center gap-2">
                          <MapPin size={13} className="text-primary flex-shrink-0" />
                          {ev.ville}
                        </span>
                        <span className="flex items-center gap-2">
                          <Calendar size={13} className="text-primary flex-shrink-0" />
                          {dateFmt}
                        </span>
                        {ev.nb_benevoles && (
                          <span className="flex items-center gap-2">
                            <Users size={13} style={{ color: "#73CC30" }} className="flex-shrink-0" />
                            {ev.nb_benevoles} bénévoles recherchés
                          </span>
                        )}
                      </div>

                      {/* Missions tags */}
                      {ev.missions && ev.missions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {ev.missions.slice(0, 4).map((m) => (
                            <span key={m} className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border border-border bg-muted text-muted-foreground">
                              {m}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-auto flex gap-3">
                        <Link
                          to="/annonce/$id"
                          params={{ id: ev.id }}
                          className="flex-1 py-2.5 rounded-xl text-center text-sm font-bold uppercase tracking-wider border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                        >
                          Détails
                        </Link>

                        {alreadyApplied || status === "success" ? (
                          <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold" style={{ background: "color-mix(in srgb, var(--success) 15%, transparent)", color: "var(--success)" }}>
                            <Check size={14} /> Postulé
                          </div>
                        ) : (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => quickApply(ev.id)}
                            disabled={status === "loading"}
                            className="btn-cta py-2.5 px-4 flex items-center gap-1.5 disabled:opacity-60"
                            style={{ borderRadius: "12px", padding: "0.625rem 1rem", fontSize: "0.875rem" }}
                            title={
                              !user
                                ? "Connecte-toi pour postuler"
                                : role === "organisateur"
                                ? "Seuls les bénévoles peuvent postuler"
                                : "Postuler à cet événement"
                            }
                          >
                            <AnimatePresence mode="wait" initial={false}>
                              {status === "loading" ? (
                                <motion.span key="l" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                  <Loader2 size={15} className="animate-spin" />
                                </motion.span>
                              ) : (
                                <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                  Je postule
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Pagination */}
          {pageCount > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 flex justify-center gap-2"
            >
              {Array.from({ length: pageCount }).map((_, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setPage(i + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                    page === i + 1
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-muted-foreground hover:border-primary"
                  }`}
                >
                  {i + 1}
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
