import { createFileRoute } from "@tanstack/react-router";
import { fetchUpcomingEvents } from "@/lib/events";
import { SITE_URL } from "@/lib/site";

/** Sitemap dynamique : pages fixes + toutes les courses à venir (les courses passées en sortent automatiquement). */
const STATIC_PAGES: { path: string; freq: string; priority: string }[] = [
  { path: "/", freq: "daily", priority: "1.0" },
  { path: "/annonces", freq: "daily", priority: "0.9" },
  { path: "/benevoles", freq: "monthly", priority: "0.7" },
  { path: "/organisateurs/comment-ca-marche", freq: "monthly", priority: "0.7" },
  { path: "/organisateurs/nos-offres", freq: "monthly", priority: "0.8" },
  { path: "/qui-sommes-nous", freq: "monthly", priority: "0.5" },
  { path: "/cgu", freq: "yearly", priority: "0.2" },
  { path: "/mentions-legales", freq: "yearly", priority: "0.2" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const events = await fetchUpcomingEvents();
        const urls = [
          ...STATIC_PAGES.map(
            (p) =>
              `<url><loc>${SITE_URL}${p.path}</loc><changefreq>${p.freq}</changefreq><priority>${p.priority}</priority></url>`,
          ),
          ...events.map(
            (e) =>
              `<url><loc>${SITE_URL}/annonce/${e.id}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`,
          ),
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
