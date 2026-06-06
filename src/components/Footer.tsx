import { Link } from "@tanstack/react-router";
import ravitoLogoWhite from "@/assets/ravito-logo-white.png.asset.json";

export function Footer() {
  return (
    <footer className="section-dark" style={{ background: "var(--color-bg-dark)" }}>
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-10 md:grid-cols-3">
        <div>
          <Link to="/" aria-label="Ravito — Accueil">
            <img
              src={ravitoLogoWhite.url}
              alt="Ravito"
              className="h-8 object-contain mb-4"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
                (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = "block";
              }}
            />
            <span className="font-display text-2xl font-black hidden" style={{ color: "var(--color-text-light)" }}>Ravito</span>
          </Link>
          <p className="text-sm opacity-70 max-w-xs leading-relaxed">
            Fait par des passionnés, pour des passionnés du trail en France.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest opacity-50 mb-5 font-semibold">Navigation</p>
          <ul className="space-y-3 text-sm">
            {[
              { to: "/annonces", label: "Tous les événements" },
              { to: "/publier", label: "Publier un événement" },
              { to: "/benevoles", label: "Bénévoles" },
              { to: "/organisateurs", label: "Organisateurs" },
              { to: "/qui-sommes-nous", label: "À propos" },
            ].map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="opacity-80 hover:opacity-100 transition-opacity"
                  style={{ color: "var(--color-text-light)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-accent)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-text-light)"; }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:text-right">
          <p className="text-xs uppercase tracking-widest opacity-50 font-semibold">France · 2026</p>
          <p className="text-sm opacity-60 mt-3">Ravito — Tous droits réservés</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 md:justify-end">
            <Link to="/cgu" className="text-xs opacity-60 hover:opacity-100 transition-opacity">CGU</Link>
            <Link to="/mentions-legales" className="text-xs opacity-60 hover:opacity-100 transition-opacity">Mentions légales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
