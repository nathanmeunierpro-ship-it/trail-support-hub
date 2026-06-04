import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/organisateurs/comment-ca-marche")({
  head: () => ({
    meta: [
      { title: "Comment ça marche — Organisateurs · Ravito" },
      {
        name: "description",
        content:
          "Crée ton annonce, reçois des candidatures de bénévoles et valide ton équipe en quelques clics avec Ravito.",
      },
      { property: "og:title", content: "Comment ça marche — Organisateurs · Ravito" },
      {
        property: "og:description",
        content:
          "Crée ton annonce, reçois des candidatures de bénévoles et valide ton équipe en quelques clics avec Ravito.",
      },
    ],
  }),
  component: Page,
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

function Page() {
  return (
    <PageShell>
      <section className="px-6 pt-20 pb-10">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary)] mb-3">
            Organisateurs
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-6xl font-black mb-6"
          >
            Comment ça marche
          </motion.h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            3 étapes simples pour trouver les bénévoles de ton prochain événement sportif.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl">
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
                <div className="absolute -top-4 -left-4 w-11 h-11 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-display font-black text-lg shadow-lg">
                  {i + 1}
                </div>
                <div className="text-4xl mb-4">{s.emoji}</div>
                <h2 className="font-display text-xl font-black mb-2">{s.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link to="/publier" className="btn-cta inline-flex items-center gap-2">
              Publier un événement <ArrowRight size={16} />
            </Link>
            <Link to="/organisateurs/nos-offres" className="btn-outline inline-flex items-center gap-2">
              Voir nos offres
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
