import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { privatePage, CONTACT_EMAIL } from "@/lib/site";

/** Page de retour après paiement Stripe du Pack Organisateur. */
export const Route = createFileRoute("/paiement-confirme")({
  head: () => privatePage("Paiement confirmé"),
  component: Page,
});

function Page() {
  return (
    <PageShell>
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-10 text-center ring-1 ring-black/5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.3)]">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <CheckCircle2 size={42} className="text-[#3d6e1a]" />
          </div>
          <h1 className="text-5xl leading-none">Merci, paiement reçu !</h1>
          <p className="mt-4 text-black/65">
            Ton Pack Organisateur est réglé. Ta facture arrive par e-mail et ton annonce est
            diffusée auprès des bénévoles Ravito. Tu recevras un e-mail à chaque nouvelle
            candidature.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/mon-espace" className="btn-primary gap-2">
              Mon espace <ArrowRight size={16} />
            </Link>
            <Link to="/publier" className="btn-outline">
              Publier une autre course
            </Link>
          </div>
          <p className="mt-6 text-xs text-black/45">
            Une question ? Écris-nous à{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
