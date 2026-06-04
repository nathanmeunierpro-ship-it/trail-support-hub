import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { useEffect } from "react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/organisateurs")({
  head: () => ({
    meta: [
      { title: "Publie ton événement et trouve tes bénévoles — Ravito" },
      {
        name: "description",
        content:
          "Trail, running, cyclosportive, triathlon — crée ton annonce gratuitement et reçois des candidatures de bénévoles motivés partout en France.",
      },
    ],
  }),
  component: OrgPage,
});

const STEPS = [
  {
    emoji: "📝",
    title: "Crée ton annonce",
    desc: "Décris ton événement, le nombre de bénévoles dont tu as besoin et les rôles disponibles. C'est rapide et simple.",
  },
  {
    emoji: "📬",
    title: "Reçois des candidatures",
    desc: "Les bénévoles inscrits sur Ravito postulent directement. Tu reçois leurs profils et disponibilités dans ton dashboard.",
  },
  {
    emoji: "✅",
    title: "Valide tes bénévoles",
    desc: "Accepte ou refuse les candidatures en un clic. Tes bénévoles sont notifiés automatiquement.",
  },
];

type Offer = {
  name: string;
  badge: string;
  price: string;
  priceSuffix?: string;
  features: string[];
  cta: { label: string; href: string };
  highlighted?: boolean;
  borderClass: string;
  bgClass: string;
  textClass: string;
  badgeClass: string;
};

const OFFERS: Offer[] = [
  {
    name: "Starter",
    badge: "GRATUIT — 20 PREMIERS",
    price: "0€",
    features: ["1 annonce publiée", "Réception des candidatures", "Dashboard basique"],
    cta: { label: "Publier mon événement", href: "/publier" },
    borderClass: "border-2 border-[#1D6FE8]",
    bgClass: "bg-white",
    textClass: "text-foreground",
    badgeClass: "bg-[#1D6FE8]/10 text-[#1D6FE8]",
  },
  {
    name: "Essentiel",
    badge: "LE PLUS CHOISI",
    price: "14,99€",
    priceSuffix: "par événement",
    highlighted: true,
    features: [
      "1 annonce publiée",
      "Gestion des candidatures (accepter / refuser)",
      "Dashboard organisateur complet",
      'Badge "Événement vérifié"',
      "Plusieurs événements ? Me contacter",
    ],
    cta: { label: "Choisir cette offre", href: "mailto:contact@ravito.fr" },
    borderClass: "border-2 border-[#1D6FE8]",
    bgClass: "bg-[#1D6FE8]",
    textClass: "text-white",
    badgeClass: "bg-white text-[#1D6FE8]",
  },
  {
    name: "Premium",
    badge: "VISIBILITÉ MAXIMALE",
    price: "À partir de 49,99€",
    features: [
      "Tout l'Essentiel inclus",
      "Mise en avant homepage et carousel",
      "Contenu réseaux sociaux (posts, stories)",
      "Email envoyé à toute la base de bénévoles Ravito pour promouvoir ton événement auprès de sportifs déjà inscrits et motivés",
      "Analytics avancés",
      "Support dédié",
    ],
    cta: { label: "Nous contacter", href: "mailto:contact@ravito.fr" },
    borderClass: "border-2 border-[#F5C518]",
    bgClass: "bg-white",
    textClass: "text-foreground",
    badgeClass: "bg-[#F5C518]/15 text-[#9a7a00]",
  },
];

function OrgPage() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash) return;
    const id = hash.slice(1);
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  return (
    <PageShell>
      <section className="px-6 pt-16 pb-10">
        <div className="mx-auto max-w-5xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-6xl font-black mb-6"
          >
            Organisateurs
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Tu organises un trail, une course, une cyclosportive ou un triathlon ? Publie ton événement et reçois des candidatures de bénévoles motivés en quelques heures.
          </motion.p>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="comment-ca-marche" className="px-6 py-16 scroll-mt-28">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#1D6FE8] mb-3">
              Comment ça marche
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-black">
              3 étapes pour trouver tes bénévoles
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-card border border-border rounded-2xl p-7"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="absolute -top-4 -left-4 w-11 h-11 rounded-full bg-[#1D6FE8] text-white flex items-center justify-center font-display font-black text-lg shadow-lg">
                  {i + 1}
                </div>
                <div className="text-4xl mb-4">{s.emoji}</div>
                <h3 className="font-display text-xl font-black mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nos offres */}
      <section id="nos-offres" className="px-6 py-16 scroll-mt-28 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#1D6FE8] mb-3">
              Nos offres
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-black">
              Choisis la formule qui te correspond
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3 items-stretch">
            {OFFERS.map((o, i) => (
              <motion.div
                key={o.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl p-7 flex flex-col ${o.bgClass} ${o.textClass} ${o.borderClass} ${
                  o.highlighted ? "md:-translate-y-3 shadow-2xl" : "shadow-md"
                }`}
              >
                <span
                  className={`inline-block self-start text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-4 ${o.badgeClass}`}
                >
                  {o.badge}
                </span>
                <h3 className="font-display text-2xl font-black mb-1">{o.name}</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="font-display text-4xl font-black">{o.price}</span>
                  {o.priceSuffix && (
                    <span className={`text-sm ${o.highlighted ? "text-white/80" : "text-muted-foreground"}`}>
                      {o.priceSuffix}
                    </span>
                  )}
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {o.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm leading-relaxed">
                      <Check
                        size={16}
                        className={`mt-0.5 shrink-0 ${o.highlighted ? "text-white" : "text-[#1D6FE8]"}`}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {o.cta.href.startsWith("mailto:") ? (
                  <a
                    href={o.cta.href}
                    className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold uppercase tracking-wider transition-opacity hover:opacity-90 ${
                      o.highlighted ? "bg-white text-[#1D6FE8]" : "bg-[#1D6FE8] text-white"
                    }`}
                  >
                    {o.cta.label} <ArrowRight size={14} />
                  </a>
                ) : (
                  <Link
                    to={o.cta.href}
                    className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold uppercase tracking-wider transition-opacity hover:opacity-90 ${
                      o.highlighted ? "bg-white text-[#1D6FE8]" : "bg-[#1D6FE8] text-white"
                    }`}
                  >
                    {o.cta.label} <ArrowRight size={14} />
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
