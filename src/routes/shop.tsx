import { createFileRoute } from "@tanstack/react-router";
import { Catalog, defaultFilters } from "@/components/vanta/Catalog";
import { FILTER_CATEGORIES, isFilterCategory, isSortOption, type CatalogFilters, type FilterCategory, type SortOption } from "@/lib/catalog";
import { MAX_PRICE } from "@/data/products";

interface ShopSearch {
  category?: FilterCategory | undefined;
  sort?: SortOption | undefined;
  max?: number | undefined;
  colors?: string | undefined;
}

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): ShopSearch => ({
    category: isFilterCategory(s["category"]) ? s["category"] : undefined,
    sort: isSortOption(s["sort"]) ? s["sort"] : undefined,
    max: typeof s["max"] === "number" && s["max"] >= 40 && s["max"] < MAX_PRICE ? s["max"] : undefined,
    colors: typeof s["colors"] === "string" && s["colors"] ? s["colors"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop All — VANTA" },
      { name: "description", content: "Shop the full VANTA catalog: clothing, footwear and accessories. Filter by category, price and color." },
      { property: "og:title", content: "Shop All — VANTA" },
      { property: "og:description", content: "Shop VANTA clothing, footwear and accessories." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shop,
});

function Shop() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const filters: CatalogFilters = {
    category: search.category ?? defaultFilters["category"],
    sort: search.sort ?? defaultFilters["sort"],
    maxPrice: search.max ?? MAX_PRICE,
    colors: search.colors ? search.colors.split(",") : [],
  };
  const title = FILTER_CATEGORIES.find((c) => c.value === filters["category"])?.label ?? "All Products";

  const onChange = (f: CatalogFilters) =>
    navigate({
      search: {
        category: f.category === "all" ? undefined : f.category,
        sort: f.sort === "featured" ? undefined : f.sort,
        max: f.maxPrice < MAX_PRICE ? f.maxPrice : undefined,
        colors: f.colors.length ? f.colors.join(",") : undefined,
      },
      replace: true,
      resetScroll: false,
    });

  return (
    <div className="mx-auto max-w-[1600px] px-5 pb-24 pt-32 md:px-10 md:pt-40">
      <p className="label text-muted-foreground">VANTA® / Shop</p>
      <h1 className="display mt-4 text-7xl md:text-[9rem]">{filters["sort"] === "newest" && filters["category"] === "all" ? "New Arrivals" : title}</h1>
      <div className="mt-12">
        <Catalog filters={filters} onChange={onChange} />
      </div>
    </div>
  );
}
