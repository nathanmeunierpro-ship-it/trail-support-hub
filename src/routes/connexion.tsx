import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import ravitoLogoGreen from "@/assets/ravito-logo-green.png.asset.json";

export const Route = createFileRoute("/connexion")({
  head: () => ({
    meta: [
      { title: "Se connecter — Ravito" },
      { name: "description", content: "Connecte-toi à ton espace bénévole ou organisateur sur Ravito." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { session, role } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
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
    if (error) {
      console.error("[login] signIn error:", error);
      toast.error(error.message);
      return;
    }
    toast.success("Bienvenue !");
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center px-6 py-12"
      style={{ background: "#F2FAE8" }}
    >
      <Link to="/" className="mb-8">
        <img src={ravitoLogoGreen.url} alt="Ravito" className="h-24 w-auto mx-auto" />
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[500px] flex flex-col items-center"
      >
        <h1
          className="text-center font-black leading-none mb-3"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(36px, 6vw, 56px)",
            color: "#1a1a1a",
            letterSpacing: "0.01em",
          }}
        >
          CONNEXION À TON ESPACE RAVITO
        </h1>
        <p className="text-center text-muted-foreground text-sm mb-10">
          Content de te revoir !
        </p>

        <form onSubmit={onSubmit} className="w-full space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">
              Email
            </label>
            <input
              required
              type="email"
              placeholder="ton@email.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white rounded-2xl px-5 py-4 border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#73CC30] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">
              Mot de passe
            </label>
            <div className="relative">
              <input
                required
                type={showPwd ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white rounded-2xl px-5 py-4 pr-12 border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#73CC30] transition"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 rounded-full text-white font-black uppercase tracking-wider py-4 mt-2 disabled:opacity-60"
            style={{
              background: "#73CC30",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 22,
              letterSpacing: "0.05em",
            }}
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>Se connecter <ArrowRight size={18} /></>
            )}
          </motion.button>
        </form>

        <div className="text-center mt-6">
          <Link
            to="/mot-de-passe-oublie"
            className="text-sm font-semibold hover:underline"
            style={{ color: "#73CC30" }}
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Pas encore de compte ?{" "}
          <Link to="/inscription" className="font-bold hover:underline" style={{ color: "#73CC30" }}>
            S'inscrire
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
