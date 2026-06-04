import { Link } from "@tanstack/react-router";

export interface EventRowData {
  id: string;
  nom: string;
  ville: string;
  region?: string;
  date: string;
  type_sport: string;
}

export function EventRow({ ev }: { ev: EventRowData }) {
  const dateFmt = new Date(ev.date).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "long", year: "numeric",
  });
  return (
    <Link
      to="/annonce/$id"
      params={{ id: ev.id }}
      className="group grid grid-cols-1 md:grid-cols-12 items-center gap-3 md:gap-6 border-b border-border py-6 px-2 hover:bg-muted transition-colors"
    >
      <div className="md:col-span-5">
        <h3 className="text-lg md:text-xl font-bold uppercase tracking-tight" style={{ fontFamily: '"Syne", sans-serif' }}>
          {ev.nom}
        </h3>
      </div>
      <div className="md:col-span-4 text-sm text-muted-foreground">{ev.ville} · {dateFmt}</div>
      <div className="md:col-span-2">
        <span className="inline-block text-xs font-semibold uppercase tracking-wider bg-primary text-primary-foreground px-3 py-1 rounded-full">
          {ev.type_sport}
        </span>
      </div>
      <div className="md:col-span-1 md:text-right">
        <span className="inline-block text-xs font-bold uppercase border border-foreground px-3 py-2 rounded-md group-hover:bg-foreground group-hover:text-background transition-colors">
          Je postule
        </span>
      </div>
    </Link>
  );
}
