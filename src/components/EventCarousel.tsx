import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EventCarouselProps {
  children: React.ReactNode[];
}

export function EventCarousel({ children }: EventCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const touchStartX = useRef(0);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 768) setItemsPerPage(1);
      else if (w < 1024) setItemsPerPage(2);
      else setItemsPerPage(3);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const totalSlides = Math.max(1, Math.ceil(children.length / itemsPerPage));

  const scrollToPage = useCallback(
    (pageIndex: number) => {
      const clamped = Math.max(0, Math.min(pageIndex, totalSlides - 1));
      setCurrentIndex(clamped);
      const container = containerRef.current;
      if (!container) return;
      const itemIndex = clamped * itemsPerPage;
      const child = container.children[itemIndex] as HTMLElement | undefined;
      if (!child) return;
      const containerRect = container.getBoundingClientRect();
      const childRect = child.getBoundingClientRect();
      const scrollLeft = container.scrollLeft + (childRect.left - containerRect.left);
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    },
    [itemsPerPage, totalSlides]
  );

  useEffect(() => {
    if (isHovered || children.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % totalSlides;
        const container = containerRef.current;
        if (container) {
          const itemIndex = next * itemsPerPage;
          const child = container.children[itemIndex] as HTMLElement | undefined;
          if (child) {
            const containerRect = container.getBoundingClientRect();
            const childRect = child.getBoundingClientRect();
            const scrollLeft = container.scrollLeft + (childRect.left - containerRect.left);
            container.scrollTo({ left: scrollLeft, behavior: "smooth" });
          }
        }
        return next;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [isHovered, children.length, totalSlides, itemsPerPage]);

  const goPrev = () => scrollToPage(currentIndex - 1);
  const goNext = () => scrollToPage(currentIndex + 1);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) goNext();
    else if (diff < -50) goPrev();
  };

  if (children.length === 0) return null;

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style>{`
        .event-carousel::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div
        ref={containerRef}
        className="event-carousel flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {children.map((child, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[85%] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start"
          >
            {child}
          </div>
        ))}
      </div>

      <button
        onClick={goPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100"
        aria-label="Précédent"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={goNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100"
        aria-label="Suivant"
      >
        <ChevronRight size={20} />
      </button>

      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToPage(i)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? "bg-[var(--color-text)] w-6"
                : "bg-[var(--color-text)]/30 w-2.5"
            }`}
            aria-label={`Page ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
