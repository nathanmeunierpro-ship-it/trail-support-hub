import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Users, ClipboardList, ArrowLeft, ArrowRight, Loader2, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { DEPARTEMENTS_FR } from "@/lib/regions";
import ravitoLogoGreen from "@/assets/ravito-logo-green.png.asset.json";

export const Route = createFileRoute("/inscription")({
  head: () => ({
    meta: [
      { title: "Créer un compte — Ravito" },
      { name: "description", content: "Inscris-toi comme bénévole ou organisateur et rejoins la communauté sportive Ravito en France." },
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

const DISPO_OPTIONS = ["weekends", "semaine", "ponctuel", "vacances"];

function SignupPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [dept, setDept] = useState("");
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [dispos, setDispos] = useState<string[]>([]);
  const [orgName, setOrgName] = useState("");
  const [orgType, setOrgType] = useState("association");
  const [siteWeb, setSiteWeb] = useState("");

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleDispo = (d: string) =>
    setDispos((arr) => (arr.includes(d) ? arr.filter((x) => x !== d) : [...arr, d]));

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) { toast.error("Merci de choisir une image."); return; }
    if (f.size > 5 * 1024 * 1024) { toast.error("Image trop lourde (max 5 Mo)."); return; }
    setAvatarFile(f);
    setAvatarPreview(URL.createObjectURL(f));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } },
    });

    if (error) {
      console.error("[signup] signUp error:", error);
      setLoading(false);
      if (error.message.toLowerCase().includes("rate limit") || error.message.includes("second")) {
        toast.error("Trop de tentatives. Attends quelques secondes puis réessaie.");
      } else if (error.message.toLowerCase().includes("already")) {
        toast.error("Cet email est déjà utilisé. Connecte-toi à la place.");
      } else {
        toast.error(error.message);
      }
      return;
    }

    const uid = data.user?.id;
    if (!uid) { setLoading(false); toast.error("Erreur lors de la création du compte."); return; }

    let { data: sess } = await supabase.auth.getSession();
    if (!sess.session) {
      const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
      if (signInErr) {
        console.error("[signup] auto sign-in error:", signInErr);
        setLoading(false);
        toast.error(signInErr.message);
        return;
      }
      ({ data: sess } = await supabase.auth.getSession());
    }
    const authedId = sess.session?.user.id ?? uid;

    // Upload avatar (bénévole only — but available for both)
    let avatarPath: string | null = null;
    if (avatarFile) {
      const ext = avatarFile.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${authedId}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, avatarFile, { upsert: true, contentType: avatarFile.type });
      if (upErr) {
        console.error("[signup] avatar upload error:", upErr);
        toast.error("Photo non envoyée : " + upErr.message);
      } else {
        avatarPath = path;
      }
    }

    if (role === "benevole") {
      const { error: e2 } = await supabase.from("benevoles").insert({
        id: authedId,
        prenom,
        nom,
        departement: dept,
        disponibilites: dispos,
        phone,
        avatar_url: avatarPath,
      });
      if (e2) { console.error("[signup] benevoles insert error:", e2); setLoading(false); toast.error(e2.message); return; }
    } else {
      const { error: e2 } = await supabase.from("organisateurs").insert({
        id: authedId, nom_organisation: orgName, type_organisation: orgType,
        departement: dept, site_web: siteWeb || null,
      });
      if (e2) { console.error("[signup] organisateurs insert error:", e2); setLoading(false); toast.error(e2.message); return; }
    }

    setLoading(false);
    toast.success("Compte créé !");
    try {
      const { sendEmail, htmlBlock } = await import("@/lib/email.functions");
      const html = htmlBlock(`Nouvelle inscription Ravito — ${role}`, {
        "Rôle": role, "Email": email, "Prénom": prenom, "Nom": nom,
      });
      void sendEmail({ data: { subject: `[Ravito] Nouvelle inscription — ${prenom} ${nom}`, html, replyTo: email } });
    } catch (e) { console.error("[signup] email failed", e); }
    navigate({ to: role === "organisateur" ? "/mon-espace" : "/mes-candidatures" });
  };

  if (!role) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
        style={{ background: "#f0f7e6" }}
      >
        <Link to="/" className="mb-10">
          <img
            src={ravitoLogoGreen.url}
            alt="Ravito"
            className="h-40 w-auto"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
              (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = "block";
            }}
          />
          <span className="font-display text-3xl font-black text-primary hidden">Ravito</span>
        </Link>

        <h1
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 900,
            fontSize: 52,
            color: "#73CC30",
            textAlign: "center",
            letterSpacing: "-1px",
            lineHeight: 1,
            margin: 0,
          }}
        >
          Tu es ici pour...
        </h1>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 16,
            color: "#6B6B6B",
            textAlign: "center",
            marginTop: 12,
            marginBottom: 40,
          }}
        >
          Choisis ton profil pour commencer
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "center",
            width: "100%",
            maxWidth: 600,
          }}
        >
          {([
            {
              val: "benevole" as Role,
              Icon: Users,
              title: "BÉNÉVOLE",
              desc: "Je veux aider sur un événement près de chez moi",
              btnBg: "#73CC30",
              btnColor: "#1A1A1A",
            },
            {
              val: "organisateur" as Role,
              Icon: ClipboardList,
              title: "ORGANISATEUR",
              desc: "Je cherche des bénévoles pour mon événement sportif",
              btnBg: "#1A1A1A",
              btnColor: "#FFFFFF",
            },
          ] as const).map(({ val, Icon, title, desc, btnBg, btnColor }) => (
            <motion.button
              key={val}
              type="button"
              whileHover={{ y: -4 }}
              onClick={() => setRole(val)}
              style={{
                background: "#FFFFFF",
                borderRadius: 16,
                padding: "32px 28px",
                width: 260,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                textAlign: "left",
              }}
            >
              <div style={{ marginBottom: 16, color: "#73CC30" }}>
                <Icon size={24} />
              </div>
              <h3
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 900,
                  fontSize: 28,
                  color: "#1A1A1A",
                  letterSpacing: "-0.5px",
                  margin: 0,
                  marginBottom: 8,
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  color: "#6B6B6B",
                  lineHeight: 1.5,
                  margin: 0,
                  marginBottom: 20,
                }}
              >
                {desc}
              </p>
              <span
                style={{
                  background: btnBg,
                  color: btnColor,
                  borderRadius: 100,
                  padding: "10px 20px",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  alignSelf: "stretch",
                  textAlign: "center",
                }}
              >
                Choisir →
              </span>
            </motion.button>
          ))}
        </div>

        <p className="mt-10 text-center text-sm" style={{ color: "#6B6B6B" }}>
          Déjà inscrit ?{" "}
          <Link to="/connexion" className="text-primary font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    );
  }

  const inpStyle: React.CSSProperties = {
    width: "100%",
    border: "1.5px solid #e5e5e5",
    borderRadius: 12,
    padding: "14px 16px",
    fontSize: 15,
    background: "#FFFFFF",
    fontFamily: "'Inter', sans-serif",
    color: "#1A1A1A",
    outline: "none",
  };
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    letterSpacing: "1px",
    textTransform: "uppercase",
    color: "#888",
    marginBottom: 6,
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f7e6" }}>
      <style>{`
        .ravito-inp:focus { border-color: #73CC30 !important; }
      `}</style>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "40px 24px" }}>
        <Link to="/" style={{ display: "block", textAlign: "center", marginBottom: 32 }}>
          <img
            src={ravitoLogoGreen.url}
            alt="Ravito"
            className="h-40 w-auto mx-auto block"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
              (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = "block";
            }}
          />
          <span className="font-display text-3xl font-black text-primary" style={{ display: "none" }}>Ravito</span>
        </Link>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#f0f7e6",
              borderRadius: 100,
              padding: "6px 16px",
              fontSize: 14,
              fontWeight: 600,
              color: "#1A1A1A",
              marginBottom: 8,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {role === "benevole" ? <Users size={14} /> : <ClipboardList size={14} />}
            {role === "benevole" ? "Bénévole" : "Organisateur"}
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#1A1A1A", margin: 0, marginBottom: 4 }}>
            Crée ton compte
          </h1>
          <p style={{ fontSize: 14, color: "#888", margin: 0, marginBottom: 32 }}>
            Quelques infos pour commencer
          </p>
        </div>

        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Avatar */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 4 }}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "#f5f5f5",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
              aria-label="Ajouter une photo de profil"
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <Camera size={26} color="#999" />
              )}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={onAvatarChange} className="hidden" />
            <span style={{ marginTop: 8, fontSize: 12, color: "#888" }}>
              {avatarPreview ? "Changer la photo" : "Ajouter une photo"}
            </span>
          </div>

          {role === "benevole" ? (
            <>
              <div>
                <label style={labelStyle}>Prénom</label>
                <input required placeholder="Emma" value={prenom} onChange={(e) => setPrenom(e.target.value)} className="ravito-inp" style={inpStyle} />
              </div>
              <div>
                <label style={labelStyle}>Nom</label>
                <input required placeholder="Dupont" value={nom} onChange={(e) => setNom(e.target.value)} className="ravito-inp" style={inpStyle} />
              </div>
            </>
          ) : (
            <>
              <div>
                <label style={labelStyle}>Nom de l'organisation</label>
                <input required placeholder="Association Trail Alpin" value={orgName} onChange={(e) => setOrgName(e.target.value)} className="ravito-inp" style={inpStyle} />
              </div>
              <div>
                <label style={labelStyle}>Type</label>
                <select value={orgType} onChange={(e) => setOrgType(e.target.value)} className="ravito-inp" style={inpStyle}>
                  <option value="association">Association</option>
                  <option value="entreprise">Entreprise</option>
                  <option value="collectivite">Collectivité</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Site web (optionnel)</label>
                <input placeholder="https://..." value={siteWeb} onChange={(e) => setSiteWeb(e.target.value)} className="ravito-inp" style={inpStyle} />
              </div>
            </>
          )}

          <div>
            <label style={labelStyle}>Email</label>
            <input required type="email" placeholder="ton@email.fr" value={email} onChange={(e) => setEmail(e.target.value)} className="ravito-inp" style={inpStyle} />
          </div>

          <div>
            <label style={labelStyle}>Téléphone</label>
            <input
              required
              type="tel"
              placeholder="06 12 34 56 78"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="ravito-inp"
              style={inpStyle}
            />
            <p style={{ marginTop: 6, fontSize: 12, color: "#888" }}>
              {role === "benevole"
                ? "Pour la coordination WhatsApp avec les organisateurs"
                : "Pour la coordination WhatsApp avec les bénévoles"}
            </p>
          </div>

          <div>
            <label style={labelStyle}>Mot de passe</label>
            <input required type="password" minLength={6} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="ravito-inp" style={inpStyle} />
          </div>

          <div>
            <label style={labelStyle}>Département</label>
            <input
              required
              list="departements-list"
              placeholder="Ex: 69 - Rhône"
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="ravito-inp"
              style={inpStyle}
            />
            <datalist id="departements-list">
              {DEPARTEMENTS_FR.map((d) => (
                <option key={d.code} value={`${d.code} - ${d.nom}`} />
              ))}
            </datalist>
          </div>

          {role === "benevole" && (
            <div>
              <label style={labelStyle}>Disponibilités</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {DISPO_OPTIONS.map((d) => {
                  const active = dispos.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDispo(d)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "8px 14px",
                        borderRadius: 100,
                        border: `1.5px solid ${active ? "#73CC30" : "#e5e5e5"}`,
                        background: active ? "#73CC30" : "#FFFFFF",
                        color: active ? "#1A1A1A" : "#666",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {active && <Check size={12} />}
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 24,
              width: "100%",
              padding: "16px",
              borderRadius: 12,
              background: "#73CC30",
              color: "#1A1A1A",
              fontWeight: 700,
              fontSize: 15,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              fontFamily: "'Inter', sans-serif",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <>Créer mon compte →</>}
          </button>

          <button
            type="button"
            onClick={() => setRole(null)}
            style={{
              marginTop: 16,
              background: "none",
              border: "none",
              color: "#888",
              fontSize: 13,
              cursor: "pointer",
              textAlign: "center",
            }}
          >
            ← Changer de rôle
          </button>

          <p style={{ marginTop: 8, textAlign: "center", fontSize: 13, color: "#888" }}>
            Déjà un compte ?{" "}
            <Link to="/connexion" style={{ color: "#73CC30", fontWeight: 600 }}>
              Se connecter →
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
