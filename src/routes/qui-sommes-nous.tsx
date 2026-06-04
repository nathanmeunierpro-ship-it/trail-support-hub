import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/qui-sommes-nous")({
  head: () => ({ meta: [{ title: "Qui sommes-nous — Ravito" }] }),
  component: QuiSommesNous,
});

function QuiSommesNous() {
  return (
    <PageShell>
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold uppercase mb-10" style={{ fontFamily: '"Syne", sans-serif' }}>
            Qui sommes-nous
          </h1>
          <div className="space-y-6 text-lg leading-relaxed text-foreground/90">
            <p>Ravito est né d'un constat simple : les organisateurs de trails et courses peinent à recruter des bénévoles, et les passionnés ont du mal à savoir où donner un coup de main.</p>
            <p>Notre mission : créer la plus grande communauté de bénévoles trail en France, et permettre aux organisateurs de trouver du renfort en quelques clics.</p>
            <p>Fait par des passionnés, pour des passionnés.</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
