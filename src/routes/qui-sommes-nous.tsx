import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Target, Zap } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/qui-sommes-nous")({
  head: () => ({
    meta: [
      { title: "À propos de Ravito — La plateforme bénévoles sport en France" },
      {
        name: "description",
        content:
          "Ravito connecte les bénévoles passionnés aux organisateurs de trails, courses, triathlons et cyclosportives partout en France. Fait par des sportifs, pour des sportifs.",
      },
    ],
  }),
  component: QuiSommesNous,
});

const VALUES = [
  {
    icon: <Heart size={22} />,
    title: "La passion avant tout",
    desc: "Ravito est né d'un amour pour le sport et l'engagement bénévole. Chaque fonctionnalité est pensée pour les passionnés.",
  },
  {
    icon: <Target size={22} />,
    title: "Simplicité et efficacité",
    desc: "Publier une annonce ou postuler ne doit pas prendre plus de 2 minutes. On fait le maximum pour que ce soit le cas.",
  },
  {
    icon: <Zap size={22} />,
    title: "Gratuit, toujours",
    desc: "Ni frais d'inscription, ni commissions. Ravito restera toujours gratuit pour les bénévoles et les organisateurs.",
  },
];

function QuiSommesNous() {
  return (
    <PageShell>
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl md:text-6xl font-black mb-10">
              À propos de Ravito
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="space-y-5 text-lg leading-relaxed text-muted-foreground mb-14"
          >
            <p>
              Ravito est né d'un constat simple : les organisateurs de trails, courses à pied, cyclosportives et triathlons peinent à recruter des bénévoles, et les passionnés ont du mal à savoir où donner un coup de main.
            </p>
            <p>
              Notre mission est claire : créer la plus grande communauté de bénévoles sport en France, et permettre aux organisateurs de trouver du renfort en quelques clics — gratuitement, sans friction.
            </p>
            <p>
              Fait par des sportifs passionnés, pour des sportifs passionnés.
            </p>
          </motion.div>

          {/* Values */}
          <div className="grid gap-6 md:grid-cols-3 mb-14">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="bg-card border border-border rounded-2xl p-5"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                  {v.icon}
                </div>
                <h2 className="font-display text-base font-black mb-2">{v.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/annonces" className="btn-cta inline-flex items-center gap-2">
              Voir les événements <ArrowRight size={16} />
            </Link>
            <Link to="/inscription" className="btn-outline inline-flex items-center gap-2">
              Créer un compte
            </Link>
          </motion.div>
        </div>
      </section>
    </PageShell>
  );
}
