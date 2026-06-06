import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import ravitoLogoWhite from "@/assets/ravito-logo-white.png.asset.json";

type NavLink = {
  to: string;
  label: string;
  children?: { href: string; label: string }[];
};

const NAV_LINKS: NavLink[] = [
  { to: "/annonces", label: "Les courses" },
  { to: "/benevoles", label: "Bénévoles" },
  {
    to: "/organisateurs",
    label: "Organisateurs",
    children: [
      { href: "/organisateurs/comment-ca-marche", label: "Comment ça marche" },
      { href: "/organisateurs/nos-offres", label: "Nos offres" },
    ],
  },
  { to: "/qui-sommes-nous", label: "À propos" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileSub, setMobileSub] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLUListElement | null>(null);
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

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
        <nav
          className={`mx-auto max-w-7xl rounded-full bg-primary transition-shadow duration-300 ${
            scrolled ? "shadow-[0_10px_30px_-10px_rgba(115,204,48,0.55)]" : "shadow-[0_4px_16px_-8px_rgba(115,204,48,0.35)]"
          }`}
        >
        <div className="flex items-center justify-between h-14 pl-3 pr-2">
          {/* Logo */}
          <Link to="/" aria-label="Ravito — Accueil" className="flex items-center pl-2">
            <img
              src={ravitoLogoWhite.url}
              alt="Ravito"
              style={{ height: 56, width: "auto" }}
              className="object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
                (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = "block";
              }}
            />
            <span className="font-display text-xl font-black text-primary-foreground hidden">Ravito</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
            {NAV_LINKS.map((l) => {
              const isActive = currentPath === l.to || currentPath.startsWith(l.to + "/");
              if (l.children) {
                const isOpen = openDropdown === l.to;
                return (
                  <li
                    key={l.to}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(l.to)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      onClick={() => setOpenDropdown(isOpen ? null : l.to)}
                      className={`flex items-center gap-1 px-4 py-2 rounded-full text-[13px] font-bold uppercase tracking-wider transition-colors ${
                        isActive
                          ? "text-primary bg-primary-foreground"
                          : "text-primary-foreground/85 hover:text-primary-foreground"
                      }`}
                    >
                      {l.label}
                      <ChevronDown size={12} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-1/2 -translate-x-1/2 top-full pt-3 min-w-[220px] z-50"
                        >
                          <div className="bg-white rounded-xl shadow-[0_12px_32px_-8px_rgba(0,0,0,0.18)] py-2 overflow-hidden ring-1 ring-black/5">
                            {l.children.map((c) => (
                              <Link
                                key={c.href}
                                to={c.href}
                                onClick={() => setOpenDropdown(null)}
                                className="block px-4 py-2.5 text-sm font-semibold text-[var(--color-text)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                              >
                                {c.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              }
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
              <div className="flex items-center gap-2">
                <Link to="/connexion" className="btn-secondary">
                  Se connecter
                </Link>
                <Link to="/inscription" className="btn-primary">
                  S'inscrire
                </Link>
              </div>
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
              {NAV_LINKS.map((l) => {
                if (l.children) {
                  const isSubOpen = mobileSub === l.to;
                  return (
                    <li key={l.to}>
                      <button
                        onClick={() => setMobileSub(isSubOpen ? null : l.to)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold uppercase tracking-wider text-primary-foreground/85 hover:bg-primary-foreground/10"
                      >
                        {l.label}
                        <ChevronDown size={14} className={`transition-transform ${isSubOpen ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {isSubOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden pl-3"
                          >
                            {l.children.map((c) => (
                              <Link
                                key={c.href}
                                to={c.href}
                                onClick={() => { setOpen(false); setMobileSub(null); }}
                                className="block px-4 py-2.5 text-sm font-semibold text-primary-foreground/80 hover:text-primary-foreground"
                              >
                                · {c.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                }
                return (
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
                );
              })}
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
                <>
                  <li className="mt-1">
                    <Link
                      to="/connexion"
                      onClick={() => setOpen(false)}
                      className="btn-secondary w-full"
                    >
                      Se connecter
                    </Link>
                  </li>
                  <li className="mt-1">
                    <Link
                      to="/inscription"
                      onClick={() => setOpen(false)}
                      className="btn-primary w-full"
                    >
                      S'inscrire
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
