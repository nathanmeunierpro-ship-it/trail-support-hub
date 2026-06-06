import { Link } from "@tanstack/react-router";
import ravitoLogoWhite from "@/assets/ravito-logo-white.png.asset.json";

export function Footer() {
  return (
    <footer style={{ background: "#73CC30", color: "#1A1A1A" }}>
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-10 md:grid-cols-3">
        <div>
          <Link to="/" aria-label="Ravito — Accueil">
            <img
              src={ravitoLogoWhite.url}
              alt="Ravito"
              style={{ height: 56, width: "auto" }}
              className="object-contain mb-4"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
                (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = "block";
              }}
            />
            <span className="font-display text-2xl font-black hidden" style={{ color: "#1A1A1A" }}>Ravito</span>
          </Link>
          <p className="text-sm max-w-xs leading-relaxed" style={{ color: "#1A1A1A", opacity: 0.85 }}>
            Fait par des passionnés, pour des passionnés du trail en France.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest mb-5 font-semibold" style={{ color: "#1A1A1A", opacity: 0.7 }}>Navigation</p>
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
                  className="hover:underline transition-opacity"
                  style={{ color: "#1A1A1A" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:text-right">
          <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "#1A1A1A", opacity: 0.7 }}>France · 2026</p>
          <p className="text-sm mt-3" style={{ color: "#1A1A1A", opacity: 0.85 }}>Ravito — Tous droits réservés</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 md:justify-end">
            <Link to="/cgu" className="text-xs hover:underline" style={{ color: "#1A1A1A", opacity: 0.85 }}>CGU</Link>
            <Link to="/mentions-legales" className="text-xs hover:underline" style={{ color: "#1A1A1A", opacity: 0.85 }}>Mentions légales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
