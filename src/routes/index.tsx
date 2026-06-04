import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Users, CalendarDays, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { Ticker } from "@/components/Ticker";
import { EventRow, type EventRowData } from "@/components/EventRow";

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

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const FEATURES = [
  {
    icon: <Users size={22} />,
    title: "Bénévoles passionnés",
    desc: "Des sportifs engagés, prêts à donner de leur temps pour faire vivre vos événements.",
  },
  {
    icon: <CalendarDays size={22} />,
    title: "Mise en relation directe",
    desc: "Organisateurs et bénévoles en contact en quelques clics, sans intermédiaire ni frais.",
  },
  {
    icon: <MapPin size={22} />,
    title: "Partout en France",
    desc: "Un réseau national couvrant trails, courses, cyclosportives, triathlons et bien plus.",
  },
];

function Home() {
  const [events, setEvents] = useState<EventRowData[]>([]);

  useEffect(() => {
    supabase
      .from("events_public")
      .select("id, nom, ville, region, date, type_sport")
      .order("date", { ascending: true })
      .limit(5)
      .then(({ data }) => setEvents((data as EventRowData[]) ?? []));
  }, []);

  return (
    <PageShell>
      {/* ── Hero ── */}
      <section className="px-6 pt-14 pb-20 md:pt-20 md:pb-28">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-5 items-center">
          <div className="lg:col-span-3">
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground mb-6">
                La plateforme bénévoles sport n°1 en France
              </span>
            </motion.div>
            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-5xl md:text-7xl font-display font-black leading-[0.95] tracking-tight mb-6"
            >
              Bénévoles<br />& Événements<br />Sportifs
            </motion.h1>
            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-lg text-muted-foreground max-w-lg leading-relaxed mb-10"
            >
              Trails, courses à pied, vélo, triathlon, cyclosportives… Des centaines d'événements cherchent des bénévoles partout en France. Trouve le tien en 2 minutes.
            </motion.p>
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap items-center gap-4"
            >
              <motion.div whileTap={{ scale: 0.96 }}>
                <Link to="/annonces" className="btn-cta flex items-center gap-2" style={{ display: "inline-flex" }}>
                  Voir les événements <ArrowRight size={16} />
                </Link>
              </motion.div>
              <motion.div whileTap={{ scale: 0.96 }}>
                <Link
                  to="/publier"
                  className="btn-outline flex items-center gap-2"
                  style={{ display: "inline-flex" }}
                >
                  Publier un événement
                </Link>
              </motion.div>
            </motion.div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-2 gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <img
                src="https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&q=80"
                alt="Bénévoles lors d'une course sportive en France"
                className="w-full h-56 md:h-72 object-cover rounded-2xl"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col gap-3"
            >
              <img
                src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80"
                alt="Coureur sur un sentier de montagne lors d'un trail"
                className="w-full h-28 md:h-36 object-cover rounded-2xl"
              />
              <div className="rounded-2xl bg-primary text-primary-foreground p-5 flex flex-col gap-1">
                <p className="font-display text-3xl font-black">2 400+</p>
                <p className="text-primary-foreground/70 text-sm">bénévoles inscrits</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Ticker ── */}
      <Ticker />

      {/* ── Features ── */}
      <section className="px-6 py-20 bg-card">
        <div className="mx-auto max-w-7xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-display text-3xl md:text-5xl font-black mb-14 max-w-3xl"
          >
            Plus qu'une plateforme
          </motion.h2>
          <div className="grid gap-8 md:grid-cols-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="border-t-2 border-secondary pt-6"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {f.icon}
                </div>
                <h3 className="font-display text-xl font-black mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent events ── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
          >
            <h2 className="font-display text-3xl md:text-5xl font-black max-w-2xl">
              Les prochains événements
            </h2>
            <Link
              to="/annonces"
              className="flex items-center gap-2 text-sm font-bold text-primary hover:underline whitespace-nowrap"
            >
              Tout voir <ArrowRight size={14} />
            </Link>
          </motion.div>

          {events.length === 0 ? (
            <div className="text-center py-16 rounded-2xl bg-card border border-border">
              <p className="text-muted-foreground mb-4">Aucune annonce pour le moment.</p>
              <Link to="/publier" className="text-primary font-semibold hover:underline text-sm">
                Publier le premier événement →
              </Link>
            </div>
          ) : (
            <div className="border-t border-border">
              {events.map((ev) => (
                <EventRow key={ev.id} ev={ev} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Dual CTA banner ── */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl grid gap-5 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-primary p-10 flex flex-col justify-between gap-8"
          >
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-black text-primary-foreground mb-3">
                Je veux être bénévole
              </h2>
              <p className="text-primary-foreground/70 text-sm leading-relaxed">
                Trails, running, vélo, triathlon… Trouve un événement sportif qui cherche du renfort près de chez toi.
              </p>
            </div>
            <motion.div whileTap={{ scale: 0.96 }}>
              <Link to="/annonces" className="btn-cta inline-flex items-center gap-2">
                Voir les événements <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border-2 border-primary bg-card p-10 flex flex-col justify-between gap-8"
          >
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-black mb-3">
                J'organise un événement
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Publie ton annonce gratuitement et reçois des candidatures de bénévoles motivés en quelques heures.
              </p>
            </div>
            <motion.div whileTap={{ scale: 0.96 }}>
              <Link to="/publier" className="btn-outline inline-flex items-center gap-2">
                Publier un événement <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </PageShell>
  );
}
