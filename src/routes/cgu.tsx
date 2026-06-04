import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/cgu")({
  head: () => ({
    meta: [
      { title: "Conditions Générales d'Utilisation — Ravito" },
      { name: "description", content: "Conditions générales d'utilisation de la plateforme Ravito." },
    ],
  }),
  component: CguPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-display text-xl font-black mb-4 text-primary">{title}</h2>
      <div className="text-foreground/80 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

function CguPage() {
  return (
    <PageShell>
      <div className="px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl font-black mb-2">Conditions Générales d'Utilisation</h1>
          <p className="text-muted-foreground mb-12">Dernière mise à jour : juin 2026</p>

          <Section title="1. Présentation de la plateforme">
            <p>Ravito est une plateforme de mise en relation entre bénévoles et organisateurs d'événements sportifs (trails, running, vélo, triathlon, cyclosportives) en France. Elle est éditée par Ravito, dont les coordonnées sont précisées dans les Mentions Légales.</p>
            <p>L'accès et l'utilisation de la plateforme impliquent l'acceptation pleine et entière des présentes CGU.</p>
          </Section>

          <Section title="2. Accès au service">
            <p>Le service est accessible gratuitement à tout utilisateur disposant d'un accès internet. La création d'un compte est nécessaire pour postuler en tant que bénévole ou publier une annonce en tant qu'organisateur.</p>
            <p>L'utilisateur s'engage à fournir des informations exactes lors de son inscription et à les maintenir à jour.</p>
          </Section>

          <Section title="3. Comptes utilisateurs">
            <p><strong>Bénévoles :</strong> En s'inscrivant comme bénévole, l'utilisateur peut consulter les annonces publiées et postuler aux événements qui l'intéressent.</p>
            <p><strong>Organisateurs :</strong> En s'inscrivant comme organisateur, l'utilisateur peut publier des annonces de bénévolat pour ses événements sportifs.</p>
            <p>Chaque utilisateur est responsable de la confidentialité de ses identifiants de connexion. Ravito ne saurait être tenu responsable de tout accès non autorisé à un compte.</p>
          </Section>

          <Section title="4. Publication d'annonces">
            <p>Les organisateurs s'engagent à ne publier que des annonces licites, exactes et relatives à des événements sportifs réels. Toute annonce frauduleuse, trompeuse ou contraire à l'ordre public est interdite et peut entraîner la suppression du compte.</p>
            <p>Ravito se réserve le droit de supprimer toute annonce ne respectant pas ces conditions, sans préavis.</p>
          </Section>

          <Section title="5. Responsabilités">
            <p>Ravito agit uniquement comme intermédiaire technique entre bénévoles et organisateurs. Elle n'est pas partie aux engagements pris entre ces derniers et ne peut être tenue responsable de l'exécution ou de l'inexécution de ces engagements.</p>
            <p>Ravito ne garantit pas la disponibilité permanente du service et peut interrompre l'accès pour maintenance sans préavis.</p>
          </Section>

          <Section title="6. Propriété intellectuelle">
            <p>Tous les contenus présents sur la plateforme Ravito (logo, textes, interface, code) sont protégés par les droits de propriété intellectuelle. Toute reproduction sans autorisation expresse est interdite.</p>
            <p>Les utilisateurs accordent à Ravito une licence non exclusive d'utilisation des contenus qu'ils publient sur la plateforme, dans le but de faire fonctionner le service.</p>
          </Section>

          <Section title="7. Données personnelles">
            <p>Ravito collecte et traite les données personnelles conformément à sa politique de confidentialité et au RGPD (Règlement Général sur la Protection des Données). Voir les Mentions Légales pour plus d'informations.</p>
            <p>L'utilisateur dispose d'un droit d'accès, de rectification, de suppression et de portabilité de ses données en contactant : <strong>contact@ravito.fr</strong>.</p>
          </Section>

          <Section title="8. Cookies">
            <p>La plateforme Ravito utilise des cookies techniques nécessaires au fonctionnement du service (authentification, préférences). Aucun cookie publicitaire ou de pistage tiers n'est utilisé.</p>
          </Section>

          <Section title="9. Modification des CGU">
            <p>Ravito se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification substantielle par email ou via la plateforme. L'utilisation continue du service après modification vaut acceptation des nouvelles CGU.</p>
          </Section>

          <Section title="10. Droit applicable">
            <p>Les présentes CGU sont soumises au droit français. Tout litige relatif à leur interprétation ou à leur exécution sera soumis aux tribunaux compétents de Paris.</p>
          </Section>
        </div>
      </div>
    </PageShell>
  );
}
