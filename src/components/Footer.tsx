import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import ravitoLogoWhite from "@/assets/ravito-logo-white.png.asset.json";
import { NB_BENEVOLES, PRIX_ANNONCE } from "@/lib/site";

const COLS: { title: string; links: { to: string; label: string }[] }[] = [
  {
    title: "Bénévoles",
    links: [
      { to: "/annonces", label: "Toutes les courses" },
      { to: "/benevoles", label: "Devenir bénévole" },
      { to: "/benevole/trail", label: "Bénévole trail" },
      { to: "/benevole/course-a-pied", label: "Bénévole course à pied" },
      { to: "/benevole/triathlon", label: "Bénévole triathlon" },
      { to: "/benevole/cyclisme", label: "Bénévole cyclisme" },
      { to: "/mes-candidatures", label: "Mes candidatures" },
    ],
  },
  {
    title: "Organisateurs",
    links: [
      { to: "/organisateurs/comment-ca-marche", label: "Comment ça marche" },
      { to: "/organisateurs/nos-offres", label: `Tarif — ${PRIX_ANNONCE}` },
      { to: "/publier", label: "Publier ma course" },
    ],
  },
  {
    title: "Ravito",
    links: [
      { to: "/qui-sommes-nous", label: "Qui sommes-nous ?" },
      { to: "/cgu", label: "CGU" },
      { to: "/mentions-legales", label: "Mentions légales" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[#0F0F0F] text-white">
      {/* Bandeau CTA */}
      <div className="border-b border-white/10 px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <p className="font-display text-4xl leading-none md:text-5xl [&_span]:font-display">
            Rejoins les <span className="text-primary">+{NB_BENEVOLES} bénévoles</span> Ravito
          </p>
          <Link to="/inscription" search={{ role: "benevole" }} className="btn-primary gap-2">
            Je m'inscris gratuitement <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 md:grid-cols-[1.3fr_repeat(3,1fr)]">
        <div>
          <Link to="/" aria-label="Ravito — Accueil" className="inline-block">
            <img
              src={ravitoLogoWhite.url}
              alt="Ravito"
              width={587}
              height={244}
              className="h-14 w-auto"
              loading="lazy"
            />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
            La plateforme qui met en relation bénévoles et organisateurs de trails, courses,
            triathlons et cyclosportives partout en France.
          </p>
        </div>
        {COLS.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.25em] text-primary">
              {c.title}
            </p>
            <ul className="space-y-3">
              {c.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-white/75 transition hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/10 px-6 py-6">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 text-xs text-white/40 md:flex-row">
          <span>© {new Date().getFullYear()} Ravito — Tous droits réservés</span>
          <span>Fait avec passion en France 🇫🇷</span>
        </div>
      </div>
    </footer>
  );
}
