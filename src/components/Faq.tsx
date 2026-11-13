import { useState } from "react";
import { Plus } from "lucide-react";

export interface FaqItem {
  q: string;
  a: string;
}

/** Données structurées FAQPage (affichage enrichi dans Google). */
export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-black/10 rounded-3xl bg-muted/60 px-6 ring-1 ring-black/5 md:px-8">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q}>
            <h3 className="!font-sans">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-bold text-[#1A1A1A] md:text-lg"
              >
                {it.q}
                <Plus
                  size={20}
                  className={`shrink-0 text-[#3d6e1a] transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                />
              </button>
            </h3>
            {/* Le texte reste dans le HTML (lisible par Google) même replié. */}
            <div
              className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"}`}
            >
              <p className="overflow-hidden leading-relaxed text-black/65">{it.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
