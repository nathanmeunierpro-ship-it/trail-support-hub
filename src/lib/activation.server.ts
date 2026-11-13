import process from "node:process";
import { createClient } from "@supabase/supabase-js";

/**
 * Mise en ligne d'une annonce après paiement, via la fonction SQL sécurisée
 * activate_paid_event (jeton RAVITO_ACTIVATION_TOKEN). Ne nécessite pas la
 * clé service_role.
 */
function anonClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Supabase non configuré");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

type Row = { id: string; nom: string; email_contact: string | null; activated: boolean };

let installedCache: { value: boolean; at: number } | null = null;

/** Vrai si la fonction SQL est installée (la migration a été appliquée). */
export async function isActivationInstalled(): Promise<boolean> {
  if (!process.env.RAVITO_ACTIVATION_TOKEN) return false;
  if (installedCache && Date.now() - installedCache.at < 60_000) return installedCache.value;
  let value = false;
  try {
    const { error } = await anonClient().rpc(
      "activate_paid_event" as never,
      {
        p_event_id: "00000000-0000-0000-0000-000000000000",
        p_token: "probe",
      } as never,
    );
    // 42501 = fonction présente mais jeton refusé → installée.
    value = !!error && error.code === "42501";
  } catch {
    value = false;
  }
  installedCache = { value, at: Date.now() };
  return value;
}

export async function activatePaidEvent(eventId: string): Promise<Row | null> {
  const token = process.env.RAVITO_ACTIVATION_TOKEN;
  if (!token) throw new Error("RAVITO_ACTIVATION_TOKEN manquant");
  const { data, error } = await anonClient().rpc(
    "activate_paid_event" as never,
    {
      p_event_id: eventId,
      p_token: token,
    } as never,
  );
  if (error) throw error;
  const rows = (data as Row[] | null) ?? [];
  return rows[0] ?? null;
}
