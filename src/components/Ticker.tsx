const ITEMS = ["Trail", "Running", "Vélo", "Triathlon", "Cyclosportive", "Bénévoles", "Ravito"];

export function Ticker() {
  const loop = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <div className="py-4 overflow-hidden" style={{ background: "#73CC30" }}>
      <div className="flex whitespace-nowrap animate-ticker w-max">
        {loop.map((t, i) => (
          <span
            key={i}
            className="mx-5 text-xl md:text-2xl uppercase tracking-wide font-display"
            style={{ color: "#FFFFFF", fontWeight: 600 }}
          >
            {t} <span className="mx-3">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
