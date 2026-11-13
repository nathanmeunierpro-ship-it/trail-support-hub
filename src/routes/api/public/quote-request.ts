import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const QuoteSchema = z.object({
  offer: z.string().trim().min(1).max(120),
  organisation: z.string().trim().max(200).optional().default(""),
  responsable: z.string().trim().max(120).optional().default(""),
  email: z.string().trim().email().max(255),
  telephone: z.string().trim().max(40).optional().default(""),
  evenement: z.string().trim().min(1).max(200),
  sport: z.string().trim().max(80),
  date: z.string().trim().max(40),
  ville: z.string().trim().min(1).max(120),
  benevoles: z.string().trim().max(20),
  message: z.string().trim().max(2000).optional().default(""),
});

function esc(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

export const Route = createFileRoute("/api/public/quote-request")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return new Response("Bad request", { status: 400 });
        }

        const parsed = QuoteSchema.safeParse(payload);
        if (!parsed.success) {
          return Response.json({ ok: false, error: "invalid_input" }, { status: 400 });
        }
        const d = parsed.data;

        const rows = (
          Object.entries({
            Offre: d.offer,
            Organisation: d.organisation,
            Responsable: d.responsable,
            Email: d.email,
            Téléphone: d.telephone,
            Événement: d.evenement,
            Sport: d.sport,
            Date: d.date,
            Ville: d.ville,
            "Bénévoles recherchés": d.benevoles,
            Message: d.message,
          }) as [string, string][]
        )
          .filter(([, v]) => v && v.trim() !== "")
          .map(
            ([k, v]) =>
              `<tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600">${esc(k)}</td><td style="padding:8px 12px">${esc(v)}</td></tr>`,
          )
          .join("");

        const html = `
          <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#fff">
            <h1 style="color:#1A1A1A;font-size:22px;margin:0 0 16px">Nouvelle demande de devis Ravito — ${esc(d.offer)}</h1>
            <table style="width:100%;border-collapse:collapse;border:1px solid #eee;border-radius:8px;overflow:hidden">${rows}</table>
            <p style="color:#888;font-size:12px;margin-top:24px">Email automatique — Ravito</p>
          </div>`;

        const { sendMail, ADMIN_EMAIL } = await import("@/lib/mailer.server");
        const ok = await sendMail({
          to: ADMIN_EMAIL,
          subject: `Nouvelle demande de devis Ravito — ${d.responsable || d.organisation || d.evenement}`,
          html,
          replyTo: d.email,
        });
        if (!ok) return Response.json({ ok: false, error: "send_failed" }, { status: 502 });
        return Response.json({ ok: true });
      },
    },
  },
});
