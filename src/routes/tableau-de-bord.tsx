import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Users, Building2 } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { getStats } from "@/lib/stats.functions";

const statsQueryOptions = queryOptions({
  queryKey: ["stats", "dashboard"],
  queryFn: () => getStats(),
});

export const Route = createFileRoute("/tableau-de-bord")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — Ravito" },
      { name: "description", content: "Statistiques des bénévoles et organisateurs Ravito." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(statsQueryOptions),
  component: Dashboard,
  errorComponent: ({ error }) => (
    <PageShell>
      <div className="max-w-3xl mx-auto py-16 px-4">
        <p className="text-red-600">Erreur : {error.message}</p>
      </div>
    </PageShell>
  ),
  notFoundComponent: () => null,
});

function Dashboard() {
  const { data } = useSuspenseQuery(statsQueryOptions);

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-8">Tableau de bord</h1>

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <div className="rounded-2xl border bg-card p-6 flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Users size={28} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bénévoles</p>
              <p className="text-3xl font-bold">{data.totalBenevoles}</p>
            </div>
          </div>
          <div className="rounded-2xl border bg-card p-6 flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Building2 size={28} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Organisateurs</p>
              <p className="text-3xl font-bold">{data.totalOrganisateurs}</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Totaux par département</h2>
        <div className="rounded-2xl border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Département</th>
                <th className="px-4 py-3 font-semibold text-right">Bénévoles</th>
                <th className="px-4 py-3 font-semibold text-right">Organisateurs</th>
                <th className="px-4 py-3 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.departements.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                    Aucune donnée
                  </td>
                </tr>
              ) : (
                data.departements.map((d) => (
                  <tr key={d.departement} className="border-t">
                    <td className="px-4 py-3">{d.departement}</td>
                    <td className="px-4 py-3 text-right">{d.benevoles}</td>
                    <td className="px-4 py-3 text-right">{d.organisateurs}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      {d.benevoles + d.organisateurs}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
