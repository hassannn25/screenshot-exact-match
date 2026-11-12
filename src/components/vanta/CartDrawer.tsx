import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { getProduct, imageFor } from "@/data/products";
import { useStore } from "@/lib/store";
import { FREE_SHIPPING_THRESHOLD, formatPrice } from "@/lib/pricing";

export function CartDrawer() {
  const { cartOpen, setCartOpen, lines, setQuantity, removeLine, totals, count } = useStore();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - totals.subtotal);

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 border-border bg-surface p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-6 py-5">
          <SheetTitle className="display-wide text-left text-base">
            Your bag <span className="font-mono text-muted-foreground">({count})</span>
          </SheetTitle>
          <SheetDescription className="sr-only">Review the items in your shopping bag</SheetDescription>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="grid size-20 place-items-center rounded-full border border-border">
              <ShoppingBag className="size-7 text-muted-foreground" />
            </div>
            <p className="display mt-6 text-4xl">Your bag is empty.</p>
            <p className="mt-3 text-sm text-muted-foreground">The next drop is waiting for you.</p>
            <Button variant="hero" size="xl" className="mt-8" asChild>
              <Link to="/shop" onClick={() => setCartOpen(false)}>
                Continue shopping
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="border-b border-border px-6 py-4">
              <p className="label text-muted-foreground">
                {remaining > 0 ? (
                  <>
                    You're <span className="text-foreground">{formatPrice(remaining)}</span> from free shipping
                  </>
                ) : (
                  <span className="text-success">Free shipping unlocked</span>
                )}
              </p>
              <div className="mt-2 h-px w-full bg-border">
                <motion.div
                  className="h-px bg-signal"
                  animate={{ width: `${Math.min(100, (totals.subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-6">
              <AnimatePresence initial={false}>
                {lines.map((line) => {
                  const p = getProduct(line.slug);
                  if (!p) return null;
                  return (
                    <motion.li
                      key={line.key}
                      layout
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 30, height: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="flex gap-4 py-5"
                    >
                      <Link
                        to="/product/$slug"
                        params={{ slug: p.slug }}
                        onClick={() => setCartOpen(false)}
                        className="block h-28 w-22 shrink-0 overflow-hidden rounded-sm bg-background"
                      >
                        <img src={imageFor(p, line.color)} alt={p.name} width={88} height={112} className="h-full w-full object-cover" />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="display-wide text-xs leading-snug">{p.name}</h3>
                          <p className="font-mono text-sm">{formatPrice(p.price * line.quantity)}</p>
                        </div>
                        <p className="label mt-1.5 text-muted-foreground">
                          {line.color} · {line.size}
                        </p>
                        <p className="label mt-1 text-muted-foreground">{formatPrice(p.price)} each</p>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex items-center rounded-full border border-border">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() => setQuantity(line.key, line.quantity - 1)}
                              className="grid size-8 place-items-center hover:text-signal"
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="w-6 text-center font-mono text-xs" aria-live="polite">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() => setQuantity(line.key, line.quantity + 1)}
                              disabled={line.quantity >= 10}
                              className="grid size-8 place-items-center hover:text-signal disabled:opacity-30"
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeLine(line.key)}
                            className="label flex items-center gap-1.5 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="size-3.5" /> Remove
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
            <div className="space-y-3 border-t border-border bg-background/40 px-6 py-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono">{formatPrice(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping estimate</span>
                <span className="font-mono">{totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3">
                <span className="display-wide text-sm">Total</span>
                <span className="font-mono text-lg">{formatPrice(totals.total)}</span>
              </div>
              <Button variant="hero" size="xl" className="mt-2 w-full" asChild>
                <Link to="/checkout" onClick={() => setCartOpen(false)}>
                  Checkout
                </Link>
              </Button>
              <button type="button" onClick={() => setCartOpen(false)} className="label w-full py-2 text-muted-foreground hover:text-foreground">
                Continue shopping
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
