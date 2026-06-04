import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, Send, Clock, Users, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/benevoles")({
  head: () => ({
    meta: [
      { title: "Deviens bénévole sur un événement sportif — Ravito" },
      {
        name: "description",
        content:
          "Trails, courses à pied, vélo, triathlon… Rejoins la communauté Ravito et aide les organisateurs d'événements sportifs en France.",
      },
    ],
  }),
  component: BenevolesPage,
});

const STEPS = [
  {
    icon: <Search size={22} />,
    title: "Trouve un événement près de chez toi",
    desc: "Filtre par région, type de sport (trail, running, vélo, triathlon…) et date.",
  },
  {
    icon: <Send size={22} />,
    title: "Postule en un clic",
    desc: "Un seul formulaire, l'organisateur te répond directement par email.",
  },
  {
    icon: <Clock size={22} />,
    title: "Suis tes candidatures",
    desc: "En attente, accepté ou refusé — tout est centralisé dans ton espace personnel.",
  },
  {
    icon: <Users size={22} />,
    title: "Rejoins la communauté",
    desc: "Des milliers de bénévoles passionnés partout en France, sur tous types d'événements sportifs.",
  },
];

function BenevolesPage() {
  return (
    <PageShell>
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl md:text-6xl font-black mb-6">Bénévoles</h1>
            <p className="text-lg text-muted-foreground mb-14 max-w-2xl leading-relaxed">
              Tu adores l'ambiance des événements sportifs et tu veux contribuer ? Rejoins le réseau Ravito et choisis parmi des centaines d'annonces : trails, courses à pied, vélo, triathlon, cyclosportives et bien plus.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 mb-14">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="bg-card border border-border rounded-2xl p-6"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {s.icon}
                </div>
                <h2 className="font-display text-lg font-black mb-2">{s.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <Link to="/inscription" className="btn-cta inline-flex items-center gap-2">
              Je m'inscris comme bénévole <ArrowRight size={16} />
            </Link>
            <Link to="/annonces" className="btn-outline inline-flex items-center gap-2">
              Voir les événements
            </Link>
          </motion.div>
        </div>
      </section>
    </PageShell>
  );
}
