import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Plus, X } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/pricing";
import { ColorDots } from "./ColorDots";
import { cn } from "@/lib/utils";

const categoryLabel = { clothing: "Clothing", footwear: "Footwear", accessories: "Accessories" };

export function ProductCard({ product, index = 0, eager = false }: { product: Product; index?: number; eager?: boolean }) {
  const { addToCart, setCartOpen, wishlist, toggleWishlist } = useStore();
  const [quickOpen, setQuickOpen] = useState(false);
  const wished = wishlist.includes(product.slug);
  const [main, alt] = product.images;

  const quickAdd = (size: string) => {
    addToCart(product.slug, size, product.colors[0].name);
    setQuickOpen(false);
    toast.success(`${product.name} added`, {
      description: `${product.colors[0].name} · ${size}`,
      action: { label: "View bag", onClick: () => setCartOpen(true) },
    });
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.6, delay: Math.min(index, 8) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
      onMouseLeave={() => setQuickOpen(false)}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-surface">
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="absolute inset-0 block"
          aria-label={product.name}
        >
          <img
            src={main}
            alt={product.name}
            width={960}
            height={1200}
            loading={eager ? "eager" : "lazy"}
            className={cn(
              "h-full w-full object-cover transition-all duration-[1200ms] ease-expo group-hover:scale-[1.06]",
              alt && "group-hover:opacity-0",
            )}
          />
          {alt && (
            <img
              src={alt}
              alt=""
              aria-hidden
              width={960}
              height={1200}
              loading="lazy"
              className="absolute inset-0 h-full w-full scale-[1.08] object-cover opacity-0 transition-all duration-[1200ms] ease-expo group-hover:scale-100 group-hover:opacity-100"
            />
          )}
        </Link>

        {product.badge && (
          <span
            className={cn(
              "label pointer-events-none absolute left-3 top-3 rounded-full px-2.5 py-1",
              product.badge === "New" ? "bg-foreground text-background" : product.badge === "Limited" ? "bg-signal text-signal-foreground" : "glass text-foreground",
            )}
          >
            {product.badge}
          </span>
        )}

        <button
          type="button"
          onClick={() => {
            const added = toggleWishlist(product.slug);
            toast(added ? "Saved to wishlist" : "Removed from wishlist", { description: product.name });
          }}
          aria-pressed={wished}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className="glass absolute right-3 top-3 grid size-9 place-items-center rounded-full transition-transform duration-300 hover:scale-110"
        >
          <Heart className={cn("size-4 transition-colors", wished ? "fill-signal text-signal" : "text-foreground")} />
        </button>

        {/* Quick add */}
        <div className={cn("absolute inset-x-3 bottom-3 transition-all duration-500 ease-expo", !quickOpen && "md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus-within:translate-y-0 md:focus-within:opacity-100")}>
          <AnimatePresence mode="wait">
            {quickOpen ? (
              <motion.div
                key="sizes"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="glass rounded-md p-3"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="label text-muted-foreground">Select size</span>
                  <button type="button" onClick={() => setQuickOpen(false)} aria-label="Close quick add">
                    <X className="size-3.5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => quickAdd(s)}
                      className="label min-w-10 rounded-sm border border-foreground/20 px-2 py-1.5 transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
                    >
                      {s.replace("US ", "")}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.button
                key="cta"
                type="button"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                onClick={() => (product.sizes.length === 1 ? quickAdd(product.sizes[0]) : setQuickOpen(true))}
                className="glass label flex w-full items-center justify-center gap-2 rounded-full py-3 transition-colors duration-300 hover:bg-foreground hover:text-background"
              >
                <Plus className="size-3.5" /> Quick add
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Link to="/product/$slug" params={{ slug: product.slug }} className="mt-4 block">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="label text-muted-foreground">{categoryLabel[product.category]}</p>
            <h3 className="display-wide mt-1.5 overflow-hidden text-sm">
              <span className="block transition-transform duration-500 ease-expo group-hover:translate-x-1">
                {product.name}
              </span>
            </h3>
          </div>
          <p className="font-mono text-sm">{formatPrice(product.price)}</p>
        </div>
        <ColorDots colors={product.colors} className="mt-3" />
      </Link>
    </motion.article>
  );
}
