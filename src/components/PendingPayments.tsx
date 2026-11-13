import { useEffect, useState } from "react";
import { Lock, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { PRIX_ANNONCE, STATUT_ATTENTE_PAIEMENT, paymentUrl } from "@/lib/site";

/** Annonces de l'organisateur connecté qui attendent leur paiement, avec le bouton pour payer. */
export function PendingPayments({ dark = false }: { dark?: boolean }) {
  const { session, role } = useAuth();
  const [pending, setPending] = useState<{ id: string; nom: string }[]>([]);

  useEffect(() => {
    if (!session || role !== "organisateur") {
      setPending([]);
      return;
    }
    supabase
      .from("events")
      .select("id, nom")
      .eq("user_id", session.user.id)
      .eq("statut", STATUT_ATTENTE_PAIEMENT)
      .then(({ data }) => setPending((data as { id: string; nom: string }[]) ?? []));
  }, [session, role]);

  if (pending.length === 0) return null;

  return (
    <div
      className={`rounded-3xl p-6 md:p-8 ${dark ? "bg-white/10 text-white" : "bg-amber-50 text-[#1A1A1A] ring-1 ring-amber-200"}`}
    >
      <p className="flex items-center gap-2 font-bold">
        <AlertCircle size={18} className="text-amber-500" />
        {pending.length === 1
          ? "Ton annonce attend son paiement"
          : `${pending.length} annonces attendent leur paiement`}
      </p>
      <p className="mt-1 text-sm opacity-75">
        Elle sera mise en ligne automatiquement dès le paiement.
      </p>
      <ul className="mt-4 space-y-3">
        {pending.map((ev) => (
          <li key={ev.id} className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-semibold">{ev.nom}</span>
            <a href={paymentUrl(ev.id, session?.user.email)} className="btn-primary gap-2 !py-3">
              <Lock size={14} /> Payer {PRIX_ANNONCE}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
