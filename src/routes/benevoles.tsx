import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/benevoles")({
  head: () => ({ meta: [{ title: "Bénévoles — Ravito" }] }),
  component: BenevolesPage,
});

function BenevolesPage() {
  return (
    <PageShell>
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold uppercase mb-10" style={{ fontFamily: '"Syne", sans-serif' }}>Bénévoles</h1>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
            Tu adores l'ambiance des courses et tu veux contribuer ? Rejoins le réseau Ravito et choisis les événements qui te parlent.
          </p>
          <ul className="grid gap-6 md:grid-cols-2 mb-12">
            {[
              ["Trouve un trail près de chez toi", "Filtre les annonces par région, type de sport, date."],
              ["Postule en un clic", "Un seul formulaire, l'organisateur te répond."],
              ["Suis tes candidatures", "En attente, accepté ou refusé — tout est centralisé."],
              ["Rejoins la communauté", "Des centaines de bénévoles partout en France."],
            ].map(([t, d]) => (
              <li key={t} className="border-t-2 border-foreground pt-5">
                <h3 className="text-lg font-bold uppercase mb-2" style={{ fontFamily: '"Syne", sans-serif' }}>{t}</h3>
                <p className="text-muted-foreground">{d}</p>
              </li>
            ))}
          </ul>
          <Link to="/inscription" className="bg-primary text-primary-foreground px-8 py-4 rounded-md font-bold uppercase text-sm tracking-wider">
            Je m'inscris comme bénévole
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
