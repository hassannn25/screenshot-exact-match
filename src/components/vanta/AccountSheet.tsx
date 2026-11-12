import { Link } from "@tanstack/react-router";
import { Heart, Package } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { getProduct } from "@/data/products";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/pricing";
import { Wordmark } from "./Wordmark";

export function AccountSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { wishlist, toggleWishlist, lastOrder } = useStore();
  const items = wishlist.map(getProduct).filter((p) => !!p);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto border-border bg-surface sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-left">
            <Wordmark className="text-base" /> <span className="label ml-2 text-muted-foreground">Member</span>
          </SheetTitle>
          <SheetDescription className="text-left text-sm text-muted-foreground">
            Your wishlist and recent demo orders, saved on this device.
          </SheetDescription>
        </SheetHeader>

        <section className="mt-8">
          <h3 className="label mb-4 flex items-center gap-2 text-muted-foreground">
            <Package className="size-3.5" /> Last order
          </h3>
          {lastOrder ? (
            <div className="rounded-md border border-border p-4">
              <p className="font-mono text-sm">{lastOrder.reference}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {lastOrder.items} {lastOrder.items === 1 ? "item" : "items"} · {formatPrice(lastOrder.total)} ·{" "}
                {new Date(lastOrder.placedAt).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          )}
        </section>

        <section className="mt-10">
          <h3 className="label mb-4 flex items-center gap-2 text-muted-foreground">
            <Heart className="size-3.5" /> Wishlist ({items.length})
          </h3>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Tap the heart on any product to save it here.</p>
          ) : (
            <ul className="space-y-3">
              {items.map((p) => (
                <li key={p.id} className="flex items-center gap-4">
                  <Link to="/product/$slug" params={{ slug: p.slug }} onClick={() => onOpenChange(false)} className="flex flex-1 items-center gap-4">
                    <img src={p.images[0]} alt="" width={48} height={60} className="h-15 w-12 rounded-sm object-cover" />
                    <span className="min-w-0">
                      <span className="display-wide block text-xs">{p.name}</span>
                      <span className="font-mono text-xs text-muted-foreground">{formatPrice(p.price)}</span>
                    </span>
                  </Link>
                  <button type="button" onClick={() => toggleWishlist(p.slug)} className="label text-muted-foreground hover:text-foreground">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </SheetContent>
    </Sheet>
  );
}
