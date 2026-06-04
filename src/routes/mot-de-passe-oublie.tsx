import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/mot-de-passe-oublie")({
  head: () => ({
    meta: [
      { title: "Mot de passe oublié — Ravito" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setSent(true);
  };

  return (
    <PageShell>
      <section className="px-6 py-12">
        <div className="mx-auto max-w-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/connexion" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
              <ArrowLeft size={15} /> Retour à la connexion
            </Link>

            <h1 className="font-display text-3xl font-black mb-2">Mot de passe oublié</h1>
            <p className="text-muted-foreground mb-8">
              Entre ton adresse email et nous t'enverrons un lien de réinitialisation.
            </p>

            {sent ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center text-center py-8 gap-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-green-600" />
                </div>
                <p className="font-bold text-green-600 text-lg">Email envoyé !</p>
                <p className="text-muted-foreground text-sm">
                  Un email de réinitialisation a été envoyé à <strong>{email}</strong>.
                  Vérifie ta boîte mail.
                </p>
                <Link to="/connexion" className="btn-cta inline-flex items-center gap-2 mt-2">
                  Retour à la connexion
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">
                    Email
                  </label>
                  <input
                    required type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ton@email.fr"
                    className="inp"
                  />
                </div>
                <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.97 }}
                  className="btn-cta w-full flex items-center justify-center gap-2">
                  {loading ? <Loader2 size={17} className="animate-spin" /> : "Envoyer le lien"}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </PageShell>
  );
}
