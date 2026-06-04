import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Users, ClipboardList, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DEPARTEMENTS_FR } from "@/lib/regions";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/inscription")({
  head: () => ({
    meta: [
      { title: "Créer un compte bénévole ou organisateur — Ravito" },
      { name: "description", content: "Rejoins Ravito gratuitement. Inscris-toi comme bénévole pour postuler sur des événements sportifs, ou comme organisateur pour recruter des bénévoles." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SignupPage,
});

type Role = "benevole" | "organisateur";

const STAR_POS = [
  [48,32,1.2],[120,55,0.8],[200,22,1.4],[310,48,0.9],[70,88,1.1],
  [180,75,0.7],[280,35,1.3],[350,65,0.8],[90,15,1.0],[250,90,1.2],
  [160,35,0.6],[300,60,1.1],[40,105,0.9],[220,18,1.3],[380,50,0.7],
] as [number,number,number][];

const slideVariants = {
  enter: { opacity: 0, x: 30 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

function SignupPage() {
  const navigate = useNavigate();
  const { refreshRole } = useAuth();
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dept, setDept] = useState("");
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [niveau, setNiveau] = useState("débutant");
  const [dispos, setDispos] = useState<string[]>([]);
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState("association");
  const [siteWeb, setSiteWeb] = useState("");

  const toggleDispo = (d: string) =>
    setDispos((arr) => (arr.includes(d) ? arr.filter((x) => x !== d) : [...arr, d]));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/` },
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
    <div className="min-h-screen flex bg-background overflow-hidden">
      {/* ── Left panel ── */}
      <div
        className="hidden lg:flex lg:w-[45%] relative flex-col overflow-hidden"
        style={{ background: "var(--auth-panel-gradient)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 700" preserveAspectRatio="xMidYMax slice">
          {STAR_POS.map(([cx, cy, r], i) => (
            <motion.circle key={i} cx={cx} cy={cy} r={r} fill="white"
              animate={{ opacity: [0.3, 0.9, 0.3] }}
              transition={{ duration: 2.5 + i * 0.25, repeat: Infinity, delay: i * 0.15 }} />
          ))}
          <path d="M-20,700 L80,280 L160,400 L250,180 L340,340 L420,220 L520,380 L520,700 Z" fill="white" opacity="0.06"/>
          <path d="M-20,700 L60,400 L140,480 L230,320 L310,440 L400,380 L480,450 L520,700 Z" fill="white" opacity="0.09"/>
          <path d="M-20,700 L30,560 L110,590 L200,540 L290,570 L370,545 L460,570 L520,700 Z" fill="white" opacity="0.05"/>
        </svg>

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
              Rejoins la<br />
              <span style={{ color: "var(--color-accent)" }}>communauté.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-primary-foreground text-sm leading-relaxed max-w-xs"
            >
              Bénévoles et organisateurs, ensemble pour faire vivre le trail français.
            </motion.p>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
            className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)" }}>
            <p className="text-primary-foreground/70 text-xs uppercase tracking-widest font-semibold mb-1">Inscription en</p>
            <p className="text-primary-foreground text-2xl font-black font-display">2 minutes</p>
          </motion.div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <Link to="/" className="lg:hidden mb-8">
          <img src="/logo.png" alt="Ravito" className="h-14 object-contain mx-auto"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
              (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = "block";
            }} />
          <span className="font-display text-3xl font-black text-primary hidden">Ravito</span>
        </Link>

        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {!role ? (
              /* ── Step 1: Role selector ── */
              <motion.div key="role"
                variants={slideVariants} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.3 }}>
                <h1 className="font-display text-4xl font-black mb-2">Je suis…</h1>
                <p className="text-muted-foreground text-sm mb-10">Choisis ton profil pour commencer.</p>

                <div className="grid gap-4">
                  {([
                    { val: "benevole" as Role, icon: <Users size={28} />, title: "Bénévole", desc: "Je veux aider à l'organisation d'événements sportifs near me." },
                    { val: "organisateur" as Role, icon: <ClipboardList size={28} />, title: "Organisateur", desc: "Je cherche des bénévoles pour mon événement sportif." },
                  ] as const).map(({ val, icon, title, desc }) => (
                    <motion.button
                      key={val}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setRole(val)}
                      className="text-left p-6 rounded-2xl border-2 transition-all duration-200 group"
                      style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "var(--shadow-card)" }}
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        {icon}
                      </div>
                      <h3 className="font-display text-xl font-black text-foreground mb-1">{title}</h3>
                      <p className="text-muted-foreground text-sm">{desc}</p>
                      <div className="mt-4 flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-3 transition-all">
                        Choisir <ArrowRight size={14} />
                      </div>
                    </motion.button>
                  ))}
                </div>

                <p className="mt-8 text-center text-sm text-muted-foreground">
                  Déjà inscrit ?{" "}
                  <Link to="/connexion" className="text-primary font-semibold hover:underline">Se connecter</Link>
                </p>
              </motion.div>
            ) : (
              /* ── Step 2: Form ── */
              <motion.div key="form"
                variants={slideVariants} initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.3 }}>
                <button onClick={() => setRole(null)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
                  <ArrowLeft size={16} /> Changer de rôle
                </button>

                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
                    {role === "benevole" ? <Users size={20} /> : <ClipboardList size={20} />}
                  </div>
                  <div>
                    <h1 className="font-display text-2xl font-black">
                      {role === "benevole" ? "Bénévole" : "Organisateur"}
                    </h1>
                    <p className="text-xs text-muted-foreground">Créer mon compte</p>
                  </div>
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                  {/* Role-specific fields */}
                  {role === "benevole" ? (
                    <motion.div
                      className="grid grid-cols-2 gap-4"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Prénom</label>
                        <input required placeholder="Emma" value={prenom} onChange={(e) => setPrenom(e.target.value)} className="inp" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Nom</label>
                        <input required placeholder="Dupont" value={nom} onChange={(e) => setNom(e.target.value)} className="inp" />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Nom de l'organisation</label>
                        <input required placeholder="Association Trail Alpin" value={orgName} onChange={(e) => setOrgName(e.target.value)} className="inp" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Type</label>
                        <select value={orgType} onChange={(e) => setOrgType(e.target.value)} className="inp">
                          <option value="association">Association</option>
                          <option value="entreprise">Entreprise</option>
                          <option value="collectivite">Collectivité</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Site web (optionnel)</label>
                        <input placeholder="https://..." value={siteWeb} onChange={(e) => setSiteWeb(e.target.value)} className="inp" />
                      </div>
                    </motion.div>
                  )}

                  {/* Shared fields */}
                  <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Email</label>
                      <input required type="email" placeholder="ton@email.fr" value={email} onChange={(e) => setEmail(e.target.value)} className="inp" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Mot de passe (6+ caractères)</label>
                      <input required type="password" minLength={6} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="inp" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Département</label>
                      <select required value={dept} onChange={(e) => setDept(e.target.value)} className="inp">
                        <option value="">— Choisir —</option>
                        {DEPARTEMENTS_FR.map((d) => <option key={d.code} value={d.code}>{d.code} — {d.nom}</option>)}
                      </select>
                    </div>
                  </motion.div>

                  {/* Bénévole extras */}
                  {role === "benevole" && (
                    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Niveau trail</label>
                        <select value={niveau} onChange={(e) => setNiveau(e.target.value)} className="inp">
                          <option value="débutant">Débutant</option>
                          <option value="intermédiaire">Intermédiaire</option>
                          <option value="passionné">Passionné</option>
                        </select>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-3 text-muted-foreground">Disponibilités</p>
                        <div className="flex gap-3 flex-wrap">
                          {["weekends", "semaine", "ponctuel"].map((d) => (
                            <button key={d} type="button" onClick={() => toggleDispo(d)}
                              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                                dispos.includes(d)
                                  ? "border-primary bg-primary text-primary-foreground"
                                  : "border-border bg-card text-muted-foreground hover:border-primary/50"
                              }`}>
                              {dispos.includes(d) && <Check size={14} />}
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                    <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.97 }}
                      className="btn-cta w-full flex items-center justify-center gap-2 mt-4">
                      {loading ? <Loader2 size={18} className="animate-spin" /> : <>Créer mon compte <ArrowRight size={16} /></>}
                    </motion.button>
                  </motion.div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
