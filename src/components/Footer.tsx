import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-20 text-white" style={{ backgroundColor: "#0A1209" }}>
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-10 md:grid-cols-3">
        <div>
          <p className="text-3xl font-bold text-white" style={{ fontFamily: '"Syne", sans-serif' }}>Ravito</p>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">Fait par des passionnés, pour des passionnés.</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Navigation</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/annonces" className="text-muted-foreground hover:text-primary transition-colors">Annonces</Link></li>
            <li><Link to="/publier" className="text-muted-foreground hover:text-primary transition-colors">Publier</Link></li>
            <li><Link to="/qui-sommes-nous" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div className="md:text-right">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">France · 2026</p>
        </div>
      </div>
    </footer>
  );
}
