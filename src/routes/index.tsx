import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Calendar, Heart, Users, Sparkles } from "lucide-react";
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
          "Trails, running, vélo, triathlon — trouve des bénévoles motivés ou postule sur un événement près de chez toi. Gratuit pour les 20 premiers organisateurs.",
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

const HERO_IMG =
  "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=1200&q=80";
const IMG_COMMUNITY =
  "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=1400&q=85";
const IMG_TRAIL =
  "https://images.unsplash.com/photo-1502904550040-7534597429ae?w=1400&q=85";
const IMG_VOLUNTEERS =
  "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1400&q=85";
const IMG_WIDE =
  "https://images.unsplash.com/photo-1486218119243-13883505764c?w=2000&q=85";
const CARD_IMGS = [
  "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=900&q=80",
  "https://images.unsplash.com/photo-1502904550040-7534597429ae?w=900&q=80",
  "https://images.unsplash.com/photo-1486218119243-13883505764c?w=900&q=80",
  "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=900&q=80",
  "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=900&q=80",
  "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=900&q=80",
];

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

function Home() {
  const [events, setEvents] = useState<Ev[]>([]);

  useEffect(() => {
    supabase
      .from("events_public")
      .select("id, nom, ville, region, date, type_sport")
      .order("date", { ascending: true })
      .limit(6)
      .then(({ data }) => setEvents((data as Ev[]) ?? []));
  }, []);

  return (
    <PageShell>
      {/* ── HERO — playful maximalist (Slosh-style) ── */}
      <SloshHero />




      <Ticker />

      {/* ── INTRO MANIFESTO ── */}
      <section className="py-28 px-6 section-dark">
        <div className="mx-auto max-w-4xl text-center">
          <motion.span
            {...fadeUp}
            className="inline-block text-xs uppercase tracking-[0.3em] text-[var(--color-accent)] mb-6 font-semibold"
          >
            — Notre mission —
          </motion.span>
          <motion.h2
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-black uppercase leading-[1.05] mb-8"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: "var(--color-text-light)" }}
          >
            Le sport rassemble.
            <br />
            <span style={{ fontFamily: "Pacifico, cursive", textTransform: "none", color: "var(--color-text-light)" }}>
              les bénévoles le font vivre.
            </span>
          </motion.h2>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
            style={{ color: "var(--color-text-light)", opacity: 0.8 }}
          >
            Derrière chaque ravitaillement, chaque dossard remis, chaque
            balisage de sentier, il y a des femmes et des hommes engagés.
            Ravito les connecte aux organisateurs qui en ont besoin, partout en
            France.
          </motion.p>
        </div>
      </section>

      {/* ── ALT 1 : image gauche / texte droite ── */}
      <section className="py-20 px-6 section-light">
        <div className="mx-auto max-w-7xl grid gap-12 md:grid-cols-2 items-center">
          <motion.div {...fadeUp} className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-xl">
              <img
                src={IMG_COMMUNITY}
                alt="Communauté de coureurs"
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-secondary text-secondary-foreground px-6 py-4 rounded-2xl shadow-xl hidden md:block">
              <div className="text-3xl font-black font-display">+2 500</div>
              <div className="text-xs uppercase tracking-widest font-semibold">bénévoles en France</div>
            </div>
          </motion.div>
          <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}>
            <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-text)] opacity-60 font-semibold">
              — Pour les bénévoles
            </span>
            <h3
              className="font-display font-black uppercase text-[var(--color-text)] mt-4 mb-6 leading-tight"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}
            >
              Vivre l'événement
              <br />
              de l'intérieur.
            </h3>
            <p className="text-foreground/70 text-lg leading-relaxed mb-8">
              Plonge dans les coulisses des plus belles courses de France.
              Rencontre des passionnés, partage des moments uniques, et fais
              partie de l'aventure — sans payer ton dossard.
            </p>
            <ul className="space-y-3 mb-10">
              {[
                "Choisis les événements qui te correspondent",
                "Postule en deux clics, sans engagement",
                "Repas, t-shirt et souvenirs souvent offerts",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-foreground/80">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary flex-shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/annonces"
              className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3 text-sm font-bold uppercase tracking-wider hover:opacity-90 transition"
            >
              Voir les événements <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── ALT 2 : texte gauche / image droite ── */}
      <section className="py-20 px-6 bg-background">
        <div className="mx-auto max-w-7xl grid gap-12 md:grid-cols-2 items-center">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="md:order-1 order-2"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-text)] opacity-60 font-semibold">
              — Pour les organisateurs
            </span>
            <h3
              className="font-display font-black uppercase text-[var(--color-text)] mt-4 mb-6 leading-tight"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}
            >
              Trouve l'équipe
              <br />
              qu'il te faut.
            </h3>
            <p className="text-foreground/70 text-lg leading-relaxed mb-8">
              Publie ton événement et reçois en quelques heures les candidatures de bénévoles motivés, près de chez toi. Gratuit pour les 20 premiers organisateurs.
            </p>
            <ul className="space-y-3 mb-10">
              {[
                "Gratuit pour les 20 premiers organisateurs",
                "Candidatures qualifiées dès la première heure",
                "Échange direct avec chaque bénévole",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-foreground/80">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-secondary flex-shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/publier"
              className="inline-flex items-center gap-2 rounded-full bg-secondary text-secondary-foreground px-7 py-3 text-sm font-bold uppercase tracking-wider hover:opacity-90 transition"
            >
              Publier un événement <ArrowRight size={16} />
            </Link>
          </motion.div>
          <motion.div {...fadeUp} className="relative md:order-2 order-1">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-xl">
              <img
                src={IMG_TRAIL}
                alt="Organisation d'une course nature"
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="absolute -top-6 -left-6 bg-primary text-primary-foreground px-6 py-4 rounded-2xl shadow-xl hidden md:block">
              <div className="text-lg font-black font-display leading-tight">GRATUIT</div>
              <div className="text-xs uppercase tracking-widest font-semibold">pour les 20 premiers</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── ENGAGEMENTS / VALEURS ── */}
      <section className="py-28 px-6 section-light">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeUp} className="text-center mb-20">
            <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-text)] opacity-60 font-semibold">
              — Nos engagements
            </span>
            <h2
              className="font-display font-black uppercase text-[var(--color-text)] mt-4 leading-tight"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
            >
              Une communauté,
              <br />
              une vision commune.
            </h2>
          </motion.div>
          <div className="grid gap-10 md:grid-cols-3">
            {[
              { Icon: Heart, title: "bénévoles passionnés", body: "Des sportifs engagés prêts à aider partout en France." },
              { Icon: MapPin, title: "partout en France", body: "Trails, vélo, triathlon, running dans toutes les régions." },
              { Icon: Sparkles, title: "mise en relation directe", body: "Organisateurs et bénévoles en contact en quelques clics." },
            ].map((e, i) => (
              <motion.div
                key={e.title}
                {...fadeUp}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative bg-card border border-border rounded-3xl p-10 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-[var(--color-primary)] mb-6 group-hover:bg-[var(--color-primary)] group-hover:text-white group-hover:scale-110 transition-all">
                  <e.Icon size={28} strokeWidth={1.8} />
                </div>
                <h3
                  className="mb-4"
                  style={{ fontFamily: "Pacifico, cursive", color: "var(--color-text)", fontSize: "1.85rem" }}
                >
                  {e.title}
                </h3>
                <p className="text-[var(--color-text-secondary)] leading-relaxed max-w-xs mx-auto">{e.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EVENTS GRID ── */}
      <section className="py-24 px-6 bg-[var(--color-bg)]">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeUp} className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-text)] opacity-60 font-semibold">
                — À l'affiche
              </span>
              <h2
                className="font-display font-black uppercase text-[var(--color-text)] mt-4 leading-none"
                style={{ fontSize: "clamp(2rem, 4.5vw, 3.75rem)" }}
              >
                Les prochains
                <br />
                événements
              </h2>
            </div>
            <Link
              to="/annonces"
              className="inline-flex items-center gap-2 text-[var(--color-text)] font-bold uppercase tracking-wider text-sm hover:gap-3 transition-all"
            >
              Tout voir <ArrowRight size={16} />
            </Link>
          </motion.div>

          {events.length === 0 ? (
            <div className="text-center py-16 rounded-3xl bg-background">
              <p className="text-muted-foreground mb-4">Aucune annonce pour le moment.</p>
              <Link to="/publier" className="text-[var(--color-text)] font-bold hover:underline">
                Publier le premier événement →
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((ev, i) => {
                const date = new Date(ev.date).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                });
                return (
                  <motion.div
                    key={ev.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      to="/annonce/$id"
                      params={{ id: ev.id }}
                      className="group block relative h-[420px] rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                    >
                      <img
                        src={CARD_IMGS[i % CARD_IMGS.length]}
                        alt={ev.nom}
                        className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />
                      <div className="absolute top-5 right-5">
                        <span className="inline-flex items-center gap-1 rounded-full bg-secondary text-secondary-foreground px-3 py-1 text-[11px] font-black uppercase tracking-wider">
                          <Calendar size={11} /> {date}
                        </span>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                        <h3
                          className="text-white leading-tight mb-4 line-clamp-3"
                          style={{ fontFamily: "Pacifico, cursive", fontSize: "1.85rem" }}
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
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="relative py-32 px-6 overflow-hidden section-dark">
        <img
          src={IMG_VOLUNTEERS}
          alt="Bénévoles en action"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0" style={{ background: "var(--color-bg-dark)", opacity: 0.85 }} />
        <motion.div {...fadeUp} className="relative mx-auto max-w-3xl text-center">
          <Users size={48} className="mx-auto mb-8 opacity-80" strokeWidth={1.5} style={{ color: "var(--color-accent)" }} />
          <h2
            className="font-display font-black uppercase leading-[1.05] mb-6"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
          >
            Rejoins la <span className="accent-word">communauté</span>
          </h2>
          <p className="text-lg md:text-xl opacity-90 mb-10 leading-relaxed max-w-xl mx-auto">
            Que tu sois bénévole ou organisateur, ta place est ici. Crée ton
            compte en 30 secondes et démarre l'aventure.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/inscription"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-xl"
              style={{ background: "var(--color-primary)", color: "var(--color-text-light)", minHeight: 44 }}
            >
              Créer un compte <ArrowRight size={16} />
            </Link>
            <Link
              to="/qui-sommes-nous"
              className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-wider transition-opacity hover:opacity-90"
              style={{ border: "2px solid var(--color-text-light)", color: "var(--color-text-light)", minHeight: 44 }}
            >
              En savoir plus
            </Link>
          </div>
        </motion.div>
      </section>
    </PageShell>
  );
}
