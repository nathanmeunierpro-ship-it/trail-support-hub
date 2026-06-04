import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/connexion")({
  head: () => ({ meta: [{ title: "Connexion — Ravito" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { session, role } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session && role) {
      navigate({ to: role === "organisateur" ? "/mon-espace" : "/mes-candidatures", replace: true });
    }
  }, [session, role, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Connecté !");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-16">
      <Link to="/" className="text-4xl font-bold mb-10" style={{ fontFamily: '"Syne", sans-serif' }}>Ravito</Link>
      <form onSubmit={onSubmit} className="w-full max-w-md grid gap-5 border border-border rounded-lg p-8">
        <h1 className="text-2xl font-bold uppercase mb-2" style={{ fontFamily: '"Syne", sans-serif' }}>Se connecter</h1>
        <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border border-border rounded-md px-4 py-3" />
        <input required type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className="border border-border rounded-md px-4 py-3" />
        <button disabled={loading} className="bg-primary text-primary-foreground py-3 rounded-md font-bold uppercase tracking-wider disabled:opacity-60">
          {loading ? "…" : "Connexion"}
        </button>
        <p className="text-sm text-center text-muted-foreground">
          Pas encore de compte ? <Link to="/inscription" className="underline font-semibold text-foreground">Inscription</Link>
        </p>
      </form>
    </div>
  );
}
