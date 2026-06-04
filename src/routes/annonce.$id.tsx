import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { useAuth } from "@/lib/auth-context";

interface Ev {
  id: string; nom: string; ville: string; region: string; date: string;
  type_sport: string; nb_benevoles: number; missions: string[] | null;
  description: string | null;
}

export const Route = createFileRoute("/annonce/$id")({
  component: AnnonceDetail,
});

function AnnonceDetail() {
  const { id } = Route.useParams();
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [ev, setEv] = useState<Ev | null>(null);
  const [loading, setLoading] = useState(true);

  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [mission, setMission] = useState("");
  const [dispo, setDispo] = useState(true);
  const [exp, setExp] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.from("events_public").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      setEv(data as Ev | null);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Connecte-toi pour postuler");
      navigate({ to: "/connexion" });
      return;
    }
    if (role !== "benevole") {
      toast.error("Seuls les bénévoles peuvent postuler");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("candidatures").insert({
      event_id: id, benevole_id: user.id, prenom, nom, email,
      mission_souhaitee: mission, disponibilite: dispo, experience: exp || null,
    });
    setSubmitting(false);
    if (error) { toast.error("Erreur : " + error.message); return; }
    toast.success("Candidature envoyée !");
    navigate({ to: "/mes-candidatures" });
  };

  if (loading) return <PageShell><div className="px-6 py-20 text-center">Chargement…</div></PageShell>;
  if (!ev) return <PageShell><div className="px-6 py-20 text-center">Annonce introuvable.</div></PageShell>;

  const dateFmt = new Date(ev.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <PageShell>
      <img src="https://images.unsplash.com/photo-1486218119243-13883505764c?w=1600&q=80" alt={ev.nom} className="w-full h-72 md:h-96 object-cover" />

      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold uppercase mb-6" style={{ fontFamily: '"Syne", sans-serif' }}>
            {ev.nom}
          </h1>
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-10">
            <span><strong className="text-foreground">Ville :</strong> {ev.ville}</span>
            <span><strong className="text-foreground">Date :</strong> {dateFmt}</span>
            <span><strong className="text-foreground">Type :</strong> {ev.type_sport}</span>
            <span><strong className="text-foreground">Bénévoles :</strong> {ev.nb_benevoles}</span>
          </div>

          {ev.description && <p className="text-lg leading-relaxed mb-10 whitespace-pre-wrap">{ev.description}</p>}

          {ev.missions && ev.missions.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-bold uppercase mb-4" style={{ fontFamily: '"Syne", sans-serif' }}>Missions disponibles</h2>
              <div className="flex flex-wrap gap-2">
                {ev.missions.map((m) => <span key={m} className="bg-muted px-4 py-2 rounded-full text-sm">{m}</span>)}
              </div>
            </div>
          )}

          <div className="border-t border-border pt-12">
            <h2 className="text-2xl md:text-3xl font-bold uppercase mb-8" style={{ fontFamily: '"Syne", sans-serif' }}>
              Envoyer ma candidature
            </h2>
            {!user ? (
              <p className="text-muted-foreground">
                <Link to="/connexion" className="underline font-semibold">Connecte-toi</Link> pour postuler à cette annonce.
              </p>
            ) : role === "organisateur" ? (
              <p className="text-muted-foreground">Seuls les comptes bénévoles peuvent postuler.</p>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <Field label="Prénom"><input required value={prenom} onChange={(e) => setPrenom(e.target.value)} className="input" /></Field>
                  <Field label="Nom"><input required value={nom} onChange={(e) => setNom(e.target.value)} className="input" /></Field>
                </div>
                <Field label="Email"><input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" /></Field>
                <Field label="Mission souhaitée">
                  <select value={mission} onChange={(e) => setMission(e.target.value)} className="input">
                    <option value="">— Choisir —</option>
                    {(ev.missions ?? []).map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </Field>
                <Field label="Disponible toute la journée">
                  <select value={dispo ? "oui" : "non"} onChange={(e) => setDispo(e.target.value === "oui")} className="input">
                    <option value="oui">Oui</option>
                    <option value="non">Non</option>
                  </select>
                </Field>
                <Field label="Expérience bénévole (optionnel)">
                  <textarea value={exp} onChange={(e) => setExp(e.target.value)} className="input min-h-28" />
                </Field>
                <button disabled={submitting} className="bg-secondary text-secondary-foreground py-4 rounded-md font-bold uppercase tracking-wider disabled:opacity-60">
                  {submitting ? "Envoi…" : "Envoyer ma candidature"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <style>{`.input{background:var(--background);border:1px solid var(--border);border-radius:8px;padding:.85rem 1rem;font-size:.95rem;width:100%;}`}</style>
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
