const ITEMS = ["Trail", "Running", "Vélo", "Triathlon", "Cyclosportive", "Bénévoles", "Ravito"];

export function Ticker() {
  const loop = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <div className="bg-secondary text-primary py-4 overflow-hidden">
      <div className="flex whitespace-nowrap animate-ticker w-max">
        {loop.map((t, i) => (
          <span key={i} className="mx-5 text-xl md:text-2xl font-black uppercase tracking-wide font-display">
            {t} <span className="mx-3">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
