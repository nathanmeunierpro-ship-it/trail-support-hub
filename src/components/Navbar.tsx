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
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <nav className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center" aria-label="Ravito accueil">
            <img src={ravitoLogo} alt="Ravito" className="h-8 w-auto brightness-0 invert" />
          </Link>



          <ul className="hidden lg:flex items-center gap-7 text-[13px] font-bold uppercase tracking-wider">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="relative text-foreground hover:text-primary transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              {session ? (
                <div className="flex items-center gap-4">
                  <Link to={dashboardLink} className="hover:text-primary transition-colors">Mon espace</Link>
                  <button onClick={signOut} className="bg-primary text-primary-foreground px-5 py-2 rounded-full hover:bg-primary/90 transition">Déconnexion</button>
                </div>
              ) : (
                <Link to="/connexion" className="bg-primary text-primary-foreground px-5 py-2 rounded-full hover:bg-primary/90 transition">Se connecter</Link>
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
