import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Target, Zap } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/qui-sommes-nous")({
  head: () => ({
    meta: [
      { title: "Qui sommes-nous ? — Ravito" },
      {
        name: "description",
        content:
          "Ravito connecte les bénévoles passionnés aux organisateurs de trails, courses, triathlons et cyclosportives partout en France.",
      },
    ],
  }),
  component: QuiSommesNous,
});

const VALUES = [
  {
    icon: <Heart size={32} />,
    title: "La passion avant tout",
    desc: "Ravito est né d'un amour pour le sport et l'engagement bénévole. Chaque fonctionnalité est pensée pour les passionnés.",
  },
  {
    icon: <Target size={32} />,
    title: "Simplicité et efficacité",
    desc: "Publier une annonce ou postuler ne doit pas prendre plus de 2 minutes. On fait le maximum pour que ce soit le cas.",
  },
  {
    icon: <Zap size={32} />,
    title: "Gratuit, toujours",
    desc: "Ni frais d'inscription, ni commissions. Ravito restera toujours gratuit pour les bénévoles et les organisateurs.",
  },
];

function QuiSommesNous() {
  return (
    <PageShell>
      {/* Hero noir */}
      <section
        style={{
          background: "#1A1A1A",
          padding: "80px 60px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-5xl"
        >
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(48px, 8vw, 72px)",
              color: "#73CC30",
              lineHeight: 1,
              letterSpacing: "1px",
              margin: 0,
            }}
          >
            QUI SOMMES-NOUS ?
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 18,
              color: "#FFFFFF",
              maxWidth: 600,
              lineHeight: 1.6,
              marginTop: 24,
              marginBottom: 0,
            }}
          >
            Ravito connecte les bénévoles passionnés aux organisateurs d'événements
            sportifs partout en France. Fait par des sportifs, pour des sportifs.
          </p>
        </motion.div>
      </section>

      {/* Section mission */}
      <section
        style={{
          background: "#f0f7e6",
          padding: "80px 60px",
        }}
      >
        <div className="mx-auto" style={{ maxWidth: 680 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 28,
                color: "#1A1A1A",
                letterSpacing: "0.5px",
                marginBottom: 20,
              }}
            >
              NOTRE MISSION
            </h2>
            <div
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 16,
                lineHeight: 1.8,
                color: "#1A1A1A",
              }}
            >
              <p style={{ marginBottom: 20 }}>
                Ravito est né d'un constat simple : les organisateurs de trails,
                courses à pied, cyclosportives et triathlons peinent à recruter
                des bénévoles, et les passionnés ont du mal à savoir où donner
                un coup de main.
              </p>
              <p style={{ marginBottom: 20 }}>
                Notre mission est claire : créer la plus grande communauté de
                bénévoles sport en France, et permettre aux organisateurs de
                trouver du renfort en quelques clics — gratuitement, sans
                friction.
              </p>
              <p style={{ marginBottom: 0 }}>
                Fait par des sportifs passionnés, pour des sportifs passionnés.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cards valeurs */}
      <section style={{ background: "#FFFFFF", padding: "80px 60px" }}>
        <div className="mx-auto max-w-6xl">
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 28,
              color: "#1A1A1A",
              letterSpacing: "0.5px",
              marginBottom: 40,
              textAlign: "center",
            }}
          >
            NOS VALEURS
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                style={{
                  background: "#FFFFFF",
                  borderRadius: 16,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  padding: 32,
                }}
              >
                <div style={{ color: "#73CC30", marginBottom: 16 }}>
                  {v.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 22,
                    color: "#1A1A1A",
                    letterSpacing: "0.5px",
                    marginBottom: 12,
                  }}
                >
                  {v.title.toUpperCase()}
                </h3>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    color: "#666",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link to="/annonces" className="btn-cta inline-flex items-center gap-2">
              Voir les événements <ArrowRight size={16} />
            </Link>
            <Link to="/inscription" className="btn-outline inline-flex items-center gap-2">
              Créer un compte
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
