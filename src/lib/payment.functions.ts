import { createServerFn } from "@tanstack/react-start";

/**
 * Le paiement obligatoire n'est activé que si le serveur peut réellement
 * remettre l'annonce en ligne après paiement (webhook Stripe + accès admin
 * à la base). Sinon on garde l'ancien fonctionnement (publication directe)
 * pour ne jamais bloquer une annonce.
 */
export const getPaymentConfig = createServerFn({ method: "GET" }).handler(async () => {
  const gateEnabled =
    !!process.env.SUPABASE_SERVICE_ROLE_KEY && !!process.env.STRIPE_WEBHOOK_SECRET;
  return { gateEnabled };
});
