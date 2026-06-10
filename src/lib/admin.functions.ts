import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function ensureAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error) throw error;
  if (!data) throw new Error("Accès réservé aux administrateurs");
}

function toCsv(rows: Record<string, unknown>[], columns: string[]): string {
  const escape = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s = typeof v === "string" ? v : JSON.stringify(v);
    return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = columns.join(",");
  const body = rows.map((r) => columns.map((c) => escape(r[c])).join(",")).join("\n");
  return header + "\n" + body;
}

async function fetchEmails(userIds: string[]): Promise<Map<string, string>> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const map = new Map<string, string>();
  // Paginate auth users
  let page = 1;
  const perPage = 1000;
  while (true) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    for (const u of data.users) {
      if (userIds.includes(u.id) && u.email) map.set(u.id, u.email);
    }
    if (data.users.length < perPage) break;
    page++;
  }
  return map;
}

export const exportOrganisateursCsv = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.from("organisateurs").select("*");
    if (error) throw error;
    const rows = data ?? [];
    const emails = await fetchEmails(rows.map((r) => r.user_id).filter(Boolean));
    const enriched = rows.map((r) => ({ ...r, email: emails.get(r.user_id) ?? "" }));
    const columns = Object.keys(enriched[0] ?? { id: "", user_id: "", email: "" });
    return { csv: toCsv(enriched, columns), count: enriched.length };
  });

export const exportBenevolesCsv = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await ensureAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.from("benevoles").select("*");
    if (error) throw error;
    const rows = data ?? [];
    const emails = await fetchEmails(rows.map((r) => r.user_id).filter(Boolean));
    const enriched = rows.map((r) => ({ ...r, email: emails.get(r.user_id) ?? "" }));
    const columns = Object.keys(enriched[0] ?? { id: "", user_id: "", email: "" });
    return { csv: toCsv(enriched, columns), count: enriched.length };
  });

/** Grants admin role to the caller ONLY if no admin exists yet (bootstrap). */
export const bootstrapAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count, error: cErr } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if (cErr) throw cErr;
    if ((count ?? 0) > 0) throw new Error("Un administrateur existe déjà");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (error) throw error;
    return { ok: true };
  });
