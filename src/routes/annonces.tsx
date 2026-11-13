import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { EventCard } from "@/components/EventCard";
import { fetchUpcomingEvents } from "@/lib/events";
import { REGIONS_FR, TYPES_SPORT } from "@/lib/regions";
import { useAuth } from "@/lib/auth-context";
import { NB_BENEVOLES, seo, jsonLd, SITE_URL } from "@/lib/site";

const searchSchema = z.object({
  region: z.string().optional(),
  sport: z.string().optional(),
  q: z.string().optional(),
  page: z.number().int().min(1).optional(),
});

export const Route = createFileRoute("/annonces")({
  validateSearch: (s) => searchSchema.parse(s),
  loader: () => fetchUpcomingEvents(),
  head: ({ loaderData }) => {
    const events = loaderData ?? [];
    return {
      ...seo({
        title: "Courses qui recherchent des bénévoles | Ravito",
        description: `${events.length > 0 ? `${events.length} événement${events.length > 1 ? "s" : ""} sportif${events.length > 1 ? "s" : ""} à venir` : "Les événements sportifs"} recherchent des bénévoles : trails, courses à pied, triathlons et cyclosportives partout en France. Postule gratuitement en 2 clics.`,
        path: "/annonces",
      }),
      scripts: [
        jsonLd({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Événements sportifs qui recherchent des bénévoles",
          itemListElement: events.slice(0, 30).map((e, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE_URL}/annonce/${e.id}`,
            name: e.nom,
          })),
        }),
      ],
    };
  },
  component: AnnoncesPage,
});

const PAGE_SIZE = 12;

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function AnnoncesPage() {
  const events = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/annonces" });
  const { user } = useAuth();

  const region = search.region ?? "";
  const sport = search.sport ?? "";
  const page = search.page ?? 1;
  const [q, setQ] = useState(search.q ?? "");

  const [postules, setPostules] = useState<Set<string>>(new Set());
  const [favoris, setFavoris] = useState<Set<string>>(new Set());
  const [favoriLoading, setFavoriLoading] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      setPostules(new Set());
      setFavoris(new Set());
      return;
    }
    supabase
      .from("candidatures")
      .select("event_id")
      .eq("benevole_id", user.id)
      .then(({ data }) =>
        setPostules(new Set((data ?? []).map((c: { event_id: string }) => c.event_id))),
      );
    supabase
      .from("favoris")
      .select("event_id")
      .eq("benevole_id", user.id)
      .then(({ data }) =>
        setFavoris(new Set((data ?? []).map((f: { event_id: string }) => f.event_id))),
      );
  }, [user]);

  // Recherche texte (nom / ville) avec un léger délai, synchronisée dans l'URL.
  useEffect(() => {
    const t = setTimeout(() => {
      if ((search.q ?? "") !== q)
        navigate({ search: (s) => ({ ...s, q: q || undefined, page: undefined }), replace: true });
    }, 300);
    return () => clearTimeout(t);
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  const setFilter = (key: "region" | "sport", value: string) =>
    navigate({ search: (s) => ({ ...s, [key]: value || undefined, page: undefined }) });

  const toggleFavori = async (eventId: string) => {
    if (!user) {
      navigate({ to: "/connexion" });
      return;
    }
    setFavoriLoading((s) => new Set([...s, eventId]));
    if (favoris.has(eventId)) {
      await supabase.from("favoris").delete().eq("benevole_id", user.id).eq("event_id", eventId);
      setFavoris((s) => {
        const n = new Set(s);
        n.delete(eventId);
        return n;
      });
    } else {
      await supabase.from("favoris").insert({ benevole_id: user.id, event_id: eventId });
      setFavoris((s) => new Set([...s, eventId]));
    }
    setFavoriLoading((s) => {
      const n = new Set(s);
      n.delete(eventId);
      return n;
    });
  };

  const filtered = useMemo(() => {
    const nq = norm(search.q ?? "");
    return events.filter((e) => {
      if (region && e.region !== region) return false;
      if (sport && e.type_sport !== sport) return false;
      if (nq && !norm(`${e.nom} ${e.ville}`).includes(nq)) return false;
      return true;
    });
  }, [events, region, sport, search.q]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const activeFilters = [region, sport, search.q].filter(Boolean).length;

  return (
    <PageShell padTop={false}>
      {/* En-tête */}
      <section className="keep-pad section-dark px-6 pb-14 pt-32 md:pb-20 md:pt-40">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
              Les courses
            </span>
            <h1 className="mt-3 text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.9] !text-white">
              Deviens bénévole sur une course près de chez toi
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-white/70">
              Trails, courses sur route, triathlons et cyclosportives : ces organisateurs
              recherchent des bénévoles. Rejoins les +{NB_BENEVOLES} bénévoles déjà inscrits et
              postule gratuitement en 2 clics.
            </p>
          </motion.div>

          {/* Barre de filtres */}
          <div className="mt-10 grid gap-2 rounded-3xl bg-white p-2 text-[#1A1A1A] md:grid-cols-[1.4fr_1fr_1fr]">
            <label className="flex items-center gap-3 rounded-2xl px-4 py-3 hover:bg-muted">
              <Search size={18} className="shrink-0 text-black/40" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Nom de course ou ville…"
                aria-label="Rechercher une course ou une ville"
                className="w-full bg-transparent text-sm font-semibold outline-none placeholder:font-normal placeholder:text-black/40"
              />
            </label>
            <label className="flex flex-col rounded-2xl px-4 py-2 hover:bg-muted">
              <span className="text-[10px] font-bold uppercase tracking-widest text-black/50">
                Région
              </span>
              <select
                value={region}
                onChange={(e) => setFilter("region", e.target.value)}
                className="bg-transparent py-0.5 text-sm font-semibold outline-none"
              >
                <option value="">Toute la France</option>
                {REGIONS_FR.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col rounded-2xl px-4 py-2 hover:bg-muted">
              <span className="text-[10px] font-bold uppercase tracking-widest text-black/50">
                Sport
              </span>
              <select
                value={sport}
                onChange={(e) => setFilter("sport", e.target.value)}
                className="bg-transparent py-0.5 text-sm font-semibold outline-none"
              >
                <option value="">Tous les sports</option>
                {TYPES_SPORT.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Raccourcis sport */}
          <div className="mt-4 flex flex-wrap gap-2">
            {["", ...TYPES_SPORT].map((t) => (
              <button
                key={t || "all"}
                onClick={() => setFilter("sport", t)}
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                  sport === t
                    ? "bg-primary text-[#1A1A1A]"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {t || "Tous"}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm font-semibold text-black/60">
              <SlidersHorizontal size={14} className="mr-2 inline" />
              {filtered.length} course{filtered.length !== 1 ? "s" : ""} à venir
              {region ? ` en ${region}` : ""}
            </p>
            {activeFilters > 0 && (
              <button
                onClick={() => {
                  setQ("");
                  navigate({ search: {} });
                }}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#3d6e1a] hover:underline"
              >
                <X size={14} /> Effacer les filtres
              </button>
            )}
          </div>

          {shown.length === 0 ? (
            <div className="rounded-3xl bg-white px-6 py-16 text-center ring-1 ring-black/5">
              <Search size={36} className="mx-auto mb-4 text-black/30" />
              <h2 className="text-3xl">
                {events.length === 0
                  ? "De nouvelles courses arrivent bientôt"
                  : "Aucune course ne correspond"}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                {events.length === 0
                  ? "Crée ton compte bénévole pour être prêt dès la publication des prochaines annonces."
                  : "Essaie une autre région ou un autre sport."}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link to="/inscription" search={{ role: "benevole" }} className="btn-primary">
                  Je deviens bénévole
                </Link>
                <Link to="/organisateurs/nos-offres" className="btn-outline">
                  Publier ma course
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((ev, i) => (
                <EventCard
                  key={ev.id}
                  ev={ev}
                  eager={i < 3}
                  applied={postules.has(ev.id)}
                  favori={favoris.has(ev.id)}
                  favoriDisabled={favoriLoading.has(ev.id)}
                  onToggleFavori={() => toggleFavori(ev.id)}
                />
              ))}
            </div>
          )}

          {pageCount > 1 && (
            <nav aria-label="Pagination" className="mt-12 flex justify-center gap-2">
              {Array.from({ length: pageCount }).map((_, i) => (
                <Link
                  key={i}
                  to="/annonces"
                  search={(s) => ({ ...s, page: i + 1 === 1 ? undefined : i + 1 })}
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold transition ${
                    page === i + 1
                      ? "bg-[#1A1A1A] text-white"
                      : "bg-white ring-1 ring-black/10 hover:ring-primary"
                  }`}
                >
                  {i + 1}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </section>
    </PageShell>
  );
}
