import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Lightbulb } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { EventCard } from "@/components/EventCard";
import { fetchUpcomingEvents } from "@/lib/events";
import { DISCIPLINES, findDiscipline } from "@/lib/disciplines";
import { seo, jsonLd, SITE_URL, NB_BENEVOLES } from "@/lib/site";

export const Route = createFileRoute("/benevole/$discipline")({
  loader: async ({ params }) => {
    const d = findDiscipline(params.discipline);
    if (!d) throw notFound();
    const events = (await fetchUpcomingEvents()).filter((e) => e.type_sport === d.sport);
    return { slug: d.slug, events };
  },
  head: ({ loaderData }) => {
    const d = loaderData && findDiscipline(loaderData.slug);
    if (!d) return { meta: [{ title: "Page introuvable | Ravito" }, { name: "robots", content: "noindex" }] };
    const path = `/benevole/${d.slug}`;
    return {
      ...seo({ title: `${d.title} | Ravito`, description: d.description, path }),
      scripts: [
        jsonLd({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Devenir bénévole", item: `${SITE_URL}/benevoles` },
            { "@type": "ListItem", position: 3, name: d.label, item: `${SITE_URL}${path}` },
          ],
        }),
        jsonLd({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: d.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
        ...(loaderData.events.length
          ? [
              jsonLd({
                "@context": "https://schema.org",
                "@type": "ItemList",
                name: `${d.label} : courses qui recherchent des bénévoles`,
                itemListElement: loaderData.events.slice(0, 30).map((e, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  url: `${SITE_URL}/annonce/${e.id}`,
                  name: e.nom,
                })),
              }),
            ]
          : []),
      ],
    };
  },
  component: DisciplinePage,
});

function DisciplinePage() {
  const { slug, events } = Route.useLoaderData();
  const d = findDiscipline(slug)!;
  const autres = DISCIPLINES.filter((x) => x.slug !== d.slug);

  return (
    <PageShell>
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <nav aria-label="Fil d'Ariane" className="mb-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Accueil</Link>
            <span className="mx-2">/</span>
            <Link to="/benevoles" className="hover:text-primary">Devenir bénévole</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{d.label}</span>
          </nav>

          <h1 className="font-display text-4xl md:text-6xl font-black mb-6">{d.h1}</h1>
          <div className="max-w-3xl space-y-4 text-lg text-muted-foreground leading-relaxed mb-10">
            {d.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 mb-16">
            <Link to="/inscription" search={{ role: "benevole" }} className="btn-cta inline-flex items-center gap-2">
              Créer mon compte gratuit <ArrowRight size={16} />
            </Link>
            <Link to="/annonces" search={{ sport: d.sport }} className="btn-outline inline-flex items-center gap-2">
              Voir toutes les courses
            </Link>
          </div>

          <h2 className="font-display text-3xl font-black mb-6">
            {d.label} : les courses qui recherchent des bénévoles
          </h2>
          {events.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
              {events.slice(0, 9).map((ev, i) => (
                <EventCard key={ev.id} ev={ev} eager={i < 3} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card p-6 mb-16">
              <p className="text-muted-foreground">
                Aucune course de cette discipline n'est en ligne pour le moment. De nouvelles annonces arrivent
                chaque semaine : crée ton compte pour être prévenu, ou regarde{" "}
                <Link to="/annonces" className="font-bold text-primary hover:underline">
                  toutes les courses à venir
                </Link>
                .
              </p>
            </div>
          )}

          <h2 className="font-display text-3xl font-black mb-6">Les missions des bénévoles</h2>
          <div className="grid gap-4 md:grid-cols-2 mb-16">
            {d.missions.map((m) => (
              <div key={m.titre} className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-display text-lg font-black mb-1 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-primary" /> {m.titre}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{m.texte}</p>
              </div>
            ))}
          </div>

          <h2 className="font-display text-3xl font-black mb-6">Nos conseils pour ta première mission</h2>
          <ul className="space-y-3 mb-16 max-w-3xl">
            {d.conseils.map((c) => (
              <li key={c} className="flex gap-3 text-muted-foreground leading-relaxed">
                <Lightbulb size={18} className="mt-1 flex-shrink-0 text-primary" /> {c}
              </li>
            ))}
          </ul>

          <h2 className="font-display text-3xl font-black mb-6">Questions fréquentes</h2>
          <div className="space-y-3 mb-16 max-w-3xl">
            {d.faq.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-border bg-card p-5">
                <summary className="cursor-pointer font-bold">{f.q}</summary>
                <p className="mt-3 text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>

          <div className="rounded-3xl bg-[#0F0F0F] p-8 text-white mb-12">
            <p className="font-display text-2xl md:text-3xl font-black mb-2">
              Rejoins les +{NB_BENEVOLES} bénévoles Ravito
            </p>
            <p className="text-white/70 mb-6">Inscription gratuite, candidature en un clic.</p>
            <Link to="/inscription" search={{ role: "benevole" }} className="btn-cta inline-flex items-center gap-2">
              Je deviens bénévole <ArrowRight size={16} />
            </Link>
          </div>

          <h2 className="font-display text-2xl font-black mb-4">Bénévole sur d'autres sports</h2>
          <div className="flex flex-wrap gap-3 mb-8">
            {autres.map((x) => (
              <Link
                key={x.slug}
                to="/benevole/$discipline"
                params={{ discipline: x.slug }}
                className="rounded-full border border-border px-4 py-2 text-sm font-bold hover:border-primary hover:text-primary"
              >
                Bénévole {x.label.toLowerCase()}
              </Link>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Tu organises une course ?{" "}
            <Link to="/organisateurs/comment-ca-marche" className="font-bold text-primary hover:underline">
              Trouve tes bénévoles avec Ravito
            </Link>
            .
          </p>
        </div>
      </section>
    </PageShell>
  );
}
