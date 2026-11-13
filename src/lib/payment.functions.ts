import { createServerFn } from "@tanstack/react-start";

/**
 * Le paiement obligatoire ne s'active que si le site peut réellement remettre
 * l'annonce en ligne après paiement : webhook Stripe configuré ET fonction SQL
 * activate_paid_event installée dans la base. Sinon, publication directe
 * (ancien fonctionnement) pour ne jamais bloquer une annonce.
 */
export const getPaymentConfig = createServerFn({ method: "GET" }).handler(async () => {
  if (!process.env.STRIPE_WEBHOOK_SECRET) return { gateEnabled: false };
  const { isActivationInstalled } = await import("./activation.server");
  return { gateEnabled: await isActivationInstalled() };
});
