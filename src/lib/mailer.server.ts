import process from "node:process";

/**
 * Envoi d'e-mails côté serveur (Resend via la passerelle Lovable).
 *
 * IMPORTANT : tant que l'expéditeur est "onboarding@resend.dev", Resend ne
 * délivre QUE vers l'adresse du compte Resend. Pour écrire aux organisateurs
 * et bénévoles, vérifier le domaine ravito.fr dans Resend puis définir la
 * variable d'environnement EMAIL_FROM, ex. "Ravito <contact@ravito.fr>".
 */
export const ADMIN_EMAIL = "nathanmeunierpro@gmail.com";
const SITE = "https://ravito.fr";

export interface Mail {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendMail(mail: Mail): Promise<boolean> {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  if (!lovableKey || !resendKey) {
    console.error("[mail] clés manquantes", { hasLovable: !!lovableKey, hasResend: !!resendKey });
    return false;
  }
  const from = process.env.EMAIL_FROM || "Ravito <onboarding@resend.dev>";
  try {
    const res = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": resendKey,
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(mail.to) ? mail.to : [mail.to],
        subject: mail.subject,
        html: mail.html,
        reply_to: mail.replyTo,
      }),
    });
    if (!res.ok) {
      console.error("[mail] erreur passerelle", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (e) {
    console.error("[mail] échec envoi", e);
    return false;
  }
}

export function esc(s: unknown) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

/** Tableau clé / valeur (valeurs échappées, lignes vides ignorées). */
export function table(fields: Record<string, string | number | null | undefined>) {
  const rows = Object.entries(fields)
    .filter(([, v]) => v != null && String(v).trim() !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:10px 14px;background:#F2FAE8;font-weight:600;width:40%;border-bottom:1px solid #fff">${esc(k)}</td><td style="padding:10px 14px;border-bottom:1px solid #F2FAE8">${esc(v)}</td></tr>`,
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse;border-radius:12px;overflow:hidden;font-size:14px;margin:16px 0">${rows}</table>`;
}

export function button(label: string, href: string) {
  return `<p style="margin:28px 0"><a href="${esc(href)}" style="background:#73CC30;color:#1A1A1A;padding:14px 26px;border-radius:999px;text-decoration:none;font-weight:700;display:inline-block;text-transform:uppercase;letter-spacing:.05em;font-size:13px">${esc(label)}</a></p>`;
}

/** Gabarit HTML aux couleurs Ravito. `body` doit déjà être échappé. */
export function layout(title: string, body: string) {
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#f0f7e6;padding:24px 12px;font-family:Inter,Arial,sans-serif;color:#1A1A1A">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden">
    <div style="background:#1A1A1A;padding:22px 28px"><a href="${SITE}" style="color:#73CC30;font-size:26px;font-weight:900;letter-spacing:.04em;text-decoration:none">RAVITO</a></div>
    <div style="padding:28px">
      <h1 style="font-size:22px;line-height:1.3;margin:0 0 16px">${esc(title)}</h1>
      <div style="font-size:15px;line-height:1.6;color:#333">${body}</div>
    </div>
    <div style="padding:18px 28px;background:#F2FAE8;font-size:12px;color:#666">
      Ravito — bénévoles et organisateurs d'événements sportifs en France · <a href="${SITE}" style="color:#3d6e1a">ravito.fr</a>
    </div>
  </div></body></html>`;
}

export const siteUrl = (path: string) => `${SITE}${path}`;
