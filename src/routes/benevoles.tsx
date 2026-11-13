import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, Send, Clock, Users, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { seo, NB_BENEVOLES } from "@/lib/site";
import { DISCIPLINES } from "@/lib/disciplines";

export const Route = createFileRoute("/benevoles")({
  head: () =>
    seo({
      title: "Devenir bénévole sur un trail, une course ou un triathlon | Ravito",
      description: `Envie de vivre une course de l'intérieur ? Deviens bénévole sur un trail, une course à pied ou un triathlon près de chez toi. Rejoins gratuitement les +${NB_BENEVOLES} bénévoles Ravito.`,
      path: "/benevoles",
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
    desc: "En attente, accepté ou refusé, tout est centralisé dans ton espace personnel.",
  },
  {
    icon: <Users size={22} />,
    title: "Rejoins la communauté",
    desc: `Plus de ${NB_BENEVOLES} bénévoles passionnés déjà inscrits partout en France, sur tous types d'événements sportifs.`,
  },
];

function BenevolesPage() {
  return (
    <PageShell>
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-4xl md:text-6xl font-black mb-6">Deviens bénévole sur un événement sportif</h1>
            <p className="text-lg text-muted-foreground mb-14 max-w-2xl leading-relaxed">
              Tu adores l'ambiance des événements sportifs et tu veux contribuer ? Rejoins le réseau Ravito et trouve ta prochaine mission : trails, courses à pied, vélo, triathlon, cyclosportives et bien plus.
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
            <Link to="/inscription" search={{ role: "benevole" }} className="btn-cta inline-flex items-center gap-2">
              Créer mon compte <ArrowRight size={16} />
            </Link>
            <Link to="/annonces" className="btn-outline inline-flex items-center gap-2">
              Voir les événements
            </Link>
          </motion.div>

          <h2 className="font-display text-2xl font-black mt-16 mb-4">Bénévole sur quel sport ?</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {DISCIPLINES.map((d) => (
              <Link
                key={d.slug}
                to="/benevole/$discipline"
                params={{ discipline: d.slug }}
                className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 font-bold hover:border-primary hover:text-primary"
              >
                {d.h1} <ArrowRight size={16} />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
