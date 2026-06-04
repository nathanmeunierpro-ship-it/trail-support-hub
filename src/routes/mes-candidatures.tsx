import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/mes-candidatures")({
  head: () => ({ meta: [{ title: "Mes candidatures — Ravito" }] }),
  component: MesCandidatures,
});

interface Row {
  id: string; statut: string; mission_souhaitee: string | null; event_id: string;
  events: { nom: string; ville: string; date: string; type_sport: string } | null;
}

const STATUT_LABEL: Record<string, string> = {
  en_attente: "En attente", accepte: "Accepté", refuse: "Refusé",
};

function MesCandidatures() {
  const { session, role, loading } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/connexion" });
  }, [loading, session, navigate]);

  useEffect(() => {
    if (!session) return;
    supabase
      .from("candidatures")
      .select("id, statut, mission_souhaitee, event_id, events:event_id(nom, ville, date, type_sport)")
      .eq("benevole_id", session.user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setRows((data as any) ?? []));
  }, [session]);

  if (!session) return <PageShell><div className="px-6 py-20 text-center">Redirection…</div></PageShell>;

  return (
    <PageShell>
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-bold uppercase mb-10" style={{ fontFamily: '"Syne", sans-serif' }}>
            Mes candidatures
          </h1>

          {role && role !== "benevole" && (
            <p className="text-muted-foreground mb-6">Cet espace est réservé aux bénévoles.</p>
          )}

          {rows.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-6">Tu n'as pas encore postulé à une annonce.</p>
              <Link to="/annonces" className="bg-secondary text-secondary-foreground px-6 py-3 rounded-md font-bold uppercase text-sm">Voir les annonces</Link>
            </div>
          ) : (
            <div className="border-t border-border">
              {rows.map((r) => (
                <div key={r.id} className="grid md:grid-cols-12 gap-3 items-center py-6 border-b border-border">
                  <div className="md:col-span-5">
                    <Link to="/annonce/$id" params={{ id: r.event_id }} className="text-lg font-bold uppercase hover:opacity-70" style={{ fontFamily: '"Syne", sans-serif' }}>
                      {r.events?.nom ?? "Événement"}
                    </Link>
                  </div>
                  <div className="md:col-span-4 text-sm text-muted-foreground">
                    {r.events ? `${r.events.ville} · ${new Date(r.events.date).toLocaleDateString("fr-FR")}` : ""}
                  </div>
                  <div className="md:col-span-3 md:text-right">
                    <span className={`inline-block text-xs font-bold uppercase px-3 py-2 rounded-full ${
                      r.statut === "accepte" ? "bg-primary text-primary-foreground" :
                      r.statut === "refuse" ? "bg-destructive text-destructive-foreground" :
                      "bg-muted text-foreground"
                    }`}>
                      {STATUT_LABEL[r.statut] ?? r.statut}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
