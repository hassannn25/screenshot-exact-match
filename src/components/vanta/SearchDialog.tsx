import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/pricing";

export function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return products.slice(0, 5);
    return products.filter((p) => `${p.name} ${p.category} ${p.colors.map((c) => c.name).join(" ")}`.toLowerCase().includes(term));
  }, [q]);

  const go = (slug: string) => {
    onOpenChange(false);
    setQ("");
    navigate({ to: "/product/$slug", params: { slug } });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="top-[20%] translate-y-0 gap-0 overflow-hidden border-border bg-surface p-0 sm:max-w-xl">
        <DialogTitle className="sr-only">Search products</DialogTitle>
        <DialogDescription className="sr-only">Type to search the VANTA catalog</DialogDescription>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (results[0]) go(results[0].slug);
          }}
          className="flex items-center gap-3 border-b border-border px-5"
        >
          <Search className="size-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search hoodies, runners, bags…"
            aria-label="Search products"
            className="h-14 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </form>
        <div className="max-h-[50vh] overflow-y-auto p-2">
          <p className="label px-3 py-2 text-muted-foreground">{q ? `${results.length} results` : "Trending now"}</p>
          {results.length === 0 && <p className="px-3 py-6 text-sm text-muted-foreground">No products match “{q}”.</p>}
          {results.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => go(p.slug)}
              className="flex w-full items-center gap-4 rounded-sm px-3 py-2.5 text-left transition-colors hover:bg-accent"
            >
              <img src={p.images[0]} alt="" width={40} height={50} className="h-12 w-10 rounded-sm object-cover" />
              <span className="display-wide flex-1 text-xs">{p.name}</span>
              <span className="font-mono text-xs text-muted-foreground">{formatPrice(p.price)}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
