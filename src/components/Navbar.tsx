import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, LayoutDashboard, LogOut, ChevronRight } from "lucide-react";
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
  const { session, role, signOut } = useAuth();
  const state = useRouterState();
  const currentPath = state.location.pathname;
  const dashboardLink = role === "organisateur" ? "/mon-espace" : "/mes-candidatures";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary shadow-md" style={{ boxShadow: "0 4px 20px color-mix(in srgb, var(--primary) 25%, transparent)" }}>
      <nav className="mx-auto max-w-7xl px-5 py-0">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" aria-label="Ravito — Accueil">
            <img src="/logo.png" alt="Ravito" className="h-10 object-contain" onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
              (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = "block";
            }} />
            <span className="font-display text-2xl font-black text-primary-foreground hidden">Ravito</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((l) => {
              const isActive = currentPath === l.to || currentPath.startsWith(l.to + "/");
              return (
                <li key={l.to} className="relative">
                  <Link
                    to={l.to}
                    className={`relative px-4 py-2 rounded-lg text-[13px] font-semibold uppercase tracking-wider transition-colors duration-200 ${
                      isActive ? "text-primary-foreground" : "text-primary-foreground/70 hover:text-primary-foreground"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-secondary"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {session ? (
              <>
                <Link
                  to={dashboardLink}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold uppercase tracking-wider text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  <LayoutDashboard size={14} />
                  Mon espace
                </Link>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={signOut}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold uppercase tracking-wider text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors"
                >
                  <LogOut size={14} />
                  Déconnexion
                </motion.button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/connexion"
                  className="text-[13px] font-semibold uppercase tracking-wider text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                >
                  Connexion
                </Link>
                <motion.div whileTap={{ scale: 0.96 }}>
                  <Link
                    to="/inscription"
                    className="flex items-center gap-1 px-5 py-2 rounded-xl bg-secondary text-secondary-foreground text-[13px] font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                    style={{ boxShadow: "var(--shadow-btn)" }}
                  >
                    S'inscrire <ChevronRight size={14} />
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="lg:hidden p-2 rounded-lg text-primary-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X size={22} />
                </motion.div>
              ) : (
                <motion.div key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu size={22} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden border-t border-primary-foreground/20"
          >
            <ul className="px-4 pb-5 pt-2 flex flex-col gap-1">
              {NAV_LINKS.map((l, i) => (
                <motion.li key={l.to} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider transition-colors ${
                      currentPath === l.to ? "bg-primary-foreground/15 text-primary-foreground" : "text-primary-foreground/70 hover:text-primary-foreground"
                    }`}
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
              {session ? (
                <>
                  <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: NAV_LINKS.length * 0.04 }}>
                    <Link to={dashboardLink} onClick={() => setOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider text-primary-foreground/70 hover:text-primary-foreground">
                      Mon espace
                    </Link>
                  </motion.li>
                  <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (NAV_LINKS.length + 1) * 0.04 }}>
                    <button onClick={() => { setOpen(false); signOut(); }} className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider text-destructive-foreground bg-destructive/80 hover:bg-destructive transition-colors">
                      Déconnexion
                    </button>
                  </motion.li>
                </>
              ) : (
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: NAV_LINKS.length * 0.04 }}>
                  <Link to="/inscription" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-xl bg-secondary text-secondary-foreground text-sm font-bold uppercase tracking-wider text-center mt-2">
                    S'inscrire
                  </Link>
                </motion.li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
