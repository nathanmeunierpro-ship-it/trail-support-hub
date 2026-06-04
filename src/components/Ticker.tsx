const ITEMS = ["Trail", "Running", "Cyclosportive", "Triathlon", "Bénévole", "Renfort", "Signaleur", "Ravitaillement", "Vélo", "Passion", "Sport"];

export function Ticker() {
  const loop = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <div className="bg-card text-primary py-5 overflow-hidden border-y border-border">
      <div className="flex whitespace-nowrap animate-ticker w-max">
        {loop.map((t, i) => (
          <span key={i} className="mx-6 text-xl md:text-2xl font-bold uppercase tracking-wide font-display">
            {t} <span className="opacity-40 mx-2">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
