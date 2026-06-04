import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/mon-espace")({
  head: () => ({ meta: [{ title: "Mon espace organisateur — Ravito" }] }),
  component: MonEspace,
});

interface Ev {
  id: string; nom: string; ville: string; date: string; type_sport: string;
  nb_benevoles: number; statut: string;
}
interface Cand {
  id: string; event_id: string; prenom: string; nom: string;
  mission_souhaitee: string | null; disponibilite: boolean;
  statut: string;
}

function MonEspace() {
  const { session, role, loading } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Ev[]>([]);
  const [cands, setCands] = useState<Cand[]>([]);
  const [benDetails, setBenDetails] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/connexion" });
  }, [loading, session, navigate]);

  const load = async () => {
    if (!session) return;
    const { data: e } = await supabase.from("events").select("*").eq("user_id", session.user.id).order("date");
    setEvents((e as Ev[]) ?? []);
    if (e && e.length > 0) {
      const ids = e.map((x: any) => x.id);
      const { data: c } = await supabase.from("candidatures").select("*").in("event_id", ids);
      setCands((c as Cand[]) ?? []);
      if (c && c.length > 0) {
        const benIds = Array.from(new Set(c.map((x: any) => x.benevole_id)));
        const { data: b } = await supabase.from("benevoles").select("id,departement,niveau_trail,disponibilites").in("id", benIds);
        const map: Record<string, any> = {};
        (b ?? []).forEach((bb: any) => { map[bb.id] = bb; });
        setBenDetails(map);
      }
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [session]);

  const deleteEvent = async (id: string) => {
    if (!confirm("Supprimer cette annonce ?")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Supprimée"); load(); }
  };

  const setStatutCand = async (id: string, statut: string) => {
    const { error } = await supabase.from("candidatures").update({ statut }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Statut mis à jour"); load(); }
  };

  if (!session) return <PageShell><div className="px-6 py-20 text-center">Redirection…</div></PageShell>;

  return (
    <PageShell>
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
            <h1 className="text-4xl md:text-5xl font-bold uppercase" style={{ fontFamily: '"Syne", sans-serif' }}>Mon espace</h1>
            <Link to="/publier" className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-bold uppercase text-sm tracking-wider">
              + Nouvelle annonce
            </Link>
          </div>

          {role && role !== "organisateur" && (
            <p className="text-muted-foreground mb-8">Cet espace est réservé aux organisateurs.</p>
          )}

          <h2 className="text-2xl font-bold uppercase mb-6" style={{ fontFamily: '"Syne", sans-serif' }}>Mes annonces</h2>
          {events.length === 0 ? (
            <p className="text-muted-foreground py-6">Aucune annonce publiée.</p>
          ) : (
            <div className="grid gap-6">
              {events.map((ev) => {
                const evCands = cands.filter((c) => c.event_id === ev.id);
                return (
                  <div key={ev.id} className="border border-border rounded-lg p-6">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <h3 className="text-xl font-bold uppercase" style={{ fontFamily: '"Syne", sans-serif' }}>{ev.nom}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {ev.ville} · {new Date(ev.date).toLocaleDateString("fr-FR")} · {ev.type_sport} · {ev.nb_benevoles} bénévoles
                        </p>
                      </div>
                      <button onClick={() => deleteEvent(ev.id)} className="text-xs uppercase font-bold text-destructive border border-destructive px-3 py-2 rounded-md">
                        Supprimer
                      </button>
                    </div>

                    <div className="mt-6">
                      <p className="text-xs font-bold uppercase tracking-wider mb-3">Candidatures ({evCands.length})</p>
                      {evCands.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Aucune pour l'instant.</p>
                      ) : (
                        <div className="grid gap-3">
                          {evCands.map((c) => {
                            const b = benDetails[(c as any).benevole_id];
                            return (
                              <div key={c.id} className="grid md:grid-cols-12 gap-3 items-center bg-muted/40 px-4 py-3 rounded-md text-sm">
                                <div className="md:col-span-3 font-semibold">{c.prenom} {c.nom}</div>
                                <div className="md:col-span-3 text-muted-foreground">
                                  {b ? `Dpt ${b.departement} · ${b.niveau_trail}` : "—"}
                                </div>
                                <div className="md:col-span-3 text-muted-foreground">
                                  {c.mission_souhaitee || "—"} {c.disponibilite ? "· dispo journée" : ""}
                                </div>
                                <div className="md:col-span-3 flex gap-2 justify-end">
                                  <select value={c.statut} onChange={(e) => setStatutCand(c.id, e.target.value)} className="bg-background border border-border rounded px-2 py-1 text-xs">
                                    <option value="en_attente">En attente</option>
                                    <option value="accepte">Accepté</option>
                                    <option value="refuse">Refusé</option>
                                  </select>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
