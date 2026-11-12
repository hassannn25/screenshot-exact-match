import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { products, allColors, MAX_PRICE } from "@/data/products";
import {
  FILTER_CATEGORIES,
  SORT_OPTIONS,
  filterProducts,
  type CatalogFilters,
} from "@/lib/catalog";
import { formatPrice } from "@/lib/pricing";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";

export const defaultFilters: CatalogFilters = {
  category: "all",
  sort: "featured",
  maxPrice: MAX_PRICE,
  colors: [],
};

interface CatalogProps {
  filters: CatalogFilters;
  onChange: (next: CatalogFilters) => void;
}

function CategoryPills({ filters, onChange, className }: CatalogProps & { className?: string }) {
  return (
    <div role="tablist" aria-label="Category" className={cn("flex gap-2", className)}>
      {FILTER_CATEGORIES.map((c) => {
        const active = filters.category === c.value;
        return (
          <button
            key={c.value}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange({ ...filters, category: c.value })}
            className={cn(
              "label relative shrink-0 rounded-full border px-4 py-2.5 transition-colors duration-300",
              active ? "border-foreground text-background" : "border-foreground/15 text-muted-foreground hover:border-foreground/50 hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="cat-pill"
                className="absolute inset-0 rounded-full bg-foreground"
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              />
            )}
            <span className="relative">{c.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function Refinements({ filters, onChange }: CatalogProps) {
  return (
    <div className="space-y-8">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <span className="label text-muted-foreground">Max price</span>
          <span className="font-mono text-sm">{formatPrice(filters.maxPrice)}</span>
        </div>
        <Slider
          min={40}
          max={MAX_PRICE}
          step={5}
          value={[filters.maxPrice]}
          onValueChange={([v]) => onChange({ ...filters, maxPrice: v ?? MAX_PRICE })}
          aria-label="Maximum price"
        />
        <div className="label mt-2 flex justify-between text-muted-foreground">
          <span>$40</span>
          <span>{formatPrice(MAX_PRICE)}</span>
        </div>
      </div>
      <div>
        <span className="label mb-4 block text-muted-foreground">Color</span>
        <div className="flex flex-wrap gap-2">
          {allColors.map((c) => {
            const on = filters.colors.includes(c.name);
            return (
              <button
                key={c.name}
                type="button"
                aria-pressed={on}
                onClick={() =>
                  onChange({
                    ...filters,
                    colors: on ? filters.colors.filter((x) => x !== c.name) : [...filters.colors, c.name],
                  })
                }
                className={cn(
                  "label flex items-center gap-2 rounded-full border px-3 py-2 transition-colors",
                  on ? "border-foreground bg-foreground/10 text-foreground" : "border-foreground/15 text-muted-foreground hover:border-foreground/50",
                )}
              >
                <span className="size-3 rounded-full ring-1 ring-foreground/30" style={{ background: c.swatch }} />
                {c.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SortSelect({ filters, onChange }: CatalogProps) {
  return (
    <Select value={filters.sort} onValueChange={(v) => onChange({ ...filters, sort: v as CatalogFilters["sort"] })}>
      <SelectTrigger aria-label="Sort products" className="label h-10 w-[210px] text-[0.68rem] rounded-full border-foreground/15 bg-transparent px-4">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map((s) => (
          <SelectItem key={s.value} value={s.value} className="label">
            {s.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function Catalog({ filters, onChange }: CatalogProps) {
  const [drawer, setDrawer] = useState(false);
  const results = useMemo(() => filterProducts(products, filters), [filters]);
  const activeRefinements =
    (filters.maxPrice < MAX_PRICE ? 1 : 0) + filters.colors.length;
  const isDirty = activeRefinements > 0 || filters.category !== "all" || filters.sort !== "featured";

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-center lg:justify-between">
        <CategoryPills filters={filters} onChange={onChange} className="-mx-5 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-wrap lg:px-0 lg:pb-0" />
        <div className="flex items-center justify-between gap-3">
          <Button variant="line" size="pill" className="lg:hidden" onClick={() => setDrawer(true)}>
            <SlidersHorizontal /> Filters{activeRefinements ? ` (${activeRefinements})` : ""}
          </Button>
          <SortSelect filters={filters} onChange={onChange} />
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-8">
            <Refinements filters={filters} onChange={onChange} />
            {isDirty && (
              <button type="button" onClick={() => onChange(defaultFilters)} className="label flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <X className="size-3" /> Clear all
              </button>
            )}
          </div>
        </aside>

        <div>
          <p className="label mb-6 text-muted-foreground" aria-live="polite">
            {results.length} {results.length === 1 ? "product" : "products"}
          </p>
          {results.length === 0 ? (
            <div className="grid place-items-center rounded-md border border-dashed border-border py-24 text-center">
              <p className="display text-4xl">Nothing here. Yet.</p>
              <p className="mt-3 text-sm text-muted-foreground">No products match these filters.</p>
              <Button variant="line" size="pill" className="mt-6" onClick={() => onChange(defaultFilters)}>
                Reset filters
              </Button>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {results.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      <Sheet open={drawer} onOpenChange={setDrawer}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-xl border-border bg-surface">
          <SheetHeader>
            <SheetTitle className="display-wide text-left text-lg">Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-8">
            <div>
              <span className="label mb-4 block text-muted-foreground">Sort</span>
              <SortSelect filters={filters} onChange={onChange} />
            </div>
            <Refinements filters={filters} onChange={onChange} />
            <div className="flex gap-3 pt-2">
              <Button variant="line" size="pill" className="flex-1" onClick={() => onChange(defaultFilters)}>
                Clear
              </Button>
              <Button variant="hero" size="pill" className="flex-1" onClick={() => setDrawer(false)}>
                Show {results.length}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
