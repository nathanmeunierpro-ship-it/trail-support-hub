import { createServerFn } from "@tanstack/react-start";

export const getStats = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const [benevolesRes, organisateursRes] = await Promise.all([
    supabaseAdmin.from("benevoles").select("departement"),
    supabaseAdmin.from("organisateurs").select("departement"),
  ]);

  if (benevolesRes.error) throw benevolesRes.error;
  if (organisateursRes.error) throw organisateursRes.error;

  const benevoles = benevolesRes.data ?? [];
  const organisateurs = organisateursRes.data ?? [];

  const byDept = new Map<string, { departement: string; benevoles: number; organisateurs: number }>();
  const bump = (dept: string | null, key: "benevoles" | "organisateurs") => {
    const d = (dept ?? "Non renseigné").trim() || "Non renseigné";
    const cur = byDept.get(d) ?? { departement: d, benevoles: 0, organisateurs: 0 };
    cur[key] += 1;
    byDept.set(d, cur);
  };
  benevoles.forEach((b) => bump(b.departement as string | null, "benevoles"));
  organisateurs.forEach((o) => bump(o.departement as string | null, "organisateurs"));

  const departements = Array.from(byDept.values()).sort(
    (a, b) => b.benevoles + b.organisateurs - (a.benevoles + a.organisateurs),
  );

  return {
    totalBenevoles: benevoles.length,
    totalOrganisateurs: organisateurs.length,
    departements,
  };
});
