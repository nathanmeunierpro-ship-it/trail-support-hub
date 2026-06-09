import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SendEmailSchema = z.object({
  subject: z.string().min(1).max(300),
  html: z.string().min(1).max(100_000),
  to: z.string().email().optional(),
  replyTo: z.string().email().optional(),
});

const DEFAULT_TO = "nathanmeunierpro@gmail.com";
const FROM = "Ravito <onboarding@resend.dev>";

export const sendEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => SendEmailSchema.parse(data))
  .handler(async ({ data }) => {
    const lovableKey = process.env.LOVABLE_API_KEY;
    const resendKey = process.env.RESEND_API_KEY;
    if (!lovableKey || !resendKey) {
      console.error("[sendEmail] missing keys", { hasLovable: !!lovableKey, hasResend: !!resendKey });
      return { ok: false, error: "email_not_configured" as const };
    }

    const res = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": resendKey,
      },
      body: JSON.stringify({
        from: FROM,
        to: [data.to ?? DEFAULT_TO],
        subject: data.subject,
        html: data.html,
        reply_to: data.replyTo,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[sendEmail] gateway error", res.status, body);
      return { ok: false, error: "gateway_error" as const };
    }
    return { ok: true as const };
  });

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export function htmlBlock(title: string, fields: Record<string, string | undefined | null>) {
  const rows = Object.entries(fields)
    .filter(([, v]) => v != null && String(v).trim() !== "")
    .map(([k, v]) => `<tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600">${esc(k)}</td><td style="padding:8px 12px">${esc(String(v))}</td></tr>`)
    .join("");
  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#ffffff">
    <h1 style="color:#1A1A1A;font-size:22px;margin:0 0 16px">${esc(title)}</h1>
    <table style="width:100%;border-collapse:collapse;border:1px solid #eee;border-radius:8px;overflow:hidden">${rows}</table>
    <p style="color:#888;font-size:12px;margin-top:24px">Email automatique — Ravito</p>
  </div>`;
}
