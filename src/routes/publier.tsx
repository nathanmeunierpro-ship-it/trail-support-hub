import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowLeft, ArrowRight, Loader2, FileText, MapPin, Users, CheckCircle2, Camera, X, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { REGIONS_FR, TYPES_SPORT, MISSIONS } from "@/lib/regions";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/publier")({
  head: () => ({
    meta: [
      { title: "Publier un événement sportif — Ravito" },
      { name: "description", content: "Publiez gratuitement votre annonce de bénévolat pour trail, course, cyclosportive ou triathlon et recevez des candidatures." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PublierPage,
});

const STEP_INFO = [
  { label: "Infos de base", icon: <FileText size={18} /> },
  { label: "Détails", icon: <MapPin size={18} /> },
  { label: "Confirmation", icon: <Users size={18} /> },
];

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 40 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -40 }),
};

function PublierPage() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [nom, setNom] = useState("");
  const [type, setType] = useState("Trail");
  const [date, setDate] = useState("");
  const [ville, setVille] = useState("");
  const [region, setRegion] = useState("");
  const [nbBen, setNbBen] = useState(10);
  const [missions, setMissions] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [emailContact, setEmailContact] = useState("");

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/connexion" });
    if (session?.user?.email && !emailContact) setEmailContact(session.user.email);
  }, [loading, session, navigate]);

  const toggleMission = (m: string) =>
    setMissions((arr) => (arr.includes(m) ? arr.filter((x) => x !== m) : [...arr, m]));

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!nom.trim() || nom.length < 3) e.nom = "Minimum 3 caractères";
    if (!date) e.date = "La date est requise";
    else if (new Date(date) < new Date()) e.date = "La date doit être dans le futur";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!ville.trim() || ville.length < 2) e.ville = "Minimum 2 caractères";
    if (!region) e.region = "La région est requise";
    if (nbBen < 1) e.nbBen = "Minimum 1 bénévole";
    if (!emailContact || !/\S+@\S+\.\S+/.test(emailContact)) e.emailContact = "Email invalide";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setErrors({});
    setDirection(1);
    setStep((s) => Math.min(3, s + 1));
  };

  const goPrev = () => {
    setErrors({});
    setDirection(-1);
    setStep((s) => Math.max(1, s - 1));
  };

  const onSubmit = async () => {
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
    setSuccess(true);
    toast.success("Annonce publiée !");
    try {
      const { sendEmail, htmlBlock } = await import("@/lib/email.functions");
      const html = htmlBlock(`Nouvel événement publié — ${nom}`, {
        "Événement": nom, "Sport": type, "Date": date, "Ville": ville, "Région": region,
        "Bénévoles": String(nbBen), "Email contact": emailContact, "Description": description,
      });
      void sendEmail({ data: { subject: `[Ravito] Événement publié — ${nom}`, html, replyTo: emailContact } });
    } catch (e) { console.error("[publier] email failed", e); }
    setTimeout(() => navigate({ to: "/mon-espace" }), 2000);
  };

  if (!session) return <PageShell><div className="px-6 py-20 text-center">Redirection…</div></PageShell>;

  return (
    <PageShell>
      <section className="px-6 py-12">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h1 className="font-display text-4xl md:text-5xl font-black mb-2">Publier une annonce</h1>
            <p className="text-muted-foreground">Gratuit. En 2 minutes.</p>
          </motion.div>

          {/* Step progress */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-10">
            <div className="flex items-center gap-0">
              {STEP_INFO.map((s, i) => {
                const n = i + 1;
                const done = step > n;
                const active = step === n;
                return (
                  <div key={n} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1.5">
                      <motion.div
                        animate={{
                          backgroundColor: done ? "var(--success)" : active ? "var(--primary)" : "var(--muted)",
                          color: done || active ? "var(--primary-foreground)" : "var(--muted-foreground)",
                          scale: active ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                      >
                        {done ? <Check size={16} /> : s.icon}
                      </motion.div>
                      <span className={`text-xs font-semibold hidden sm:block ${active ? "text-primary" : done ? "text-green-600" : "text-muted-foreground"}`}>
                        {s.label}
                      </span>
                    </div>
                    {i < STEP_INFO.length - 1 && (
                      <div className="flex-1 h-0.5 mx-2" style={{ background: done ? "var(--success)" : "var(--border)" }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: done ? "var(--success)" : "var(--primary)" }}
                          initial={{ width: 0 }}
                          animate={{ width: done ? "100%" : "0%" }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Form card */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
            <AnimatePresence mode="wait" custom={direction}>
              {/* ── Step 1 ── */}
              {step === 1 && (
                <motion.div key="s1" custom={direction}
                  variants={slideVariants} initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.3 }}
                  className="p-8 space-y-6"
                >
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">
                      Nom de l'événement
                    </label>
                    <input
                      value={nom} onChange={(e) => { setNom(e.target.value); if (errors.nom) setErrors((er) => ({ ...er, nom: "" })); }}
                      placeholder="Trail des Alpes 2026"
                      className={`inp ${errors.nom ? "inp-error" : ""}`}
                    />
                    {errors.nom && <p className="text-xs text-destructive mt-1">{errors.nom}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Type de sport</label>
                    <div className="flex flex-wrap gap-2">
                      {TYPES_SPORT.map((t) => (
                        <motion.button key={t} type="button" whileTap={{ scale: 0.95 }}
                          onClick={() => setType(t)}
                          className={`px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                            type === t ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/50"
                          }`}>
                          {t}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Date de l'événement</label>
                    <input type="date" value={date}
                      onChange={(e) => { setDate(e.target.value); if (errors.date) setErrors((er) => ({ ...er, date: "" })); }}
                      className={`inp ${errors.date ? "inp-error" : ""}`}
                    />
                    {errors.date && <p className="text-xs text-destructive mt-1">{errors.date}</p>}
                  </div>
                </motion.div>
              )}

              {/* ── Step 2 ── */}
              {step === 2 && (
                <motion.div key="s2" custom={direction}
                  variants={slideVariants} initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.3 }}
                  className="p-8 space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Ville</label>
                      <input value={ville}
                        onChange={(e) => { setVille(e.target.value); if (errors.ville) setErrors((er) => ({ ...er, ville: "" })); }}
                        placeholder="Chamonix" className={`inp ${errors.ville ? "inp-error" : ""}`} />
                      {errors.ville && <p className="text-xs text-destructive mt-1">{errors.ville}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Région</label>
                      <select value={region}
                        onChange={(e) => { setRegion(e.target.value); if (errors.region) setErrors((er) => ({ ...er, region: "" })); }}
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
                    <input type="range" min={1} max={200} value={nbBen}
                      onChange={(e) => setNbBen(parseInt(e.target.value))}
                      className="w-full accent-primary h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>1</span><span>200</span></div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-muted-foreground">Missions proposées</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {MISSIONS.map((m) => (
                        <motion.button key={m} type="button" whileTap={{ scale: 0.95 }}
                          onClick={() => toggleMission(m)}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all border-2 ${
                            missions.includes(m) ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:border-primary/40"
                          }`}>
                          {missions.includes(m) && <Check size={13} />}
                          {m}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                      placeholder="Décrivez votre événement, le contexte, les missions…"
                      className="inp min-h-28 resize-none" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest mb-2 text-muted-foreground">Email de contact</label>
                    <input type="email" value={emailContact}
                      onChange={(e) => { setEmailContact(e.target.value); if (errors.emailContact) setErrors((er) => ({ ...er, emailContact: "" })); }}
                      className={`inp ${errors.emailContact ? "inp-error" : ""}`} />
                    {errors.emailContact && <p className="text-xs text-destructive mt-1">{errors.emailContact}</p>}
                  </div>
                </motion.div>
              )}

              {/* ── Step 3: Recap + submit ── */}
              {step === 3 && (
                <motion.div key="s3" custom={direction}
                  variants={slideVariants} initial="enter" animate="center" exit="exit"
                  transition={{ duration: 0.3 }}
                  className="p-8"
                >
                  <AnimatePresence mode="wait">
                    {success ? (
                      <motion.div key="success"
                        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center py-10 text-center gap-5">
                        <motion.div
                          initial={{ scale: 0 }} animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                          className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center"
                        >
                          <CheckCircle2 size={40} className="text-green-600" />
                        </motion.div>
                        <div>
                          <h2 className="font-display text-2xl font-black text-green-600 mb-1">Annonce publiée !</h2>
                          <p className="text-muted-foreground text-sm">Redirection vers votre espace…</p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="recap" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <h2 className="font-display text-2xl font-black mb-6">Vérifiez votre annonce</h2>
                        <div className="space-y-3 mb-8">
                          {[
                            { label: "Nom", val: nom },
                            { label: "Type", val: type },
                            { label: "Date", val: new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) },
                            { label: "Lieu", val: `${ville}, ${region}` },
                            { label: "Bénévoles", val: `${nbBen} recherchés` },
                            { label: "Missions", val: missions.length > 0 ? missions.join(", ") : "Non précisé" },
                            { label: "Contact", val: emailContact },
                          ].map(({ label, val }) => (
                            <div key={label} className="flex gap-4 py-2.5 border-b border-border">
                              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground w-28 flex-shrink-0">{label}</span>
                              <span className="text-sm font-medium text-foreground">{val}</span>
                            </div>
                          ))}
                        </div>
                        <motion.button
                          onClick={onSubmit} disabled={submitting} whileTap={{ scale: 0.97 }}
                          className="btn-cta w-full flex items-center justify-center gap-2"
                        >
                          {submitting ? <Loader2 size={18} className="animate-spin" /> : <>Publier l'annonce <ArrowRight size={16} /></>}
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            {!success && (
              <div className="px-8 pb-8 flex justify-between gap-4">
                {step > 1 ? (
                  <motion.button whileTap={{ scale: 0.96 }} onClick={goPrev}
                    className="btn-outline flex items-center gap-2">
                    <ArrowLeft size={16} /> Précédent
                  </motion.button>
                ) : <div />}

                {step < 3 && (
                  <motion.button whileTap={{ scale: 0.96 }} onClick={goNext}
                    className="btn-cta flex items-center gap-2">
                    Suivant <ArrowRight size={16} />
                  </motion.button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
