import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, X } from "lucide-react";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/organisateurs/nos-offres")({
  head: () => ({
    meta: [
      { title: "Nos offres — Organisateurs · Ravito" },
      {
        name: "description",
        content:
          "Découvre les formules Ravito pour publier ton événement sportif et trouver tes bénévoles : Starter, Essentiel et Premium.",
      },
      { property: "og:title", content: "Nos offres — Organisateurs · Ravito" },
      {
        property: "og:description",
        content:
          "Découvre les formules Ravito pour publier ton événement sportif et trouver tes bénévoles : Starter, Essentiel et Premium.",
      },
    ],
  }),
  component: Page,
});

type Offer = {
  name: string;
  badge: string;
  price: string;
  priceNote?: string;
  subtitle: string;
  features: string[];
  ctaLabel: string;
  ctaKind: "link" | "modal";
  ctaHref?: string;
  modalOffer?: string;
  highlighted?: boolean;
};

const OFFERS: Offer[] = [
  {
    name: "Starter",
    badge: "GRATUIT — 20 PREMIERS",
    price: "0€",
    subtitle: "Pour découvrir Ravito",
    features: ["1 annonce publiée", "Réception des candidatures", "Dashboard basique"],
    ctaLabel: "Publier mon événement",
    ctaKind: "link",
    ctaHref: "/publier",
  },
  {
    name: "Essentiel",
    badge: "LE PLUS CHOISI",
    price: "14,99€",
    priceNote: "par événement",
    subtitle: "Le meilleur rapport qualité-prix",
    features: [
      "1 annonce publiée",
      "Gestion des candidatures (accepter / refuser)",
      "Dashboard organisateur complet",
      'Badge "Événement vérifié"',
      "Plusieurs événements ? Nous contacter",
    ],
    ctaLabel: "Choisir cette offre",
    ctaKind: "modal",
    modalOffer: "Essentiel — 14,99€",
    highlighted: true,
  },
  {
    name: "Premium",
    badge: "VISIBILITÉ MAXIMALE",
    price: "Nous contacter",
    subtitle: "Sur devis",
    features: [
      "Tout l'Essentiel inclus",
      "Mise en avant homepage et carousel",
      "Contenu réseaux sociaux (posts, stories)",
      "Email envoyé à toute la base de bénévoles Ravito",
      "Analytics avancés",
      "Support dédié",
    ],
    ctaLabel: "Nous contacter",
    ctaKind: "modal",
    modalOffer: "Premium — à partir de 49,99€",
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
      <section className="px-6 pt-20 pb-6">
        <div className="mx-auto max-w-5xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#1D6FE8] mb-3"
          >
            Organisateurs
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display text-4xl md:text-6xl font-black mb-5"
          >
            Nos offres
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Choisis la formule qui correspond à ton événement et à tes ambitions de visibilité.
          </motion.p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-3 items-stretch">
            {OFFERS.map((o, i) => (
              <motion.div
                key={o.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.12, duration: 0.45, ease: "easeOut" }}
                className={`relative rounded-2xl flex flex-col transition-all duration-300 ${
                  o.highlighted
                    ? "md:scale-[1.04] z-10 shadow-2xl shadow-[#F55D3E]/25 bg-[#F55D3E] text-white"
                    : "bg-white border-2 border-[#8CC4D8] shadow-sm hover:shadow-lg hover:-translate-y-1 text-foreground"
                }`}
              >
                {/* Badge */}
                <div className="px-7 pt-7 pb-0">
                  <span
                    className={`inline-block text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-5 ${
                      o.highlighted
                        ? "bg-white/20 text-white"
                        : "bg-[#8CC4D8]/15 text-[#2a6b82]"
                    }`}
                  >
                    {o.badge}
                  </span>
                </div>

                {/* Title & Price */}
                <div className="px-7 pb-6">
                  <h2
                    className={`font-display text-2xl font-black mb-3 ${
                      o.highlighted ? "text-white" : "text-foreground"
                    }`}
                  >
                    {o.name}
                  </h2>
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`font-display font-black leading-none ${
                        o.highlighted
                          ? "text-white text-5xl"
                          : o.name === "Premium"
                            ? "text-[#2a6b82] text-[1.5rem]"
                            : "text-foreground text-5xl"
                      }`}
                    >
                      {o.price}
                    </span>
                    {o.priceNote && (
                      <span
                        className={`text-sm ${
                          o.highlighted ? "text-white/80" : "text-muted-foreground"
                        }`}
                      >
                        {o.priceNote}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm mt-1 ${
                      o.highlighted ? "text-white/70" : "text-muted-foreground"
                    }`}
                  >
                    {o.subtitle}
                  </p>
                </div>

                {/* Divider */}
                <div
                  className={`mx-7 h-px ${
                    o.highlighted ? "bg-white/20" : "bg-[#8CC4D8]/40"
                  }`}
                />

                {/* Features */}
                <div className="px-7 py-6 flex-1">
                  <ul className="space-y-3.5">
                    {o.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm leading-relaxed">
                        <span
                          className={`mt-0.5 shrink-0 flex items-center justify-center w-5 h-5 rounded-full ${
                            o.highlighted
                              ? "bg-white/20 text-white"
                              : "bg-[#8CC4D8]/15 text-[#2a6b82]"
                          }`}
                        >
                          <Check size={12} strokeWidth={3} />
                        </span>
                        <span className={o.highlighted ? "text-white/95" : "text-foreground/90"}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="px-7 pb-7 pt-2">
                  {o.ctaKind === "link" && o.ctaHref ? (
                    <Link
                      to={o.ctaHref}
                      className={`w-full inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
                        o.highlighted
                          ? "bg-white text-[#F55D3E] hover:bg-white/90 shadow-lg"
                          : "bg-[#1D6FE8] text-white hover:bg-[#1a62cf] shadow-md hover:shadow-lg"
                      }`}
                    >
                      {o.ctaLabel} <ArrowRight size={15} />
                    </Link>
                  ) : (
                    <button
                      onClick={() => setModalOffer(o.modalOffer!)}
                      className={`w-full inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
                        o.highlighted
                          ? "bg-white text-[#F55D3E] hover:bg-white/90 shadow-lg"
                          : "bg-[#1D6FE8] text-white hover:bg-[#1a62cf] shadow-md hover:shadow-lg"
                      }`}
                    >
                      {o.ctaLabel} <ArrowRight size={15} />
                    </button>
                  )}
                </div>
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
                    className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider bg-[#1D6FE8] text-white hover:opacity-90"
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
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full px-5 py-3.5 text-sm font-bold uppercase tracking-wider bg-[#1D6FE8] text-white hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
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
        {label} {required && <span className="text-[#1D6FE8]">*</span>}
      </span>
      {children}
      {error && <span className="block mt-1 text-xs text-red-600">{error}</span>}
    </label>
  );
}

function inputCls(hasError: boolean) {
  return `w-full rounded-lg border ${
    hasError ? "border-red-500" : "border-gray-300"
  } bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D6FE8]/30 focus:border-[#1D6FE8] transition-colors`;
}
