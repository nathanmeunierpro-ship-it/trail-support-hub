import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

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

const STAR_POS = [
  [48,32,1.2],[120,55,0.8],[200,22,1.4],[310,48,0.9],[70,88,1.1],
  [180,75,0.7],[280,35,1.3],[350,65,0.8],[90,15,1.0],[250,90,1.2],
  [160,35,0.6],[300,60,1.1],[40,105,0.9],[220,18,1.3],[380,50,0.7],
  [140,100,1.0],[330,20,0.8],[60,140,1.1],[240,130,0.9],[380,100,1.2],
] as [number,number,number][];

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
    } else if (session && role === null) {
      // Google login: user authenticated but no role yet → pick role
      navigate({ to: "/inscription", replace: true });
    }
  }, [session, role, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { console.error("[login] signIn error:", error); toast.error(error.message); return; }
    toast.success("Bienvenue !");
  };

  return (
    <div className="min-h-screen flex bg-background overflow-hidden">
      {/* ── Left decorative panel ── */}
      <div
        className="hidden lg:flex lg:w-[45%] relative flex-col overflow-hidden"
        style={{ background: "var(--auth-panel-gradient)" }}
      >
        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* SVG scene */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 700" preserveAspectRatio="xMidYMax slice">
          {STAR_POS.map(([cx, cy, r], i) => (
            <motion.circle
              key={i} cx={cx} cy={cy} r={r} fill="white"
              animate={{ opacity: [0.3, 0.9, 0.3] }}
              transition={{ duration: 2.5 + i * 0.25, repeat: Infinity, delay: i * 0.12 }}
            />
          ))}
          <circle cx={370} cy={75} r={40} fill="white" opacity={0.08} />
          <circle cx={370} cy={75} r={28} fill="white" opacity={0.12} />
          <path d="M-20,700 L80,280 L160,400 L250,180 L340,340 L420,220 L520,380 L520,700 Z" fill="white" opacity="0.06"/>
          <path d="M-20,700 L60,400 L140,480 L230,320 L310,440 L400,380 L480,450 L520,700 Z" fill="white" opacity="0.09"/>
          <path d="M-20,700 L30,560 L110,590 L200,540 L290,570 L370,545 L460,570 L520,700 Z" fill="white" opacity="0.05"/>
          <motion.path
            d="M0,650 Q120,610 220,625 Q320,640 420,608 Q470,595 520,608"
            stroke="var(--color-accent)" strokeWidth="2.5" fill="none" opacity="0.7"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
          />
        </svg>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-10">
          <Link to="/">
            <img src="/logo.png" alt="Ravito" className="h-10 object-contain brightness-0 invert"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
                (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = "block";
              }} />
            <span className="font-display text-3xl font-black text-primary-foreground hidden">Ravito</span>
          </Link>

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-display text-4xl font-black text-primary-foreground leading-tight mb-4"
            >
              L'aventure commence<br />
              <span style={{ color: "var(--color-accent)" }}>avec toi.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-primary-foreground text-sm leading-relaxed max-w-xs"
            >
              Rejoins des milliers de bénévoles passionnés qui font vivre les événements sportifs en France.
            </motion.p>
          </div>

        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <Link to="/" className="lg:hidden mb-10">
          <img src="/logo.png" alt="Ravito" className="h-14 object-contain mx-auto"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
              (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = "block";
            }} />
          <span className="font-display text-3xl font-black text-primary hidden">Ravito</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <h1 className="font-display text-4xl font-black mb-1">Connexion à ton espace Ravito</h1>
          <p className="text-muted-foreground text-sm mb-8">Content de te revoir !</p>

          {/* Google OAuth */}
          <motion.button
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            type="button"
            onClick={() => supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/connexion` } })}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-full border-2 border-border bg-white text-foreground text-sm font-bold hover:border-primary transition-colors mb-6"
          >
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>
            Continuer avec Google
          </motion.button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-widest">ou</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Email</label>
              <input required type="email" placeholder="ton@email.fr" value={email}
                onChange={(e) => setEmail(e.target.value)} className="inp" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Mot de passe</label>
              <div className="relative">
                <input required type={showPwd ? "text" : "password"} placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)} className="inp pr-12" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.97 }}
                className="btn-cta w-full flex items-center justify-center gap-2 mt-2">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <>Se connecter <ArrowRight size={16} /></>}
              </motion.button>
            </motion.div>
          </form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
            className="text-center mt-4">
            <Link to="/mot-de-passe-oublie" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              Mot de passe oublié ?
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="mt-4 text-center text-sm text-muted-foreground"
          >
            Pas encore de compte ?{" "}
            <Link to="/inscription" className="text-primary font-semibold hover:underline">S'inscrire</Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
