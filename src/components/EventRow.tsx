import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MapPin, Calendar, ArrowRight } from "lucide-react";

export interface EventRowData {
  id: string; nom: string; ville: string; region?: string; date: string; type_sport: string;
}

export function EventRow({ ev }: { ev: EventRowData }) {
  const dateFmt = new Date(ev.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  return (
    <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.15 }}>
      <Link
        to="/annonce/$id"
        params={{ id: ev.id }}
        className="group flex items-center gap-4 border-b border-border py-5 px-2 hover:bg-muted/50 transition-colors rounded-lg"
      >
        <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-full bg-primary text-primary-foreground flex-shrink-0">
          {ev.type_sport}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg font-black text-foreground group-hover:text-primary transition-colors truncate">{ev.nom}</h3>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mt-0.5">
            <span className="flex items-center gap-1"><MapPin size={12} className="text-primary" /> {ev.ville}</span>
            <span className="flex items-center gap-1"><Calendar size={12} className="text-primary" /> {dateFmt}</span>
          </div>
        </div>
        <span className="flex-shrink-0 flex items-center gap-1 text-sm font-bold text-primary group-hover:gap-2 transition-all">
          Voir <ArrowRight size={15} />
        </span>
      </Link>
    </motion.div>
  );
}
