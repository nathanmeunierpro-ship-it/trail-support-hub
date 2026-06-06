import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/organisateurs/nos-offres")({
  head: () => ({
    meta: [
      { title: "Tarifs et offres — Ravito" },
      {
        name: "description",
        content:
          "Découvre nos offres pour publier ton événement sportif et trouver des bénévoles. Gratuit pour les 20 premiers.",
      },
      { property: "og:title", content: "Tarifs et offres — Ravito" },
      {
        property: "og:description",
        content:
          "Découvre nos offres pour publier ton événement sportif et trouver des bénévoles. Gratuit pour les 20 premiers.",
      },
    ],
  }),
  component: Page,
});

type Offer = {
  name: string;
  badge: string;
  price: string;
  priceSuffix?: string;
  features: string[];
  ctaLabel: string;
  ctaKind: "link" | "modal";
  ctaHref?: string;
  modalOffer?: string;
  highlighted?: boolean;
  borderClass: string;
  bgClass: string;
  textClass: string;
  badgeClass: string;
};

const OFFERS: Offer[] = [
  {
    name: "Starter",
    badge: "GRATUIT — 20 PREMIERS",
    price: "0€",
    features: ["1 annonce publiée", "Réception des candidatures", "Tableau de bord basique"],
    ctaLabel: "Publier mon événement",
    ctaKind: "link",
    ctaHref: "/publier",
    borderClass: "border-2 border-[var(--color-primary)]",
    bgClass: "bg-white",
    textClass: "text-foreground",
    badgeClass: "bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
  },
  {
    name: "Essentiel",
    badge: "LE PLUS CHOISI",
    price: "14,99€",
    priceSuffix: "par événement",
    highlighted: true,
    features: [
      "1 annonce publiée",
      "Gestion des candidatures (accepter / refuser)",
      "Tableau de bord complet",
      'Badge "Événement vérifié"',
      "Plusieurs événements ? Me contacter",
    ],
    ctaLabel: "Choisir cette offre",
    ctaKind: "modal",
    modalOffer: "Essentiel — 14,99€",
    borderClass: "border-2 border-[var(--color-primary)]",
    bgClass: "bg-[var(--color-primary)]",
    textClass: "text-white",
    badgeClass: "bg-white text-[var(--color-primary)]",
  },
  {
    name: "Premium",
    badge: "VISIBILITÉ MAXIMALE",
    price: "Me Contacter",
    features: [
      "Tout l'Essentiel inclus",
      "Mise en avant homepage et carousel",
      "Contenu réseaux sociaux (posts, stories)",
      "Email envoyé à toute la base de bénévoles Ravito pour promouvoir ton événement auprès de sportifs déjà inscrits et motivés",
      "Analytics avancés",
      "Support dédié",
    ],
    ctaLabel: "Nous contacter",
    ctaKind: "modal",
    modalOffer: "Premium — à partir de 49,99€",
    borderClass: "border-2 border-[var(--color-primary)]",
    bgClass: "bg-white",
    textClass: "text-foreground",
    badgeClass: "bg-[var(--color-primary)]/15 text-[var(--color-primary)]",
  },
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
    <PageShell>
      <section className="px-6 pt-20 pb-10">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] mb-3">
            Organisateurs
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-6xl font-black mb-6"
          >
            Nos offres pour les organisateurs
          </motion.h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Choisis la formule qui correspond à ton événement et à tes ambitions de visibilité.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-3 items-stretch">
            {OFFERS.map((o, i) => (
              <motion.div
                key={o.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl p-7 flex flex-col ${o.bgClass} ${o.textClass} ${o.borderClass} ${
                  o.highlighted ? "md:-translate-y-3 shadow-2xl" : "shadow-md"
                }`}
              >
                <span
                  className={`inline-block self-start text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-4 ${o.badgeClass}`}
                >
                  {o.badge}
                </span>
                <h2 className="font-display text-2xl font-black mb-1">{o.name}</h2>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="font-display text-4xl font-black">{o.price}</span>
                  {o.priceSuffix && (
                    <span className={`text-sm ${o.highlighted ? "text-white/80" : "text-muted-foreground"}`}>
                      {o.priceSuffix}
                    </span>
                  )}
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {o.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm leading-relaxed">
                      <Check
                        size={16}
                        className={`mt-0.5 shrink-0 ${o.highlighted ? "text-white" : "text-[var(--color-primary)]"}`}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                {o.ctaKind === "link" && o.ctaHref ? (
                  <Link
                    to={o.ctaHref}
                    className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold uppercase tracking-wider transition-opacity hover:opacity-90 ${
                      o.highlighted ? "bg-white text-[var(--color-primary)]" : "bg-[var(--color-primary)] text-white"
                    }`}
                  >
                    {o.ctaLabel} <ArrowRight size={14} />
                  </Link>
                ) : (
                  <button
                    onClick={() => setModalOffer(o.modalOffer!)}
                    className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold uppercase tracking-wider transition-opacity hover:opacity-90 ${
                      o.highlighted ? "bg-white text-[var(--color-primary)]" : "bg-[var(--color-primary)] text-white"
                    }`}
                  >
                    {o.ctaLabel} <ArrowRight size={14} />
                  </button>
                )}
              </motion.div>
            ))}
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

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate() || !offer) return;
    setSending(true);
    const body = [
      `Offre sélectionnée : ${offer}`,
      ``,
      `Organisation : ${form.organisation}`,
      `Responsable : ${form.responsable}`,
      `Email : ${form.email}`,
      `Téléphone : ${form.telephone || "—"}`,
      ``,
      `Événement : ${form.evenement}`,
      `Sport : ${form.sport}`,
      `Date : ${form.date}`,
      `Ville : ${form.ville}`,
      `Bénévoles recherchés : ${form.benevoles}`,
      ``,
      `Message :`,
      form.message || "—",
    ].join("\n");
    const url = `mailto:contact@ravito.fr?subject=${encodeURIComponent(
      `Demande de devis — ${offer}`,
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 400);
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
                  <div className="text-4xl mb-4">✅</div>
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
                          <option key={s} value={s}>{s}</option>
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
