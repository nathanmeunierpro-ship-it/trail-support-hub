import { supabase } from "@/integrations/supabase/client";

export interface PublicEvent {
  id: string;
  nom: string;
  ville: string;
  region: string;
  date: string;
  type_sport: string;
  nb_benevoles: number | null;
  missions: string[] | null;
  description?: string | null;
  photo_url: string | null;
}

const LIST_COLUMNS = "id, nom, ville, region, date, type_sport, nb_benevoles, missions, photo_url";

/** Date du jour à Paris au format AAAA-MM-JJ (les courses du jour restent visibles). */
export function todayISO(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date());
}

/** Vrai si l'événement est déjà passé (veille ou avant). */
export function isPast(date: string | null | undefined): boolean {
  if (!date) return false;
  return date.slice(0, 10) < todayISO();
}

/**
 * Événements actifs à venir uniquement : les courses déjà passées
 * n'apparaissent plus nulle part sur le site public.
 */
export async function fetchUpcomingEvents(limit?: number): Promise<PublicEvent[]> {
  try {
    let q = supabase
      .from("events_public")
      .select(LIST_COLUMNS)
      .gte("date", todayISO())
      .order("date", { ascending: true });
    if (limit) q = q.limit(limit);
    const { data, error } = await q;
    if (error) throw error;
    return (data as PublicEvent[]) ?? [];
  } catch (e) {
    console.error("[events] fetchUpcomingEvents failed", e);
    return [];
  }
}

export async function fetchEvent(id: string): Promise<PublicEvent | null> {
  try {
    const { data, error } = await supabase
      .from("events_public")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return (data as PublicEvent | null) ?? null;
  } catch (e) {
    console.error("[events] fetchEvent failed", e);
    return null;
  }
}

export function formatDate(
  date: string,
  opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" },
) {
  return new Date(date).toLocaleDateString("fr-FR", { timeZone: "Europe/Paris", ...opts });
}

/** Petite date en bloc (jour / mois abrégé) pour les cartes. */
export function dateParts(date: string) {
  const d = new Date(date);
  return {
    day: d.toLocaleDateString("fr-FR", { day: "2-digit", timeZone: "Europe/Paris" }),
    month: d
      .toLocaleDateString("fr-FR", { month: "short", timeZone: "Europe/Paris" })
      .replace(".", ""),
    weekday: d
      .toLocaleDateString("fr-FR", { weekday: "short", timeZone: "Europe/Paris" })
      .replace(".", ""),
  };
}

/** Images de secours par sport quand l'organisateur n'a pas mis de photo. */
const FALLBACK: Record<string, string> = {
  Trail: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=900&q=75&auto=format",
  Running: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=900&q=75&auto=format",
  Triathlon: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=900&q=75&auto=format",
  Cyclosportive:
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=900&q=75&auto=format",
};
export function eventImage(ev: Pick<PublicEvent, "photo_url" | "type_sport">) {
  return (
    ev.photo_url ||
    FALLBACK[ev.type_sport] ||
    "https://images.unsplash.com/photo-1486218119243-13883505764c?w=900&q=75&auto=format"
  );
}
