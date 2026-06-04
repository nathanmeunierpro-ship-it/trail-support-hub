import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { EventRow, type EventRowData } from "@/components/EventRow";
import { REGIONS_FR, TYPES_SPORT } from "@/lib/regions";
import { useAuth } from "@/lib/auth-context";

interface EventFull extends EventRowData { region: string; }

export const Route = createFileRoute("/annonces")({
  head: () => ({
    meta: [
      { title: "Tous les événements — Ravito" },
      { name: "description", content: "Toutes les annonces de bénévolat sur les trails et courses en France." },
    ],
  }),
  component: AnnoncesPage,
});

const PAGE_SIZE = 10;

function AnnoncesPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventFull[]>([]);
  const [postules, setPostules] = useState<Set<string>>(new Set());
  const [region, setRegion] = useState("");
  const [type, setType] = useState("");
  const [dateMin, setDateMin] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    supabase
      .from("events_public")
      .select("id, nom, ville, region, date, type_sport")
      .order("date", { ascending: true })
      .then(({ data }) => setEvents((data as EventFull[]) ?? []));
  }, []);

  useEffect(() => {
    if (!user) { setPostules(new Set()); return; }
    supabase
      .from("candidatures")
      .select("event_id")
      .eq("benevole_id", user.id)
      .then(({ data }) => setPostules(new Set((data ?? []).map((c: any) => c.event_id))));
  }, [user]);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (region && e.region !== region) return false;
      if (type && e.type_sport !== type) return false;
      if (dateMin && e.date < dateMin) return false;
      if (postules.has(e.id)) return false;
      return true;
    });
  }, [events, region, type, dateMin, postules]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <PageShell>
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl md:text-6xl font-bold uppercase mb-10" style={{ fontFamily: '"Syne", sans-serif' }}>
            Tous les événements
          </h1>

          <div className="grid gap-4 md:grid-cols-3 mb-12 bg-muted/40 p-6 rounded-lg">
            <select value={region} onChange={(e) => { setRegion(e.target.value); setPage(1); }} className="bg-background border border-border rounded-md px-4 py-3 text-sm">
              <option value="">Toutes les régions</option>
              {REGIONS_FR.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="bg-background border border-border rounded-md px-4 py-3 text-sm">
              <option value="">Tous les types</option>
              {TYPES_SPORT.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <input type="date" value={dateMin} onChange={(e) => { setDateMin(e.target.value); setPage(1); }} className="bg-background border border-border rounded-md px-4 py-3 text-sm" />
          </div>

          {shown.length === 0 ? (
            <p className="text-muted-foreground py-10">Aucune annonce.</p>
          ) : (
            <div className="border-t border-border">
              {shown.map((ev) => <EventRow key={ev.id} ev={ev} />)}
            </div>
          )}

          {pageCount > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: pageCount }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-md text-sm font-bold ${page === i + 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
