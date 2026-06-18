import { useRef, useState, Children } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EventCarouselProps {
  children: React.ReactNode[];
  speed?: number; // seconds for one full loop
}

export function EventCarousel({ children, speed = 40 }: EventCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  const items = Children.toArray(children);
  if (items.length === 0) return null;

  // Duplicate items to create seamless infinite loop
  const loop = [...items, ...items];

  const nudge = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.children[0] as HTMLElement | undefined;
    const step = first ? first.offsetWidth + 24 : 320;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <style>{`
        @keyframes event-marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .event-marquee-track {
          animation: event-marquee linear infinite;
          width: max-content;
        }
        .event-carousel-mask {
          mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
        }
        .event-carousel-mask::-webkit-scrollbar { display: none; }
      `}</style>

      <div
        ref={trackRef}
        className="event-carousel-mask overflow-hidden"
        style={{ scrollbarWidth: "none" }}
      >
        <div
          className="event-marquee-track flex gap-6 py-4"
          style={{
            animationDuration: `${speed}s`,
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {loop.map((child, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[85vw] sm:w-[380px] md:w-[400px] lg:w-[420px] transition-transform duration-300 hover:scale-[1.02]"
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => nudge(-1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/95 backdrop-blur-sm shadow-xl border border-black/5 flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 z-10 opacity-0 group-hover:opacity-100"
        aria-label="Précédent"
      >
        <ChevronLeft size={22} strokeWidth={2.5} />
      </button>
      <button
        onClick={() => nudge(1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/95 backdrop-blur-sm shadow-xl border border-black/5 flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 z-10 opacity-0 group-hover:opacity-100"
        aria-label="Suivant"
      >
        <ChevronRight size={22} strokeWidth={2.5} />
      </button>
    </div>
  );
}
