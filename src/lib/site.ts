/**
 * Configuration centrale du site (SEO, tarifs, liens).
 * Modifier ici pour que le changement s'applique partout.
 */
export const SITE_URL = "https://ravito-benevoles.fr";
export const SITE_NAME = "Ravito";
export const DEFAULT_OG_IMAGE = "https://ravito-benevoles.fr/images/og-image.jpg";

/** Prix du Pack Organisateur (une annonce, tout compris). */
export const PRIX_ANNONCE = "29,99 €";
export const PRIX_ANNONCE_NUM = 29.99;
/**
 * Prix de référence affiché barré à côté du prix actuel (vide = rien de barré).
 * Pour passer à 25,99 € : PRIX_ANNONCE "25,99 €", PRIX_ANNONCE_NUM 25.99,
 * PRIX_BARRE "29,99 €", et mettre le nouveau lien Stripe ci-dessous.
 */
export const PRIX_BARRE: string = "";

/** Nombre de bénévoles inscrits mis en avant sur le site. */
export const NB_BENEVOLES = "200";
export const NB_BENEVOLES_LABEL = "Plus de 200 bénévoles inscrits en France";

/** Lien de paiement Stripe du Pack Organisateur (29,99 €). */
export const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/dRmdR9dcG6O41USf5dgrS01";

/** Identifiant du lien de paiement (sert à reconnaître les paiements Ravito dans Stripe). */
export const STRIPE_PAYMENT_LINK_ID = "plink_1UbHCWFdTBVhzLf1JQ2CmNdG";

/** Statut d'une annonce enregistrée mais pas encore payée (invisible sur le site). */
export const STATUT_ATTENTE_PAIEMENT = "en_attente_paiement";

/** Lien de paiement relié à une annonce précise (Stripe la remet en ligne après paiement). */
export function paymentUrl(eventId: string, email?: string | null) {
  const u = new URL(STRIPE_PAYMENT_LINK);
  u.searchParams.set("client_reference_id", eventId);
  if (email) u.searchParams.set("prefilled_email", email);
  return u.toString();
}

export const CONTACT_EMAIL = "nathanmeunierpro@gmail.com";

type MetaTag = Record<string, string>;
type LinkTag = Record<string, string>;

export interface SeoInput {
  title: string;
  description: string;
  /** Chemin canonique, ex. "/annonces". */
  path: string;
  image?: string | null;
  /** Empêche l'indexation (pages privées, formulaires…). */
  noindex?: boolean;
  type?: "website" | "article" | "event";
}

/** Génère les balises meta/link d'une page (title, description, canonical, Open Graph, Twitter). */
export function seo({ title, description, path, image, noindex, type = "website" }: SeoInput): {
  meta: MetaTag[];
  links: LinkTag[];
} {
  const url = `${SITE_URL}${path}`;
  const img = image || DEFAULT_OG_IMAGE;
  const meta: MetaTag[] = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: type === "event" ? "website" : type },
    { property: "og:image", content: img },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: img },
  ];
  if (noindex) meta.push({ name: "robots", content: "noindex, nofollow" });
  return { meta, links: noindex ? [] : [{ rel: "canonical", href: url }] };
}

/** Balises d'une page privée (espace membre, formulaires) : jamais indexée. */
export function privatePage(title: string) {
  return {
    meta: [{ title: `${title} | ${SITE_NAME}` }, { name: "robots", content: "noindex, nofollow" }],
  };
}

/** Script JSON-LD pour les données structurées Google. */
export function jsonLd(data: unknown) {
  return { type: "application/ld+json", children: JSON.stringify(data) };
}
