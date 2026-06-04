import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Nouveau mot de passe — Ravito" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase redirects with #access_token in the hash — the client picks it up automatically
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("Minimum 6 caractères."); return; }
    if (password !== confirm) { toast.error("Les mots de passe ne correspondent pas."); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setSuccess(true);
    toast.success("Mot de passe mis à jour !");
    setTimeout(() => navigate({ to: "/connexion" }), 2500);
  };

  return (
    <PageShell>
      <section className="px-6 py-12">
        <div className="mx-auto max-w-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl font-black mb-2">Nouveau mot de passe</h1>
            <p className="text-muted-foreground mb-8">Choisis un nouveau mot de passe sécurisé.</p>

            {success ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center text-center py-8 gap-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-green-600" />
                </div>
                <p className="font-bold text-green-600">Mot de passe mis à jour !</p>
                <p className="text-muted-foreground text-sm">Redirection vers la connexion…</p>
              </motion.div>
            ) : !ready ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Lien en cours de vérification…</p>
                <p className="text-sm mt-2">Si rien ne se passe, demande un nouveau lien de réinitialisation.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input required type={showPwd ? "text" : "password"} minLength={6}
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" className="inp pr-12" />
                    <button type="button" onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">
                    Confirmer
                  </label>
                  <input required type="password" minLength={6}
                    value={confirm} onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••" className="inp" />
                </div>
                <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.97 }}
                  className="btn-cta w-full flex items-center justify-center gap-2">
                  {loading ? <Loader2 size={17} className="animate-spin" /> : "Mettre à jour"}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </PageShell>
  );
}
