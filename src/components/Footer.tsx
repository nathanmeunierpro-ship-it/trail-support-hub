import { Link } from "@tanstack/react-router";
import ravitoLogoWhite from "@/assets/ravito-logo-white.png.asset.json";

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.7 2.89 2.89 0 0 1-2.66-1.74 2.89 2.89 0 0 1-.23-1.13 2.89 2.89 0 0 1 5.2-1.72V8.66a6.33 6.33 0 0 0-1.04-.09A6.18 6.18 0 0 0 4.65 14.8a6.18 6.18 0 0 0 11.7 2.76V9.03A8.17 8.17 0 0 0 19.59 10V6.69z" />
    </svg>
  );
}

const navLinks = [
  { to: "/annonces", label: "Tous les événements" },
  { to: "/publier", label: "Publier un événement" },
  { to: "/benevoles", label: "Bénévoles" },
  { to: "/organisateurs", label: "Organisateurs" },
  { to: "/qui-sommes-nous", label: "Qui sommes-nous ?" },
];

const legalLinks = [
  { to: "/cgu", label: "CGU" },
  { to: "/mentions-legales", label: "Mentions légales" },
];

export function Footer() {
  return (
    <footer style={{ background: "#73CC30", color: "#1A1A1A" }}>
      {/* Desktop / Mobile wrapper */}
      <div
        className="footer-inner"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: "64px 80px 0",
        }}
      >
        {/* ── Colonne gauche ── */}
        <div style={{ flex: "0 1 auto", maxWidth: 280 }}>
          <Link to="/" aria-label="Ravito — Accueil">
            <img
              src={ravitoLogoWhite.url}
              alt="Ravito"
              className="h-40 w-auto"
              style={{ marginBottom: 12, display: "block" }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
                (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = "block";
              }}
            />
            <span className="font-display text-2xl font-black hidden" style={{ color: "#1A1A1A" }}>
              Ravito
            </span>
          </Link>

          <p
            style={{
              fontSize: 14,
              color: "#1A1A1A",
              opacity: 0.7,
              maxWidth: 260,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Fait par des passionnés, pour des passionnés du sport en France.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 10,
              marginTop: 20,
            }}
          >
            {[
              { href: "https://instagram.com", icon: <InstagramIcon /> },
              { href: "https://facebook.com", icon: <FacebookIcon /> },
              { href: "https://tiktok.com", icon: <TikTokIcon /> },
            ].map((s, i) => (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Réseau social"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "#1A1A1A",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "opacity 0.2s ease",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* ── Colonne centre ── */}
        <div style={{ flex: "0 1 auto" }}>
          <p
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "3px",
              fontWeight: 700,
              color: "#1A1A1A",
              marginBottom: 20,
              marginTop: 0,
            }}
          >
            NAVIGATION
          </p>
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              style={{
                fontSize: 15,
                color: "#1A1A1A",
                display: "block",
                marginBottom: 12,
                textDecoration: "none",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* ── Colonne droite ── */}
        <div style={{ flex: "0 1 auto" }}>
          <p
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "3px",
              fontWeight: 700,
              color: "#1A1A1A",
              marginBottom: 20,
              marginTop: 0,
            }}
          >
            LÉGAL
          </p>
          {legalLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              style={{
                fontSize: 15,
                color: "#1A1A1A",
                display: "block",
                marginBottom: 12,
                textDecoration: "none",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.6")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {l.label}
            </Link>
          ))}

          <p
            style={{
              fontSize: 11,
              letterSpacing: "2px",
              fontWeight: 700,
              color: "#1A1A1A",
              marginTop: 24,
              marginBottom: 0,
            }}
          >
            FRANCE · 2026
          </p>
        </div>
      </div>

      {/* ── Séparateur + copyright ── */}
      <div
        style={{
          width: "100%",
          height: 1,
          background: "#1A1A1A",
          opacity: 0.2,
          marginTop: 40,
        }}
      />
      <p
        style={{
          fontSize: 12,
          color: "#1A1A1A",
          opacity: 0.5,
          textAlign: "center",
          paddingBottom: 24,
          paddingTop: 16,
          margin: 0,
        }}
      >
        Ravito — Tous droits réservés
      </p>

      {/* ── Mobile overrides ── */}
      <style>{`
        @media (max-width: 768px) {
          .footer-inner {
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 48px 24px 0 !important;
            gap: 40px;
          }
        }
      `}</style>
    </footer>
  );
}
