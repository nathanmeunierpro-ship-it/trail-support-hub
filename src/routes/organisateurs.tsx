import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { DollarSign, Filter, LayoutDashboard, Globe, ArrowRight } from "lucide-react";
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

const FEATURES = [
  {
    icon: <DollarSign size={22} />,
    title: "Publication 100% gratuite",
    desc: "Aucun frais, aucun abonnement. Ton annonce reste visible jusqu'à la date de l'événement.",
  },
  {
    icon: <Filter size={22} />,
    title: "Candidatures qualifiées",
    desc: "Profil détaillé, département, niveau, disponibilités — toutes les infos pour choisir les bons bénévoles.",
  },
  {
    icon: <LayoutDashboard size={22} />,
    title: "Tableau de bord clair",
    desc: "Valide, refuse et suis tes bénévoles dans un espace dédié, en temps réel.",
  },
  {
    icon: <Globe size={22} />,
    title: "Visibilité nationale",
    desc: "Tes annonces sont diffusées auprès de la communauté Ravito partout en France.",
  },
];

function OrgPage() {
  return (
    <PageShell>
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl md:text-6xl font-black mb-6">Organisateurs</h1>
            <p className="text-lg text-muted-foreground mb-14 max-w-2xl leading-relaxed">
              Tu organises un trail, une course, une cyclosportive ou un triathlon ? Publie ton événement gratuitement et reçois des candidatures de bénévoles motivés en quelques heures.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 mb-14">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="bg-card border border-border rounded-2xl p-6"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {f.icon}
                </div>
                <h2 className="font-display text-lg font-black mb-2">{f.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/publier" className="btn-cta inline-flex items-center gap-2">
              Publier un événement <ArrowRight size={16} />
            </Link>
            <Link to="/inscription" className="btn-outline inline-flex items-center gap-2">
              Créer mon compte
            </Link>
          </motion.div>
        </div>
      </section>
    </PageShell>
  );
}
