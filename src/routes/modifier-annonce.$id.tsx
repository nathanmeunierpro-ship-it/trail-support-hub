import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Check, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { REGIONS_FR, TYPES_SPORT, MISSIONS } from "@/lib/regions";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/modifier-annonce/$id")({
  head: () => ({
    meta: [
      { title: "Modifier l'annonce — Ravito" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ModifierAnnoncePage,
});

function ModifierAnnoncePage() {
  const { id } = Route.useParams();
  const { session, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [nom, setNom] = useState("");
  const [type, setType] = useState("Trail");
  const [date, setDate] = useState("");
  const [ville, setVille] = useState("");
  const [region, setRegion] = useState("");
  const [nbBen, setNbBen] = useState(10);
  const [missions, setMissions] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [emailContact, setEmailContact] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && !session) navigate({ to: "/connexion" });
  }, [authLoading, session, navigate]);

  useEffect(() => {
    if (!session) return;
    supabase.from("events").select("*").eq("id", id).eq("user_id", session.user.id).maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) { toast.error("Annonce introuvable."); navigate({ to: "/mon-espace" }); return; }
        const d = data as any;
        setNom(d.nom ?? "");
        setType(d.type_sport ?? "Trail");
        setDate(d.date ?? "");
        setVille(d.ville ?? "");
        setRegion(d.region ?? "");
        setNbBen(d.nb_benevoles ?? 10);
        setMissions(d.missions ?? []);
        setDescription(d.description ?? "");
        setEmailContact(d.email_contact ?? "");
        setFetching(false);
      });
  }, [session, id]);

  const toggleMission = (m: string) =>
    setMissions((arr) => (arr.includes(m) ? arr.filter((x) => x !== m) : [...arr, m]));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!nom.trim() || nom.length < 3) e.nom = "Minimum 3 caractères";
    if (!date) e.date = "La date est requise";
    if (!ville.trim() || ville.length < 2) e.ville = "Minimum 2 caractères";
    if (!region) e.region = "La région est requise";
    if (nbBen < 1) e.nbBen = "Minimum 1 bénévole";
    if (!emailContact || !/\S+@\S+\.\S+/.test(emailContact)) e.emailContact = "Email invalide";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!session) return;
    setSubmitting(true);
    const { error } = await supabase.from("events").update({
      nom, type_sport: type, date, ville, region,
      nb_benevoles: nbBen, missions, description,
      email_contact: emailContact,
    }).eq("id", id).eq("user_id", session.user.id);
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Annonce mise à jour !");
    navigate({ to: "/mon-espace" });
  };

  if (fetching) return (
    <PageShell>
      <div className="px-6 py-12 max-w-2xl mx-auto space-y-4">
        {[1,2,3,4].map(i => <div key={i} className="h-12 bg-muted animate-pulse rounded-xl" />)}
      </div>
    </PageShell>
  );

  return (
    <PageShell>
      <section className="px-6 py-12">
        <div className="mx-auto max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <button onClick={() => navigate({ to: "/mon-espace" })}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
              <ArrowLeft size={15} /> Mon espace
            </button>
            <h1 className="font-display text-4xl font-black mb-1">Modifier l'annonce</h1>
            <p className="text-muted-foreground">Les modifications seront visibles immédiatement.</p>
          </motion.div>

          <form onSubmit={onSubmit} className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6"
            style={{ boxShadow: "var(--shadow-card)" }}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Nom de l'événement</label>
              <input value={nom} onChange={(e) => { setNom(e.target.value); if (errors.nom) setErrors((er) => ({ ...er, nom: "" })); }}
                className={`inp ${errors.nom ? "inp-error" : ""}`} />
              {errors.nom && <p className="text-xs text-destructive mt-1">{errors.nom}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Type de sport</label>
              <div className="flex flex-wrap gap-2">
                {TYPES_SPORT.map((t) => (
                  <button key={t} type="button" onClick={() => setType(t)}
                    className={`px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                      type === t ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/50"
                    }`}>{t}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Date</label>
              <input type="date" value={date} onChange={(e) => { setDate(e.target.value); if (errors.date) setErrors((er) => ({ ...er, date: "" })); }}
                className={`inp ${errors.date ? "inp-error" : ""}`} />
              {errors.date && <p className="text-xs text-destructive mt-1">{errors.date}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Ville</label>
                <input value={ville} onChange={(e) => { setVille(e.target.value); if (errors.ville) setErrors((er) => ({ ...er, ville: "" })); }}
                  className={`inp ${errors.ville ? "inp-error" : ""}`} />
                {errors.ville && <p className="text-xs text-destructive mt-1">{errors.ville}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Région</label>
                <select value={region} onChange={(e) => { setRegion(e.target.value); if (errors.region) setErrors((er) => ({ ...er, region: "" })); }}
                  className={`inp ${errors.region ? "inp-error" : ""}`}>
                  <option value="">— Choisir —</option>
                  {REGIONS_FR.map((r) => <option key={r}>{r}</option>)}
                </select>
                {errors.region && <p className="text-xs text-destructive mt-1">{errors.region}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">
                Bénévoles recherchés : <span className="text-primary font-black text-base">{nbBen}</span>
              </label>
              <input type="range" min={1} max={200} value={nbBen} onChange={(e) => setNbBen(parseInt(e.target.value))}
                className="w-full accent-primary h-2" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-muted-foreground">Missions</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {MISSIONS.map((m) => (
                  <button key={m} type="button" onClick={() => toggleMission(m)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all border-2 ${
                      missions.includes(m) ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:border-primary/40"
                    }`}>
                    {missions.includes(m) && <Check size={13} />}
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                className="inp min-h-24 resize-none" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Email de contact</label>
              <input type="email" value={emailContact}
                onChange={(e) => { setEmailContact(e.target.value); if (errors.emailContact) setErrors((er) => ({ ...er, emailContact: "" })); }}
                className={`inp ${errors.emailContact ? "inp-error" : ""}`} />
              {errors.emailContact && <p className="text-xs text-destructive mt-1">{errors.emailContact}</p>}
            </div>

            <motion.button type="submit" disabled={submitting} whileTap={{ scale: 0.97 }}
              className="btn-cta w-full flex items-center justify-center gap-2">
              {submitting ? <Loader2 size={17} className="animate-spin" /> : "Enregistrer les modifications"}
            </motion.button>
          </form>
        </div>
      </section>
    </PageShell>
  );
}
