import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DEPARTEMENTS_FR } from "@/lib/regions";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/inscription")({
  head: () => ({ meta: [{ title: "Inscription — Ravito" }] }),
  component: SignupPage,
});

type Role = "benevole" | "organisateur";

function SignupPage() {
  const navigate = useNavigate();
  const { refreshRole } = useAuth();
  const [role, setRole] = useState<Role | null>(null);

  // shared
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dept, setDept] = useState("");
  const [loading, setLoading] = useState(false);

  // benevole
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [niveau, setNiveau] = useState("débutant");
  const [dispos, setDispos] = useState<string[]>([]);

  // organisateur
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState("association");
  const [siteWeb, setSiteWeb] = useState("");

  const toggleDispo = (d: string) =>
    setDispos((arr) => (arr.includes(d) ? arr.filter((x) => x !== d) : [...arr, d]));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    setLoading(true);
    const redirectUrl = `${window.location.origin}/`;
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: redirectUrl },
    });
    if (error) { setLoading(false); toast.error(error.message); return; }
    const uid = data.user?.id;
    if (!uid) { setLoading(false); toast.error("Erreur création compte"); return; }

    if (role === "benevole") {
      const { error: e2 } = await supabase.from("benevoles").insert({
        id: uid, prenom, nom, departement: dept, niveau_trail: niveau, disponibilites: dispos,
      });
      if (e2) { setLoading(false); toast.error(e2.message); return; }
    } else {
      const { error: e2 } = await supabase.from("organisateurs").insert({
        id: uid, nom_organisation: orgName, type_organisation: orgType,
        departement: dept, site_web: siteWeb || null,
      });
      if (e2) { setLoading(false); toast.error(e2.message); return; }
    }

    await refreshRole();
    setLoading(false);
    toast.success("Compte créé !");
    navigate({ to: role === "organisateur" ? "/mon-espace" : "/mes-candidatures" });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-16">
      <Link to="/" className="text-4xl font-bold mb-10" style={{ fontFamily: '"Syne", sans-serif' }}>Ravito</Link>

      {!role ? (
        <div className="w-full max-w-md grid gap-4">
          <h1 className="text-2xl font-bold uppercase text-center mb-4" style={{ fontFamily: '"Syne", sans-serif' }}>
            Je suis…
          </h1>
          <button onClick={() => setRole("benevole")} className="bg-primary text-primary-foreground p-6 rounded-lg font-bold uppercase">
            Bénévole
          </button>
          <button onClick={() => setRole("organisateur")} className="bg-secondary text-secondary-foreground p-6 rounded-lg font-bold uppercase">
            Organisateur
          </button>
          <p className="text-sm text-center text-muted-foreground mt-4">
            Déjà inscrit ? <Link to="/connexion" className="underline font-semibold text-foreground">Connexion</Link>
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="w-full max-w-md grid gap-4 border border-border rounded-lg p-8">
          <button type="button" onClick={() => setRole(null)} className="text-xs text-muted-foreground self-start">← Changer de rôle</button>
          <h1 className="text-2xl font-bold uppercase" style={{ fontFamily: '"Syne", sans-serif' }}>
            Inscription {role}
          </h1>

          {role === "benevole" ? (
            <>
              <input required placeholder="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} className="inp" />
              <input required placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} className="inp" />
            </>
          ) : (
            <>
              <input required placeholder="Nom de l'organisation" value={orgName} onChange={(e) => setOrgName(e.target.value)} className="inp" />
              <select value={orgType} onChange={(e) => setOrgType(e.target.value)} className="inp">
                <option value="association">Association</option>
                <option value="entreprise">Entreprise</option>
                <option value="collectivite">Collectivité</option>
              </select>
              <input placeholder="Site web (optionnel)" value={siteWeb} onChange={(e) => setSiteWeb(e.target.value)} className="inp" />
            </>
          )}

          <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="inp" />
          <input required type="password" minLength={6} placeholder="Mot de passe (6+ caractères)" value={password} onChange={(e) => setPassword(e.target.value)} className="inp" />

          <select required value={dept} onChange={(e) => setDept(e.target.value)} className="inp">
            <option value="">— Département —</option>
            {DEPARTEMENTS_FR.map((d) => <option key={d.code} value={d.code}>{d.code} — {d.nom}</option>)}
          </select>

          {role === "benevole" && (
            <>
              <select value={niveau} onChange={(e) => setNiveau(e.target.value)} className="inp">
                <option value="débutant">Niveau : débutant</option>
                <option value="intermédiaire">Niveau : intermédiaire</option>
                <option value="passionné">Niveau : passionné</option>
              </select>
              <div className="grid gap-2 text-sm">
                <p className="font-semibold">Disponibilités</p>
                {["weekends", "semaine", "ponctuel"].map((d) => (
                  <label key={d} className="flex items-center gap-2">
                    <input type="checkbox" checked={dispos.includes(d)} onChange={() => toggleDispo(d)} /> {d}
                  </label>
                ))}
              </div>
            </>
          )}

          <button disabled={loading} className="bg-primary text-primary-foreground py-3 rounded-md font-bold uppercase tracking-wider disabled:opacity-60">
            {loading ? "…" : "Créer mon compte"}
          </button>
        </form>
      )}

      <style>{`.inp{background:var(--background);border:1px solid var(--border);border-radius:8px;padding:.75rem 1rem;font-size:.95rem;}`}</style>
    </div>
  );
}
