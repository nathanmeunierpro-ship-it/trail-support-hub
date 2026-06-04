import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions Légales — Ravito" },
      { name: "description", content: "Mentions légales de la plateforme Ravito." },
    ],
  }),
  component: MentionsLegalesPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-display text-xl font-black mb-4 text-primary">{title}</h2>
      <div className="text-foreground/80 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

function MentionsLegalesPage() {
  return (
    <PageShell>
      <div className="px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl font-black mb-2">Mentions Légales</h1>
          <p className="text-muted-foreground mb-12">Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance en l'économie numérique.</p>

          <Section title="1. Éditeur du site">
            <p><strong>Dénomination :</strong> Ravito</p>
            <p><strong>Forme juridique :</strong> Entreprise individuelle</p>
            <p><strong>Email :</strong> contact@ravito.fr</p>
            <p><strong>Directeur de la publication :</strong> L'équipe Ravito</p>
          </Section>

          <Section title="2. Hébergement">
            <p><strong>Hébergeur front-end :</strong> Vercel Inc., 340 Pine Street, Suite 900, San Francisco, CA 94104, États-Unis — <a href="https://vercel.com" className="text-primary hover:underline">vercel.com</a></p>
            <p><strong>Base de données et authentification :</strong> Supabase Inc., 970 Toa Payoh North, #07-04, Singapore 318992 — <a href="https://supabase.com" className="text-primary hover:underline">supabase.com</a></p>
          </Section>

          <Section title="3. Propriété intellectuelle">
            <p>L'ensemble du contenu de ce site (textes, images, logo, interface graphique, code source) est la propriété exclusive de Ravito, protégé par les lois françaises et internationales sur la propriété intellectuelle.</p>
            <p>Toute reproduction, représentation, modification ou exploitation non autorisée est strictement interdite.</p>
          </Section>

          <Section title="4. Données personnelles et RGPD">
            <p>Ravito traite des données personnelles dans le cadre de la mise en relation entre bénévoles et organisateurs d'événements sportifs.</p>
            <p><strong>Responsable du traitement :</strong> Ravito — contact@ravito.fr</p>
            <p><strong>Finalités du traitement :</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Gestion des comptes utilisateurs (bénévoles et organisateurs)</li>
              <li>Mise en relation entre bénévoles et organisateurs</li>
              <li>Envoi de communications transactionnelles (confirmations, notifications)</li>
            </ul>
            <p><strong>Base légale :</strong> Exécution d'un contrat (CGU) et intérêt légitime.</p>
            <p><strong>Conservation des données :</strong> Les données sont conservées pendant la durée d'utilisation du compte, puis archivées 3 ans après la suppression du compte conformément aux obligations légales.</p>
            <p><strong>Vos droits :</strong> Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression, de portabilité et d'opposition. Pour exercer ces droits : <strong>contact@ravito.fr</strong>.</p>
            <p>Vous pouvez également introduire une réclamation auprès de la CNIL (<a href="https://www.cnil.fr" className="text-primary hover:underline">cnil.fr</a>).</p>
          </Section>

          <Section title="5. Cookies">
            <p>Ravito utilise uniquement des cookies techniques strictement nécessaires au fonctionnement du service :</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Cookies d'authentification (session Supabase)</li>
              <li>Cookies de préférences d'interface</li>
            </ul>
            <p>Aucun cookie publicitaire, de profilage ou de suivi tiers n'est déposé sur votre terminal. Aucun consentement n'est donc requis pour ces cookies.</p>
          </Section>

          <Section title="6. Limitation de responsabilité">
            <p>Ravito s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées. Cependant, Ravito ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition et ne peut être tenu responsable des omissions, inexactitudes ou carences dans la mise à jour.</p>
            <p>Ravito ne peut être tenu responsable des dommages directs et indirects causés au matériel de l'utilisateur lors de l'accès au site.</p>
          </Section>

          <Section title="7. Droit applicable">
            <p>Les présentes mentions légales sont soumises au droit français. Tout litige relatif à leur interprétation sera soumis aux tribunaux compétents de Paris.</p>
          </Section>
        </div>
      </div>
    </PageShell>
  );
}
