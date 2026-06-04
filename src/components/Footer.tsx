import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-10 md:grid-cols-3">
        <div>
          <Link to="/" aria-label="Ravito — Accueil">
            <img
              src="/logo.png"
              alt="Ravito"
              className="h-8 object-contain brightness-0 invert mb-4"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
                (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = "block";
              }}
            />
            <span className="font-display text-2xl font-black text-primary-foreground hidden">Ravito</span>
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
                <Link to={l.to} className="opacity-70 hover:opacity-100 transition-opacity">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:text-right">
          <p className="text-xs uppercase tracking-widest opacity-50 font-semibold">France · 2026</p>
          <p className="text-sm opacity-60 mt-3">Ravito — Tous droits réservés</p>
        </div>
      </div>
    </footer>
  );
}
