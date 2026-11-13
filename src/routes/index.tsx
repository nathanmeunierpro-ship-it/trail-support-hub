import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Search,
  Flag,
  GlassWater,
  ShieldCheck,
  Timer,
  HandHeart,
  UserPlus,
  Send,
  CheckCircle2,
  FileText,
  Inbox,
  Users,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Ticker } from "@/components/Ticker";
import { EventCard } from "@/components/EventCard";
import { Faq, faqJsonLd, type FaqItem } from "@/components/Faq";
import { fetchUpcomingEvents } from "@/lib/events";
import { REGIONS_FR, TYPES_SPORT } from "@/lib/regions";
import { PRIX_ANNONCE, PRIX_BARRE, NB_BENEVOLES, seo, jsonLd } from "@/lib/site";
import volunteerTeamAsset from "@/assets/volunteer-team.jpeg.asset.json";
import raceStartAsset from "@/assets/race-start.jpeg.asset.json";

const HERO_IMG =
  "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1800&q=75&auto=format";

const FAQ: FaqItem[] = [
  {
    q: "Comment devenir bénévole sur un trail ou une course ?",
    a: "Crée ton compte bénévole gratuitement sur Ravito, parcours les courses qui recherchent des bénévoles près de chez toi, puis postule en quelques clics. L'organisateur reçoit ta candidature et te recontacte directement.",
  },
  {
    q: "Être bénévole sur Ravito est-il gratuit ?",
    a: "Oui, Ravito est et restera 100 % gratuit pour les bénévoles. Sur beaucoup d'événements, le repas, le t-shirt ou un dossard sont même offerts aux bénévoles.",
  },
  {
    q: "Quelles missions peut-on faire comme bénévole ?",
    a: "Balisage du parcours, tenue d'un ravitaillement, accueil et remise des dossards, signalisation et sécurité, chronométrage, montage et démontage… Chaque annonce précise les missions disponibles.",
  },
  {
    q: "Combien coûte la publication d'une annonce pour un organisateur ?",
    a: `La publication d'une course se fait avec le Pack Organisateur à ${PRIX_ANNONCE} par événement, sans abonnement. Il comprend la mise en ligne de ton annonce, la réception des candidatures et un tableau de bord pour accepter ou refuser chaque bénévole.`,
  },
  {
    q: "Quels types d'événements sportifs sont sur Ravito ?",
    a: "Trails, courses sur route, triathlons, cyclosportives, raids et toutes les manifestations sportives qui ont besoin de bénévoles partout en France.",
  },
];

export const Route = createFileRoute("/")({
  loader: () => fetchUpcomingEvents(6),
  head: () => ({
    ...seo({
      title:
        "Ravito — Trouve des bénévoles ou deviens bénévole sur un trail, une course, un triathlon",
      description:
        "Ravito met en relation bénévoles et organisateurs de trails, courses à pied, triathlons et cyclosportives partout en France. +200 bénévoles inscrits, gratuit pour les bénévoles.",
      path: "/",
    }),
    scripts: [jsonLd(faqJsonLd(FAQ))],
  }),
  component: Home,
});

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

function Home() {
  const events = Route.useLoaderData();

  return (
    <PageShell padTop={false}>
      <Hero />
      <Ticker />

      {/* ── CHIFFRES ── */}
      <section className="bg-white px-6 !py-12 md:!py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 text-center md:grid-cols-4">
          {[
            { n: `+${NB_BENEVOLES}`, l: "bénévoles inscrits" },
            { n: "5", l: "types de missions" },
            { n: "2 min", l: "pour postuler" },
            { n: "0 €", l: "pour les bénévoles" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-5xl leading-none text-[#1A1A1A] md:text-6xl">
                {s.n.startsWith("+") ? (
                  <>
                    <span className="text-primary">+</span>
                    {s.n.slice(1)}
                  </>
                ) : (
                  s.n
                )}
              </div>
              <div className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-black/50">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROCHAINES COURSES ── */}
      <section className="px-6 py-20 md:py-28 section-light">
        <div className="mx-auto max-w-7xl">
          <motion.div
            {...fadeUp}
            className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between"
          >
            <div className="max-w-2xl">
              <Eyebrow>À venir</Eyebrow>
              <h2 className="mt-3 text-[clamp(2.25rem,5vw,4rem)] leading-[0.95]">
                Les prochaines courses qui recherchent des bénévoles
              </h2>
            </div>
            <Link to="/annonces" className="btn-secondary gap-2 self-start md:self-auto">
              Toutes les courses <ArrowRight size={16} />
            </Link>
          </motion.div>

          {events.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center ring-1 ring-black/5 md:p-16">
              <h3 className="text-3xl">De nouvelles courses arrivent bientôt</h3>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                Crée ton compte bénévole pour être prêt dès la publication des prochaines annonces.
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
              {events.map((ev, i) => (
                <motion.div
                  key={ev.id}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: (i % 3) * 0.08 }}
                >
                  <EventCard ev={ev} eager={i < 3} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ── */}
      <section className="px-6 py-20 md:py-28 bg-white">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeUp} className="mx-auto mb-14 max-w-3xl text-center">
            <Eyebrow>Comment ça marche</Eyebrow>
            <h2 className="mt-3 text-[clamp(2.25rem,5vw,4rem)] leading-[0.95]">
              Simple pour tout le monde
            </h2>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-2">
            <HowCard
              img={volunteerTeamAsset.url}
              tag="Bénévoles"
              title="Vis la course de l'intérieur"
              steps={[
                {
                  icon: <UserPlus size={20} />,
                  t: "Crée ton profil gratuit",
                  d: "30 secondes, sans engagement.",
                },
                {
                  icon: <Search size={20} />,
                  t: "Trouve une course près de chez toi",
                  d: "Filtre par région, sport et date.",
                },
                {
                  icon: <Send size={20} />,
                  t: "Postule en 2 clics",
                  d: "L'organisateur te recontacte directement.",
                },
              ]}
              cta={{ label: "Je deviens bénévole", to: "/inscription", role: "benevole" }}
            />
            <HowCard
              dark
              img={raceStartAsset.url}
              tag="Organisateurs"
              title="Trouve ton équipe de bénévoles"
              steps={[
                {
                  icon: <FileText size={20} />,
                  t: "Publie ton annonce",
                  d: `Pack Organisateur à ${PRIX_ANNONCE}, en 5 minutes.`,
                },
                {
                  icon: <Inbox size={20} />,
                  t: "Reçois des candidatures",
                  d: "Profils, disponibilités et missions souhaitées.",
                },
                {
                  icon: <CheckCircle2 size={20} />,
                  t: "Valide ton équipe",
                  d: "Accepte ou refuse en un clic.",
                },
              ]}
              cta={{ label: "Publier ma course", to: "/organisateurs/nos-offres" }}
            />
          </div>
        </div>
      </section>

      {/* ── MISSIONS ── */}
      <section className="px-6 py-20 md:py-28 section-dark">
        <div className="mx-auto max-w-7xl">
          <motion.div {...fadeUp} className="mb-12 grid gap-6 md:grid-cols-2 md:items-end">
            <div>
              <Eyebrow light>Les missions</Eyebrow>
              <h2 className="mt-3 text-[clamp(2.25rem,5vw,4rem)] leading-[0.95]">
                Le sport rassemble.{" "}
                <span className="text-primary">Les bénévoles le font vivre.</span>
              </h2>
            </div>
            <p className="text-lg leading-relaxed text-white/70">
              Derrière chaque ravitaillement, chaque dossard remis et chaque sentier balisé, il y a
              des femmes et des hommes engagés. Choisis la mission qui te ressemble.
            </p>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                icon: <Flag size={26} />,
                t: "Balisage",
                d: "Flécher et sécuriser le parcours avant la course.",
              },
              {
                icon: <GlassWater size={26} />,
                t: "Ravitaillement",
                d: "Servir et encourager les coureurs.",
              },
              {
                icon: <HandHeart size={26} />,
                t: "Accueil",
                d: "Remise des dossards et information.",
              },
              {
                icon: <ShieldCheck size={26} />,
                t: "Sécurité",
                d: "Signaleur aux carrefours, serre-file.",
              },
              {
                icon: <Timer size={26} />,
                t: "Chronométrage",
                d: "Pointages, arrivée et classements.",
              },
            ].map((m, i) => (
              <motion.div
                key={m.t}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.06 }}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-primary/60 hover:bg-white/[0.07]"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-[#1A1A1A]">
                  {m.icon}
                </div>
                <h3 className="text-2xl">{m.t}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/60">{m.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OFFRE ORGANISATEURS ── */}
      <section className="px-6 py-20 md:py-28 section-light">
        <motion.div
          {...fadeUp}
          className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] bg-primary md:grid-cols-[1.3fr_1fr]"
        >
          <div className="p-8 md:p-14">
            <Eyebrow>Organisateurs</Eyebrow>
            <h2 className="mt-3 text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[0.95]">
              Ta course mérite une équipe au complet
            </h2>
            <p className="mt-4 max-w-md text-[#1A1A1A]/75">
              Publie ton annonce et touche directement les +{NB_BENEVOLES} bénévoles inscrits sur
              Ravito partout en France. Gère toutes les candidatures depuis un seul tableau de bord.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/organisateurs/nos-offres" className="btn-secondary gap-2">
                Voir l'offre <ArrowRight size={16} />
              </Link>
              <Link to="/organisateurs/comment-ca-marche" className="btn-outline">
                Comment ça marche
              </Link>
            </div>
          </div>
          <div className="flex flex-col justify-center bg-[#1A1A1A] p-8 text-white md:p-14">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/50">
              Pack Organisateur
            </span>
            <div className="mt-2 flex items-end gap-3">
              <span className="font-display text-7xl leading-none text-primary">
                {PRIX_ANNONCE}
              </span>
              {PRIX_BARRE && (
                <span className="mb-1 font-display text-3xl leading-none text-white/35 line-through">
                  {PRIX_BARRE}
                </span>
              )}
            </div>
            <span className="mt-1 text-sm text-white/60">
              tout compris, par événement, sans abonnement
            </span>
            <ul className="mt-6 space-y-2 text-sm">
              {[
                `Diffusion auprès de +${NB_BENEVOLES} bénévoles`,
                "Newsletter + Instagram (posts, stories)",
                "Annonce en ligne jusqu'au jour J",
                "Candidatures illimitées",
                "Espace de gestion des candidatures",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="shrink-0 text-primary" /> {f}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 py-20 md:py-28 bg-white">
        <div className="mx-auto max-w-3xl">
          <motion.div {...fadeUp} className="mb-10 text-center">
            <Eyebrow>Questions fréquentes</Eyebrow>
            <h2 className="mt-3 text-[clamp(2.25rem,5vw,3.75rem)] leading-[0.95]">
              Tout savoir sur Ravito
            </h2>
          </motion.div>
          <Faq items={FAQ} />
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="relative overflow-hidden px-6 py-24 md:py-32 section-dark">
        <img
          src="https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1600&q=70&auto=format"
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <motion.div {...fadeUp} className="relative mx-auto max-w-3xl text-center">
          <Users size={44} className="mx-auto mb-6 text-primary" strokeWidth={1.5} />
          <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95]">
            Rejoins la <span className="text-primary">communauté</span>
          </h2>
          <p className="mx-auto mt-5 mb-10 max-w-xl text-lg text-white/75">
            Bénévole ou organisateur, ta place est ici. Crée ton compte en 30 secondes et prends le
            départ.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/inscription" className="btn-primary gap-2">
              Créer un compte <ArrowRight size={16} />
            </Link>
            <Link to="/qui-sommes-nous" className="btn-outline-light">
              En savoir plus
            </Link>
          </div>
        </motion.div>
      </section>
    </PageShell>
  );
}

function Eyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] ${
        light ? "text-primary" : "text-[#3d6e1a]"
      }`}
    >
      <span className={`h-px w-6 ${light ? "bg-primary" : "bg-[#3d6e1a]"}`} />
      {children}
    </span>
  );
}

function HowCard({
  img,
  tag,
  title,
  steps,
  cta,
  dark,
}: {
  img: string;
  tag: string;
  title: string;
  steps: { icon: React.ReactNode; t: string; d: string }[];
  cta: { label: string; to: string; role?: "benevole" | "organisateur" };
  dark?: boolean;
}) {
  return (
    <motion.div
      {...fadeUp}
      className={`flex flex-col overflow-hidden rounded-[2rem] ${dark ? "bg-[#1A1A1A] text-white" : "bg-muted text-[#1A1A1A]"}`}
    >
      <div className="relative h-56 overflow-hidden md:h-64">
        <img src={img} alt={title} loading="lazy" className="h-full w-full object-cover" />
        <span className="absolute left-5 top-5 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A]">
          {tag}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-7 md:p-10">
        <h3 className={`text-4xl leading-none ${dark ? "!text-white" : ""}`}>{title}</h3>
        <ol className="mt-7 space-y-5">
          {steps.map((s, i) => (
            <li key={s.t} className="flex gap-4">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                  dark ? "bg-primary text-[#1A1A1A]" : "bg-white text-[#3d6e1a]"
                }`}
              >
                {s.icon}
              </span>
              <div>
                <p className="font-bold">
                  <span className={dark ? "text-primary" : "text-[#3d6e1a]"}>0{i + 1}.</span> {s.t}
                </p>
                <p className={`text-sm ${dark ? "text-white/60" : "text-black/60"}`}>{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-auto pt-8">
          {cta.role ? (
            <Link
              to="/inscription"
              search={{ role: cta.role }}
              className={dark ? "btn-primary gap-2" : "btn-secondary gap-2"}
            >
              {cta.label} <ArrowRight size={16} />
            </Link>
          ) : (
            <Link to={cta.to} className={dark ? "btn-primary gap-2" : "btn-secondary gap-2"}>
              {cta.label} <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function Hero() {
  const navigate = useNavigate();
  const [region, setRegion] = useState("");
  const [sport, setSport] = useState("");

  return (
    <section className="keep-pad relative flex min-h-[100svh] items-end overflow-hidden bg-[#0F0F0F] text-white md:items-center">
      <img
        src={HERO_IMG}
        alt="Coureurs sur un sentier de trail en montagne"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/40 md:bg-gradient-to-r md:from-black/85 md:via-black/55 md:to-black/10" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-14 pt-32 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Trail · Running · Triathlon · Vélo
          </span>
          <h1 className="mt-6 max-w-4xl text-[clamp(3rem,8.5vw,7.5rem)] leading-[0.88] !text-white">
            Bénévole sur un trail, une course ou un <span className="text-primary">triathlon</span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-white/80 md:text-lg">
            Ravito connecte les bénévoles passionnés aux organisateurs d'événements sportifs partout
            en France. Trouve ta prochaine mission près de chez toi, ou l'équipe qu'il manque à ta
            course.
          </p>
        </motion.div>

        {/* Recherche rapide */}
        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          onSubmit={(e) => {
            e.preventDefault();
            navigate({
              to: "/annonces",
              search: { region: region || undefined, sport: sport || undefined },
            });
          }}
          className="mt-9 grid max-w-3xl gap-2 rounded-3xl bg-white p-2 text-[#1A1A1A] shadow-2xl sm:grid-cols-[1fr_1fr_auto]"
          aria-label="Rechercher une course"
        >
          <label className="flex flex-col rounded-2xl px-4 py-2 hover:bg-muted">
            <span className="text-[10px] font-bold uppercase tracking-widest text-black/50">
              Région
            </span>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="bg-transparent py-1 text-sm font-semibold outline-none"
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
              onChange={(e) => setSport(e.target.value)}
              className="bg-transparent py-1 text-sm font-semibold outline-none"
            >
              <option value="">Tous les sports</option>
              {TYPES_SPORT.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="btn-primary gap-2 !rounded-2xl">
            <Search size={16} /> Trouver une course
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/80"
        >
          <span className="flex items-center gap-3">
            <span className="flex -space-x-2">
              {["#73CC30", "#F2FAE8", "#4a8a1f"].map((c) => (
                <span
                  key={c}
                  className="h-7 w-7 rounded-full border-2 border-black/40"
                  style={{ background: c }}
                />
              ))}
            </span>
            <span>
              <strong className="text-white">+{NB_BENEVOLES} bénévoles</strong> déjà inscrits en
              France
            </span>
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-primary" /> 100 % gratuit pour les bénévoles
          </span>
          <Link
            to="/organisateurs/nos-offres"
            className="flex items-center gap-2 underline-offset-4 hover:underline"
          >
            <CheckCircle2 size={16} className="text-primary" /> Organisateur ? Pack à {PRIX_ANNONCE}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
