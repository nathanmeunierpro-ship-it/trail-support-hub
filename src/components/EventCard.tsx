import { Link } from "@tanstack/react-router";
import { MapPin, Users, Heart, Check, ArrowUpRight } from "lucide-react";
import { type PublicEvent, dateParts, eventImage } from "@/lib/events";

interface Props {
  ev: PublicEvent;
  /** Charge l'image en priorité (premières cartes visibles). */
  eager?: boolean;
  applied?: boolean;
  favori?: boolean;
  onToggleFavori?: () => void;
  favoriDisabled?: boolean;
}

export function EventCard({ ev, eager, applied, favori, onToggleFavori, favoriDisabled }: Props) {
  const d = dateParts(ev.date);
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl bg-card ring-1 ring-black/5 shadow-[0_2px_16px_rgba(26,26,26,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-12px_rgba(26,26,26,0.25)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={eventImage(ev)}
          alt={`${ev.nom} — ${ev.type_sport} à ${ev.ville}`}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          width={900}
          height={563}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Date block */}
        <div className="absolute left-4 top-4 flex w-14 flex-col items-center rounded-2xl bg-white py-1.5 text-[#1A1A1A] shadow-lg">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#4a8a1f]">
            {d.month}
          </span>
          <span className="font-display text-2xl leading-none">{d.day}</span>
          <span className="text-[10px] font-semibold uppercase text-black/50">{d.weekday}</span>
        </div>

        {onToggleFavori && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onToggleFavori();
            }}
            disabled={favoriDisabled}
            aria-label={favori ? "Retirer des favoris" : "Ajouter aux favoris"}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur transition hover:bg-white disabled:opacity-50"
          >
            <Heart
              size={18}
              className={favori ? "text-red-500" : "text-[#1A1A1A]"}
              fill={favori ? "currentColor" : "none"}
            />
          </button>
        )}

        <span className="absolute bottom-4 left-4 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A]">
          {ev.type_sport}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[1.6rem] leading-[1.05] text-foreground line-clamp-2">
          <Link
            to="/annonce/$id"
            params={{ id: ev.id }}
            className="after:absolute after:inset-0 focus:outline-none"
          >
            {ev.nom}
          </Link>
        </h3>
        <div className="mt-3 flex flex-col gap-1.5 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <MapPin size={14} className="shrink-0 text-[#4a8a1f]" />
            {ev.ville}
            {ev.region ? <span className="text-black/35">· {ev.region}</span> : null}
          </span>
          {ev.nb_benevoles ? (
            <span className="flex items-center gap-2">
              <Users size={14} className="shrink-0 text-[#4a8a1f]" />
              {ev.nb_benevoles} bénévole{ev.nb_benevoles > 1 ? "s" : ""} recherché
              {ev.nb_benevoles > 1 ? "s" : ""}
            </span>
          ) : null}
        </div>

        {ev.missions && ev.missions.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {ev.missions.slice(0, 3).map((m) => (
              <span
                key={m}
                className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-[#3d6e1a]"
              >
                {m}
              </span>
            ))}
            {ev.missions.length > 3 && (
              <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-black/50">
                +{ev.missions.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-5 text-sm font-bold">
          {applied ? (
            <span className="inline-flex items-center gap-1.5 text-[#3d6e1a]">
              <Check size={16} /> Candidature envoyée
            </span>
          ) : (
            <span className="text-foreground">Devenir bénévole</span>
          )}
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1A1A1A] text-white transition-transform group-hover:rotate-45">
            <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
    </article>
  );
}
