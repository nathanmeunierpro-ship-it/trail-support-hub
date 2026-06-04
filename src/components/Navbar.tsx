import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import ravitoLogo from "@/assets/ravito-logo.png";

const links = [
  { to: "/annonces", label: "Les courses" },
  { to: "/benevoles", label: "Bénévoles" },
  { to: "/organisateurs", label: "Organisateurs" },
  { to: "/qui-sommes-nous", label: "Qui sommes-nous" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { session, role, signOut } = useAuth();
  const dashboardLink = role === "organisateur" ? "/mon-espace" : "/mes-candidatures";

  return (
    <header className="fixed top-4 left-4 right-4 z-50">
      <nav className="mx-auto max-w-7xl rounded-full bg-primary text-primary-foreground shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center" aria-label="Ravito accueil">
            <img src={ravitoLogo} alt="Ravito" className="h-8 w-auto" />
          </Link>


          <ul className="hidden lg:flex items-center gap-7 text-[13px] font-bold uppercase tracking-wider">
            {links.map((l) => (
              <li key={l.to}><Link to={l.to} className="hover:opacity-80 transition-opacity">{l.label}</Link></li>
            ))}
            <li>
              {session ? (
                <div className="flex items-center gap-4">
                  <Link to={dashboardLink} className="hover:opacity-80">Mon espace</Link>
                  <button onClick={signOut} className="hover:opacity-80">Déconnexion</button>
                </div>
              ) : (
                <Link to="/connexion" className="hover:opacity-80">Se connecter</Link>
              )}
            </li>
          </ul>

          <button className="lg:hidden p-1" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <ul className="lg:hidden flex flex-col gap-3 px-6 pb-5 text-sm font-bold uppercase tracking-wider">
            {links.map((l) => (
              <li key={l.to}><Link to={l.to} onClick={() => setOpen(false)}>{l.label}</Link></li>
            ))}
            {session ? (
              <>
                <li><Link to={dashboardLink} onClick={() => setOpen(false)}>Mon espace</Link></li>
                <li><button onClick={() => { setOpen(false); signOut(); }}>Déconnexion</button></li>
              </>
            ) : (
              <li><Link to="/connexion" onClick={() => setOpen(false)}>Se connecter</Link></li>
            )}
          </ul>
        )}
      </nav>
    </header>
  );
}
