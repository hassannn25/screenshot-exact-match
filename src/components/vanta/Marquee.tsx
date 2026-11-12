const words = ["Free shipping over $150", "New season SS—26", "Phantom 01 — limited", "30-day returns", "Designed to stand apart"];

export function Marquee() {
  const row = (
    <div className="flex shrink-0 items-center">
      {words.map((w) => (
        <span key={w} className="label flex items-center gap-8 px-8 text-muted-foreground">
          {w} <span className="text-signal">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="overflow-hidden border-y border-border bg-background py-4" aria-label="Store highlights">
      <div className="flex w-max animate-marquee">
        {row}
        {row}
        {row}
        {row}
      </div>
    </div>
  );
}
