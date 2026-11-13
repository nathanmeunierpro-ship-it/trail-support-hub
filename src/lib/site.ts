/**
 * Configuration centrale du site (SEO, tarifs, liens).
 * Modifier ici pour que le changement s'applique partout.
 */
export const SITE_URL = "https://ravito.fr";
export const SITE_NAME = "Ravito";
export const DEFAULT_OG_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/QskU7NuD1QMJFvtudcEZBTvsPfR2/social-images/social-1780997538956-IMG_1008.webp";

/** Prix du Pack Organisateur (une annonce, tout compris). */
export const PRIX_ANNONCE = "29,99 €";
export const PRIX_ANNONCE_NUM = 29.99;

/** Nombre de bénévoles inscrits mis en avant sur le site. */
export const NB_BENEVOLES = "200";
export const NB_BENEVOLES_LABEL = "Plus de 200 bénévoles inscrits en France";

/** Lien de paiement Stripe du Pack Organisateur (29,99 €). */
export const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/dRmdR9dcG6O41USf5dgrS01";

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
