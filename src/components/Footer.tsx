import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-20">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-10 md:grid-cols-3">
        <div>
          <p className="text-3xl font-bold" style={{ fontFamily: '"Syne", sans-serif' }}>Ravito</p>
          <p className="mt-4 text-sm opacity-80 max-w-xs">Fait par des passionnés, pour des passionnés.</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest opacity-60 mb-4">Navigation</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/annonces" className="hover:opacity-80">Annonces</Link></li>
            <li><Link to="/publier" className="hover:opacity-80">Publier</Link></li>
            <li><Link to="/qui-sommes-nous" className="hover:opacity-80">Contact</Link></li>
          </ul>
        </div>
        <div className="md:text-right">
          <p className="text-xs uppercase tracking-widest opacity-60">France · 2026</p>
        </div>
      </div>
    </footer>
  );
}
