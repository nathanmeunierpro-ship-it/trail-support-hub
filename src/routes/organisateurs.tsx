import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/organisateurs")({
  head: () => ({ meta: [{ title: "Organisateurs — Ravito" }] }),
  component: OrgPage,
});

function OrgPage() {
  return (
    <PageShell>
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold uppercase mb-10" style={{ fontFamily: '"Syne", sans-serif' }}>Organisateurs</h1>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
            Publie ton événement gratuitement et reçois des candidatures de bénévoles motivés en quelques jours.
          </p>
          <ul className="grid gap-6 md:grid-cols-2 mb-12">
            {[
              ["Publication gratuite", "Aucun frais. Ton annonce reste en ligne jusqu'à la date de l'événement."],
              ["Candidatures filtrées", "Profil, département, niveau, disponibilités — tu as tout pour choisir."],
              ["Gestion centralisée", "Un seul espace pour valider, refuser et suivre tes bénévoles."],
              ["Visibilité nationale", "Diffusion auprès de la communauté Ravito en France entière."],
            ].map(([t, d]) => (
              <li key={t} className="border-t-2 border-foreground pt-5">
                <h3 className="text-lg font-bold uppercase mb-2" style={{ fontFamily: '"Syne", sans-serif' }}>{t}</h3>
                <p className="text-muted-foreground">{d}</p>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-4">
            <Link to="/inscription" className="bg-secondary text-secondary-foreground px-8 py-4 rounded-md font-bold uppercase text-sm tracking-wider">
              Créer mon compte
            </Link>
            <Link to="/publier" className="border-2 border-foreground px-8 py-4 rounded-md font-bold uppercase text-sm tracking-wider">
              Publier une annonce
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
