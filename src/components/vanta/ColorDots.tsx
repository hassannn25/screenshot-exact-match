import type { ProductColor } from "@/data/products";
import { cn } from "@/lib/utils";

export function ColorDots({ colors, className }: { colors: ProductColor[]; className?: string }) {
  return (
    <div className={cn("flex items-center gap-1.5", className)} aria-label={`Colors: ${colors.map((c) => c.name).join(", ")}`}>
      {colors.map((c) => (
        <span
          key={c.name}
          title={c.name}
          className="size-2.5 rounded-full ring-1 ring-foreground/25"
          style={{ background: c.swatch }}
        />
      ))}
    </div>
  );
}
