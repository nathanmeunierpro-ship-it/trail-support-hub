import { useRef, useState, useEffect, Children, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EventCarouselProps {
  children: React.ReactNode[];
  interval?: number; // ms between auto-advances
}

export function EventCarousel({ children, interval = 5500 }: EventCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const indexRef = useRef(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const items = Children.toArray(children);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia("(max-width: 767px)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (items.length === 0) return null;

  const total = items.length;
  // Triple the items for seamless infinite loop
  const loop = [...items, ...items, ...items];

  const getStep = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 424;
    const first = track.children[total] as HTMLElement | undefined;
    const second = track.children[total + 1] as HTMLElement | undefined;
    if (first && second) {
      return second.offsetLeft - first.offsetLeft;
    }
    return 424;
  }, [total]);

  const moveTo = useCallback((newIndex: number, animate = true) => {
    const track = trackRef.current;
    if (!track) return;
    const step = getStep();
    track.style.transition = animate ? "transform 650ms ease-in-out" : "none";
    track.style.transform = `translateX(${-newIndex * step}px)`;
    indexRef.current = newIndex;
  }, [getStep]);

  const advance = useCallback((dir: 1 | -1) => {
    if (isMobile) return;
    const next = indexRef.current + dir;
    moveTo(next, true);
    setIsTransitioning(true);
  }, [moveTo, isMobile]);

  useEffect(() => {
    if (isMobile) return;
    const track = trackRef.current;
    if (!track) return;

    const onTransitionEnd = () => {
      setIsTransitioning(false);
      const current = indexRef.current;
      if (current >= total * 2) {
        moveTo(current - total, false);
      } else if (current < total) {
        moveTo(current + total, false);
      }
    };

    track.addEventListener("transitionend", onTransitionEnd);
    return () => track.removeEventListener("transitionend", onTransitionEnd);
  }, [total, moveTo, isMobile]);

  // Initialize to middle (original) set — desktop only
  useEffect(() => {
    if (isMobile) {
      // Reset any inline transform set by desktop logic
      const track = trackRef.current;
      if (track) {
        track.style.transition = "none";
        track.style.transform = "";
      }
      return;
    }
    moveTo(total, false);
  }, [total, moveTo, isMobile]);

  // Recalculate position on resize (desktop)
  useEffect(() => {
    if (isMobile) return;
    const handleResize = () => {
      moveTo(indexRef.current, false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [moveTo, isMobile]);

  // Auto-advance (desktop)
  useEffect(() => {
    if (isMobile || isPaused || isTransitioning) return;
    const id = setInterval(() => {
      advance(1);
    }, interval);
    return () => clearInterval(id);
  }, [isPaused, isTransitioning, interval, advance, isMobile]);

  // Swipe handling (desktop only — mobile uses continuous marquee)
  const touchStartX = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (isMobile) return;
    const diff = touchStartX.current - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      advance(diff > 0 ? 1 : -1);
    }
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <style>{`
        @keyframes event-carousel-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .event-carousel-marquee-track {
          animation: event-carousel-marquee 30s linear infinite;
        }
        .event-carousel-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div
        className="overflow-hidden"
        style={{ scrollbarWidth: "none" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          ref={trackRef}
          className={`flex gap-6 py-4 ${isMobile ? "event-carousel-marquee-track" : ""}`}
          style={{
            width: "max-content",
            willChange: "transform",
          }}
        >
          {(isMobile ? [...items, ...items] : loop).map((child, i) => (
            <div
              key={`item-${i}`}
              className="flex-shrink-0 w-[65vw] sm:w-[380px] md:w-[400px] lg:w-[420px] transition-transform duration-300 hover:scale-[1.02]"
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {!isMobile && (
        <>
          <button
            onClick={() => advance(-1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/95 backdrop-blur-sm shadow-xl border border-black/5 flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 z-10 opacity-0 group-hover:opacity-100"
            aria-label="Précédent"
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => advance(1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/95 backdrop-blur-sm shadow-xl border border-black/5 flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 z-10 opacity-0 group-hover:opacity-100"
            aria-label="Suivant"
          >
            <ChevronRight size={22} strokeWidth={2.5} />
          </button>
        </>
      )}
    </div>
  );
}
