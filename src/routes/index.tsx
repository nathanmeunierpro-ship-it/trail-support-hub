import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { Ticker } from "@/components/Ticker";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ravito — Bénévoles pour événements sportifs en France" },
      {
        name: "description",
        content:
          "Trails, running, vélo, triathlon, cyclosportives… Trouve des bénévoles passionnés ou engage-toi sur un événement près de chez toi.",
      },
    ],
  }),
  component: Home,
});

interface Ev {
  id: string;
  nom: string;
  ville: string;
  region?: string;
  date: string;
  type_sport: string;
}

const HERO_IMG = "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=1600&q=80";
const CARD_IMGS = [
  "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=900&q=80",
  "https://images.unsplash.com/photo-1502904550040-7534597429ae?w=900&q=80",
  "https://images.unsplash.com/photo-1486218119243-13883505764c?w=900&q=80",
  "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=900&q=80",
  "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=900&q=80",
  "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=900&q=80",
];

const ENGAGEMENTS = [
  { icon: "🏃", title: "bénévoles passionnés", body: "Des sportifs engagés prêts à aider partout en France." },
  { icon: "📍", title: "partout en France", body: "Trails, vélo, triathlon, running dans toutes les régions." },
  { icon: "✅", title: "mise en relation directe", body: "Organisateurs et bénévoles en contact en quelques clics." },
];

function Home() {
  const [events, setEvents] = useState<Ev[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from("events_public")
      .select("id, nom, ville, region, date, type_sport")
      .order("date", { ascending: true })
      .limit(8)
      .then(({ data }) => setEvents((data as Ev[]) ?? []));
  }, []);

  const scroll = (dir: "l" | "r") => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "l" ? -360 : 360, behavior: "smooth" });
  };

  return (
    <PageShell>
      {/* ── HERO ── */}
      <section className="relative -mt-16 h-[88vh] min-h-[600px] w-full overflow-hidden">
        <img
          src={HERO_IMG}
          alt="Coureurs en pleine course nature"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display text-white font-black uppercase leading-[0.95] tracking-tight max-w-5xl"
            style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
          >
            Bénévoles & Événements<br />Sportifs en France
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-white/85 max-w-xl text-base md:text-lg"
          >
            Trails, running, vélo, triathlon, cyclosportives… Trouve ton événement en 2 minutes.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10"
          >
            <Link
              to="/annonces"
              className="inline-flex items-center gap-2 rounded-full bg-white px-9 py-5 text-primary text-2xl md:text-3xl shadow-2xl hover:scale-[1.03] transition-transform"
              style={{ fontFamily: "Pacifico, cursive" }}
            >
              trouver un événement
              <ArrowRight size={22} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <Ticker />

      {/* ── EVENTS CAROUSEL ── */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between gap-6 mb-10">
            <h2
              className="font-display font-black uppercase text-primary leading-none"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.75rem)" }}
            >
              Les prochains<br />événements
            </h2>
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => scroll("l")}
                aria-label="Précédent"
                className="h-12 w-12 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition flex items-center justify-center"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={() => scroll("r")}
                aria-label="Suivant"
                className="h-12 w-12 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition flex items-center justify-center"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center py-16 rounded-3xl bg-muted">
              <p className="text-muted-foreground mb-4">Aucune annonce pour le moment.</p>
              <Link to="/publier" className="text-primary font-bold hover:underline">
                Publier le premier événement →
              </Link>
            </div>
          </div>
        ) : (
          <div
            ref={carouselRef}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth px-6 md:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {events.map((ev, i) => {
              const date = new Date(ev.date).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
              return (
                <Link
                  key={ev.id}
                  to="/annonce/$id"
                  params={{ id: ev.id }}
                  className="group relative flex-shrink-0 w-[300px] md:w-[360px] h-[440px] rounded-3xl overflow-hidden snap-start shadow-xl hover:shadow-2xl transition-shadow"
                >
                  <img
                    src={CARD_IMGS[i % CARD_IMGS.length]}
                    alt={ev.nom}
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
                  <div className="absolute top-5 right-5">
                    <span className="inline-block rounded-full bg-secondary text-primary px-3 py-1 text-[11px] font-black uppercase tracking-wider">
                      {date}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <h3
                      className="text-white leading-tight mb-4 line-clamp-3"
                      style={{ fontFamily: "Pacifico, cursive", fontSize: "clamp(1.6rem, 2.2vw, 2.2rem)" }}
                    >
                      {ev.nom}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/95 text-primary px-3 py-1 text-xs font-bold uppercase tracking-wider">
                        <MapPin size={11} /> {ev.ville}
                      </span>
                      <span className="inline-block rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider">
                        {ev.type_sport}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mx-auto max-w-7xl px-6 mt-10 flex justify-center">
          <Link
            to="/annonces"
            className="inline-flex items-center gap-2 rounded-full border-2 border-primary text-primary px-7 py-3 text-sm font-bold uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition"
          >
            Voir tous les événements <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── ENGAGEMENTS ── */}
      <section className="py-24 px-6" style={{ backgroundColor: "#E8F4FD" }}>
        <div className="mx-auto max-w-7xl">
          <h2
            className="font-display font-black uppercase text-primary text-center mb-16"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
          >
            Nos engagements
          </h2>
          <div className="grid gap-12 md:grid-cols-3">
            {ENGAGEMENTS.map((e, i) => (
              <motion.div
                key={e.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center px-4"
              >
                <div className="text-6xl mb-6">{e.icon}</div>
                <h3
                  className="mb-4"
                  style={{ fontFamily: "Pacifico, cursive", color: "#F4845F", fontSize: "2rem" }}
                >
                  {e.title}
                </h3>
                <p className="text-primary/80 leading-relaxed max-w-xs mx-auto">{e.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DUAL CTA ── */}
      <section className="px-6 py-20 bg-background">
        <div className="mx-auto max-w-7xl grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl bg-primary p-10 flex flex-col justify-between gap-8">
            <div>
              <h3
                className="text-primary-foreground mb-3"
                style={{ fontFamily: "Pacifico, cursive", fontSize: "2.5rem", lineHeight: 1 }}
              >
                je suis bénévole
              </h3>
              <p className="text-primary-foreground/80 leading-relaxed">
                Trouve un événement sportif qui cherche du renfort près de chez toi.
              </p>
            </div>
            <Link
              to="/annonces"
              className="inline-flex items-center gap-2 self-start rounded-full bg-secondary text-primary px-7 py-3 text-sm font-bold uppercase tracking-wider hover:opacity-90 transition"
            >
              Voir les événements <ArrowRight size={16} />
            </Link>
          </div>

          <div className="rounded-3xl border-2 border-primary bg-card p-10 flex flex-col justify-between gap-8">
            <div>
              <h3
                className="text-primary mb-3"
                style={{ fontFamily: "Pacifico, cursive", fontSize: "2.5rem", lineHeight: 1 }}
              >
                j'organise
              </h3>
              <p className="text-primary/70 leading-relaxed">
                Publie ton annonce gratuitement et reçois des candidatures motivées en quelques heures.
              </p>
            </div>
            <Link
              to="/publier"
              className="inline-flex items-center gap-2 self-start rounded-full bg-primary text-primary-foreground px-7 py-3 text-sm font-bold uppercase tracking-wider hover:opacity-90 transition"
            >
              Publier un événement <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
