import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SendEmailSchema = z.object({
  subject: z.string().min(1).max(300),
  html: z.string().min(1).max(100_000),
  replyTo: z.string().email().optional(),
});

const DEFAULT_TO = "nathanmeunierpro@gmail.com";

export const sendEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => SendEmailSchema.parse(data))
  .handler(async ({ data }) => {
    const { sendMail } = await import("./mailer.server");
    const ok = await sendMail({
      to: DEFAULT_TO,
      subject: data.subject,
      html: data.html,
      replyTo: data.replyTo,
    });
    return ok ? { ok: true as const } : { ok: false, error: "send_failed" as const };
  });

function esc(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

export function htmlBlock(title: string, fields: Record<string, string | undefined | null>) {
  const rows = Object.entries(fields)
    .filter(([, v]) => v != null && String(v).trim() !== "")
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600">${esc(k)}</td><td style="padding:8px 12px">${esc(String(v))}</td></tr>`,
    )
    .join("");
  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#ffffff">
    <h1 style="color:#1A1A1A;font-size:22px;margin:0 0 16px">${esc(title)}</h1>
    <table style="width:100%;border-collapse:collapse;border:1px solid #eee;border-radius:8px;overflow:hidden">${rows}</table>
    <p style="color:#888;font-size:12px;margin-top:24px">Email automatique — Ravito</p>
  </div>`;
}
