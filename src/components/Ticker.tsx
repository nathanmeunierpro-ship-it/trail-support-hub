const ITEMS = ["Trail", "Running", "Cyclo", "Triathlon", "Bénévole", "Renfort", "Sport", "Signaleur", "Ravitaillement"];

export function Ticker() {
  const loop = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <div className="bg-secondary text-secondary-foreground py-5 overflow-hidden">
      <div className="flex whitespace-nowrap animate-ticker w-max">
        {loop.map((t, i) => (
          <span key={i} className="mx-6 text-xl md:text-2xl font-bold uppercase tracking-wide" style={{ fontFamily: '"Syne", sans-serif' }}>
            {t} <span className="opacity-60 mx-2">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
