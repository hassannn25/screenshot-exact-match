import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Move3d } from "lucide-react";
import { toast } from "sonner";
import { FEATURED_SLUG, getProduct } from "@/data/products";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Sneaker3DStage } from "./Sneaker3DStage";
import type { Hotspot, SneakerVariant } from "./Sneaker3D";
import { Reveal, SectionLabel } from "./Reveal";
import { AddedBurst } from "./AddedBurst";
import { cn } from "@/lib/utils";

const VARIANT_BY_COLOR: Record<string, SneakerVariant> = { Midnight: "midnight", Sand: "beach", Street: "street" };

const HOTSPOTS: Hotspot[] = [
  { id: "upper", title: "Layered upper", copy: "Suede overlays on breathable mesh — structure where you need it, air where you don't.", position: [0.06, 0.085, 0.04] },
  { id: "collar", title: "Padded collar", copy: "A sculpted, cushioned heel collar locks you in without pressure.", position: [-0.12, 0.12, 0.0] },
  { id: "sole", title: "Dual-density midsole", copy: "Soft underfoot, stable at the edges. Built for full days on concrete.", position: [-0.02, 0.018, 0.062] },
];

export function FeaturedProduct() {
  const product = getProduct(FEATURED_SLUG)!;
  const { addToCart, setCartOpen } = useStore();
  const [color, setColor] = useState(product.colors[0].name);
  const [size, setSize] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [added, setAdded] = useState(false);
  const [hotspot, setHotspot] = useState<string | null>(null);
  const active = HOTSPOTS.find((h) => h.id === hotspot);

  const add = () => {
    if (!size) {
      setError(true);
      return;
    }
    addToCart(product.slug, size, color);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
    toast.success(`${product.name} added`, {
      description: `${color} · ${size}`,
      action: { label: "View bag", onClick: () => setCartOpen(true) },
    });
  };

  return (
    <section className="relative overflow-hidden bg-ink py-24 md:py-36">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <Reveal>
          <SectionLabel index="02">Featured — 3D Showcase</SectionLabel>
          <h2 className="display mt-6 text-6xl md:text-9xl">
            Engineered for <span className="text-silver">expression.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          {/* Stage */}
          <Reveal className="relative">
            <div className="bg-spot relative aspect-[4/3] overflow-hidden rounded-md border border-border md:aspect-[16/11]">
              <p className="display pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center text-[22vw] text-outline lg:text-[13vw]" aria-hidden>
                PHANTOM
              </p>
              <Sneaker3DStage
                mode="showcase"
                variant={VARIANT_BY_COLOR[color]}
                hotspots={HOTSPOTS}
                activeHotspot={hotspot}
                onHotspot={setHotspot}
                fallback={
                  <div className="grid h-full w-full place-items-center">
                    <img src={product.images[0]} alt={product.name} loading="lazy" className="h-[85%] w-auto object-contain" />
                  </div>
                }
              />
              <div className="label pointer-events-none absolute left-4 top-4 flex items-center gap-2 text-muted-foreground">
                <Move3d className="size-4" /> Drag to rotate · tap the points
              </div>
              <AnimatePresence>
                {active && (
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    className="glass absolute bottom-4 left-4 right-4 rounded-md p-4 md:right-auto md:max-w-xs"
                  >
                    <p className="label text-signal">{active.title}</p>
                    <p className="mt-2 text-sm text-foreground/85">{active.copy}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>

          {/* Info */}
          <Reveal delay={0.1} className="flex flex-col justify-center">
            <p className="label text-muted-foreground">Footwear · Limited edition</p>
            <h3 className="display-wide mt-3 text-3xl">{product.name}</h3>
            <p className="mt-2 font-mono text-xl">{formatPrice(product.price)}</p>
            <p className="mt-6 max-w-md text-muted-foreground">{product.description}</p>

            <div className="mt-8">
              <p className="label mb-3 text-muted-foreground">
                Color — <span className="text-foreground">{color}</span>
              </p>
              <div className="flex gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setColor(c.name)}
                    aria-label={c.name}
                    aria-pressed={color === c.name}
                    className={cn(
                      "size-10 rounded-full ring-1 ring-offset-4 ring-offset-ink transition-all",
                      color === c.name ? "ring-foreground" : "ring-foreground/20 hover:ring-foreground/60",
                    )}
                    style={{ background: c.swatch }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-8">
              <p className="label mb-3 text-muted-foreground">Size</p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-3 xl:grid-cols-6">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={size === s}
                    onClick={() => {
                      setSize(s);
                      setError(false);
                    }}
                    className={cn(
                      "label rounded-sm border py-3 transition-colors",
                      size === s ? "border-foreground bg-foreground text-background" : "border-foreground/15 hover:border-foreground/60",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {error && <p className="mt-3 text-sm text-destructive" role="alert">Please select a size.</p>}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="hero" size="xl" className="relative flex-1 overflow-hidden" onClick={add}>
                Add to bag — {formatPrice(product.price)}
                <AddedBurst show={added} />
              </Button>
              <Button variant="line" size="xl" asChild>
                <Link to="/product/$slug" params={{ slug: product.slug }}>Details</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
