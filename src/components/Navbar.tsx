import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";

const NAV_LINKS = [
  { to: "/annonces", label: "Les courses" },
  { to: "/benevoles", label: "Bénévoles" },
  { to: "/organisateurs", label: "Organisateurs" },
  { to: "/qui-sommes-nous", label: "À propos" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { session, role, signOut } = useAuth();
  const state = useRouterState();
  const currentPath = state.location.pathname;
  const dashboardLink = role === "organisateur" ? "/mon-espace" : "/mes-candidatures";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav
        className={`mx-auto max-w-7xl rounded-full bg-primary transition-shadow duration-300 ${
          scrolled ? "shadow-[0_10px_30px_-10px_rgba(29,111,232,0.55)]" : "shadow-[0_4px_16px_-8px_rgba(29,111,232,0.35)]"
        }`}
      >
        <div className="flex items-center justify-between h-14 pl-3 pr-2">
          {/* Logo */}
          <Link to="/" aria-label="Ravito — Accueil" className="flex items-center pl-2">
            <img
              src="/logo.png"
              alt="Ravito"
              className="h-8 object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
                (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = "block";
              }}
            />
            <span className="font-display text-xl font-black text-primary-foreground hidden">Ravito</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((l) => {
              const isActive = currentPath === l.to || currentPath.startsWith(l.to + "/");
              return (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className={`px-4 py-2 rounded-full text-[13px] font-bold uppercase tracking-wider transition-colors ${
                      isActive
                        ? "text-primary bg-primary-foreground"
                        : "text-primary-foreground/85 hover:text-primary-foreground"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-2">
            {session ? (
              <>
                <Link
                  to={dashboardLink}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold uppercase tracking-wider text-primary-foreground/85 hover:text-primary-foreground transition-colors"
                >
                  <LayoutDashboard size={14} />
                  Mon espace
                </Link>
                <button
                  onClick={signOut}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold uppercase tracking-wider bg-primary-foreground text-primary hover:opacity-90 transition-opacity"
                >
                  <LogOut size={14} />
                  Déconnexion
                </button>
              </>
            ) : (
              <Link
                to="/connexion"
                className="px-5 py-2.5 rounded-full bg-primary-foreground text-primary text-[13px] font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                Se connecter
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 mr-1 rounded-full text-primary-foreground bg-primary-foreground/10"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden mt-2 mx-auto max-w-7xl rounded-3xl bg-primary p-4 shadow-xl"
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider ${
                      currentPath === l.to
                        ? "bg-primary-foreground text-primary"
                        : "text-primary-foreground/85 hover:bg-primary-foreground/10"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              {session ? (
                <>
                  <li>
                    <Link to={dashboardLink} onClick={() => setOpen(false)} className="block px-4 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider text-primary-foreground/85">
                      Mon espace
                    </Link>
                  </li>
                  <li>
                    <button onClick={() => { setOpen(false); signOut(); }} className="w-full text-left px-4 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider bg-primary-foreground text-primary mt-1">
                      Déconnexion
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/connexion" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-2xl bg-primary-foreground text-primary text-sm font-bold uppercase tracking-wider text-center mt-1">
                    Se connecter
                  </Link>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
