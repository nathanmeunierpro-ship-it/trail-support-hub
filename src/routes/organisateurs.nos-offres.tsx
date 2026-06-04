import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/organisateurs/nos-offres")({
  head: () => ({
    meta: [
      { title: "Nos offres — Organisateurs · Ravito" },
      {
        name: "description",
        content:
          "Découvre les formules Ravito pour publier ton événement sportif et trouver tes bénévoles : Starter, Essentiel et Premium.",
      },
      { property: "og:title", content: "Nos offres — Organisateurs · Ravito" },
      {
        property: "og:description",
        content:
          "Découvre les formules Ravito pour publier ton événement sportif et trouver tes bénévoles : Starter, Essentiel et Premium.",
      },
    ],
  }),
  component: Page,
});

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

function Page() {
  return (
    <PageShell>
      <section className="px-6 pt-20 pb-10">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#1D6FE8] mb-3">
            Organisateurs
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-6xl font-black mb-6"
          >
            Nos offres
          </motion.h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Choisis la formule qui correspond à ton événement et à tes ambitions de visibilité.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl">
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
                <h2 className="font-display text-2xl font-black mb-1">{o.name}</h2>
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
