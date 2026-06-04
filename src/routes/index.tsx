import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { Ticker } from "@/components/Ticker";
import { EventRow, type EventRowData } from "@/components/EventRow";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ravito — Bénévoles & trails en France" },
      { name: "description", content: "Trouve un trail qui cherche du renfort, ou recrute des bénévoles en 2 minutes." },
    ],
  }),
  component: Home,
});

function Home() {
  const [events, setEvents] = useState<EventRowData[]>([]);

  useEffect(() => {
    supabase
      .from("events_public")
      .select("id, nom, ville, region, date, type_sport")
      .order("date", { ascending: true })
      .limit(5)
      .then(({ data }) => setEvents((data as EventRowData[]) ?? []));
  }, []);

  return (
    <PageShell>
      {/* Hero */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl grid gap-12 md:grid-cols-5 items-center">
          <div className="md:col-span-3">
            <h1 className="text-5xl md:text-7xl font-bold uppercase leading-[0.95] tracking-tight" style={{ fontFamily: '"Syne", sans-serif' }}>
              Bénévoles<br />& Trails<br />en France
            </h1>
            <p className="mt-8 text-lg text-muted-foreground max-w-lg">
              Des événements sportifs partout en France cherchent des bénévoles. Trouve le tien en 2 minutes.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link to="/annonces" className="bg-primary text-primary-foreground px-8 py-4 rounded-md font-bold uppercase text-sm tracking-wider hover:bg-primary/90 transition">
                Voir les annonces
              </Link>
              <Link to="/publier" className="underline underline-offset-4 text-sm font-semibold">
                Tu organises un événement ?
              </Link>
            </div>
          </div>
          <div className="md:col-span-2 grid gap-4">
            <img src="https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=1200&q=80" alt="Coureurs en trail" className="w-full h-64 object-cover" />
            <img src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&q=80" alt="Trail en montagne" className="w-full h-64 object-cover" />
          </div>
        </div>
      </section>

      <Ticker />

      {/* 3 colonnes */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-5xl font-bold uppercase mb-14 max-w-3xl" style={{ fontFamily: '"Syne", sans-serif' }}>
            Plus qu'une plateforme
          </h2>
          <div className="grid gap-10 md:grid-cols-3">
            {[
              { t: "Bénévoles qualifiés", d: "Des passionnés de trail prêts à s'engager." },
              { t: "Mise en relation directe", d: "Organisateurs et bénévoles en contact en quelques clics." },
              { t: "Communauté trail", d: "Rejoins un réseau de passionnés partout en France." },
            ].map((c) => (
              <div key={c.t} className="border-t-2 border-foreground pt-6">
                <h3 className="text-xl font-bold uppercase mb-3" style={{ fontFamily: '"Syne", sans-serif' }}>{c.t}</h3>
                <p className="text-muted-foreground">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Annonces récentes */}
      <section className="px-6 py-20 bg-muted/40">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-5xl font-bold uppercase mb-12 max-w-3xl" style={{ fontFamily: '"Syne", sans-serif' }}>
            Les prochains événements qui cherchent du renfort
          </h2>
          {events.length === 0 ? (
            <p className="text-muted-foreground py-10">Aucune annonce pour le moment.</p>
          ) : (
            <div className="border-t border-border">
              {events.map((ev) => <EventRow key={ev.id} ev={ev} />)}
            </div>
          )}
          <div className="mt-12 text-center">
            <Link to="/annonces" className="text-base font-bold uppercase tracking-wider hover:opacity-70">
              Voir toutes les annonces →
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
