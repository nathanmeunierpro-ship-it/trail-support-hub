import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { REGIONS_FR, TYPES_SPORT, MISSIONS } from "@/lib/regions";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/publier")({
  head: () => ({ meta: [{ title: "Publier une annonce — Ravito" }] }),
  component: PublierPage,
});

function PublierPage() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/connexion" });
  }, [loading, session, navigate]);

  const [nom, setNom] = useState("");
  const [type, setType] = useState<string>("Trail");
  const [date, setDate] = useState("");
  const [ville, setVille] = useState("");
  const [region, setRegion] = useState<string>("");
  const [nbBen, setNbBen] = useState(10);
  const [missions, setMissions] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [emailContact, setEmailContact] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const toggleMission = (m: string) =>
    setMissions((arr) => (arr.includes(m) ? arr.filter((x) => x !== m) : [...arr, m]));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setSubmitting(true);
    const { error } = await supabase.from("events").insert({
      user_id: session.user.id,
      nom, type_sport: type, date, ville, region,
      nb_benevoles: nbBen, missions, description,
      email_contact: emailContact,
    });
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Annonce publiée !");
    navigate({ to: "/mon-espace" });
  };

  if (!session) return <PageShell><div className="px-6 py-20 text-center">Redirection…</div></PageShell>;

  return (
    <PageShell>
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold uppercase mb-3" style={{ fontFamily: '"Syne", sans-serif' }}>
            Publie ton événement
          </h1>
          <p className="text-muted-foreground mb-12">Gratuit. En 2 minutes.</p>

          <form onSubmit={onSubmit} className="grid gap-5">
            <Field label="Nom de l'événement"><input required value={nom} onChange={(e) => setNom(e.target.value)} className="inp" /></Field>
            <Field label="Type">
              <select value={type} onChange={(e) => setType(e.target.value)} className="inp">
                {TYPES_SPORT.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Date"><input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className="inp" /></Field>
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Ville"><input required value={ville} onChange={(e) => setVille(e.target.value)} className="inp" /></Field>
              <Field label="Région">
                <select required value={region} onChange={(e) => setRegion(e.target.value)} className="inp">
                  <option value="">— Choisir —</option>
                  {REGIONS_FR.map((r) => <option key={r}>{r}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Nombre de bénévoles recherchés">
              <input required type="number" min={1} value={nbBen} onChange={(e) => setNbBen(parseInt(e.target.value) || 1)} className="inp" />
            </Field>
            <Field label="Missions">
              <div className="grid sm:grid-cols-2 gap-2 mt-2">
                {MISSIONS.map((m) => (
                  <label key={m} className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md cursor-pointer">
                    <input type="checkbox" checked={missions.includes(m)} onChange={() => toggleMission(m)} /> {m}
                  </label>
                ))}
              </div>
            </Field>
            <Field label="Description"><textarea value={description} onChange={(e) => setDescription(e.target.value)} className="inp min-h-32" /></Field>
            <Field label="Email de contact"><input required type="email" value={emailContact} onChange={(e) => setEmailContact(e.target.value)} className="inp" /></Field>
            <button disabled={submitting} className="bg-secondary text-secondary-foreground py-4 rounded-md font-bold uppercase tracking-wider disabled:opacity-60">
              {submitting ? "Publication…" : "Publier gratuitement"}
            </button>
          </form>
        </div>
      </section>
      <style>{`.inp{background:var(--background);border:1px solid var(--border);border-radius:8px;padding:.85rem 1rem;font-size:.95rem;width:100%;}`}</style>
    </PageShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold uppercase tracking-wider mb-2">{label}</span>
      {children}
    </label>
  );
}
