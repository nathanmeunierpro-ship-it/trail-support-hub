import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  X,
  CheckCircle,
  Lock,
  Users,
  Mail,
  LayoutDashboard,
  BadgeCheck,
} from "lucide-react";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Faq, faqJsonLd, type FaqItem } from "@/components/Faq";
import {
  PRIX_ANNONCE,
  PRIX_ANNONCE_NUM,
  NB_BENEVOLES,
  STRIPE_PAYMENT_LINK,
  SITE_URL,
  seo,
  jsonLd,
} from "@/lib/site";

const FAQ: FaqItem[] = [
  {
    q: "Que comprend le Pack Organisateur ?",
    a: `Pour ${PRIX_ANNONCE} par événement : la publication de ton annonce jusqu'au jour de la course, sa diffusion auprès des +${NB_BENEVOLES} bénévoles inscrits, des candidatures illimitées, un e-mail à chaque nouvelle candidature, un tableau de bord pour accepter ou refuser chaque bénévole et le badge « Événement vérifié ».`,
  },
  {
    q: "Comment se passe le paiement ?",
    a: "Le paiement se fait en ligne par carte bancaire via Stripe, la solution de paiement sécurisée utilisée par des millions d'entreprises. Une facture t'est envoyée automatiquement par e-mail.",
  },
  {
    q: "Y a-t-il un abonnement ou un engagement ?",
    a: "Non. Tu paies uniquement pour les événements que tu publies, sans abonnement ni frais cachés.",
  },
  {
    q: "J'organise plusieurs courses dans l'année, avez-vous un tarif ?",
    a: "Oui : contacte-nous via l'offre Premium pour un devis adapté à ton nombre d'événements et à la visibilité souhaitée.",
  },
];

export const Route = createFileRoute("/organisateurs/nos-offres")({
  head: () => ({
    ...seo({
      title: `Tarif organisateur : trouver des bénévoles pour ta course — ${PRIX_ANNONCE} | Ravito`,
      description: `Publie ta course sur Ravito avec le Pack Organisateur à ${PRIX_ANNONCE} : annonce vue par +${NB_BENEVOLES} bénévoles inscrits en France, candidatures illimitées, tableau de bord. Sans abonnement.`,
      path: "/organisateurs/nos-offres",
    }),
    scripts: [
      jsonLd(faqJsonLd(FAQ)),
      jsonLd({
        "@context": "https://schema.org",
        "@type": "Product",
        name: "Pack Organisateur Ravito",
        description:
          "Publication d'une annonce de recherche de bénévoles pour un événement sportif.",
        brand: { "@type": "Brand", name: "Ravito" },
        offers: {
          "@type": "Offer",
          price: PRIX_ANNONCE_NUM.toFixed(2),
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/organisateurs/nos-offres`,
        },
      }),
    ],
  }),
  component: Page,
});

const PACK_FEATURES = [
  { icon: <Users size={18} />, t: `Annonce vue par +${NB_BENEVOLES} bénévoles inscrits` },
  { icon: <Mail size={18} />, t: "E-mail à chaque nouvelle candidature" },
  { icon: <LayoutDashboard size={18} />, t: "Tableau de bord : accepter / refuser en un clic" },
  { icon: <Check size={18} />, t: "Candidatures illimitées, en ligne jusqu'au jour J" },
  { icon: <BadgeCheck size={18} />, t: "Badge « Événement vérifié »" },
];

const SPORTS = ["Trail", "Running", "Vélo", "Triathlon", "Cyclosportive", "Autre"];

type FormState = {
  organisation: string;
  responsable: string;
  email: string;
  telephone: string;
  evenement: string;
  sport: string;
  date: string;
  ville: string;
  benevoles: string;
  message: string;
};

const EMPTY_FORM: FormState = {
  organisation: "",
  responsable: "",
  email: "",
  telephone: "",
  evenement: "",
  sport: "",
  date: "",
  ville: "",
  benevoles: "",
  message: "",
};

function Page() {
  const [modalOffer, setModalOffer] = useState<string | null>(null);

  return (
    <PageShell padTop={false}>
      <section className="keep-pad section-dark px-6 pb-16 pt-32 md:pb-24 md:pt-40">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
            Organisateurs
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.9] !text-white"
          >
            Trouve tous les bénévoles de ta course
          </motion.h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70">
            Un seul pack, un prix clair. Ton annonce est diffusée auprès des{" "}
            <strong className="text-white">+{NB_BENEVOLES} bénévoles inscrits</strong> sur Ravito
            partout en France.
          </p>
        </div>
      </section>

      <section className="-mt-10 px-6 pb-20 md:-mt-14">
        <div className="mx-auto grid max-w-5xl items-stretch gap-6 md:grid-cols-[1.35fr_1fr]">
          {/* Pack Organisateur */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative flex flex-col rounded-[2rem] bg-white p-8 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.35)] ring-2 ring-primary md:p-10"
          >
            <span className="absolute -top-3 left-8 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A]">
              Le plus choisi
            </span>
            <h2 className="text-4xl">Pack Organisateur</h2>
            <p className="mt-1 text-sm text-black/60">
              Tout ce qu'il faut pour recruter tes bénévoles.
            </p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-display text-7xl leading-none">{PRIX_ANNONCE}</span>
              <span className="text-sm text-black/60">par événement · sans abonnement</span>
            </div>
            <ul className="mt-8 flex-1 space-y-3">
              {PACK_FEATURES.map((f) => (
                <li key={f.t} className="flex items-center gap-3 text-[15px]">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[#3d6e1a]">
                    {f.icon}
                  </span>
                  {f.t}
                </li>
              ))}
            </ul>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Link to="/publier" className="btn-primary gap-2">
                Publier ma course <ArrowRight size={16} />
              </Link>
              <a
                href={STRIPE_PAYMENT_LINK}
                target="_blank"
                rel="noopener"
                className="btn-secondary gap-2"
              >
                <Lock size={14} /> Payer {PRIX_ANNONCE}
              </a>
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-black/50">
              <Lock size={12} /> Paiement sécurisé par carte via Stripe · facture envoyée par e-mail
            </p>
          </motion.div>

          {/* Premium */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col rounded-[2rem] bg-[#1A1A1A] p-8 text-white md:p-10"
          >
            <span className="self-start rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
              Visibilité maximale
            </span>
            <h2 className="mt-4 text-4xl !text-white">Premium</h2>
            <p className="mt-1 text-sm text-white/60">
              Pour les grands événements et les organisateurs de plusieurs courses.
            </p>
            <div className="mt-6 font-display text-5xl leading-none text-primary">Sur devis</div>
            <ul className="mt-8 flex-1 space-y-3 text-[15px]">
              {[
                "Tout le Pack Organisateur",
                "Mise en avant en page d'accueil",
                "E-mail dédié à toute la base de bénévoles",
                "Posts et stories sur nos réseaux",
                "Tarif dégressif multi-courses",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <Check size={18} className="mt-0.5 shrink-0 text-primary" /> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setModalOffer("Premium — sur devis")}
              className="btn-outline-light mt-8 gap-2"
            >
              Demander un devis <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Étapes */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-[clamp(2.25rem,5vw,3.5rem)] leading-none">
            En ligne en 3 étapes
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                t: "Crée ton annonce",
                d: "Date, lieu, missions et nombre de bénévoles : 5 minutes suffisent.",
              },
              {
                t: `Règle ${PRIX_ANNONCE}`,
                d: "Paiement sécurisé par carte via Stripe, facture automatique.",
              },
              {
                t: "Reçois les candidatures",
                d: "Un e-mail à chaque bénévole qui postule, tu valides en un clic.",
              },
            ].map((s, i) => (
              <div key={s.t} className="rounded-3xl bg-muted p-7">
                <span className="font-display text-5xl text-primary">0{i + 1}</span>
                <h3 className="mt-2 text-2xl">{s.t}</h3>
                <p className="mt-1 text-sm text-black/60">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-10 text-center text-[clamp(2.25rem,5vw,3.5rem)] leading-none">
            Questions fréquentes
          </h2>
          <Faq items={FAQ} />
          <div className="mt-10 text-center">
            <Link to="/publier" className="btn-primary gap-2">
              Publier ma course maintenant <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <QuoteModal offer={modalOffer} onClose={() => setModalOffer(null)} />
    </PageShell>
  );
}

function QuoteModal({ offer, onClose }: { offer: string | null; onClose: () => void }) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (k: keyof FormState, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.organisation.trim()) e.organisation = "Champ requis";
    if (!form.responsable.trim()) e.responsable = "Champ requis";
    if (!form.email.trim()) e.email = "Champ requis";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Email invalide";
    if (!form.evenement.trim()) e.evenement = "Champ requis";
    if (!form.sport) e.sport = "Champ requis";
    if (!form.date) e.date = "Champ requis";
    if (!form.ville.trim()) e.ville = "Champ requis";
    if (!form.benevoles.trim()) e.benevoles = "Champ requis";
    else if (Number(form.benevoles) <= 0) e.benevoles = "Nombre invalide";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate() || !offer) return;
    setSending(true);
    try {
      await fetch("/api/public/quote-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offer,
          organisation: form.organisation,
          responsable: form.responsable,
          email: form.email,
          telephone: form.telephone,
          evenement: form.evenement,
          sport: form.sport,
          date: form.date,
          ville: form.ville,
          benevoles: form.benevoles,
          message: form.message,
        }),
      });
    } catch (e) {
      console.error("[devis] send failed", e);
    } finally {
      setSending(false);
      setSent(true);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setForm(EMPTY_FORM);
      setErrors({});
      setSent(false);
      setSending(false);
    }, 200);
  };

  return (
    <AnimatePresence>
      {offer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClose}
              aria-label="Fermer"
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
            >
              <X size={20} />
            </button>

            <div className="p-6 sm:p-8">
              <h3 className="font-display text-2xl font-black mb-1 pr-10">
                Demande de devis — {offer}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Réponse sous 48h avec un lien de paiement.
              </p>

              {sent ? (
                <div className="text-center py-10">
                  <CheckCircle size={32} color="#73CC30" strokeWidth={1.5} className="mb-4" />
                  <p className="font-display text-lg font-black mb-2">Demande envoyée !</p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Nous vous répondrons sous 48h avec un lien de paiement.
                  </p>
                  <button
                    onClick={handleClose}
                    className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider bg-[var(--color-primary)] text-white hover:opacity-90"
                  >
                    Fermer
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Nom de l'organisation" required error={errors.organisation}>
                      <input
                        value={form.organisation}
                        onChange={(e) => update("organisation", e.target.value)}
                        className={inputCls(!!errors.organisation)}
                      />
                    </Field>
                    <Field label="Nom et prénom du responsable" required error={errors.responsable}>
                      <input
                        value={form.responsable}
                        onChange={(e) => update("responsable", e.target.value)}
                        className={inputCls(!!errors.responsable)}
                      />
                    </Field>
                    <Field label="Email de contact" required error={errors.email}>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        className={inputCls(!!errors.email)}
                      />
                    </Field>
                    <Field label="Téléphone" error={errors.telephone}>
                      <input
                        type="tel"
                        value={form.telephone}
                        onChange={(e) => update("telephone", e.target.value)}
                        className={inputCls(false)}
                      />
                    </Field>
                    <Field label="Nom de l'événement" required error={errors.evenement}>
                      <input
                        value={form.evenement}
                        onChange={(e) => update("evenement", e.target.value)}
                        className={inputCls(!!errors.evenement)}
                      />
                    </Field>
                    <Field label="Type de sport" required error={errors.sport}>
                      <select
                        value={form.sport}
                        onChange={(e) => update("sport", e.target.value)}
                        className={inputCls(!!errors.sport)}
                      >
                        <option value="">Sélectionner…</option>
                        {SPORTS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Date de l'événement" required error={errors.date}>
                      <input
                        type="date"
                        value={form.date}
                        onChange={(e) => update("date", e.target.value)}
                        className={inputCls(!!errors.date)}
                      />
                    </Field>
                    <Field label="Ville" required error={errors.ville}>
                      <input
                        value={form.ville}
                        onChange={(e) => update("ville", e.target.value)}
                        className={inputCls(!!errors.ville)}
                      />
                    </Field>
                    <Field label="Nombre de bénévoles recherchés" required error={errors.benevoles}>
                      <input
                        type="number"
                        min={1}
                        value={form.benevoles}
                        onChange={(e) => update("benevoles", e.target.value)}
                        className={inputCls(!!errors.benevoles)}
                      />
                    </Field>
                    <Field label="Offre sélectionnée">
                      <input
                        value={offer}
                        readOnly
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700"
                      />
                    </Field>
                  </div>
                  <Field label="Message / précisions">
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={(e) => update("message", e.target.value)}
                      className={inputCls(false)}
                    />
                  </Field>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold uppercase tracking-wider bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {sending ? "Envoi…" : "Envoyer ma demande"}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
        {label} {required && <span className="text-[var(--color-primary)]">*</span>}
      </span>
      {children}
      {error && <span className="block mt-1 text-xs text-red-600">{error}</span>}
    </label>
  );
}

function inputCls(hasError: boolean) {
  return `w-full rounded-lg border ${
    hasError ? "border-red-500" : "border-gray-300"
  } bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 focus:border-[var(--color-primary)] transition-colors`;
}
